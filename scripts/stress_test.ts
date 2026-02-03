
import { calculateSalary, calculateTermination, calculateVacation, calculateThirteenth } from '../src/services/taxService';
import { SalaryInput, TerminationInput, VacationInput, ThirteenthInput } from '../src/types';

console.log("=== INICIANDO STRESS TEST MATEMÁTICO (2026) - MASSIVO ===");

// ---------------------------------------------
// 1. SALÁRIO E SALÁRIO FAMÍLIA
// ---------------------------------------------
console.log("\n>>> MÓDULO: CÁLCULO DE SALÁRIO MENSAL");

const salaryScenarios = [
    {
        name: "Cenário 1a: Salário Mínimo (R$ 1.621,00) - Simples",
        input: {
            grossSalary: 1621.00,
            otherDiscounts: 0,
            dependents: 0,
            includeTransportVoucher: false,
            transportVoucherPercent: 6,
            workDays: 22,
            includeExtras: false,
            includeConsigned: false,
            includeDependents: false
        } as SalaryInput,
        expectedInss: 121.58,
        expectedFamilySalary: 0
    },
    {
        name: "Cenário 1b: Salário Mínimo + 2 Filhos (Salário Família)",
        input: {
            grossSalary: 1621.00,
            otherDiscounts: 0,
            dependents: 2,
            includeTransportVoucher: false,
            transportVoucherPercent: 6,
            workDays: 22,
            includeExtras: false,
            includeConsigned: false,
            includeDependents: true
        } as SalaryInput,
        expectedInss: 121.58,
        expectedFamilySalary: 135.08 // 67.54 * 2 = 135.08
    },
    {
        name: "Cenário 2: Isenção IR (R$ 5.000,00)",
        input: {
            grossSalary: 5000.00,
            otherDiscounts: 0,
            dependents: 0,
            includeTransportVoucher: false,
            transportVoucherPercent: 6,
            workDays: 22,
            includeExtras: false,
            includeConsigned: false,
            includeDependents: false
        } as SalaryInput,
        expectedInss: 490.87,
        expectedFamilySalary: 0
    },
    {
        name: "Cenário 3: Alta Renda (R$ 10.000,00)",
        input: {
            grossSalary: 10000.00,
            otherDiscounts: 0,
            dependents: 0,
            includeTransportVoucher: false,
            transportVoucherPercent: 6,
            workDays: 22,
            includeExtras: false, // Sem hora extra
            includeConsigned: false,
            includeDependents: false
        } as SalaryInput,
        expectedInss: 977.45,
        expectedFamilySalary: 0
    }
];

salaryScenarios.forEach(scenario => {
    console.log(`\nTestando: ${scenario.name}`);
    const result = calculateSalary(scenario.input);

    // Validation Logic
    if (Math.abs(result.inss - scenario.expectedInss) < 0.02) {
         console.log(`✅ INSS OK (R$ ${result.inss})`);
    } else {
         console.error(`❌ ERRO INSS (Esperado ${scenario.expectedInss}, Deu ${result.inss})`);
    }

    if (scenario.name.includes("Salário Família")) {
         if (result.familySalary && Math.abs(result.familySalary - scenario.expectedFamilySalary) < 0.02) {
             console.log(`✅ Salário Família OK (R$ ${result.familySalary})`);
        } else {
             console.error(`❌ Salário Família ERRO (Esperado ${scenario.expectedFamilySalary}, Deu ${result.familySalary})`);
        }
    }
});


// ---------------------------------------------
// 2. FÉRIAS
// ---------------------------------------------
console.log("\n>>> MÓDULO: CÁLCULO DE FÉRIAS");

const vacationScenario = {
    grossSalary: 3000.00,
    daysTaken: 30,
    sellDays: false,
    daysSold: 0,
    advanceThirteenth: false,
    includeDependents: false,
    dependents: 0,
    includeExtras: false,
    extras: { workload: 220, hours50: 0, hours100: 0, hoursNight: 0, hoursStandby: 0, hoursInterjornada: 0, includeDsr: false },
    includeConsigned: false,
    consigned: { monthlyInstallment: 0, outstandingBalance: 0, hasFgtsWarranty: false, fgtsBalance: 0 }
} as VacationInput;

const vacResult = calculateVacation(vacationScenario);
// Bruto 30 dias = 3000. 1/3 = 1000. Total Bruto = 4000.
// INSS sobre 4000:
// 1621*0.075 = 121.58
// (3080.28-1621)*0.09 = 131.34
// (3864.80-3080.28)*0.12 = 94.14 -> Wait, table is: 1621, 3080.28, 4620.43?
// Let's re-verify table in code. Code has INSS_BRACKETS.
// Bracket 3 limit is 4620.43. So 4000 falls in Bracket 3 (12%).
// (4000 - 3080.28) * 0.12 = 919.72 * 0.12 = 110.37
// Total expected INSS = 121.58 + 131.34 + 110.37 = 363.29
console.log(`Férias Brutas (30d): R$ ${vacResult.totalGross.toFixed(2)}`);
console.log(`INSS Férias: R$ ${vacResult.discountInss.toFixed(2)}`);
if(Math.abs(vacResult.discountInss - 363.29) < 0.10) console.log("✅ INSS Férias OK");
else console.error("❌ ERRO INSS Férias (Esperado ~363.29)");


// ---------------------------------------------
// 3. DÉCIMO TERCEIRO (13º)
// ---------------------------------------------
console.log("\n>>> MÓDULO: 13º SALÁRIO");

const thirteenthScenario = {
    grossSalary: 3000.00,
    monthsWorked: 12,
    includeDependents: false,
    dependents: 0,
    includeExtras: false,
    extras: { workload: 220, hours50: 0, hours100: 0, hoursNight: 0, hoursStandby: 0, hoursInterjornada: 0, includeDsr: false },
    includeConsigned: false,
    consigned: { monthlyInstallment: 0, outstandingBalance: 0, hasFgtsWarranty: false, fgtsBalance: 0 }
} as ThirteenthInput;

const decResult = calculateThirteenth(thirteenthScenario);
console.log(`1ª Parcela (50% Bruto): R$ ${decResult.parcel1.value.toFixed(2)}`);
if(decResult.parcel1.value === 1500) console.log("✅ 1ª Parcela OK (Sem descontos)");
else console.error("❌ Erro 1ª Parcela");

console.log(`2ª Parcela (Líquido - Adiantamento): R$ ${decResult.parcel2.finalValue.toFixed(2)}`);


// ---------------------------------------------
// 4. RESCISÃO & CONSIGNADO
// ---------------------------------------------
console.log("\n>>> MÓDULO: RESCISÃO & CONSIGNADO");

const terminationScenario = {
    name: "Cenário 4: Rescisão com Consignado (Garantia FGTS)",
    input: {
        startDate: "2021-01-01",
        endDate: "2026-01-01",
        grossSalary: 3000.00,
        reason: "dismissal_no_cause",
        noticeStatus: "indemnified",
        includeConsigned: true,
        consigned: {
            monthlyInstallment: 500, // Parcela de 500 (dentro da margem)
            outstandingBalance: 15000, // Saldo Devedor alto
            hasFgtsWarranty: true,
            fgtsBalance: 20000 // Saldo FGTS acumulado
        },
        includeExtras: false,
        includeDependents: false,
        thirteenthAdvancePaid: false,
        hasExpiredVacation: false
    } as TerminationInput
};

const termResult = calculateTermination(terminationScenario.input);
console.log(`Líquido TRCT: R$ ${termResult.totalNet.toFixed(2)}`);
console.log(`Desconto Consignado TRCT: R$ ${termResult.consignedDiscount.toFixed(2)}`);
console.log(`Garantia FGTS Usada: R$ ${termResult.warrantyUsed.toFixed(2)}`);
if(termResult.consignedDiscount > 0 && termResult.warrantyUsed > 0) console.log("✅ Consignado Rescisão OK");
