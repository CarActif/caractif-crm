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
    <nav className="bg-white px-6 py-4 shadow-md border-b sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">
          <Link to="/dashboard">CarActif CRM</Link>
        </div>
        {/* Desktop nav */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/dashboard" className="text-gray-800 hover:text-blue-600 font-medium">
            Accueil
          </Link>
          <Link to="/list" className="text-gray-800 hover:text-blue-600 font-medium">
            Mes mandats
          </Link>
          <Link to="/add" className="text-gray-800 hover:text-blue-600 font-medium">
            Ajouter
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-semibold"
          >
            Déconnexion
          </button>
        </div>
        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menu"
        >
          {/* Icône burger */}
          <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </div>
      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow rounded mt-2 py-2 px-3 flex flex-col gap-3 animate-fade-in">
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="text-gray-800 hover:text-blue-600 font-medium py-2 border-b"
          >
            Accueil
          </Link>
          <Link
            to="/list"
            onClick={() => setMenuOpen(false)}
            className="text-gray-800 hover:text-blue-600 font-medium py-2 border-b"
          >
            Mes mandats
          </Link>
          <Link
            to="/add"
            onClick={() => setMenuOpen(false)}
            className="text-gray-800 hover:text-blue-600 font-medium py-2 border-b"
          >
            Ajouter
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-semibold py-2 text-left"
          >
            Déconnexion
          </button>
        </div>
      )}
    </nav>
  );
}


