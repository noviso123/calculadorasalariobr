import { CalculationResult, SalaryInput, ThirteenthInput, ThirteenthResult, TerminationInput, TerminationResult, ExtrasInput, ExtrasBreakdown, VacationInput, VacationResult, ConsignedInput, PjInput, PjResult, PjRegime, IrpfInput, IrpfResult, EmployerCost } from '../types';
import { INSS_BRACKETS, DEDUCTION_PER_DEPENDENT, FAMILY_SALARY_THRESHOLD, FAMILY_SALARY_VALUE, IRPF_BRACKETS, SIMPLIFIED_DISCOUNT_VALUE, IR_TRANSITION_FLOOR, IR_TRANSITION_CEILING, IR_TRANSITION_RATE } from '../config/taxConstants';


const roundHelper = (value: number): number => {
  return Math.round((value + 1e-9) * 100) / 100;
};

// ============================================================================
// IRPF UNIFICADO — Função central, usada por TODAS as telas.
// ============================================================================
// Recebe:
//   taxableBase:  base de cálculo final (já com INSS e dependentes descontados)
//   grossForTransition: rendimento BRUTO tributável (antes de INSS/dep) para
//                       avaliar se cai na faixa de transição 2026 (5k-7.35k)
//
// Lógica:
//   1. Se grossForTransition <= 5000 → isento
//   2. Se grossForTransition entre 5000.01 e 7350 → alíquota linear de transição
//   3. Acima de 7350 → melhor entre tabela progressiva LEGAL e SIMPLIFICADA
// ============================================================================
const calculateIrpfOnly = (taxableBase: number, grossForTransition: number): number => {
  // Caso 1: Isenção Total (regra 2026)
  if (grossForTransition <= IR_TRANSITION_FLOOR) {
    return 0;
  }

  // Caso 2: Faixa de Transição (5k - 7.35k)
  if (grossForTransition <= IR_TRANSITION_CEILING) {
    const excess = grossForTransition - IR_TRANSITION_FLOOR;
    const taxTransition = excess * IR_TRANSITION_RATE;
    return roundHelper(Math.max(0, taxTransition));
  }

  // Caso 3: Acima de 7.35k → Melhor entre Legal e Simplificado

  // 3a. Cálculo LEGAL (sobre taxableBase = bruto - INSS - dependentes)
  let taxLegal = 0;
  for (const bracket of IRPF_BRACKETS) {
    if (taxableBase <= bracket.limit) {
      taxLegal = (taxableBase * bracket.rate) - bracket.deduction;
      break;
    }
    if (bracket.limit === Infinity) {
      taxLegal = (taxableBase * bracket.rate) - bracket.deduction;
    }
  }
  taxLegal = Math.max(0, taxLegal);

  // 3b. Cálculo SIMPLIFICADO (Desconto Padrão R$ 564,80 sobre o bruto tributável)
  const baseSimplified = Math.max(0, grossForTransition - SIMPLIFIED_DISCOUNT_VALUE);
  let taxSimplified = 0;
  for (const bracket of IRPF_BRACKETS) {
    if (baseSimplified <= bracket.limit) {
      taxSimplified = (baseSimplified * bracket.rate) - bracket.deduction;
      break;
    }
    if (bracket.limit === Infinity) {
      taxSimplified = (baseSimplified * bracket.rate) - bracket.deduction;
    }
  }
  taxSimplified = Math.max(0, taxSimplified);

  return roundHelper(Math.min(taxLegal, taxSimplified));
};

// ============================================================================
// INSS PROGRESSIVO
// ============================================================================
const calculateInssOnly = (value: number): number => {
  let inss = 0;
  let previousLimit = 0;
  const maxLimit = INSS_BRACKETS[INSS_BRACKETS.length - 1].limit;

  if (value > maxLimit) {
    let accumulatedTax = 0;
    let prev = 0;
    for (const bracket of INSS_BRACKETS) {
      accumulatedTax += (bracket.limit - prev) * bracket.rate;
      prev = bracket.limit;
    }
    inss = accumulatedTax;
  } else {
    for (const bracket of INSS_BRACKETS) {
      if (value <= previousLimit) break;
      const currentLimit = bracket.limit;
      const rangeBase = Math.min(value, currentLimit) - previousLimit;
      if (rangeBase > 0) inss += rangeBase * bracket.rate;
      previousLimit = currentLimit;
    }
  }
  return roundHelper(inss);
};

// ============================================================================
// HORAS EXTRAS → VALOR MONETÁRIO
// ============================================================================
const calculateExtrasValue = (grossSalary: number, extras: ExtrasInput): ExtrasBreakdown => {
  if (!grossSalary) {
    return { value50: 0, value100: 0, valueNight: 0, valueStandby: 0, valueInterjornada: 0, valueDsr: 0, total: 0 };
  }

  const workloadDivisor = extras.workload > 0 ? extras.workload : 220;
  const hourlyRate = grossSalary / workloadDivisor;

  const val50 = hourlyRate * 1.5 * extras.hours50;
  const val100 = hourlyRate * 2.0 * extras.hours100;
  const valNight = hourlyRate * 0.2 * extras.hoursNight;
  const valStandby = hourlyRate * (1 / 3) * extras.hoursStandby;
  const valInterjornada = hourlyRate * 1.5 * (extras.hoursInterjornada || 0);

  const subtotal = val50 + val100 + valNight + valStandby + valInterjornada;

  let valDsr = 0;
  if (extras.includeDsr) {
    valDsr = subtotal * 0.20;
  }

  const total = subtotal + valDsr;

  return {
    value50: val50,
    value100: val100,
    valueNight: valNight,
    valueStandby: valStandby,
    valueInterjornada: valInterjornada,
    valueDsr: valDsr,
    total
  };
};

// ============================================================================
// CONSIGNADO — Margem e desconto
// ============================================================================
const calculateConsignedValues = (netBase: number, consigned: ConsignedInput, isActive: boolean) => {
  const totalLoanMargin = roundHelper(netBase * 0.35);
  const cardMargin = roundHelper(netBase * 0.05);

  if (!isActive || !consigned) {
    return {
      totalMargin: totalLoanMargin,
      availableMargin: totalLoanMargin,
      cardMargin,
      discount: 0
    };
  }

  const currentInstallment = consigned.monthlyInstallment || 0;
  const discount = Math.min(currentInstallment, totalLoanMargin);
  const availableMargin = Math.max(0, roundHelper(totalLoanMargin - discount));

  return {
    totalMargin: totalLoanMargin,
    availableMargin,
    cardMargin,
    discount: roundHelper(discount)
  };
};

// ============================================================================
// SALÁRIO LÍQUIDO MENSAL
// ============================================================================
export const calculateSalary = (data: SalaryInput): CalculationResult => {
  const {
    grossSalary,
    otherDiscounts,
    healthInsurance = 0,
    includeTransportVoucher,
    transportVoucherPercent,
    transportDailyCost = 0,
    workDays = 22,
    includeExtras,
    extras,
    includeConsigned,
    consigned,
    includeDependents,
    dependents
  } = data;

  // 1. Base Bruta
  let extrasBreakdown: ExtrasBreakdown = { value50: 0, value100: 0, valueNight: 0, valueStandby: 0, valueInterjornada: 0, valueDsr: 0, total: 0 };
  if (includeExtras && extras) {
    extrasBreakdown = calculateExtrasValue(grossSalary, extras);
  }
  const totalGrossForTax = grossSalary + extrasBreakdown.total;

  // 2. Descontos Obrigatórios
  const inss = calculateInssOnly(totalGrossForTax);
  const fgtsMonthly = roundHelper(totalGrossForTax * 0.08);

  // Base IR: Bruto - INSS - Dependentes
  const deductionVal = includeDependents ? (dependents * DEDUCTION_PER_DEPENDENT) : 0;
  const irBase = Math.max(0, totalGrossForTax - inss - deductionVal);

  // grossForTransition = bruto tributável ANTES de deduções (para regra 5k-7.35k)
  const irpf = calculateIrpfOnly(irBase, totalGrossForTax);

  let transportVoucher = 0;
  if (includeTransportVoucher) {
    const legalMaxDiscount = grossSalary * (transportVoucherPercent / 100);
    if (transportDailyCost > 0 && workDays > 0) {
      const realCost = transportDailyCost * workDays;
      transportVoucher = Math.min(legalMaxDiscount, realCost);
    } else {
      transportVoucher = legalMaxDiscount;
    }
  }

  const totalDiscounts = roundHelper(inss + irpf + otherDiscounts + transportVoucher + healthInsurance);

  // 2b. Salário Família (Benefício)
  let familySalary = 0;
  if (includeDependents && dependents > 0 && totalGrossForTax <= FAMILY_SALARY_THRESHOLD) {
    familySalary = roundHelper(dependents * FAMILY_SALARY_VALUE);
  }

  const netSalaryBase = totalGrossForTax - totalDiscounts + familySalary;
  const netSalary = Math.max(0, Number(netSalaryBase.toFixed(2)));

  // 3. Consignado
  const netForConsigned = Math.max(0, totalGrossForTax - inss - irpf);
  const { totalMargin, availableMargin, cardMargin, discount: consignedDiscount } = calculateConsignedValues(netForConsigned, consigned, includeConsigned);

  const finalNetSalaryBase = netSalary - consignedDiscount;
  const finalNetSalary = Math.max(0, roundHelper(finalNetSalaryBase));

  return {
    grossSalary,
    totalExtras: extrasBreakdown.total,
    extrasBreakdown,
    inss,
    irpf: Math.max(0, Number(irpf.toFixed(2))),
    dependentsDeduction: deductionVal,
    transportVoucher: Number(transportVoucher.toFixed(2)),
    healthInsurance,
    otherDiscounts,
    netSalary,
    totalDiscounts: Number(totalDiscounts.toFixed(2)),
    effectiveRate: totalGrossForTax > 0 ? Number(((totalDiscounts / totalGrossForTax) * 100).toFixed(2)) : 0,
    fgtsMonthly,
    totalConsignableMargin: totalMargin,
    availableConsignableMargin: availableMargin,
    cardMargin,
    consignedDiscount,
    familySalary,
    finalNetSalary
  };
};

// ============================================================================
// 13º SALÁRIO
// ============================================================================
export const calculateThirteenth = (data: ThirteenthInput): ThirteenthResult => {
  let extrasBreakdown: ExtrasBreakdown = { value50: 0, value100: 0, valueNight: 0, valueStandby: 0, valueInterjornada: 0, valueDsr: 0, total: 0 };

  if (data.includeExtras && data.extras) {
    extrasBreakdown = calculateExtrasValue(data.grossSalary, data.extras);
  }

  const baseSalary = data.grossSalary + extrasBreakdown.total;
  const fullValue = (baseSalary / 12) * data.monthsWorked;

  const firstInstallmentValue = Number((fullValue / 2).toFixed(2));

  const inss = calculateInssOnly(fullValue);

  // Base IR 13º: valor proporcional - INSS - dependentes
  const deductionVal = data.includeDependents ? (data.dependents * DEDUCTION_PER_DEPENDENT) : 0;
  const irBase = Math.max(0, fullValue - inss - deductionVal);

  // grossForTransition = valor bruto do 13º
  const irpf = calculateIrpfOnly(irBase, fullValue);

  const secondInstallmentNetBase = fullValue - inss - irpf - firstInstallmentValue;
  const secondInstallmentNetFixed = Math.max(0, Number(secondInstallmentNetBase.toFixed(2)));

  const { totalMargin, availableMargin, cardMargin, discount: consignedDiscount } = calculateConsignedValues(secondInstallmentNetFixed + firstInstallmentValue, data.consigned, data.includeConsigned);

  const secondInstallmentFinal = Math.max(0, Number((secondInstallmentNetFixed - consignedDiscount).toFixed(2)));

  return {
    totalGross: Number(fullValue.toFixed(2)),
    totalExtrasAverage: Number(extrasBreakdown.total.toFixed(2)),
    extrasBreakdown,
    totalNet: Number((firstInstallmentValue + secondInstallmentNetFixed).toFixed(2)),
    parcel1: {
      value: firstInstallmentValue
    },
    parcel2: {
      grossReference: Number(fullValue.toFixed(2)),
      inss,
      irpf: Math.max(0, Number(irpf.toFixed(2))),
      discountAdvance: firstInstallmentValue,
      value: secondInstallmentNetFixed,
      totalConsignableMargin: totalMargin,
      availableConsignableMargin: availableMargin,
      cardMargin,
      consignedDiscount,
      finalValue: secondInstallmentFinal
    },
    finalTotalNet: Math.max(0, Number(((firstInstallmentValue + secondInstallmentNetFixed) - consignedDiscount).toFixed(2)))
  };
};

// ... HELPERS FOR TERMINATION ...
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
};

const calculateAvos = (start: Date, end: Date): number => {
  let avos = 0;
  const normStart = normalizeDate(start);
  const normEnd = normalizeDate(end);
  if (normStart > normEnd) return 0;
  const current = new Date(normStart.getFullYear(), normStart.getMonth(), 1, 12, 0, 0);
  const targetEnd = new Date(normEnd.getFullYear(), normEnd.getMonth(), normEnd.getDate(), 12, 0, 0);
  while (current <= targetEnd) {
    const year = current.getFullYear();
    const month = current.getMonth();
    const monthStart = new Date(year, month, 1, 12, 0, 0);
    const monthEnd = new Date(year, month + 1, 0, 12, 0, 0);
    const effectiveStart = normStart > monthStart ? normStart : monthStart;
    const effectiveEnd = normEnd < monthEnd ? normEnd : monthEnd;
    if (effectiveStart <= effectiveEnd) {
      const timeDiff = effectiveEnd.getTime() - effectiveStart.getTime();
      const daysWorkedInMonth = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
      if (daysWorkedInMonth >= 15) { avos++; }
    }
    current.setMonth(current.getMonth() + 1);
  }
  return avos;
};
const formatDate = (date: Date): string => date.toLocaleDateString('pt-BR');


// ============================================================================
// RESCISÃO DE CONTRATO — CORRIGIDA
// ============================================================================
// Correções aplicadas:
//   1. Aviso prévio indenizado = verba INDENIZATÓRIA (isento de IR e INSS)
//   2. Férias proporcionais/vencidas + 1/3 na rescisão = isentos de IR (Súmula 386 STJ)
//   3. INSS: somente sobre saldo de salário e 13º proporcional (separados)
//   4. IRPF: somente sobre saldo de salário (- INSS - dep) e 13º (- INSS - dep), separados
//   5. Acordo (art. 484-A CLT): aviso = 50%, multa FGTS = 20%
//   6. Extras proporcionais aos dias no saldo de salário
// ============================================================================
export const calculateTermination = (data: TerminationInput): TerminationResult => {
  const start = new Date(data.startDate + 'T12:00:00');
  const end = new Date(data.endDate + 'T12:00:00');

  const emptyResult: TerminationResult = {
    balanceSalary: 0, noticeWarning: 0, noticeDeduction: 0, vacationProportional: 0, vacationMonths: 0, vacationPeriodLabel: 'Datas Invertidas', vacationExpired: 0, vacationThird: 0, thirteenthProportional: 0, thirteenthMonths: 0, thirteenthPeriodLabel: 'Datas Invertidas', thirteenthAdvanceDeduction: 0, fgtsFine: 0, estimatedFgtsBalance: 0, totalFgts: 0, totalGross: 0, totalExtrasAverage: 0, extrasBreakdown: { value50: 0, value100: 0, valueInterjornada: 0, valueNight: 0, valueStandby: 0, valueDsr: 0, total: 0 }, discountInss: 0, discountIr: 0, irBreakdown: { salary: 0, thirteenth: 0, vacation: 0, total: 0 }, totalDiscounts: 0, totalNet: 0, totalConsignableMargin: 0, availableConsignableMargin: 0, cardMargin: 0, consignedDiscount: 0, remainingLoanBalance: 0, warrantyUsed: 0, fineUsed: 0, totalFgtsDeduction: 0, finalFgtsToWithdraw: 0, finalNetTermination: 0
  };

  if (start > end) return emptyResult;

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDaysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const yearsWorked = Math.floor(diffDaysTotal / 365);

  // Dias trabalhados no último mês (saldo de salário)
  const lastMonthStart = new Date(end.getFullYear(), end.getMonth(), 1, 12, 0, 0);
  const daysInLastMonth = Math.floor((end.getTime() - lastMonthStart.getTime()) / (1000 * 3600 * 24)) + 1;
  const saldoSalaryDays = Math.min(daysInLastMonth, 30);

  // Extras (média mensal habitual)
  let extrasBreakdown: ExtrasBreakdown = { value50: 0, value100: 0, valueNight: 0, valueStandby: 0, valueInterjornada: 0, valueDsr: 0, total: 0 };
  if (data.includeExtras && data.extras) {
    extrasBreakdown = calculateExtrasValue(data.grossSalary, data.extras);
  }

  // Remuneração base (salário + extras habituais — para cálculo de aviso, férias, 13º)
  const remunerationBase = data.grossSalary + extrasBreakdown.total;

  // Saldo de Salário (proporcional aos dias trabalhados no mês)
  const balanceSalary = (remunerationBase / 30) * saldoSalaryDays;

  // ========== AVISO PRÉVIO ==========
  let noticeWarning = 0;
  let noticeDeduction = 0;
  let projectedEndDate = new Date(end);
  const noticeDays = Math.min(30 + (yearsWorked * 3), 90);

  if (data.reason === 'dismissal_no_cause') {
    if (data.noticeStatus === 'indemnified') {
      noticeWarning = (remunerationBase / 30) * noticeDays;
      projectedEndDate = addDays(end, noticeDays);
    }
    // Se 'worked', já está incluído no período trabalhado
  } else if (data.reason === 'resignation') {
    if (data.noticeStatus === 'not_fulfilled') {
      noticeDeduction = data.grossSalary; // Desconto de 30 dias (salário base)
    }
  } else if (data.reason === 'agreement') {
    // Art. 484-A CLT: aviso prévio indenizado = 50%
    if (data.noticeStatus === 'indemnified') {
      noticeWarning = ((remunerationBase / 30) * noticeDays) * 0.50;
      projectedEndDate = addDays(end, noticeDays);
    }
  }

  // ========== 13º PROPORCIONAL ==========
  let thirteenthProportional = 0;
  let thirteenthMonths = 0;
  let thirteenthPeriodLabel = '';
  let thirteenthAdvanceDeduction = 0;

  if (data.reason !== 'dismissal_cause') {
    const exitYear = end.getFullYear();
    const projectedYear = projectedEndDate.getFullYear();
    const startOfYearCurrent = new Date(exitYear, 0, 1, 12, 0, 0);
    const start13Current = start > startOfYearCurrent ? start : startOfYearCurrent;

    if (data.reason === 'dismissal_no_cause' && data.noticeStatus === 'indemnified' && projectedYear > exitYear) {
      const endOfYear = new Date(exitYear, 11, 31, 12, 0, 0);
      const avosCurrentTotal = calculateAvos(start13Current, endOfYear);
      const valueCurrentTotal = (remunerationBase / 12) * avosCurrentTotal;

      const startNextYear = new Date(projectedYear, 0, 1, 12, 0, 0);
      const avosNextYear = calculateAvos(startNextYear, projectedEndDate);
      const valueNextYear = (remunerationBase / 12) * avosNextYear;

      thirteenthMonths = avosCurrentTotal + avosNextYear;
      thirteenthProportional = valueCurrentTotal + valueNextYear;
      thirteenthPeriodLabel = `${formatDate(start13Current)} a ${formatDate(endOfYear)} + ${formatDate(startNextYear)} a ${formatDate(projectedEndDate)}`;

      if (data.thirteenthAdvancePaid) {
        thirteenthAdvanceDeduction = valueCurrentTotal / 2;
      }
    } else {
      const effectiveEnd13 = (data.reason === 'dismissal_no_cause' && data.noticeStatus === 'indemnified') ? projectedEndDate : end;
      thirteenthMonths = calculateAvos(start13Current, effectiveEnd13);
      thirteenthProportional = (remunerationBase / 12) * thirteenthMonths;
      thirteenthPeriodLabel = `${formatDate(start13Current)} a ${formatDate(effectiveEnd13)}`;

      if (data.thirteenthAdvancePaid) {
        thirteenthAdvanceDeduction = thirteenthProportional / 2;
      }
    }
  }

  // ========== FÉRIAS ==========
  let vestingStart = new Date(start);
  vestingStart.setHours(12, 0, 0, 0);
  vestingStart.setFullYear(projectedEndDate.getFullYear());
  if (vestingStart > projectedEndDate) {
    vestingStart.setFullYear(projectedEndDate.getFullYear() - 1);
  }
  if (vestingStart < start) {
    vestingStart = new Date(start);
  }

  const vacationMonths = calculateAvos(vestingStart, projectedEndDate);
  const vacationPeriodLabel = `${formatDate(vestingStart)} a ${formatDate(projectedEndDate)}`;
  const vacationProportional = (remunerationBase / 12) * vacationMonths;

  const expiredCount = data.hasExpiredVacation ? (data.expiredVacationCount || 1) : 0;
  const vacationExpired = remunerationBase * expiredCount;

  const vacationThird = (vacationProportional + vacationExpired) / 3;
  const vacationTotal = vacationProportional + vacationExpired + vacationThird;

  // ========== FGTS ==========
  const totalMonthsWorked = Math.floor(diffDaysTotal / 30);
  const estimatedFgtsBalance = Number(((remunerationBase * 0.08) * totalMonthsWorked).toFixed(2));

  let fgtsFineRate = 0;
  if (data.reason === 'dismissal_no_cause') {
    fgtsFineRate = 0.40; // 40%
  } else if (data.reason === 'agreement') {
    fgtsFineRate = 0.20; // Art. 484-A CLT: 20%
  }
  // Justa causa e pedido de demissão: 0%

  const fgtsFine = estimatedFgtsBalance * fgtsFineRate;
  const totalFgtsFromJob = Number((estimatedFgtsBalance + fgtsFine).toFixed(2));

  // ========== CÁLCULO TRIBUTÁRIO — CORRETO ==========
  // Regra: IR e INSS somente sobre VERBAS SALARIAIS
  //   - Saldo de salário: INSS e IRPF normais
  //   - 13º proporcional: INSS e IRPF em separado (tabela própria)
  //   - Aviso prévio INDENIZADO: ISENTO de IR e INSS
  //   - Férias proporcionais/vencidas + 1/3: ISENTOS de IR (Súmula 386 STJ)
  //     Férias indenizadas também ISENTAS de INSS

  // 1. INSS sobre Saldo de Salário
  const inssSalary = calculateInssOnly(balanceSalary);

  // 2. INSS sobre 13º Proporcional (tabela própria, separado)
  const inss13 = calculateInssOnly(thirteenthProportional);

  const totalInss = inssSalary + inss13;

  // 3. IRPF sobre Saldo de Salário
  const deductionVal = data.includeDependents ? (data.dependents * DEDUCTION_PER_DEPENDENT) : 0;

  const irBaseSalary = Math.max(0, balanceSalary - inssSalary - deductionVal);
  const irSalary = calculateIrpfOnly(irBaseSalary, balanceSalary);

  // 4. IRPF sobre 13º Proporcional (tabela própria, separado)
  const irBase13 = Math.max(0, thirteenthProportional - inss13 - deductionVal);
  const ir13 = calculateIrpfOnly(irBase13, thirteenthProportional);

  // 5. Férias na rescisão = ISENTAS de IR
  const irVacation = 0;

  const discountIr = irSalary + ir13 + irVacation;

  // ========== TOTAL BRUTO (todos os proventos) ==========
  const totalGross = balanceSalary + noticeWarning + vacationTotal + thirteenthProportional;

  // ========== TOTAL DESCONTOS ==========
  const totalDiscounts = totalInss + discountIr + noticeDeduction + thirteenthAdvanceDeduction;

  const totalNetBase = totalGross - totalDiscounts;
  const totalNet = Math.max(0, Number(totalNetBase.toFixed(2)));

  // ========== CONSIGNADO NA RESCISÃO ==========
  let maxConsignableMargin = 0;
  let consignedDiscount = 0;
  let remainingLoanBalance = 0;
  let warrantyUsed = 0;
  let fineUsed = 0;
  let totalFgtsDeduction = 0;
  let availableConsignableMargin = 0;
  let cardMargin = 0;
  let finalFgtsToWithdraw = totalFgtsFromJob;
  let finalNetTermination = totalNet;

  if (data.includeConsigned && data.consigned && data.consigned.outstandingBalance > 0) {

    // 1. Desconto no TRCT (Verbas Rescisórias)
    maxConsignableMargin = Number((totalNet * 0.35).toFixed(2));

    const amountToDeductTRCT = Math.min(
      data.consigned.outstandingBalance,
      maxConsignableMargin,
      totalNet
    );

    consignedDiscount = Number(amountToDeductTRCT.toFixed(2));
    availableConsignableMargin = Math.max(0, roundHelper(maxConsignableMargin - consignedDiscount));
    cardMargin = roundHelper(totalNet * 0.05);

    remainingLoanBalance = Number((data.consigned.outstandingBalance - consignedDiscount).toFixed(2));

    const finalNetCalc = totalNet - consignedDiscount;
    finalNetTermination = Math.max(0, Number(finalNetCalc.toFixed(2)));

    // 2. Garantia de FGTS
    if (remainingLoanBalance > 0 && data.consigned.hasFgtsWarranty) {

      const totalFgtsBalanceForWarranty = (data.consigned.fgtsBalance && data.consigned.fgtsBalance > 0)
        ? data.consigned.fgtsBalance
        : estimatedFgtsBalance;

      const warrantyValue = Number((totalFgtsBalanceForWarranty * 0.10).toFixed(2));

      let availableWarranty = 0;
      let availableFine = 0;

      switch (data.reason) {
        case 'dismissal_no_cause':
          availableWarranty = warrantyValue;
          availableFine = fgtsFine;
          break;

        case 'resignation':
        case 'agreement':
          availableWarranty = warrantyValue;
          availableFine = 0;
          break;

        case 'dismissal_cause':
          availableWarranty = 0;
          availableFine = 0;
          break;
      }

      if (remainingLoanBalance > 0 && availableWarranty > 0) {
        const usage = Math.min(remainingLoanBalance, availableWarranty);
        warrantyUsed = Number(usage.toFixed(2));
        remainingLoanBalance = Number((remainingLoanBalance - warrantyUsed).toFixed(2));
      }

      if (remainingLoanBalance > 0 && availableFine > 0) {
        const usage = Math.min(remainingLoanBalance, availableFine);
        fineUsed = Number(usage.toFixed(2));
        remainingLoanBalance = Number((remainingLoanBalance - fineUsed).toFixed(2));
      }

      totalFgtsDeduction = Number((warrantyUsed + fineUsed).toFixed(2));

      const visualDeduction = Math.min(totalFgtsDeduction, finalFgtsToWithdraw);
      finalFgtsToWithdraw = Number((finalFgtsToWithdraw - visualDeduction).toFixed(2));
    }
  }

  return {
    balanceSalary: Number(balanceSalary.toFixed(2)),
    noticeWarning: Number(noticeWarning.toFixed(2)),
    noticeDeduction: Number(noticeDeduction.toFixed(2)),
    vacationProportional: Number(vacationProportional.toFixed(2)),
    vacationMonths,
    vacationPeriodLabel,
    vacationExpired: Number(vacationExpired.toFixed(2)),
    vacationThird: Number(vacationThird.toFixed(2)),
    thirteenthProportional: Number(thirteenthProportional.toFixed(2)),
    thirteenthMonths,
    thirteenthPeriodLabel,
    thirteenthAdvanceDeduction: Number(thirteenthAdvanceDeduction.toFixed(2)),
    fgtsFine: Number(fgtsFine.toFixed(2)),
    estimatedFgtsBalance: Number(estimatedFgtsBalance.toFixed(2)),
    totalFgts: Number(totalFgtsFromJob.toFixed(2)),
    totalGross: Number(totalGross.toFixed(2)),
    totalExtrasAverage: Number(extrasBreakdown.total.toFixed(2)),
    extrasBreakdown,
    discountInss: Number(totalInss.toFixed(2)),
    discountIr: Number(discountIr.toFixed(2)),
    irBreakdown: {
      salary: Number(irSalary.toFixed(2)),
      thirteenth: Number(ir13.toFixed(2)),
      vacation: 0, // Férias na rescisão são ISENTAS de IR
      total: Number(discountIr.toFixed(2))
    },
    totalDiscounts: Number(totalDiscounts.toFixed(2)),
    totalNet: Number(totalNet.toFixed(2)),
    totalConsignableMargin: maxConsignableMargin,
    availableConsignableMargin,
    cardMargin,
    consignedDiscount,
    remainingLoanBalance,
    warrantyUsed,
    fineUsed,
    totalFgtsDeduction,
    finalFgtsToWithdraw,
    finalNetTermination
  };
};

// ============================================================================
// FÉRIAS — CORRIGIDO
// ============================================================================
export const calculateVacation = (data: VacationInput): VacationResult => {
  let extrasBreakdown: ExtrasBreakdown = { value50: 0, value100: 0, valueNight: 0, valueStandby: 0, valueInterjornada: 0, valueDsr: 0, total: 0 };

  if (data.includeExtras && data.extras) {
    extrasBreakdown = calculateExtrasValue(data.grossSalary, data.extras);
  }

  const remunerationBase = data.grossSalary + extrasBreakdown.total;

  const vacationGross = (remunerationBase / 30) * data.daysTaken;
  const vacationThird = vacationGross / 3;

  let allowanceGross = 0;
  let allowanceThird = 0;
  if (data.sellDays && data.daysSold > 0) {
    allowanceGross = (remunerationBase / 30) * data.daysSold;
    allowanceThird = allowanceGross / 3;
  }

  let advanceThirteenth = 0;
  if (data.advanceThirteenth) {
    advanceThirteenth = remunerationBase / 2;
  }

  const totalGross = vacationGross + vacationThird + allowanceGross + allowanceThird + advanceThirteenth;

  // Base tributável para INSS e IRPF = SOMENTE férias gozadas + 1/3
  // Abono pecuniário e 1/3 do abono são ISENTOS de INSS e IR
  // Adiantamento de 13º também é calculado separadamente (sem desconto aqui)
  const taxableBase = vacationGross + vacationThird;

  const discountInss = calculateInssOnly(taxableBase);

  // Base IR Férias: base tributável - INSS - Dependentes
  const deductionVal = data.includeDependents ? (data.dependents * DEDUCTION_PER_DEPENDENT) : 0;
  const irBase = Math.max(0, taxableBase - discountInss - deductionVal);

  // grossForTransition = base tributável das férias (não o totalGross)
  const discountIr = calculateIrpfOnly(irBase, taxableBase);

  const totalDiscounts = discountInss + discountIr;

  const totalNetBase = totalGross - totalDiscounts;
  const totalNet = Math.max(0, Number(totalNetBase.toFixed(2)));

  // Consignado nas Férias
  const { totalMargin, availableMargin, cardMargin, discount: consignedDiscount } = calculateConsignedValues(totalNet, data.consigned, data.includeConsigned);

  const finalNetVacation = Math.max(0, Number((totalNet - consignedDiscount).toFixed(2)));

  return {
    baseSalary: remunerationBase,
    vacationGross: Number(vacationGross.toFixed(2)),
    vacationThird: Number(vacationThird.toFixed(2)),
    allowanceGross: Number(allowanceGross.toFixed(2)),
    allowanceThird: Number(allowanceThird.toFixed(2)),
    advanceThirteenth: Number(advanceThirteenth.toFixed(2)),
    totalGross: Number(totalGross.toFixed(2)),
    extrasBreakdown,
    discountInss: Number(discountInss.toFixed(2)),
    discountIr: Number(discountIr.toFixed(2)),
    totalDiscounts: Number(totalDiscounts.toFixed(2)),
    totalNet: Number(totalNet.toFixed(2)),
    totalConsignableMargin: totalMargin,
    availableConsignableMargin: availableMargin,
    cardMargin,
    consignedDiscount,
    finalNetVacation
  };
};

// ============================================================================
// SIMULADOR IRPF DETALHADO
// ============================================================================
export const calculateIrpfSimulated = (data: IrpfInput): IrpfResult => {
  const { grossIncome, dependents, alimony, otherDeductions, officialPension } = data;

  // 1. INSS
  let inssValue = officialPension;
  if (inssValue <= 0) {
    inssValue = calculateInssOnly(grossIncome);
  }

  // 2. Base Legal (Deduções Legais)
  const dependentsValue = dependents * DEDUCTION_PER_DEPENDENT;
  const legalBase = Math.max(0, grossIncome - inssValue - dependentsValue - alimony - otherDeductions);

  // 3. Base Simplificada
  const simplifiedDiscount = SIMPLIFIED_DISCOUNT_VALUE;
  const totalLegalDeductions = inssValue + dependentsValue + alimony + otherDeductions;

  const isSimplifiedBest = simplifiedDiscount > totalLegalDeductions;

  const appliedBase = isSimplifiedBest
    ? Math.max(0, grossIncome - simplifiedDiscount)
    : legalBase;

  // 4. Calcular Imposto sobre a Base Escolhida
  const bracketsBreakdown = [];

  // Bracket 1 (Isento)
  const b1 = IRPF_BRACKETS[0];
  const range1 = b1.limit || 0;
  bracketsBreakdown.push({ limit: range1, rate: 0, tax: 0 });

  // Cálculo usando Dedução
  let exactTax = 0;
  let deductibleAmount = 0;

  for (const bracket of IRPF_BRACKETS) {
    if (appliedBase <= bracket.limit) {
      exactTax = (appliedBase * bracket.rate) - bracket.deduction;
      deductibleAmount = bracket.deduction;
      break;
    }
    if (bracket.limit === Infinity) {
      exactTax = (appliedBase * bracket.rate) - bracket.deduction;
      deductibleAmount = bracket.deduction;
      break;
    }
  }

  let taxValue = exactTax;

  // Regra de transição 2026 (Lei 15.270 / MP 1.206)
  if (grossIncome > IR_TRANSITION_FLOOR && grossIncome <= IR_TRANSITION_CEILING) {
    const excess = grossIncome - IR_TRANSITION_FLOOR;
    const transitionTax = excess * IR_TRANSITION_RATE;

    if (transitionTax < taxValue) {
      taxValue = transitionTax;
    }
  }

  // Isenção total para quem ganha até 5k
  if (grossIncome <= IR_TRANSITION_FLOOR) {
    taxValue = 0;
  }

  taxValue = Math.max(0, taxValue);

  // Effective Rate
  const effectiveRate = grossIncome > 0 ? (taxValue / grossIncome) * 100 : 0;

  return {
    baseSalary: grossIncome,
    inssDeduction: inssValue,
    dependentsDeduction: dependentsValue,
    standardDeduction: simplifiedDiscount,
    legalBase,
    simplifiedBase: Math.max(0, grossIncome - simplifiedDiscount),
    appliedBase,
    isSimplifiedBest,
    deductibleAmount,
    taxValue: Number(taxValue.toFixed(2)),
    effectiveRate: Number(effectiveRate.toFixed(2)),
    brackets: bracketsBreakdown
  };
};

// ============================================================================
// PJ CALCULATOR (2026)
// ============================================================================
export const calculatePjTax = (data: PjInput): PjResult => {
  const { grossMonthly, regime, accountantCost, otherMonthlyExpenses, vacationDaysTarget } = data;

  let taxRate = 0;
  let regimeLabel = '';

  const annualGrossProjected = grossMonthly * 12;

  switch (regime) {
    case 'mei':
      taxRate = 0;
      regimeLabel = 'MEI (Microempreendedor Individual)';
      break;

    case 'simples_nacional_3':
      if (annualGrossProjected <= 180000) taxRate = 6.0;
      else if (annualGrossProjected <= 360000) taxRate = 8.2;
      else if (annualGrossProjected <= 720000) taxRate = 10.5;
      else taxRate = 12.5;
      regimeLabel = 'Simples Nacional (Anexo III)';
      break;

    case 'simples_nacional_5':
      if (annualGrossProjected <= 180000) taxRate = 15.5;
      else if (annualGrossProjected <= 360000) taxRate = 18.0;
      else taxRate = 19.5;
      regimeLabel = 'Simples Nacional (Anexo V)';
      break;

    case 'lucro_presumido':
      taxRate = 14.33;
      regimeLabel = 'Lucro Presumido';
      break;
  }

  let taxValueMonthly = 0;
  if (regime === 'mei') {
    taxValueMonthly = 85.00;
    taxRate = (taxValueMonthly / (grossMonthly || 1)) * 100;
  } else {
    taxValueMonthly = grossMonthly * (taxRate / 100);
  }

  const totalMonthlyExpenses = accountantCost + otherMonthlyExpenses;
  const netMonthly = Math.max(0, grossMonthly - taxValueMonthly - totalMonthlyExpenses);

  const monthsOfIncome = Math.max(0, (360 - (vacationDaysTarget || 0)) / 30);

  const annualGross = grossMonthly * monthsOfIncome;
  const annualTax = taxValueMonthly * monthsOfIncome;
  const annualExpenses = totalMonthlyExpenses * 12;

  const annualNet = Math.max(0, annualGross - annualTax - annualExpenses);
  const monthlyAverageReal = annualNet / 12;

  return {
    netMonthly: roundHelper(netMonthly),
    taxValue: roundHelper(taxValueMonthly),
    taxRate: roundHelper(taxRate),
    regimeLabel,
    totalMonthlyExpenses,
    annualNet: roundHelper(annualNet),
    annualTax: roundHelper(annualTax),
    annualExpenses: roundHelper(annualExpenses),
    monthlyAverageReal: roundHelper(monthlyAverageReal)
  };
};

// ============================================================================
// EMPLOYER COST CALCULATOR
// ============================================================================
export const calculateEmployerCost = (grossSalary: number, regime: 'simples' | 'lucro_real_presumido' = 'lucro_real_presumido'): EmployerCost => {
  const inssRate = regime === 'simples' ? 0 : 0.20;
  const inssPatronal = grossSalary * inssRate;

  const fgts = grossSalary * 0.08;

  const ratRate = regime === 'simples' ? 0 : 0.02;
  const rat = grossSalary * ratRate;

  const terceirosRate = regime === 'simples' ? 0 : 0.058;
  const terceiros = grossSalary * terceirosRate;

  const provision13th = grossSalary * (1 / 12);
  const provisionVacation = grossSalary * (1.333333 / 12);

  const totalCostMonthly = grossSalary + inssPatronal + fgts + rat + terceiros + provision13th + provisionVacation;

  return {
    grossSalary,
    inssPatronal: roundHelper(inssPatronal),
    fgts: roundHelper(fgts),
    rat: roundHelper(rat),
    terceiros: roundHelper(terceiros),
    provision13th: roundHelper(provision13th),
    provisionVacation: roundHelper(provisionVacation),
    totalCostMonthly: roundHelper(totalCostMonthly),
    totalCostAnnual: roundHelper(totalCostMonthly * 12)
  };
};
