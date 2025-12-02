
export type ViewType = 'salary' | 'thirteenth' | 'termination' | 'vacation';
export type NoticeStatus = 'worked' | 'indemnified' | 'not_fulfilled' | 'waived';

export interface ExtrasInput {
  workload: number;      // Carga Horária Mensal (ex: 220, 200, 180)
  hours50: number;       // Horas Extras 50%
  hours100: number;      // Horas Extras 100%
  hoursNight: number;    // Adicional Noturno (20%)
  hoursStandby: number;  // Sobreaviso (1/3)
  hoursInterjornada: number; // Interjornada (Supressão intervalo - 50%)
  includeDsr: boolean;   // Calcular DSR automático?
}

export interface ExtrasBreakdown {
  value50: number;
  value100: number;
  valueNight: number;
  valueStandby: number;
  valueInterjornada: number;
  valueDsr: number;
  total: number;
}

export interface SalaryInput {
  grossSalary: number;
  dependents: number;
  otherDiscounts: number;
  healthInsurance: number;
  transportVoucherPercent: number;
  includeTransportVoucher: boolean;
  transportDailyCost?: number;
  workDays?: number;
  includeExtras: boolean;
  extras: ExtrasInput;
}

export interface ThirteenthInput {
  grossSalary: number;
  monthsWorked: number;
  dependents: number;
  includeExtras: boolean;
  extras: ExtrasInput; // Média de extras
}

export interface TerminationInput {
  grossSalary: number;
  startDate: string;
  endDate: string;
  reason: 'dismissal_no_cause' | 'dismissal_cause' | 'resignation' | 'agreement';
  noticeStatus: NoticeStatus;
  hasExpiredVacation: boolean;
  thirteenthAdvancePaid: boolean; // Adiantamento 13º já foi pago?
  dependents: number;
  includeExtras: boolean;
  extras: ExtrasInput; // Média de extras
}

export interface VacationInput {
  grossSalary: number;
  dependents: number;
  daysTaken: number; // Dias de descanso (gozo)
  sellDays: boolean; // Vender férias (Abono)?
  daysSold: number;  // Dias vendidos (max 10)
  advanceThirteenth: boolean; // Adiantar 1ª parcela 13º?
  includeExtras: boolean;
  extras: ExtrasInput;
}

export interface TaxBracket {
  limit: number | null;
  rate: number;
  deduction: number;
}

export interface CalculationResult {
  grossSalary: number;
  totalExtras: number; // Valor monetário total dos extras (Soma)
  extrasBreakdown: ExtrasBreakdown; // Detalhamento dos extras
  inss: number;
  irpf: number;
  dependentsDeduction: number;
  transportVoucher: number;
  healthInsurance: number;
  otherDiscounts: number;
  netSalary: number;
  totalDiscounts: number;
  effectiveRate: number;
  fgtsMonthly: number; // Depósito mensal (8%)
}

export interface ThirteenthResult {
  totalGross: number;
  totalExtrasAverage: number; 
  extrasBreakdown: ExtrasBreakdown; // Detalhamento
  totalNet: number;
  parcel1: {
    value: number; // Valor líquido da 1ª parcela (50% bruto)
  };
  parcel2: {
    grossReference: number; // Valor referência
    inss: number;
    irpf: number;
    discountAdvance: number; // Desconto do adiantamento
    value: number; // Valor líquido da 2ª parcela
  };
}

export interface TerminationResult {
  balanceSalary: number; // Saldo de salário
  noticeWarning: number; // Aviso prévio (Crédito)
  noticeDeduction: number; // Aviso prévio (Débito/Desconto)
  vacationProportional: number; // Férias proporcionais
  vacationMonths: number; // Avos de férias (ex: 5/12)
  vacationPeriodLabel: string; // Periodo ref (ex: 14/06/25 a 14/11/25)
  vacationExpired: number; // Férias vencidas
  vacationThird: number; // 1/3 Férias
  thirteenthProportional: number; // 13º Proporcional
  thirteenthMonths: number; // Avos de 13º (ex: 5/12)
  thirteenthPeriodLabel: string; // Periodo ref
  thirteenthAdvanceDeduction: number; // Desconto de adiantamento 13º se já pago
  fgtsFine: number; // Multa 40% (estimada)
  estimatedFgtsBalance: number; // Saldo FGTS estimado para fins de cálculo
  totalFgts: number; // Soma Saldo + Multa
  totalGross: number;
  totalExtrasAverage: number; // Extras considerados na base
  extrasBreakdown: ExtrasBreakdown; // Detalhamento dos extras
  discountInss: number; // Desconto INSS separado
  discountIr: number;   // Desconto IR separado
  totalDiscounts: number; // INSS + IR + Aviso Prévio Descontado
  totalNet: number;
}

export interface VacationResult {
  baseSalary: number;
  vacationGross: number; // Valor dos dias de férias
  vacationThird: number; // 1/3 Constitucional sobre férias
  allowanceGross: number; // Abono Pecuniário (Venda)
  allowanceThird: number; // 1/3 sobre Abono
  advanceThirteenth: number; // Valor do adiantamento 13º
  totalGross: number;
  extrasBreakdown: ExtrasBreakdown;
  discountInss: number;
  discountIr: number;
  totalDiscounts: number;
  totalNet: number;
}

export enum CalculationStatus {
  IDLE = 'IDLE',
  CALCULATING = 'CALCULATING',
  SUCCESS = 'SUCCESS'
}
