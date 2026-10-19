import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow, ReactFlowProvider, Background, Controls, MiniMap,
  useNodesState, useEdgesState, useReactFlow, useNodesInitialized, useViewport,
  applyNodeChanges, applyEdgeChanges, SelectionMode, Node, Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Filter, Hand, BoxSelect, Target, Maximize2, Plus, Info, X, Check, ArrowRight } from 'lucide-react';
import { ProcessNodeDetail, ProcessNodeStatus } from '../data/workstationData';
import { EventStormingNode, EventStormingNodeData } from './EventStormingNode';
import { generateEventStormingGraph } from '../utils/eventStormingGraph';

const nodeTypes = { eventStorming: EventStormingNode };
const filters: Array<{ value: ProcessNodeStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Alle' },
  { value: 'CONFIRMED', label: 'Bestätigt' },
  { value: 'INFERRED', label: 'Abgeleitet' },
  { value: 'UNCLEAR', label: 'Unklar' },
  { value: 'QUESTION', label: 'Fragen' }
];
const legendItems = [
  ['#e6bd82', 'Rolle'], ['#a7d8f5', 'Aktion'], ['#e7ad87', 'Ereignis'],
  ['#c4b4e8', 'Regel'], ['#94d4bc', 'Sicht'], ['#e5a4b4', 'Ausnahme'], ['#b7c9df', 'System']
];

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

const EventStormingCanvasInner: React.FC<EventStormingCanvasProps> = ({
  nodes, selectedNodeId, filterStatus, layoutOrientation,
  onSelectNode, onStatusChange, onFilterChange, onOpenAddNodeModal
}) => {
  const { fitView, fitBounds, setCenter, getNodes, getViewport, screenToFlowPosition } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const { zoom } = useViewport();
  const [showLegend, setShowLegend] = useState(false);
  const [interactionMode, setInteractionMode] = useState<'pan' | 'lasso'>('pan');
  const [feedback, setFeedback] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const selectionHandled = useRef(false);
  const skipSelectionFocus = useRef<string | null>(null);
  const previousOrientation = useRef(layoutOrientation);
  const fittedOrientation = useRef<string | null>(null);

  const initialGraph = useMemo(() => generateEventStormingGraph(nodes, {
    orientation: layoutOrientation, selectedNodeId, filterStatus, onSelectNode, onStatusChange
  }), [nodes, layoutOrientation, selectedNodeId, filterStatus, onSelectNode, onStatusChange]);
  const [flowNodes, setFlowNodes] = useNodesState<Node<EventStormingNodeData>>(initialGraph.flowNodes);
  const [flowEdges, setFlowEdges] = useEdgesState<Edge>(initialGraph.flowEdges);

  // Updating a status/filter/selection must not discard manually arranged nodes.
  // A new request remounts this canvas; an orientation change intentionally relays it out.
  useEffect(() => {
    const layoutChanged = previousOrientation.current !== layoutOrientation;
    previousOrientation.current = layoutOrientation;
    setFlowNodes((current) => {
      const byId = new Map(current.map((node) => [node.id, node]));
      return initialGraph.flowNodes.map((node) => {
        const previous = byId.get(node.id);
        return previous ? {
          ...node,
          position: layoutChanged ? node.position : previous.position,
          selected: node.id === selectedNodeId,
          measured: previous.measured
        } : { ...node, selected: node.id === selectedNodeId };
      });
    });
    setFlowEdges(initialGraph.flowEdges);
  }, [initialGraph, layoutOrientation, selectedNodeId, setFlowNodes, setFlowEdges]);

  // Wait for measured node dimensions. The number of initially visible cards
  // follows actual canvas width instead of fitting six fixed IDs into every screen.
  useEffect(() => {
    if (!nodesInitialized || fittedOrientation.current === layoutOrientation) return;
    const frame = requestAnimationFrame(() => {
      const current = getNodes();
      if (!current.length) return;
      const width = stageRef.current?.clientWidth || 600;
      const count = width >= 980 ? 3 : width >= 620 ? 2 : 1;
      fittedOrientation.current = layoutOrientation;
      void fitView({ nodes: current.slice(0, count), padding: 0.14, minZoom: 0.8, maxZoom: 1, duration: 0 });
    });
    return () => cancelAnimationFrame(frame);
  }, [nodesInitialized, layoutOrientation, fitView, getNodes]);

  // Keep an already visible selection in place; reveal off-screen selections
  // from the source/inspector without undoing an explicit group/lasso zoom.
  useEffect(() => {
    if (!nodesInitialized || !fittedOrientation.current) return;
    if (skipSelectionFocus.current === selectedNodeId) {
      skipSelectionFocus.current = null;
      return;
    }
    skipSelectionFocus.current = null;
    const node = getNodes().find((item) => item.id === selectedNodeId);
    const stage = stageRef.current;
    if (!node || !stage) return;
    const viewport = getViewport();
    const width = node.measured?.width || 288;
    const height = node.measured?.height || 244;
    const left = node.position.x * viewport.zoom + viewport.x;
    const top = node.position.y * viewport.zoom + viewport.y;
    const visible = left >= 12 && top >= 12 &&
      left + width * viewport.zoom <= stage.clientWidth - 12 &&
      top + height * viewport.zoom <= stage.clientHeight - 12;
    if (!visible) {
      void setCenter(node.position.x + width / 2, node.position.y + height / 2, {
        zoom: Math.max(viewport.zoom, 0.8), duration: 300
      });
    }
  }, [selectedNodeId, nodesInitialized, getNodes, getViewport, setCenter]);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3200);
    return () => clearTimeout(timer);
  }, [feedback]);

  const fitAll = useCallback(() => {
    void fitView({ padding: 0.14, duration: 350 });
    setFeedback('Alle Prozessschritte im Überblick');
  }, [fitView]);

  const focusCenter = useCallback(() => {
    const current = getNodes();
    const focal = current.find((item) => (item.data as EventStormingNodeData).node.type === 'POLICY') ||
      current[Math.floor(current.length / 2)];
    if (!focal) return;
    skipSelectionFocus.current = focal.id;
    onSelectNode(focal.id);
    void fitView({ nodes: [focal], padding: 0.18, minZoom: 0.85, maxZoom: 1, duration: 350 });
    setFeedback('Zentraler Prozessschritt im Fokus');
  }, [getNodes, onSelectNode, fitView]);

  const readAt100 = useCallback(() => {
    const current = getNodes();
    const selected = current.find((item) => item.id === selectedNodeId) || current[0];
    if (!selected) return;
    void fitView({ nodes: [selected], minZoom: 1, maxZoom: 1, padding: 0, duration: 300 });
    setFeedback('Ausgewählter Knoten in 100 % Lesegröße');
  }, [getNodes, selectedNodeId, fitView]);

  const zoomSelection = useCallback((selected: Node[]) => {
    if (!selected.length) return;
    skipSelectionFocus.current = selected[0].id;
    // Lasso is a zoom tool; the inspector still has one focused node.
    setFlowNodes((current) => current.map((node) => ({ ...node, selected: node.id === selected[0].id })));
    onSelectNode(selected[0].id);
    void fitView({ nodes: selected, padding: 0.18, maxZoom: 1.35, duration: 350 });
    setFeedback(selected.length + ' Knoten im Fokus');
  }, [onSelectNode, fitView, setFlowNodes]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button !== 0 || (!event.shiftKey && interactionMode !== 'lasso')) return;
    if (!(event.target as HTMLElement).closest('.react-flow__pane')) return;
    selectionHandled.current = false;
    dragStartRef.current = { x: event.clientX, y: event.clientY };
  }, [interactionMode]);

  const handleMouseUp = useCallback((event: React.MouseEvent) => {
    const start = dragStartRef.current;
    dragStartRef.current = null;
    if (!start || Math.abs(event.clientX - start.x) < 25 || Math.abs(event.clientY - start.y) < 25) return;
    selectionHandled.current = true;
    const p1 = screenToFlowPosition({ x: Math.min(start.x, event.clientX), y: Math.min(start.y, event.clientY) });
    const p2 = screenToFlowPosition({ x: Math.max(start.x, event.clientX), y: Math.max(start.y, event.clientY) });
    const box = { x: p1.x, y: p1.y, width: p2.x - p1.x, height: p2.y - p1.y };
    const selected = getNodes().filter((node) => {
      const width = node.measured?.width || 288;
      const height = node.measured?.height || 244;
      return node.position.x + width >= box.x && node.position.x <= box.x + box.width &&
        node.position.y + height >= box.y && node.position.y <= box.y + box.height;
    });
    if (selected.length) zoomSelection(selected);
    else {
      void fitBounds(box, { padding: 0.15, duration: 350 });
      setFeedback('Ausgewählter Bereich im Fokus');
    }
  }, [screenToFlowPosition, getNodes, zoomSelection, fitBounds]);

  const handleSelectionEnd = useCallback(() => {
    requestAnimationFrame(() => {
      if (!selectionHandled.current) zoomSelection(getNodes().filter((node) => node.selected));
    });
  }, [getNodes, zoomSelection]);

  const minimapNodeColor = (node: Node) => ({
    ACTOR: '#e6bd82', COMMAND: '#a7d8f5', EVENT: '#e7ad87',
    POLICY: '#c4b4e8', READ_MODEL: '#94d4bc', EXCEPTION: '#e5a4b4', SYSTEM: '#b7c9df'
  }[(node.data as EventStormingNodeData).node?.type] || '#b7c9df');

  return (
    <section className="dt-process-canvas" aria-label="Interaktive Prozesslandkarte">
      <div className="dt-canvas-toolbar">
        <div className="dt-canvas-toolbar-heading">
          <span className="dt-canvas-eyebrow">Prozesslandkarte</span>
          <span className="dt-canvas-count">{nodes.length} Schritte</span>
        </div>
        <div className="dt-glass dt-filter-bar" role="group" aria-label="Knoten nach Status hervorheben">
          <Filter size={14} className="dt-toolbar-icon" aria-hidden="true" />
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={filterStatus === filter.value}
              data-status={filter.value}
              className="dt-filter-button"
              onClick={() => onFilterChange(filter.value)}
            >
              {filter.label}
              <span>{filter.value === 'ALL' ? nodes.length : nodes.filter((node) => node.status === filter.value).length}</span>
            </button>
          ))}
        </div>
        <div className="dt-canvas-tools" role="group" aria-label="Canvas-Werkzeuge">
          <div className="dt-glass dt-mode-switch">
            <button type="button" aria-pressed={interactionMode === 'pan'} onClick={() => setInteractionMode('pan')} title="Verschieben-Modus">
              <Hand size={14} /> <span>Pan</span>
            </button>
            <button type="button" aria-pressed={interactionMode === 'lasso'} onClick={() => setInteractionMode('lasso')} title="Rahmen ziehen und den Bereich vergrößern">
              <BoxSelect size={14} /> <span>Lasso-Zoom</span>
            </button>
          </div>
          <button type="button" className="dt-tool-button" onClick={focusCenter} title="Zentralen Prozessschritt lesen"><Target size={14} /><span>Prozessmitte</span></button>
          <button type="button" className="dt-tool-button" onClick={readAt100} title="Ausgewählten Knoten in 100 % Lesegröße anzeigen">100 %</button>
          <button type="button" className="dt-tool-button dt-icon-button" onClick={fitAll} title="Ganzes Diagramm anzeigen" aria-label="Gesamtübersicht"><Maximize2 size={15} /></button>
          <span className="dt-tool-spacer" />
          <button type="button" className="dt-tool-button dt-tool-primary" onClick={onOpenAddNodeModal}><Plus size={15} /><span>Knoten</span></button>
          <button type="button" className="dt-tool-button dt-icon-button" onClick={() => setShowLegend((value) => !value)} aria-expanded={showLegend} aria-label="Farblegende" title="Farblegende"><Info size={15} /></button>
        </div>
      </div>

      <div ref={stageRef} className="dt-canvas-stage" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onNodesChange={(changes) => setFlowNodes((current) => applyNodeChanges(changes, current))}
          onEdgesChange={(changes) => setFlowEdges((current) => applyEdgeChanges(changes, current))}
          onNodeClick={(_, node) => onSelectNode(node.id)}
          selectionOnDrag={interactionMode === 'lasso'}
          panOnDrag={interactionMode === 'lasso' ? [1, 2] : [0, 1, 2]}
          selectionMode={SelectionMode.Partial}
          selectionKeyCode="Shift"
          onSelectionStart={() => { selectionHandled.current = false; }}
          onSelectionEnd={handleSelectionEnd}
          minZoom={0.25}
          maxZoom={2.2}
          defaultViewport={{ x: 24, y: 24, zoom: 1 }}
          className="dt-flow"
        >
          <Background color="rgba(164,195,226,0.16)" gap={28} size={1} />
          <Controls showInteractive={false} className="dt-flow-controls" />
          <MiniMap nodeColor={minimapNodeColor} maskColor="rgba(13,23,39,0.72)" className="dt-flow-minimap" zoomable pannable />
        </ReactFlow>

        {showLegend && (
          <aside className="dt-glass dt-canvas-legend" aria-label="Event-Storming-Farblegende">
            <div className="dt-legend-heading"><span>Knotentypen</span><button type="button" onClick={() => setShowLegend(false)} aria-label="Legende schließen"><X size={15} /></button></div>
            <div className="dt-legend-items">{legendItems.map(([color, label]) => <span key={label}><i style={{ backgroundColor: color }} />{label}</span>)}</div>
            <p>Die Farbe zeigt den Knotentyp. Das Status-Badge zeigt den Klärungsstand.</p>
          </aside>
        )}
        {feedback && <div className="dt-glass dt-canvas-feedback" role="status"><Check size={14} />{feedback}</div>}
      </div>

      <div className="dt-canvas-footer">
        <span><span className="dt-live-dot" />{interactionMode === 'lasso' ? 'Rahmen aufziehen, um einen Bereich zu lesen' : 'Ziehen zum Verschieben · Shift + Ziehen für Lasso-Zoom'}</span>
        <span className="dt-zoom-value" aria-label="Aktuelle Vergrößerung">{Math.round(zoom * 100)} %</span>
        {interactionMode === 'lasso' && <button type="button" onClick={() => setInteractionMode('pan')}>Fertig <ArrowRight size={13} /></button>}
      </div>
    </section>
  );
};

export const EventStormingCanvas: React.FC<EventStormingCanvasProps> = (props) => (
  <ReactFlowProvider><EventStormingCanvasInner {...props} /></ReactFlowProvider>
);
