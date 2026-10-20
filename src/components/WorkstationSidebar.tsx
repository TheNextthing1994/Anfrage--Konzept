import React, { useEffect, useId, useRef, useState } from 'react';
import { Globe2, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import type { WorkstationSection } from '../data/workstationData';

export interface WorkstationNavigationItem {
  id: WorkstationSection;
  label: string;
  count?: number;
  icon: React.ReactNode;
}

interface WorkstationSidebarProps {
  items: WorkstationNavigationItem[];
  activeSection: WorkstationSection;
  onSectionChange: (section: WorkstationSection) => void;
  onBackToLanding: () => void;
}

const preferenceKey = 'dt_sidebar_collapsed';

export function WorkstationSidebar({
  items, activeSection, onSectionChange, onBackToLanding
}: WorkstationSidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(preferenceKey) !== 'false'; }
    catch { return true; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelId = useId();
  const mobileToggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        mobileToggle.current?.focus();
      }
    };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [mobileOpen]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem(preferenceKey, String(next)); }
    catch { /* Navigation remains usable when browser storage is unavailable. */ }
  };

  return (
    <aside className="dt-sidebar" data-collapsed={collapsed} data-mobile-open={mobileOpen} aria-label="Arbeitsbereichnavigation">
      <div className="dt-sidebar-mobile-bar">
        <span className="dt-sidebar-mobile-brand">D.T. Workstation</span>
        <button
          ref={mobileToggle}
          type="button"
          className="dt-sidebar-mobile-toggle"
          aria-label={mobileOpen ? 'Arbeitsbereiche schließen' : 'Arbeitsbereiche öffnen'}
          aria-expanded={mobileOpen}
          aria-controls={panelId}
          onClick={() => setMobileOpen(open => !open)}
        >
          {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div id={panelId} className="dt-sidebar-panel">
        <div className="dt-sidebar-brand" aria-label="D.T. Workstation">
          <span className="dt-sidebar-monogram" aria-hidden="true">D.T.</span>
          <span className="dt-sidebar-brand-copy" aria-hidden="true">
            <strong>Workstation</strong>
            <span>Foundry OS</span>
          </span>
        </div>

        <nav className="dt-sidebar-nav" aria-label="Arbeitsbereiche">
          {items.map(item => (
            <button
              key={item.id}
              type="button"
              className="dt-sidebar-link"
              aria-label={item.label}
              aria-current={activeSection === item.id ? 'page' : undefined}
              title={item.count === undefined ? item.label : `${item.label} · ${item.count}`}
              onClick={() => {
                onSectionChange(item.id);
                setMobileOpen(false);
                if (mobileOpen) mobileToggle.current?.focus();
              }}
            >
              <span className="dt-sidebar-icon" aria-hidden="true">{item.icon}</span>
              <span className="dt-sidebar-label">{item.label}</span>
              {item.count !== undefined && <span className="dt-sidebar-count">{item.count}</span>}
            </button>
          ))}
        </nav>

        <div className="dt-sidebar-footer">
          <button
            type="button"
            className="dt-sidebar-link"
            aria-label="Homepage öffnen"
            title="Homepage öffnen"
            onClick={onBackToLanding}
          >
            <span className="dt-sidebar-icon" aria-hidden="true"><Globe2 /></span>
            <span className="dt-sidebar-label">Homepage</span>
          </button>
          <button
            type="button"
            className="dt-sidebar-link dt-sidebar-collapse"
            aria-label={collapsed ? 'Seitenleiste ausklappen' : 'Seitenleiste einklappen'}
            title={collapsed ? 'Seitenleiste ausklappen' : 'Seitenleiste einklappen'}
            aria-expanded={!collapsed}
            aria-controls={panelId}
            onClick={toggleCollapsed}
          >
            <span className="dt-sidebar-icon" aria-hidden="true">
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </span>
            <span className="dt-sidebar-label">Einklappen</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
