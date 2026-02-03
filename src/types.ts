
export type ViewType = 'salary' | 'thirteenth' | 'termination' | 'vacation' | 'consigned' | 'compare' | 'irpf';
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

export interface ConsignedInput {
  monthlyInstallment: number; // Valor da parcela mensal
  outstandingBalance: number; // Saldo devedor total (importante para rescisão)
  hasFgtsWarranty: boolean;   // Tem garantia do FGTS?
  fgtsBalance: number;        // Saldo TOTAL do FGTS (para cálculo dos 10% de garantia)
}

export interface SalaryInput {
  grossSalary: number;
  includeDependents: boolean;
  dependents: number;
  otherDiscounts: number;
  healthInsurance: number;
  transportVoucherPercent: number;
  includeTransportVoucher: boolean;
  transportDailyCost?: number;
  workDays?: number;
  includeExtras: boolean;
  extras: ExtrasInput;
  includeConsigned: boolean;
  consigned: ConsignedInput;
}

export interface ThirteenthInput {
  grossSalary: number;
  monthsWorked: number;
  includeDependents: boolean;
  dependents: number;
  includeExtras: boolean;
  extras: ExtrasInput;
  includeConsigned: boolean;
  consigned: ConsignedInput;
}

export interface TerminationInput {
  grossSalary: number;
  startDate: string;
  endDate: string;
  reason: 'dismissal_no_cause' | 'dismissal_cause' | 'resignation' | 'agreement';
  noticeStatus: NoticeStatus;
  hasExpiredVacation: boolean;
  expiredVacationCount?: number;
  thirteenthAdvancePaid: boolean;
  includeDependents: boolean;
  dependents: number;
  includeExtras: boolean;
  extras: ExtrasInput;
  includeConsigned: boolean;
  consigned: ConsignedInput;
}

export interface VacationInput {
  grossSalary: number;
  includeDependents: boolean;
  dependents: number;
  daysTaken: number;
  sellDays: boolean;
  daysSold: number;
  advanceThirteenth: boolean;
  includeExtras: boolean;
  extras: ExtrasInput;
  includeConsigned: boolean;
  consigned: ConsignedInput;
}

export interface TaxBracket {
  limit: number | null;
  rate: number;
  deduction: number;
}

export interface IrBreakdown {
  salary: number;
  thirteenth: number;
  vacation: number;
  total: number;
}

export interface CalculationResult {
  grossSalary: number;
  totalExtras: number;
  extrasBreakdown: ExtrasBreakdown;
  inss: number;
  irpf: number;
  dependentsDeduction: number;
  transportVoucher: number;
  healthInsurance: number;
  otherDiscounts: number;
  familySalary: number; // Novo 2026
  netSalary: number; // Líquido Base (Antes do Consignado)
  totalDiscounts: number;
  effectiveRate: number;
  fgtsMonthly: number;
  // Consigned Fields
  maxConsignableMargin: number;
  consignedDiscount: number;
  finalNetSalary: number; // Líquido Final (Pós Consignado)
}

export interface ThirteenthResult {
  totalGross: number;
  totalExtrasAverage: number;
  extrasBreakdown: ExtrasBreakdown;
  totalNet: number; // Líquido Base
  parcel1: {
    value: number;
  };
  parcel2: {
    grossReference: number;
    inss: number;
    irpf: number;
    discountAdvance: number;
    value: number;
    // Consignado geralmente desconta na 2ª parcela
    maxMargin: number;
    consignedDiscount: number;
    finalValue: number;
  };
  finalTotalNet: number; // Total final após descontos de consignado
}

export interface TerminationResult {
  balanceSalary: number;
  noticeWarning: number;
  noticeDeduction: number;
  vacationProportional: number;
  vacationMonths: number;
  vacationPeriodLabel: string;
  vacationExpired: number;
  vacationThird: number;
  thirteenthProportional: number;
  thirteenthMonths: number;
  thirteenthPeriodLabel: string;
  thirteenthAdvanceDeduction: number;
  fgtsFine: number;
  estimatedFgtsBalance: number;
  totalFgts: number;
  totalGross: number;
  totalExtrasAverage: number;
  extrasBreakdown: ExtrasBreakdown;
  discountInss: number;
  discountIr: number;
  irBreakdown: IrBreakdown; // Detalhamento do IR (Salário, 13º, Férias)
  totalDiscounts: number;
  totalNet: number; // Líquido Base da Rescisão (TRCT)

  // Consigned Fields for Termination
  maxConsignableMargin: number; // 35% das verbas rescisórias líquidas
  consignedDiscount: number;    // Valor abatido na rescisão (TRCT)

  remainingLoanBalance: number; // Saldo devedor restante (após TRCT e FGTS)

  // Detailed FGTS Execution
  warrantyUsed: number;         // Valor da Garantia (10%) usado
  fineUsed: number;             // Valor da Multa (40%) usado
  totalFgtsDeduction: number;   // Total abatido do FGTS

  finalFgtsToWithdraw: number;  // Valor final de FGTS para sacar
  finalNetTermination: number;  // Valor a receber em mãos (TRCT Líquido Final)
}

export interface VacationResult {
  baseSalary: number;
  vacationGross: number;
  vacationThird: number;
  allowanceGross: number;
  allowanceThird: number;
  advanceThirteenth: number;
  totalGross: number;
  extrasBreakdown: ExtrasBreakdown;
  discountInss: number;
  discountIr: number;
  totalDiscounts: number;
  totalNet: number; // Base
  // Consigned
  maxConsignableMargin: number;
  consignedDiscount: number;
  finalNetVacation: number;
}

export enum CalculationStatus {
  IDLE = 'IDLE',
  CALCULATING = 'CALCULATING',
  SUCCESS = 'SUCCESS'
}

// --- NEW AI CONTEXT INTERFACE ---
export interface AIContext {
  type: 'salary' | 'vacation' | 'thirteenth' | 'termination' | 'irpf';
  gross: number;
  net: number;
  discounts: number;
  inss: number;
  extras?: number;
  // Specific fields
  monthsWorked?: number; // 13th
  daysTaken?: number; // Vacation
  terminationReason?: string; // Termination
}

// --- IRPF SIMULATOR INTERFACES ---
export interface IrpfInput {
  grossIncome: number;
  dependents: number;
  alimony: number; // Pensão Alimentícia
  otherDeductions: number; // Previdência Privada, etc
  officialPension: number; // INSS Oficial (se calculado a parte)
}

export interface IrpfResult {
  baseSalary: number;
  inssDeduction: number;
  dependentsDeduction: number;
  standardDeduction: number; // Simplificado
  legalBase: number; // Base Legal (Com todas deduções)
  simplifiedBase: number; // Base Simplificada

  // Best Option
  appliedBase: number;
  isSimplifiedBest: boolean;

  taxValue: number;
  effectiveRate: number;

  brackets: {
    limit: number;
    rate: number;
    tax: number;
  }[];
}
