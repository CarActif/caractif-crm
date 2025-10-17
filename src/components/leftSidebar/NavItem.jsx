import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Tooltip from './Tooltip';

export default function NavItem({ label, to, icon: Icon, badge, expanded, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  if (onClick) {
    return (
      <Tooltip label={label} disabled={expanded}>
        <button
          className={`nav-item${isActive ? ' active' : ''}`}
          aria-current={isActive ? 'page' : undefined}
          tabIndex={0}
          onClick={onClick}
        >
          <span className="icon-wrapper" aria-hidden="true">
            <Icon />
          </span>
          {expanded && <span className="nav-label">{label}</span>}
          {badge && <span className="nav-badge">{badge}</span>}
        </button>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={label} disabled={expanded}>
      <NavLink
        to={to}
        className={({ isActive: navActive }) =>
          `nav-item${isActive || navActive ? ' active' : ''}`
        }
        aria-current={isActive ? 'page' : undefined}
        tabIndex={0}
      >
        <span className="icon-wrapper" aria-hidden="true">
          <Icon />
        </span>
        {expanded && <span className="nav-label">{label}</span>}
        {badge && <span className="nav-badge">{badge}</span>}
      </NavLink>
    </Tooltip>
  );
}
