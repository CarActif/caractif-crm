
import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabaseClient";
import { fetchMesVehicules } from "../lib/fetchMesVehicules";
import { useNavigate } from "react-router-dom";
import { computeCommissionProgressive } from "../lib/commission";
import SalesChartCard from "./SalesChartCard";
import TodoCrmCard from "../pages/dashboard/TodoCrmCard";
import AlertsCard from "../pages/dashboard/AlertsCard";

// ...existing code...

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [prenom, setPrenom] = useState("");
  // Pour la grid KPI
  const [kpi, setKpi] = useState({ stock: 0, commission: 0, ventes: 0, caht: 0 });
  const [loadingKpi, setLoadingKpi] = useState(true);
  // Pour les autres sections (derniers mandats, top vente...)
  const [mandats, setMandats] = useState([]);
  const [loadingMandats, setLoadingMandats] = useState(true);
  // Charger tous les mandats pour les autres sections (derniers mandats, top vente...)
  useEffect(() => {
    if (!user) return;
    setLoadingMandats(true);
    fetchMesVehicules()
      .then(data => setMandats(data || []))
      .catch(() => setMandats([]))
      .finally(() => setLoadingMandats(false));
  }, [user]);

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

  // Inline editing state for todos
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Start editing a todo
  const handleEditStart = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
    setSavingEdit(false);
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingId(null);
    setEditingText("");
    setSavingEdit(false);
  };

  // Save edited todo
  const handleEditSave = async (id) => {
    if (!editingText.trim()) return;
    setSavingEdit(true);
    const { error } = await supabase
      .from("todos")
      .update({ text: editingText })
      .eq("id", id);
    if (!error) {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: editingText } : t)));
      setEditingId(null);
      setEditingText("");
    }
    setSavingEdit(false);
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


  const statutsData = useMemo(() => {
    const statutsMap = {};
    mandats.forEach(m => { statutsMap[m.statut || "Mandat signé"] = (statutsMap[m.statut || "Mandat signé"] || 0) + 1; });
    return Object.entries(statutsMap).map(([name, value]) => ({ name, value }));
  }, [mandats]);

  // Top vente
  const topVente =
    mandats.length > 0
      ? mandats.reduce((max, m) => (Number(m.commission_ttc) > Number(max.commission_ttc) ? m : max), mandats[0])
      : null;

  // Derniers mandats
  const derniersMandats = [...mandats]
    .sort((a, b) => new Date(b.date_ajout || b.created_at) - new Date(a.date_ajout || a.created_at))
    .slice(0, 4);



  // Helper pour format euro
  function toEuro(n) {
    if (!Number.isFinite(n)) return '—';
    return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  }

  // Helper pour bornes du mois
  function getMonthRange(date = new Date()) {
    const y = date.getFullYear();
    const m = date.getMonth();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);
    return [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)];
  }

  useEffect(() => {
    async function fetchKPIs() {
      setLoadingKpi(true);
      try {
        const mandats = await fetchMesVehicules();
        // 1. Véhicules en stock
        const stock = (mandats ?? []).filter(m => ["Mandat signé", "Publié", "Sous offre"].includes(m.statut)).length;
        // 2. Commission potentielle (HT)
        const cahtPot = (mandats ?? []).filter(m => ["Publié", "Sous offre"].includes(m.statut)).reduce((sum, r) => sum + (Number(r.commission_ttc) || 0) / 1.2, 0);
        const commission = computeCommissionProgressive(cahtPot);
        // 3 & 4. Ventes et CA HT du mois en cours
        const [start, end] = getMonthRange();
        const ventesRows = (mandats ?? []).filter(m => ["Vendu", "Archivé"].includes(m.statut) && m.date_vente >= start && m.date_vente < end);
        const ventes = ventesRows.length;
        const caht = ventesRows.reduce((sum, r) => sum + (Number(r.commission_ttc) || 0) / 1.2, 0);
        setKpi({ stock, commission, ventes, caht });
      } catch {
        setKpi({ stock: 0, commission: 0, ventes: 0, caht: 0 });
      }
      setLoadingKpi(false);
    }
    fetchKPIs();
  }, []);

  return (
  <div className="min-h-screen w-full flex flex-col justify-start items-center bg-background">
      {/* Contenu */}
      <div className="w-full max-w-7xl mx-auto p-2 sm:p-6">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 text-center sm:text-left text-black tracking-wide">
          Bienvenue <span className="text-[#166534]">{prenom || "utilisateur"}</span> 👋
        </h1>

        {/* KPIs du haut : 4 cartes responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
          <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card bg-neutral-50 dark:bg-neutral-900 shadow-lg md:shadow-2xl p-4 flex flex-col items-center">
            <span className="text-base font-bold text-gray-400">Véhicules en stock</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#166534]">{loadingKpi ? '…' : kpi.stock}</span>
          </div>
          <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card bg-neutral-50 dark:bg-neutral-900 shadow-lg md:shadow-2xl p-4 flex flex-col items-center">
            <span className="text-base font-bold text-gray-400">Commission potentielle (HT)</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#166534]">{loadingKpi ? '…' : toEuro(kpi.commission)}</span>
          </div>
          <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card bg-neutral-50 dark:bg-neutral-900 shadow-lg md:shadow-2xl p-4 flex flex-col items-center">
            <span className="text-base font-bold text-gray-400">Ventes (mois en cours)</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#166534]">{loadingKpi ? '…' : kpi.ventes}</span>
          </div>
          <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card bg-neutral-50 dark:bg-neutral-900 shadow-lg md:shadow-2xl p-4 flex flex-col items-center">
            <span className="text-base font-bold text-gray-400">CA HT (mois en cours)</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#166534]">{loadingKpi ? '…' : toEuro(kpi.caht)}</span>
          </div>
        </div>

        {/* Graphique CA HT 6 derniers mois */}
        <div className="mb-8">
          <SalesChartCard mandats={mandats} />
        </div>

        {/* Section To-do et Alerts en bas du dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <TodoCrmCard
            todos={todos}
            onAdd={async (text) => {
              if (!text.trim()) return;
              const { data, error } = await supabase
                .from("todos")
                .insert([{ text, done: false, user_id: user.id }])
                .select();
              if (!error && data) setTodos((prev) => [...prev, ...data]);
            }}
            onToggle={async (id, done) => {
              const { error } = await supabase
                .from("todos")
                .update({ done: !done })
                .eq("id", id);
              if (!error) setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
            }}
            onDelete={async (id) => {
              const { error } = await supabase
                .from("todos")
                .delete()
                .eq("id", id);
              if (!error) setTodos((prev) => prev.filter((t) => t.id !== id));
            }}
            onEdit={async (id, text) => {
              if (!text.trim()) return;
              const { error } = await supabase
                .from("todos")
                .update({ text })
                .eq("id", id);
              if (!error) setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
            }}
            loading={loadingTodos}
          />
          <AlertsCard mandats={mandats} />
        </div>
      </div>
    </div>
  );
}

