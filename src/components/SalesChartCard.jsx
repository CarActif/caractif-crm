import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import StockListCard from "../pages/dashboard/StockListCard";
import LastSoldListCard from "../pages/dashboard/LastSoldListCard";

// Helper: format month as "MMM YY" (fr)
function formatMonth(dateStr) {
  const d = new Date(dateStr + "-01");
  return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
}

// Tooltip content
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow px-3 py-2 border text-xs">
        <div className="font-bold text-gray-700">{label}</div>
        <div className="text-green-700">CA HT : {payload[0].value.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}</div>
      </div>
    );
  }
  return null;
}

/**
 * @param {Object} props
 * @param {Array} props.mandats - Array of mandates with {commission_ttc, date_vente, statut}
 */
export default function SalesChartCard({ mandats = [] }) {
  // Filtrer les mandats vendus/archivés avec date_vente (pour le chart)
  const filtered = useMemo(() =>
    mandats.filter(m => ["Vendu", "Archivé"].includes(m.statut) && m.date_vente),
    [mandats]
  );

  // Grouper par mois (YYYY-MM), sommer CA HT
  const data = useMemo(() => {
    const map = {};
    filtered.forEach(m => {
      const d = new Date(m.date_vente);
      const y = d.getFullYear();
      const mth = (d.getMonth() + 1).toString().padStart(2, "0");
      const key = `${y}-${mth}`;
      map[key] = (map[key] || 0) + (Number(m.commission_ttc) || 0) / 1.2;
    });
    // Prendre les 6 derniers mois (même si 0)
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const mth = (d.getMonth() + 1).toString().padStart(2, "0");
      const key = `${y}-${mth}`;
      months.push({
        month: formatMonth(key),
        caht: Math.round(map[key] || 0)
      });
    }
    return months;
  }, [filtered]);

  // Nouveau wrapper grid 2 colonnes
  return (
    <div className="grid md:grid-cols-2 gap-4 w-full">
      {/* Colonne 1 : StockListCard */}
      <StockListCard mandats={mandats} />
      {/* Colonne 2 : LastSoldListCard */}
      <LastSoldListCard mandats={mandats} />
    </div>
  );
}
