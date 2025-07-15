import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [prenom, setPrenom] = useState("");
  const [mandats, setMandats] = useState([]);
  const [commissionTTC, setCommissionTTC] = useState(0);
  const [commissionHT, setCommissionHT] = useState(0);
  const [commissionRate, setCommissionRate] = useState(0);

  // To-do Supabase
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loadingTodos, setLoadingTodos] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        navigate("/");
      } else {
        setUser(data.session.user);

        // Va chercher le prénom dans agents (où id = user.id)
        const { data: agentData } = await supabase
          .from("agents")
          .select("prenom")
          .eq("id", data.session.user.id)
          .single();

        if (agentData && agentData.prenom) {
          setPrenom(agentData.prenom);
        }
      }
    };

    getSession();
  }, [navigate]);

  // Charger les todos Supabase pour l'utilisateur
  useEffect(() => {
    if (!user) return;
    const fetchTodos = async () => {
      setLoadingTodos(true);
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (!error) setTodos(data);
      setLoadingTodos(false);
    };
    fetchTodos();
  }, [user]);

  // Ajouter une todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ text: newTodo, done: false, user_id: user.id }])
      .select();
    if (!error && data) {
      setTodos((prev) => [...prev, ...data]);
      setNewTodo("");
    }
  };

  // Cocher / décocher une todo
  const handleToggle = async (id, done) => {
    const { error } = await supabase
      .from("todos")
      .update({ done: !done })
      .eq("id", id);
    if (!error) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      );
    }
  };

  // Supprimer une todo
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id);
    if (!error) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Statuts et couleurs
  const statuts = [
    { name: "Mandat signé", color: "bg-blue-100 text-blue-800" },
    { name: "Publié", color: "bg-green-100 text-green-800" },
    { name: "Sous offre", color: "bg-yellow-100 text-yellow-800" },
    { name: "Vendu", color: "bg-pink-100 text-pink-800" },
    { name: "Archivé", color: "bg-gray-200 text-gray-700" },
  ];
  const statutCounts = statuts.map((s) => ({
    ...s,
    count: mandats.filter((m) => (m.statut || "Mandat signé") === s.name).length,
  }));

  // Top vente
  const topVente =
    mandats.length > 0
      ? mandats.reduce((max, m) => (Number(m.commission_ttc) > Number(max.commission_ttc) ? m : max), mandats[0])
      : null;

  // Derniers mandats
  const derniersMandats = [...mandats]
    .sort((a, b) => new Date(b.date_ajout || b.created_at) - new Date(a.date_ajout || a.created_at))
    .slice(0, 4);

  // Calcul commissions
  function calculateRate(ht) {
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
  }

  useEffect(() => {
    // Charger les mandats
    const fetchData = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("mandats")
        .select("*")
        .eq("user_id", user.id);
      if (data) {
        setMandats(data);
        const totalTTC = data.reduce((acc, car) => acc + (Number(car.commission_ttc) || 0), 0);
        const ht = totalTTC / 1.2;
        setCommissionTTC(totalTTC);
        setCommissionHT(ht);
        setCommissionRate(calculateRate(ht));
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">
        Bienvenue {prenom || "utilisateur"} 👋
      </h1>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center">
          <span className="text-sm text-gray-500">Véhicules en stock</span>
          <span className="text-2xl font-bold text-blue-600">{mandats.length}</span>
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center">
          <span className="text-sm text-gray-500">Commission ce mois-ci</span>
          <span className="text-2xl font-bold text-green-600">{commissionRate.toFixed(0)} €</span>
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center">
          <span className="text-sm text-gray-500">Top vente</span>
          <span className="text-lg font-bold">
            {topVente
              ? `${topVente.marque} ${topVente.modele} (${topVente.commission_ttc} €)`
              : "—"}
          </span>
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center">
          <span className="text-sm text-gray-500">CA mensuel HT</span>
          <span className="text-2xl font-bold text-blue-600">{commissionHT.toFixed(0)} €</span>
        </div>
      </div>

      {/* 2 Colonnes : à gauche (actions/recent), à droite (statuts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne de gauche */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Derniers mandats */}
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-lg font-semibold mb-4">Derniers mandats</h2>
            {derniersMandats.length === 0 ? (
              <p className="text-gray-400">Aucun mandat enregistré.</p>
            ) : (
              <ul className="divide-y">
                {derniersMandats.map((m) => (
                  <li key={m.id} className="py-2 flex items-center justify-between">
                    <span>
                      <span className="font-semibold text-blue-700">{m.marque} {m.modele}</span>
                      {" — "}
                      <span className="text-gray-500">{m.finition}</span>
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {new Date(m.date_ajout || m.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* To-do List Supabase */}
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-lg font-semibold mb-4">To-do CRM</h2>
            <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
                placeholder="Ajouter une tâche…"
                className="border rounded px-3 py-2 w-full"
                disabled={loadingTodos}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
                disabled={loadingTodos}
              >
                Ajouter
              </button>
            </form>
            {loadingTodos ? (
              <p className="text-gray-400">Chargement…</p>
            ) : (
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li key={todo.id} className="flex items-center gap-3 group">
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => handleToggle(todo.id, todo.done)}
                      className="accent-blue-600"
                    />
                    <span className={todo.done ? "line-through text-gray-400" : ""}>
                      {todo.text}
                    </span>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="ml-auto text-red-400 hover:text-red-600 transition"
                      title="Supprimer"
                    >
                      🗑
                    </button>
                  </li>
                ))}
                {todos.length === 0 && <li className="text-gray-400">Aucune tâche.</li>}
              </ul>
            )}
          </div>
        </div>

        {/* Colonne de droite : statuts */}
        <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-4 text-center">Répartition des statuts</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {statutCounts.map((s) => (
              <span
                key={s.name}
                className={`px-3 py-2 rounded-full text-sm font-medium ${s.color}`}
              >
                {s.name} : <b>{s.count}</b>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

