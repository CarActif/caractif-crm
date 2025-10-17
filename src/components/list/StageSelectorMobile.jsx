import React from "react";

/**
 * Mobile stage selector (dropdown or segmented control)
 * Props:
 * - stages: array of stage names
 * - value: current selected stage
 * - onChange: function(stage)
 */
export default function StageSelectorMobile({ stages, value, onChange }) {
  return (
    <nav aria-label="Étapes" className="w-full mb-2">
      <select
        className="w-full rounded border px-3 py-2 text-base focus:outline-none focus:ring"
        aria-label="Sélectionner l'étape"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {stages.map(stage => (
          <option key={stage} value={stage} aria-current={value === stage ? "step" : undefined}>
            {stage}
          </option>
        ))}
      </select>
    </nav>
  );
}
