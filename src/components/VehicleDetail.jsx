import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";  // ✅ correct


const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      const { data, error } = await supabase
        .from("mandats")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erreur :", error.message);
      } else {
        setVehicle(data);
      }
    };

    fetchVehicle();
  }, [id]);

  if (!vehicle) {
    return <div className="text-center mt-10 text-gray-600">Chargement...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">
        Détails du véhicule
      </h2>
      <div className="bg-white rounded shadow p-6">
        <p><strong>Marque :</strong> {vehicle.marque}</p>
        <p><strong>Modèle :</strong> {vehicle.modele}</p>
        <p><strong>Finition :</strong> {vehicle.finition}</p>
        <p><strong>Mise en circulation :</strong> {vehicle.mise_en_circulation}</p>
        <p><strong>Couleur :</strong> {vehicle.couleur}</p>
        <p><strong>Prix net vendeur :</strong> {vehicle.prix_net_vendeur} €</p>
        <p><strong>Commission :</strong> {vehicle.commission} €</p>
        <p><strong>Prix affiché :</strong> {vehicle.prix_affiche} €</p>
      </div>
      <button
        onClick={() => navigate("/vehicles")}
        className="mt-4 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded"
      >
        ← Retour
      </button>
    </div>
  );
};

export default VehicleDetail;
