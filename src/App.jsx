
import FacturationPage from "./pages/Facturation";
import Estimation from "./pages/Estimation";
import ContactPage from "./pages/Contact";
import ContactCreatePage from "./pages/ContactCreate";
import ContactEditPage from "./pages/ContactEdit";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AddVehicle from "./components/AddVehicle";
import VehicleList from "./components/VehicleList";
import EditVehicle from "./components/EditVehicle";
import VehicleDetail from "./components/VehicleDetail";
import AppSidebar from "./components/AppSidebar";
import MobileTopbar from "./components/MobileTopbar";
import { supabase } from "./supabaseClient";


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
  const isLogin = location.pathname === "/";
  return (
    <div className="flex min-h-[100svh]">
      {/* Sidebar desktop */}
      {!isLogin && (
        <aside className="hidden md:block">
          <AppSidebar />
        </aside>
      )}
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <MobileTopbar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/add" element={<PrivateRoute><AddVehicle /></PrivateRoute>} />
            <Route path="/list" element={<PrivateRoute><VehicleList /></PrivateRoute>} />
            <Route path="/edit/:id" element={<PrivateRoute><EditVehicle /></PrivateRoute>} />
            <Route path="/detail/:id" element={<PrivateRoute><VehicleDetail /></PrivateRoute>} />
            <Route path="/facturation" element={<PrivateRoute><FacturationPage /></PrivateRoute>} />
            <Route path="/estimation" element={<PrivateRoute><Estimation /></PrivateRoute>} />
            <Route path="/contact" element={<PrivateRoute><ContactPage /></PrivateRoute>} />
            <Route path="/contact/create" element={<PrivateRoute><ContactCreatePage /></PrivateRoute>} />
            <Route path="/contact/edit/:id" element={<PrivateRoute><ContactEditPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
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
