import type { OddsFormat } from '../constants';

export function formatOdds(decimal: number, format: OddsFormat): string {
  if (!decimal || decimal <= 0) return '\u2014';
  switch (format) {
    case 'decimal':
      return decimal.toFixed(2);
    case 'american': {
      if (decimal >= 2) {
        return `+${Math.round((decimal - 1) * 100)}`;
      }
      return `-${Math.round(100 / (decimal - 1))}`;
    }
    case 'fractional':
      return getTraditionalFraction(decimal);
    default:
      return decimal.toFixed(2);
  }
}

export function getTraditionalFraction(decimalPrice: number): string {
  if (!decimalPrice || decimalPrice <= 1) return '\u2014';

  const traditionalFractions = [
    { d: 1.05, f: '1/20' }, { d: 1.06, f: '1/16' }, { d: 1.07, f: '1/14' },
    { d: 1.08, f: '1/12' }, { d: 1.10, f: '1/10' }, { d: 1.11, f: '1/9' },
    { d: 1.12, f: '1/8' },  { d: 1.14, f: '1/7' },  { d: 1.17, f: '1/6' },
    { d: 1.20, f: '1/5' },  { d: 1.22, f: '2/9' },  { d: 1.25, f: '1/4' },
    { d: 1.29, f: '2/7' },  { d: 1.33, f: '1/3' },  { d: 1.36, f: '4/11' },
    { d: 1.40, f: '2/5' },  { d: 1.44, f: '4/9' },  { d: 1.50, f: '1/2' },
    { d: 1.53, f: '8/15' }, { d: 1.57, f: '4/7' },  { d: 1.62, f: '5/8' },
    { d: 1.67, f: '4/6' },  { d: 1.73, f: '8/11' }, { d: 1.80, f: '4/5' },
    { d: 1.83, f: '5/6' },  { d: 1.91, f: '10/11' },{ d: 2.00, f: '1/1' },
  ];

  if (decimalPrice <= 2.0) {
    let closest = traditionalFractions[0];
    let minDiff = Math.abs(decimalPrice - traditionalFractions[0].d);
    for (let i = 1; i < traditionalFractions.length; i++) {
      const diff = Math.abs(decimalPrice - traditionalFractions[i].d);
      if (diff < minDiff) {
        minDiff = diff;
        closest = traditionalFractions[i];
      }
    }
    return closest.f;
  }

  const value = decimalPrice - 1;
  const denominators = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  for (const den of denominators) {
    const num = Math.round(value * den);
    if (Math.abs(num / den - value) < 0.02) {
      return `${num}/${den}`;
    }
  }

  return `${Math.round(value)}/1`;
}

export function decimalToAmerican(decimal: number): string {
  if (decimal >= 2) return `+${Math.round((decimal - 1) * 100)}`;
  return `-${Math.round(100 / (decimal - 1))}`;
}
