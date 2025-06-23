import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AddVehicle() {
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
    statut: "En cours",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = {
      ...form,
      [name]: value,
    };

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

      const prix_affiche = net + commission;
      updatedForm.commission_ttc = commission.toString();
      updatedForm.prix_affiche = prix_affiche.toString();
    }

    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { session },
      error: userError,
    } = await supabase.auth.getSession();

    if (userError || !session?.user) {
      console.error("Erreur récupération user:", userError);
      return;
    }

    const userId = session.user.id;

    const { error } = await supabase.from("mandats").insert([
      {
        ...form,
        user_id: userId,
        date_ajout: new Date().toISOString(),
        annee: form.annee ? new Date(form.annee).toISOString() : null,
      },
    ]);

    if (error) {
      console.error("Erreur enregistrement mandat :", error);
    } else {
      setSuccessMessage("Mandat enregistré avec succès !");
      setForm({
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
        statut: "En cours",
      });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Nouveau mandat véhicule</h2>

      <form onSubmit={handleSubmit}>
        {/* Bloc 1 - Infos générales */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="marque" placeholder="Marque" value={form.marque} onChange={handleChange} className="input" />
            <input name="modele" placeholder="Modèle" value={form.modele} onChange={handleChange} className="input" />
            <input name="version" placeholder="Version du véhicule" value={form.version} onChange={handleChange} className="input" />
            <input name="finition" placeholder="Finition" value={form.finition} onChange={handleChange} className="input" />
            <input type="date" name="annee" value={form.annee} onChange={handleChange} className="input" />
            <input name="kilometrage" placeholder="Kilométrage" value={form.kilometrage} onChange={handleChange} className="input" />
          </div>
        </div>

        {/* Bloc 2 - Motorisation et puissance */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Motorisation et puissance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="motorisation" placeholder="Motorisation" value={form.motorisation} onChange={handleChange} className="input" />
            <input name="energie" placeholder="Type de carburant" value={form.energie} onChange={handleChange} className="input" />
            <input name="puissance_fiscale" placeholder="Puissance fiscale" value={form.puissance_fiscale} onChange={handleChange} className="input" />
            <input name="puissance_din" placeholder="Puissance DIN" value={form.puissance_din} onChange={handleChange} className="input" />
            <input name="nb_portes" placeholder="Nombre de portes" value={form.nb_portes} onChange={handleChange} className="input" />
            <input name="nb_places" placeholder="Nombre de places" value={form.nb_places} onChange={handleChange} className="input" />
          </div>
        </div>

        {/* Bloc 3 - Design et confort */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Design et confort</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="couleur" placeholder="Couleur extérieure" value={form.couleur} onChange={handleChange} className="input" />
            <input name="couleur_interieure" placeholder="Couleur intérieure" value={form.couleur_interieure} onChange={handleChange} className="input" />
            <input name="critair" placeholder="Vignette Crit’Air" value={form.critair} onChange={handleChange} className="input" />
          </div>
        </div>

        {/* Bloc 4 - Localisation et prix */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Localisation et prix d'affichage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="departement" placeholder="Département" value={form.departement} onChange={handleChange} className="input" />
            <input name="prix_net_vendeur" placeholder="Prix net vendeur (€)" value={form.prix_net_vendeur} onChange={handleChange} className="input" />
            <input name="commission_ttc" placeholder="Commission (€)" value={form.commission_ttc} readOnly className="input bg-gray-100" />
            <input name="prix_affiche" placeholder="Prix affiché (€)" value={form.prix_affiche} readOnly className="input bg-gray-100" />
          </div>
        </div>

        {/* Bouton */}
        <div className="text-right">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Valider le mandat
          </button>
        </div>
      </form>

      {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
    </div>
  );
}
