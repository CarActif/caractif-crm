import React, { useState, useEffect } from 'react';
import NavSection from './NavSection';
import CollapseToggle from './CollapseToggle';
import './leftSidebar.css';

const SIDEBAR_WIDTH = {
  expanded: 300,
  collapsed: 80,
};

const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const persisted = localStorage.getItem('leftSidebarState');
    if (persisted) return JSON.parse(persisted);
  }
  return { expanded: true, width: SIDEBAR_WIDTH.expanded };
};

export default function LeftSidebar({ navItems, children }) {
  const [expanded, setExpanded] = useState(getInitialState().expanded);
  const [width, setWidth] = useState(getInitialState().width);

  useEffect(() => {
    localStorage.setItem('leftSidebarState', JSON.stringify({ expanded, width }));
  }, [expanded, width]);

  // Responsive/overlay state
  const [overlay, setOverlay] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280 && window.innerWidth >= 768) setOverlay(true);
      else setOverlay(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile menu (<768px)
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="sidebar-mobile-toggle xl:hidden fixed top-4 left-4 z-50"
        aria-label="Menu"
        onClick={() => setMobileOpen((o) => !o)}
      >
        <span aria-hidden="true">☰</span>
      </button>
      {/* Overlay for tablet/mobile */}
      {(overlay || mobileOpen) && (
        <div
          className={`sidebar-backdrop${mobileOpen ? ' open' : ''}`}
          tabIndex={-1}
          aria-hidden={!mobileOpen}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`left-sidebar${expanded ? '' : ' collapsed'}${overlay || mobileOpen ? ' open' : ''}`}
        style={{ width: expanded ? width : SIDEBAR_WIDTH.collapsed }}
        aria-label="Navigation latérale"
        aria-expanded={expanded}
        tabIndex={0}
      >
        <CollapseToggle expanded={expanded} setExpanded={setExpanded} />
        <NavSection navItems={navItems} expanded={expanded} />
        {children}
      </aside>
    </>
  );
}
