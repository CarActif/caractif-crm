import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function VehicleList() {
  const [mandats, setMandats] = useState([]);
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);

  const statuts = ["Mandat signé", "Publié", "Sous offre", "Vendu", "Archivé", "Tout"];
  const [selectedStatut, setSelectedStatut] = useState(statuts[0]);

  useEffect(() => {
    const fetchMandats = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from("mandats")
        .select("*")
        .eq("user_id", session.user.id)
        .order("date_ajout", { ascending: false });

      if (!error) setMandats(data);
    };

    fetchMandats();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Supprimer ce mandat ?");
    if (!confirm) return;

    const { error } = await supabase.from("mandats").delete().eq("id", id);
    if (!error) {
      setMandats((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleStatutChange = async (id, newStatut) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from("mandats")
      .update({ statut: newStatut })
      .eq("id", id);

    if (!error) {
      setMandats((prev) =>
        prev.map((m) => (m.id === id ? { ...m, statut: newStatut } : m))
      );
    }

    setUpdatingId(null);
  };

  // Filtre la liste selon le statut sélectionné ou tout
  const filteredMandats = selectedStatut === "Tout"
    ? mandats
    : mandats.filter(
        (m) => (m.statut || "Mandat signé") === selectedStatut
      );

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-2">Mes mandats</h1>

      {/* Barre d'onglets des statuts */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {statuts.map((statut) => (
          <button
            key={statut}
            className={`px-3 py-1 rounded-full text-sm font-medium 
              ${selectedStatut === statut
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-blue-50"
              }`}
            onClick={() => setSelectedStatut(statut)}
          >
            {statut}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredMandats.length === 0 && (
          <div className="text-gray-400 italic col-span-full text-center">
            Aucun véhicule dans cette catégorie.
          </div>
        )}
        {filteredMandats.map((mandat) => (
          <div
            key={mandat.id}
            className="bg-white p-2 rounded-lg shadow border relative flex flex-col h-full"
            style={{ minHeight: 320 }}
          >
            {/* Image de présentation */}
            <div className="mb-2">
              <img
                src={
                  mandat.photo_url && mandat.photo_url.length > 0
                    ? mandat.photo_url[0]
                    : "/no-image-available.png"
                }
                alt="Présentation véhicule"
                className="w-full h-28 object-cover rounded"
                style={{ minHeight: 96, maxHeight: 120 }}
              />
            </div>

            <h2 className="text-base font-bold truncate mb-1">{mandat.marque} {mandat.modele}</h2>
            <p className="text-sm text-gray-600 truncate">Finition : {mandat.finition}</p>
            <p className="text-sm text-gray-600 truncate">Couleur : {mandat.couleur}</p>
            <p className="text-xs text-gray-500">
              Mise en circ. :{" "}
              {mandat.annee
                ? new Date(mandat.annee).toLocaleDateString("fr-FR")
                : "—"}
            </p>
            <p className="text-xs text-gray-500">Prix net : {mandat.prix_net_vendeur} €</p>
            <p className="text-xs text-gray-500">Commission : {mandat.commission_ttc} €</p>
            <p className="text-xs text-gray-500">Affiché : {mandat.prix_affiche} €</p>

            <div className="my-1">
              <label htmlFor={`statut-${mandat.id}`} className="block text-xs font-medium text-gray-700 mb-1">Statut :</label>
              <select
                id={`statut-${mandat.id}`}
                value={mandat.statut || "Mandat signé"}
                onChange={(e) => handleStatutChange(mandat.id, e.target.value)}
                className="border rounded px-2 py-1 w-full text-xs"
                disabled={updatingId === mandat.id}
              >
                {statuts.filter(s => s !== "Tout").map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="absolute top-2 right-2 flex gap-1">
              <button
                onClick={() => navigate(`/edit/${mandat.id}`)}
                className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(mandat.id)}
                className="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
