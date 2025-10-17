import React from "react";
import VehicleCard from "./VehicleCard";

/**
 * Kanban column for a single stage
 * Props:
 * - stage: string
 * - vehicles: array
 * - loading: bool
 * - error: string|null
 * - dndEnabled: bool (optional)
 * - onMoveVehicle: fn (optional)
 */
export default function StageColumn({ stage, vehicles, loading, error, dndEnabled, onMoveVehicle, onDelete, onStatutChange, statuts, updatingId }) {
  return (
    <section className="min-w-[280px] max-w-xs flex-1 bg-white dark:bg-gray-900 rounded shadow p-2 flex flex-col">
      <header className="mb-2 flex items-center justify-between">
        <h2 className="font-semibold text-base" id={`stage-${stage}`}>{stage} <span className="text-xs text-gray-500">({vehicles.length})</span></h2>
      </header>
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">Chargement…</div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500">Erreur : {error}</div>
      ) : vehicles.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">Aucun véhicule</div>
      ) : (
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
          {vehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              dndEnabled={dndEnabled}
              onDelete={onDelete}
              onStatutChange={onStatutChange}
              statuts={statuts}
              updatingId={updatingId}
            />
          ))}
        </div>
      )}
    </section>
  );
}
