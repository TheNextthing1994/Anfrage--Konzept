import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  UserCheck, Zap, BellRing, GitBranch, Layers, AlertTriangle,
  HelpCircle, CheckCircle2, Cpu, ArrowUpRight, Quote
} from 'lucide-react';
import { ProcessNodeDetail, ProcessNodeStatus, ProcessNodeType } from '../data/workstationData';

import { useLanguage } from '../i18n/LanguageContext';

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

const typeIconMap = {
  ACTOR: { icon: UserCheck, color: '#e6bd82' },
  COMMAND: { icon: Zap, color: '#a7d8f5' },
  EVENT: { icon: BellRing, color: '#e7ad87' },
  POLICY: { icon: GitBranch, color: '#c4b4e8' },
  READ_MODEL: { icon: Layers, color: '#94d4bc' },
  EXCEPTION: { icon: AlertTriangle, color: '#e5a4b4' },
  SYSTEM: { icon: Cpu, color: '#b7c9df' }
} as const;

export const EventStormingNode: React.FC<NodeProps> = memo((props) => {
  const { t } = useLanguage();
  const data = props.data as unknown as EventStormingNodeData;
  const { node } = data;
  const isSelected = props.selected || data.isSelected;
  const isHorizontal = data.layoutOrientation !== 'vertical';
  const isDimmed = data.filterStatus && data.filterStatus !== 'ALL' && node.status !== data.filterStatus;

  const typeLabelMap: Record<ProcessNodeType, string> = {
    ACTOR: t('typeActor'),
    COMMAND: t('typeCommand'),
    EVENT: t('typeEvent'),
    POLICY: t('typePolicy'),
    READ_MODEL: t('typeReadModel'),
    EXCEPTION: t('typeException'),
    SYSTEM: t('typeSystem')
  };

  const statusLabelMap: Record<ProcessNodeStatus, { label: string; icon: typeof Cpu }> = {
    CONFIRMED: { label: t('filterConfirmed'), icon: CheckCircle2 },
    INFERRED: { label: t('filterInferred'), icon: Cpu },
    UNCLEAR: { label: t('filterUnclear'), icon: HelpCircle },
    QUESTION: { label: t('typePolicy') === 'Regel' ? 'Frage' : 'Вопрос', icon: HelpCircle }
  };

  const typeConfig = typeIconMap[node.type];
  const typeLabel = typeLabelMap[node.type];
  const status = statusLabelMap[node.status];
  const Icon = typeConfig.icon;
  const StatusIcon = status.icon;


  return (
    <div
      className={['dt-process-node', isSelected && 'is-selected', isDimmed && 'is-dimmed'].filter(Boolean).join(' ')}
      style={{ '--dt-node-accent': typeConfig.color } as React.CSSProperties}
      title={[node.title, node.rationale].join('\n')}
    >
      <Handle type="target" position={isHorizontal ? Position.Left : Position.Top} className="dt-node-handle" />
      <Handle type="source" position={isHorizontal ? Position.Right : Position.Bottom} className="dt-node-handle" />

      <div className="dt-node-header">
        <span className="dt-node-type"><Icon size={14} strokeWidth={1.7} />{typeLabel}</span>
        <span className="dt-status" data-status={node.status} title={node.statusReason || status.label}>
          <StatusIcon size={12} strokeWidth={1.8} />{status.label}
        </span>
      </div>

      <div className="dt-node-body">
        <h4 className="dt-node-title">{node.title}</h4>
        {node.actorOrSubject && <p className="dt-node-subject">{node.actorOrSubject}</p>}

        <div className="dt-node-evidence">
          {node.sourceQuote && <Quote size={12} strokeWidth={1.8} aria-hidden="true" />}
          <p>{node.sourceQuote || node.rationale}</p>
        </div>

        <div className="dt-node-footer">
          <span className="dt-node-id">{node.id}</span>
          {node.branch === 'success' && <span className="dt-node-branch" data-branch="success">{t('branchDirect')}</span>}
          {node.branch === 'uncertain' && <span className="dt-node-branch" data-branch="uncertain">{t('branchReviewInbox')}</span>}
          <span className="dt-node-details" title={node.linkedUiComponent ? 'UI: ' + node.linkedUiComponent : t('inspectorOpenInInspector')}>
            {t('details')} <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
});

EventStormingNode.displayName = 'EventStormingNode';
