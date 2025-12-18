/**
 * Pakistan Tax Calculators - Pure Functions
 */

import { CGT_RATES, DIVIDEND_TAX_RATES, PENSION_CREDIT, formatPKR, formatPercent } from "./config";

// Capital Gains Tax
export interface CGTInput {
    purchaseValue: number;
    saleValue: number;
    holdingPeriodYears: number;
    isFiler: boolean;
}

export interface CGTResult {
    gain: number;
    taxRate: number;
    taxAmount: number;
    netProceeds: number;
    holdingCategory: string;
    isExempt: boolean;
    explanation: string;
}

export function calculateCapitalGainsTax(input: CGTInput): CGTResult {
    const { purchaseValue, saleValue, holdingPeriodYears, isFiler } = input;
    const gain = saleValue - purchaseValue;

    if (gain <= 0) {
        return {
            gain,
            taxRate: 0,
            taxAmount: 0,
            netProceeds: saleValue,
            holdingCategory: "N/A",
            isExempt: true,
            explanation: "No tax applicable on capital losses.",
        };
    }

    const bracket = CGT_RATES.find(b =>
        holdingPeriodYears >= b.minYears &&
        (b.maxYears === null || holdingPeriodYears < b.maxYears)
    );

    if (!bracket) {
        return { gain, taxRate: 0, taxAmount: 0, netProceeds: saleValue, holdingCategory: "Unknown", isExempt: true, explanation: "Unable to determine tax bracket." };
    }

    const taxRate = isFiler ? bracket.filerRate : bracket.nonFilerRate;
    const taxAmount = Math.round(gain * taxRate);
    const netProceeds = saleValue - taxAmount;
    const isExempt = taxRate === 0;

    const explanation = isExempt
        ? `Holdings over 2 years are exempt from CGT for resident investors.`
        : `${isFiler ? "Filer" : "Non-filer"} rate of ${formatPercent(taxRate)} applies for ${bracket.label.toLowerCase()} holding period.`;

    return { gain, taxRate, taxAmount, netProceeds, holdingCategory: bracket.label, isExempt, explanation };
}

// Dividend Tax
export interface DividendTaxInput {
    dividendAmount: number;
    isFiler: boolean;
}

export interface DividendTaxResult {
    grossDividend: number;
    taxRate: number;
    taxWithheld: number;
    netReceived: number;
    explanation: string;
}

export function calculateDividendTax(input: DividendTaxInput): DividendTaxResult {
    const { dividendAmount, isFiler } = input;
    const taxRate = isFiler ? DIVIDEND_TAX_RATES.filer : DIVIDEND_TAX_RATES.nonFiler;
    const taxWithheld = Math.round(dividendAmount * taxRate);
    const netReceived = dividendAmount - taxWithheld;

    return {
        grossDividend: dividendAmount,
        taxRate,
        taxWithheld,
        netReceived,
        explanation: `Dividend withholding tax for ${isFiler ? "filers" : "non-filers"} is ${formatPercent(taxRate)}. This is withheld at source.`,
    };
}

// Pension Tax Credit
export interface PensionCreditInput {
    contributionAmount: number;
    taxableIncome: number;
}

export interface PensionCreditResult {
    contribution: number;
    eligibleAmount: number;
    taxCredit: number;
    effectiveCost: number;
    explanation: string;
}

export function calculatePensionCredit(input: PensionCreditInput): PensionCreditResult {
    const { contributionAmount, taxableIncome } = input;

    const maxEligible = taxableIncome * PENSION_CREDIT.maxCreditRate;
    const eligibleAmount = Math.min(contributionAmount, maxEligible);
    const estimatedTaxRate = 0.15;
    const taxCredit = Math.round(eligibleAmount * estimatedTaxRate);
    const effectiveCost = contributionAmount - taxCredit;

    const explanation = contributionAmount > maxEligible
        ? `Only ${formatPKR(maxEligible)} of your contribution qualifies for tax credit (30% of taxable income). Estimated credit: ${formatPKR(taxCredit)}.`
        : `Full contribution qualifies for tax credit. Estimated tax benefit: ${formatPKR(taxCredit)}.`;

    return { contribution: contributionAmount, eligibleAmount: Math.round(eligibleAmount), taxCredit, effectiveCost: Math.round(effectiveCost), explanation };
}
