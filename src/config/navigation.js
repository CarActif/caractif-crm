// src/config/navigation.js

import { Home, List, PlusCircle, Receipt } from "lucide-react";

export const NAV_ITEMS = [
  { key: "dashboard",   label: "Dashboard",     path: "/dashboard",   icon: Home, exact: true },
  { key: "mandats",     label: "Mes mandats",   path: "/list",        icon: List },
  { key: "addvehicle",  label: "Ajouter véhicule", path: "/add",     icon: PlusCircle },
  { key: "facturation", label: "Facturation",   path: "/facturation", icon: Receipt },
  { key: "estimation", label: "Estimation", path: "/estimation", icon: List },
  { key: "contacts", label: "Contacts", path: "/contact", icon: List },
];
