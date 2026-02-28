/**
 * Investment Returns Calculator - Pure Functions
 * Compounding with optional monthly contributions
 */

export interface CompoundingInput {
    principal: number;
    annualRate: number;
    years: number;
    monthlyContribution?: number;
}

export interface CompoundingResult {
    finalValue: number;
    totalContributions: number;
    totalInterest: number;
    effectiveAnnualGrowth: number;
}

export interface GrowthDataPoint {
    year: number;
    value: number;
    contributions: number;
}

/**
 * Calculate compounding returns with optional monthly contributions
 */
export function calculateCompound(input: CompoundingInput): CompoundingResult {
    const { principal, annualRate, years, monthlyContribution = 0 } = input;

    if (principal < 0 || annualRate < 0 || years < 0 || monthlyContribution < 0) {
        return {
            finalValue: 0,
            totalContributions: principal,
            totalInterest: 0,
            effectiveAnnualGrowth: 0,
        };
    }

    const monthlyRate = annualRate / 12;
    const totalMonths = years * 12;

    const principalFV = principal * Math.pow(1 + monthlyRate, totalMonths);

    let contributionsFV = 0;
    if (monthlyContribution > 0 && monthlyRate > 0) {
        contributionsFV = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    } else if (monthlyContribution > 0) {
        contributionsFV = monthlyContribution * totalMonths;
    }

    const finalValue = principalFV + contributionsFV;
    const totalContributions = principal + (monthlyContribution * totalMonths);
    const totalInterest = finalValue - totalContributions;

    let effectiveAnnualGrowth = 0;
    if (totalContributions > 0 && years > 0) {
        effectiveAnnualGrowth = (Math.pow(finalValue / totalContributions, 1 / years) - 1);
    }

    return {
        finalValue: Math.round(finalValue),
        totalContributions: Math.round(totalContributions),
        totalInterest: Math.round(totalInterest),
        effectiveAnnualGrowth,
    };
}

/**
 * Generate year-by-year growth data for charting
 */
export function generateGrowthData(input: CompoundingInput): GrowthDataPoint[] {
    const { principal, annualRate, years, monthlyContribution = 0 } = input;
    const data: GrowthDataPoint[] = [];

    if (years <= 0) return data;

    const monthlyRate = annualRate / 12;

    for (let year = 0; year <= years; year++) {
        const months = year * 12;

        const principalFV = principal * Math.pow(1 + monthlyRate, months);

        let contributionsFV = 0;
        if (monthlyContribution > 0 && monthlyRate > 0 && months > 0) {
            contributionsFV = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        } else if (monthlyContribution > 0) {
            contributionsFV = monthlyContribution * months;
        }

        data.push({
            year,
            value: Math.round(principalFV + contributionsFV),
            contributions: Math.round(principal + (monthlyContribution * months)),
        });
    }

    return data;
}
