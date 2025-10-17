
import { useState } from "react";
// @ts-ignore
import { useFacturation } from "@/hooks/useFacturation"; // si absent, commente cette ligne
// @ts-ignore
import { downloadCSV } from "@/lib/csv";                  // si absent, commente le bouton Export
import { calcCommissionFromTTC } from "@/lib/commission";

function firstOfMonth(d=new Date()){return new Date(d.getFullYear(), d.getMonth(), 1);}
function firstOfNextMonth(d=new Date()){return new Date(d.getFullYear(), d.getMonth()+1, 1);}
function toISO(d: Date){return d.toISOString().slice(0,10);}

export default function FacturationPage(){
  const [start,setStart]=useState(toISO(firstOfMonth()));
  const [end,setEnd]=useState(toISO(firstOfNextMonth()));

  // --- Simulateur de commission ---
  const [ttc, setTtc] = useState<string>("");
  const parsedTtc = parseFloat(ttc.replace(/\s/g, '').replace(',', '.')) || 0;
  const ht = round2(parsedTtc / 1.2);
  const tva = round2(parsedTtc - ht);

  const BRACKETS = [
    { cap: 2000,   rate: 0.60, label: "0 – 1 999,99" },
    { cap: 4000,   rate: 0.60, label: "2 000 – 3 999,99" },
    { cap: 7000,   rate: 0.65, label: "4 000 – 6 999,99" },
    { cap: 11000,  rate: 0.70, label: "7 000 – 10 999,99" },
    { cap: 15000,  rate: 0.70, label: "11 000 – 14 999,99" },
    { cap: Infinity, rate: 0.80, label: "≥ 15 000" },
  ];

  function round2(n:number) { return Math.round((n + Number.EPSILON) * 100) / 100; }

  function computeBreakdown(htTotal:number) {
    let rows = [];
    let prevCap = 0;
    let totalPart = 0;
    for (const b of BRACKETS) {
      const base = Math.max(0, Math.min(htTotal, b.cap) - prevCap);
      const part = round2(base * b.rate);
      rows.push({
        label: b.label,
        base,
        rate: b.rate,
        part,
      });
      totalPart += part;
      prevCap = b.cap;
      if (htTotal <= b.cap) break;
    }
    return { rows, totalPart: round2(totalPart) };
  }

  const { rows: simRows, totalPart } = computeBreakdown(ht);

  let rows:any[] = [];
  let totals = { totalTTC:0, totalHT:0, caHT:0, montantCommercial:0 };
  let isLoading=false, error:null|any=null;

  try{
    // si le hook existe, utilise-le
    // @ts-ignore
    const res = useFacturation?.(start,end) || {};
    rows = res.rows ?? rows;
    totals = res.totals ?? totals;
    isLoading = res.isLoading ?? false;
    error = res.error ?? null;
  }catch(e){ error = e; }

  return (
    <div className="p-4 space-y-4">
      {/* --- Simulateur de commission --- */}
      <div className="rounded-2xl border bg-card shadow-md p-4 space-y-3 max-w-xl mx-auto">
        <div className="flex flex-col gap-2">
          <label htmlFor="simu-ttc" className="font-medium">CA TTC à simuler</label>
          <input
            id="simu-ttc"
            type="number"
            inputMode="decimal"
            className="border rounded-lg p-3 text-lg w-full"
            placeholder="Ex: 12000"
            value={ttc}
            onChange={e => setTtc(e.target.value)}
            min={0}
            step="any"
            aria-label="CA TTC à simuler"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 text-sm">
          <div>TVA : <span className="font-semibold">{fmt(tva)}</span></div>
          <div>CA HT : <span className="font-semibold">{fmt(ht)}</span></div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border mt-2">
            <thead>
              <tr className="bg-neutral-100 dark:bg-neutral-800">
                <th className="px-2 py-1 text-left">Tranche</th>
                <th className="px-2 py-1 text-right">Base HT</th>
                <th className="px-2 py-1 text-right">%</th>
                <th className="px-2 py-1 text-right">Part du commercial</th>
              </tr>
            </thead>
            <tbody>
              {simRows.map((r, i) => (
                <tr key={i}>
                  <td className="px-2 py-1 whitespace-nowrap">{r.label}</td>
                  <td className="px-2 py-1 text-right">{fmt(r.base)}</td>
                  <td className="px-2 py-1 text-right">{Math.round(r.rate*100)}%</td>
                  <td className="px-2 py-1 text-right">{fmt(r.part)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold border-t">
                <td className="px-2 py-1 text-right" colSpan={3}>TOTAL Part du commercial (HT)</td>
                <td className="px-2 py-1 text-right">{fmt(totalPart)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <h1 className="text-xl font-semibold">Facturation</h1>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
        <div className="flex flex-col">
          <label className="text-sm">Début</label>
          <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="border rounded-lg p-2 w-full"/>
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Fin (exclusive)</label>
          <input type="date" value={end} onChange={e=>setEnd(e.target.value)} className="border rounded-lg p-2 w-full"/>
        </div>
  {/* Export CSV supprimé */}
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard label="Total TTC" v={totals.totalTTC}/>
        <StatCard label="Total HT" v={totals.totalHT}/>
        {/* TVA = TTC - HT */}
        <StatCard label="TVA" v={totals.totalTTC - totals.totalHT} tva/>
        <StatCard label="CA HT" v={totals.caHT}/>
        <StatCard label="À facturer (HT)" v={totals.montantCommercial}/>
      </section>

      {isLoading && <p>Chargement…</p>}
      {error && <p className="text-red-600">Erreur: {String(error?.message||error)}</p>}
      {!isLoading && (rows?.length??0)===0 && <p>Aucune vente sur cette période.</p>}

      <ul className="space-y-2">
        {(rows||[]).map((r:any)=>(
          <li key={r.id} className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card bg-neutral-50 dark:bg-neutral-900 shadow-lg md:shadow-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="text-sm opacity-70">
              {r.date_vente ? new Date(r.date_vente).toLocaleDateString('fr-FR') : '—'}
            </div>
            <div className="font-medium flex-1">{r.modele ?? 'Véhicule'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
function StatCard({label,v,hi,ht,tva}:{label:string;v:number;hi?:boolean;ht?:number;tva?:boolean}){
  return (
    <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card bg-neutral-50 dark:bg-neutral-900 shadow-lg md:shadow-2xl p-4">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-xl font-semibold">{fmt(v)}</div>
    </div>
  );
}
function fmt(n:any){
  const num = Number.isFinite(n) ? Number(n) : 0;
  return Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(num);
}

