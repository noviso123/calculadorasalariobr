
import { calculateSalary, calculateTermination, calculateThirteenth, calculateVacation } from '../src/services/taxService';
import { ExtrasInput, ConsignedInput } from '../src/types';

const assert = (condition: boolean, message: string) => {
    if (!condition) {
        console.error(`❌ FAILED: ${message}`);
        process.exitCode = 1;
    } else {
        console.log(`✅ PASS: ${message}`);
    }
};

const mockExtras: ExtrasInput = {
    workload: 220, hours50: 0, hours100: 0, hoursNight: 0, hoursStandby: 0, hoursInterjornada: 0, includeDsr: false
};
const mockConsigned: ConsignedInput = {
    monthlyInstallment: 0, outstandingBalance: 0, hasFgtsWarranty: false, fgtsBalance: 0
};

console.log("=== STARTING LOGIC VERIFICATION ===");

// 1. Basic Salary Calculation (2026 Rules)
// Minimum Wage: 1621.00
const salaryMin = calculateSalary({
    grossSalary: 1621.00,
    includeDependents: false, dependents: 0, otherDiscounts: 0, healthInsurance: 0,
    includeTransportVoucher: false, transportVoucherPercent: 6,
    includeExtras: false, extras: mockExtras,
    includeConsigned: false, consigned: mockConsigned
});

// INSS expected: 1621 * 0.075 = 121.575 -> 121.58 (Round Half Up) OR 121.57 depending on logic.
// Logic uses roundHelper with bias.
assert(salaryMin.inss > 121.55 && salaryMin.inss < 121.60, `Minimum Wage INSS around 121.58. Got: ${salaryMin.inss}`);
assert(salaryMin.irpf === 0, `Minimum Wage Exempt from IR. Got: ${salaryMin.irpf}`);

// 2. High Salary (Ceiling)
const salaryHigh = calculateSalary({
    grossSalary: 10000.00,
    includeDependents: false, dependents: 0, otherDiscounts: 0, healthInsurance: 0,
    includeTransportVoucher: false, transportVoucherPercent: 6,
    includeExtras: false, extras: mockExtras,
    includeConsigned: false, consigned: mockConsigned
});

// Ceiling is 8475.55. Max INSS should be fixed.
// Bracket 1: 1621 * 0.075 = 121.575
// Bracket 2: (3080.28 - 1621) * 0.09 = 131.3352
// Bracket 3: (4620.43 - 3080.28) * 0.12 = 184.818
// Bracket 4: (8475.55 - 4620.43) * 0.14 = 539.7168
// Total Max INSS approx 977.44
assert(salaryHigh.inss > 977.40 && salaryHigh.inss < 977.50, `Ceiling INSS around 977.45. Got: ${salaryHigh.inss}`);
assert(salaryHigh.irpf > 0, `High Salary pays IR. Got: ${salaryHigh.irpf}`);

// 3. Dependents Logic
const oneDependent = calculateSalary({
    grossSalary: 6000.00,
    includeDependents: true, dependents: 1, otherDiscounts: 0, healthInsurance: 0,
    includeTransportVoucher: false, transportVoucherPercent: 6,
    includeExtras: false, extras: mockExtras,
    includeConsigned: false, consigned: mockConsigned
});
const noDependent = calculateSalary({
    grossSalary: 6000.00,
    includeDependents: false, dependents: 0, otherDiscounts: 0, healthInsurance: 0,
    includeTransportVoucher: false, transportVoucherPercent: 6,
    includeExtras: false, extras: mockExtras,
    includeConsigned: false, consigned: mockConsigned
});

assert(oneDependent.irpf < noDependent.irpf, `Dependent should reduce IR. One: ${oneDependent.irpf}, None: ${noDependent.irpf}`);

// 4. Vacation 1/3
const vacation = calculateVacation({
    grossSalary: 3000.00,
    includeDependents: false, dependents: 0,
    daysTaken: 30, sellDays: false, daysSold: 0,
    advanceThirteenth: false,
    includeExtras: false, extras: mockExtras,
    includeConsigned: false, consigned: mockConsigned
});

assert(vacation.vacationGross === 3000.00, `Vacation Gross = Salary for 30 days. Got: ${vacation.vacationGross}`);
assert(vacation.vacationThird === 1000.00, `Vacation Third = 1000. Got: ${vacation.vacationThird}`);

console.log("=== END VERIFICATION ===");
