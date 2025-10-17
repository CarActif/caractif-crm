import { useState } from "react";
import { supabase } from "../supabaseClient";
import { generateMandatPdf } from "../utils/generateMandatPdf";

// Icône FileText SVG
function FileTextIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="14" height="14" rx="2" stroke="#6366f1" strokeWidth="1.5" fill="#fff"/>
      <rect x="6" y="7" width="8" height="1.2" rx="0.6" fill="#6366f1" />
      <rect x="6" y="10" width="8" height="1.2" rx="0.6" fill="#6366f1" />
      <rect x="6" y="13" width="5" height="1.2" rx="0.6" fill="#6366f1" />
    </svg>
  );
}

export default function MandatButton({ item }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setError("");
    try {
      // Charger mandat + contact lié
        const { data, error } = await supabase
          .from("mandats")
          .select(`id, contact_id, marque, modele, vin, immatriculation, annee, kilometrage, prix_net_vendeur, commission_ttc, prix_affiche, departement, user_id, agent_id, date_mandat, contacts:contact_id (nom_complet, telephone, email)`)
          .eq("id", item.id)
          .single();
      if (error || !data) throw new Error(error?.message || "Données introuvables");
      generateMandatPdf({ mandat: data, contact: data.contacts || {} });
    } catch (e) {
      setError(e.message || "Erreur PDF");
      setTimeout(() => setError(""), 3500);
    }
    setLoading(false);
  };

  return (
    <div className="mb-1 flex items-center gap-2">
      <button
        className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 text-white text-xs font-semibold shadow hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={handleClick}
        disabled={loading}
        title="Générer le mandat PDF"
      >
        <FileTextIcon size={16} />
        {loading ? "Génération…" : "Générer mandat"}
      </button>
      {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
    </div>
  );
}
