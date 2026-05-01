"use client";

import { formatPKR, formatPercent } from "@/lib/calculators/config";
import type { SlabApplication } from "@/lib/calculators/salary-tax";

interface Props {
  slabBreakdown: SlabApplication[];
  totalTax: number;
}

export function SalaryTaxBreakdownTable({ slabBreakdown, totalTax }: Props) {
  const filledSlabs = slabBreakdown.filter((s) => s.taxableInThisSlab > 0);

  if (filledSlabs.length === 0) {
    return (
      <p className="calculator-explanation" style={{ marginTop: 0 }}>
        Your income falls within the zero-tax slab — no income tax is payable under FY 2025-26 slabs.
      </p>
    );
  }

  return (
    <table className="salary-tax-breakdown-table">
      <thead>
        <tr>
          <th>Slab</th>
          <th>Income in Slab</th>
          <th>Rate</th>
          <th>Tax</th>
        </tr>
      </thead>
      <tbody>
        {filledSlabs.map((slab) => (
          <tr key={slab.label} className={slab.isActive ? "active-slab" : ""}>
            <td>{slab.label}</td>
            <td>{formatPKR(slab.taxableInThisSlab)}</td>
            <td>{slab.rate === 0 ? "—" : formatPercent(slab.rate)}</td>
            <td>{formatPKR(slab.taxInThisSlab)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={3}>Total Tax</td>
          <td>{formatPKR(totalTax)}</td>
        </tr>
      </tfoot>
    </table>
  );
}
