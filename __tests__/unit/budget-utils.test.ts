import { describe, it, expect } from "vitest";
import {
  getMonthName,
  getMonthYearLabel,
  getDaysInMonth,
  getPreviousMonth,
  getNextMonth,
  savingsRateColor,
} from "../../lib/budget/utils";

describe("getMonthName", () => {
  it("returns January for month 1", () => {
    expect(getMonthName(1)).toBe("January");
  });

  it("returns December for month 12", () => {
    expect(getMonthName(12)).toBe("December");
  });

  it("returns July for month 7", () => {
    expect(getMonthName(7)).toBe("July");
  });
});

describe("getMonthYearLabel", () => {
  it("formats month and year into a readable label", () => {
    expect(getMonthYearLabel(3, 2025)).toBe("March 2025");
  });
});

describe("getDaysInMonth", () => {
  it("returns 29 for February in a leap year", () => {
    expect(getDaysInMonth(2, 2024)).toBe(29);
  });

  it("returns 28 for February in a non-leap year", () => {
    expect(getDaysInMonth(2, 2023)).toBe(28);
  });

  it("returns 31 for January", () => {
    expect(getDaysInMonth(1, 2024)).toBe(31);
  });

  it("returns 30 for April", () => {
    expect(getDaysInMonth(4, 2024)).toBe(30);
  });
});

describe("getPreviousMonth", () => {
  it("decrements month by 1 within the same year", () => {
    expect(getPreviousMonth(6, 2024)).toEqual({ month: 5, year: 2024 });
  });

  it("rolls over to December of the previous year from January", () => {
    expect(getPreviousMonth(1, 2024)).toEqual({ month: 12, year: 2023 });
  });
});

describe("getNextMonth", () => {
  it("increments month by 1 within the same year", () => {
    expect(getNextMonth(5, 2024)).toEqual({ month: 6, year: 2024 });
  });

  it("rolls over to January of the next year from December", () => {
    expect(getNextMonth(12, 2024)).toEqual({ month: 1, year: 2025 });
  });
});

describe("savingsRateColor", () => {
  it("returns red class for negative savings rate", () => {
    expect(savingsRateColor(-5)).toBe("text-red-600");
  });

  it("returns orange class for savings rate below 10%", () => {
    expect(savingsRateColor(5)).toBe("text-orange-500");
  });

  it("returns yellow class for savings rate between 10% and 20%", () => {
    expect(savingsRateColor(15)).toBe("text-yellow-500");
  });

  it("returns green class for savings rate 20% or above", () => {
    expect(savingsRateColor(25)).toBe("text-green-600");
  });
});
