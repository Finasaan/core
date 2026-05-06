import { describe, it, expect } from "vitest";
import {
  calculateCompound,
  generateGrowthData,
} from "../../lib/calculators/returns";

describe("calculateCompound", () => {
  it("grows principal correctly with no contributions", () => {
    // 100,000 at 12% annual for 1 year, monthly compounding
    const result = calculateCompound({
      principal: 100_000,
      annualRate: 0.12,
      years: 1,
    });
    // monthlyRate = 0.01, 12 months → 100,000 × (1.01)^12 ≈ 112,683
    expect(result.finalValue).toBeGreaterThan(112_000);
    expect(result.finalValue).toBeLessThan(113_000);
  });

  it("adds monthly contributions to the final value", () => {
    const withContrib = calculateCompound({
      principal: 100_000,
      annualRate: 0.10,
      years: 10,
      monthlyContribution: 5_000,
    });
    const withoutContrib = calculateCompound({
      principal: 100_000,
      annualRate: 0.10,
      years: 10,
    });
    expect(withContrib.finalValue).toBeGreaterThan(withoutContrib.finalValue);
    expect(withContrib.totalContributions).toBe(100_000 + 5_000 * 120);
  });

  it("returns zero interest when rate is zero", () => {
    const result = calculateCompound({
      principal: 50_000,
      annualRate: 0,
      years: 5,
    });
    expect(result.totalInterest).toBe(0);
    expect(result.finalValue).toBe(50_000);
  });

  it("returns zero output for negative principal", () => {
    const result = calculateCompound({
      principal: -10_000,
      annualRate: 0.1,
      years: 5,
    });
    expect(result.finalValue).toBe(0);
    expect(result.totalInterest).toBe(0);
  });

  it("effectiveAnnualGrowth is positive for non-zero rate and years", () => {
    const result = calculateCompound({
      principal: 100_000,
      annualRate: 0.08,
      years: 5,
    });
    expect(result.effectiveAnnualGrowth).toBeGreaterThan(0);
  });
});

describe("generateGrowthData", () => {
  it("starts at year 0 with the principal as value", () => {
    const data = generateGrowthData({
      principal: 200_000,
      annualRate: 0.10,
      years: 3,
    });
    expect(data[0].year).toBe(0);
    expect(data[0].value).toBe(200_000);
    expect(data[0].contributions).toBe(200_000);
  });

  it("returns empty array when years is 0", () => {
    const data = generateGrowthData({
      principal: 50_000,
      annualRate: 0.1,
      years: 0,
    });
    expect(data).toHaveLength(0);
  });

  it("grows monotonically with positive rate", () => {
    const data = generateGrowthData({
      principal: 100_000,
      annualRate: 0.12,
      years: 5,
    });
    for (let i = 1; i < data.length; i++) {
      expect(data[i].value).toBeGreaterThan(data[i - 1].value);
    }
  });
});
