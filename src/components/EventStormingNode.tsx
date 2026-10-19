import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  UserCheck,
  Zap,
  BellRing,
  GitBranch,
  Layers,
  AlertTriangle,
  HelpCircle,
  Eye,
  CheckCircle2,
  Cpu,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { ProcessNodeDetail, ProcessNodeStatus, ProcessNodeType } from '../data/workstationData';

export interface EventStormingNodeData extends Record<string, unknown> {
  node: ProcessNodeDetail;
  isSelected?: boolean;
  filterStatus?: ProcessNodeStatus | 'ALL';
  layoutOrientation?: 'horizontal' | 'vertical';
  stepIndex?: number;
  onSelectNode?: (nodeId: string) => void;
  onStatusChange?: (nodeId: string, status: ProcessNodeStatus) => void;
  [key: string]: unknown;
}

export const EventStormingNode: React.FC<NodeProps> = memo((props) => {
  const data = props.data as unknown as EventStormingNodeData;
  const node = data.node;
  const isSelected = props.selected || data.isSelected;
  const isHorizontal = data.layoutOrientation !== 'vertical';

  const isDimmed =
    data.filterStatus &&
    data.filterStatus !== 'ALL' &&
    node.status !== data.filterStatus;

  const getTypeTheme = (type: ProcessNodeType) => {
    switch (type) {
      case 'ACTOR':
        return {
          title: 'ACTOR / ROLLE',
          icon: UserCheck,
          headerBg: 'bg-amber-500/15 border-b border-amber-500/25',
          headerText: 'text-amber-300',
          accentBorder: 'border-amber-500/30 hover:border-amber-400/60',
          selectedRing: 'ring-cyan-400 border-cyan-400/80',
          tagBg: 'bg-amber-500/15 text-amber-300',
          glow: 'shadow-amber-500/10'
        };
      case 'COMMAND':
        return {
          title: 'COMMAND / AKTION',
          icon: Zap,
          headerBg: 'bg-cyan-500/15 border-b border-cyan-500/25',
          headerText: 'text-cyan-300',
          accentBorder: 'border-cyan-500/30 hover:border-cyan-400/60',
          selectedRing: 'ring-cyan-400 border-cyan-400/80',
          tagBg: 'bg-cyan-500/15 text-cyan-300',
          glow: 'shadow-cyan-500/10'
        };
      case 'EVENT':
        return {
          title: 'DOMAIN EVENT',
          icon: BellRing,
          headerBg: 'bg-orange-500/15 border-b border-orange-500/25',
          headerText: 'text-orange-300',
          accentBorder: 'border-orange-500/30 hover:border-orange-400/60',
          selectedRing: 'ring-cyan-400 border-cyan-400/80',
          tagBg: 'bg-orange-500/15 text-orange-300',
          glow: 'shadow-orange-500/10'
        };
      case 'POLICY':
        return {
          title: 'POLICY / REGELWERK',
          icon: GitBranch,
          headerBg: 'bg-purple-500/15 border-b border-purple-500/25',
          headerText: 'text-purple-300',
          accentBorder: 'border-purple-500/30 hover:border-purple-400/60',
          selectedRing: 'ring-cyan-400 border-cyan-400/80',
          tagBg: 'bg-purple-500/15 text-purple-300',
          glow: 'shadow-purple-500/10'
        };
      case 'READ_MODEL':
        return {
          title: 'READ MODEL / SICHT',
          icon: Layers,
          headerBg: 'bg-emerald-500/15 border-b border-emerald-500/25',
          headerText: 'text-emerald-300',
          accentBorder: 'border-emerald-500/30 hover:border-emerald-400/60',
          selectedRing: 'ring-cyan-400 border-cyan-400/80',
          tagBg: 'bg-emerald-500/15 text-emerald-300',
          glow: 'shadow-emerald-500/10'
        };
      case 'EXCEPTION':
        return {
          title: 'HOT SPOT / EXCEPTION',
          icon: AlertTriangle,
          headerBg: 'bg-rose-500/20 border-b border-rose-500/30',
          headerText: 'text-rose-300',
          accentBorder: 'border-rose-500/40 hover:border-rose-400/70',
          selectedRing: 'ring-cyan-400 border-cyan-400/80',
          tagBg: 'bg-rose-500/15 text-rose-300',
          glow: 'shadow-rose-500/10'
        };
      default:
        return {
          title: 'PROZESS-SCHRITT',
          icon: Cpu,
          headerBg: 'bg-slate-800/50 border-b border-slate-700/60',
          headerText: 'text-slate-300',
          accentBorder: 'border-slate-700/60 hover:border-cyan-500/40',
          selectedRing: 'ring-cyan-400 border-cyan-400/80',
          tagBg: 'bg-slate-800 text-slate-300',
          glow: 'shadow-slate-500/10'
        };
    }
  };

  const getStatusBadge = (status: ProcessNodeStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return {
          label: 'CONFIRMED',
          icon: CheckCircle2,
          classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
          dot: 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
        };
      case 'INFERRED':
        return {
          label: 'INFERRED',
          icon: Cpu,
          classes: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
          dot: 'bg-cyan-300 shadow-[0_0_6px_#22d3ee]'
        };
      case 'UNCLEAR':
        return {
          label: 'UNCLEAR',
          icon: HelpCircle,
          classes: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
          dot: 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
        };
      case 'QUESTION':
        return {
          label: 'QUESTION',
          icon: AlertTriangle,
          classes: 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
          dot: 'bg-rose-400 animate-pulse shadow-[0_0_8px_#f43f5e]'
        };
    }
  };

  const theme = getTypeTheme(node.type);
  const statusInfo = getStatusBadge(node.status);
  const Icon = theme.icon;

  return (
    <div
      onClick={() => data.onSelectNode && data.onSelectNode(node.id)}
      className={`group relative w-72 rounded-xl backdrop-blur-xl bg-[#090F1B]/90 border text-left transition-all duration-300 select-none cursor-pointer ${
        theme.accentBorder
      } ${
        isSelected
          ? `ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#070B12] shadow-[0_0_32px_rgba(6,182,212,0.35),0_20px_40px_rgba(0,0,0,0.85)] scale-[1.02] border-cyan-400/80`
          : 'shadow-[0_12px_32px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.12)]'
      } ${isDimmed ? 'opacity-25 grayscale-[60%]' : 'opacity-100'}`}
    >
      {/* React Flow Handles - Neon Cyan with Ice-blue glow */}
      {isHorizontal ? (
        <>
          <Handle
            type="target"
            position={Position.Left}
            className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-[#070B12] hover:!bg-white !-left-1.5 transition-all !shadow-[0_0_8px_#22d3ee]"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-[#070B12] hover:!bg-white !-right-1.5 transition-all !shadow-[0_0_8px_#22d3ee]"
          />
        </>
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Top}
            className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-[#070B12] hover:!bg-white !-top-1.5 transition-all !shadow-[0_0_8px_#22d3ee]"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-[#070B12] hover:!bg-white !-bottom-1.5 transition-all !shadow-[0_0_8px_#22d3ee]"
          />
        </>
      )}

      {/* Top Header: Event Storming Type & Status Pill */}
      <div className={`px-3 py-2 rounded-t-xl flex items-center justify-between gap-2 ${theme.headerBg}`}>
        <div className="flex items-center gap-1.5">
          <Icon className={`w-3.5 h-3.5 ${theme.headerText}`} />
          <span className={`text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase ${theme.headerText}`}>
            {theme.title}
          </span>
        </div>

        {/* Status Pill */}
        <div
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border uppercase tracking-wider ${statusInfo.classes}`}
          title={`Status: ${statusInfo.label} (${node.statusReason || ''})`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
          <span>{statusInfo.label}</span>
        </div>
      </div>

      {/* Body: Node Title & Subject */}
      <div className="p-3.5 space-y-2.5">
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span className="text-cyan-300/80 font-bold tracking-wide">{node.id}</span>
            {node.branch === 'success' && (
              <span className="text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 text-[9px] tracking-wider uppercase font-semibold">
                Pfad: Sicher (Direkt)
              </span>
            )}
            {node.branch === 'uncertain' && (
              <span className="text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 text-[9px] tracking-wider uppercase font-semibold">
                Pfad: Unsicher (Prüffach)
              </span>
            )}
          </div>
          <h4 className="text-xs font-bold text-slate-100 leading-snug tracking-tight">
            {node.title}
          </h4>
          {node.actorOrSubject && (
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="text-slate-500 font-mono text-[10px] uppercase">Akteur:</span>
              <span className="text-cyan-200 font-medium">{node.actorOrSubject}</span>
            </p>
          )}
        </div>

        {/* Rationale / Intent */}
        <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2 bg-[#060A13]/85 p-2 rounded-lg border border-slate-800/90 shadow-inner">
          {node.rationale}
        </p>

        {/* Source Quote Mention (Bidirectional trace clue) */}
        {node.sourceQuote && (
          <div className="text-[10px] truncate flex items-center gap-1 text-cyan-300/90 font-mono bg-cyan-950/20 px-2 py-1 rounded border border-cyan-800/30">
            <span className="text-cyan-400 font-bold">“</span>
            <span className="italic truncate text-slate-300">{node.sourceQuote}</span>
          </div>
        )}

        {/* Footer info: Failure Handling or Linked UI */}
        {(node.failureHandling || node.linkedUiComponent) && (
          <div className="pt-2 border-t border-slate-800/90 flex items-center justify-between text-[10px] font-mono">
            {node.linkedUiComponent ? (
              <span className="flex items-center gap-1 text-cyan-300 truncate max-w-[170px]">
                <Eye className="w-3 h-3 shrink-0 text-cyan-400" />
                <span className="truncate">UI: {node.linkedUiComponent}</span>
              </span>
            ) : (
              <span className="text-slate-500 truncate">
                {node.authorizedRoles || 'Standard Automation'}
              </span>
            )}
            <span className="text-cyan-400/80 group-hover:text-cyan-200 transition-colors flex items-center gap-0.5">
              Details <span className="text-cyan-400">→</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

EventStormingNode.displayName = 'EventStormingNode';
