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
    pneu_av_g: "",
    pneu_av_d: "",
    pneu_ar_g: "",
    pneu_ar_d: "",
    plaquettes_av: "",
    plaquettes_ar: "",
    type_distribution: "",
    annee_distribution: "",
    huile_moteur: "",
    fuite_huile: "",
    embrayage: "",
    vibrations: "",
    commentaire_test: "",
    carrosserie: "",
    interieur: "",
    entretien: [],
    garantie: "3 mois inclus",
    equipements: [],
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [images, setImages] = useState([]);

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

  const handleImageUpload = async () => {
    const urls = [];
    if (!images.length) return urls;

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("mandat-photos")
        .upload(`mandats/${fileName}`, file);

      if (!uploadError) {
        const { data } = supabase.storage
          .from("mandat-photos")
          .getPublicUrl(`mandats/${fileName}`);
        urls.push(data.publicUrl);
      }
    }

    return urls;
  };
const addEntretien = () => {
  setForm((prev) => ({
    ...prev,
    entretien: [...(prev.entretien || []), { km: "", date: "", description: "", prestataire: "" }],
  }));
};

const updateEntretien = (index, field, value) => {
  const updated = [...form.entretien];
  updated[index][field] = value;
  setForm({ ...form, entretien: updated });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return;

    const userId = session.user.id;
    const photoUrls = await handleImageUpload();

    const { error } = await supabase.from("mandats").insert([
      {
        ...form,
        user_id: userId,
        date_ajout: new Date().toISOString(),
        annee: form.annee ? new Date(form.annee).toISOString() : null,
        photos: photoUrls,
      },
    ]);

    if (!error) {
      setSuccessMessage("Mandat enregistré avec succès !");
      setForm({
        marque: "", modele: "", version: "", finition: "", annee: "", kilometrage: "",
        motorisation: "", energie: "", puissance_fiscale: "", puissance_din: "",
        nb_portes: "", nb_places: "", couleur: "", couleur_interieure: "", critair: "",
        departement: "", prix_net_vendeur: "", commission_ttc: "", prix_affiche: "",
        statut: "En cours", pneu_av_g: "", pneu_av_d: "", pneu_ar_g: "", pneu_ar_d: "",
        plaquettes_av: "", plaquettes_ar: "", type_distribution: "", annee_distribution: "",
        huile_moteur: "", fuite_huile: "", embrayage: "", vibrations: "",
        commentaire_test: "", carrosserie: "", interieur: "", documents_fournis: "",
        garantie: "3 mois inclus",
      });
      setImages([]);
    }
  };

  const getPneuColor = (val) => {
    const v = parseInt(val);
    if (v >= 70) return "border-red-500 text-red-600";
    if (v >= 40) return "border-orange-400 text-orange-500";
    return "border-green-500 text-green-600";
  };
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Nouveau mandat véhicule</h2>

      <form onSubmit={handleSubmit}>
        {/* Bloc 1 - Informations générales (fusionné avec Design et confort) */}
<div className="bg-white rounded-lg p-6 shadow-md mb-6">
  <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Infos générales */}
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
      <input
        type="text"
        name="marque"
        value={form.marque || ""}
        onChange={handleChange}
        placeholder="ex : Peugeot"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
      <input
        type="text"
        name="modele"
        value={form.modele || ""}
        onChange={handleChange}
        placeholder="ex : 208"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
      <input
        type="text"
        name="version"
        value={form.version || ""}
        onChange={handleChange}
        placeholder="ex : 1.2 PureTech"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Finition</label>
      <input
        type="text"
        name="finition"
        value={form.finition || ""}
        onChange={handleChange}
        placeholder="ex : Allure"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Année de mise en circulation</label>
      <input
        type="date"
        name="annee"
        value={form.annee || ""}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
      <input
        type="text"
        name="kilometrage"
        value={form.kilometrage || ""}
        onChange={handleChange}
        placeholder="ex : 120000"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de portes</label>
      <input
        type="text"
        name="nb_portes"
        value={form.nb_portes || ""}
        onChange={handleChange}
        placeholder="ex : 5"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de places</label>
      <input
        type="text"
        name="nb_places"
        value={form.nb_places || ""}
        onChange={handleChange}
        placeholder="ex : 5"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Design et confort */}
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Couleur extérieure</label>
      <input
        type="text"
        name="couleur"
        value={form.couleur || ""}
        onChange={handleChange}
        placeholder="ex : Bleu métallisé"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Couleur intérieure</label>
      <input
        type="text"
        name="couleur_interieure"
        value={form.couleur_interieure || ""}
        onChange={handleChange}
        placeholder="ex : Noir tissu"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Vignette Crit’Air</label>
      <input
        type="text"
        name="critair"
        value={form.critair || ""}
        onChange={handleChange}
        placeholder="ex : Crit’Air 2"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

  </div>
</div>

        {/* Bloc 2 - Motorisation et puissance */}
<div className="bg-white rounded-lg p-6 shadow-md mb-6">
  <h3 className="text-lg font-semibold mb-4">Motorisation et puissance</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Motorisation</label>
      <input
        type="text"
        name="motorisation"
        value={form.motorisation || ""}
        onChange={handleChange}
        placeholder="ex : 1.5 TDCi"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Type de carburant</label>
      <input
        type="text"
        name="energie"
        value={form.energie || ""}
        onChange={handleChange}
        placeholder="ex : Diesel"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Puissance fiscale</label>
      <input
        type="text"
        name="puissance_fiscale"
        value={form.puissance_fiscale || ""}
        onChange={handleChange}
        placeholder="ex : 6 CV"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Puissance DIN</label>
      <input
        type="text"
        name="puissance_din"
        value={form.puissance_din || ""}
        onChange={handleChange}
        placeholder="ex : 110 ch"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

  </div>
</div>

        {/* Bloc 4 - Localisation et prix */}
<div className="bg-white rounded-lg p-6 shadow-md mb-6">
  <h3 className="text-lg font-semibold mb-4">Localisation et prix</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
      <input
        type="text"
        name="departement"
        value={form.departement || ""}
        onChange={handleChange}
        placeholder="Département"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Prix net vendeur (€)</label>
      <input
        type="text"
        name="prix_net_vendeur"
        value={form.prix_net_vendeur || ""}
        onChange={handleChange}
        placeholder="Prix net vendeur (€)"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Commission (€)</label>
      <input
        type="text"
        name="commission_ttc"
        value={form.commission_ttc || ""}
        readOnly
        placeholder="Commission (€)"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-600"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Prix affiché (€)</label>
      <input
        type="text"
        name="prix_affiche"
        value={form.prix_affiche || ""}
        readOnly
        placeholder="Prix affiché (€)"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-600"
      />
    </div>

  </div>
</div>

        {/* Bloc 5 - Pneumatiques */}
        <div className="bg-white p-6 shadow-md mb-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Usure des pneus (%)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["pneu_av_g", "pneu_av_d", "pneu_ar_g", "pneu_ar_d"].map((pneu) => (
              <div key={pneu}>
                <label className="text-sm block mb-1">{pneu.replace(/_/g, " ").toUpperCase()}</label>
                <input
                  type="number"
                  name={pneu}
                  value={form[pneu] || ""}
                  onChange={handleChange}
                  className={`input ${getPneuColor(form[pneu])}`}
                  placeholder="ex: 50"
                />
             </div>
            ))}
          </div>
        </div>

        {/* Bloc 6 - Freinage */}
<div className="bg-white p-6 shadow-md mb-6 rounded-lg">
  <h3 className="text-lg font-semibold mb-4">Freinage</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Plaquettes avant
      </label>
      <select
        name="plaquettes_av"
        value={form.plaquettes_av || ""}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Sélectionner --</option>
        <option value="bon">Bon</option>
        <option value="moyen">Moyen</option>
        <option value="à changer">À changer</option>
      </select>
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Plaquettes arrière
      </label>
      <select
        name="plaquettes_ar"
        value={form.plaquettes_ar || ""}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Sélectionner --</option>
        <option value="bon">Bon</option>
        <option value="moyen">Moyen</option>
        <option value="à changer">À changer</option>
      </select>
    </div>

  </div>
</div>

        {/* Bloc 7 - Distribution */}
<div className="bg-white p-6 shadow-md mb-6 rounded-lg">
  <h3 className="text-lg font-semibold mb-4">Distribution</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Type de distribution
      </label>
      <select
        name="type_distribution"
        value={form.type_distribution || ""}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Sélectionner --</option>
        <option value="chaine">Chaîne</option>
        <option value="courroie">Courroie</option>
      </select>
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Année
      </label>
      <input
        type="text"
        name="annee_distribution"
        value={form.annee_distribution || ""}
        onChange={handleChange}
        placeholder="ex: 2020"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

  </div>
</div>


        {/* Bloc 8 - État moteur */}
<div className="bg-white p-6 shadow-md mb-6 rounded-lg">
  <h3 className="text-lg font-semibold mb-4">État moteur</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        État de l’huile
      </label>
      <select
        name="huile_moteur"
        value={form.huile_moteur || ""}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Sélectionner --</option>
        <option value="propre">Propre</option>
        <option value="usée">Usée</option>
      </select>
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Fuite d’huile
      </label>
      <select
        name="fuite_huile"
        value={form.fuite_huile || ""}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Sélectionner --</option>
        <option value="aucune">Aucune</option>
        <option value="légère">Légère</option>
        <option value="importante">Importante</option>
      </select>
    </div>

  </div>
</div>


       {/* Bloc 9 - Essai routier */}
<div className="bg-white p-6 shadow-md mb-6 rounded-lg">
  <h3 className="text-lg font-semibold mb-4">Essai routier</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        État de l’embrayage
      </label>
      <select
        name="embrayage"
        value={form.embrayage || ""}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Sélectionner --</option>
        <option value="très bon">Très bon</option>
        <option value="bon">Bon</option>
        <option value="correct">Correct</option>
        <option value="usé">Usé</option>
      </select>
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Vibrations observées
      </label>
      <select
        name="vibrations"
        value={form.vibrations || ""}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Sélectionner --</option>
        <option value="aucune">Aucune</option>
        <option value="légère">Légère</option>
        <option value="importante">Importante</option>
      </select>
    </div>

  </div>

  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Commentaires essai
    </label>
    <textarea
      name="commentaire_test"
      value={form.commentaire_test || ""}
      onChange={handleChange}
      placeholder="Notes ou impressions pendant l’essai routier"
      rows={4}
      className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</div>


        {/* Bloc 10 - Esthétique */}
<div className="bg-white p-6 shadow-md mb-6 rounded-lg">
  <h3 className="text-lg font-semibold mb-4">Esthétique</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        État carrosserie
      </label>
      <input
        type="text"
        name="carrosserie"
        value={form.carrosserie || ""}
        onChange={handleChange}
        placeholder="ex : Quelques rayures"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        État intérieur
      </label>
      <input
        type="text"
        name="interieur"
        value={form.interieur || ""}
        onChange={handleChange}
        placeholder="ex : Bon état général"
        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

  </div>
</div>


        {/* Bloc 11 - Historique d’entretien */}
<div className="bg-white p-6 shadow-md mb-6 rounded-lg">
  <h3 className="text-lg font-semibold mb-4">Historique d’entretien</h3>

  {form.entretien && form.entretien.length > 0 && form.entretien.map((entry, index) => (
    <div key={index} className="border rounded-lg p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50">
      <input
        type="number"
        name="km"
        placeholder="Kilométrage"
        value={entry.km}
        onChange={(e) => updateEntretien(index, "km", e.target.value)}
        className="input"
      />
      <input
        type="date"
        name="date"
        value={entry.date}
        onChange={(e) => updateEntretien(index, "date", e.target.value)}
        className="input"
      />
      <input
        type="text"
        name="description"
        placeholder="Opération effectuée"
        value={entry.description}
        onChange={(e) => updateEntretien(index, "description", e.target.value)}
        className="input"
      />
      <select
        name="prestataire"
        value={entry.prestataire}
        onChange={(e) => updateEntretien(index, "prestataire", e.target.value)}
        className="input"
      >
        <option value="">Prestataire</option>
        <option value="concessionnaire">Concessionnaire</option>
        <option value="autre professionnel">Autre professionnel</option>
        <option value="personnelle">Main d’œuvre personnelle</option>
      </select>
    </div>
  ))}

  <div className="text-right">
    <button
      type="button"
      onClick={addEntretien}
      className="text-sm text-blue-600 hover:underline"
    >
      + Ajouter une ligne
    </button>
  </div>
</div>

        {/* Bloc 12 - Garantie */}
        <div className="bg-white p-6 shadow-md mb-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Garantie</h3>
          <input name="garantie" value={form.garantie} readOnly className="input bg-gray-100" />
        </div>

        {/* Bloc 13 - Photos */}
        <div className="bg-white p-6 shadow-md mb-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Photos</h3>
          <input type="file" accept="image/*" multiple onChange={(e) => setImages([...e.target.files])} className="input" />
        </div>

        {/* Bloc 12 - Équipements & options */}
<div className="bg-white p-6 shadow-md mb-6 rounded-lg">
  <h3 className="text-lg font-semibold mb-4">Équipements & options</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    {[
      "Climatisation automatique",
      "Sièges chauffants",
      "Sièges électriques",
      "Toit ouvrant",
      "Toit panoramique",
      "Radar de recul",
      "Radar avant",
      "Caméra de recul",
      "Caméras 360°",
      "GPS intégré",
      "Apple CarPlay / Android Auto",
      "Bluetooth",
      "Régulateur de vitesse",
      "Alerte franchissement de ligne",
      "Détection angle mort",
      "Feux xénon",
      "Feux LED",
      "Jantes alliage",
      "Vitres teintées",
      "Accès sans clé",
      "Démarrage sans clé",
      "Système audio premium",
      "Affichage tête haute",
      "Volant chauffant"
    ].map((option) => (
      <label key={option} className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="equipements"
          value={option}
          checked={form.equipements?.includes(option) || false}
          onChange={(e) => {
            const { value, checked } = e.target;
            const selected = form.equipements || [];
            setForm({
              ...form,
              equipements: checked
                ? [...selected, value]
                : selected.filter((item) => item !== value),
            });
          }}
        />
        <span>{option}</span>
      </label>
    ))}
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
