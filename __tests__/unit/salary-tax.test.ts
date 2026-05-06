import { describe, it, expect } from "vitest";
import {
  calculateSalaryTax,
  projectSalaryTax,
} from "../../lib/calculators/salary-tax";

describe("calculateSalaryTax", () => {
  it("returns zero tax for income below 600,000", () => {
    const result = calculateSalaryTax({
      annualGrossSalary: 400_000,
      pensionContribution: 0,
      zakatPaid: 0,
    });
    expect(result.netAnnualTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
    expect(result.grossTax).toBe(0);
  });

  it("returns zero tax at exactly the 600,000 slab boundary", () => {
    const result = calculateSalaryTax({
      annualGrossSalary: 600_000,
      pensionContribution: 0,
      zakatPaid: 0,
    });
    // Exactly at 600k the marginal slab is 6L–12L (rate 2.5%) but the
    // taxable portion above 600k is zero, so no tax is owed.
    expect(result.netAnnualTax).toBe(0);
    expect(result.grossTax).toBe(0);
  });

  it("calculates 2.5% marginal rate in the 6L–12L slab", () => {
    // 900,000 gross → 300,000 above 600,000 at 2.5% = 7,500
    const result = calculateSalaryTax({
      annualGrossSalary: 900_000,
      pensionContribution: 0,
      zakatPaid: 0,
    });
    expect(result.grossTax).toBe(7_500);
    expect(result.marginalRate).toBe(0.025);
  });

  it("calculates correct gross tax in the 12L–22L slab", () => {
    // baseTax = 6,000 + (1,500,000 - 1,200,000) × 0.11 = 33,000 → total 39,000
    const result = calculateSalaryTax({
      annualGrossSalary: 1_500_000,
      pensionContribution: 0,
      zakatPaid: 0,
    });
    expect(result.grossTax).toBe(39_000);
    expect(result.marginalRate).toBe(0.11);
  });

  it("applies zakat deduction before computing taxable income", () => {
    // 900,000 - 100,000 zakat = 800,000 taxable → (200,000 × 0.025) = 5,000
    const result = calculateSalaryTax({
      annualGrossSalary: 900_000,
      pensionContribution: 0,
      zakatPaid: 100_000,
    });
    expect(result.zakatDeduction).toBe(100_000);
    expect(result.taxableIncome).toBe(800_000);
    expect(result.grossTax).toBe(5_000);
  });

  it("pension contribution reduces net tax via rebate", () => {
    const without = calculateSalaryTax({
      annualGrossSalary: 1_500_000,
      pensionContribution: 0,
      zakatPaid: 0,
    });
    const withPension = calculateSalaryTax({
      annualGrossSalary: 1_500_000,
      pensionContribution: 150_000,
      zakatPaid: 0,
    });
    expect(withPension.pensionRebate).toBeGreaterThan(0);
    expect(withPension.netAnnualTax).toBeLessThan(without.netAnnualTax);
  });

  it("net monthly take-home equals (gross - tax) / 12", () => {
    const result = calculateSalaryTax({
      annualGrossSalary: 1_200_000,
      pensionContribution: 0,
      zakatPaid: 0,
    });
    expect(result.netMonthlyTakeHome).toBe(
      Math.round((result.grossAnnual - result.netAnnualTax) / 12)
    );
  });
});

describe("projectSalaryTax", () => {
  it("returns the requested number of years", () => {
    const points = projectSalaryTax(
      { annualGrossSalary: 1_200_000, pensionContribution: 0, zakatPaid: 0 },
      0.1,
      5
    );
    expect(points).toHaveLength(5);
    expect(points[0].year).toBe(1);
    expect(points[4].year).toBe(5);
  });
});
