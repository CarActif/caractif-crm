import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eur, median } from '../utils/formatEuro'; // eur helper, median à créer si besoin
import { computeScores, VehicleInput } from '../utils/computeScores';
import { fetchMesVehicules } from '../lib/fetchMesVehicules';

// VehiclePicker: select véhicules (searchable)
type Mandat = {
  id: string;
  marque: string;
  modele: string;
  annee: number;
  year?: number; // pour mapping éventuel
  mise_en_circulation?: string; // date ISO ou année
  version: string;
  kilometrage: number;
  prix_affiche: number;
};

type Comparatif = {
  marqueModele: string;
  annee: number | string;
  kilometrage: number | string;
  prix: number | string;
};

interface VehiclePickerProps {
  value: Mandat | null;
  onChange: (v: Mandat | null) => void;
  options: Mandat[];
}
function VehiclePicker({ value, onChange, options }: VehiclePickerProps) {
  return (
    <select
      className="w-full p-2 rounded border"
      value={value ? value.id : ''}
      onChange={e => {
        const found = options.find(v => v.id === e.target.value);
        onChange(found || null);
      }}
      aria-label="Sélectionner un véhicule"
    >
      <option value="">Sélectionner un véhicule</option>
      {options.map(v => (
        <option key={v.id} value={v.id}>
          {v.marque} {v.modele} {v.annee ?? v.year} {v.version} ({eur(v.prix_affiche)})
        </option>
      ))}
    </select>
  );
}

// VehicleForm: fiche véhicule éditable
interface VehicleFormProps {
  vehicle: Partial<Mandat>;
  readOnly: boolean;
}
function VehicleForm({ vehicle, readOnly }: VehicleFormProps) {
  // Affiche l'année extraite comme dans le tableau comparatif
  let anneeAff: string|number = vehicle.annee ?? '';
  if (typeof anneeAff === 'string' && anneeAff.length >= 4) {
    const match = anneeAff.match(/\d{4}/);
    if (match) anneeAff = match[0];
  }
  const fields: { key: keyof Mandat; label: string; type: string; customValue?: string|number }[] = [
    { key: 'marque', label: 'Marque', type: 'text' },
    { key: 'modele', label: 'Modèle', type: 'text' },
    { key: 'annee', label: 'Année', type: 'number', customValue: anneeAff },
    { key: 'version', label: 'Version', type: 'text' },
    { key: 'kilometrage', label: 'Kilométrage', type: 'number' },
    { key: 'prix_affiche', label: 'Prix affiché', type: 'number' },
  ];
  return (
    <div className="card rounded-2xl border bg-card shadow-md p-4 grid grid-cols-1 gap-3">
      {fields.map(({ key, label, type, customValue }) => (
        <div key={key}>
          <label className="block text-xs font-bold mb-1" htmlFor={key}>{label}</label>
          <input
            id={key}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-muted/40 text-foreground/70"
            type={type}
            min={0}
            value={customValue !== undefined ? customValue : vehicle[key] ?? ''}
            disabled={readOnly || key === 'annee'}
            readOnly={readOnly || key === 'annee'}
            tabIndex={readOnly ? -1 : 0}
          />
        </div>
      ))}
    </div>
  );
}

// ComparatifsTable: lignes dynamiques + résumé
interface ComparatifsTableProps {
  comparatifs: Comparatif[];
  setComparatifs: (c: Comparatif[]) => void;
  prix_affiche: number | string | undefined;
  marqueModeleRef?: string;
}
function ComparatifsTable({ comparatifs, setComparatifs, prix_affiche, marqueModeleRef }: ComparatifsTableProps) {
  // Mini-formulaire local state
  const [form, setForm] = React.useState({
    marqueModele: marqueModeleRef || '',
    annee: '',
    kilometrage: '',
    prix: ''
  });
  React.useEffect(() => {
    setForm(f => ({ ...f, marqueModele: marqueModeleRef || '' }));
  }, [marqueModeleRef]);

  const handleChange = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }));
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation simple : champs non vides
    if (!form.marqueModele.trim() || !form.annee || !form.kilometrage || !form.prix) return;
    const anneeNum = Number(form.annee);
    const kmNum = Number(form.kilometrage);
    const prixNum = Number(form.prix);
    setComparatifs([
      ...comparatifs,
      {
        marqueModele: form.marqueModele,
        annee: anneeNum,
        kilometrage: kmNum,
        prix: prixNum
      }
    ]);
    setForm({ marqueModele: marqueModeleRef || '', annee: '', kilometrage: '', prix: '' });
  };
  const removeRow = (i: number) => setComparatifs(comparatifs.filter((_, j) => j!==i));

  const prixAfficheNum = Number(prix_affiche) || 0;
  // Calculs pour résumé
  const prixArr = comparatifs.map(r => Number(r.prix)||0).filter(n => n>0);
  const moyennePrix = prixArr.length ? prixArr.reduce((a,b)=>a+b,0)/prixArr.length : 0;
  const medianePrix = prixArr.length ? median(prixArr) : 0;
  const min = prixArr.length ? Math.min(...prixArr) : 0;
  const max = prixArr.length ? Math.max(...prixArr) : 0;
  const deltaMoyen = moyennePrix - prixAfficheNum;
  const suggestion = Math.abs(deltaMoyen) < 0.05*prixAfficheNum
    ? 'Position OK'
    : `Suggéré : ${eur(Math.round(prixAfficheNum + deltaMoyen))}`;

  return (
    <>
      {/* Mini-formulaire d'ajout */}
      <form className="card rounded-2xl border bg-card shadow-md p-4 grid grid-cols-1 gap-3" onSubmit={handleAdd} autoComplete="off">
        <div>
          <label className="block text-xs font-bold mb-1" htmlFor="marqueModele">Marque/Modèle</label>
          <input
            id="marqueModele"
            className="w-full border rounded-lg px-3 py-2 text-sm bg-muted/40 text-foreground/70"
            type="text"
            value={form.marqueModele}
            onChange={e=>handleChange('marqueModele', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1" htmlFor="annee">Année</label>
          <input
            id="annee"
            className="w-full border rounded-lg px-3 py-2 text-sm bg-muted/40 text-foreground/70"
            type="number"
            value={form.annee}
            onChange={e=>handleChange('annee', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1" htmlFor="kilometrage">Kilométrage</label>
          <input
            id="kilometrage"
            className="w-full border rounded-lg px-3 py-2 text-sm bg-muted/40 text-foreground/70"
            type="number"
            value={form.kilometrage}
            onChange={e=>handleChange('kilometrage', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1" htmlFor="prix">Prix (€)</label>
          <input
            id="prix"
            className="w-full border rounded-lg px-3 py-2 text-sm bg-muted/40 text-foreground/70"
            type="number"
            step="any"
            value={form.prix}
            onChange={e=>handleChange('prix', e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn min-h-[44px] mt-2">Ajouter à la comparaison</button>
      </form>

      {/* Tableau des comparatifs déplacé en bas de page */}
    </>
  );
}

// ExportCSV: exporte les données en CSV
interface ExportCSVProps {
  vehicle: Partial<Mandat>;
  comparatifs: Comparatif[];
  resume: Record<string, any>;
}
function ExportCSV({ vehicle, comparatifs, resume }: ExportCSVProps) {
  const handleExport = () => {
    let csv = '';
    csv += 'Fiche véhicule\n';
    Object.entries(vehicle).forEach(([k,v])=>{csv+=`${k};${v}\n`;});
    csv += '\nComparatifs\n';
    csv += 'Marque/Modèle;Année;Km;Prix;€/km;Écart\n';
    comparatifs.forEach(r=>{
      const prix = Number(r.prix)||0;
      const km = Number(r.kilometrage)||0;
      csv += `${r.marqueModele};${r.annee};${r.kilometrage};${r.prix};${eur(km>0 ? prix/km : 0)};${eur(prix-(Number(vehicle.prix_affiche)||0))}\n`;
    });
    csv += '\nRésumé\n';
    Object.entries(resume).forEach(([k,v])=>{csv+=`${k};${v}\n`;});
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estimation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  return <button className="btn mt-4" onClick={handleExport}>Exporter CSV</button>;
}

// Page principale
export default function Estimation() {
  const { data: mandats = [] } = useQuery<Mandat[]>({ queryKey: ['mandats'], queryFn: fetchMesVehicules });
  const [selected, setSelected] = useState<Mandat | null>(null);
  const [vehicle, setVehicle] = useState<Partial<Mandat>>({ marque:'', modele:'', annee: undefined, version:'', kilometrage:0, prix_affiche:0 });
  const [comparatifs, setComparatifs] = useState<Comparatif[]>([]);
  const [readOnly, setReadOnly] = useState(false);

  // Préremplir fiche véhicule et readOnly
  React.useEffect(() => {
    if (selected) {
      // Affiche la valeur brute de la colonne annee de Supabase
      setVehicle({
        marque: selected.marque,
        modele: selected.modele,
        annee: selected.annee,
        version: selected.version,
        kilometrage: selected.kilometrage,
        prix_affiche: selected.prix_affiche,
      });
      setReadOnly(true);
    } else {
  setVehicle({ marque:'', modele:'', annee:0, version:'', kilometrage:0, prix_affiche:0 });
      setReadOnly(false);
    }
  }, [selected]);

  // Marque/Modèle pour préremplissage comparatif
  const marqueModeleRef = vehicle.marque && vehicle.modele ? `${vehicle.marque} ${vehicle.modele}` : '';

  // Résumé pour export
  const prixArr = comparatifs.map(r => Number(r.prix)||0).filter(n => n>0);
  const resume = useMemo(() => {
    const prixAfficheNum = Number(vehicle.prix_affiche) || 0;
    const moyenne = prixArr.length ? prixArr.reduce((a,b)=>a+b,0)/prixArr.length : 0;
    const deltaMoyen = moyenne - prixAfficheNum;
    return {
      moyenne,
      mediane: prixArr.length ? median(prixArr) : 0,
      min: prixArr.length ? Math.min(...prixArr) : 0,
      max: prixArr.length ? Math.max(...prixArr) : 0,
      deltaMoyen,
      suggestion: prixArr.length ? (Math.abs(deltaMoyen) < 0.05*prixAfficheNum ? 'Position OK (au marché)' : `Suggéré : ${eur(Math.round(prixAfficheNum + deltaMoyen))}`) : '',
    };
  }, [comparatifs, vehicle.prix_affiche]);

  // Calcul des scores attractivité pour toutes les lignes (véhicule de base + comparatifs)
  const allRows = React.useMemo(() => {
    // Utilise la valeur brute de la colonne annee pour le véhicule de base
    let anneeBase: string|number = vehicle.annee ?? '';
    if (typeof anneeBase === 'string' && anneeBase.length >= 4) {
      const match = anneeBase.match(/\d{4}/);
      if (match) anneeBase = Number(match[0]);
    }
    const vehBase: VehicleInput = {
      id: 'base',
      marque: String(vehicle.marque || ''),
      modele: String(vehicle.modele || ''),
      annee: Number(anneeBase),
      km: Number(vehicle.kilometrage),
      prix: Number(vehicle.prix_affiche)
    };
    // Lignes comparatifs
    const vehs: VehicleInput[] = comparatifs.map((row, i) => {
      let annee: number|string = row.annee;
      if (typeof annee === 'string' && annee.length >= 4) {
        const match = annee.match(/\d{4}/);
        if (match) annee = Number(match[0]);
      }
      return {
        id: String(i),
        marque: String(row.marqueModele).split(' ')[0] || '',
        modele: String(row.marqueModele).split(' ').slice(1).join(' ') || '',
        annee: Number(annee),
        km: Number(row.kilometrage),
        prix: Number(row.prix)
      };
    });
    return computeScores([vehBase, ...vehs]);
  }, [vehicle, comparatifs]);

  // Pour édition inline :
  // 0 = véhicule de base, 1... = comparatifs
  const handleCellChange = (rowIdx: number, key: 'annee'|'kilometrage'|'prix', value: string|number) => {
    if (rowIdx === 0) {
      // Véhicule de base : toujours mettre à jour vehicle ET forcer le recalcul
      setVehicle(v => {
        let nv = { ...v };
        if (key === 'prix') nv.prix_affiche = Number(value);
        else if (key === 'kilometrage') nv.kilometrage = Number(value);
        else if (key === 'annee') nv.annee = Number(value);
        return nv;
      });
    } else {
      setComparatifs(cs => cs.map((c, i) => i === rowIdx-1 ? { ...c, [key]: value } : c));
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Estimation</h1>
      <div className="mb-4">
        <VehiclePicker value={selected} onChange={setSelected} options={mandats} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VehicleForm vehicle={vehicle} readOnly={readOnly} />
        {/* Mini-formulaire d'ajout à droite */}
        <ComparatifsTable comparatifs={comparatifs} setComparatifs={setComparatifs} prix_affiche={vehicle.prix_affiche} marqueModeleRef={marqueModeleRef} />
      </div>

      {/* Tableau des comparatifs tout en bas */}
      <div className="overflow-x-auto mt-6">
        <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card bg-neutral-50 dark:bg-neutral-900 shadow-lg md:shadow-2xl p-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left font-semibold px-4 py-2 border-b">Marque/Modèle</th>
                <th className="text-left font-semibold px-4 py-2 border-b">Année</th>
                <th className="text-left font-semibold px-4 py-2 border-b">Kilométrage</th>
                <th className="text-right font-semibold px-4 py-2 border-b">Prix (€)</th>
                <th className="text-right font-semibold px-4 py-2 border-b">Écart vs {eur(Number(vehicle.prix_affiche)||0)}</th>
                <th className="text-right font-semibold px-4 py-2 border-b">Score attractivité (%)</th>
                <th className="text-center font-semibold px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allRows.map((row, i) => {
                // i=0: véhicule de base, i>0: comparatifs
                const isBase = i === 0;
                const prix = Number(row.prix)||0;
                const km = Number(row.km)||0;
                const prixAff = Number(vehicle.prix_affiche)||0;
                let scoreColor = 'text-red-600 font-bold';
                if (row.score >= 85) scoreColor = 'text-green-600 font-bold';
                else if (row.score >= 75) scoreColor = 'text-orange-500 font-bold';
                return (
                  <tr key={i} className={isBase ? 'bg-yellow-50 font-semibold' : (i%2 ? 'odd:bg-muted/30' : '')}>
                    <td className="px-4 py-2 border-b align-middle">{isBase ? `${vehicle.marque} ${vehicle.modele}` : comparatifs[i-1]?.marqueModele}</td>
                    <td className="px-4 py-2 border-b align-middle">
                      <input
                        type="number"
                        className="w-20 border rounded px-1 py-1 text-sm bg-muted/40 text-foreground/70 text-center"
                        value={row.annee}
                        onChange={e => handleCellChange(i, 'annee', Number(e.target.value))}
                        style={{ background: isBase ? '#fffbe6' : undefined }}
                      />
                    </td>
                    <td className="px-4 py-2 border-b align-middle">
                      <input
                        type="number"
                        className="w-24 border rounded px-1 py-1 text-sm bg-muted/40 text-foreground/70 text-center"
                        value={km}
                        onChange={e => handleCellChange(i, 'kilometrage', Number(e.target.value))}
                        style={{ background: isBase ? '#fffbe6' : undefined }}
                      />
                    </td>
                    <td className="px-4 py-2 border-b align-middle text-right">
                      <input
                        type="number"
                        className="w-24 border rounded px-1 py-1 text-sm bg-muted/40 text-foreground/70 text-right"
                        value={prix}
                        onChange={e => handleCellChange(i, 'prix', Number(e.target.value))}
                        style={{ background: isBase ? '#fffbe6' : undefined }}
                      />
                    </td>
                    <td className="px-4 py-2 border-b align-middle text-right">{isBase ? '—' : eur(prix-prixAff)}</td>
                    <td className={`px-4 py-2 border-b align-middle text-right ${scoreColor}`}>{Math.round(row.score)}%</td>
                    <td className="px-4 py-2 border-b align-middle text-center">
                      {isBase ? <span className="text-xs text-gray-400">Référence</span> : (
                        <button className="btn btn-xs min-h-[32px] bg-red-100 text-red-700 rounded-full px-3" onClick={()=>setComparatifs(comparatifs.filter((_, j) => j!==i-1))} aria-label="Supprimer">Supprimer</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Résumé sous le tableau */}
  <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card bg-neutral-50 dark:bg-neutral-900 shadow-lg md:shadow-2xl p-4 mt-4">
        <div className="font-bold mb-2">Résumé</div>
        <div className="text-sm grid grid-cols-2 gap-2">
          <span>Moyenne: {eur(resume.moyenne)}</span>
          <span>Médiane: {eur(resume.mediane)}</span>
          <span>Min: {eur(resume.min)}</span>
          <span>Max: {eur(resume.max)}</span>
          <span>Delta moyen: {eur(resume.deltaMoyen)}</span>
          <span>Suggestion: {resume.suggestion}</span>
        </div>
      </div>

      <ExportCSV vehicle={vehicle} comparatifs={comparatifs} resume={resume} />
    </div>
  );
}


