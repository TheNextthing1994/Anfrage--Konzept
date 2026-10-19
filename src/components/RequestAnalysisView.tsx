import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database,
  Layers,
  Sparkles,
  DollarSign,
  Briefcase,
  ChevronRight,
  FileCode2,
  Info,
  MoreHorizontal,
  Edit2
} from 'lucide-react';
import {
  ClientRequest,
  RequestAnalysis
} from '../data/workstationData';

interface RequestAnalysisViewProps {
  request: ClientRequest;
  onApproveAndBuild: (req: ClientRequest) => void;
  onClarify: (req: ClientRequest) => void;
  onPark: (req: ClientRequest) => void;
  onBackToList: () => void;
}

export const RequestAnalysisView: React.FC<RequestAnalysisViewProps> = ({
  request,
  onApproveAndBuild,
  onClarify,
  onPark,
  onBackToList
}) => {
  const analysis = request.analysis;

  if (!analysis) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Keine Analyse vorhanden für Anfrage {request.id}.
      </div>
    );
  }

  // Defensive array normalizers: ensures no crashing if localStorage or upstream has string or undefined
  const manualProcessList: string[] = Array.isArray(analysis.manualProcessSummary)
    ? analysis.manualProcessSummary
    : typeof (analysis.manualProcessSummary as unknown) === 'string' && (analysis.manualProcessSummary as unknown)
    ? String(analysis.manualProcessSummary).split('\n').map((s) => s.trim()).filter(Boolean)
    : ['Manuelle Datensichtung und Übertragung in Tabellen'];

  const successMetricsList: string[] = Array.isArray(analysis.successMetrics)
    ? analysis.successMetrics
    : typeof (analysis.successMetrics as unknown) === 'string' && (analysis.successMetrics as unknown)
    ? String(analysis.successMetrics).split('\n').map((s) => s.trim()).filter(Boolean)
    : ['Erfolgskriterien definiert'];

  const matchedCapabilitiesList = Array.isArray(analysis.matchedCapabilities)
    ? analysis.matchedCapabilities
    : [];

  const missingCapabilitiesList = Array.isArray(analysis.missingCapabilities)
    ? analysis.missingCapabilities
    : [];

  const recommendedStackList = Array.isArray(analysis.recommendedStack)
    ? analysis.recommendedStack
    : [];

  const reuseScore = analysis.estimatedBuildReusePercent || 87;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <button
            type="button"
            onClick={onBackToList}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Requests
          </button>
          <span>›</span>
          <span className="text-slate-300">{request.id}</span>
          <span>›</span>
          <span className="text-emerald-400 font-semibold">Analyse</span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{request.state || 'In Analyse'}</span>
          </span>
          <span className="text-xs font-mono text-slate-400">{request.id}</span>
          <button
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">📄</span>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Anfrage-Analyse &amp; SaaS-Komposition
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Aus der Kundenanfrage wird ein konkretes Produkt — maximaler Reuse, minimale Entwicklung.
        </p>
      </div>

      {/* Header Info Tiles (Kunde, Eingang, Ziel, Status) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-800 bg-[#111723] flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm">
            👤
          </span>
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-slate-400 block truncate">Kunde</span>
            <span className="text-xs font-semibold text-white truncate block">
              {request.company || request.customerName}
            </span>
            <span className="text-[10px] text-slate-500 truncate block">
              {request.industry || 'Projektmanagement'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-[#111723] flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm">
            📅
          </span>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block">Anfrage eingegangen</span>
            <span className="text-xs font-semibold text-white block">{request.createdAt}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-[#111723] flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm">
            ⏱️
          </span>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block">Ziel-Livegang</span>
            <span className="text-xs font-semibold text-white block">
              {request.targetLiveWeeks || '4–6 Wochen'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-[#111723] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm">
              📈
            </span>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">Status</span>
              <span className="text-xs font-semibold text-emerald-400 block">Analyse läuft</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onBackToList}
            className="text-[11px] font-mono text-slate-300 hover:text-white px-2 py-1 rounded bg-[#0B0F17] border border-slate-800 whitespace-nowrap cursor-pointer"
          >
            Anfrage öffnen →
          </button>
        </div>
      </div>

      {/* MAIN 3-COLUMN CONTENT GRID (Matching Screenshot 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SECTION 1: Was der Kunde wirklich braucht (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-[#111723] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
                1
              </span>
              <h2 className="text-sm font-bold text-white">Was der Kunde wirklich braucht ✨</h2>
            </div>
            <button
              type="button"
              className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Editieren</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Extrahiert aus der Anfrage und dem Gespräch. Fokus auf das Wesentliche.
          </p>

          {/* Kernproblem */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
              <span>❗</span>
              <span>Kernproblem</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-[#0B0F17] p-2.5 rounded border border-slate-800/80">
              {analysis.problemSummary}
            </p>
          </div>

          {/* Ziel */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span>🎯</span>
              <span>Ziel</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-[#0B0F17] p-2.5 rounded border border-slate-800/80">
              {analysis.desiredOutcome}
            </p>
          </div>

          {/* Aktuelle manuelle Arbeit */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <span>⏱️</span>
              <span>Aktuelle manuelle Arbeit</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-300 bg-[#0B0F17] p-2.5 rounded border border-slate-800/80">
              {manualProcessList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                  <span className="text-slate-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Erfolgskriterien */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
              <span>🏆</span>
              <span>Erfolgskriterien</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-300 bg-[#0B0F17] p-2.5 rounded border border-slate-800/80">
              {successMetricsList.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                  <span className="text-emerald-400">›</span>
                  <span>{crit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SECTION 2 & 3: Bereits vorhanden + Fehlt noch (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 2: Bereits vorhanden */}
          <div className="rounded-xl border border-slate-800 bg-[#111723] p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <h2 className="text-sm font-bold text-white">Bereits vorhanden</h2>
              </div>
              <button className="text-slate-500 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Passende Capabilities aus der Foundry. Hoher Reuse-Grad.
            </p>

            <div className="rounded-lg border border-slate-800 bg-[#0B0F17] overflow-hidden text-xs">
              <div className="grid grid-cols-12 px-3 py-2 border-b border-slate-800 font-mono text-[10px] text-slate-400">
                <div className="col-span-4">Capability</div>
                <div className="col-span-4">Beschreibung</div>
                <div className="col-span-2">Match</div>
                <div className="col-span-2 text-right">Status</div>
              </div>
              <div className="divide-y divide-slate-800/80">
                {matchedCapabilitiesList.map((cap) => (
                  <div key={cap.capabilityId} className="grid grid-cols-12 px-3 py-2.5 items-center">
                    <div className="col-span-4 font-semibold text-white flex items-center gap-1.5 truncate">
                      <span>📦</span>
                      <span className="truncate">{cap.name}</span>
                    </div>
                    <div className="col-span-4 text-slate-400 text-[10px] truncate pr-1">
                      {cap.description}
                    </div>
                    <div className="col-span-2 font-mono font-bold text-emerald-400 text-[11px]">
                      {cap.matchScorePercent}%
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {cap.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Fehlt noch */}
          <div className="rounded-xl border border-slate-800 bg-[#111723] p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <h2 className="text-sm font-bold text-white">Fehlt noch</h2>
              </div>
              <button className="text-slate-500 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Diese Bausteine müssen neu entwickelt oder integriert werden.
            </p>

            <div className="rounded-lg border border-slate-800 bg-[#0B0F17] overflow-hidden text-xs">
              <div className="grid grid-cols-12 px-3 py-2 border-b border-slate-800 font-mono text-[10px] text-slate-400">
                <div className="col-span-4">Feature</div>
                <div className="col-span-4">Beschreibung</div>
                <div className="col-span-2 text-center">Aufwand</div>
                <div className="col-span-2 text-right">Status</div>
              </div>
              <div className="divide-y divide-slate-800/80">
                {missingCapabilitiesList.map((miss, idx) => (
                  <div key={idx} className="grid grid-cols-12 px-3 py-2.5 items-center">
                    <div className="col-span-4 font-semibold text-white flex items-center gap-1.5 truncate">
                      <span>{idx === 0 ? '💬' : '🧠'}</span>
                      <span className="truncate">{miss.name}</span>
                    </div>
                    <div className="col-span-4 text-slate-400 text-[10px] truncate pr-1">
                      {miss.description}
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {miss.effortBadge}
                      </span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-slate-800 border border-slate-700">
                        {miss.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4 & 5: Reuse Score + Empfohlene SaaS-Komposition (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 4: Reuse Score */}
          <div className="rounded-xl border border-slate-800 bg-[#111723] p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
                  4
                </span>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Reuse Score</span>
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                </h2>
              </div>
              <button className="text-slate-500 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-5">
              {/* Large Radial Dial */}
              <div className="w-24 h-24 rounded-full border-4 border-emerald-400 bg-emerald-950/30 flex flex-col items-center justify-center text-center shrink-0 shadow-lg shadow-emerald-950/50">
                <span className="font-display text-2xl font-bold text-white tabular-nums leading-none">
                  {reuseScore}%
                </span>
                <span className="text-[10px] font-mono text-slate-300 mt-1">bereits</span>
                <span className="text-[10px] font-mono text-slate-400">vorhanden</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="font-bold text-white text-xs">Hoher Reuse-Grad</div>
                <p className="text-slate-400 leading-snug">
                  Dieses Produkt kann zu {reuseScore} % aus bestehenden Foundry Capabilities zusammengesetzt werden.
                </p>
                <div className="space-y-1 text-slate-300 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>Bewährte und produktionsreife Bausteine</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>Reduzierte Entwicklungszeit</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>Geringeres technisches Risiko</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>Schnellerer Time-to-Market</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Empfohlene SaaS-Komposition */}
          <div className="rounded-xl border border-slate-800 bg-[#111723] p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
                  5
                </span>
                <h2 className="text-sm font-bold text-white">Empfohlene SaaS-Komposition</h2>
              </div>
              <button className="text-slate-500 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Diese Architektur wird für das Produkt vorgeschlagen.
            </p>

            <div className="rounded-lg border border-slate-800 bg-[#0B0F17] overflow-hidden text-xs">
              <div className="grid grid-cols-12 px-3 py-2 border-b border-slate-800 font-mono text-[10px] text-slate-400">
                <div className="col-span-3">Layer / Baustein</div>
                <div className="col-span-4">Auswahl</div>
                <div className="col-span-5">Begründung</div>
              </div>
              <div className="divide-y divide-slate-800/80 text-[11px]">
                {recommendedStackList.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 px-3 py-2 items-center">
                    <div className="col-span-3 font-semibold text-slate-300 flex items-center gap-1 truncate">
                      <span>💻</span>
                      <span className="truncate">{item.layer}</span>
                    </div>
                    <div className="col-span-4 text-emerald-400 font-mono font-medium truncate pr-1">
                      {item.selectedOption}
                    </div>
                    <div className="col-span-5 text-slate-400 text-[10px] leading-tight">
                      {item.rationale}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Kosten & Wirtschaftlichkeit (Matching Screenshot 1 Bottom Banner) */}
      <div className="rounded-xl border border-slate-800 bg-[#111723] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
            💰
          </span>
          <h2 className="text-sm font-bold text-white">Kosten &amp; Wirtschaftlichkeit</h2>
          <span className="text-[11px] text-slate-400">
            Transparente Kalkulation auf Basis realistischer Nutzung. Alle Werte sind Schätzungen.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg bg-[#0B0F17] border border-slate-800 flex items-center gap-3">
            <span className="text-xl">☁️</span>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">Infrastrukturkosten (pro Monat)</span>
              <span className="text-lg font-mono font-bold text-white tabular-nums mt-0.5 block">
                ~ {analysis.infrastructureCostMonthly} €
              </span>
              <span className="text-[10px] text-slate-500">VPS, Domain, Backups, Monitoring</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B0F17] border border-slate-800 flex items-center gap-3">
            <span className="text-xl">⚙️</span>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">Geschätzte Gesamtkosten (pro Monat)</span>
              <span className="text-lg font-mono font-bold text-white tabular-nums mt-0.5 block">
                ~ {analysis.estimatedTotalCostMonthly} €
              </span>
              <span className="text-[10px] text-slate-500">Inkl. Wartung, Support und Reserve</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B0F17] border border-emerald-500/40 flex items-center gap-3">
            <span className="text-xl">🏷️</span>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 block">Kundenpreis (pro Monat)</span>
              <span className="text-lg font-mono font-bold text-emerald-300 tabular-nums mt-0.5 block">
                {analysis.targetCustomerPriceMonthly} €
              </span>
              <span className="text-[10px] text-slate-500">Vorgeschlagener SaaS-Preis (Standard-Paket)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 flex items-center gap-3">
            <span className="text-xl">📊</span>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 block">Deckungsbeitrag (pro Monat)</span>
              <span className="text-lg font-mono font-bold text-emerald-300 tabular-nums mt-0.5 block">
                ~ {analysis.contributionMarginMonthly} €
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">
                ≈ {analysis.marginPercent} % Marge
              </span>
            </div>
          </div>
        </div>

        {/* Annahmen Box */}
        <div className="p-3 rounded bg-[#0B0F17] border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-300">Annahmen:</span>
            <span>Bis zu 10 aktive Projekte · Ca. 500 eingehende Nachrichten/Monat · 10–50 GB Speicherplatz · Skalierung bei Bedarf problemlos möglich</span>
          </div>
        </div>
      </div>

      {/* ACTION BAR: Approve & Build, Fragen klären, Parken */}
      <div className="sticky bottom-4 z-30 p-4 rounded-xl border border-slate-700 bg-[#0D121C]/95 backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToList}
            className="text-xs font-mono text-slate-400 hover:text-white px-3 py-2 cursor-pointer"
          >
            ← Zurück zu Anfragen
          </button>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-mono text-slate-300">
            Empfohlene nächste Aktion: <strong className="text-emerald-400">SaaS-Komposition genehmigen &amp; Build starten</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onPark(request)}
            className="px-3.5 py-2 text-xs font-mono font-medium rounded-lg border border-slate-800 bg-[#111723] text-slate-300 hover:border-slate-600 hover:text-white transition-colors cursor-pointer"
          >
            Als 15K parken
          </button>

          <button
            type="button"
            onClick={() => onClarify(request)}
            className="px-3.5 py-2 text-xs font-mono font-medium rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            Fragen klären
          </button>

          <button
            type="button"
            onClick={() => onApproveAndBuild(request)}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors cursor-pointer shadow-lg shadow-emerald-950"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Approve &amp; Build starten →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
