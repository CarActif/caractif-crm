import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";


// Listes déroulantes identiques à AddVehicle
const marques = [
  "Abarth", "Alfa Romeo", "Alpine", "Aston Martin", "Audi", "Bentley", "BMW", "BYD",
  "Chevrolet", "Chrysler", "Citroën", "Cupra", "Dacia", "Daewoo", "Daihatsu", "Dodge",
  "DS", "Ferrari", "Fiat", "Ford", "GMC", "Honda", "Hummer", "Hyundai", "Infiniti",
  "Isuzu", "Jaguar", "Jeep", "Kia", "Lada", "Lamborghini", "Lancia", "Land Rover", "Lexus",
  "Lotus", "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan",
  "Opel", "Peugeot", "Polestar", "Porsche", "Renault", "Rolls-Royce", "Rover", "Saab",
  "Seat", "Skoda", "Smart", "Ssangyong", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"
];
const carburants = [
  "Diesel", "E85 (Ethanol)", "Electrique", "Essence", "GPL", "Hybride",
  "Hybride rechargeable", "Hydrogène", "Autre"
];
const couleurs = [
  "Blanc", "Noir", "Gris", "Bleu", "Rouge", "Vert", "Jaune", "Orange",
  "Marron", "Violet", "Beige", "Autre"
];
const couleursInt = [
  "Noir", "Gris", "Beige", "Marron", "Rouge", "Bleu", "Blanc", "Autre"
];
const critairOptions = [
  { value: "1", label: "Crit’Air 1" },
  { value: "2", label: "Crit’Air 2" },
  { value: "3", label: "Crit’Air 3" },
  { value: "4", label: "Crit’Air 4" },
  { value: "5", label: "Crit’Air 5" },
  { value: "verte", label: "Vignette verte (Électrique/Hydrogène)" },
  { value: "non éligible", label: "Véhicule non éligible à une vignette" }
];
const departements = [
  { num: "01", nom: "Ain" }, { num: "02", nom: "Aisne" }, { num: "03", nom: "Allier" },
  { num: "04", nom: "Alpes-de-Haute-Provence" }, { num: "05", nom: "Hautes-Alpes" }, { num: "06", nom: "Alpes-Maritimes" },
  { num: "07", nom: "Ardèche" }, { num: "08", nom: "Ardennes" }, { num: "09", nom: "Ariège" },
  { num: "10", nom: "Aube" }, { num: "11", nom: "Aude" }, { num: "12", nom: "Aveyron" },
  { num: "13", nom: "Bouches-du-Rhône" }, { num: "14", nom: "Calvados" }, { num: "15", nom: "Cantal" },
  { num: "16", nom: "Charente" }, { num: "17", nom: "Charente-Maritime" }, { num: "18", nom: "Cher" },
  { num: "19", nom: "Corrèze" }, { num: "2A", nom: "Corse-du-Sud" }, { num: "2B", nom: "Haute-Corse" },
  { num: "21", nom: "Côte-d'Or" }, { num: "22", nom: "Côtes-d'Armor" }, { num: "23", nom: "Creuse" },
  { num: "24", nom: "Dordogne" }, { num: "25", nom: "Doubs" }, { num: "26", nom: "Drôme" },
  { num: "27", nom: "Eure" }, { num: "28", nom: "Eure-et-Loir" }, { num: "29", nom: "Finistère" },
  { num: "30", nom: "Gard" }, { num: "31", nom: "Haute-Garonne" }, { num: "32", nom: "Gers" },
  { num: "33", nom: "Gironde" }, { num: "34", nom: "Hérault" }, { num: "35", nom: "Ille-et-Vilaine" },
  { num: "36", nom: "Indre" }, { num: "37", nom: "Indre-et-Loire" }, { num: "38", nom: "Isère" },
  { num: "39", nom: "Jura" }, { num: "40", nom: "Landes" }, { num: "41", nom: "Loir-et-Cher" },
  { num: "42", nom: "Loire" }, { num: "43", nom: "Haute-Loire" }, { num: "44", nom: "Loire-Atlantique" },
  { num: "45", nom: "Loiret" }, { num: "46", nom: "Lot" }, { num: "47", nom: "Lot-et-Garonne" },
  { num: "48", nom: "Lozère" }, { num: "49", nom: "Maine-et-Loire" }, { num: "50", nom: "Manche" },
  { num: "51", nom: "Marne" }, { num: "52", nom: "Haute-Marne" }, { num: "53", nom: "Mayenne" },
  { num: "54", nom: "Meurthe-et-Moselle" }, { num: "55", nom: "Meuse" }, { num: "56", nom: "Morbihan" },
  { num: "57", nom: "Moselle" }, { num: "58", nom: "Nièvre" }, { num: "59", nom: "Nord" },
  { num: "60", nom: "Oise" }, { num: "61", nom: "Orne" }, { num: "62", nom: "Pas-de-Calais" },
  { num: "63", nom: "Puy-de-Dôme" }, { num: "64", nom: "Pyrénées-Atlantiques" }, { num: "65", nom: "Hautes-Pyrénées" },
  { num: "66", nom: "Pyrénées-Orientales" }, { num: "67", nom: "Bas-Rhin" }, { num: "68", nom: "Haut-Rhin" },
  { num: "69", nom: "Rhône" }, { num: "70", nom: "Haute-Saône" }, { num: "71", nom: "Saône-et-Loire" },
  { num: "72", nom: "Sarthe" }, { num: "73", nom: "Savoie" }, { num: "74", nom: "Haute-Savoie" },
  { num: "75", nom: "Paris" }, { num: "76", nom: "Seine-Maritime" }, { num: "77", nom: "Seine-et-Marne" },
  { num: "78", nom: "Yvelines" }, { num: "79", nom: "Deux-Sèvres" }, { num: "80", nom: "Somme" },
  { num: "81", nom: "Tarn" }, { num: "82", nom: "Tarn-et-Garonne" }, { num: "83", nom: "Var" },
  { num: "84", nom: "Vaucluse" }, { num: "85", nom: "Vendée" }, { num: "86", nom: "Vienne" },
  { num: "87", nom: "Haute-Vienne" }, { num: "88", nom: "Vosges" }, { num: "89", nom: "Yonne" },
  { num: "90", nom: "Territoire de Belfort" }, { num: "91", nom: "Essonne" }, { num: "92", nom: "Hauts-de-Seine" },
  { num: "93", nom: "Seine-Saint-Denis" }, { num: "94", nom: "Val-de-Marne" }, { num: "95", nom: "Val-d'Oise" },
  { num: "971", nom: "Guadeloupe" }, { num: "972", nom: "Martinique" }, { num: "973", nom: "Guyane" },
  { num: "974", nom: "La Réunion" }, { num: "976", nom: "Mayotte" }
];

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
          couleur_interieure: "",
          couleur_interieure: ""
        });
      }
    };

    fetchMandat();
  }, [id]);

  if (!form) return <p>Chargement…</p>;

  // Menus déroulants numériques
  const nbPortes = [2, 3, 4, 5];
  const nbPlaces = Array.from({ length: 9 }, (_, i) => i + 1);

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

  // À mettre au début du fichier
const BUCKET = "mandat-photos"; // Mets ici le nom exact de ton bucket Supabase

const handleImageUpload = async () => {
  const urls = [];
  if (!images.length) return urls;

  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    const fileName = `${Date.now()}-${file.name}`;

    // Upload l’image dans le bucket
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(`mandats/${fileName}`, file);

    if (!uploadError) {
      // Récupère l’URL publique
      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(`mandats/${fileName}`);
      urls.push(data.publicUrl);
    } else {
      console.error("Erreur d’upload Supabase:", uploadError);
    }
  }

  return urls;
};


  const handleSubmit = async (e) => {
  e.preventDefault();

  // Vérification des champs obligatoires
  if (!form.marque || !form.modele || !form.prix_net_vendeur || !form.departement) {
    Swal.fire({
      icon: 'error',
      title: 'Champs obligatoires manquants',
      text: 'Merci de compléter au moins : Marque, Modèle, Prix net vendeur et Département.',
      confirmButtonColor: '#FFD700'
    });
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return;

  const userId = session.user.id;

  let photoUrls = form.photo_url;  // On récupère l'existant par défaut
  const uploadedPhotos = await handleImageUpload();

  // Si une nouvelle photo a été uploadée, on remplace
  if (uploadedPhotos && uploadedPhotos.length > 0) {
    photoUrls = uploadedPhotos;
  }

  const { error } = await supabase
    .from("mandats")
    .update({
      ...form,
      photo_url: photoUrls,
      annee: form.annee ? new Date(form.annee).toISOString() : null,
      user_id: userId,
    })
    .eq("id", id);

  if (!error) {
    Swal.fire({
      icon: 'success',
      title: 'Mandat modifié avec succès',
      text: 'Les modifications ont bien été enregistrées.',
      confirmButtonColor: '#20be63'
    }).then(() => {
      window.location.href = "/dashboard";
    });
  } else {
    console.error('Erreur lors de la modification :', error.message);
    Swal.fire({
      icon: 'error',
      title: 'Erreur à la modification',
      text: 'Une erreur est survenue. Veuillez réessayer.',
      confirmButtonColor: '#FFD700'
    });
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
        {/* Bloc 1 - Infos générales */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Marque */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <select
                name="marque"
                value={form.marque}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                <option value="">-- Sélectionner une marque --</option>
                {marques.map((marque) => (
                  <option key={marque} value={marque}>{marque}</option>
                ))}
              </select>
            </div>
            {/* Modèle */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
              <input
                type="text"
                name="modele"
                value={form.modele || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
            {/* Version */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
              <input
                type="text"
                name="version"
                value={form.version || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
            {/* Finition */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Finition</label>
              <input
                type="text"
                name="finition"
                value={form.finition || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
            {/* Année */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Année de mise en circulation</label>
              <input
                type="date"
                name="annee"
                value={form.annee || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
            {/* Kilométrage */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
              <input
                type="text"
                name="kilometrage"
                value={form.kilometrage || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
            {/* Nb portes */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de portes</label>
              <select
                name="nb_portes"
                value={form.nb_portes || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                <option value="">-- Sélectionner --</option>
                {nbPortes.map((porte) => (
                  <option key={porte} value={porte}>{porte}</option>
                ))}
              </select>
            </div>
            {/* Nb places */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de places</label>
              <select
                name="nb_places"
                value={form.nb_places || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                <option value="">-- Sélectionner --</option>
                {nbPlaces.map((place) => (
                  <option key={place} value={place}>{place}</option>
                ))}
              </select>
            </div>
            {/* Couleur */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Couleur extérieure</label>
              <select
                name="couleur"
                value={form.couleur}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                <option value="">-- Sélectionner --</option>
                {couleurs.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {form.couleur === "Autre" && (
                <input
                  type="text"
                  name="couleur_interieure"
                  value={form.couleur_interieure || ""}
                  onChange={handleChange}
                  placeholder="Précisez la couleur"
                  className="mt-2 w-full border border-gray-300 rounded-md py-2 px-3"
                />
              )}
            </div>
            {/* Couleur intérieure */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Couleur intérieure</label>
              <select
                name="couleur_interieure"
                value={form.couleur_interieure}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                <option value="">-- Sélectionner --</option>
                {couleursInt.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {form.couleur_interieure === "Autre" && (
                <input
                  type="text"
                  name="couleur_interieure"
                  value={form.couleur_interieure || ""}
                  onChange={handleChange}
                  placeholder="Précisez la couleur"
                  className="mt-2 w-full border border-gray-300 rounded-md py-2 px-3"
                />
              )}
            </div>
            {/* Critair */}
            <div className="w-full md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Vignette Crit’Air</label>
              <select
                name="critair"
                value={form.critair}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                <option value="">-- Sélectionner --</option>
                {critairOptions.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
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
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de carburant</label>
              <select
                name="energie"
                value={form.energie}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                <option value="">-- Sélectionner --</option>
                {carburants.map((fuel) => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Puissance fiscale</label>
              <input
                type="text"
                name="puissance_fiscale"
                value={form.puissance_fiscale || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Puissance DIN</label>
              <input
                type="text"
                name="puissance_din"
                value={form.puissance_din || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
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
              <select
                name="departement"
                value={form.departement || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                <option value="">-- Sélectionner --</option>
                {departements.map((dep) => (
                  <option key={dep.num} value={dep.num}>{dep.num} - {dep.nom}</option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix net vendeur (€)</label>
              <input
                type="text"
                name="prix_net_vendeur"
                value={form.prix_net_vendeur || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission (€)</label>
              <input
                type="text"
                name="commission_ttc"
                value={form.commission_ttc || ""}
                readOnly
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
                type="number"
                placeholder="Km"
                value={item.km}
                onChange={(e) => updateEntretien(index, "km", e.target.value)}
                className="input input-bordered w-full"
              />
              <input
                type="date"
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
              <select
                value={item.prestataire}
                onChange={(e) => updateEntretien(index, "prestataire", e.target.value)}
                className="input input-bordered w-full"
              >
                <option value="">Prestataire</option>
                <option value="concessionnaire">Concessionnaire</option>
                <option value="autre professionnel">Autre professionnel</option>
                <option value="personnelle">Main d’œuvre personnelle</option>
              </select>
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
          {form.photo_url?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {form.photo_url.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`Photo ${index + 1}`} className="rounded-md object-cover w-full h-32" />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedPhotoUrl = form.photo_url.filter((_, i) => i !== index);
                      setForm((prev) => ({ ...prev, photo_url: updatedPhotoUrl }));
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
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages([...e.target.files])}
            className="input"
          />
        </div>

        {/* Bloc 14 - Équipements & options */}
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

       {/* Bouton submit */}
        <div className="mt-6">
          <button type="submit" className="btn btn-primary w-full">
            Enregistrer les modifications
          </button>
        </div>
        {successMessage && (
          <div className="mt-4 text-green-600 font-semibold text-center">
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
}
