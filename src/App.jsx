import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AddVehicle from "./components/AddVehicle";
import VehicleList from "./components/VehicleList";
import EditVehicle from "./components/EditVehicle";
import VehicleDetail from "./components/VehicleDetail";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  return session ? children : <Navigate to="/" />;
}

function AppWrapper() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/add" element={<PrivateRoute><AddVehicle /></PrivateRoute>} />
        <Route path="/list" element={<PrivateRoute><VehicleList /></PrivateRoute>} />
        <Route path="/edit/:id" element={<PrivateRoute><EditVehicle /></PrivateRoute>} />
        <Route path="/detail/:id" element={<PrivateRoute><VehicleDetail /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
