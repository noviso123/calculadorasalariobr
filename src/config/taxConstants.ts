export const INSS_BRACKETS = [
  { limit: 1621.00, rate: 0.075 },
  { limit: 3080.28, rate: 0.09 },
  { limit: 4620.43, rate: 0.12 },
  { limit: 8475.55, rate: 0.14 },
];

export const DEDUCTION_PER_DEPENDENT = 189.59;
export const FAMILY_SALARY_THRESHOLD = 1980.38;
export const FAMILY_SALARY_VALUE = 67.54;
// Tabela Progressiva IRPF 2026 (Baseada em MP 1.206 - Fev/2026)
export const IRPF_BRACKETS = [
    { limit: 2259.20, rate: 0.00, deduction: 0.00 },
    { limit: 2826.65, rate: 0.075, deduction: 169.44 },
    { limit: 3751.05, rate: 0.15, deduction: 381.44 },
    { limit: 4664.68, rate: 0.225, deduction: 662.77 },
    { limit: Infinity, rate: 0.275, deduction: 896.00 }
];

export const SIMPLIFIED_DISCOUNT_VALUE = 564.80;

export const INSS_CEILING = 8475.55;
