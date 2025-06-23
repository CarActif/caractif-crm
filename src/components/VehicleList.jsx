import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function VehicleList() {
  const [mandats, setMandats] = useState([]);
  const navigate = useNavigate();

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
    if (error) {
      alert("Erreur lors de la suppression.");
    } else {
      setMandats((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Mes mandats</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mandats.map((mandat) => (
          <div key={mandat.id} className="bg-white p-4 rounded-lg shadow-md border relative">
            <h2 className="text-lg font-bold">{mandat.marque} {mandat.modele}</h2>
            <p>Finition : {mandat.finition}</p>
            <p>Couleur : {mandat.couleur}</p>
            <p>
  Mise en circulation :{" "}
  {mandat.annee
    ? new Date(mandat.annee).toLocaleDateString("fr-FR")
    : "—"}
</p>
            <p>Prix net vendeur : {mandat.prix_net_vendeur} €</p>
            <p>Commission : {mandat.commission_ttc} €</p>
            <p>Prix affiché : {mandat.prix_affiche} €</p>
            <p>Statut : {mandat.statut}</p>

            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => navigate(`/edit/${mandat.id}`)}
                className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => handleDelete(mandat.id)}
                className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
              >
                🗑 Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
