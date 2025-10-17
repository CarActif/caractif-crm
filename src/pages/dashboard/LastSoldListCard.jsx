import React from "react";

export default function LastSoldListCard({ mandats = [] }) {
  // Filtrer 5 derniers mandats statut IN (Vendu, Archivé) triés par date_vente desc
  const filtered = [...mandats]
    .filter(m => ["Vendu", "Archivé"].includes(m.statut) && m.date_vente)
    .sort((a, b) => new Date(b.date_vente) - new Date(a.date_vente))
    .slice(0, 5);

  // Helper format euro
  function toEuro(n) {
    if (!Number.isFinite(n)) return '—';
    return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  }

  return (
  <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card bg-neutral-50 dark:bg-neutral-900 shadow-lg md:shadow-2xl p-4">
  <h3 className="font-bold text-[#4ADE80] mb-2 text-lg">5 derniers vendus</h3>
      <div className="divide-y divide-gray-200">
        {filtered.length === 0 ? (
          <div className="text-gray-400 text-sm">Aucun véhicule vendu récemment.</div>
        ) : (
          filtered.map(m => (
            <div key={m.id} className="py-2 flex items-center justify-between text-xs sm:text-base">
              <div>
                <span className="font-bold text-black">{m.marque} {m.modele}</span>
                {m.finition && <span className="text-gray-500 ml-1">{m.finition}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-900/80 text-white">
                  {new Date(m.date_vente).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
