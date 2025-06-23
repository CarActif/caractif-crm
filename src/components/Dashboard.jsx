import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [commissionTTC, setCommissionTTC] = useState(0);
  const [commissionHT, setCommissionHT] = useState(0);
  const [commissionRate, setCommissionRate] = useState(0);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        navigate("/");
      } else {
        setUser(data.session.user);
      }
    };

    getSession();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("mandats")
        .select("*")
        .eq("user_id", user.id);

      if (!error && data) {
        setVehicles(data);

        const totalTTC = data.reduce((acc, car) => acc + (car.commission_ttc || 0), 0);
        const ht = totalTTC / 1.2;

        setCommissionTTC(totalTTC);
        setCommissionHT(ht);
        setCommissionRate(calculateRate(ht));
      }
    };

    fetchData();
  }, [user]);

  const calculateRate = (ht) => {
    const tranches = [
      { max: 1999.99, taux: 0.15 },
      { max: 3999.99, taux: 0.20 },
      { max: 6999.99, taux: 0.25 },
      { max: 10999.99, taux: 0.30 },
      { max: 14999.99, taux: 0.30 },
      { max: Infinity, taux: 0.30 },
    ];

    let reste = ht;
    let com = 0;
    let debut = 0;

    for (const tranche of tranches) {
      const montant = Math.min(tranche.max - debut, reste);
      if (montant <= 0) break;
      com += montant * tranche.taux;
      reste -= montant;
      debut = tranche.max;
    }

    return com;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenue {user?.user_metadata?.prenom || "utilisateur"} 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Votre commission brute estimée</h2>
          <p className="text-3xl font-bold text-blue-600 mb-1">{commissionRate.toFixed(2)} €</p>
          <p className="text-gray-500 text-sm">C.A mensuel HT : {commissionHT.toFixed(2)} €</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div
            className="bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-4 rounded cursor-pointer shadow"
            onClick={() => navigate("/add")}
          >
            ➕ Nouveau véhicule
          </div>
          <div
            className="bg-gray-100 hover:bg-gray-200 text-center font-medium py-4 rounded cursor-pointer shadow"
            onClick={() => navigate("/list")}
          >
            🚗 Liste des véhicules
          </div>
        </div>
      </div>
    </div>
  );
}
