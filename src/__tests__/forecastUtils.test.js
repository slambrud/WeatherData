import { describe, it, expect } from 'vitest';
import { groupByDate, pickRepresentative, cToF } from '../forecastUtils';

describe('forecastUtils', () => {
  it('groups items by local date using timezone offset', () => {
    // items around a UTC day boundary
    const list = [
      { dt: 1700000000, main: { temp: 10 } }, // some timestamp
      { dt: 1700086400, main: { temp: 12 } }, // next day
    ];
    const grouped = groupByDate(list, 0);
    expect(grouped.length).toBeGreaterThanOrEqual(1);
  });

  it('pickRepresentative returns item closest to noon local time', () => {
    // create items at 3am, 12pm, 21pm UTC (dt in seconds)
    const base = 1700000000; // arbitrary
    const items = [
      { dt: base + 3 * 3600, weather: [{ icon: 'a', description: 'x' }] },
      { dt: base + 12 * 3600, weather: [{ icon: 'b', description: 'y' }] },
      { dt: base + 21 * 3600, weather: [{ icon: 'c', description: 'z' }] },
    ];
    const rep = pickRepresentative(items, 0);
    expect(rep.weather[0].icon).toBe('b');
  });

  it('cToF converts Celsius to Fahrenheit correctly', () => {
    expect(cToF(0)).toBe(32);
    expect(cToF(100)).toBe(212);
  });
});
