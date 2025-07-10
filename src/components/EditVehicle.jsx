import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient"; 

export default function EditVehicle() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchMandat = async () => {
      const { data, error } = await supabase
        .from("mandats")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setForm({
          ...data,
          annee: data.annee ? data.annee.slice(0, 10) : "",
        });
      }
    };

    fetchMandat();
  }, [id]);

  if (!form) return <p>Chargement...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return;

    const userId = session.user.id;
    const photoUrls = await handleImageUpload();

    const { error } = await supabase
      .from("mandats")
      .update({
        ...form,
        photos: [...(form.photos || []), ...photoUrls],
        annee: form.annee ? new Date(form.annee).toISOString() : null,
        user_id: userId,
      })
      .eq("id", id);

    if (!error) {
      setSuccessMessage("Mandat modifié avec succès !");
    }
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
  const getPneuColor = (val) => {
    const v = parseInt(val);
    if (v >= 70) return "border-red-500 text-red-600";
    if (v >= 40) return "border-orange-400 text-orange-500";
    return "border-green-500 text-green-600";
  };
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Modifier le mandat</h2>

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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Historique d’entretien</h3>
            <button
              type="button"
              onClick={addEntretien}
              className="btn btn-sm btn-outline"
            >
              Ajouter une ligne
            </button>
          </div>

          {(form.entretien || []).map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Km"
                value={item.km}
                onChange={(e) => updateEntretien(index, "km", e.target.value)}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                placeholder="Date"
                value={item.date}
                onChange={(e) => updateEntretien(index, "date", e.target.value)}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateEntretien(index, "description", e.target.value)}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                placeholder="Prestataire"
                value={item.prestataire}
                onChange={(e) => updateEntretien(index, "prestataire", e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          ))}
        </div>
        {/* Bloc 12 - Garantie */}
        <div className="bg-white p-6 shadow-md mb-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Garantie</h3>
          <input
            type="text"
            name="garantie"
            value={form.garantie || ""}
            onChange={handleChange}
            placeholder="Garantie (ex : 3 mois inclus, 6 mois optionnelle, etc.)"
            className="input input-bordered w-full"
          />
        </div>
	{/* Bloc 13 - Photos */}
<div className="bg-white p-6 shadow-md mb-6 rounded-lg">
  <h3 className="text-lg font-semibold mb-4">Photos</h3>

  {/* Affichage des photos déjà enregistrées */}
  {form.photos?.length > 0 ? (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {form.photos.map((url, index) => (
        <div key={index} className="relative">
          <img src={url} alt={`Photo ${index + 1}`} className="rounded-md object-cover w-full h-32" />
          <button
            type="button"
            onClick={() => {
              const updatedPhotos = form.photos.filter((_, i) => i !== index);
              setForm((prev) => ({ ...prev, photos: updatedPhotos }));
            }}
            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 mb-4">Aucune photo enregistrée.</p>
  )}

  {/* Ajout de nouvelles photos */}
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => setImages([...e.target.files])}
    className="input"
  />
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
        {/* Bouton de soumission */}
        <div className="mt-6">
          <button type="submit" className="btn btn-primary w-full">
            Enregistrer les modifications
          </button>
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="mt-4 text-green-600 font-semibold text-center">
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
}
