"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CalculatorShell,
  CalculatorInput,
  CalculatorResult,
  CalculatorResultsCard,
  SalaryTaxBreakdownTable,
  SalaryTaxProjectionChart,
} from "@/components/calculators";
import { calculateSalaryTax, projectSalaryTax } from "@/lib/calculators/salary-tax";
import { formatPKR, formatPercent } from "@/lib/calculators/config";

type SalaryMode = "monthly" | "annual";

export default function SalaryTaxCalculatorPage() {
  const [inputMode,        setInputMode]        = useState<SalaryMode>("monthly");
  const [salaryInput,      setSalaryInput]      = useState(150_000);
  const [pensionContrib,   setPensionContrib]   = useState(0);
  const [zakatPaid,        setZakatPaid]        = useState(0);
  const [growthRate,       setGrowthRate]       = useState(10);
  const [projectionYears,  setProjectionYears]  = useState(10);

  const annualGross = inputMode === "monthly" ? salaryInput * 12 : salaryInput;

  const result = useMemo(
    () =>
      calculateSalaryTax({
        annualGrossSalary:   annualGross,
        pensionContribution: pensionContrib,
        zakatPaid,
      }),
    [annualGross, pensionContrib, zakatPaid]
  );

  const projectionData = useMemo(
    () =>
      projectSalaryTax(
        { annualGrossSalary: annualGross, pensionContribution: pensionContrib, zakatPaid },
        growthRate / 100,
        projectionYears
      ),
    [annualGross, pensionContrib, zakatPaid, growthRate, projectionYears]
  );

  return (
    <>
      {/* Page header */}
      <header className="dashboard-header">
        <Link href="/dashboard/calculators" className="stock-back-link">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Calculators
        </Link>
        <h1 className="dashboard-greeting" style={{ marginTop: 16 }}>
          Salary Tax Calculator
        </h1>
        <p className="dashboard-date">FY 2025-26 · Pakistan FBR · Salaried Individuals</p>
      </header>

      {/* Two-column: inputs | results + slab table */}
      <div className="salary-calculator-layout">

        {/* LEFT COLUMN — Inputs */}
        <CalculatorShell
          title="Your Salary"
          description="Enter your gross salary and any eligible deductions"
        >
          {/* Monthly / Annual toggle */}
          <div className="calculator-input-group">
            <label className="calculator-input-label">Salary Period</label>
            <div className="calculator-pills">
              <button
                className={`calculator-pill ${inputMode === "monthly" ? "active" : ""}`}
                onClick={() => setInputMode("monthly")}
              >
                Monthly
              </button>
              <button
                className={`calculator-pill ${inputMode === "annual" ? "active" : ""}`}
                onClick={() => setInputMode("annual")}
              >
                Annual
              </button>
            </div>
          </div>

          <CalculatorInput
            label={inputMode === "monthly" ? "Monthly Gross Salary" : "Annual Gross Salary"}
            value={salaryInput}
            onChange={setSalaryInput}
            prefix="PKR"
            step={inputMode === "monthly" ? 5_000 : 60_000}
            min={0}
            helper={
              inputMode === "monthly"
                ? `Annual equivalent: ${formatPKR(salaryInput * 12)}`
                : `Monthly equivalent: ${formatPKR(Math.round(salaryInput / 12))}`
            }
          />

          <CalculatorInput
            label="Annual Pension Contribution"
            value={pensionContrib}
            onChange={setPensionContrib}
            prefix="PKR"
            step={10_000}
            min={0}
            helper="Voluntary pension contribution — earns a tax credit (ITO 2001 Sec. 63)"
          />

          <CalculatorInput
            label="Annual Zakat Paid"
            value={zakatPaid}
            onChange={setZakatPaid}
            prefix="PKR"
            step={5_000}
            min={0}
            helper="Deductible directly from taxable income (ITO 2001 Sec. 60)"
          />
        </CalculatorShell>

        {/* RIGHT COLUMN — Results + Slab Table */}
        <div>
          <CalculatorResultsCard
            title="Tax Summary"
            note="Estimate only. Based on FY 2025-26 FBR salary slabs. Actual liability may differ with other allowances or surcharges."
          >
            <CalculatorResult
              label="Annual Gross Salary"
              value={formatPKR(result.grossAnnual)}
            />
            {result.zakatDeduction > 0 && (
              <CalculatorResult
                label="Zakat Deduction"
                value={`− ${formatPKR(result.zakatDeduction)}`}
                tooltip="Deducted from gross income before tax calculation"
              />
            )}
            <CalculatorResult
              label="Taxable Income"
              value={formatPKR(result.taxableIncome)}
            />
            <CalculatorResult
              label="Gross Tax"
              value={formatPKR(result.grossTax)}
              tooltip="Tax before pension credit is applied"
            />
            {result.pensionRebate > 0 && (
              <CalculatorResult
                label="Pension Tax Credit"
                value={`− ${formatPKR(result.pensionRebate)}`}
                tooltip={`Eligible amount: ${formatPKR(result.pensionEligible)} (max 20% of taxable income)`}
              />
            )}
            <CalculatorResult
              label="Net Annual Tax"
              value={formatPKR(result.netAnnualTax)}
              highlight
            />
            <CalculatorResult
              label="Monthly Tax Deduction"
              value={formatPKR(result.monthlyTax)}
            />
            <CalculatorResult
              label="Effective Tax Rate"
              value={formatPercent(result.effectiveRate)}
              tooltip="Net annual tax ÷ gross annual salary"
            />
            <CalculatorResult
              label="Net Monthly Take-Home"
              value={formatPKR(result.netMonthlyTakeHome)}
              highlight
              size="large"
            />
          </CalculatorResultsCard>

          {/* Slab breakdown */}
          <div
            className="calculator-shell"
            style={{ marginTop: 16, paddingTop: 20, paddingBottom: 20 }}
          >
            <div
              className="calculator-header"
              style={{ marginBottom: 0, paddingBottom: 12 }}
            >
              <h2 className="calculator-title" style={{ fontSize: 16 }}>
                Tax Slab Breakdown
              </h2>
              <p className="calculator-description">
                How your income is distributed across FBR slabs
              </p>
            </div>
            <SalaryTaxBreakdownTable
              slabBreakdown={result.slabBreakdown}
              totalTax={result.netAnnualTax}
            />
          </div>

          <p className="calculator-explanation" style={{ marginTop: 16 }}>
            {result.explanation}
          </p>
        </div>
      </div>

      {/* Projection — full width */}
      <div className="calculator-shell" style={{ marginTop: 24 }}>
        <div className="calculator-header">
          <h2 className="calculator-title">Salary Growth Projection</h2>
          <p className="calculator-description">
            How your take-home and tax burden evolve as your salary grows year over year
          </p>
        </div>
        <div className="calculator-inputs">
          <CalculatorInput
            label="Annual Salary Growth Rate"
            value={growthRate}
            onChange={setGrowthRate}
            suffix="%"
            step={1}
            min={0}
            max={30}
            helper="Expected yearly salary increase"
          />
          <CalculatorInput
            label="Years to Project"
            value={projectionYears}
            onChange={setProjectionYears}
            suffix="years"
            step={1}
            min={1}
            max={20}
            helper="Number of years to forecast"
          />
        </div>
        <SalaryTaxProjectionChart data={projectionData} />
      </div>
    </>
  );
}
