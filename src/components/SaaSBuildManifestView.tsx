import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Server,
  Activity,
  ArrowRight,
  Terminal,
  Check
} from 'lucide-react';
import { SaaSBuildManifest } from '../data/workstationData';

interface SaaSBuildManifestViewProps {
  manifest: SaaSBuildManifest;
  onStartBuildPipeline?: () => void;
}

export const SaaSBuildManifestView: React.FC<SaaSBuildManifestViewProps> = ({
  manifest,
  onStartBuildPipeline
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'capabilities' | 'cost' | 'steps' | 'acceptance'>('overview');
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#111723] overflow-hidden">
      {/* Manifest Header */}
      <div className="p-6 border-b border-slate-800 bg-[#0B0F17] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono text-emerald-400 font-semibold tracking-wider flex items-center gap-2">
            <span>SAAS BUILD MANIFEST</span>
            <span>·</span>
            <span className="text-slate-400">ID: {manifest.requestId}</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
            {manifest.productName}
          </h2>
          <div className="text-xs text-slate-400 mt-0.5">
            Typ: {manifest.productType}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyJson}
            className="px-3 py-1.5 rounded text-xs font-mono border border-slate-800 bg-[#111723] hover:text-white text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopiert' : 'JSON Manifest'}</span>
          </button>

          {onStartBuildPipeline && (
            <button
              type="button"
              onClick={onStartBuildPipeline}
              className="px-4 py-1.5 rounded text-xs font-mono font-bold bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-colors cursor-pointer"
            >
              In Pipeline schicken →
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-2.5 bg-[#0D1420] border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-mono">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'architecture', label: 'Architecture' },
          { id: 'capabilities', label: 'Capabilities' },
          { id: 'cost', label: 'Cost' },
          { id: 'steps', label: 'Build Steps' },
          { id: 'acceptance', label: 'Acceptance' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-[#0B0F17] border border-slate-800">
                <span className="font-mono text-emerald-400 font-semibold block mb-2">
                  REUSE (VORHANDEN)
                </span>
                <ul className="space-y-1.5 text-slate-300 font-mono">
                  {(manifest.reusedCapabilities || []).map((c, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-[#0B0F17] border border-slate-800">
                <span className="font-mono text-amber-400 font-semibold block mb-2">
                  NEW (RESTAUFWAND)
                </span>
                <ul className="space-y-1.5 text-slate-300 font-mono">
                  {(manifest.newWorkRequired || []).map((w, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-amber-400">▲</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-[#0B0F17] border border-slate-800">
                <span className="font-mono text-cyan-400 font-semibold block mb-2">
                  DEPLOYMENT TARGET
                </span>
                <ul className="space-y-1.5 text-slate-300 font-mono">
                  {(manifest.deployment || []).map((d, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-cyan-400">●</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0B0F17] border border-slate-800">
              <span className="font-mono text-slate-400 font-semibold block mb-2">
                MODULE &amp; SUBSYSTEME
              </span>
              <div className="flex flex-wrap gap-2">
                {(manifest.modules || []).map((m, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[11px]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-3 text-xs font-mono">
            {[
              { label: 'Frontend', values: manifest.frontend },
              { label: 'Backend', values: manifest.backend },
              { label: 'Database', values: manifest.database },
              { label: 'Auth', values: manifest.auth },
              { label: 'Storage', values: manifest.storage },
              { label: 'Automation', values: manifest.automation },
              { label: 'Integrations', values: manifest.integrations },
              { label: 'Monitoring', values: manifest.monitoring }
            ].map((layer) => (
              <div
                key={layer.label}
                className="p-3.5 rounded-lg bg-[#0B0F17] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <span className="text-slate-400 w-32 shrink-0">{layer.label}</span>
                <span className="text-slate-200 text-left sm:text-right">
                  {Array.isArray(layer.values) ? layer.values.join(' · ') : String(layer.values || '')}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'capabilities' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-lg bg-[#0B0F17] border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-2">
                Wiederverwendete Registry-Objekt-Referenzen:
              </span>
              <div className="flex flex-wrap gap-2 text-slate-300">
                {(manifest.reusedObjectIds || []).map((objId) => (
                  <span key={objId} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700">
                    {objId}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cost' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-5 rounded-lg bg-[#0B0F17] border border-slate-800 grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block">Monatliche Betriebskosten:</span>
                <span className="text-xl font-bold text-white tabular-nums">
                  {(manifest.estimatedMonthlyCost || 0).toFixed(2)} €
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Kundenpreis:</span>
                <span className="text-xl font-bold text-emerald-400 tabular-nums">
                  {(manifest.targetMonthlyPrice || 0).toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="space-y-2 text-xs">
            {(manifest.buildSteps || []).map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#0B0F17] border border-slate-800 flex items-center gap-3 font-mono"
              >
                <span className="w-5 h-5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-center leading-5 text-[11px] shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-200">{step}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'acceptance' && (
          <div className="space-y-2 text-xs">
            {(manifest.acceptanceCriteria || []).map((crit, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#0B0F17] border border-slate-800 flex items-center gap-3 font-mono"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">{crit}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
