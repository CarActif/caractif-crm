import React from 'react';

export default function CollapseToggle({ expanded, setExpanded }) {
  return (
    <button
      className="collapse-toggle"
      aria-label={expanded ? 'Réduire la barre latérale' : 'Étendre la barre latérale'}
      aria-expanded={expanded}
      onClick={() => setExpanded((e) => !e)}
      tabIndex={0}
    >
      <span aria-hidden="true">{expanded ? '⮜' : '⮞'}</span>
    </button>
  );
}
