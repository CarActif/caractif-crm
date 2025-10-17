// src/components/AppSidebar.jsx


import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/config/navigation";
import LogoutButton from "@/components/LogoutButton";

export default function AppSidebar({ compact = false }) {
  // compact: true = mobile drawer, false = normal (desktop)
  return (
    <nav
      aria-label="Navigation latérale"
      className={
        `w-full md:w-64 border-r bg-background overflow-y-auto p-3 ` +
        (compact
          ? 'h-full md:h-screen md:sticky md:top-0'
          : 'md:h-screen md:sticky md:top-0')
      }
    >
      <ul className="space-y-1">
        {NAV_ITEMS.map(item => (
          <li key={item.key}>
            <NavLink
              to={item.path}
              end={!!item.exact}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted
                 ${isActive ? "bg-muted font-semibold" : ""}`
              }
            >
              {item.icon ? <item.icon className="h-4 w-4" /> : null}
              <span className="truncate text-sm">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t">
        <LogoutButton />
      </div>
    </nav>
  );
}
