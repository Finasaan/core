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

// ============================================================
// Salary Tax — FY 2025-26 (Finance Act 2025)
// Source: FBR Income Tax Ordinance 2001, Second Schedule, Part I
// ============================================================

export interface SalaryTaxSlab {
  min: number;          // minimum annual income for this slab (inclusive)
  max: number | null;   // maximum annual income (exclusive); null = no upper limit
  baseTax: number;      // fixed tax owed on income up to this slab's min
  rate: number;         // marginal rate applied to income exceeding min
  label: string;        // display label shown in slab breakdown table
}

export const SALARY_TAX_SLABS_FY2526: SalaryTaxSlab[] = [
  { min: 0,         max: 600_000,   baseTax: 0,       rate: 0.000, label: "Up to 6 Lac"  },
  { min: 600_000,   max: 1_200_000, baseTax: 0,       rate: 0.025, label: "6L – 12L"     },
  { min: 1_200_000, max: 2_200_000, baseTax: 6_000,   rate: 0.110, label: "12L – 22L"    },
  { min: 2_200_000, max: 3_200_000, baseTax: 116_000, rate: 0.230, label: "22L – 32L"    },
  { min: 3_200_000, max: 4_100_000, baseTax: 346_000, rate: 0.300, label: "32L – 41L"    },
  { min: 4_100_000, max: null,      baseTax: 616_000, rate: 0.350, label: "Above 41L"    },
];

// Max pension contribution eligible for tax credit as a fraction of taxable income.
// FBR allows 20% for age < 40, 30% for 40–50, 40% for 50+.
// We use 20% as the conservative/default cap. Users who know their age tier can mentally adjust.
export const PENSION_CREDIT_CAP_RATE = 0.20;

