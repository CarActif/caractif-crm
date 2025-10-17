import React from "react";

/**
 * Vehicle card for list/kanban
 * Props:
 * - vehicle: object
 * - dndEnabled: bool (optional)
 */
import { useNavigate } from "react-router-dom";
export default function VehicleCard({ vehicle, dndEnabled, onDelete, onStatutChange, statuts, updatingId }) {
  const navigate = useNavigate();
  // DnD handlers à ajouter si dndEnabled
  return (
    <article className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow border relative flex flex-col h-full min-h-[320px]">
      {/* Image de présentation */}
      <div className="mb-2">
        <img
          src={vehicle?.photo_url?.[0] ?? "/no-image-available.png"}
          alt="Présentation véhicule"
          className="w-full h-28 object-cover rounded"
          style={{ minHeight: 96, maxHeight: 120 }}
        />
      </div>
      <h2 className="text-base font-bold truncate mb-1">{vehicle?.marque ?? "—"} {vehicle?.modele ?? ""}</h2>
      {/* Affichage du contact lié */}
      <p className="text-xs text-gray-700 font-semibold mb-1">
        {(vehicle.nom_complet && vehicle.nom_complet !== 'Aucun contact') ? vehicle.nom_complet : 'Aucun contact'}
        {vehicle.telephone ? ` — ${vehicle.telephone}` : ''}
      </p>
      <p className="text-sm text-gray-600 truncate">Finition : {vehicle?.finition ?? "—"}</p>
      <p className="text-sm text-gray-600 truncate">Couleur : {vehicle?.couleur ?? "—"}</p>
      <p className="text-xs text-gray-500">
        Mise en circ. : {vehicle?.annee ? new Date(vehicle.annee).toLocaleDateString("fr-FR") : "—"}
      </p>
      <p className="text-xs text-gray-500">Prix net : {vehicle?.prix_net_vendeur ?? "—"} €</p>
      <p className="text-xs text-gray-500">Commission : {vehicle?.commission_ttc ?? "—"} €</p>
      <p className="text-xs text-gray-500">Affiché : {vehicle?.prix_affiche ?? "—"} €</p>
      <div className="my-1">
        <label htmlFor={`statut-${vehicle?.id ?? ''}`} className="block text-xs font-medium text-gray-700 mb-1">Statut :</label>
        <select
          id={`statut-${vehicle?.id ?? ''}`}
          value={vehicle?.statut || "Mandat signé"}
          onChange={e => onStatutChange && onStatutChange(vehicle?.id, e.target.value)}
          className="border rounded px-2 py-1 w-full text-xs"
          disabled={updatingId === vehicle?.id}
        >
          {statuts && statuts.filter(s => s !== "Tout").map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={() => navigate(`/edit/${vehicle?.id}`)}
          className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete && onDelete(vehicle?.id)}
          className="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
        >
          🗑
        </button>
      </div>
    </article>
  );
}
