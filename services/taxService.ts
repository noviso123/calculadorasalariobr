
import { CalculationResult, SalaryInput, ThirteenthInput, ThirteenthResult, TerminationInput, TerminationResult, ExtrasInput, ExtrasBreakdown, VacationInput, VacationResult } from '../types';

// INSS Progressivo 2026 (Projeção Base Salário Mínimo R$ 1.631,00)
const INSS_BRACKETS = [
  { limit: 1631.00, rate: 0.075 },
  { limit: 3080.28, rate: 0.09 },
  { limit: 4620.43, rate: 0.12 },
  { limit: 8993.63, rate: 0.14 },
];

// Função auxiliar para cálculo de IRPF isolado
const calculateIrpfOnly = (base: number): number => {
  if (base <= 5000.00) return 0;
  if (base <= 7350.00) return (base * 0.15) - 750.00; // Regra de transição
  return base * 0.275; // Teto cheio
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
  return Number(inss.toFixed(2));
};

// Função para converter Horas Extras em Valor Monetário Detalhado
const calculateExtrasValue = (grossSalary: number, extras: ExtrasInput): ExtrasBreakdown => {
  if (!grossSalary) {
    return { value50: 0, value100: 0, valueNight: 0, valueStandby: 0, valueInterjornada: 0, valueDsr: 0, total: 0 };
  }
  
  // Utiliza a carga horária informada ou 220 como padrão
  const workloadDivisor = extras.workload > 0 ? extras.workload : 220;
  const hourlyRate = grossSalary / workloadDivisor; 
  
  const val50 = hourlyRate * 1.5 * extras.hours50;
  const val100 = hourlyRate * 2.0 * extras.hours100;
  const valNight = hourlyRate * 0.2 * extras.hoursNight; // Adicional de 20%
  const valStandby = hourlyRate * (1/3) * extras.hoursStandby; // 1/3 da hora normal
  const valInterjornada = hourlyRate * 1.5 * (extras.hoursInterjornada || 0); // Interjornada paga como hora extra 50%

  const subtotal = val50 + val100 + valNight + valStandby + valInterjornada;
  
  // DSR Estimado (Reflexo) ~ 20% (ou 1/6)
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
    extras
  } = data;

  // Calcula valor monetário dos extras
  let extrasBreakdown: ExtrasBreakdown = { value50: 0, value100: 0, valueNight: 0, valueStandby: 0, valueInterjornada: 0, valueDsr: 0, total: 0 };
  
  if (includeExtras && extras) {
    extrasBreakdown = calculateExtrasValue(grossSalary, extras);
  }

  // Base de Cálculo Bruta Total
  const totalGrossForTax = grossSalary + extrasBreakdown.total;

  const inss = calculateInssOnly(totalGrossForTax);
  
  // IRPF sobre Salário Bruto Total (Regra Estrita 2026: Base é o Bruto)
  const irpf = calculateIrpfOnly(totalGrossForTax);

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

  const totalDiscounts = inss + irpf + otherDiscounts + transportVoucher + healthInsurance;
  const netSalary = totalGrossForTax - totalDiscounts;

  // FGTS (8% do Bruto Total)
  const fgtsMonthly = totalGrossForTax * 0.08;

  return {
    grossSalary,
    totalExtras: extrasBreakdown.total,
    extrasBreakdown,
    inss,
    irpf: Math.max(0, Number(irpf.toFixed(2))),
    dependentsDeduction: 0, 
    transportVoucher,
    healthInsurance,
    otherDiscounts,
    netSalary,
    totalDiscounts,
    effectiveRate: totalGrossForTax > 0 ? (totalDiscounts / totalGrossForTax) * 100 : 0,
    fgtsMonthly
  };
};

// --- CÁLCULO DÉCIMO TERCEIRO ---
export const calculateThirteenth = (data: ThirteenthInput): ThirteenthResult => {
  let extrasBreakdown: ExtrasBreakdown = { value50: 0, value100: 0, valueNight: 0, valueStandby: 0, valueInterjornada: 0, valueDsr: 0, total: 0 };
  
  if (data.includeExtras && data.extras) {
    extrasBreakdown = calculateExtrasValue(data.grossSalary, data.extras);
  }

  const baseSalary = data.grossSalary + extrasBreakdown.total;
  const fullValue = (baseSalary / 12) * data.monthsWorked;
  
  const firstInstallmentValue = fullValue / 2;
  
  const inss = calculateInssOnly(fullValue);
  const irpf = calculateIrpfOnly(fullValue);
  
  const secondInstallmentNet = fullValue - inss - irpf - firstInstallmentValue;

  return {
    totalGross: fullValue,
    totalExtrasAverage: extrasBreakdown.total,
    extrasBreakdown,
    totalNet: firstInstallmentValue + secondInstallmentNet,
    parcel1: {
      value: firstInstallmentValue
    },
    parcel2: {
      grossReference: fullValue,
      inss,
      irpf: Math.max(0, Number(irpf.toFixed(2))),
      discountAdvance: firstInstallmentValue,
      value: secondInstallmentNet
    }
  };
};

// HELPERS FOR TERMINATION DATES
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Normalize date to Noon to avoid timezone issues
const normalizeDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
};

// Conta quantos meses (avos) tem entre start e end, considerando regra dos 15 dias
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
      
      if (daysWorkedInMonth >= 15) {
        avos++;
      }
    }
    current.setMonth(current.getMonth() + 1);
  }
  return avos;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR');
};


// --- CÁLCULO RESCISÃO (SIMULADOR PRÁTICO) ---
export const calculateTermination = (data: TerminationInput): TerminationResult => {
  const start = new Date(data.startDate + 'T12:00:00');
  const end = new Date(data.endDate + 'T12:00:00');
  
  if (start > end) {
      return {
          balanceSalary: 0, noticeWarning: 0, noticeDeduction: 0, vacationProportional: 0, vacationMonths: 0, vacationPeriodLabel: 'Datas Invertidas', vacationExpired: 0, vacationThird: 0, thirteenthProportional: 0, thirteenthMonths: 0, thirteenthPeriodLabel: 'Datas Invertidas', thirteenthAdvanceDeduction: 0, fgtsFine: 0, estimatedFgtsBalance: 0, totalFgts: 0, totalGross: 0, totalExtrasAverage: 0, extrasBreakdown: {value50:0, value100:0, valueInterjornada:0, valueNight:0, valueStandby:0, valueDsr:0, total:0}, discountInss: 0, discountIr: 0, totalDiscounts: 0, totalNet: 0
      };
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDaysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  const yearsWorked = Math.floor(diffDaysTotal / 365);
  
  // Saldo de Salário
  const lastMonthStart = new Date(end.getFullYear(), end.getMonth(), 1, 12, 0, 0);
  const daysInLastMonth = Math.floor((end.getTime() - lastMonthStart.getTime()) / (1000 * 3600 * 24)) + 1;
  const saldoSalaryDays = Math.min(daysInLastMonth, 30); 

  // Extras
  let extrasBreakdown: ExtrasBreakdown = { value50: 0, value100: 0, valueNight: 0, valueStandby: 0, valueInterjornada: 0, valueDsr: 0, total: 0 };
  if (data.includeExtras && data.extras) {
    extrasBreakdown = calculateExtrasValue(data.grossSalary, data.extras);
  }
  
  const remunerationBase = data.grossSalary + extrasBreakdown.total;
  const balanceSalary = (data.grossSalary / 30) * saldoSalaryDays;

  // Aviso Prévio
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

  // 13º Salário Proporcional (Lógica Robusta de Ano Civil)
  // Split calculation into Current Year (physical exit) and Next Year (indemnified projection)
  
  let thirteenthProportional = 0;
  let thirteenthMonths = 0;
  let thirteenthPeriodLabel = '';
  let thirteenthAdvanceDeduction = 0;

  if (data.reason !== 'dismissal_cause') {
      const exitYear = end.getFullYear();
      const projectedYear = projectedEndDate.getFullYear();
      
      // Part 1: Current Year Avos (Jan 1 of Exit Year -> End Date)
      const startOfYearCurrent = new Date(exitYear, 0, 1, 12, 0, 0);
      const start13Current = start > startOfYearCurrent ? start : startOfYearCurrent;
      
      const avosCurrent = calculateAvos(start13Current, end); // Up to physical end
      const valueCurrent = (remunerationBase / 12) * avosCurrent;
      
      // Part 2: Next Year/Indemnified Avos (End Date + 1 -> Projected End Date)
      let avosNext = 0;
      let valueNext = 0;
      
      // If notice is indemnified, we calculate the span covered by the notice
      if (data.reason === 'dismissal_no_cause' && data.noticeStatus === 'indemnified') {
          // Check if projection crosses year boundary
          const dayAfterEnd = addDays(end, 1);
          
          // Calculate total avos covered by notice
          // Logic: Calculate avos from dayAfterEnd to projectedEndDate
          // If years are different, calculateAvos handles the count correctly as strict months
          // But 13th resets in Jan. So we should treat it per year if needed.
          // However, for total compensation, sum of avos is usually sufficient unless rates change (not applicable here).
          // We will sum avos, but keep track of which avos belong to current year for deduction purposes.
          
          // Simplification: Calculate total avos from start13Current to ProjectedEndDate
          // Then subtract avosCurrent to find the "Indemnified" portion?
          // No, safer to sum segments.
          
          const totalAvosFromStart = calculateAvos(start13Current, projectedEndDate);
          
          // Case: Transition Dec/Jan
          // End: Dec 20. Projected: Jan 19.
          // start13Current (Jan 1) -> End (Dec 20) = 12 avos.
          // End (Dec 20) -> Projected (Jan 19).
          // Total span Jan 1 2025 -> Jan 19 2026.
          // Logic should ideally separate: 12/12 for 2025 + 1/12 for 2026.
          
          // Let's implement strict split:
          if (projectedYear > exitYear) {
             // Split!
             // Part A: Current Year (up to Dec 31)
             const endOfYear = new Date(exitYear, 11, 31, 12, 0, 0);
             const avosCurrentTotal = calculateAvos(start13Current, endOfYear); // Should be 12 max
             const valueCurrentTotal = (remunerationBase / 12) * avosCurrentTotal;
             
             // Part B: Next Year (Jan 1 to Projected)
             const startNextYear = new Date(projectedYear, 0, 1, 12, 0, 0);
             const avosNextYear = calculateAvos(startNextYear, projectedEndDate);
             const valueNextYear = (remunerationBase / 12) * avosNextYear;
             
             thirteenthMonths = avosCurrentTotal + avosNextYear;
             thirteenthProportional = valueCurrentTotal + valueNextYear;
             thirteenthPeriodLabel = `${formatDate(start13Current)} a ${formatDate(endOfYear)} + ${formatDate(startNextYear)} a ${formatDate(projectedEndDate)}`;
             
             // Deduction only applies to Part A (Current Year)
             if (data.thirteenthAdvancePaid) {
                 thirteenthAdvanceDeduction = valueCurrentTotal / 2;
             }
             
          } else {
             // Same Year
             thirteenthMonths = calculateAvos(start13Current, projectedEndDate);
             thirteenthProportional = (remunerationBase / 12) * thirteenthMonths;
             thirteenthPeriodLabel = `${formatDate(start13Current)} a ${formatDate(projectedEndDate)}`;
             
             if (data.thirteenthAdvancePaid) {
                 thirteenthAdvanceDeduction = thirteenthProportional / 2;
             }
          }
      } else {
         // Not indemnified or just worked
         // Just calculate up to End Date (which is same as Projected)
         thirteenthMonths = avosCurrent;
         thirteenthProportional = valueCurrent;
         thirteenthPeriodLabel = `${formatDate(start13Current)} a ${formatDate(end)}`;
         
         if (data.thirteenthAdvancePaid) {
             thirteenthAdvanceDeduction = thirteenthProportional / 2;
         }
      }
  }

  // Férias Proporcionais
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
  const vacationExpired = data.hasExpiredVacation ? remunerationBase : 0;
  const vacationThird = (vacationProportional + vacationExpired) / 3;

  // FGTS
  const totalMonthsWorked = Math.floor(diffDaysTotal / 30);
  const estimatedFgtsBalance = (remunerationBase * 0.08) * totalMonthsWorked;

  let fgtsFine = 0;
  if (data.reason === 'dismissal_no_cause') {
     fgtsFine = estimatedFgtsBalance * 0.40;
  }
  const totalFgts = estimatedFgtsBalance + fgtsFine;

  // TOTAIS
  const totalGross = balanceSalary + extrasBreakdown.total + noticeWarning + vacationProportional + vacationExpired + vacationThird + thirteenthProportional + fgtsFine;
  
  // DEDUÇÕES TRIBUTÁRIAS
  const taxableInssBase = balanceSalary + extrasBreakdown.total + thirteenthProportional;
  const taxableIrBase = balanceSalary + extrasBreakdown.total + thirteenthProportional;

  const discountInss = calculateInssOnly(taxableInssBase);
  const discountIr = calculateIrpfOnly(taxableIrBase);

  const totalDiscounts = discountInss + discountIr + noticeDeduction + thirteenthAdvanceDeduction;

  return {
    balanceSalary,
    noticeWarning,
    noticeDeduction,
    vacationProportional,
    vacationMonths,
    vacationPeriodLabel,
    vacationExpired,
    vacationThird,
    thirteenthProportional,
    thirteenthMonths,
    thirteenthPeriodLabel,
    thirteenthAdvanceDeduction,
    fgtsFine,
    estimatedFgtsBalance,
    totalFgts,
    totalGross,
    totalExtrasAverage: extrasBreakdown.total,
    extrasBreakdown,
    discountInss,
    discountIr,
    totalDiscounts,
    totalNet: totalGross - totalDiscounts
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
  const discountIr = calculateIrpfOnly(taxableBase); 
  
  const totalDiscounts = discountInss + discountIr;
  
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
    totalNet: totalGross - totalDiscounts
  };
};
