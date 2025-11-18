import React from 'react';
import { groupByDate, pickRepresentative, formatDateLabel } from './forecastUtils';

export default function Forecast({ list = [], unit = 'C', timezone = 0 }) {
  if (!list || list.length === 0) return null;

  const days = groupByDate(list, timezone).slice(0, 5); // first 5 days (local)

  const cToF = (c) => Math.round((c * 9) / 5 + 32);
  const formatTemp = (t) => (t == null ? '-' : (unit === 'C' ? Math.round(t) + '°C' : cToF(t) + '°F'));

  return (
    <div className="forecast-row" style={{ marginTop: 12, display: 'flex', gap: 12, overflowX: 'auto' }}>
      {days.map(day => {
        const temps = day.items.map(i => i.main.temp);
        const min = Math.min(...temps);
        const max = Math.max(...temps);
        const rep = pickRepresentative(day.items, timezone);
        const icon = rep?.weather?.[0]?.icon;
        const desc = rep?.weather?.[0]?.description || '';

        return (
          <div key={day.date} className="forecast-card" style={{ padding: 8, minWidth: 110, textAlign: 'center', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 12, color: '#333' }}>{formatDateLabel(day.date, timezone)}</div>
            {icon && <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={desc} style={{ width: 60, height: 60 }} />}
            <div style={{ fontWeight: 600 }}>{formatTemp(max)}</div>
            <div style={{ color: '#666', fontSize: 13 }}>Low {formatTemp(min)}</div>
            <div style={{ textTransform: 'capitalize', fontSize: 12, color: '#444' }}>{desc}</div>
          </div>
        );
      })}
    </div>
  );
}