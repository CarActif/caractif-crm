import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/"); // ⬅️ redirige vers page de login
    } else {
      console.error("Erreur déconnexion :", error);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-white px-6 py-4 shadow-md border-b">
      <div className="text-xl font-bold text-blue-600">
        <Link to="/dashboard">CarActif CRM</Link>
      </div>
      <div className="flex space-x-6 items-center">
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
    </nav>
  );
}

