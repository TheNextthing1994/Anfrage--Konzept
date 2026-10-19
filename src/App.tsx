import React, { useState } from 'react';
import {
  INITIAL_OBJECTS,
  StandardizedObject,
  WorkstationSection,
  ObjectState
} from './data/workstationData';
import { LandingPage } from './components/LandingPage';
import { WorkstationView } from './components/WorkstationView';

export default function App() {
  // Default to Workstation so user immediately sees the UX from the screenshots
  const [viewMode, setViewMode] = useState<'landing' | 'workstation'>('workstation');
  const [objects, setObjects] = useState<StandardizedObject[]>(INITIAL_OBJECTS);
  const [activeSection, setActiveSection] = useState<WorkstationSection>('requests');
  const [selectedObjectId, setSelectedObjectId] = useState<string>('OBJ-15K-01');
  const [openIntakeDirectly, setOpenIntakeDirectly] = useState<boolean>(false);
  const [forcedRequestId, setForcedRequestId] = useState<string | null>('REQ-2026-017');
  const [forcedViewingAnalysis, setForcedViewingAnalysis] = useState<boolean | null>(false);
  const [forcedInitiativeId, setForcedInitiativeId] = useState<string | null>('INIT-BAU-01');

  const handleOpenWorkstation = (
    initialSection: WorkstationSection = 'requests',
    selectObjectId?: string,
    openIntake: boolean = false
  ) => {
    setActiveSection(initialSection);
    if (selectObjectId) {
      setSelectedObjectId(selectObjectId);
    }
    setOpenIntakeDirectly(openIntake);
    setViewMode('workstation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateObjectState = (
    id: string,
    newState: ObjectState,
    newSection?: StandardizedObject['section']
  ) => {
    setObjects((prev) =>
      prev.map((obj) => {
        if (obj.id !== id) return obj;
        return {
          ...obj,
          currentState: newState,
          section: newSection || obj.section,
          lastReviewed: '2026-10-03'
        };
      })
    );
  };

  const handleAddObject = (newObj: StandardizedObject) => {
    setObjects((prev) => [newObj, ...prev]);
  };

  // 1-Click quick jump to the exact screens shown in the user's reference screenshots
  const jumpToScreen = (screenNumber: 0 | 1 | 2 | 3 | 4 | 5) => {
    setViewMode('workstation');
    setOpenIntakeDirectly(false);

    if (screenNumber === 0) {
      // Screen 0: Live-Split Fließband (Hoffmann Bau GmbH - K-2026-017)
      setActiveSection('requests');
      setForcedRequestId('REQ-2026-017');
      setForcedViewingAnalysis(false);
    } else if (screenNumber === 1) {
      // Screen 1: Anfrage-Analyse & SaaS-Komposition (REQ-2026-017 / REQ-2024-012)
      setActiveSection('requests');
      setForcedRequestId('REQ-2026-017');
      setForcedViewingAnalysis(true);
    } else if (screenNumber === 2) {
      // Screen 2: Kundenproblem erfassen modal
      setActiveSection('requests');
      setOpenIntakeDirectly(true);
    } else if (screenNumber === 3) {
      // Screen 3: Portfolio / Reopen Trigger Radar
      setActiveSection('portfolio');
    } else if (screenNumber === 4) {
      // Screen 4: Aktive Initiative Build Workspace
      setActiveSection('active');
      setForcedInitiativeId('INIT-BAU-01');
    } else if (screenNumber === 5) {
      // Screen 5: Control Plane Übersicht
      setActiveSection('overview');
      setForcedViewingAnalysis(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F1F5F9] flex flex-col">
      {/* GLOBAL SCREEN & LIVE-FLOW BAR (Instant 1-Click Access to all 5 reference screens) */}
      <header className="h-10 shrink-0 border-b border-slate-800/90 bg-[#070A0F] px-4 flex items-center justify-between gap-3 text-xs font-mono select-none z-50">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-emerald-400 font-bold hidden sm:inline whitespace-nowrap">
            FOUNDRY FLOW:
          </span>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <button
              type="button"
              onClick={() => jumpToScreen(0)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] ${
                viewMode === 'workstation' && activeSection === 'requests' && !forcedViewingAnalysis
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 font-bold shadow-sm shadow-emerald-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800/70'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>⚡ Live-Split Fließband (Hoffmann Bau)</span>
            </button>

            <button
              type="button"
              onClick={() => jumpToScreen(1)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 text-[11px] ${
                viewMode === 'workstation' && activeSection === 'requests' && forcedViewingAnalysis
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 font-bold shadow-sm shadow-cyan-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800/70'
              }`}
            >
              <span>Detail-Analyse &amp; Manifest</span>
            </button>

            <button
              type="button"
              onClick={() => jumpToScreen(2)}
              className="px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 text-[11px] text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800/70"
            >
              <span>+ Problem erfassen</span>
            </button>

            <button
              type="button"
              onClick={() => jumpToScreen(3)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 text-[11px] ${
                viewMode === 'workstation' && activeSection === 'portfolio'
                  ? 'bg-purple-500/25 text-purple-300 border border-purple-500/50 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800/70'
              }`}
            >
              <span>Portfolio Radar</span>
            </button>

            <button
              type="button"
              onClick={() => jumpToScreen(4)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 text-[11px] ${
                viewMode === 'workstation' && activeSection === 'active'
                  ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/50 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800/70'
              }`}
            >
              <span>Aktive Initiative</span>
            </button>

            <button
              type="button"
              onClick={() => jumpToScreen(5)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 text-[11px] ${
                viewMode === 'workstation' && activeSection === 'overview'
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800/70'
              }`}
            >
              <span>5. Control Plane</span>
            </button>
          </div>
        </div>

        {/* View Mode Toggle: Workstation vs Landing */}
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => setViewMode('workstation')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              viewMode === 'workstation'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Workstation
          </button>
          <button
            type="button"
            onClick={() => setViewMode('landing')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              viewMode === 'landing'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌐 Landing
          </button>
        </div>
      </header>

      {/* BODY VIEW */}
      <div className="flex-1 min-h-0">
        {viewMode === 'landing' ? (
          <LandingPage
            objects={objects}
            onOpenWorkstation={handleOpenWorkstation}
          />
        ) : (
          <WorkstationView
            objects={objects}
            activeSection={activeSection}
            onSectionChange={(sec) => {
              setActiveSection(sec);
              if (sec !== 'requests') setForcedViewingAnalysis(null);
            }}
            selectedObjectId={selectedObjectId}
            onSelectObject={setSelectedObjectId}
            onUpdateObjectState={handleUpdateObjectState}
            onAddObject={handleAddObject}
            onBackToLanding={() => {
              setViewMode('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            initialOpenIntake={openIntakeDirectly}
            forcedRequestId={forcedRequestId}
            forcedViewingAnalysis={forcedViewingAnalysis}
            forcedInitiativeId={forcedInitiativeId}
          />
        )}
      </div>
    </div>
  );
}
