import React from 'react';

export default function Favorites({ favorites = [], onSelect = () => {}, onRemove = () => {} }) {
  if (!favorites || favorites.length === 0) return null;

  return (
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {favorites.map((name) => (
        <li key={name} style={{ marginBottom: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" onClick={() => onSelect(name)}>{name}</button>
          <button type="button" onClick={() => onRemove(name)} aria-label={`Remove ${name}`} style={{ color: '#b00' }}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
