
import { calculateSalary } from '../src/services/taxService';

console.log("=== VERIFICANDO REFORMA TRIBUTÁRIA 2026 ===");

// 1. ISENÇÃO TOTAL (R$ 5.000)
const s1 = calculateSalary({
    grossSalary: 5000, dependents: 0, otherDiscounts: 0,
    includeTransportVoucher: false, includeExtras: false, includeConsigned: false, includeDependents: false
} as any);
console.log(`Cenário 1 (5000): IR Esperado 0.00 | Obtido: ${s1.irpf}`);

// 2. FAIXA DE TRANSIÇÃO (R$ 5.200) -> Esperado ~71.62
const s2 = calculateSalary({
    grossSalary: 5200, dependents: 0, otherDiscounts: 0,
    includeTransportVoucher: false, includeExtras: false, includeConsigned: false, includeDependents: false
} as any);
console.log(`Cenário 2 (5200): IR Esperado ~71.62 | Obtido: ${s2.irpf}`);

// 3. FAIXA PADRÃO (R$ 10.000) -> Esperado Legal
const s3 = calculateSalary({
    grossSalary: 10000, dependents: 0, otherDiscounts: 0,
    includeTransportVoucher: false, includeExtras: false, includeConsigned: false, includeDependents: false
} as any);
console.log(`Cenário 3 (10000): IR Padrão (Legal) | Obtido: ${s3.irpf}`);
