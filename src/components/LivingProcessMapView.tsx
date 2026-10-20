import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Info,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  Cpu,
  FileText,
  Eye,
  Copy,
  Check,
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  Layers,
  Send,
  Building2,
  Calendar,
  X,
  ShieldCheck,
  Zap,
  Maximize2,
  RotateCcw,
  GitBranch,
  Quote,
  Server,
  Database,
  ArrowUpRight
} from 'lucide-react';
import {
  ClientRequest,
  ProcessNodeDetail,
  ProcessNodeStatus,
  ProcessNodeType,
  LivingProcessMap
} from '../data/workstationData';
import { EventStormingCanvas } from './EventStormingCanvas';
import {
  generateArchitectureFromText,
  SystemBuildingBlock
} from '../utils/processArchitectureGenerator';
import { useLanguage, LanguageToggle } from '../i18n/LanguageContext';

interface LivingProcessMapViewProps {
  request: ClientRequest;
  allRequests: ClientRequest[];
  onSelectRequestId: (id: string) => void;
  onNavigateToPreview: () => void;
  onNavigateToComposition: () => void;
  onUpdateProcessNode?: (nodeId: string, updated: Partial<ProcessNodeDetail>) => void;
  onSaveAllNodes?: (nodes: ProcessNodeDetail[]) => void;
}

export const LivingProcessMapView: React.FC<LivingProcessMapViewProps> = ({
  request,
  allRequests,
  onSelectRequestId,
  onNavigateToPreview,
  onNavigateToComposition,
  onUpdateProcessNode,
  onSaveAllNodes
}) => {
  const { t, language } = useLanguage();
  const currentIndex = Math.max(
    0,
    allRequests.findIndex((r) => r.id === request.id)
  );

  // Generate initial architecture and systems
  const initialArch = React.useMemo(() => {
    return generateArchitectureFromText(request.rawRequest, request.customerName, request.company);
  }, [request.rawRequest, request.customerName, request.company]);

  // Local state for interactive nodes so the user can edit/confirm/delete live
  const [nodes, setNodes] = useState<ProcessNodeDetail[]>(
    request.processMap?.nodes && request.processMap.nodes.length >= 3
      ? request.processMap.nodes
      : initialArch.nodes
  );

  const [currentSystems, setCurrentSystems] = useState<SystemBuildingBlock[]>(initialArch.systems);
  const [showSystemsModal, setShowSystemsModal] = useState<boolean>(false);
  const [derivationFeedback, setDerivationFeedback] = useState<string | null>(null);

  // Update nodes when switching requests
  useEffect(() => {
    if (request.processMap?.nodes && request.processMap.nodes.length >= 3) {
      setNodes(request.processMap.nodes);
      setSelectedNodeId(request.processMap.nodes[0].id);
      const arch = generateArchitectureFromText(request.rawRequest, request.customerName, request.company);
      setCurrentSystems(arch.systems);
    } else {
      const arch = generateArchitectureFromText(request.rawRequest, request.customerName, request.company);
      setNodes(arch.nodes);
      setCurrentSystems(arch.systems);
      setSelectedNodeId(arch.nodes[0]?.id || 'NODE-01');
      if (onSaveAllNodes) {
        onSaveAllNodes(arch.nodes);
      }
    }
  }, [request.id, request.rawRequest]);

  const handleDeriveArchitecture = () => {
    // This is a local, synchronous derivation; no simulated loading delay.
    const arch = generateArchitectureFromText(request.rawRequest, request.customerName, request.company);
    setNodes(arch.nodes);
    setCurrentSystems(arch.systems);
    setSelectedNodeId(arch.nodes[0]?.id || 'NODE-01');
    setDerivationFeedback(`${arch.nodes.length} Prozessschritte und ${arch.systems.length} Systeme abgeleitet.`);
    onSaveAllNodes?.(arch.nodes);
  };

  useEffect(() => {
    if (!derivationFeedback) return;
    const timer = setTimeout(() => setDerivationFeedback(null), 5000);
    return () => clearTimeout(timer);
  }, [derivationFeedback]);

  useEffect(() => setDerivationFeedback(null), [request.id]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    nodes.find((n) => n.id === 'NODE-04')?.id || nodes[0]?.id || 'NODE-01'
  );

  const [filterStatus, setFilterStatus] = useState<ProcessNodeStatus | 'ALL'>('ALL');
  const [layoutOrientation, setLayoutOrientation] = useState<'horizontal' | 'vertical'>('horizontal');

  // Clarification Generator modal
  const [showClarifyModal, setShowClarifyModal] = useState<boolean>(false);
  const [clarifyMessage, setClarifyMessage] = useState<string>('');
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);

  // Add Node modal state
  const [showAddNodeModal, setShowAddNodeModal] = useState<boolean>(false);
  const [newNodeType, setNewNodeType] = useState<ProcessNodeType>('EVENT');
  const [newNodeTitle, setNewNodeTypeTitle] = useState<string>('');
  const [newNodeActor, setNewNodeActor] = useState<string>('');
  const [newNodeStatus, setNewNodeStatus] = useState<ProcessNodeStatus>('INFERRED');
  const [newNodeRationale, setNewNodeRationale] = useState<string>('');
  const [newNodeBranch, setNewNodeBranch] = useState<'default' | 'success' | 'uncertain'>('default');

  // Inline edit state
  const [isEditingNode, setIsEditingNode] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedType, setEditedType] = useState<ProcessNodeType>('EVENT');
  const [editedRationale, setEditedRationale] = useState<string>('');
  const [editedActor, setEditedActor] = useState<string>('');
  const [editedFailureHandling, setEditedFailureHandling] = useState<string>('');
  const [editedAuthorizedRoles, setEditedAuthorizedRoles] = useState<string>('');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Derived counts
  const confirmedCount = nodes.filter((n) => n.status === 'CONFIRMED').length;
  const unconfirmedCount = nodes.length - confirmedCount;
  const confirmationPercent = Math.round(confirmedCount / (nodes.length || 1) * 100);
  const nextUnconfirmedNode = nodes.find((node) => node.status === 'QUESTION') ||
    nodes.find((node) => node.status === 'UNCLEAR') ||
    nodes.find((node) => node.status !== 'CONFIRMED');

  const handlePrevRequest = () => {
    if (currentIndex > 0) {
      onSelectRequestId(allRequests[currentIndex - 1].id);
    }
  };

  const handleNextRequest = () => {
    if (currentIndex < allRequests.length - 1) {
      onSelectRequestId(allRequests[currentIndex + 1].id);
    }
  };

  const handleStatusChange = (nodeId: string, newStatus: ProcessNodeStatus) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, status: newStatus } : n))
    );
    if (onUpdateProcessNode) {
      onUpdateProcessNode(nodeId, { status: newStatus });
    }
  };

  const handleConfirmSelectedNode = () => {
    if (selectedNode) {
      handleStatusChange(selectedNode.id, 'CONFIRMED');
    }
  };

  const handleStartEdit = () => {
    if (selectedNode) {
      setEditedTitle(selectedNode.title);
      setEditedType(selectedNode.type);
      setEditedRationale(selectedNode.rationale);
      setEditedActor(selectedNode.actorOrSubject || '');
      setEditedFailureHandling(selectedNode.failureHandling || '');
      setEditedAuthorizedRoles(selectedNode.authorizedRoles || '');
      setIsEditingNode(true);
    }
  };

  const handleSaveEdit = () => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNodeId
          ? {
              ...n,
              title: editedTitle,
              type: editedType,
              rationale: editedRationale,
              actorOrSubject: editedActor,
              failureHandling: editedFailureHandling,
              authorizedRoles: editedAuthorizedRoles
            }
          : n
      )
    );
    setIsEditingNode(false);
  };

  const handleDeleteNode = () => {
    if (nodes.length <= 1) return;
    const remaining = nodes.filter((n) => n.id !== selectedNodeId);
    setNodes(remaining);
    setSelectedNodeId(remaining[0]?.id || '');
  };

  const handleCreateNewNode = () => {
    if (!newNodeTitle.trim()) return;
    const newId = `NODE-${String(nodes.length + 1).padStart(2, '0')}`;
    const newNode: ProcessNodeDetail = {
      id: newId,
      type: newNodeType,
      title: newNodeTitle.trim(),
      actorOrSubject: newNodeActor.trim() || undefined,
      status: newNodeStatus,
      rationale: newNodeRationale.trim() || 'Vom Operator manuell hinzugefügter Prozessschritt.',
      branch: newNodeBranch === 'default' ? undefined : newNodeBranch,
      failureHandling: 'Automatische Fallback-Regel im Event-Storming Modell.',
      authorizedRoles: 'Verantwortlicher Prozess-Owner'
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
    setShowAddNodeModal(false);
    setNewNodeTypeTitle('');
    setNewNodeActor('');
    setNewNodeRationale('');
  };

  const handleGenerateClarifyMessage = () => {
    const node = selectedNode;
    if (!node) return;
    const questionTopic = node.failureHandling || node.rationale;
    const msg = `Hallo ${request.customerName},\n\nwir analysieren gerade im Detail den Ablauf für euer Projekt („${node.title}“):\n\n👉 Offener Punkt: ${questionTopic}\n\nKonkret möchten wir sicherstellen: ${
      node.type === 'POLICY'
        ? 'Wie soll das System verfahren, wenn Daten nicht eindeutig erkannt werden? Soll direkt beim Kunden nachgefragt werden oder prüft zuerst das Büro im Prüffach?'
        : 'Welche Erwartungen habt ihr an diesen Schritt und wer darf hier Anpassungen vornehmen?'
    }\n\nSobald das geklärt ist, stellen wir diesen Schritt in der interaktiven UX Preview für euch scharf.\n\nBeste Grüße,\nFoundry OS Team`;

    setClarifyMessage(msg);
    setShowClarifyModal(true);
  };

  return (
    <div className="dt-process-workspace space-y-4">
      {/* ============================================================== */}
      {/* TOP HEADER: VERSTEHEN PHASEN-LEISTE & VERSTÄNDNIS-SCORE */}
      {/* ============================================================== */}
      <div className="dt-process-header p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="dt-header-symbol">
              <GitBranch className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base lg:text-lg font-bold text-white tracking-tight">
                  {t('processTitle')}
                </h1>
                <span className="dt-phase-label">
                  {t('processStepLabel')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('processSubtitle')}
              </p>
            </div>
          </div>

          {/* Request Pagination & Next Stage Button */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <LanguageToggle />

            {/* Pagination < 1 von 3 > */}
            <div className="flex items-center gap-1.5 bg-[#0B0F17] px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={handlePrevRequest}
                disabled={currentIndex === 0}
                className="text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors p-0.5 cursor-pointer"
                title={t('prevRequest')}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-slate-300 font-semibold px-1">
                {currentIndex + 1} {t('ofTotal')} {allRequests.length}
              </span>
              <button
                type="button"
                onClick={handleNextRequest}
                disabled={currentIndex === allRequests.length - 1}
                className="text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors p-0.5 cursor-pointer"
                title={t('nextRequest')}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Jump to Phase 2: UX Preview */}
            <button
              type="button"
              onClick={onNavigateToPreview}
              className="dt-next-stage"
            >
              <span>{t('openUxPreview')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="dt-process-progress" aria-label={t('progressAria')}>
          <div className="dt-review-progress">
            <CheckCircle2 size={16} aria-hidden="true" />
            <span><strong>{confirmedCount} {t('ofTotal')} {nodes.length}</strong> {t('stepsConfirmedLabel')}</span>
            <div className="dt-review-track" role="progressbar" aria-label={t('progressTrackAria')} aria-valuemin={0} aria-valuemax={nodes.length || 1} aria-valuenow={confirmedCount}>
              <div style={{ width: `${confirmationPercent}%` }} />
            </div>
          </div>
          {nextUnconfirmedNode ? (
            <button type="button" className="dt-review-next" onClick={() => setSelectedNodeId(nextUnconfirmedNode.id)}>
              <span>{unconfirmedCount} {t('unconfirmedLabel')}</span>
              {t('checkOpenStep')} <ArrowUpRight size={15} />
            </button>
          ) : <span className="dt-review-complete">{t('allStepsConfirmed')} <Check size={15} /></span>}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3-COLUMN WORKSPACE: 25% LEFT | 50% CENTER | 25% RIGHT */}
      {/* The Center Canvas is the dominant element and fills height */}
      {/* ============================================================== */}
      <div className="dt-process-layout grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
        {/* ------------------------------------------------------------ */}
        {/* COLUMN 1 (Left - 25% / xl:col-span-3): Original Kundentext */}
        {/* ------------------------------------------------------------ */}
        <div className="dt-context-panel xl:col-span-3 h-full flex flex-col">
          {/* Column Header */}
          <div className="dt-context-heading p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                {t('originalClientText')}
              </h2>
            </div>
            <span className="text-[10px] font-mono text-cyan-300/80 bg-cyan-950/30 border border-cyan-500/20 px-2 py-0.5 rounded-full">
              {request.customerNumber || request.id}
            </span>
          </div>

          {/* Scrollable Customer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {/* Customer Metadata Card */}
            <div className="bg-[#05080F]/90 border border-cyan-500/15 rounded-xl p-2.5 space-y-1 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100">
                  {request.company || request.customerName}
                </span>
                <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30 font-mono font-semibold">
                  {request.industry || (language === 'ru' ? 'Средний бизнес' : 'Mittelstand')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'ru' ? 'Канал' : 'Kanal'}: {request.sourceChannel || 'E-Mail'} • {language === 'ru' ? 'Приоритет' : 'Prio'}: {request.urgency || (language === 'ru' ? 'Высокий' : 'Hoch')}
              </p>
            </div>

            {/* Raw Text Box with Interactive bidirectional quotes */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {language === 'ru' ? 'Полученный запрос:' : 'Eingegangenes Gesuch:'}
                </label>
                <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                  <Quote className="w-3 h-3" />
                  <span>{t('sourceForStep')}</span>
                </span>
              </div>

              <div className="dt-source-copy p-3 rounded-xl text-slate-300 space-y-2.5">
                {/* Check if raw request matches selected node quote */}
                <div
                  className={`dt-source-quote p-2.5 rounded-lg border transition-all ${
                    selectedNode?.sourceQuote && request.rawRequest.includes(selectedNode.sourceQuote.slice(0, 20))
                      ? 'bg-cyan-950/40 border-cyan-400/60 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'border-slate-800/80 bg-[#070B13]/60 text-slate-300'
                  }`}
                >
                  <p>"{request.rawRequest}"</p>
                  {selectedNode?.sourceQuote && (
                    <div className="mt-2 pt-2 border-t border-cyan-500/30 flex items-center justify-between text-[10px] text-cyan-300 font-sans">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]"></span>
                        <span>{language === 'ru' ? 'Связь:' : 'Bezug:'} {selectedNode.id} ({selectedNode.title})</span>
                      </span>
                    </div>
                  )}
                </div>

                {request.problemStatement && (
                  <div className="pt-2 border-t border-cyan-500/15">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold mb-0.5">
                      {language === 'ru' ? 'Формулировка проблемы:' : 'Problemstellung:'}
                    </span>
                    <p className="text-slate-400 leading-normal font-sans text-xs">
                      {request.problemStatement}
                    </p>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS: KNOTENARCHITEKTUR ABLEITEN & SYSTEME ANZEIGEN */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleDeriveArchitecture}
                  className="dt-derive-button"
                >
                  <Sparkles size={16} aria-hidden="true" />
                  <span>{t('deriveProcessBtn')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSystemsModal(true)}
                  className="w-full py-2.5 px-4 rounded-full text-xs font-mono font-medium glass-capsule text-cyan-200 hover:text-white border border-cyan-500/30 hover:border-cyan-400/60 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'ru' ? `Какие системы нужно собрать? (${currentSystems.length} модулей)` : `Welche Systeme müssen wir bauen? (${currentSystems.length} Module)`}</span>
                </button>

                {derivationFeedback && (
                  <div role="status" className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-[11px] font-mono text-emerald-200 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="leading-tight">{derivationFeedback}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Extracted Goals & Quotes */}
            {request.goals && request.goals.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Extrahierte Kernziele:
                </label>
                <div className="space-y-1">
                  {request.goals.map((goal, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-1.5 text-[11px] bg-[#080B11] border border-slate-800 p-2 rounded text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process Nodes Quoted References */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Zugeordnete Kundenaussagen:
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {nodes
                  .filter((n) => n.sourceQuote)
                  .map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setSelectedNodeId(n.id)}
                      className={`w-full text-left p-1.5 rounded border text-[10px] font-mono transition-all cursor-pointer ${
                        n.id === selectedNodeId
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold'
                          : 'bg-[#080B11] text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] text-slate-500 mb-0.5">
                        <span>{n.id}</span>
                        <span>{n.type}</span>
                      </div>
                      <p className="truncate italic">"{n.sourceQuote}"</p>
                    </button>
                  ))}
              </div>
            </div>

            {/* Tip */}
            <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <p className="leading-snug">
                Klicke auf einen beliebigen Knoten im Graph, um Details, Rollen und Klärungsbedarf im rechten Inspektor zu prüfen.
              </p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 2 (Center - ~50% / xl:col-span-6): Dominanter Graph */}
        {/* ------------------------------------------------------------ */}
        <div className="xl:col-span-6 h-full min-w-0 flex flex-col">
          <EventStormingCanvas
            key={request.id}
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            filterStatus={filterStatus}
            layoutOrientation={layoutOrientation}
            onSelectNode={(id) => setSelectedNodeId(id)}
            onStatusChange={handleStatusChange}
            onLayoutChange={setLayoutOrientation}
            onFilterChange={setFilterStatus}
            onOpenAddNodeModal={() => setShowAddNodeModal(true)}
          />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 3 (Right - 25% / xl:col-span-3): Interaktiver Inspektor */}
        {/* ------------------------------------------------------------ */}
        <div className="dt-context-panel xl:col-span-3 h-full flex flex-col">
          {/* Column Header */}
          <div className="dt-context-heading p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-cyan-300 tracking-[0.16em]">
                Knoten-Inspektor
              </span>
            </div>
            {selectedNode && (
              <span className="text-xs font-mono text-cyan-200 font-bold bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                {selectedNode.id}
              </span>
            )}
          </div>

          {/* Scrollable Inspector Body */}
          {selectedNode ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {/* Title & Type Header */}
              <div className="space-y-1.5 pb-2 border-b border-cyan-500/15">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Knoten-Titel &amp; Typ:
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider">
                    {selectedNode.type}
                  </span>
                </div>

                {isEditingNode ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full bg-[#080B11] border border-purple-500/50 rounded p-1.5 text-xs text-white"
                      placeholder="Titel des Knotens..."
                    />
                    <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
                      {(['ACTOR', 'COMMAND', 'EVENT', 'POLICY', 'READ_MODEL', 'EXCEPTION'] as ProcessNodeType[]).map(
                        (t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setEditedType(t)}
                            className={`p-1 rounded text-center transition-colors cursor-pointer ${
                              editedType === t
                                ? 'bg-purple-500 text-white font-bold'
                                : 'bg-[#080B11] text-slate-400 border border-slate-800'
                            }`}
                          >
                            {t}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                      {selectedNode.title}
                    </h3>
                    {selectedNode.actorOrSubject && (
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        Akteur/System: <span className="text-slate-200">{selectedNode.actorOrSubject}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="dt-inspector-label">{t('inspectorStatusLabel')}</span>
                <div className="dt-inspector-statuses" role="group" aria-label={t('inspectorStatusLabel')}>
                  {([
                    ['CONFIRMED', t('filterConfirmed'), CheckCircle2],
                    ['INFERRED', t('filterInferred'), Cpu],
                    ['UNCLEAR', t('filterUnclear'), AlertTriangle],
                    ['QUESTION', language === 'ru' ? 'Вопрос' : 'Frage', HelpCircle]
                  ] as const).map(([value, label, Icon]) => (
                    <button key={value} type="button" className="dt-inspector-status" data-status={value}
                      aria-pressed={selectedNode.status === value}
                      onClick={() => handleStatusChange(selectedNode.id, value)}>
                      <Icon size={14} aria-hidden="true" />{label}
                    </button>
                  ))}
                </div>
              </div>

              {/* RATIONALE */}
              <div className="space-y-1.5 bg-[#05080F]/90 p-3 rounded-xl border border-cyan-500/15 shadow-inner">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold block">
                  {t('inspectorWhyNeeded')}
                </span>
                {isEditingNode ? (
                  <textarea
                    rows={3}
                    value={editedRationale}
                    onChange={(e) => setEditedRationale(e.target.value)}
                    className="w-full bg-[#0D121C] border border-purple-500/50 rounded p-1.5 text-xs text-white"
                  />
                ) : (
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {selectedNode.rationale}
                  </p>
                )}
              </div>

              {/* SOURCE IN CUSTOMER TEXT */}
              {selectedNode.sourceQuote && (
                <div className="space-y-1 bg-[#080B11] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold block">
                    {t('inspectorSourceInText')}
                  </span>
                  <p className="text-slate-400 italic font-mono text-[11px]">
                    "{selectedNode.sourceQuote}"
                  </p>
                </div>
              )}

              {/* DETAIL QUESTIONS & EDGE CASES */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                  {t('inspectorQuestionsEdgeCases')}
                </span>

                {/* Failure Handling */}
                <div className="bg-[#080B11] p-2.5 rounded border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block font-bold font-mono">
                    {t('inspectorFailureQuestion')}
                  </span>
                  {isEditingNode ? (
                    <input
                      type="text"
                      value={editedFailureHandling}
                      onChange={(e) => setEditedFailureHandling(e.target.value)}
                      className="w-full bg-[#0D121C] border border-slate-700 rounded p-1 text-xs text-white"
                    />
                  ) : (
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {selectedNode.failureHandling || t('inspectorDefaultFailure')}
                    </p>
                  )}
                </div>

                {/* Authorized Roles */}
                <div className="bg-[#080B11] p-2.5 rounded border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block font-bold font-mono">
                    {t('inspectorWhoDecides')}
                  </span>
                  {isEditingNode ? (
                    <input
                      type="text"
                      value={editedAuthorizedRoles}
                      onChange={(e) => setEditedAuthorizedRoles(e.target.value)}
                      className="w-full bg-[#0D121C] border border-slate-700 rounded p-1 text-xs text-white"
                    />
                  ) : (
                    <p className="text-slate-300 text-[11px]">
                      {selectedNode.authorizedRoles || t('inspectorDefaultRoles')}
                    </p>
                  )}
                </div>
              </div>

              {/* REVERSE TRACEABILITY LINK */}
              {selectedNode.linkedUiComponent && (
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-cyan-300">
                    <span className="font-semibold flex items-center gap-1.5 text-[11px]">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('inspectorLinkedUiLabel')}</span>
                    </span>
                  </div>
                  <p className="text-white font-bold text-xs">
                    {selectedNode.linkedUiComponent}
                  </p>
                  <p className="text-[10px] text-cyan-200/80 leading-relaxed">
                    {selectedNode.reverseTraceabilityExplanation ||
                      'Dieser Screen existiert, um diesen spezifischen Prozessschritt dem Nutzer interaktiv bereitzustellen.'}
                  </p>
                  <button
                    type="button"
                    onClick={onNavigateToPreview}
                    className="w-full mt-1 px-2.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded text-[11px] font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-semibold"
                  >
                    <span>{t('inspectorViewInPreview')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-center text-xs text-slate-500 font-mono">
              {t('inspectorSelectPrompt')}
            </div>
          )}

          {/* Action Footer */}
          {selectedNode && (
            <div className="p-3.5 border-t border-slate-800 bg-[#0B0F17] space-y-2">
              {isEditingNode ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="flex-1 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer"
                  >
                    {t('save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingNode(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs transition-colors cursor-pointer"
                  >
                    {t('cancel')}
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleConfirmSelectedNode}
                    className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-950"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t('inspectorConfirmStep')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateClarifyMessage}
                    className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{t('inspectorAskQuestion')}</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="flex-1 py-1.5 bg-[#0D121C] hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{t('edit')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteNode}
                      disabled={nodes.length <= 1}
                      className="px-3 py-1.5 bg-[#0D121C] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 rounded text-xs transition-colors flex items-center justify-center cursor-pointer disabled:opacity-30"
                      title={t('delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: NEUEN KNOTEN HINZUFÜGEN */}
      {/* ============================================================== */}
      {showAddNodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D121C] border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Plus className="w-4 h-4" />
                <span>Neuen Event-Storming Knoten anlegen</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddNodeModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Knoten-Typ (Event Storming):
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['ACTOR', 'COMMAND', 'EVENT', 'POLICY', 'READ_MODEL', 'EXCEPTION'] as ProcessNodeType[]).map(
                    (t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewNodeType(t)}
                        className={`p-1.5 rounded text-[10px] font-mono transition-colors cursor-pointer text-center ${
                          newNodeType === t
                            ? 'bg-purple-500 text-white font-bold'
                            : 'bg-[#080B11] text-slate-400 border border-slate-800'
                        }`}
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Titel / Bezeichnung:
                </label>
                <input
                  type="text"
                  value={newNodeTitle}
                  onChange={(e) => setNewNodeTypeTitle(e.target.value)}
                  placeholder="z.B. Lieferschein abgleichen oder Bauleiter benachrichtigt"
                  className="w-full bg-[#080B11] border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Akteur / System:
                </label>
                <input
                  type="text"
                  value={newNodeActor}
                  onChange={(e) => setNewNodeActor(e.target.value)}
                  placeholder="z.B. Bauleiter oder PocketBase OCR Worker"
                  className="w-full bg-[#080B11] border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Verständnis-Status:
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {(['CONFIRMED', 'INFERRED', 'UNCLEAR', 'QUESTION'] as ProcessNodeStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewNodeStatus(s)}
                      className={`p-1 rounded text-[10px] font-mono text-center cursor-pointer ${
                        newNodeStatus === s
                          ? 'bg-purple-500 text-white font-bold'
                          : 'bg-[#080B11] text-slate-400 border border-slate-800'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Fluss-Pfad (Verzweigung):
                </label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => setNewNodeBranch('default')}
                    className={`p-1 rounded text-[10px] font-mono text-center cursor-pointer ${
                      newNodeBranch === 'default'
                        ? 'bg-slate-700 text-white font-bold'
                        : 'bg-[#080B11] text-slate-400 border border-slate-800'
                    }`}
                  >
                    Hauptfluss
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewNodeBranch('success')}
                    className={`p-1 rounded text-[10px] font-mono text-center cursor-pointer ${
                      newNodeBranch === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                        : 'bg-[#080B11] text-slate-400 border border-slate-800'
                    }`}
                  >
                    Pfad: Sicher
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewNodeBranch('uncertain')}
                    className={`p-1 rounded text-[10px] font-mono text-center cursor-pointer ${
                      newNodeBranch === 'uncertain'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                        : 'bg-[#080B11] text-slate-400 border border-slate-800'
                    }`}
                  >
                    Pfad: Unsicher
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Begründung (Warum nötig?):
                </label>
                <textarea
                  rows={2}
                  value={newNodeRationale}
                  onChange={(e) => setNewNodeRationale(e.target.value)}
                  placeholder="Warum dieser Schritt im Prozess erforderlich ist..."
                  className="w-full bg-[#080B11] border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddNodeModal(false)}
                className="px-3 py-1.5 rounded text-xs font-mono text-slate-400 hover:text-white border border-slate-800"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleCreateNewNode}
                disabled={!newNodeTitle.trim()}
                className="px-4 py-1.5 rounded text-xs font-mono font-bold bg-purple-500 text-white hover:bg-purple-400 disabled:opacity-40 transition-colors"
              >
                Knoten erstellen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: FRAGE AN KUNDE ERZEUGEN */}
      {/* ============================================================== */}
      {showClarifyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D121C] border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>Rückfrage-Entwurf für {request.customerName}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowClarifyModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Jev hat diesen präzisen Klärungsentwurf basierend auf dem Knoten „{selectedNode?.title}“ formuliert:
            </p>

            <textarea
              rows={7}
              value={clarifyMessage}
              onChange={(e) => setClarifyMessage(e.target.value)}
              className="w-full bg-[#080B11] border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-purple-500/60"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClarifyModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white border border-slate-800"
              >
                Schließen
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(clarifyMessage);
                  setCopiedDraft(true);
                  setTimeout(() => setCopiedDraft(false), 2000);
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-purple-500 text-white hover:bg-purple-400 transition-colors flex items-center gap-1.5"
              >
                {copiedDraft ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>In Zwischenablage kopiert!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Nachricht kopieren</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: WELCHE SYSTEME MÜSSEN WIR BAUEN? (SYSTEM-ARCHITEKTUR) */}
      {/* ============================================================== */}
      {showSystemsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D121C] border border-slate-800 rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span>Erforderliche System-Architektur: Welche Systeme müssen wir bauen?</span>
                </div>
                <p className="text-xs text-slate-400">
                  Um das eingegangene Gesuch von <span className="text-white font-medium">{request.company || request.customerName}</span> ({request.customerNumber || request.id}) in der Praxis autark abzubilden, orchestriert die Foundry folgende {currentSystems.length} Kernsysteme:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSystemsModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Architecture KPI Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-[#080B11] border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Foundry Reuse</span>
                <span className="text-base font-bold text-emerald-400 font-mono">83 % Wiederverwendung</span>
                <p className="text-[10px] text-slate-400">aus bestehender Registry</p>
              </div>
              <div className="bg-[#080B11] border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Betriebskosten</span>
                <span className="text-base font-bold text-cyan-400 font-mono">&lt; 18 € / Monat</span>
                <p className="text-[10px] text-slate-400">Hetzner VPS Nürnberg</p>
              </div>
              <div className="bg-[#080B11] border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Außendienst-Hürde</span>
                <span className="text-base font-bold text-purple-400 font-mono">0 % App-Zwang</span>
                <p className="text-[10px] text-slate-400">WhatsApp native Ingestion</p>
              </div>
              <div className="bg-[#080B11] border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Datenschutz &amp; DSGVO</span>
                <span className="text-base font-bold text-emerald-400 font-mono">100 % Autark</span>
                <p className="text-[10px] text-slate-400">Single-Tenant SQLite WAL</p>
              </div>
            </div>

            {/* Systems Grid (6 Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[55vh] overflow-y-auto pr-1">
              {currentSystems.map((sys) => (
                <div
                  key={sys.id}
                  className="bg-[#080B11] border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 space-y-3 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {sys.id}
                      </span>
                      <span className="text-xs font-mono font-semibold text-white">
                        {sys.name}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                        sys.reuseStatus.includes('REUSED')
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {sys.reuseStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {sys.purpose}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1 text-[11px]">
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">
                      👉 Konkreter Kundennutzen:
                    </span>
                    <p className="text-slate-200">
                      {sys.customerBenefit}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Tech Stack:</span>
                      <span className="text-slate-300 text-right font-sans text-xs">{sys.techStack}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>Im Event Storming:</span>
                      <div className="flex items-center gap-1">
                        {sys.connectedNodeIds.map((nodeId) => (
                          <button
                            key={nodeId}
                            type="button"
                            onClick={() => {
                              setSelectedNodeId(nodeId);
                              setShowSystemsModal(false);
                            }}
                            className="px-1.5 py-0.5 rounded bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 text-[10px] border border-purple-500/30 cursor-pointer"
                            title="Klicke um diesen Knoten im Graph zu fokussieren"
                          >
                            {nodeId}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400">
                Phase 1: Verstehen &amp; Event Storming &nbsp;→&nbsp; Phase 2: UX Preview &nbsp;→&nbsp; Phase 3: Härten
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowSystemsModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                >
                  Schließen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSystemsModal(false);
                    onNavigateToComposition();
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-950 cursor-pointer"
                >
                  <span>In Solution Composition öffnen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
