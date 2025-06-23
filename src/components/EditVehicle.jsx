import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    marque: "",
    modele: "",
    version: "",
    finition: "",
    annee: "",
    kilometrage: "",
    motorisation: "",
    energie: "",
    puissance_fiscale: "",
    puissance_din: "",
    nb_portes: "",
    nb_places: "",
    couleur: "",
    couleur_interieure: "",
    critair: "",
    departement: "",
    prix_net_vendeur: "",
    commission_ttc: "",
    prix_affiche: "",
    statut: "",
  });

  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchMandat = async () => {
      const { data, error } = await supabase
        .from("mandats")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erreur chargement mandat :", error);
      } else {
        const dateISO = data.annee ? new Date(data.annee).toISOString().split("T")[0] : "";
        setForm({ ...data, annee: dateISO });
        setLoading(false);
      }
    };

    fetchMandat();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    if (name === "prix_net_vendeur") {
      const net = parseFloat(value) || 0;
      let commission = 0;
      if (net <= 15000) commission = 1090;
      else if (net <= 25000) commission = 1490;
      else if (net <= 35000) commission = 1990;
      else if (net <= 45000) commission = 2490;
      else if (net <= 60000) commission = 2990;
      else if (net <= 90000) commission = 3490;
      else if (net <= 120000) commission = 4490;
      else commission = 5990;
      updatedForm.commission_ttc = commission.toString();
      updatedForm.prix_affiche = (net + commission).toString();
    }

    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSave = {
      ...form,
      annee: form.annee ? new Date(form.annee).toISOString() : null,
    };

    const { error } = await supabase.from("mandats").update(dataToSave).eq("id", id);
    if (error) {
      console.error("Erreur modification mandat :", error);
    } else {
      setSuccessMessage("Mandat modifié avec succès !");
      setTimeout(() => {
        navigate("/list");
      }, 1500);
    }
  };

  if (loading) return <p className="p-6">Chargement du mandat...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Modifier le mandat</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bloc général */}
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="font-semibold text-lg mb-4">Informations générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="marque" value={form.marque} onChange={handleChange} placeholder="Marque" className="input" />
            <input name="modele" value={form.modele} onChange={handleChange} placeholder="Modèle" className="input" />
            <input name="version" value={form.version} onChange={handleChange} placeholder="Version" className="input" />
            <input name="finition" value={form.finition} onChange={handleChange} placeholder="Finition" className="input" />
            <input type="date" name="annee" value={form.annee} onChange={handleChange} className="input" />
            <input name="kilometrage" value={form.kilometrage} onChange={handleChange} placeholder="Kilométrage" className="input" />
          </div>
        </div>

        {/* Bloc motorisation */}
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="font-semibold text-lg mb-4">Motorisation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="motorisation" value={form.motorisation} onChange={handleChange} placeholder="Motorisation" className="input" />
            <input name="energie" value={form.energie} onChange={handleChange} placeholder="Type de carburant" className="input" />
            <input name="puissance_fiscale" value={form.puissance_fiscale} onChange={handleChange} placeholder="Puissance fiscale" className="input" />
            <input name="puissance_din" value={form.puissance_din} onChange={handleChange} placeholder="Puissance DIN" className="input" />
            <input name="nb_portes" value={form.nb_portes} onChange={handleChange} placeholder="Nombre de portes" className="input" />
            <input name="nb_places" value={form.nb_places} onChange={handleChange} placeholder="Nombre de places" className="input" />
          </div>
        </div>

        {/* Bloc design */}
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="font-semibold text-lg mb-4">Design et confort</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="couleur" value={form.couleur} onChange={handleChange} placeholder="Couleur extérieure" className="input" />
            <input name="couleur_interieure" value={form.couleur_interieure} onChange={handleChange} placeholder="Couleur intérieure" className="input" />
            <input name="critair" value={form.critair} onChange={handleChange} placeholder="Vignette Crit'Air" className="input" />
          </div>
        </div>

        {/* Bloc localisation et prix */}
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="font-semibold text-lg mb-4">Localisation et prix</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="departement" value={form.departement} onChange={handleChange} placeholder="Département" className="input" />
            <input name="prix_net_vendeur" value={form.prix_net_vendeur} onChange={handleChange} placeholder="Prix net vendeur (€)" className="input" />
            <input name="commission_ttc" value={form.commission_ttc} readOnly className="input bg-gray-100" placeholder="Commission (€)" />
            <input name="prix_affiche" value={form.prix_affiche} readOnly className="input bg-gray-100" placeholder="Prix affiché (€)" />
          </div>
        </div>

        {/* Bouton */}
        <div className="text-right">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Enregistrer les modifications
          </button>
        </div>

        {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
      </form>
    </div>
  );
}
