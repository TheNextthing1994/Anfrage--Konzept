import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  ChevronRight,
  Plus,
  RotateCcw,
  Sparkles,
  Server,
  Share2,
  MoreHorizontal,
  ExternalLink,
  Check
} from 'lucide-react';
import { ActiveInitiative } from '../data/workstationData';

interface BuildWorkspaceProps {
  initiative: ActiveInitiative;
  onExtractCapability: (initiativeId: string, capName: string) => void;
  onUpdateStepStatus: (initiativeId: string, stepIndex: number) => void;
  onBackToInitiatives: () => void;
}

export const BuildWorkspace: React.FC<BuildWorkspaceProps> = ({
  initiative,
  onExtractCapability,
  onUpdateStepStatus,
  onBackToInitiatives
}) => {
  const [extracted, setExtracted] = useState(initiative.foundryGain?.savedAsCandidate || false);

  const pipelineStages = [
    { label: 'REQUEST', sub: 'Eingegangen\n2024-01-06', status: 'COMPLETED' },
    { label: 'ANALYSIS', sub: 'Analysiert\n2024-01-07', status: 'COMPLETED' },
    { label: 'COMPOSITION', sub: 'Lösung erstellt\n2024-01-08', status: 'COMPLETED' },
    { label: 'APPROVAL', sub: 'Genehmigt\n2024-01-08', status: 'COMPLETED' },
    { label: 'BUILDING', sub: 'In Ausführung\nseit 14 Min', status: 'IN_PROGRESS' },
    { label: 'VERIFY', sub: 'Wartet auf Build', status: 'WAITING' },
    { label: 'DEPLOY', sub: 'Wartet auf Tests', status: 'WAITING' }
  ];

  const handleSaveGain = () => {
    if (initiative.foundryGain) {
      onExtractCapability(initiative.id, initiative.foundryGain.capabilityName);
      setExtracted(true);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBackToInitiatives}
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer mb-1"
          >
            <span>← Zurück zur Übersicht</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">
              Aktive Initiative
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Von der genehmigten Lösung zum lauffähigen System. Module wiederverwenden, neue Bausteine erstellen, testen und deployen.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#111723] hover:text-white text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Details teilen</span>
          </button>
          <button
            type="button"
            className="text-slate-400 hover:text-white p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PIPELINE PROGRESS BAR (Matching Screenshot 4 Top) */}
      <div className="rounded-xl border border-slate-800 bg-[#111723] p-5">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {pipelineStages.map((stage, idx) => {
            const isCompleted = stage.status === 'COMPLETED';
            const isInProgress = stage.status === 'IN_PROGRESS';
            return (
              <React.Fragment key={stage.label}>
                <div className="flex flex-col items-center text-center min-w-[100px] shrink-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isCompleted
                        ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/60'
                        : isInProgress
                        ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-400 animate-pulse'
                        : 'bg-slate-900 border border-slate-800 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : isInProgress ? '⚙' : '○'}
                  </div>
                  <span
                    className={`text-xs font-mono font-bold mt-2 ${
                      isCompleted || isInProgress ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="text-[10px] text-slate-400 whitespace-pre-line leading-tight mt-0.5">
                    {stage.sub}
                  </span>
                </div>
                {idx < pipelineStages.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 min-w-[20px] mb-8 ${
                      isCompleted ? 'bg-emerald-400' : 'bg-slate-800'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* INITIATIVE HERO CARD (Matching Screenshot 4) */}
      <div className="rounded-xl border border-slate-800 bg-[#111723] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <span className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 text-2xl flex items-center justify-center shrink-0">
            📄
          </span>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {initiative.name}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40">
                Kundenprojekt
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {initiative.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 pl-0 md:pl-6">
          <div>
            <span className="text-slate-500 text-[10px] block">Kunde</span>
            <span className="text-slate-200 font-semibold">{initiative.customerName || 'Müller Bau GmbH'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Ziel</span>
            <span className="text-slate-200">{initiative.goalSummary || 'WhatsApp automatisieren'}</span>
          </div>

          {/* Reuse Score Dial */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-400 bg-emerald-950/40 flex items-center justify-center font-bold text-white text-xs tabular-nums">
              78%
            </div>
            <div className="text-[10px] leading-tight">
              <span className="text-emerald-400 font-bold block">ReUse Score</span>
              <span className="text-slate-400">6 von 8 Modulen wiederverwendet</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-slate-500 text-[10px] block">Status</span>
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 block">
              Building
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Gestartet: {initiative.updatedAt}</span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SPLIT: Reused Modules & New Work (Left) + Foundry Gain (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: Wiederverwendete Module + Neue Arbeit (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Wiederverwendete Module (6) */}
          <div className="rounded-xl border border-slate-800 bg-[#111723] p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Wiederverwendete Module (6)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Bewährte Bausteine aus der Foundry werden in dieser Lösung eingesetzt.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Array.isArray(initiative.reusedModules) && initiative.reusedModules.length > 0
                ? initiative.reusedModules.map((m: any) =>
                    typeof m === 'string'
                      ? { name: m, description: 'Wiederverwendeter Baustein aus Foundry', status: 'REUSED' as const }
                      : { name: m?.name || 'Modul', description: m?.description || '', status: m?.status || 'REUSED' }
                  )
                : [
                    { name: 'OCR Pipeline', description: 'PDF / Bild zu Text · Dokumentenverarbeitung', status: 'REUSED' as const },
                    { name: 'File Storage', description: 'Sichere Ablage · Metadaten · Versionierung', status: 'REUSED' as const },
                    { name: 'PocketBase', description: 'Backend · Auth · DB · Storage', status: 'REUSED' as const },
                    { name: 'Dashboard Shell', description: 'Standard UI · Projekte · Dokumente', status: 'REUSED' as const },
                    { name: 'Auth Template', description: 'Nutzer-Authentifizierung · Multi-Tenant', status: 'REUSED' as const },
                    { name: 'Notification Layer', description: 'E-Mail · In-App · Webhooks', status: 'REUSED' as const }
                  ]
              ).map((mod, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-800 bg-[#0B0F17] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">📦</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">{mod.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{mod.description}</div>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                    REUSED
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Neue Arbeit (2) */}
          <div className="rounded-xl border border-slate-800 bg-[#111723] p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Neue Arbeit (2)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Diese Module werden neu für den Kunden entwickelt.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Array.isArray(initiative.newWorkRequired) && initiative.newWorkRequired.length > 0
                ? initiative.newWorkRequired.map((w: any) =>
                    typeof w === 'string'
                      ? { name: w, description: 'Neu zu entwickelndes Feature', status: 'NEU' as const }
                      : { name: w?.name || 'Feature', description: w?.description || '', status: w?.status || 'NEU' }
                  )
                : [
                    { name: 'WhatsApp Adapter', description: 'WhatsApp Business API · Dokumenten-Intake', status: 'NEU' as const },
                    { name: 'Projektklassifikation', description: 'KI-gestützte Zuordnung zu Bauprojekten', status: 'NEU' as const }
                  ]
              ).map((work, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-800 bg-[#0B0F17] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">⚙️</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">{work.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{work.description}</div>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                    {work.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Foundry Gain (Screenshot 4 Right Card) (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="rounded-xl border border-emerald-500/40 bg-[#111723] p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">💎</span>
                <div>
                  <h3 className="text-sm font-bold text-white">Foundry Gain</h3>
                  <span className="text-[10px] font-mono text-emerald-400">Potenzielle wiederverwendbare Capability</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Dieses Projekt erstellt mit dem <strong className="text-white">WhatsApp Adapter</strong> einen allgemeinen Baustein, der auch für andere Kunden (z. B. Handwerk, Facility Management) wiederverwendet werden kann.
            </p>

            <div className="p-3 rounded-lg bg-[#0B0F17] border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                <span>💡</span>
                <span>Vorschlag: WhatsApp Document Intake</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Generischer Dokumenten-Intake über WhatsApp mit Datei-Parsing, OCR und Metadaten-Extraktion.
              </p>
              <ul className="space-y-1 text-[10px] font-mono text-slate-400 pt-1">
                <li>• Hohe Wiederverwendbarkeit erwartet</li>
                <li>• Passt in Foundry Capability Map</li>
                <li>• Kann nach Projektabschluss generalisiert werden</li>
              </ul>
            </div>

            <button
              type="button"
              disabled={extracted}
              onClick={handleSaveGain}
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                extracted
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 shadow-md shadow-emerald-950'
              }`}
            >
              <span>{extracted ? '✓ Als Capability-Kandidat gespeichert' : 'Als Capability-Kandidat speichern'}</span>
            </button>
          </div>

          {/* Aktivitäts-Log (Screenshot 4 Bottom Right) */}
          <div className="rounded-xl border border-slate-800 bg-[#111723] p-5 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
              <h3 className="text-xs font-bold text-white font-mono">Aktivitäts-Log</h3>
              <span className="text-[10px] font-mono text-slate-500">Alle anzeigen</span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              {(initiative.activityLogs || [
                { time: '14:26', title: 'Build gestartet', description: 'Build Pipeline initialisiert' },
                { time: '14:28', title: 'Infrastruktur bereit', description: 'PocketBase Instanz erstellt' },
                { time: '14:30', title: 'OCR Pipeline integriert', description: 'Modul aus Registry (v2.1)' },
                { time: '14:33', title: 'WhatsApp Adapter Build läuft', description: '4 von 6 Schritten abgeschlossen' }
              ]).map((log, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5"></span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 text-[11px]">{log.title}</span>
                      <span className="text-[10px] text-slate-500">{log.time}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{log.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BUILD PIPELINE STEPS (Screenshot 4 Bottom Left) */}
      <div className="rounded-xl border border-slate-800 bg-[#111723] p-5 space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-bold text-white">Build Pipeline</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Automatische und manuelle Schritte zur Erstellung der Kundenlösung.
            </p>
          </div>

          <button
            type="button"
            className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <span>Build-Logs öffnen</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {(initiative.buildStepsList || [
            { step: 1, title: 'Infrastruktur provisionieren', description: 'PocketBase Instanz, Storage Bucket, Grundkonfiguration', duration: '2 Min', status: 'VERIFIED' as const },
            { step: 2, title: 'Wiederverwendete Module integrieren', description: 'OCR Pipeline, Auth, Dashboard, Notifications', duration: '3 Min', status: 'VERIFIED' as const },
            { step: 3, title: 'Neue Module erstellen', description: 'WhatsApp Adapter, Projektklassifikation', duration: '~ 8 Min', status: 'BUILDING' as const },
            { step: 4, title: 'Tests ausführen', description: 'Unit Tests, Integrations-Tests, Akzeptanz-Tests', duration: '~ 4 Min', status: 'PENDING' as const },
            { step: 5, title: 'Kundenumgebung deployen', description: 'Konfiguration, Datenmigration, Go-Live', duration: '~ 3 Min', status: 'PENDING' as const }
          ]).map((step, idx) => {
            const isVerified = step.status === 'VERIFIED';
            const isBuilding = step.status === 'BUILDING';
            return (
              <div
                key={idx}
                onClick={() => onUpdateStepStatus(initiative.id, idx)}
                className="p-3.5 rounded-lg border border-slate-800 bg-[#0B0F17] hover:border-slate-700 transition-colors flex items-center justify-between gap-3 text-xs font-mono cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isVerified
                        ? 'bg-emerald-400 text-slate-950'
                        : isBuilding
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400 animate-spin'
                        : 'bg-slate-900 border border-slate-800 text-slate-500'
                    }`}
                  >
                    {isVerified ? '✓' : isBuilding ? '⚙' : step.step}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{step.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{step.description}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {isBuilding && (
                    <div className="w-32 bg-slate-900 rounded-full h-1.5 overflow-hidden hidden sm:block">
                      <div className="bg-cyan-400 h-full w-2/3 animate-pulse"></div>
                    </div>
                  )}
                  <span className="text-[11px] text-slate-400">{step.duration}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isVerified
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : isBuilding
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
