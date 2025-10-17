import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

export function DashboardLineChart({ data }: { data: { mois: string, caHT: number }[] }) {
  return (
    <div className="bg-white rounded shadow p-4 min-h-[220px]">
      <h3 className="font-semibold mb-2">CA HT par mois</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} aria-label="Graphique CA HT par mois">
          <XAxis dataKey="mois" stroke="#888" fontSize={12} />
          <YAxis stroke="#888" fontSize={12} />
          <Tooltip formatter={v => v + ' €'} />
          <Line type="monotone" dataKey="caHT" stroke="#0a5" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const COLORS = ["#0a5", "#fbbf24", "#6366f1", "#ef4444", "#6b7280"];

export function DashboardPieChart({ data }: { data: { name: string, value: number }[] }) {
  return (
    <div className="bg-white rounded shadow p-4 min-h-[220px]">
      <h3 className="font-semibold mb-2">Répartition des statuts</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            label={({ name, percent }) => `${name} ${typeof percent === 'number' ? (percent * 100).toFixed(0) : 0}%`}
            aria-label="Répartition des statuts"
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={v => v + ' ventes'} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
