
import { calculateSalary } from '../src/services/taxService';

// Goal: Find constants such that:
// 1. Gross 5000 (approx Net 4450) -> Tax = 0
// 2. Gross 5200 (approx Net 4620) -> Tax = 71.62

// Let's assume the rate for the first taxable bracket is 7.5% (Standard).
// Tax = (Base - Limit) * 0.075.
// For Gross 5200:
// INSS (approx) = 584.
// Base = 5200 - 584 = 4616.
// If Tax = 71.62.
// 71.62 = (4616 - Limit) * 0.075.
// 71.62 / 0.075 = 954.93.
// 4616 - Limit = 954.93.
// Limit = 4616 - 954.93 = 3661.07.

// Let's test Limit = 3661.07.
// For Gross 5000:
// INSS (approx) = 550.
// Base = 4450.
// Tax = (4450 - 3661) * 0.075 = 788 * 0.075 = 59.
// But Gross 5000 should be Exempt (0).
// Mismatch. Net Base 4450 > Limit 3661.

// Hypothesis 2: Rate is 15%?
// 71.62 = (4616 - Limit) * 0.15.
// 477.46 = 4616 - Limit.
// Limit = 4138.54.
// Test Gross 5000 (Base 4450):
// Tax = (4450 - 4138) * 0.15 = 311 * 0.15 = 46. (Still > 0).

// Hypothesis 3: The Deduction Logic is different.
// Maybe "Expanded Simplified Discount"? To Exempt 5000 (Net 4450), Discount needs to be ~2200?
// If Discount = 2200.
// Gross 5200. Base = 5200 - 2200 = 3000.
// Old Table (Limit 2259).
// Tax = (3000 * 0.075) - 169.
// 225 - 169 = 56.
// Close to 71.

// Hypothesis 4: User has dependents they didn't mention?
// If Limit = 3661 (from 7.5% calc).
// Gross 5000 -> Tax 59.
// Dependency Deduction = 189.
// If 1 Dependent? Tax 59 - (189*0.075)? No deduction reduces Base.
// If Limit is shifted.

// Let's brute force the "Simulated 2026 Brackets".
// We need constants that fit the curve.
console.log("Starting Simulation...");

const simulate = () => {
    // Current INSS (Standard)
    const inss5200 = 584.32; // Approx
    const base5200 = 5200 - inss5200; // 4615.68

    // We need Formula(4615.68) = 71.62.
    // If we assume a standard progressive form: (Base * Rate) - Deduction.

    // Try Rate 7.5%
    // (4615.68 * 0.075) - D = 71.62
    // 346.17 - D = 71.62
    // D = 274.55.

    const bracket1 = { rate: 0.075, deduction: 274.55 };
    // What corresponds to D = 274.55?
    // D = Limit * Rate.
    // Limit = 274.55 / 0.075 = 3660.66.

    // Check Gross 5000.
    const inss5000 = 551.00; // Approx
    const base5000 = 5000 - inss5000; // 4449.
    const tax5000 = (4449 * 0.075) - 274.55;
    // 333.67 - 274.55 = 59.12.
    // User expects 0.

    // Conclusion: The curve is STEEPER or Exempt Limit is Higher and 5200 hits a higher bracket instantly?
    // Or the "Discount" is the mechanism.

    // Try Rate 15%
    // (4615.68 * 0.15) - D = 71.62
    // 692.35 - D = 71.62
    // D = 620.73
    // Limit = 620.73 / 0.15 = 4138.2.
    // Check Gross 5000 (Base 4449).
    // Tax = (4449 * 0.15) - 620.73 = 667.35 - 620.73 = 46.62.
    // Still not 0, but closer.

    // Try Rate 22.5%
    // (4615.68 * 0.225) - D = 71.62
    // 1038.53 - D = 71.62
    // D = 966.91
    // Limit = 966.91 / 0.225 = 4297.37.
    // Check Gross 5000 (Base 4449).
    // Tax = (4449 * 0.225) - 966.91 = 1001.02 - 966.91 = 34.11.
    // Very close to 0.

    // Try Rate 27.5%
    // (4615.68 * 0.275) - D = 71.62
    // 1269.31 - D = 71.62
    // D = 1197.69
    // Limit = 1197.69 / 0.275 = 4355.23.
    // Check Gross 5000 (Base 4449).
    // Tax = (4449 * 0.275) - 1197.69 = 1223.47 - 1197.69 = 25.78.

    console.log("Best Fit seems to be a high Rate kicking in after a high Exemption");
    console.log("Approximated 2026 Table (Reverse Engineered):");
    console.log("Exemption Limit somewhere around 4400-4500?");

    // REALITY CHECK: Maybe 'Simplified Discount' is the key.
    // Standard Simplified Discount 2026 suggested to be R$ 900?
    // If Base = 5200 - 900 = 4300.
    // Old Table (Limit 2259).
    // Tax on 4300 is high.

    // What if the table is shifted by inflation?
    // Current Exempt 2259.
    // Promise: 5000.
    // Ratio 2.2x.
    // If 5200 is comparable to 2350 in old money?
    // Tax on 2350 is small.
}

simulate();
