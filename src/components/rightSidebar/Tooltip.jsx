import React from 'react';

export default function Tooltip({ label, children, disabled }) {
  if (disabled) return children;
  return (
    <span className="tooltip-wrapper">
      {children}
      <span className="tooltip-content" role="tooltip">{label}</span>
    </span>
  );
}
