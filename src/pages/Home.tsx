import React, { useMemo } from "react";
import { calcCommissionFromTTC } from "../lib/commission";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// MOCK DATA à remplacer par fetch réel
const ventes = [
  { id: 1, ttc: 1490, statut: "Vendu", date: "2025-07-01", agent: "Alice", produit: "A" },
  { id: 2, ttc: 1490, statut: "Vendu", date: "2025-08-10", agent: "Bob", produit: "B" },
  { id: 3, ttc: 1490, statut: "Publié", date: "2025-08-12", agent: "Alice", produit: "A" },
  { id: 4, ttc: 3000, statut: "Vendu", date: "2025-08-15", agent: "Alice", produit: "C" },
  { id: 5, ttc: 8000, statut: "Archivé", date: "2025-08-16", agent: "Bob", produit: "B" },
  { id: 6, ttc: 2000, statut: "Vendu", date: "2025-06-20", agent: "Alice", produit: "A" },
];
// Données CA HT par mois (pour graph ligne)
const caParMois = (() => {
  const moisLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  const moisData = Array(12).fill(0).map((_, i) => ({ mois: moisLabels[i], caHT: 0 }));
  ventes.forEach(v => {
    if (v.statut === "Vendu") {
      const d = new Date(v.date);
      const idx = d.getMonth();
      const { caHT } = calcCommissionFromTTC(v.ttc);
      moisData[idx].caHT += caHT;
    }
  });
  // arrondi
  moisData.forEach(m => m.caHT = +m.caHT.toFixed(2));
  return moisData;
})();

// Données pour donut statuts
const statutsData = (() => {
  const statuts: Record<string, number> = {};
  ventes.forEach(v => { statuts[v.statut] = (statuts[v.statut] || 0) + 1; });
  return Object.entries(statuts).map(([name, value]) => ({ name, value }));
})();

const COLORS = ["#0a5", "#fbbf24", "#6366f1", "#ef4444", "#6b7280"];

export default function Home() {
  // Filtrage ventes du mois courant
  const now = new Date();
  const mois = now.getMonth();
  const ventesMois = ventes.filter(v => new Date(v.date).getMonth() === mois && v.statut === "Vendu");
  const caTTC = ventesMois.reduce((sum, v) => sum + v.ttc, 0);
  const { caHT, commissionHT } = calcCommissionFromTTC(caTTC);
  const nbVentes = ventesMois.length;
  const ticketMoyen = nbVentes ? +(caHT / nbVentes).toFixed(2) : 0;
  const tauxTransfo = ventes.filter(v => v.statut === "Vendu").length / ventes.length * 100;

  // Répartition par statut
  const repartition = useMemo(() => {
    const statuts: Record<string, number> = {};
    ventes.forEach(v => { statuts[v.statut] = (statuts[v.statut] || 0) + 1; });
    return statuts;
  }, []);

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <KPI label="CA HT du mois" value={caHT + " €"} />
        <KPI label="Commission totale" value={commissionHT + " €"} />
        <KPI label="Ventes" value={nbVentes} />
        <KPI label="Ticket moyen" value={ticketMoyen + " €"} />
        <KPI label="Tx transformation" value={tauxTransfo.toFixed(1) + "%"} />
      </section>
      {/* Graphiques */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded shadow p-4 min-h-[220px]">
          <h3 className="font-semibold mb-2">CA HT par mois</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={caParMois} aria-label="Graphique CA HT par mois">
              <XAxis dataKey="mois" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip formatter={v => v + ' €'} />
              <Line type="monotone" dataKey="caHT" stroke="#0a5" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded shadow p-4 min-h-[220px]">
          <h3 className="font-semibold mb-2">Répartition des statuts</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statutsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ name, percent }) => `${name} ${typeof percent === 'number' ? (percent * 100).toFixed(0) : 0}%`}
                aria-label="Répartition des statuts"
              >
                {statutsData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={v => v + ' ventes'} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
      {/* Tableaux */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Dernières ventes</h2>
        <table className="w-full text-sm border rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th>Date</th>
              <th>Produit</th>
              <th>Agent</th>
              <th>CA TTC</th>
              <th>CA HT</th>
              <th>Commission</th>
            </tr>
          </thead>
          <tbody>
            {ventesMois.map(v => {
              const { caHT, commissionHT } = calcCommissionFromTTC(v.ttc);
              return (
                <tr key={v.id} className="odd:bg-gray-50">
                  <td>{v.date}</td>
                  <td>{v.produit}</td>
                  <td>{v.agent}</td>
                  <td>{v.ttc} €</td>
                  <td>{caHT} €</td>
                  <td>{commissionHT} €</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}

function KPI({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center" tabIndex={0} aria-label={label + ' ' + value}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-bold" style={{ color: '#0a5' }}>{value}</div>
    </div>
  );
}
