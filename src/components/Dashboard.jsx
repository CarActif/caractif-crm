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

  // Statuts et couleurs (très sobres)
  const statuts = [
    { name: "Mandat signé", color: "bg-gray-800 text-gray-100" },
    { name: "Publié", color: "bg-gray-700 text-gray-100" },
    { name: "Sous offre", color: "bg-gray-700 text-gray-100" },
    { name: "Vendu", color: "bg-gray-700 text-gray-100" },
    { name: "Archivé", color: "bg-gray-900 text-gray-400" },
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
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center bg-[#090909]">
      {/* Glow central soft */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] rounded-full blur-3xl opacity-95 bg-gradient-to-br from-white to-green-900" />
      </div>
      {/* Contenu */}
      <div className="relative z-10 w-full max-w-7xl mx-auto p-2 sm:p-6">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 text-center sm:text-left text-white tracking-wide">
          Bienvenue <span className="text-[#4ADE80]">{prenom || "utilisateur"}</span> 👋
        </h1>

        {/* Stats principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          <div className="bg-[#181818] rounded-2xl shadow-lg border border-gray-700 p-3 sm:p-5 flex flex-col items-center">
            <span className="text-xs sm:text-sm text-gray-400 font-semibold">Véhicules en stock</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#4ADE80]">{mandats.length}</span>
          </div>
          <div className="bg-[#181818] rounded-2xl shadow-lg border border-gray-700 p-3 sm:p-5 flex flex-col items-center">
            <span className="text-xs sm:text-sm text-gray-400 font-semibold">Commission ce mois-ci</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#4ADE80]">{commissionRate.toFixed(0)} €</span>
          </div>
          <div className="bg-[#181818] rounded-2xl shadow-lg border border-gray-700 p-3 sm:p-5 flex flex-col items-center">
            <span className="text-xs sm:text-sm text-gray-400 font-semibold">Top vente</span>
            <span className="text-sm sm:text-lg font-bold text-gray-100">
              {topVente
                ? `${topVente.marque} ${topVente.modele} (${topVente.commission_ttc} €)`
                : "—"}
            </span>
          </div>
          <div className="bg-[#181818] rounded-2xl shadow-lg border border-gray-700 p-3 sm:p-5 flex flex-col items-center">
            <span className="text-xs sm:text-sm text-gray-400 font-semibold">CA mensuel HT</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#4ADE80]">{commissionHT.toFixed(0)} €</span>
          </div>
        </div>

        {/* 2 Colonnes : à gauche (actions/recent), à droite (statuts) */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Colonne de gauche */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Derniers mandats */}
            <div className="bg-[#161616] rounded-2xl shadow-md border border-gray-800">
              <h2 className="text-base sm:text-lg font-semibold mb-4 text-[#4ADE80] pl-2">Derniers mandats</h2>
              {derniersMandats.length === 0 ? (
                <p className="text-gray-400 pl-2">Aucun mandat enregistré.</p>
              ) : (
                <ul className="divide-y divide-gray-900/70">
                  {derniersMandats.map((m) => (
                    <li key={m.id} className="py-2 flex items-center justify-between text-xs sm:text-base px-2">
                      <span>
                        <span className="font-extrabold text-white">{m.marque} {m.modele}</span>
                        {" — "}
                        <span className="text-gray-300">{m.finition}</span>
                      </span>
                      <span className="text-[10px] sm:text-xs bg-gray-900/70 px-2 py-1 rounded text-gray-300">
                        {new Date(m.date_ajout || m.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* To-do List Supabase */}
            <div className="bg-[#161616] rounded-2xl shadow-md border border-gray-800">
              <h2 className="text-base sm:text-lg font-semibold mb-4 text-[#4ADE80] pl-2">To-do CRM</h2>
              <form onSubmit={handleAddTodo} className="flex gap-2 mb-4 flex-col sm:flex-row px-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={e => setNewTodo(e.target.value)}
                  placeholder="Ajouter une tâche…"
                  className="border rounded px-3 py-2 w-full sm:w-auto flex-1 bg-black/70 text-white border-gray-700 focus:border-[#4ADE80] outline-none"
                  disabled={loadingTodos}
                />
                <button
                  type="submit"
                  className="bg-[#4ADE80] text-black px-4 py-2 rounded-2xl font-bold shadow border border-gray-700 hover:bg-[#6EE7B7] transition-all"
                  disabled={loadingTodos}
                >
                  Ajouter
                </button>
              </form>
              {loadingTodos ? (
                <p className="text-gray-400 pl-2">Chargement…</p>
              ) : (
                <ul className="space-y-2 px-2">
                  {todos.map((todo) => (
                    <li key={todo.id} className="flex items-center gap-3 group text-xs sm:text-base">
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={() => handleToggle(todo.id, todo.done)}
                        className="accent-[#4ADE80]"
                      />
                      <span className={todo.done ? "line-through text-gray-500" : "text-gray-100"}>
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
                  {todos.length === 0 && <li className="text-gray-300">Aucune tâche.</li>}
                </ul>
              )}
            </div>
          </div>

          {/* Colonne de droite : statuts */}
          <div className="bg-[#161616] rounded-2xl shadow-md p-3 sm:p-5 flex flex-col items-center justify-center min-w-[210px] border border-gray-800">
            <h2 className="text-base sm:text-lg font-semibold mb-4 text-white text-center">Répartition des statuts</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {statutCounts.map((s) => (
                <span
                  key={s.name}
                  className={`px-3 py-2 rounded-full text-[12px] sm:text-sm font-bold border border-gray-700 ${s.color}`}
                >
                  {s.name} : <b>{s.count}</b>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

