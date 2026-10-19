import { Edge, Node, MarkerType } from '@xyflow/react';
import { ProcessNodeDetail, ProcessNodeStatus } from '../data/workstationData';
import { EventStormingNodeData } from '../components/EventStormingNode';

export interface LayoutOptions {
  orientation: 'horizontal' | 'vertical';
  selectedNodeId?: string;
  filterStatus?: ProcessNodeStatus | 'ALL';
  onSelectNode: (nodeId: string) => void;
  onStatusChange: (nodeId: string, status: ProcessNodeStatus) => void;
}

export function generateEventStormingGraph(
  nodes: ProcessNodeDetail[],
  options: LayoutOptions
): { flowNodes: Node<EventStormingNodeData>[]; flowEdges: Edge[] } {
  const { orientation, selectedNodeId, filterStatus, onSelectNode, onStatusChange } = options;
  const isHorizontal = orientation !== 'vertical';

  const flowNodes: Node<EventStormingNodeData>[] = [];
  const flowEdges: Edge[] = [];

  if (!nodes || nodes.length === 0) {
    return { flowNodes, flowEdges };
  }

  // 1. SPECIFIC LAYOUT: Weber Elektroanlagen / 14 Monteure / Lieferscheine
  const isWeberElektro =
    nodes.some((n) => n.title.includes('Monteure') || n.title.includes('Lieferschein') || n.id === 'NODE-08');

  if (isWeberElektro && isHorizontal) {
    const positions: Record<string, { x: number; y: number }> = {
      'NODE-01': { x: 40, y: 200 },    // Actor: 14 Monteure
      'NODE-02': { x: 370, y: 200 },   // Command: Sendet WhatsApp
      'NODE-03': { x: 700, y: 200 },   // Event: WhatsApp Ingest
      'NODE-04': { x: 1030, y: 200 },  // Policy: Handschrift-OCR & Match (Gabelung)

      // Branch A: Sicher erkannt
      'NODE-05': { x: 1400, y: 60 },   // Command: Sofort zuordnen

      // Branch B: Unsicher erkannt / Handschrift unklar
      'NODE-06': { x: 1400, y: 350 },  // Exception: In Büro-Prüffach leiten
      'NODE-07': { x: 1740, y: 350 },  // Actor: Büro prüft & weist zu
      'NODE-11': { x: 1740, y: 530 },  // Question: WhatsApp Rückfrage?

      // Convergence & Fehlteile-Radar
      'NODE-08': { x: 2080, y: 200 },  // Policy: Fehlteile-Radar (Lieferschein vorhanden?)
      'NODE-09': { x: 2420, y: 60 },   // Exception: Lieferschein fehlt -> ROT
      'NODE-10': { x: 2760, y: 200 }   // Read Model: Abrechnungs-Cockpit
    };

    nodes.forEach((node, index) => {
      const pos = positions[node.id] || { x: 40 + index * 340, y: 200 };
      flowNodes.push({
        id: node.id,
        type: 'eventStorming',
        position: pos,
        data: {
          node,
          isSelected: node.id === selectedNodeId,
          filterStatus,
          layoutOrientation: 'horizontal',
          stepIndex: index + 1,
          onSelectNode,
          onStatusChange
        }
      });
    });

    const edgeDefs: Array<{
      id: string;
      source: string;
      target: string;
      label?: string;
      color?: string;
      animated?: boolean;
    }> = [
      { id: 'e1-2', source: 'NODE-01', target: 'NODE-02', label: 'Gruppen-Versand', color: '#94A3B8' },
      { id: 'e2-3', source: 'NODE-02', target: 'NODE-03', label: 'WhatsApp Webhook', color: '#60A5FA' },
      { id: 'e3-4', source: 'NODE-03', target: 'NODE-04', label: 'OCR & Handschrift', color: '#F97316' },
      // Gabelung
      { id: 'e4-5', source: 'NODE-04', target: 'NODE-05', label: 'sicher erkannt (≥ 85%)', color: '#10B981', animated: true },
      { id: 'e4-6', source: 'NODE-04', target: 'NODE-06', label: 'Handschrift unklar (< 85%)', color: '#F59E0B', animated: true },
      // Follow-up Prüffach
      { id: 'e6-7', source: 'NODE-06', target: 'NODE-07', label: 'Prüffach vorgelegt', color: '#F59E0B' },
      { id: 'e6-11', source: 'NODE-06', target: 'NODE-11', label: 'Klärungsbedarf', color: '#F43F5E', animated: true },
      // Merge in Fehlteile-Radar
      { id: 'e5-8', source: 'NODE-05', target: 'NODE-08', label: 'Auto-Ablage', color: '#10B981' },
      { id: 'e7-8', source: 'NODE-07', target: 'NODE-08', label: 'Mensch bestätigt', color: '#10B981' },
      // Fehlteile Alarm vs. Vollständig
      { id: 'e8-9', source: 'NODE-08', target: 'NODE-09', label: 'Lieferschein fehlt!', color: '#F43F5E', animated: true },
      { id: 'e8-10', source: 'NODE-08', target: 'NODE-10', label: 'Belege komplett', color: '#10B981' },
      { id: 'e9-10', source: 'NODE-09', target: 'NODE-10', label: 'Rot im Cockpit markiert', color: '#F43F5E' }
    ];

    edgeDefs.forEach((def) => {
      if (nodes.some((n) => n.id === def.source) && nodes.some((n) => n.id === def.target)) {
        flowEdges.push({
          id: def.id,
          source: def.source,
          target: def.target,
          type: 'smoothstep',
          animated: def.animated,
          label: def.label,
          labelStyle: { fill: '#BAE6FD', fontSize: 10, fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.04em' },
          labelBgStyle: { fill: '#080E1B', fillOpacity: 0.95, rx: 6, ry: 6 },
          labelBgPadding: [6, 3],
          style: { stroke: def.color || '#38BDF8', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: def.color || '#38BDF8'
          }
        });
      }
    });

    return { flowNodes, flowEdges };
  }

  // 2. SPECIFIC LAYOUT: Hoffmann Bau (REQ-2026-017)
  const isHoffmannBau = nodes.some((n) => n.id === 'NODE-04' && n.title.includes('Projekt automatisch erkennen'));

  if (isHoffmannBau && isHorizontal) {
    const positions: Record<string, { x: number; y: number }> = {
      'NODE-01': { x: 40, y: 200 },     // Actor: Kunde / Handwerker
      'NODE-02': { x: 370, y: 200 },    // Command: Sendet Foto
      'NODE-03': { x: 700, y: 200 },    // Event: Foto eingegangen
      'NODE-04': { x: 1030, y: 200 },   // Policy: Projekt erkennen (Branch point)

      // Branch A (Top: Sicher erkannt)
      'NODE-05': { x: 1400, y: 60 },    // Command: Direkt zuordnen

      // Branch B (Bottom: Unsicher erkannt)
      'NODE-06': { x: 1400, y: 350 },   // Exception: In Prüffach leiten
      'NODE-07': { x: 1740, y: 350 },   // Actor: Büromitarbeiter prüft & ordnet zu
      'NODE-10': { x: 1740, y: 530 },   // Policy/Question: WhatsApp Rückfrage?

      // Convergence
      'NODE-08': { x: 2080, y: 200 },   // Read Model: Dokument gespeichert
      'NODE-09': { x: 2420, y: 200 }    // Event: Im Dashboard sichtbar
    };

    nodes.forEach((node, index) => {
      const pos = positions[node.id] || { x: 40 + index * 340, y: 200 };
      flowNodes.push({
        id: node.id,
        type: 'eventStorming',
        position: pos,
        data: {
          node,
          isSelected: node.id === selectedNodeId,
          filterStatus,
          layoutOrientation: 'horizontal',
          stepIndex: index + 1,
          onSelectNode,
          onStatusChange
        }
      });
    });

    const edgeDefs: Array<{
      id: string;
      source: string;
      target: string;
      label?: string;
      color?: string;
      animated?: boolean;
    }> = [
      { id: 'e1-2', source: 'NODE-01', target: 'NODE-02', label: 'Upload via Chat', color: '#94A3B8' },
      { id: 'e2-3', source: 'NODE-02', target: 'NODE-03', label: 'WebHook Ingestion', color: '#60A5FA' },
      { id: 'e3-4', source: 'NODE-03', target: 'NODE-04', label: 'OCR & Geofence', color: '#F97316' },
      { id: 'e4-5', source: 'NODE-04', target: 'NODE-05', label: 'sicher erkannt (≥ 85%)', color: '#10B981', animated: true },
      { id: 'e4-6', source: 'NODE-04', target: 'NODE-06', label: 'unsicher (< 85%)', color: '#F59E0B', animated: true },
      { id: 'e6-7', source: 'NODE-06', target: 'NODE-07', label: 'Prüffach vorgelegt', color: '#F59E0B' },
      { id: 'e6-10', source: 'NODE-06', target: 'NODE-10', label: 'Klärungsbedarf', color: '#F43F5E', animated: true },
      { id: 'e5-8', source: 'NODE-05', target: 'NODE-08', label: 'Auto-Ablage', color: '#10B981' },
      { id: 'e7-8', source: 'NODE-07', target: 'NODE-08', label: 'Mensch bestätigt', color: '#10B981' },
      { id: 'e8-9', source: 'NODE-08', target: 'NODE-09', label: 'Live-Sync', color: '#06B6D4' }
    ];

    edgeDefs.forEach((def) => {
      if (nodes.some((n) => n.id === def.source) && nodes.some((n) => n.id === def.target)) {
        flowEdges.push({
          id: def.id,
          source: def.source,
          target: def.target,
          type: 'smoothstep',
          animated: def.animated,
          label: def.label,
          labelStyle: { fill: '#BAE6FD', fontSize: 10, fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.04em' },
          labelBgStyle: { fill: '#080E1B', fillOpacity: 0.95, rx: 6, ry: 6 },
          labelBgPadding: [6, 3],
          style: { stroke: def.color || '#38BDF8', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: def.color || '#38BDF8'
          }
        });
      }
    });

    return { flowNodes, flowEdges };
  }

  // 3. GENERIC TOPOLOGICAL LAYOUT FOR ANY ARBITRARY GRAPH
  let mainCol = 0;
  const nodeColMap: Record<string, number> = {};

  nodes.forEach((node) => {
    let x = 40;
    let y = 200;

    if (isHorizontal) {
      if (node.branch === 'success') {
        y = 60;
        x = 40 + mainCol * 340;
      } else if (node.branch === 'uncertain') {
        y = 350;
        x = 40 + mainCol * 340;
      } else if (node.status === 'QUESTION') {
        y = 520;
        x = 40 + Math.max(0, mainCol - 1) * 340;
      } else {
        y = 200;
        x = 40 + mainCol * 340;
        mainCol++;
      }
    } else {
      // Vertical orientation
      if (node.branch === 'success') {
        x = 60;
      } else if (node.branch === 'uncertain') {
        x = 420;
      } else {
        x = 240;
      }
      y = 40 + mainCol * 220;
      mainCol++;
    }

    nodeColMap[node.id] = mainCol;

    flowNodes.push({
      id: node.id,
      type: 'eventStorming',
      position: { x, y },
      data: {
        node,
        isSelected: node.id === selectedNodeId,
        filterStatus,
        layoutOrientation: orientation,
        stepIndex: flowNodes.length + 1,
        onSelectNode,
        onStatusChange
      }
    });
  });

  // Connect sequential and branching edges
  for (let i = 0; i < nodes.length - 1; i++) {
    const current = nodes[i];
    const next = nodes[i + 1];

    const isBranching = next.branch === 'uncertain' || next.branch === 'success';
    const edgeColor =
      next.branch === 'success'
        ? '#10B981'
        : next.branch === 'uncertain'
        ? '#F59E0B'
        : next.status === 'QUESTION'
        ? '#F43F5E'
        : '#64748B';

    flowEdges.push({
      id: `e-${current.id}-${next.id}`,
      source: current.id,
      target: next.id,
      type: 'smoothstep',
      animated: isBranching || next.status === 'QUESTION',
      label: next.branch === 'uncertain' ? 'Pfad B: unsicher' : next.branch === 'success' ? 'Pfad A: sicher' : undefined,
      labelStyle: { fill: '#BAE6FD', fontSize: 10, fontFamily: 'monospace', fontWeight: 600 },
      labelBgStyle: { fill: '#080E1B', fillOpacity: 0.95, rx: 6, ry: 6 },
      labelBgPadding: [6, 3],
      style: { stroke: edgeColor, strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 14,
        height: 14,
        color: edgeColor
      }
    });
  }

  return { flowNodes, flowEdges };
}
