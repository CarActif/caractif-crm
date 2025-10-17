import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();
  async function onClick() {
    try { await supabase.auth.signOut(); } catch {}
    // redirige vers /login si existe, sinon vers /
    try { navigate("/login"); } catch { window.location.href = "/"; }
  }
  return (
    <button onClick={onClick} className="w-full px-3 py-2 rounded-xl border hover:bg-muted">
      Déconnexion
    </button>
  );
}
