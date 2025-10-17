import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Swal from "sweetalert2";

export default function ContactSelect({ value, onChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const { data, error } = await supabase
          .from("contacts")
          .select("id, nom_complet, telephone, email, societe")
          .or(
            `nom_complet.ilike.%${query}%,telephone.ilike.%${query}%,email.ilike.%${query}%,societe.ilike.%${query}%`
          )
          .limit(10);
        if (active) {
          if (error) throw error;
          setResults(data || []);
        }
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Erreur contact",
          text: e.message || "Erreur lors de la recherche de contact.",
          confirmButtonColor: "#FFD700"
        });
        setResults([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [query]);

  return (
    <div>
      <input
        type="text"
        className="w-full border rounded-lg px-3 py-2 text-sm mb-2"
        placeholder="Recherche contact (nom, téléphone, email, société)"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {loading && <div className="text-xs text-gray-400">Recherche...</div>}
      <ul className="bg-white border rounded max-h-40 overflow-auto">
        {results.map(c => (
          <li key={c.id} className="px-0 py-0">
            <button
              type="button"
              className={`w-full text-left px-2 py-1 cursor-pointer hover:bg-blue-50 ${value === c.id ? "bg-blue-100" : ""}`}
              onClick={e => { e.preventDefault(); setSelected(c); onChange(c.id, c); }}
            >
              <div className="font-medium">{c.nom_complet}</div>
              <div className="text-xs text-gray-500">{c.telephone} {c.email} {c.societe}</div>
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
          <span className="font-semibold">Contact sélectionné :</span> {selected.nom_complet} <span className="text-gray-500">{selected.telephone} {selected.email} {selected.societe}</span>
        </div>
      )}
    </div>
  );
}
