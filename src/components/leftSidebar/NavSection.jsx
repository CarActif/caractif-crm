import React from 'react';
import NavItem from './NavItem';

export default function NavSection({ navItems, expanded }) {
  return (
    <nav className="nav-section" aria-label="Sections de navigation">
      {navItems.map((item) => (
        <NavItem key={item.label} {...item} expanded={expanded} />
      ))}
    </nav>
  );
}
