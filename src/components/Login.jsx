import { useState } from "react";
// Import Google Fonts Quicksand via CDN (à ajouter dans index.html si pas déjà présent)
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setErrorMsg("Identifiants invalides");
    } else {
      navigate("/dashboard");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-background relative">
      {/* Effet Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[380px] rounded-full blur-3xl opacity-40 bg-gradient-to-br from-[#F5F5E6] via-[#2E7D32] to-[#2E7D32] shadow-2xl" />
      </div>
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-xl mx-4 sm:mx-auto rounded-3xl bg-white border-4 border-[#2E7D32] px-8 py-10 flex flex-col items-center gap-8"
        style={{
          boxShadow:
            "0 0 24px 8px #2E7D32, 0 8px 40px 4px rgba(46,125,50,0.10)",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <img
            src="/caractiflogo.png"
            alt="Logo CarActif"
            className="h-32 md:h-40 drop-shadow"
            style={{ objectFit: 'contain', margin: 0, padding: 0 }}
          />
          <span
            className="text-black font-extrabold tracking-wider text-lg md:text-2xl"
            style={{ fontFamily: 'Fredoka, Quicksand, Arial Rounded MT Bold, Arial, sans-serif' }}
          >
            Connexion
          </span>
        </div>

        {errorMsg && (
          <div className="w-full bg-red-200 text-red-700 px-4 py-2 rounded-lg text-center font-bold border-2 border-red-400 shadow">
            {errorMsg}
          </div>
        )}

        <div className="w-full flex flex-col gap-5">
          {/* EMAIL */}
          <div>
            <label htmlFor="email" className="block text-black font-bold italic mb-2 text-lg">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="ex : agent@caractif.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-4 rounded-2xl bg-[#E6F9ED] border-2 border-[#A5D6A7] focus:border-[#2E7D32] text-black placeholder-[#2E7D32] outline-none text-lg transition shadow-md"
              required
              autoComplete="email"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label htmlFor="password" className="block text-black font-bold italic mb-2 text-lg">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-4 rounded-2xl bg-[#E6F9ED] border-2 border-[#A5D6A7] focus:border-[#2E7D32] text-black placeholder-[#2E7D32] outline-none text-lg transition shadow-md"
              required
              autoComplete="current-password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl font-extrabold bg-[#2E7D32] text-white shadow-xl text-xl tracking-wide hover:bg-[#388E3C] hover:scale-[1.03] transition-all duration-200 border-2 border-[#2E7D32] focus:ring-4 focus:ring-[#A5D6A7]"
          disabled={loading}
          style={{
            textShadow: "0 2px 12px #2E7D32cc, 0 1px 4px #A5D6A755",
          }}
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}