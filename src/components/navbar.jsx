import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/");
    } else {
      console.error("Erreur déconnexion :", error);
    }
    setMenuOpen(false);
  };

  return (
    <nav className="bg-black px-6 py-4 shadow-md border-b border-gray-800 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-white tracking-wider">
          <Link to="/dashboard">CarActif CRM</Link>
        </div>
        {/* Desktop nav */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/dashboard" className="text-white hover:text-[#4ADE80] font-medium transition">
            Accueil
          </Link>
          <Link to="/list" className="text-white hover:text-[#4ADE80] font-medium transition">
            Mes mandats
          </Link>
          <Link to="/add" className="text-white hover:text-[#4ADE80] font-medium transition">
            Ajouter
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-500 font-bold transition"
          >
            Déconnexion
          </button>
        </div>
        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-900"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menu"
        >
          {/* Icône burger */}
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </div>
      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-black shadow rounded mt-2 py-2 px-3 flex flex-col gap-3 animate-fade-in border border-gray-700">
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="text-white hover:text-[#4ADE80] font-medium py-2 border-b border-gray-700"
          >
            Accueil
          </Link>
          <Link
            to="/list"
            onClick={() => setMenuOpen(false)}
            className="text-white hover:text-[#4ADE80] font-medium py-2 border-b border-gray-700"
          >
            Mes mandats
          </Link>
          <Link
            to="/add"
            onClick={() => setMenuOpen(false)}
            className="text-white hover:text-[#4ADE80] font-medium py-2 border-b border-gray-700"
          >
            Ajouter
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-500 font-bold py-2 text-left"
          >
            Déconnexion
          </button>
        </div>
      )}
    </nav>
  );
}

