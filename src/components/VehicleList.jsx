


import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { fetchMesVehicules } from "../lib/fetchMesVehicules";
import VehicleCard from "./VehicleCard";
import { useNavigate } from "react-router-dom";

const STATI = ["Mandat signé","Publié","Sous offre","Vendu","Archivé"];
const eur = n => Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(Number(n||0));

export default function VehicleList() {
  const [mandats, setMandats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMandats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMesVehicules();
        setMandats(data || []);
      } catch (e) {
        setError(e.message || "Erreur de chargement");
      }
      setLoading(false);
    };
    fetchMandats();
  }, []);

  // Group by statut
  const itemsByStatut = STATI.reduce((acc, s) => {
    acc[s] = [];
    return acc;
  }, {});
  (mandats || []).forEach(m => {
    if (STATI.includes(m.statut)) itemsByStatut[m.statut].push(m);
    else itemsByStatut[STATI[0]].push(m); // fallback
  });

  // Actions
  const handleStatus = async (id, value) => {
    setUpdating(id);
    const old = mandats.find(m => m.id === id);
    setMandats(mandats => mandats.map(m => m.id === id ? { ...m, statut: value } : m));
    const { error } = await supabase.from('mandats').update({ statut: value }).eq('id', id);
    if (error) {
      setMandats(mandats => mandats.map(m => m.id === id ? { ...m, statut: old.statut } : m));
      alert("Erreur de mise à jour du statut");
    }
    setUpdating(false);
  };

  const handleEdit = (item) => {
    navigate(`/edit/${item.id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce véhicule ?")) return;
    setMandats(mandats => mandats.filter(m => m.id !== id));
    const { error } = await supabase.from('mandats').delete().eq('id', id);
    if (error) {
      alert("Erreur lors de la suppression");
      // Optionally, refetch or rollback
    }
  };

  return (
    <div className="px-4 pb-6 min-h-[100vh]" style={{ background: '#f8f6f0' }}>
      <div>
        <h1 className="text-xl font-semibold mb-2" style={{ color: '#111' }}>Mes mandats</h1>
        {loading ? (
          <div className="text-gray-400 italic text-center py-8">Chargement…</div>
        ) : error ? (
          <div className="text-red-500 italic text-center py-8">Erreur : {error}</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-5 grid-flow-col auto-cols-[minmax(210px,1fr)] overflow-x-auto md:overflow-visible">
            {STATI.map(statut => (
              <section
                key={statut}
                className="min-w-[210px] max-w-[320px] flex flex-col gap-1 bg-neutral-900/90 rounded-lg border border-white/5 p-2 shadow"
              >
                <header className="flex items-center justify-between px-1 py-2 rounded-t-xl bg-neutral-800/90">
                  <h3 className="font-semibold text-sm text-white drop-shadow">{statut}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold shadow">{itemsByStatut[statut]?.length || 0}</span>
                </header>
                <div className="flex flex-col gap-3">
                  {itemsByStatut[statut].length === 0 ? (
                    <div className="opacity-60 text-xs">Aucun véhicule</div>
                  ) : (
                    itemsByStatut[statut].map(m => (
                      <VehicleCard
                        key={m.id}
                        item={m}
                        onChangeStatus={handleStatus}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
