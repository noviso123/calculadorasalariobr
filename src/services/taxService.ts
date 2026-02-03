import { CalculationResult, SalaryInput, ThirteenthInput, ThirteenthResult, TerminationInput, TerminationResult, ExtrasInput, ExtrasBreakdown, VacationInput, VacationResult, ConsignedInput, PjInput, PjResult, PjRegime, IrpfInput, IrpfResult } from '../types';
import { INSS_BRACKETS, DEDUCTION_PER_DEPENDENT, FAMILY_SALARY_THRESHOLD, FAMILY_SALARY_VALUE, IRPF_BRACKETS, SIMPLIFIED_DISCOUNT_VALUE } from '../config/taxConstants';


const roundHelper = (value: number): number => {
  // Adiciona um viés pequeno (1e-9) para corrigir erros de ponto flutuante (ex: 121.5749999999 -> 121.575)
  // Isso garante o "Round Half Up" matemático correto para moedas.
  return Math.round((value + 1e-9) * 100) / 100;
};

// Função auxiliar para cálculo de IRPF isolado
// Recebe flag hasDependents para aplicar regra de corte específica
// NOTA: A base recebida JÁ DEVE TER O INSS DESCONTADO.
// Implementa a lógica do Desconto Simplificado (R$ 564,80) automaticamente se for mais benéfico.
const calculateIrpfOnly = (baseAfterInss: number, startBaseForSimplified: number): number => {
  // 1. Regra "Novo IR 2026" (Isenção até 5.000 e Escalonamento até 7.350)
  // Conforme solicitação do usuário e Simulação da Lei 15.270:
  // - Até R$ 5.000,00 (Bruto): Isento.
  // - Entre R$ 5.000,01 e R$ 7.350,00: Tributação Linear de Transição.
  //   Baseado no ponto de dados: 5200 Bruto -> 71.62 Imposto.
  //   Formula: (Bruto - 5000) * 0.3581.
  // - Acima de R$ 7.350,00: Tabela Progressiva Padrão.

  // Caso 1: Isenção Total
  if (startBaseForSimplified <= 5000.00) {
      return 0;
  }

  // Caso 2: Faixa de Transição (5k - 7.35k)
  if (startBaseForSimplified <= 7350.00) {
      const excess = startBaseForSimplified - 5000.00;
      const taxTransition = excess * 0.3581;
      return roundHelper(Math.max(0, taxTransition));
  }

  // Caso 3: Padrão (Acima de 7.35k) -> Cálculo "Melhor Entre Legal e Simplificado"

  // 3a. Cálculo Legal (Inss já deduzido da base)
  let taxLegal = 0;
  for (const bracket of IRPF_BRACKETS) {
      if (baseAfterInss <= bracket.limit) {
          taxLegal = (baseAfterInss * bracket.rate) - bracket.deduction;
          break;
      }
      if (bracket.limit === Infinity) {
           taxLegal = (baseAfterInss * bracket.rate) - bracket.deduction;
      }
  }
  taxLegal = Math.max(0, taxLegal);

  // 3b. Cálculo Simplificado (Desconto Padrão)
  // Mas atenção: Para incomes > 7350, o "simplificado" atual ainda vale?
  // Sim, a regra padrão se aplica acima do teto da transição.
  const baseSimplified = Math.max(0, startBaseForSimplified - SIMPLIFIED_DISCOUNT_VALUE);
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

// Função auxiliar para cálculo de INSS isolado
const calculateInssOnly = (value: number): number => {
  let inss = 0;
  let previousLimit = 0;
  const maxLimit = INSS_BRACKETS[INSS_BRACKETS.length - 1].limit;

  if (value > maxLimit) {
      let accumulatedTax = 0;
      let prev = 0;
      for(const bracket of INSS_BRACKETS) {
          // Usa roundHelper em cada passo para evitar carry-over de imprecisão
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

// Função para converter Horas Extras em Valor Monetário Detalhado
const calculateExtrasValue = (grossSalary: number, extras: ExtrasInput): ExtrasBreakdown => {
  if (!grossSalary) {
    return { value50: 0, value100: 0, valueNight: 0, valueStandby: 0, valueInterjornada: 0, valueDsr: 0, total: 0 };
  }

  const workloadDivisor = extras.workload > 0 ? extras.workload : 220;
  const hourlyRate = grossSalary / workloadDivisor;

  const val50 = hourlyRate * 1.5 * extras.hours50;
  const val100 = hourlyRate * 2.0 * extras.hours100;
  const valNight = hourlyRate * 0.2 * extras.hoursNight;
  const valStandby = hourlyRate * (1/3) * extras.hoursStandby;
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

// Helper para Consignado: Retorna { maxMargin, discount }
const calculateConsignedValues = (netBase: number, consigned: ConsignedInput, isActive: boolean) => {
  if (!isActive || !consigned) {
    return { maxMargin: 0, discount: 0 };
  }
  // Margem de 35% sobre a Remuneração Disponível (Líquido Base)
  const maxMargin = Number((netBase * 0.35).toFixed(2));
  const discount = Math.min(consigned.monthlyInstallment, maxMargin);
  return { maxMargin, discount: Number(discount.toFixed(2)) };
};

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
  // Regra 2026: Até R$ 1.980,38 -> R$ 67,54 por dependente
  let familySalary = 0;
  if (includeDependents && dependents > 0 && totalGrossForTax <= FAMILY_SALARY_THRESHOLD) {
      familySalary = roundHelper(dependents * FAMILY_SALARY_VALUE);
  }

  // Proteção contra negativo
  // Nota: Salário Família SOMA ao líquido
  const netSalaryBase = totalGrossForTax - totalDiscounts + familySalary;
  const netSalary = Math.max(0, Number(netSalaryBase.toFixed(2)));

  // 3. Consignado
  // A margem consignável (35%) é calculada sobre a Remuneração Líquida (Bruto - INSS - IRPF)
  const netForConsigned = totalGrossForTax - inss - irpf;
  const { maxMargin, discount: consignedDiscount } = calculateConsignedValues(netForConsigned, consigned, includeConsigned);

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
    maxConsignableMargin: maxMargin,
    consignedDiscount,
    familySalary,
    finalNetSalary
  };
};

export const calculateThirteenth = (data: ThirteenthInput): ThirteenthResult => {
  let extrasBreakdown: ExtrasBreakdown = { value50: 0, value100: 0, valueNight: 0, valueStandby: 0, valueInterjornada: 0, valueDsr: 0, total: 0 };

  if (data.includeExtras && data.extras) {
    extrasBreakdown = calculateExtrasValue(data.grossSalary, data.extras);
  }

  const baseSalary = data.grossSalary + extrasBreakdown.total;
  const fullValue = (baseSalary / 12) * data.monthsWorked;

  const firstInstallmentValue = Number((fullValue / 2).toFixed(2));

  const inss = calculateInssOnly(fullValue);

  // Base IR 13º: Bruto - INSS - Dependentes
  const deductionVal = data.includeDependents ? (data.dependents * DEDUCTION_PER_DEPENDENT) : 0;
  const irBase = Math.max(0, fullValue - inss - deductionVal);

  const irpf = calculateIrpfOnly(irBase, fullValue);

  const secondInstallmentNetBase = fullValue - inss - irpf - firstInstallmentValue;
  const secondInstallmentNetFixed = Math.max(0, Number(secondInstallmentNetBase.toFixed(2)));

  const { maxMargin, discount: consignedDiscount } = calculateConsignedValues(secondInstallmentNetFixed + firstInstallmentValue, data.consigned, data.includeConsigned);

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
      maxMargin,
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


export const calculateTermination = (data: TerminationInput): TerminationResult => {
  const start = new Date(data.startDate + 'T12:00:00');
  const end = new Date(data.endDate + 'T12:00:00');

  if (start > end) {
      return {
          balanceSalary: 0, noticeWarning: 0, noticeDeduction: 0, vacationProportional: 0, vacationMonths: 0, vacationPeriodLabel: 'Datas Invertidas', vacationExpired: 0, vacationThird: 0, thirteenthProportional: 0, thirteenthMonths: 0, thirteenthPeriodLabel: 'Datas Invertidas', thirteenthAdvanceDeduction: 0, fgtsFine: 0, estimatedFgtsBalance: 0, totalFgts: 0, totalGross: 0, totalExtrasAverage: 0, extrasBreakdown: {value50:0, value100:0, valueInterjornada:0, valueNight:0, valueStandby:0, valueDsr:0, total:0}, discountInss: 0, discountIr: 0, irBreakdown: {salary:0, thirteenth:0, vacation:0, total:0}, totalDiscounts: 0, totalNet: 0, maxConsignableMargin: 0, consignedDiscount: 0, remainingLoanBalance: 0, warrantyUsed: 0, fineUsed: 0, totalFgtsDeduction: 0, finalFgtsToWithdraw: 0, finalNetTermination: 0
      };
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDaysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const yearsWorked = Math.floor(diffDaysTotal / 365);

  const lastMonthStart = new Date(end.getFullYear(), end.getMonth(), 1, 12, 0, 0);
  const daysInLastMonth = Math.floor((end.getTime() - lastMonthStart.getTime()) / (1000 * 3600 * 24)) + 1;
  const saldoSalaryDays = Math.min(daysInLastMonth, 30);

  let extrasBreakdown: ExtrasBreakdown = { value50: 0, value100: 0, valueNight: 0, valueStandby: 0, valueInterjornada: 0, valueDsr: 0, total: 0 };
  if (data.includeExtras && data.extras) {
    extrasBreakdown = calculateExtrasValue(data.grossSalary, data.extras);
  }

  const remunerationBase = data.grossSalary + extrasBreakdown.total;
  const balanceSalary = (data.grossSalary / 30) * saldoSalaryDays;

  let noticeWarning = 0;
  let noticeDeduction = 0;
  let projectedEndDate = new Date(end);
  const noticeDays = Math.min(30 + (yearsWorked * 3), 90);

  if (data.reason === 'dismissal_no_cause') {
    if (data.noticeStatus === 'indemnified') {
      noticeWarning = (remunerationBase / 30) * noticeDays;
      projectedEndDate = addDays(end, noticeDays);
    }
  } else if (data.reason === 'resignation') {
    if (data.noticeStatus === 'not_fulfilled') {
      noticeDeduction = data.grossSalary;
    }
  }

  // 13º Proporcional
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

  // Férias
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

  // FGTS
  const totalMonthsWorked = Math.floor(diffDaysTotal / 30);
  const estimatedFgtsBalance = Number(((remunerationBase * 0.08) * totalMonthsWorked).toFixed(2));

  let fgtsFine = 0;
  if (data.reason === 'dismissal_no_cause') {
     fgtsFine = estimatedFgtsBalance * 0.40;
  }
  const totalFgtsFromJob = Number((estimatedFgtsBalance + fgtsFine).toFixed(2));

  // --- CÁLCULO TRIBUTÁRIO UNIFICADO ---

  // 1. INSS (Calculado separadamente mas somado para exibição)
  const salaryBaseForInss = balanceSalary + extrasBreakdown.total;
  const inssSalary = calculateInssOnly(salaryBaseForInss);
  const inss13 = calculateInssOnly(thirteenthProportional);
  const totalInss = inssSalary + inss13;

  // 2. IRPF UNIFICADO
  // SOMA DE TODOS OS POSITIVOS:
  const totalGross = balanceSalary + extrasBreakdown.total + noticeWarning + vacationTotal + thirteenthProportional;

  // Base de Cálculo = Total Bruto - INSS - Dependentes
  const deductionVal = data.includeDependents ? (data.dependents * DEDUCTION_PER_DEPENDENT) : 0;

  // IRPF Base Unificada
  const irUnifiedBase = Math.max(0, totalGross - totalInss - deductionVal);

  // Aplica a tabela progressiva sobre o montante total
  const unifiedIrpf = calculateIrpfOnly(irUnifiedBase, totalGross);
  const discountIr = unifiedIrpf;

  // Outras deduções
  const totalDiscounts = totalInss + discountIr + noticeDeduction + thirteenthAdvanceDeduction;

  const totalNetBase = totalGross - totalDiscounts;
  const totalNet = Math.max(0, Number(totalNetBase.toFixed(2))); // Previne negativo na base

  // --- CONSIGNADO NA RESCISÃO ---
  let maxConsignableMargin = 0;
  let consignedDiscount = 0;
  let remainingLoanBalance = 0;
  let warrantyUsed = 0;
  let fineUsed = 0;
  let totalFgtsDeduction = 0;
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
    discountInss: Number(totalInss.toFixed(2)), // INSS Totalizado
    discountIr: Number(discountIr.toFixed(2)),    // IR Unificado
    irBreakdown: {
        salary: 0,
        thirteenth: 0,
        vacation: 0,
        total: Number(discountIr.toFixed(2))
    },
    totalDiscounts: Number(totalDiscounts.toFixed(2)),
    totalNet: Number(totalNet.toFixed(2)),
    maxConsignableMargin,
    consignedDiscount,
    remainingLoanBalance,
    warrantyUsed,
    fineUsed,
    totalFgtsDeduction,
    finalFgtsToWithdraw,
    finalNetTermination
  };
};

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
  const taxableBase = vacationGross + vacationThird;

  const discountInss = calculateInssOnly(taxableBase);

  // Base IR Férias: Bruto - INSS - Dependentes
  const deductionVal = data.includeDependents ? (data.dependents * DEDUCTION_PER_DEPENDENT) : 0;
  const irBase = Math.max(0, taxableBase - discountInss - deductionVal);

  const discountIr = calculateIrpfOnly(irBase, totalGross);

  const totalDiscounts = discountInss + discountIr;

  // Prevenir negativo
  const totalNetBase = totalGross - totalDiscounts;
  const totalNet = Math.max(0, Number(totalNetBase.toFixed(2)));

  // Consignado nas Férias
  const { maxMargin, discount: consignedDiscount } = calculateConsignedValues(totalNet, data.consigned, data.includeConsigned);

  const finalNetVacation = Math.max(0, Number((totalNet - consignedDiscount).toFixed(2)));

  return {
    baseSalary: remunerationBase,
    vacationGross,
    vacationThird,
    allowanceGross,
    allowanceThird,
    advanceThirteenth,
    totalGross,
    extrasBreakdown,
    discountInss,
    discountIr,
    totalDiscounts,
    totalNet,
    // Consigned
    maxConsignableMargin: maxMargin,
    consignedDiscount,
    finalNetVacation
  };
};

// --- IRPF SIMULATOR (DETAILED) ---
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

  // 3. Base Simplificada (R$ 564,80)
  // Regra: Base = Gross - (INSS?) - 564,80 ?
  // NÃO. A regra é: Base = Gross - INSS - 564,80 (substitui DEDUÇÕES, não o INSS).
  // Conferindo Gov.br:
  // "Opção pelo desconto simplificado: Substitui todas as deduções legais (dependentes, despesas médicas, etc), correspondente a 25% da faixa de isenção."
  // O INSS é uma dedução legal? Sim. Mas geralmente o simplificado é "em substituição às deduções legais".
  // A Receita diz: "Desconto Simplificado Mensal: R$ 564,80. (25% de R$ 2.259,20)".
  // Se o desconto simplificado for maior que (INSS + Dep + Outras), usa-se ele.
  // Logo: BaseSimplificada = Gross - 564,80. (O INSS entra na comparação como dedução).

  const simplifiedDiscount = SIMPLIFIED_DISCOUNT_VALUE;
  // Comparação de Deduções:
  const totalLegalDeductions = inssValue + dependentsValue + alimony + otherDeductions;

  const isSimplifiedBest = simplifiedDiscount > totalLegalDeductions;

  // Se Simplificado for melhor, a Base é Gross - 564,80.
  // Se Legal for melhor, a Base é Gross - INSS - Dep - Outras.

  const appliedBase = isSimplifiedBest
      ? Math.max(0, grossIncome - simplifiedDiscount)
      : legalBase;

  // 4. Calcular Imposto sobre a Base Escolhida
  let taxValue = 0;
  const bracketsBreakdown = [];

  let tempBase = appliedBase;

  // Bracket 1 (Isento)
  const b1 = IRPF_BRACKETS[0]; // limit: 2259.20, rate: 0
  const range1 = b1.limit || 0;
  bracketsBreakdown.push({ limit: range1, rate: 0, tax: 0 });

  // Demais brackets
  // Vamos re-calcular "na mão" para ter o breakdown exato de cada faixa
  // em vez de usar a formula "dedução".
  // Mas para o valor final, usaremos a formula de dedução para garantir precisão.

  // Cálculo exato usando Dedução (Mais seguro)
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
            break; // ultimo
       }
  }

  // Regra de transição 2026 (Linear 5k - 7.35k)
  // Se estiver nessa faixa e for mais vantajoso, a lei aplica.
  // Porem o simulador oficial geralmente mostra a tabela progressiva padrão.
  // Vamos manter a lógica padrão.

  taxValue = exactTax;

  // 4b. Regra de transição 2026 (Lei 15.270 / MP 1.206)
  // Para rendimentos brutos entre R$ 5.000,01 e R$ 7.350,00 vigora uma alíquota linear simplificada.
  if (grossIncome > 5000.00 && grossIncome <= 7350.00) {
      const excess = grossIncome - 5000.00;
      const transitionTax = excess * 0.3581;

      // Se a transição for mais benéfica que a tabela progressiva (o que é a regra), aplicamos.
      if (transitionTax < taxValue) {
          taxValue = transitionTax;
      }
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

// --- PJ CALCULATOR (AUTOMATIC TAX) ---
export const calculatePjTax = (data: PjInput): PjResult => {
  const { grossMonthly, regime, accountantCost } = data;

  let taxRate = 0;
  let regimeLabel = '';

  switch (regime) {
    case 'mei':
      taxRate = 0;
      regimeLabel = 'MEI (Microempreendedor Individual)';
      break;

    case 'simples_nacional_3':
      taxRate = 6;
      regimeLabel = 'Simples Nacional (Anexo III)';
      break;

    case 'simples_nacional_5':
      taxRate = 15.5;
      regimeLabel = 'Simples Nacional (Anexo V)';
      break;

    case 'lucro_presumido':
      taxRate = 14.33;
      regimeLabel = 'Lucro Presumido';
      break;
  }

  let taxValue = 0;
  if (regime === 'mei') {
      taxValue = 82.50;
      taxRate = (taxValue / (grossMonthly || 1)) * 100;
  } else {
      taxValue = grossMonthly * (taxRate / 100);
  }

  const net = Math.max(0, grossMonthly - taxValue - accountantCost);

  return {
    net: roundHelper(net),
    taxValue: roundHelper(taxValue),
    taxRate: roundHelper(taxRate),
    regimeLabel
  };
};
