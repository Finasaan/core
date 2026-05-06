import { describe, it, expect } from "vitest";
import {
  sma,
  ema,
  rsi,
  macd,
  bollingerBands,
  vwap,
  atr,
} from "../../lib/indicators/calculations";

const prices = [10, 11, 12, 11, 10, 9, 10, 11, 12, 13, 14, 13, 12, 11, 10];

describe("sma", () => {
  it("returns null for the first (period - 1) values", () => {
    const result = sma([1, 2, 3, 4, 5], 3);
    expect(result[0]).toBeNull();
    expect(result[1]).toBeNull();
    expect(result[2]).toBe(2); // (1+2+3)/3
  });

  it("computes a 3-period SMA correctly on known data", () => {
    const result = sma([2, 4, 6, 8], 3);
    expect(result[2]).toBeCloseTo(4); // (2+4+6)/3 = 4
    expect(result[3]).toBeCloseTo(6); // (4+6+8)/3 = 6
  });

  it("returns array of same length as input", () => {
    const result = sma(prices, 5);
    expect(result).toHaveLength(prices.length);
  });
});

describe("ema", () => {
  it("seeds the first EMA value with the SMA of the first period", () => {
    const data = [2, 4, 6, 8, 10];
    const period = 3;
    const result = ema(data, period);
    // First EMA at index 2 = SMA([2,4,6]) = 4
    expect(result[2]).toBeCloseTo(4);
  });

  it("returns null for indices before the period", () => {
    const result = ema([1, 2, 3, 4, 5], 4);
    expect(result[0]).toBeNull();
    expect(result[1]).toBeNull();
    expect(result[2]).toBeNull();
    expect(result[3]).not.toBeNull();
  });
});

describe("rsi", () => {
  it("returns RSI values in the 0–100 range", () => {
    const closes = Array.from({ length: 20 }, (_, i) => 100 + (i % 5) - 2);
    const { rsi: values } = rsi(closes, 14);
    for (const v of values) {
      if (v !== null) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    }
  });

  it("returns all-null when data is shorter than period + 1", () => {
    const { rsi: values } = rsi([100, 101, 102], 14);
    expect(values.every((v) => v === null)).toBe(true);
  });

  it("returns RSI of 100 when all moves are gains", () => {
    const allUp = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
    const { rsi: values } = rsi(allUp, 14);
    expect(values[14]).toBe(100);
  });
});

describe("macd", () => {
  it("MACD line is null until slow period is filled", () => {
    const { macd: line } = macd(prices, 3, 5, 2);
    // slow period = 5, so first 4 entries are null
    for (let i = 0; i < 4; i++) {
      expect(line[i]).toBeNull();
    }
  });

  it("returns arrays of same length as input", () => {
    const { macd: m, signal: s, histogram: h } = macd(prices, 3, 5, 2);
    expect(m).toHaveLength(prices.length);
    expect(s).toHaveLength(prices.length);
    expect(h).toHaveLength(prices.length);
  });
});

describe("bollingerBands", () => {
  it("middle band equals SMA of the same period", () => {
    const data = [10, 11, 12, 11, 10, 9, 10, 11, 12, 13, 14, 13, 12];
    const smaResult = sma(data, 5);
    const { middle } = bollingerBands(data, 5, 2);
    for (let i = 0; i < data.length; i++) {
      expect(middle[i]).toBe(smaResult[i]);
    }
  });

  it("upper band is always greater than lower band when not null", () => {
    const { upper, lower } = bollingerBands(prices, 5, 2);
    for (let i = 0; i < prices.length; i++) {
      if (upper[i] !== null && lower[i] !== null) {
        expect(upper[i]!).toBeGreaterThan(lower[i]!);
      }
    }
  });
});

describe("vwap", () => {
  it("equals the price when high = low = close and uniform volume", () => {
    const p = [100, 100, 100];
    const v = [1000, 1000, 1000];
    const result = vwap(p, p, p, v);
    result.forEach((val) => {
      if (val !== null) expect(val).toBeCloseTo(100);
    });
  });

  it("returns array of same length as input", () => {
    const result = vwap(
      [10, 11, 12],
      [9, 10, 11],
      [9.5, 10.5, 11.5],
      [100, 200, 150]
    );
    expect(result).toHaveLength(3);
  });
});

describe("atr", () => {
  it("returns null for the first (period - 1) entries", () => {
    const h = prices;
    const l = prices.map((p) => p - 1);
    const c = prices.map((p) => p - 0.5);
    const result = atr(h, l, c, 5);
    for (let i = 0; i < 4; i++) {
      expect(result[i]).toBeNull();
    }
    expect(result[4]).not.toBeNull();
  });

  it("ATR is non-negative for valid price series", () => {
    const h = [12, 13, 14, 13, 12, 11, 12, 13, 14, 15, 16, 15, 14, 13, 12];
    const l = h.map((v) => v - 1);
    const c = h.map((v) => v - 0.5);
    const result = atr(h, l, c, 5);
    result.forEach((v) => {
      if (v !== null) expect(v).toBeGreaterThanOrEqual(0);
    });
  });
});
