import React from "react";
import StageColumn from "./StageColumn";

/**
 * Desktop kanban board for all stages
 * Props:
 * - stages: array of stage names
 * - vehiclesByStage: { [stage]: array of vehicles }
 * - loadingByStage: { [stage]: bool }
 * - errorByStage: { [stage]: string|null }
 * - dndEnabled: bool (optional)
 * - onMoveVehicle: fn (optional, for DnD)
 */
export default function StageBoardDesktop({ stages, vehiclesByStage, loadingByStage, errorByStage, dndEnabled, onMoveVehicle, onDelete, onStatutChange, statuts, updatingId }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {stages.map(stage => (
        <StageColumn
          key={stage}
          stage={stage}
          vehicles={vehiclesByStage[stage] || []}
          loading={loadingByStage[stage]}
          error={errorByStage[stage]}
          dndEnabled={dndEnabled}
          onMoveVehicle={onMoveVehicle}
          onDelete={onDelete}
          onStatutChange={onStatutChange}
          statuts={statuts}
          updatingId={updatingId}
        />
      ))}
    </div>
  );
}
