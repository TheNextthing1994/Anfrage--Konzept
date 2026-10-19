import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  UserCheck,
  Cpu,
  Layers,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  MessageSquare,
  X,
  Send,
  Building2,
  FolderGit2,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  Eye,
  ShieldCheck,
  TrendingUp,
  Activity,
  Code2
} from 'lucide-react';
import {
  ClientRequest,
  ActiveInitiative,
  StandardizedObject
} from '../data/workstationData';

interface LiveFoundryIntakeSplitViewProps {
  requests: ClientRequest[];
  selectedRequestId: string;
  onSelectRequestId: (id: string) => void;
  onApproveAndBuild: (req: ClientRequest) => void;
  onClarify: (req: ClientRequest) => void;
  onRejectOrPark: (req: ClientRequest) => void;
  onOpenDetailedAnalysis: (req: ClientRequest) => void;
  onOpenProcessMap?: (req: ClientRequest) => void;
}

export const LiveFoundryIntakeSplitView: React.FC<LiveFoundryIntakeSplitViewProps> = ({
  requests,
  selectedRequestId,
  onSelectRequestId,
  onApproveAndBuild,
  onClarify,
  onRejectOrPark,
  onOpenDetailedAnalysis,
  onOpenProcessMap
}) => {
  // Current active request
  const currentIndex = Math.max(
    0,
    requests.findIndex((r) => r.id === selectedRequestId)
  );
  const currentRequest = requests[currentIndex] || requests[0];

  // Selected pattern inside composition
  const [selectedPatternId, setSelectedPatternId] = useState<string>('PAT-01');

  // Preview interactive tab (inside the micro-app preview)
  const [previewTab, setPreviewTab] = useState<'dashboard' | 'projects' | 'uncertain' | 'documents' | 'messages'>('dashboard');
  const [selectedPreviewProject, setSelectedPreviewProject] = useState<string>('Neubau Müller');
  const [assignedUncertain, setAssignedUncertain] = useState<boolean>(false);
  const [showReverseTraceability, setShowReverseTraceability] = useState<boolean>(true);

  // Prompt generator modal
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Clarification modal
  const [showClarifyModal, setShowClarifyModal] = useState<boolean>(false);
  const [clarifyMessage, setClarifyMessage] = useState<string>('');

  // Conveyor belt stage simulation
  const [conveyorStep, setConveyorStep] = useState<number>(1); // 1 = Intake, 2 = Match, 3 = Preview, 4 = Acceptance, 5 = Build Queue

  // Update selected pattern when request changes
  useEffect(() => {
    if (currentRequest.matchingPatterns && currentRequest.matchingPatterns.length > 0) {
      setSelectedPatternId(currentRequest.matchingPatterns[0].id);
    }
    setConveyorStep(1);
    setPreviewTab('dashboard');
  }, [selectedRequestId]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectRequestId(requests[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < requests.length - 1) {
      onSelectRequestId(requests[currentIndex + 1].id);
    }
  };

  // Delta metrics fallback
  const deltaMetrics = currentRequest.deltaMetrics || {
    reuseScore: 82,
    deltaSize: 18,
    deltaCriticality: 'Niedrig' as const,
    humanTouch: 'Mittel' as const,
    humanTouchMinutes: 18,
    reuseScoreText: 'Hohe Wiederverwendung vorhandener Komponenten.',
    deltaSizeText: 'Kleine Anpassungen erforderlich.',
    deltaCriticalityText: 'Keine kritischen Änderungen.',
    humanTouchText: 'Individuelle Anpassungen für Branche & Prozesse.'
  };

  // Solution patterns
  const patterns = currentRequest.matchingPatterns || [
    {
      id: 'PAT-01',
      title: 'Kundenportal Pro',
      score: 91,
      description: 'Bewährtes Portal für Kundenkommunikation und Dokumentenmanagement.',
      isRecommended: true
    },
    {
      id: 'PAT-02',
      title: 'Projektmanagement',
      score: 78,
      description: 'Projektstatus, Aufgaben und Meilensteine.',
      isRecommended: false
    },
    {
      id: 'PAT-03',
      title: 'Dokumentenhub',
      score: 76,
      description: 'Sichere Dateiverwaltung für Versionierung.',
      isRecommended: false
    }
  ];

  // Components list
  const reusedComponents = currentRequest.assembledComponents?.reused || [
    { id: 'C-01', name: 'Authentifizierung & Rollen', tag: 'Core' as const },
    { id: 'C-02', name: 'Projekt-Dashboard', tag: 'Core' as const },
    { id: 'C-03', name: 'Dokumentenverwaltung', tag: 'Core' as const },
    { id: 'C-04', name: 'Benachrichtigungen', tag: 'Core' as const },
    { id: 'C-05', name: 'Responsive UI-Layout', tag: 'Core' as const }
  ];

  const missingComponents = currentRequest.assembledComponents?.missing || [
    { id: 'M-01', name: 'Bauprojekt-spezifische Ansicht', tag: 'Neu' as const, description: 'Gewerke, Bauabschnitte & Baustellen-Kamera Stream' },
    { id: 'M-02', name: 'Kunden-Kommunikationsmodul', tag: 'Neu' as const, description: 'Direktkanal zwischen Bauherr und Bauleiter' }
  ];

  // Preview config
  const uiPreview = currentRequest.uiPreview || {
    appName: currentRequest.company || currentRequest.customerName,
    logoText: (currentRequest.company || currentRequest.customerName).slice(0, 2).toUpperCase(),
    industry: currentRequest.industry || 'Mittelstand',
    activeProjectsCount: 12,
    documentsCount: 248,
    openTasksCount: 7,
    projects: [
      { name: 'Neubau Müller', status: 'In Bau' as const, progress: 76, lastActivity: 'vor 2 Tagen' },
      { name: 'Sanierung Schulstr.', status: 'Planung' as const, progress: 30, lastActivity: 'vor 5 Stunden' },
      { name: 'Wohnanlage West', status: 'Prüfung' as const, progress: 60, lastActivity: 'vor 1 Tag' }
    ]
  };

  // AI Studio Master Prompt Generator
  const generateAiStudioPrompt = () => {
    return `# AI STUDIO MASTER PROMPT: ${currentRequest.company || currentRequest.customerName} - MVP & UX PROTOTYPE

Du bist ein führender Senior Frontend-Architekt und entwickelst ein sofort klickbares, produktionsreifes Frontend für **${currentRequest.company || currentRequest.customerName}**.

## KUNDENPROFIL & ZIEL
- **Kunde**: ${currentRequest.company || currentRequest.customerName} (${currentRequest.industry || 'Mittelstand'})
- **Ziel**: ${currentRequest.desiredOutcome || currentRequest.rawRequest}
- **Problem des Kunden**: ${currentRequest.problemStatement || currentRequest.currentProcess || 'Manuelle Dateiverwaltung und unübersichtliche Kommunikation'}
- **Ziele**:
${(currentRequest.goals || ['Transparenter Projektstatus', 'Sichere Dateiablage', 'Kundenkommunikation']).map(g => `  - ${g}`).join('\n')}

## FOUNDRY DELTA & KOMPONENTEN-ARCHITEKTUR
- **Reuse Score**: ${deltaMetrics.reuseScore}% (Basis: Standard-Dashboard, Auth-Guard, File-Storage, Role-Switcher)
- **Delta Size**: ${deltaMetrics.deltaSize}% (Branchenspezifische Bausteine)
- **Bereits vorhandene Core-Module**:
${reusedComponents.map(c => `  - ${c.name} (Preset: ${c.tag})`).join('\n')}
- **Neu zu erstellende Module (Delta)**:
${missingComponents.map(m => `  - ${m.name} (${m.description || 'Spezifisches Modul'})`).join('\n')}

## ERFORDERLICHE INTERAKTIVE SCREENS & KLICKPFADE
1. **Dashboard-Übersicht**:
   - Schnell-Kennzahlen: ${uiPreview.activeProjectsCount} Aktive Projekte, ${uiPreview.documentsCount} Dokumente, ${uiPreview.openTasksCount} Offene Aufgaben.
   - Projekt-Tabelle mit Status-Badges (z.B. "In Bau", "Planung", "Prüfung"), Fortschrittsbalken und letzter Aktivität.
2. **Projekt-Detailansicht**:
   - Klick auf ein Projekt (z.B. "${uiPreview.projects[0]?.name || 'Hauptprojekt'}") öffnet Gewerke-Übersicht, Bauphasen und Zeitplan.
3. **Dokumenten-Hub**:
   - Kategorisierte Dateiablage (Baupläne, Rechnungen, Abnahmen, Baugenehmigungen) mit Suchleiste, Vorschau und Upload-Button.
4. **Kunden-Kommunikation**:
   - Integrierter Nachrichtenkanal zwischen Bauleiter und Kunde mit Status-Meldungen und Lesebestätigung.

## TECH-STACK & DESIGN-SYSTEM
- **Framework**: React 19 + TypeScript + Tailwind CSS
- **Design-Aesthetic**: Foundry OS Dark Mode (Hintergrund: #0B0F17 / #0D121C, Akzente: Emerald #10B981, Cyan #06B6D4, Slate-Rahmen #1E293B)
- **Barrierefreiheit & UX**: Keine unfertigen Platzhalter, vollständige Dummy-Daten für ${currentRequest.company || currentRequest.customerName}, responsive Layout.

Erstelle jetzt die vollständige, sofort funktionierende Single-Page-Applikation.`;
  };

  const handleCopyPrompt = () => {
    const text = generateAiStudioPrompt();
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleAcceptClick = () => {
    setConveyorStep(4);
    setTimeout(() => {
      setConveyorStep(5);
      onApproveAndBuild(currentRequest);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* MAIN TWO-COLUMN SPLIT VIEW (Matching Screenshot) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* ------------------------------------------------------------ */}
        {/* LEFT COLUMN: 1. Kundenanfrage annehmen (5 Cols) */}
        {/* ------------------------------------------------------------ */}
        <div className="xl:col-span-5 bg-[#0D121C] border border-slate-800/90 rounded-xl p-5 space-y-5 shadow-xl shadow-black/40">
          {/* Card Header with Step 1 and Pagination */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono shadow-sm shadow-emerald-950">
                1
              </span>
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight">
                  Kundenanfrage annehmen
                </h2>
                <p className="text-xs text-slate-400">
                  Neue Anfrage prüfen, analysieren und entscheiden.
                </p>
              </div>
            </div>

            {/* Pagination < 1 von 3 > */}
            <div className="flex items-center gap-1.5 bg-[#0B0F17] px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors p-0.5 cursor-pointer"
                title="Vorherige Anfrage"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-slate-300 font-medium px-1">
                {currentIndex + 1} von {requests.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === requests.length - 1}
                className="text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors p-0.5 cursor-pointer"
                title="Nächste Anfrage"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Company Badge Card */}
          <div className="bg-[#0B0F17] border border-slate-800/90 rounded-lg p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold text-slate-200 text-sm font-mono shrink-0 shadow-inner">
                {currentRequest.company
                  ? currentRequest.company.slice(0, 2).toUpperCase()
                  : 'HB'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {currentRequest.company || currentRequest.customerName}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400">
                  {currentRequest.industry || 'Mittelstand • Bau & Sanierung'}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5">
                {currentRequest.isNewCustomer !== false && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Neuer Kunde
                  </span>
                )}
                <span className="text-[11px] font-mono text-slate-400">
                  Kundennr. {currentRequest.customerNumber || currentRequest.id}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span>{currentRequest.companySize || '25–100 MA'}</span>
                <span>•</span>
                <span>{currentRequest.location || 'München, DE'}</span>
              </div>
            </div>
          </div>

          {/* Sub-Panels: Anfragedetails & Zusammenfassung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Box 1: Anfragedetails */}
            <div className="bg-[#0B0F17] border border-slate-800/80 rounded-lg p-3 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 pb-1 border-b border-slate-800/60">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Anfragedetails</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Quelle</span>
                  <span className="text-slate-200 font-medium">
                    {currentRequest.sourceChannel || 'Website / Kontaktformular'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Eingegangen</span>
                  <span className="text-slate-200 font-mono">
                    {currentRequest.createdAt || '02. Okt. 2026, 09:14 Uhr'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Dringlichkeit</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                    <span>▲</span> {currentRequest.urgency || 'Hoch'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Projektart</span>
                  <span className="text-slate-200">
                    {currentRequest.projectType || 'Web-App / Kundenportal'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Budgetrahmen</span>
                  <span className="text-emerald-400 font-medium font-mono">
                    {currentRequest.budgetRange || '25.000 – 50.000 €'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Zielstart</span>
                  <span className="text-slate-200 font-mono">
                    {currentRequest.targetLiveWeeks || 'in 6–8 Wochen'}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2: Zusammenfassung */}
            <div className="bg-[#0B0F17] border border-slate-800/80 rounded-lg p-3 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 pb-1 border-b border-slate-800/60">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zusammenfassung</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <p className="text-slate-300 leading-snug">
                  {currentRequest.rawRequest}
                </p>

                {/* Problem Statement */}
                <div>
                  <div className="flex items-center gap-1 font-semibold text-rose-400 text-[10px] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    Problem
                  </div>
                  <p className="text-slate-400 text-[10px] mt-0.5 leading-snug">
                    {currentRequest.problemStatement ||
                      currentRequest.currentProcess ||
                      'Aktuell viele E-Mails und manuelle Dateiablage. Kunden haben keinen transparenten Überblick über den Projektfortschritt.'}
                  </p>
                </div>

                {/* Goals */}
                <div>
                  <div className="flex items-center gap-1 font-semibold text-cyan-400 text-[10px] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    Ziele
                  </div>
                  <ul className="text-slate-300 text-[10px] mt-0.5 space-y-0.5">
                    {(currentRequest.goals || [
                      'Transparenter Projektstatus für Kunden',
                      'Sichere Dokumentenablage',
                      'Einfache Kommunikation (Nachrichten)',
                      'Zugriff für Kunden und Bauleiter (Rollen)'
                    ]).map((g, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-slate-500">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Analyse-Fortschritt (läuft automatisch) */}
          <div className="bg-[#0B0F17] border border-slate-800/80 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Analyse-Fortschritt</span>
                <span className="text-[10px] font-mono text-slate-500 font-normal">
                  (läuft automatisch)
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                100% Bereit
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between text-emerald-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Anfrage eingegangen</span>
                </div>
                <span className="text-slate-500 text-[10px]">
                  {currentRequest.createdAt?.split(',')[1] || '09:14'}
                </span>
              </div>

              <div className="flex items-center justify-between text-emerald-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Analyse abgeschlossen</span>
                </div>
                <span className="text-slate-500 text-[10px]">~ 20 Sek.</span>
              </div>

              <div className="flex items-center justify-between text-emerald-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pattern gesucht</span>
                </div>
                <span className="text-slate-400 text-[10px]">3 Treffer</span>
              </div>

              <div className="flex items-center justify-between text-emerald-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Delta berechnet</span>
                </div>
                <span className="text-cyan-400 text-[10px]">Δ 18%</span>
              </div>

              <div className="flex items-center justify-between text-emerald-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>UX-Vorschau gebaut</span>
                </div>
                <span className="text-emerald-400 text-[10px]">Aktiv</span>
              </div>
            </div>
          </div>

          {/* Action-Bar at Bottom of Left Card */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={handleAcceptClick}
              className="w-full sm:flex-1 py-2.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-950 font-sans"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <div className="text-left">
                <div className="leading-tight font-bold">Anfrage akzeptieren</div>
                <div className="text-[10px] text-emerald-950 font-normal">
                  Zur Komposition übergeben
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setShowClarifyModal(true)}
              className="w-full sm:w-auto py-2.5 px-3 rounded-lg bg-[#0B0F17] hover:bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Rückfrage</span>
            </button>

            <button
              type="button"
              onClick={() => onRejectOrPark(currentRequest)}
              className="w-full sm:w-auto py-2.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Ablehnen</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: 2. Live-Komposition & UX-Vorschau (7 Cols) */}
        {/* ------------------------------------------------------------ */}
        <div className="xl:col-span-7 bg-[#0D121C] border border-slate-800/90 rounded-xl p-5 space-y-5 shadow-xl shadow-black/40">
          {/* Header 2 with Jev Status and Live Badge */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono shadow-sm shadow-cyan-950">
                2
              </span>
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight">
                  Live-Komposition &amp; UX-Vorschau
                </h2>
                <p className="text-xs text-slate-400">
                  Jev sucht passende Patterns und erstellt in Echtzeit die Produktvorschau.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live</span>
              </span>
            </div>
          </div>

          {/* Jev Agent Header Card */}
          <div className="bg-[#0B0F17] border border-slate-800/90 rounded-lg p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5 shadow-md shadow-cyan-950">
                  <div className="w-full h-full rounded-full bg-[#0B0F17] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B0F17]"></span>
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Jev analysiert die Anfrage ...</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Suche die besten Lösungspatterns und komponiere das Produkt.
                </p>
              </div>
            </div>

            {/* Micro Status Checklist */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-slate-400">
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Anfrage verstanden
              </span>
              <span className="text-cyan-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Patterns gematcht
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> UI komponiert
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Delta bereit
              </span>
            </div>
          </div>

          {/* ========================================================== */}
          {/* DIE 4 BEWERTUNGSKRITERIEN (Das Delta-Modell) */}
          {/* ========================================================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                Bewertungskriterien
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                (alle 4 Kriterien fließen in den Vorschlag ein)
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {/* 1. Reuse Score */}
              <div className="bg-[#0B0F17] border border-slate-800/80 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-medium text-slate-300 text-[11px]">Reuse Score</span>
                  </div>
                  <span className="text-[10px] text-slate-500">ⓘ</span>
                </div>
                <div className="text-lg font-bold text-emerald-400 font-mono tracking-tight">
                  {deltaMetrics.reuseScore}%
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${deltaMetrics.reuseScore}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {deltaMetrics.reuseScoreText || 'Hohe Wiederverwendung vorhandener Komponenten.'}
                </p>
              </div>

              {/* 2. Delta Size */}
              <div className="bg-[#0B0F17] border border-slate-800/80 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-medium text-slate-300 text-[11px]">Delta Size</span>
                  </div>
                  <span className="text-[10px] text-slate-500">ⓘ</span>
                </div>
                <div className="text-lg font-bold text-cyan-400 font-mono tracking-tight">
                  {deltaMetrics.deltaSize}%
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${deltaMetrics.deltaSize}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {deltaMetrics.deltaSizeText || 'Kleine Anpassungen erforderlich.'}
                </p>
              </div>

              {/* 3. Delta Criticality */}
              <div className="bg-[#0B0F17] border border-slate-800/80 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-medium text-slate-300 text-[11px]">Criticality</span>
                  </div>
                  <span className="text-[10px] text-slate-500">ⓘ</span>
                </div>
                <div className="text-lg font-bold text-amber-400 tracking-tight">
                  {deltaMetrics.deltaCriticality}
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{
                      width:
                        deltaMetrics.deltaCriticality === 'Niedrig'
                          ? '25%'
                          : deltaMetrics.deltaCriticality === 'Mittel'
                          ? '60%'
                          : '95%'
                    }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {deltaMetrics.deltaCriticalityText || 'Keine kritischen Änderungen.'}
                </p>
              </div>

              {/* 4. Human Touch */}
              <div className="bg-[#0B0F17] border border-slate-800/80 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-medium text-slate-300 text-[11px]">Human Touch</span>
                  </div>
                  <span className="text-[10px] text-slate-500">ⓘ</span>
                </div>
                <div className="text-lg font-bold text-sky-400 tracking-tight flex items-baseline gap-1">
                  <span>{deltaMetrics.humanTouch}</span>
                  {deltaMetrics.humanTouchMinutes && (
                    <span className="text-[10px] font-mono text-slate-400">
                      (~{deltaMetrics.humanTouchMinutes}m)
                    </span>
                  )}
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-400 h-full rounded-full"
                    style={{
                      width:
                        deltaMetrics.humanTouch === 'Gering'
                          ? '25%'
                          : deltaMetrics.humanTouch === 'Mittel'
                          ? '50%'
                          : '85%'
                    }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {deltaMetrics.humanTouchText || 'Individuelle Anpassungen für Prozesse.'}
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* PASSENDE LÖSUNGSPATTERNS (Pattern Selection) */}
          {/* ========================================================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">
                  Passende Lösungspatterns
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {patterns.length} gefunden
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenDetailedAnalysis(currentRequest)}
                className="text-emerald-400 hover:text-emerald-300 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Alle Details anzeigen</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {patterns.map((pat) => {
                const isSelected = selectedPatternId === pat.id;
                return (
                  <div
                    key={pat.id}
                    onClick={() => setSelectedPatternId(pat.id)}
                    className={`rounded-lg p-3 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/20 border-emerald-500/60 shadow-md shadow-emerald-950/50'
                        : 'bg-[#0B0F17] border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Mini Thumbnail Mockup */}
                      <div className="h-14 rounded bg-slate-900 border border-slate-800 p-1.5 mb-2 overflow-hidden flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-b border-slate-800/80 pb-0.5">
                          <span>{pat.title}</span>
                          <span className="text-emerald-400 font-bold">{pat.score}%</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 h-full">
                          <div className="bg-slate-800/60 rounded"></div>
                          <div className="bg-slate-800/40 rounded col-span-2"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white tracking-tight">
                          {pat.title}
                        </h4>
                        <span className="text-xs font-bold font-mono text-emerald-400">
                          {pat.score}%
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">
                        {pat.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPatternId(pat.id);
                      }}
                      className={`mt-2.5 py-1 px-2 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer w-full text-center ${
                        isSelected
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isSelected ? '✓ Gewählt' : 'Pattern wählen'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================== */}
          {/* KOMPONENTEN & SOFORTIGE UX-VORSCHAU (Side-by-Side) */}
          {/* ========================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-1">
            {/* Left Block: Komponenten werden zusammengestellt (5 Cols) */}
            <div className="lg:col-span-5 bg-[#0B0F17] border border-slate-800/80 rounded-lg p-3 space-y-3">
              <div className="text-xs font-semibold text-slate-300 flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                <span>Komponenten werden zusammengestellt ...</span>
              </div>

              {/* Bereits vorhanden (wird wiederverwendet) */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="font-bold">Bereits vorhanden</span>
                  <span className="text-slate-500 font-normal">
                    (wird wiederverwendet)
                  </span>
                </div>

                <div className="space-y-1">
                  {reusedComponents.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between bg-slate-900/60 px-2 py-1 rounded text-[11px] border border-slate-800/60"
                    >
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span className="truncate">{c.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20">
                        {c.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fehlt noch (wird neu erstellt) */}
              <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
                  <span className="w-3 h-3 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[9px] border border-cyan-500/40">
                    {missingComponents.length}
                  </span>
                  <span className="font-bold">Fehlt noch</span>
                  <span className="text-slate-500 font-normal">
                    (wird neu erstellt)
                  </span>
                </div>

                <div className="space-y-1">
                  {missingComponents.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between bg-slate-900/60 px-2 py-1 rounded text-[11px] border border-slate-800/60"
                    >
                      <div className="flex items-center gap-1.5 text-slate-200 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        <span className="truncate">{m.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-1 py-0.2 rounded border border-cyan-500/20 shrink-0">
                        {m.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Block: Sofortige UX-Vorschau (7 Cols) */}
            <div className="lg:col-span-7 bg-[#0B0F17] border border-slate-800/80 rounded-lg p-3 space-y-2 flex flex-col justify-between">
              {/* Header of Preview Box */}
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">
                    Sofortige UX-Vorschau
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    UI sofort erlebbar
                  </span>
                </div>

                {/* AI Studio Prompt Action Button */}
                <button
                  type="button"
                  onClick={() => setShowPromptModal(true)}
                  className="px-2 py-0.8 rounded text-[10px] font-mono font-medium text-cyan-300 hover:text-white bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Generiert fertigen Prompt für AI Studio"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>AI Studio Prompt</span>
                </button>
              </div>

              {/* ==================================================== */}
              {/* INTERACTIVE MINI APPLICATION PREVIEW */}
              {/* ==================================================== */}
              <div className="bg-[#080B11] border border-slate-800 rounded-lg overflow-hidden flex flex-col h-[230px] shadow-inner font-sans text-xs">
                {/* App Topbar */}
                <div className="h-8 bg-[#0D121C] border-b border-slate-800 px-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-600 text-[9px] font-bold text-white flex items-center justify-center font-mono">
                      {uiPreview.logoText}
                    </div>
                    <span className="font-bold text-slate-200 text-[11px] truncate">
                      {uiPreview.appName}
                    </span>
                  </div>

                  {/* Navigation Tabs inside preview */}
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('dashboard')}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        previewTab === 'dashboard'
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('projects')}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        previewTab === 'projects'
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Projekte
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('uncertain')}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                        previewTab === 'uncertain'
                          ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                          : 'text-amber-400 hover:text-amber-300 bg-amber-500/10'
                      }`}
                    >
                      <span>Prüffach</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('documents')}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        previewTab === 'documents'
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Dokumente
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('messages')}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        previewTab === 'messages'
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Nachrichten
                    </button>
                  </div>

                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>

                {/* App Content Area */}
                <div className="p-2.5 overflow-y-auto space-y-2 flex-1 bg-[#080B11]">
                  {previewTab === 'dashboard' && (
                    <>
                      {/* Metric Stat Row */}
                      <div className="grid grid-cols-3 gap-1.5">
                        <div className="bg-[#0D121C] border border-slate-800/80 rounded p-1.5">
                          <div className="text-[9px] text-slate-400">Aktive Projekte</div>
                          <div className="text-sm font-bold text-white font-mono">
                            {uiPreview.activeProjectsCount}
                          </div>
                        </div>
                        <div className="bg-[#0D121C] border border-slate-800/80 rounded p-1.5">
                          <div className="text-[9px] text-slate-400">Dokumente</div>
                          <div className="text-sm font-bold text-cyan-400 font-mono">
                            {uiPreview.documentsCount}
                          </div>
                        </div>
                        <div className="bg-[#0D121C] border border-slate-800/80 rounded p-1.5">
                          <div className="text-[9px] text-slate-400">Offene Aufgaben</div>
                          <div className="text-sm font-bold text-amber-400 font-mono">
                            {uiPreview.openTasksCount}
                          </div>
                        </div>
                      </div>

                      {/* Project Table inside preview */}
                      <div className="bg-[#0D121C] border border-slate-800/80 rounded overflow-hidden">
                        <div className="px-2 py-1 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between text-[9px] font-mono text-slate-400">
                          <span>Projekt</span>
                          <span>Status &amp; Fortschritt</span>
                        </div>
                        <div className="divide-y divide-slate-800/60 text-[10px]">
                          {uiPreview.projects.map((proj, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setSelectedPreviewProject(proj.name);
                                setPreviewTab('projects');
                              }}
                              className="px-2 py-1 flex items-center justify-between hover:bg-slate-800/40 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <span className="font-medium text-slate-200">
                                  {proj.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 font-mono">
                                <span className="px-1 py-0.2 rounded text-[9px] bg-slate-800 text-slate-300">
                                  {proj.status}
                                </span>
                                <span className="text-slate-400 text-[9px]">
                                  {proj.progress}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {previewTab === 'projects' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-white">
                        <span>Details: {selectedPreviewProject}</span>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20">
                          In Bearbeitung
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                        <div className="bg-[#0D121C] p-1.5 rounded border border-slate-800">
                          <span className="text-slate-400 block text-[9px]">Bauleiter</span>
                          <span className="text-slate-200 font-medium">Markus Keller</span>
                        </div>
                        <div className="bg-[#0D121C] p-1.5 rounded border border-slate-800">
                          <span className="text-slate-400 block text-[9px]">Nächster Meilenstein</span>
                          <span className="text-slate-200 font-medium">Estrich-Abnahme (Fr.)</span>
                        </div>
                      </div>
                      <div className="bg-[#0D121C] p-1.5 rounded border border-slate-800 space-y-1">
                        <div className="text-[9px] text-slate-400 font-mono">Gewerke Status</div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span>Rohbau / Mauerwerk</span>
                          <span className="text-emerald-400 font-mono">100% ✓</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span>Elektro &amp; Sanitär</span>
                          <span className="text-cyan-400 font-mono">75%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {previewTab === 'uncertain' && (
                    <div className="space-y-2 text-[10px]">
                      <div className="flex items-center justify-between text-[9px] font-mono text-amber-400">
                        <span className="font-bold">Prüffach: Ungeklärte Dokumente (1)</span>
                        <span className="bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/30">
                          Manuelle Zuweisung erforderlich
                        </span>
                      </div>

                      {/* Uncertain Document Item */}
                      <div className="p-2 bg-[#0D121C] rounded border border-amber-500/30 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>WhatsApp_Foto_Rohre_20261008.jpg</span>
                          </span>
                          <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-1 py-0.2 rounded border border-rose-500/20">
                            Konfidenz: 42%
                          </span>
                        </div>

                        <div className="bg-[#080B11] p-1.5 rounded border border-slate-800 text-[10px] space-y-0.5 font-mono">
                          <div className="text-slate-400 flex items-center justify-between">
                            <span>Absender: Bauhof Müller (+49 171 8923481)</span>
                            <span className="text-slate-500">14:22 Uhr</span>
                          </div>
                          <p className="text-amber-300 italic">"Hier die Rohre"</p>
                        </div>

                        {assignedUncertain ? (
                          <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 font-mono">
                            <Check className="w-3 h-3" />
                            <span>Zugewiesen zu: Neubau Müller (Projekt-Akte aktualisiert)</span>
                          </div>
                        ) : (
                          <div className="space-y-1 pt-1">
                            <span className="text-[9px] text-slate-400 block font-mono">
                              Kandidaten (automatisch vorgeschlagen):
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setAssignedUncertain(true)}
                                className="flex-1 py-1 px-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-semibold transition-colors cursor-pointer text-left flex items-center justify-between"
                              >
                                <span>1. Neubau Müller (68%)</span>
                                <span className="text-[8px] bg-emerald-500/30 px-1 rounded">Zuweisen ✓</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowClarifyModal(true)}
                                className="py-1 px-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-mono transition-colors cursor-pointer"
                              >
                                💬 Nachfragen
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {previewTab === 'documents' && (
                    <div className="space-y-1 text-[10px]">
                      <div className="text-[9px] font-mono text-slate-400 mb-1">
                        Dokumentenablage ({uiPreview.appName})
                      </div>
                      {[
                        { name: 'Baugenehmigung_Mueller_Final.pdf', size: '2.4 MB', date: 'Gestern' },
                        { name: 'Statik_Berechnung_Halle_V2.pdf', size: '8.1 MB', date: '02. Okt' },
                        { name: 'Ausführungsplan_Elektro.dwg', size: '14 MB', date: '28. Sep' }
                      ].map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-1 bg-[#0D121C] rounded border border-slate-800 hover:border-slate-700"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <FileText className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate text-slate-200">{doc.name}</span>
                          </div>
                          <span className="text-slate-500 font-mono text-[9px] shrink-0">
                            {doc.size}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {previewTab === 'messages' && (
                    <div className="space-y-1.5 text-[10px]">
                      <div className="text-[9px] font-mono text-slate-400">
                        Bauleiter-Chat &amp; Kundenkanal
                      </div>
                      <div className="bg-[#0D121C] p-1.5 rounded border border-slate-800 space-y-0.5">
                        <div className="flex items-center justify-between text-[9px] text-slate-400">
                          <span className="font-bold text-emerald-400">Bauherr Müller</span>
                          <span className="font-mono">10:45 Uhr</span>
                        </div>
                        <p className="text-slate-300 text-[10px]">
                          Können wir den Termin für die Fenster-Lieferung um 2 Tage verschieben?
                        </p>
                      </div>
                      <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800 space-y-0.5 text-right">
                        <div className="flex items-center justify-between text-[9px] text-slate-400">
                          <span className="font-mono">11:02 Uhr</span>
                          <span className="font-bold text-cyan-400">Bauleitung Hoffmann</span>
                        </div>
                        <p className="text-slate-200 text-[10px]">
                          Ja, ist im Bauzeitenplan vermerkt. Aktualisierter Plan ist im Dokumenten-Hub abgelegt.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* REVERSE-TRACEABILITY INSPECTOR: Warum existiert dieser Screen? */}
              {showReverseTraceability && (
                <div className="p-3 bg-gradient-to-r from-cyan-950/30 to-[#0B0F17] border border-cyan-500/30 rounded-lg text-xs space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-bold flex items-center gap-1.5 text-[11px]">
                      <Eye className="w-3.5 h-3.5" />
                      <span>WARUM EXISTIERT DIESER SCREEN? (Reverse-Traceability)</span>
                    </span>
                    {onOpenProcessMap && (
                      <button
                        type="button"
                        onClick={() => onOpenProcessMap(currentRequest)}
                        className="text-[10px] font-mono text-purple-400 hover:text-purple-300 underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Im Living Process Map ansehen 🗺️</span>
                      </button>
                    )}
                  </div>

                  {previewTab === 'uncertain' ? (
                    <div className="space-y-1 text-[11px]">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 font-mono text-[10px]">
                        <div className="bg-[#080B11] p-1.5 rounded border border-slate-800">
                          <span className="text-slate-500 block">EVENT:</span>
                          <span className="text-orange-400 font-bold">PHOTO_UPLOADED &amp; UNCERTAIN</span>
                        </div>
                        <div className="bg-[#080B11] p-1.5 rounded border border-slate-800">
                          <span className="text-slate-500 block">POLICY:</span>
                          <span className="text-purple-400 font-bold">Confidence &lt; 85% → Prüffach</span>
                        </div>
                        <div className="bg-[#080B11] p-1.5 rounded border border-slate-800">
                          <span className="text-slate-500 block">HUMAN ACTION:</span>
                          <span className="text-emerald-400 font-bold">Büromitarbeiter ordnet Projekt zu</span>
                        </div>
                      </div>
                      <p className="text-slate-300 text-[11px] pt-0.5">
                        <strong className="text-white">Begründung:</strong> Verhindert Fehlzuordnung von Material &amp; Kosten auf die falsche Baustelle vor Rechnungsstellung.
                      </p>
                      <p className="text-slate-400 text-[10px] italic">
                        Quelle im Kundentext: „Oft wissen wir im Büro nicht sofort, zu welcher Baustelle ein Foto gehört – z.B. wenn Herr Müller nur 'Hier die Rohre' schreibt.“
                      </p>
                    </div>
                  ) : previewTab === 'dashboard' ? (
                    <div className="space-y-1 text-[11px]">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 font-mono text-[10px]">
                        <div className="bg-[#080B11] p-1.5 rounded border border-slate-800">
                          <span className="text-slate-500 block">EVENT:</span>
                          <span className="text-orange-400 font-bold">STATUS_UPDATED</span>
                        </div>
                        <div className="bg-[#080B11] p-1.5 rounded border border-slate-800">
                          <span className="text-slate-500 block">POLICY:</span>
                          <span className="text-purple-400 font-bold">Live-Transparenz für Bauherren</span>
                        </div>
                        <div className="bg-[#080B11] p-1.5 rounded border border-slate-800">
                          <span className="text-slate-500 block">HUMAN ACTION:</span>
                          <span className="text-emerald-400 font-bold">Bauherr prüft Fortschritt ohne Anruf</span>
                        </div>
                      </div>
                      <p className="text-slate-300 text-[11px] pt-0.5">
                        <strong className="text-white">Begründung:</strong> Eliminiert zeitraubende telefonische Nachfragen und schafft Vertrauen zwischen Bauherr und Bauleitung.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 text-[11px]">
                      <p className="text-slate-300 text-[11px]">
                        Dieser Screen existiert, um den Prozessschritt <span className="text-cyan-300 font-mono font-semibold">{previewTab.toUpperCase()}</span> für {currentRequest.company || currentRequest.customerName} interaktiv und transparent abzubilden.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Subtext info */}
              <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1">
                <span>Vorschau reagiert in Echtzeit auf gewählte Patterns</span>
                <button
                  type="button"
                  onClick={() => onOpenDetailedAnalysis(currentRequest)}
                  className="text-cyan-400 hover:underline cursor-pointer"
                >
                  SaaS-Manifest ansehen →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BOTTOM CONVEYOR BELT: PRODUKTIONS-FLIEẞBAND */}
      {/* ============================================================== */}
      <div className="bg-[#0D121C] border border-slate-800 rounded-xl p-4 shadow-xl shadow-black/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-xs font-bold text-white tracking-tight uppercase font-mono">
              Produktions-Fließband
            </h3>
            <span className="text-slate-500 text-xs">•</span>
            <p className="text-xs text-slate-400">
              Nach Annahme geht die Anfrage automatisch in die Umsetzung.
            </p>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Aktuelle Phase: <span className="text-emerald-400 font-bold">1 Intake</span>
          </div>
        </div>

        {/* 5-Step Stepper Line */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 font-mono text-xs">
          {/* Step 1: Intake */}
          <div
            className={`p-2.5 rounded-lg border transition-all flex items-center gap-2.5 ${
              conveyorStep >= 1
                ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-sm shadow-emerald-950'
                : 'bg-[#0B0F17] border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-xs shrink-0">
              1
            </span>
            <div>
              <div className="font-bold text-xs text-emerald-300">Intake</div>
              <div className="text-[10px] text-slate-400">Aktuell geprüft</div>
            </div>
          </div>

          {/* Step 2: Pattern Match */}
          <div
            className={`p-2.5 rounded-lg border transition-all flex items-center gap-2.5 ${
              conveyorStep >= 2
                ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                : 'bg-[#0B0F17] border-slate-800/80 text-slate-400'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-700">
              2
            </span>
            <div>
              <div className="font-bold text-xs text-slate-200">Pattern Match</div>
              <div className="text-[10px] text-slate-400">3 identifiziert</div>
            </div>
          </div>

          {/* Step 3: UI Preview */}
          <div
            className={`p-2.5 rounded-lg border transition-all flex items-center gap-2.5 ${
              conveyorStep >= 3
                ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                : 'bg-[#0B0F17] border-slate-800/80 text-slate-400'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-700">
              3
            </span>
            <div>
              <div className="font-bold text-xs text-slate-200">UI Preview</div>
              <div className="text-[10px] text-slate-400">Live erlebbar</div>
            </div>
          </div>

          {/* Step 4: Acceptance */}
          <div
            className={`p-2.5 rounded-lg border transition-all flex items-center gap-2.5 ${
              conveyorStep >= 4
                ? 'bg-amber-500/15 border-amber-500/50 text-white'
                : 'bg-[#0B0F17] border-slate-800/80 text-slate-400'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-700">
              4
            </span>
            <div>
              <div className="font-bold text-xs text-slate-200">Acceptance</div>
              <div className="text-[10px] text-slate-400">Warten auf Freigabe</div>
            </div>
          </div>

          {/* Step 5: Build Queue */}
          <div
            className={`p-2.5 rounded-lg border transition-all flex items-center gap-2.5 ${
              conveyorStep >= 5
                ? 'bg-emerald-500 text-black font-bold'
                : 'bg-[#0B0F17] border-slate-800/80 text-slate-400'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-700">
              5
            </span>
            <div>
              <div className="font-bold text-xs">Build Queue</div>
              <div className="text-[10px] opacity-80">In Warteschlange</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: AI STUDIO MASTER PROMPT (Der Prompt für AI Studio) */}
      {/* ============================================================== */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D121C] border border-cyan-500/40 rounded-xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Fertiger AI Studio Master-Prompt für {currentRequest.company || currentRequest.customerName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Kopiere diesen Prompt und füge ihn direkt in Google AI Studio ein, um die klickbare UI in Rekordzeit zu bauen.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPromptModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#080B11] border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-y-auto flex-1 whitespace-pre-wrap leading-relaxed selection:bg-cyan-500/30">
              {generateAiStudioPrompt()}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400">
                Format: Single-Page Application (React 19 + Tailwind CSS)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPromptModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800 cursor-pointer"
                >
                  Schließen
                </button>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-950 transition-all"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>In Zwischenablage kopiert!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Prompt kopieren</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: RÜCKFRAGE AN DEN KUNDEN */}
      {/* ============================================================== */}
      {showClarifyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D121C] border border-slate-800 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Rückfrage an {currentRequest.company || currentRequest.customerName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowClarifyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Welche Details müssen vor der Fertigung geklärt werden? (z.B. Schnittstellen zu DATEV, Rollenberechtigungen oder Hosting-Vorgaben)
            </p>

            <textarea
              rows={4}
              value={clarifyMessage}
              onChange={(e) => setClarifyMessage(e.target.value)}
              placeholder="z.B. Benötigen Sie für die Dokumentenablage eine direkte Anbindung an Ihr internes ERP-System oder reicht der Cloud-S3-Storage?"
              className="w-full bg-[#0B0F17] border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClarifyModal(false)}
                className="px-3 py-1.5 rounded text-xs font-mono text-slate-400 hover:text-white"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={() => {
                  onClarify(currentRequest);
                  setShowClarifyModal(false);
                }}
                className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Rückfrage absenden &amp; Status auf Klärung setzen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
