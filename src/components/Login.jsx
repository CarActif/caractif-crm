import { useState } from "react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-green-900 to-yellow-200 relative">
      {/* Effet Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[380px] rounded-full blur-3xl opacity-50 bg-gradient-to-br from-yellow-300 via-green-400 to-green-800 shadow-2xl" />
      </div>
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-xl mx-4 sm:mx-auto rounded-3xl bg-black/90 border-4 border-yellow-400 shadow-[0_8px_40px_4px_rgba(34,197,94,0.4)] px-8 py-10 flex flex-col items-center gap-8"
        style={{
          boxShadow:
            "0 8px 40px 4px rgba(34,197,94,0.25), 0 0 24px 6px #facc15aa",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_6px_rgba(250,204,21,0.3)]">
            CarActif CRM
          </h1>
          <span className="text-yellow-400 font-bold tracking-wider text-lg md:text-2xl drop-shadow">
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
            <label htmlFor="email" className="block text-gray-200 font-bold mb-2 text-lg">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="ex : agent@caractif.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-4 rounded-2xl bg-black/70 border-2 border-green-400 focus:border-yellow-400 text-white placeholder-gray-400 outline-none text-lg transition shadow-md"
              required
              autoComplete="email"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label htmlFor="password" className="block text-gray-200 font-bold mb-2 text-lg">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-4 rounded-2xl bg-black/70 border-2 border-green-400 focus:border-yellow-400 text-white placeholder-gray-400 outline-none text-lg transition shadow-md"
              required
              autoComplete="current-password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl font-extrabold bg-gradient-to-r from-green-400 via-yellow-300 to-yellow-500 text-black shadow-xl text-xl tracking-wide hover:from-green-500 hover:to-yellow-400 hover:scale-[1.03] transition-all duration-200 border-2 border-yellow-400 focus:ring-4 focus:ring-green-300"
          disabled={loading}
          style={{
            textShadow: "0 2px 12px #fde047cc, 0 1px 4px #05966955",
          }}
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}