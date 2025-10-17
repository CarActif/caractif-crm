import React from "react";

export default function StockListCard({ mandats = [] }) {
  // Filtrer mandats statut IN (Mandat signé, Publié, Sous offre)
  const filtered = mandats.filter(m => ["Mandat signé", "Publié", "Sous offre"].includes(m.statut));

  // Helper format euro
  function toEuro(n) {
    if (!Number.isFinite(n)) return '—';
    return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  }

  return (
  <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card bg-neutral-50 dark:bg-neutral-900 shadow-lg md:shadow-2xl p-4">
  <h3 className="font-bold text-[#4ADE80] mb-2 text-lg">Véhicules en stock</h3>
      <div className="max-h-96 overflow-auto divide-y divide-gray-200">
        {filtered.length === 0 ? (
          <div className="text-gray-400 text-sm">Aucun mandat en stock.</div>
        ) : (
          filtered.map(m => (
            <div key={m.id} className="py-2 flex items-center justify-between text-xs sm:text-base">
              <div>
                <span className="font-bold text-black">{m.marque} {m.modele}</span>
                {m.finition && <span className="text-gray-500 ml-1">{m.finition}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-900/80 text-white">
                  {m.statut}
                </span>
                <span className="text-green-700 font-bold">{toEuro(Number(m.prix_affiche))}</span>
                <span className="text-blue-700 font-bold">{toEuro(Number(m.commission_ttc))}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
