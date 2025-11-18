// Small utilities extracted from Forecast component so they can be unit-tested.
export function groupByDate(list = [], timezone = 0) {
  const days = {};
  list.forEach(item => {
    const localTs = (item.dt + (timezone || 0)) * 1000;
    const date = new Date(localTs);
    const key = date.toISOString().slice(0, 10);
    if (!days[key]) days[key] = [];
    days[key].push(item);
  });
  return Object.entries(days).map(([date, items]) => ({ date, items }));
}

export function pickRepresentative(items, timezone = 0) {
  if (!items || items.length === 0) return null;
  const targetHour = 12;
  let best = items[0];
  let bestDiff = Infinity;
  items.forEach(it => {
    const localHour = new Date((it.dt + (timezone || 0)) * 1000).getHours();
    const diff = Math.abs(localHour - targetHour);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = it;
    }
  });
  return best;
}

export function formatDateLabel(isoDate, timezone = 0) {
  const base = new Date(isoDate + 'T00:00:00Z');
  const local = new Date(base.getTime() + (timezone || 0) * 1000);
  return local.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export function cToF(c) {
  return Math.round((c * 9) / 5 + 32);
}
