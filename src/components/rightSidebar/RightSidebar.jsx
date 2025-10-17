import React, { useState, useEffect } from 'react';
import NavSection from './NavSection';
import CollapseToggle from './CollapseToggle';
import './rightSidebar.css';

const SIDEBAR_WIDTH = {
  expanded: 300,
  collapsed: 80,
};

const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const persisted = localStorage.getItem('rightSidebarState');
    if (persisted) return JSON.parse(persisted);
  }
  return { expanded: true, width: SIDEBAR_WIDTH.expanded };
};

export default function RightSidebar({ navItems, children }) {
  const [expanded, setExpanded] = useState(getInitialState().expanded);
  const [width, setWidth] = useState(getInitialState().width);

  useEffect(() => {
    localStorage.setItem('rightSidebarState', JSON.stringify({ expanded, width }));
  }, [expanded, width]);

  return (
    <aside
      className={`right-sidebar${expanded ? '' : ' collapsed'}`}
      style={{ width: expanded ? width : SIDEBAR_WIDTH.collapsed }}
      aria-label="Navigation latérale"
    >
      <CollapseToggle expanded={expanded} setExpanded={setExpanded} />
      <NavSection navItems={navItems} expanded={expanded} />
      {children}
    </aside>
  );
}
