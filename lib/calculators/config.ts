/**
 * Pakistan Financial & Tax Configuration (2025)
 * All rates centralized here for easy updates
 */

// Capital Gains Tax (CGT) - Stocks & Equity Funds
export interface CGTRateBracket {
    minYears: number;
    maxYears: number | null;
    filerRate: number;
    nonFilerRate: number;
    label: string;
}

export const CGT_RATES: CGTRateBracket[] = [
    { minYears: 0, maxYears: 1, filerRate: 0.15, nonFilerRate: 0.30, label: "Less than 1 year" },
    { minYears: 1, maxYears: 2, filerRate: 0.125, nonFilerRate: 0.30, label: "1-2 years" },
    { minYears: 2, maxYears: null, filerRate: 0, nonFilerRate: 0, label: "More than 2 years" },
];

// Dividend Withholding Tax (DWT)
export const DIVIDEND_TAX_RATES = {
    filer: 0.15,
    nonFiler: 0.30,
};

// Pension Tax Credit
export const PENSION_CREDIT = {
    maxCreditRate: 0.30,
};

// Default Return Rates (for suggestions)
export const SUGGESTED_RETURNS = {
    stocks: 0.12,
    indexFunds: 0.10,
    cashFunds: 0.08,
    pensionFunds: 0.10,
};

// Formatting Helpers
export const formatPKR = (amount: number): string => {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatPercent = (rate: number): string => {
    return `${(rate * 100).toFixed(1)}%`;
};
