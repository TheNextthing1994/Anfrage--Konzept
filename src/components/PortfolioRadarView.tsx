import React, { useState } from 'react';
import {
  Inbox,
  CheckSquare,
  Database,
  Briefcase,
  Cpu,
  Activity,
  Settings,
  Search,
  Plus,
  ArrowLeft,
  SlidersHorizontal,
  Layers,
  Sparkles,
  MessageSquareQuote,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
  Radio,
  ExternalLink,
  ChevronDown,
  Filter,
  Check,
  AlertTriangle
} from 'lucide-react';
import {
  StandardizedObject,
  TriggerMatchSignal,
  INITIAL_SIGNALS
} from '../data/workstationData';

interface PortfolioRadarViewProps {
  objects: StandardizedObject[];
  selectedObjectId: string;
  onSelectObject: (id: string) => void;
  onTriggerReopen: (objId: string) => void;
}

export const PortfolioRadarView: React.FC<PortfolioRadarViewProps> = ({
  objects,
  selectedObjectId,
  onSelectObject,
  onTriggerReopen
}) => {
  const [activeTab, setActiveTab] = useState<'objekte' | 'radar' | 'aktivitaeten' | 'analytics'>('objekte');
  const [statusFilter, setStatusFilter] = useState<string>('Alle Status');
  const [relevanceFilter, setRelevanceFilter] = useState<string>('Alle Trigger-Relevanz');
  const [search, setSearch] = useState<string>('');

  const portfolioObjects = objects.filter((o) =>
    ['Armed', 'Parked', 'Reopened'].includes(o.currentState)
  );

  const armedCount = portfolioObjects.filter((o) => o.currentState === 'Armed').length;
  const parkedCount = portfolioObjects.filter((o) => o.currentState === 'Parked').length;
  const reopenedCount = portfolioObjects.filter((o) => o.currentState === 'Reopened').length;

  const filtered = portfolioObjects.filter((o) => {
    if (statusFilter !== 'Alle Status' && o.currentState !== statusFilter) return false;
    if (relevanceFilter !== 'Alle Trigger-Relevanz' && o.reopenRelevance !== relevanceFilter) return false;
    if (search.trim() && !o.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedObject = objects.find((o) => o.id === selectedObjectId) || portfolioObjects[0];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner (Matching Screenshot 3) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Portfolio / Reopen Trigger Radar
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Geparkte und reaktivierbare Möglichkeiten — das System beobachtet kontinuierlich Signale und reaktiviert zur richtigen Zeit.
          </p>
        </div>

        {/* Counter Tiles matching Screenshot 3 top right */}
        <div className="flex items-center gap-6 font-mono text-center">
          <div>
            <span className="text-xl font-bold text-white block tabular-nums leading-none">
              {portfolioObjects.length}
            </span>
            <span className="text-[10px] text-slate-500">Objekte gesamt</span>
          </div>
          <div>
            <span className="text-xl font-bold text-slate-300 block tabular-nums leading-none">
              {parkedCount}
            </span>
            <span className="text-[10px] text-slate-500">Geparkt</span>
          </div>
          <div>
            <span className="text-xl font-bold text-amber-400 block tabular-nums leading-none">
              {armedCount}
            </span>
            <span className="text-[10px] text-amber-400">Armed</span>
          </div>
          <div>
            <span className="text-xl font-bold text-cyan-400 block tabular-nums leading-none">
              {reopenedCount}
            </span>
            <span className="text-[10px] text-cyan-400">Reopened</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar: Objekte | Trigger Radar | Aktivitäten | Analytics */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
        {[
          { id: 'objekte', label: 'Objekte' },
          { id: 'radar', label: 'Trigger Radar' },
          { id: 'aktivitaeten', label: 'Aktivitäten' },
          { id: 'analytics', label: 'Analytics' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Row: Status, Trigger-Relevanz, Suche */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#111723] border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs font-mono"
          >
            <option value="Alle Status">Alle Status</option>
            <option value="Armed">Armed</option>
            <option value="Parked">Parked</option>
            <option value="Reopened">Reopened</option>
          </select>

          <select
            value={relevanceFilter}
            onChange={(e) => setRelevanceFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#111723] border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs font-mono"
          >
            <option value="Alle Trigger-Relevanz">Alle Trigger-Relevanz</option>
            <option value="Hoch">Hoch</option>
            <option value="Mittel">Mittel</option>
            <option value="Kritisch">Kritisch</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Objekte durchsuchen..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#111723] border border-slate-800 text-slate-200 text-xs w-48 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Sortierung: <span className="text-slate-200 font-semibold">Relevanz ▾</span>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: Left Objects List + Right Object Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Objects + Trigger Matches heute (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Objects List matching Screenshot 3 */}
          <div className="rounded-xl border border-slate-800 bg-[#111723] divide-y divide-slate-800">
            {filtered.map((item) => {
              const isSelected = selectedObjectId === item.id;
              const isArmed = item.currentState === 'Armed';
              const isReopened = item.currentState === 'Reopened';
              const isParked = item.currentState === 'Parked';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectObject(item.id)}
                  className={`p-4 transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected ? 'bg-emerald-500/10' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-lg bg-[#0B0F17] border border-slate-800 text-base flex items-center justify-center shrink-0 mt-0.5">
                      {item.category === 'Idee' ? '💡' : item.category === 'Tool' ? '⚙️' : '📄'}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-white text-sm truncate flex items-center gap-2">
                        <span>{item.title}</span>
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono text-xs space-y-1">
                    <div>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                          isArmed
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : isReopened
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        ● {item.currentState}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Trigger-Relevanz:{' '}
                      <span
                        className={
                          item.reopenRelevance === 'Kritisch'
                            ? 'text-red-400 font-bold'
                            : item.reopenRelevance === 'Hoch'
                            ? 'text-amber-400 font-bold'
                            : 'text-slate-300'
                        }
                      >
                        {item.reopenRelevance}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Letzte Aktivität: {item.lastReviewed}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trigger Matches heute Banner matching Screenshot 3 Bottom */}
          <div className="rounded-xl border border-slate-800 bg-[#111723] p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">⚡</span>
                <h3 className="text-sm font-bold text-white font-mono">Trigger Matches heute</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  4 neue Signale
                </span>
              </div>
              <button
                type="button"
                className="text-[11px] font-mono text-slate-400 hover:text-white cursor-pointer"
              >
                Alle Signale anzeigen →
              </button>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#0B0F17] overflow-hidden text-xs">
              <div className="grid grid-cols-12 px-3 py-2 border-b border-slate-800 font-mono text-[10px] text-slate-400">
                <div className="col-span-5">Signal / Ereignis</div>
                <div className="col-span-3">Quelle</div>
                <div className="col-span-2">Passende Objekte</div>
                <div className="col-span-2 text-right">Relevanz / Zeit</div>
              </div>
              <div className="divide-y divide-slate-800/80">
                {INITIAL_SIGNALS.map((sig) => (
                  <div key={sig.id} className="grid grid-cols-12 px-3 py-2.5 items-center">
                    <div className="col-span-5 font-semibold text-slate-200 flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                      <span className="truncate">{sig.signalName}</span>
                    </div>
                    <div className="col-span-3 text-slate-400 font-mono text-[11px] truncate">
                      {sig.source}
                    </div>
                    <div className="col-span-2 flex items-center gap-1">
                      {sig.matchingObjectIds.map((id) => (
                        <span key={id} className="text-xs">
                          {id === 'OBJ-15K-02' ? '📞' : '📦'}
                        </span>
                      ))}
                    </div>
                    <div className="col-span-2 text-right font-mono text-[11px]">
                      <span
                        className={
                          sig.relevance === 'Kritisch'
                            ? 'text-red-400 font-bold'
                            : sig.relevance === 'Hoch'
                            ? 'text-amber-400 font-bold'
                            : 'text-slate-300'
                        }
                      >
                        {sig.relevance}
                      </span>
                      <span className="text-slate-500 text-[10px] block">{sig.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Dedicated Object Inspector matching Screenshot 3 Right */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#111723] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">OBJECT INSPECTOR</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">{selectedObject.id}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {selectedObject.currentState}
              </span>
              <span className="text-slate-400 text-[10px]">15K Opportunity</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                📞
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  {selectedObject.title}
                </h3>
                <p className="text-xs text-slate-400">{selectedObject.subtitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {selectedObject.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0B0F17] border border-slate-800 text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics Bar matching Screenshot 3 */}
          <div className="grid grid-cols-4 gap-2 p-2.5 rounded-lg bg-[#0B0F17] border border-slate-800 text-center font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">Status</span>
              <span className="text-amber-400 font-bold text-[11px] block mt-0.5">
                ● {selectedObject.currentState}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Trigger-Relevanz</span>
              <span className="text-amber-400 font-bold text-[11px] block mt-0.5">
                {selectedObject.reopenRelevance}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Letzte Aktivität</span>
              <span className="text-slate-300 text-[11px] block mt-0.5">
                {selectedObject.lastReviewed}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Nächste Prüfung</span>
              <span className="text-slate-300 text-[11px] block mt-0.5">in 3 Tagen</span>
            </div>
          </div>

          {/* Reopen Flow Chain */}
          <div className="p-3 rounded-lg bg-[#0B0F17] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Reopen Flow</span>
              <span className="text-emerald-400">Wie es funktioniert?</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-center">
              <div className="flex flex-col items-center">
                <span className="text-amber-400">💡</span>
                <span className="text-[9px] text-slate-400 mt-1">INPUT</span>
              </div>
              <span className="text-slate-600">→</span>
              <div className="flex flex-col items-center">
                <span className="text-slate-400">⏸️</span>
                <span className="text-[9px] text-slate-400 mt-1">PARKED</span>
              </div>
              <span className="text-slate-600">→</span>
              <div className="flex flex-col items-center">
                <span className="text-amber-400">🎯</span>
                <span className="text-[9px] text-amber-400 mt-1 font-bold">ARMED</span>
              </div>
              <span className="text-slate-600">→</span>
              <div className="flex flex-col items-center">
                <span className="text-emerald-400">⚡</span>
                <span className="text-[9px] text-slate-400 mt-1">TRIGGER</span>
              </div>
              <span className="text-slate-600">→</span>
              <div className="flex flex-col items-center">
                <span className="text-cyan-400">▶</span>
                <span className="text-[9px] text-slate-400 mt-1">REOPENED</span>
              </div>
              <span className="text-slate-600">→</span>
              <div className="flex flex-col items-center">
                <span className="text-white">🏁</span>
                <span className="text-[9px] text-slate-400 mt-1">ACTION</span>
              </div>
            </div>
          </div>

          {/* Details Accordion matching Screenshot 3 bottom right */}
          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center gap-4 text-xs border-b border-slate-800 pb-2">
              <span className="text-emerald-400 font-bold border-b-2 border-emerald-400 pb-1">Details</span>
              <span className="text-slate-400">Trigger &amp; Signale 3</span>
              <span className="text-slate-400">Aktivitäten 8</span>
              <span className="text-slate-400">Notizen</span>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-purple-400 font-bold">WHY_NOT_NOW ℹ️</span>
                  <span className="text-slate-500 text-[10px]">Bearbeiten</span>
                </div>
                <p className="text-slate-300 font-sans text-xs leading-relaxed bg-[#0B0F17] p-2.5 rounded border border-slate-800/80">
                  {selectedObject.whyNotNow}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-amber-400 font-bold">REOPEN_TRIGGERS</span>
                  <span className="text-slate-500 text-[10px]">Bearbeiten</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300 bg-[#0B0F17] p-2.5 rounded border border-slate-800/80">
                  {selectedObject.reopenTriggers.map((trig, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5"></span>
                      <span>{trig}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-emerald-400 font-bold">REOPEN_ACTION</span>
                  <span className="text-slate-500 text-[10px]">Bearbeiten</span>
                </div>
                <p className="text-slate-300 font-sans text-xs leading-relaxed bg-[#0B0F17] p-2.5 rounded border border-slate-800/80">
                  {selectedObject.reopenAction}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-cyan-400 font-bold">DEPENDENCIES</span>
                  <span className="text-slate-500 text-[10px]">Bearbeiten</span>
                </div>
                <p className="text-slate-300 font-sans text-xs leading-relaxed bg-[#0B0F17] p-2.5 rounded border border-slate-800/80">
                  {selectedObject.dependencies.join(', ')}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-blue-400 font-bold">EVIDENCE</span>
                  <span className="text-slate-500 text-[10px]">Bearbeiten</span>
                </div>
                <p className="text-slate-300 font-sans text-xs leading-relaxed bg-[#0B0F17] p-2.5 rounded border border-slate-800/80">
                  {selectedObject.evidence}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
