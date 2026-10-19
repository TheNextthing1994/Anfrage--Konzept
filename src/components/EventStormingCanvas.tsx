import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Panel,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
  SelectionMode
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ProcessNodeDetail, ProcessNodeStatus, ProcessNodeType } from '../data/workstationData';
import { EventStormingNode, EventStormingNodeData } from './EventStormingNode';
import { generateEventStormingGraph } from '../utils/eventStormingGraph';
import {
  Maximize2,
  RotateCcw,
  Plus,
  GitBranch,
  Layers,
  Filter,
  ZoomIn,
  ZoomOut,
  Info,
  ChevronDown,
  CheckCircle2,
  Cpu,
  HelpCircle,
  AlertTriangle,
  Move,
  BoxSelect,
  Target,
  Hand,
  Scan,
  Focus,
  Sparkles
} from 'lucide-react';

const nodeTypes = {
  eventStorming: EventStormingNode
};

interface EventStormingCanvasInnerProps {
  nodes: ProcessNodeDetail[];
  selectedNodeId: string;
  filterStatus: ProcessNodeStatus | 'ALL';
  layoutOrientation: 'horizontal' | 'vertical';
  onSelectNode: (nodeId: string) => void;
  onStatusChange: (nodeId: string, status: ProcessNodeStatus) => void;
  onLayoutChange: (orientation: 'horizontal' | 'vertical') => void;
  onFilterChange: (status: ProcessNodeStatus | 'ALL') => void;
  onOpenAddNodeModal: () => void;
}

const EventStormingCanvasInner: React.FC<EventStormingCanvasInnerProps> = ({
  nodes,
  selectedNodeId,
  filterStatus,
  layoutOrientation,
  onSelectNode,
  onStatusChange,
  onLayoutChange,
  onFilterChange,
  onOpenAddNodeModal
}) => {
  const {
    fitView,
    fitBounds,
    zoomIn,
    zoomOut,
    zoomTo,
    setCenter,
    getNodes,
    screenToFlowPosition
  } = useReactFlow();

  const [showLegend, setShowLegend] = useState(false);
  const [interactionMode, setInteractionMode] = useState<'pan' | 'lasso'>('pan');
  const [zoomFeedback, setZoomFeedback] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Generate initial flow graph
  const initialGraph = useMemo(() => {
    return generateEventStormingGraph(nodes, {
      orientation: layoutOrientation,
      selectedNodeId,
      filterStatus,
      onSelectNode,
      onStatusChange
    });
  }, [nodes, layoutOrientation, selectedNodeId, filterStatus, onSelectNode, onStatusChange]);

  const [flowNodes, setFlowNodes] = useNodesState<Node<EventStormingNodeData>>(initialGraph.flowNodes);
  const [flowEdges, setFlowEdges] = useEdgesState<Edge>(initialGraph.flowEdges);

  // Sync flow nodes when props change
  useEffect(() => {
    const updated = generateEventStormingGraph(nodes, {
      orientation: layoutOrientation,
      selectedNodeId,
      filterStatus,
      onSelectNode,
      onStatusChange
    });
    setFlowNodes(updated.flowNodes);
    setFlowEdges(updated.flowEdges);
  }, [nodes, layoutOrientation, selectedNodeId, filterStatus, onSelectNode, onStatusChange, setFlowNodes, setFlowEdges]);

  // Center on selected node if single node changed from outside
  useEffect(() => {
    const selectedFlowNode = flowNodes.find((n) => n.id === selectedNodeId);
    if (selectedFlowNode && selectedFlowNode.position) {
      setCenter(selectedFlowNode.position.x + 144, selectedFlowNode.position.y + 90, {
        zoom: 0.95,
        duration: 400
      });
    }
  }, [selectedNodeId, setCenter]);

  // 1. Initial comfortable readable view: Focus on the start-to-middle process instead of tiny miniature!
  useEffect(() => {
    const timer = setTimeout(() => {
      // Find start & middle nodes so text is instantly readable
      const keyNodes = flowNodes.filter((n) =>
        ['NODE-01', 'NODE-02', 'NODE-03', 'NODE-04', 'NODE-05', 'NODE-06'].includes(n.id)
      );
      if (keyNodes.length > 0) {
        fitView({
          nodes: keyNodes,
          padding: 0.22,
          duration: 500,
          maxZoom: 1.05
        });
      } else {
        fitView({ padding: 0.2, maxZoom: 1.05 });
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [layoutOrientation, fitView]);

  // 2. Direct Action: Focus & Zoom into the central process (Mitte heranzoomen)
  const handleZoomCenter = useCallback(() => {
    // Specifically target the decision, branch & exception nodes in the middle (like in user screenshot)
    const centerIds = ['NODE-03', 'NODE-04', 'NODE-05', 'NODE-06', 'NODE-07', 'NODE-11'];
    let middleNodes = flowNodes.filter((n) => centerIds.includes(n.id));

    if (middleNodes.length === 0) {
      if (flowNodes.length >= 3) {
        const start = Math.floor(flowNodes.length * 0.2);
        const end = Math.ceil(flowNodes.length * 0.8);
        middleNodes = flowNodes.slice(start, end);
      } else {
        middleNodes = flowNodes;
      }
    }

    if (middleNodes.length > 0) {
      fitView({
        nodes: middleNodes,
        padding: 0.2,
        duration: 500,
        maxZoom: 1.25
      });
      // Select central focal node in inspector
      const focal = middleNodes.find((n) => n.id === 'NODE-04') || middleNodes[0];
      if (focal) {
        onSelectNode(focal.id);
      }
      setZoomFeedback(`🎯 Mitte vergrößert: ${middleNodes.length} Kernschritte im Fokus`);
      setTimeout(() => setZoomFeedback(null), 3500);
    }
  }, [flowNodes, fitView, onSelectNode]);

  // 3. 100% Reading Size Zoom
  const handleZoom100 = useCallback(() => {
    zoomTo(1.0, { duration: 400 });
    setZoomFeedback('🔍 100% Lesegröße aktiviert');
    setTimeout(() => setZoomFeedback(null), 2500);
  }, [zoomTo]);

  // 4. Reset to Full Overview
  const handleFitAll = useCallback(() => {
    fitView({ padding: 0.15, duration: 450 });
    setZoomFeedback('⛶ Gesamtübersicht aller Schritte');
    setTimeout(() => setZoomFeedback(null), 2500);
  }, [fitView]);

  // 5. Mouse Drag Handler for Lasso / Marquee Zoom
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // If lasso mode or user holds shift
      if (interactionMode === 'lasso' || e.shiftKey) {
        dragStartRef.current = { x: e.clientX, y: e.clientY };
      }
    },
    [interactionMode]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (dragStartRef.current) {
        const startX = dragStartRef.current.x;
        const startY = dragStartRef.current.y;
        const endX = e.clientX;
        const endY = e.clientY;
        dragStartRef.current = null;

        const dx = Math.abs(endX - startX);
        const dy = Math.abs(endY - startY);

        // Only handle as selection box if user dragged at least 25px
        if (dx > 25 && dy > 25) {
          const p1 = screenToFlowPosition({
            x: Math.min(startX, endX),
            y: Math.min(startY, endY)
          });
          const p2 = screenToFlowPosition({
            x: Math.max(startX, endX),
            y: Math.max(startY, endY)
          });

          const box = {
            x: p1.x,
            y: p1.y,
            width: p2.x - p1.x,
            height: p2.y - p1.y
          };

          // Find flow nodes that intersect the selected box
          const currentNodes = getNodes();
          const intersecting = currentNodes.filter((n) => {
            const nx = n.position.x;
            const ny = n.position.y;
            const nw = 288;
            const nh = 190;
            return (
              nx + nw >= box.x &&
              nx <= box.x + box.width &&
              ny + nh >= box.y &&
              ny <= box.y + box.height
            );
          });

          if (intersecting.length > 0) {
            fitView({
              nodes: intersecting,
              padding: 0.22,
              duration: 500,
              maxZoom: 1.35
            });
            if (intersecting[0]) {
              onSelectNode(intersecting[0].id);
            }
            setZoomFeedback(`🔍 ${intersecting.length} ausgewählte Knoten herangezoomt`);
            setTimeout(() => setZoomFeedback(null), 3200);
          } else {
            fitBounds(box, { padding: 0.15, duration: 500 });
            setZoomFeedback('🔍 Ausgewählter Bereich herangezoomt');
            setTimeout(() => setZoomFeedback(null), 3000);
          }
        }
      }
    },
    [screenToFlowPosition, getNodes, fitView, fitBounds, onSelectNode]
  );

  // 6. XYFlow native onSelectionEnd callback
  const handleSelectionEnd = useCallback(() => {
    setTimeout(() => {
      const allCurrentNodes = getNodes();
      const selectedNodes = allCurrentNodes.filter((n) => n.selected);
      if (selectedNodes.length > 0) {
        fitView({
          nodes: selectedNodes,
          padding: 0.22,
          duration: 500,
          maxZoom: 1.35
        });
        if (selectedNodes[0]) {
          onSelectNode(selectedNodes[0].id);
        }
        setZoomFeedback(`🔍 ${selectedNodes.length} Knoten im Bereich vergrößert`);
        setTimeout(() => setZoomFeedback(null), 3000);
      }
    }, 40);
  }, [getNodes, fitView, onSelectNode]);

  // Color mapper for minimap
  const minimapNodeColor = (node: Node) => {
    const data = node.data as unknown as EventStormingNodeData;
    if (!data?.node) return '#475569';
    switch (data.node.type) {
      case 'ACTOR':
        return '#F59E0B';
      case 'COMMAND':
        return '#3B82F6';
      case 'EVENT':
        return '#F97316';
      case 'POLICY':
        return '#A855F7';
      case 'READ_MODEL':
        return '#10B981';
      case 'EXCEPTION':
        return '#F43F5E';
      default:
        return '#64748B';
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`relative w-full h-full min-h-[580px] bg-[#070B13] rounded-2xl overflow-hidden border border-cyan-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_40px_rgba(6,182,212,0.06)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_35%,rgba(6,182,212,0.08)_0%,transparent_70%)] before:pointer-events-none ${
        interactionMode === 'lasso' ? 'cursor-crosshair' : ''
      }`}
    >
      {/* Top Floating Controls Bar inside Canvas */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Toolbar: Quick Filter Pills in Frosted Glass Capsule */}
        <div className="flex flex-wrap items-center gap-1.5 glass-capsule px-3 py-1.5 rounded-full pointer-events-auto text-xs font-mono shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.1)]">
          <span className="text-cyan-400 flex items-center gap-1 px-1 text-[11px] font-semibold tracking-wider uppercase">
            <Filter className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-300/80">Filter:</span>
          </span>
          <button
            type="button"
            onClick={() => onFilterChange('ALL')}
            className={`px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
              filterStatus === 'ALL'
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-cyan-200 hover:bg-cyan-950/30'
            }`}
          >
            Alle ({nodes.length})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('CONFIRMED')}
            className={`px-2.5 py-1 rounded-full text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
              filterStatus === 'CONFIRMED'
                ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/30'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]"></span>
            <span>Confirmed ({nodes.filter((n) => n.status === 'CONFIRMED').length})</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('INFERRED')}
            className={`px-2.5 py-1 rounded-full text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
              filterStatus === 'INFERRED'
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-bold shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/30'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]"></span>
            <span>Inferred ({nodes.filter((n) => n.status === 'INFERRED').length})</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('UNCLEAR')}
            className={`px-2.5 py-1 rounded-full text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
              filterStatus === 'UNCLEAR'
                ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50 font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-amber-300 hover:bg-amber-950/30'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]"></span>
            <span>Unclear ({nodes.filter((n) => n.status === 'UNCLEAR').length})</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('QUESTION')}
            className={`px-2.5 py-1 rounded-full text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
              filterStatus === 'QUESTION'
                ? 'bg-rose-500/25 text-rose-200 border border-rose-400/50 font-bold shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                : 'text-slate-400 hover:text-rose-300 hover:bg-rose-950/30'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse shadow-[0_0_6px_#f43f5e]"></span>
            <span>Fragen ({nodes.filter((n) => n.status === 'QUESTION').length})</span>
          </button>
        </div>

        {/* Center / Right Toolbar: Zoom Tools & Selection Mode */}
        <div className="flex flex-wrap items-center gap-2 glass-capsule px-3 py-1.5 rounded-full pointer-events-auto text-xs font-mono shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.1)]">
          {/* Interaction Mode Toggle: Pan vs Lasso-Zoom */}
          <div className="flex items-center bg-[#070B13]/90 p-0.5 rounded-full border border-cyan-500/25">
            <button
              type="button"
              onClick={() => setInteractionMode('pan')}
              className={`px-2.5 py-1 rounded-full text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                interactionMode === 'pan'
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Verschieben-Modus (Pan / Drag & Drop)"
            >
              <Hand className="w-3.5 h-3.5" />
              <span>Pan</span>
            </button>
            <button
              type="button"
              onClick={() => setInteractionMode((m) => (m === 'lasso' ? 'pan' : 'lasso'))}
              className={`px-3 py-1 rounded-full text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                interactionMode === 'lasso'
                  ? 'bg-cyan-500 text-[#070B13] font-bold ring-2 ring-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.6)]'
                  : 'text-cyan-300 hover:text-white hover:bg-cyan-950/40'
              }`}
              title="Lasso-Zoom: Ziehe mit der Maus einen Rahmen über den gewünschten Bereich zum Heranzoomen"
            >
              <BoxSelect className="w-3.5 h-3.5" />
              <span>Lasso-Zoom</span>
              {interactionMode === 'lasso' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#070B13] animate-ping"></span>
              )}
            </button>
          </div>

          {/* Quick Target Button: Zoom Center / Middle Flow */}
          <button
            type="button"
            onClick={handleZoomCenter}
            className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-200 border border-cyan-400/50 hover:border-cyan-300 rounded-full text-[11px] flex items-center gap-1.5 transition-all cursor-pointer font-bold shadow-[0_0_14px_rgba(6,182,212,0.2)] hover:scale-[1.02]"
            title="Mitte des Prozesses (Gabelung, OCR & Kern-Logik) direkt heranzuomen"
          >
            <Target className="w-3.5 h-3.5 text-cyan-300" />
            <span>Mitte heranzoomen</span>
          </button>

          {/* 100% Reading Size */}
          <button
            type="button"
            onClick={handleZoom100}
            className="px-2.5 py-1 bg-slate-900/60 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-200 border border-slate-700/80 hover:border-cyan-500/40 rounded-full text-[11px] transition-all cursor-pointer font-medium"
            title="Auf 100% Lesegröße zoomen"
          >
            100% Lesegröße
          </button>

          {/* Fit View Button */}
          <button
            type="button"
            onClick={handleFitAll}
            className="p-1.5 text-slate-400 hover:text-cyan-200 hover:bg-cyan-950/40 rounded-full transition-colors cursor-pointer border border-transparent hover:border-cyan-500/30"
            title="Ganzes Diagramm (Gesamtansicht)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-cyan-500/25"></div>

          {/* Add Node Button */}
          <button
            type="button"
            onClick={onOpenAddNodeModal}
            className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 rounded-full text-xs flex items-center gap-1.5 transition-all cursor-pointer font-bold shadow-[0_0_12px_rgba(6,182,212,0.2)]"
            title="Neuen Event-Storming Knoten hinzufügen"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-300" />
            <span>Knoten +</span>
          </button>

          {/* Legend toggle */}
          <button
            type="button"
            onClick={() => setShowLegend((v) => !v)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer border ${
              showLegend
                ? 'text-cyan-300 bg-cyan-500/20 border-cyan-400/50'
                : 'text-slate-400 hover:text-cyan-200 border-transparent hover:border-cyan-500/30'
            }`}
            title="Event Storming Legende einblenden"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Lasso Active Helper Banner */}
      {interactionMode === 'lasso' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-25 glass-capsule px-4 py-2 rounded-full border border-cyan-400/70 shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-2.5 text-xs font-mono text-cyan-100 pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <Scan className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>
            <strong className="text-white">Lasso-Zoom aktiv:</strong> Ziehe mit der Maus ein Rechteck über die Mitte oder gewünschte Knoten – wird sofort vergrößert!
          </span>
          <button
            type="button"
            onClick={() => setInteractionMode('pan')}
            className="ml-2 px-2.5 py-0.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-[10px] rounded-full cursor-pointer border border-cyan-400/40 font-bold transition-colors"
          >
            Fertig
          </button>
        </div>
      )}

      {/* Zoom Feedback Toast */}
      {zoomFeedback && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-25 glass-capsule px-4 py-1.5 rounded-full border border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.3)] flex items-center gap-2 text-xs font-mono text-white pointer-events-auto">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>{zoomFeedback}</span>
          <button
            type="button"
            onClick={handleFitAll}
            className="text-[10px] text-cyan-300 hover:text-cyan-100 underline ml-1 cursor-pointer font-semibold"
          >
            Übersicht
          </button>
        </div>
      )}

      {/* Event Storming Legend Card (Expandable Frosted Glass) */}
      {showLegend && (
        <div className="absolute top-16 right-3 z-30 glass-capsule p-3.5 rounded-2xl border border-cyan-500/30 shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.15)] text-xs font-mono max-w-xs space-y-2.5 pointer-events-auto">
          <div className="flex items-center justify-between pb-1.5 border-b border-cyan-500/20">
            <span className="font-bold text-cyan-200 text-[10.5px] uppercase tracking-[0.14em]">
              Event Storming Farblegende
            </span>
            <button
              type="button"
              onClick={() => setShowLegend(false)}
              className="text-slate-400 hover:text-cyan-200 p-0.5 text-xs transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 shadow-[0_0_5px_#f59e0b]"></span>
              <span>ACTOR (Rolle)</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_5px_#22d3ee]"></span>
              <span>COMMAND (Aktion)</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0 shadow-[0_0_5px_#f97316]"></span>
              <span>EVENT (Fakt)</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0 shadow-[0_0_5px_#a855f7]"></span>
              <span>POLICY (Regel)</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_5px_#10b981]"></span>
              <span>READ MODEL (Sicht)</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 shadow-[0_0_5px_#f43f5e]"></span>
              <span>EXCEPTION (Risiko)</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 leading-normal border-t border-cyan-500/20">
            Knoten frei verschiebbar per Drag &amp; Drop. Mit Lasso-Zoom oder 'Mitte heranzoomen' beliebige Bereiche groß vergrößern.
          </p>
        </div>
      )}

      {/* The Actual XYFlow Canvas */}
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodesChange={(changes) => setFlowNodes((nds) => applyNodeChanges(changes, nds))}
        onEdgesChange={(changes) => setFlowEdges((eds) => applyEdgeChanges(changes, eds))}
        onNodeClick={(_, node) => onSelectNode(node.id)}
        selectionOnDrag={interactionMode === 'lasso'}
        panOnDrag={interactionMode === 'lasso' ? [1, 2] : [0, 1, 2]}
        selectionMode={SelectionMode.Partial}
        selectionKeyCode="Shift"
        onSelectionEnd={handleSelectionEnd}
        minZoom={0.25}
        maxZoom={2.2}
        defaultViewport={{ x: 30, y: 80, zoom: 0.95 }}
        className="touch-none select-none"
      >
        <Background color="#162740" gap={28} size={1.2} />
        <Controls
          showInteractive={false}
          className="!bg-[#070B13]/90 !border-cyan-500/30 !shadow-2xl !rounded-xl overflow-hidden [&>button]:!bg-[#070B13] [&>button]:!border-cyan-500/20 [&>button]:!text-cyan-200 hover:[&>button]:!bg-cyan-950/60 hover:[&>button]:!text-cyan-100"
        />
        <MiniMap
          nodeColor={minimapNodeColor}
          maskColor="rgba(7, 11, 19, 0.85)"
          className="!bg-[#070B13]/95 !border !border-cyan-500/30 !rounded-xl !shadow-2xl"
          zoomable
          pannable
        />
      </ReactFlow>

      {/* Helper Bar at Bottom Center: Sleek Frosted Glass Capsule */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 glass-capsule px-4 py-1.5 rounded-full border border-cyan-500/25 text-[11px] text-slate-300 font-mono flex items-center gap-3.5 pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_15px_rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-1.5 text-cyan-300">
          <BoxSelect className="w-3.5 h-3.5 text-cyan-400" />
          <span>Rahmen ziehen zum Zoomen</span>
        </div>
        <span className="text-cyan-900">•</span>
        <button
          type="button"
          onClick={handleZoomCenter}
          className="text-cyan-300 hover:text-white flex items-center gap-1 font-bold cursor-pointer transition-colors"
        >
          <Target className="w-3 h-3 text-cyan-400" />
          <span>Mitte vergrößern</span>
        </button>
        <span className="text-cyan-900">•</span>
        <button
          type="button"
          onClick={handleZoom100}
          className="text-slate-400 hover:text-cyan-200 cursor-pointer transition-colors"
        >
          100% Lesegröße
        </button>
      </div>
    </div>
  );
};

export interface EventStormingCanvasProps {
  nodes: ProcessNodeDetail[];
  selectedNodeId: string;
  filterStatus: ProcessNodeStatus | 'ALL';
  layoutOrientation: 'horizontal' | 'vertical';
  onSelectNode: (nodeId: string) => void;
  onStatusChange: (nodeId: string, status: ProcessNodeStatus) => void;
  onLayoutChange: (orientation: 'horizontal' | 'vertical') => void;
  onFilterChange: (status: ProcessNodeStatus | 'ALL') => void;
  onOpenAddNodeModal: () => void;
}

export const EventStormingCanvas: React.FC<EventStormingCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <EventStormingCanvasInner {...props} />
    </ReactFlowProvider>
  );
};
