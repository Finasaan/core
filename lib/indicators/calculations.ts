/**
 * Technical Indicator Calculations
 * Pure functions — no side effects, no dependencies.
 * All inputs are arrays of numbers (typically close prices, oldest→newest).
 */

// ---- Simple Moving Average (SMA) ----

export function sma(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) {
        sum += data[j];
      }
      result.push(sum / period);
    }
  }
  return result;
}

// ---- Exponential Moving Average (EMA) ----

export function ema(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const multiplier = 2 / (period + 1);

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      // Seed EMA with SMA of first `period` values
      let sum = 0;
      for (let j = 0; j < period; j++) sum += data[j];
      result.push(sum / period);
    } else {
      const prev = result[i - 1]!;
      result.push((data[i] - prev) * multiplier + prev);
    }
  }
  return result;
}

// ---- RSI (Relative Strength Index) ----

export interface RSIResult {
  rsi: (number | null)[];
}

export function rsi(closes: number[], period = 14): RSIResult {
  const result: (number | null)[] = new Array(closes.length).fill(null);

  if (closes.length < period + 1) return { rsi: result };

  // Calculate initial gains/losses
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1];
    if (change >= 0) avgGain += change;
    else avgLoss += Math.abs(change);
  }

  avgGain /= period;
  avgLoss /= period;

  // First RSI value
  if (avgLoss === 0) {
    result[period] = 100;
  } else {
    const rs = avgGain / avgLoss;
    result[period] = 100 - 100 / (1 + rs);
  }

  // Subsequent values using smoothed averages
  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    const gain = change >= 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    if (avgLoss === 0) {
      result[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      result[i] = 100 - 100 / (1 + rs);
    }
  }

  return { rsi: result };
}

// ---- MACD (Moving Average Convergence Divergence) ----

export interface MACDResult {
  macd: (number | null)[];
  signal: (number | null)[];
  histogram: (number | null)[];
}

export function macd(
  closes: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): MACDResult {
  const fastEMA = ema(closes, fastPeriod);
  const slowEMA = ema(closes, slowPeriod);

  // MACD line = fast EMA - slow EMA
  const macdLine: (number | null)[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (fastEMA[i] != null && slowEMA[i] != null) {
      macdLine.push(fastEMA[i]! - slowEMA[i]!);
    } else {
      macdLine.push(null);
    }
  }

  // Signal line = EMA of MACD line
  // Extract non-null MACD values and compute EMA on them
  const nonNullMACD: number[] = [];
  const nonNullIndices: number[] = [];
  macdLine.forEach((v, i) => {
    if (v != null) {
      nonNullMACD.push(v);
      nonNullIndices.push(i);
    }
  });

  const signalEMA = ema(nonNullMACD, signalPeriod);

  // Map signal values back to original indices
  const signalLine: (number | null)[] = new Array(closes.length).fill(null);
  const histogram: (number | null)[] = new Array(closes.length).fill(null);

  for (let i = 0; i < nonNullIndices.length; i++) {
    const idx = nonNullIndices[i];
    if (signalEMA[i] != null) {
      signalLine[idx] = signalEMA[i];
      histogram[idx] = macdLine[idx]! - signalEMA[i]!;
    }
  }

  return { macd: macdLine, signal: signalLine, histogram };
}

// ---- Bollinger Bands ----

export interface BollingerResult {
  upper: (number | null)[];
  middle: (number | null)[];
  lower: (number | null)[];
}

export function bollingerBands(
  data: number[],
  period = 20,
  stdDevMultiplier = 2
): BollingerResult {
  const middle = sma(data, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    if (middle[i] == null) {
      upper.push(null);
      lower.push(null);
    } else {
      // Calculate standard deviation
      let sumSq = 0;
      for (let j = i - period + 1; j <= i; j++) {
        sumSq += (data[j] - middle[i]!) ** 2;
      }
      const stdDev = Math.sqrt(sumSq / period);

      upper.push(middle[i]! + stdDevMultiplier * stdDev);
      lower.push(middle[i]! - stdDevMultiplier * stdDev);
    }
  }

  return { upper, middle, lower };
}

// ---- VWAP (Volume Weighted Average Price) ----
// Approximation: cumulative (typical_price * volume) / cumulative volume

export function vwap(
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[]
): (number | null)[] {
  const result: (number | null)[] = [];
  let cumulativeTPV = 0;
  let cumulativeVol = 0;

  for (let i = 0; i < closes.length; i++) {
    const tp = (highs[i] + lows[i] + closes[i]) / 3;
    cumulativeTPV += tp * volumes[i];
    cumulativeVol += volumes[i];

    if (cumulativeVol === 0) {
      result.push(null);
    } else {
      result.push(cumulativeTPV / cumulativeVol);
    }
  }

  return result;
}

// ---- Average True Range (ATR) ----

export function atr(
  highs: number[],
  lows: number[],
  closes: number[],
  period = 14
): (number | null)[] {
  if (closes.length < 2) return new Array(closes.length).fill(null);

  // True Range
  const tr: number[] = [highs[0] - lows[0]];
  for (let i = 1; i < closes.length; i++) {
    tr.push(
      Math.max(
        highs[i] - lows[i],
        Math.abs(highs[i] - closes[i - 1]),
        Math.abs(lows[i] - closes[i - 1])
      )
    );
  }

  // ATR = smoothed average of TR
  const result: (number | null)[] = new Array(closes.length).fill(null);

  if (tr.length < period) return result;

  // First ATR = simple average of first `period` TRs
  let sum = 0;
  for (let i = 0; i < period; i++) sum += tr[i];
  result[period - 1] = sum / period;

  // Subsequent: smoothed
  for (let i = period; i < tr.length; i++) {
    result[i] = (result[i - 1]! * (period - 1) + tr[i]) / period;
  }

  return result;
}
