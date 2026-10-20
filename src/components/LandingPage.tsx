import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronRight,
  MessageSquareQuote
} from 'lucide-react';
import {
  StandardizedObject,
  FOUNDRY_CAPABILITIES,
  ACTIVE_INITIATIVES,
  WorkstationSection
} from '../data/workstationData';
import { useLanguage, LanguageToggle } from '../i18n/LanguageContext';

interface LandingPageProps {
  objects: StandardizedObject[];
  onOpenWorkstation: (initialSection?: WorkstationSection, selectObjectId?: string) => void;
}

type PreviewTab = 'inbox' | 'requests' | 'review' | 'registry' | 'portfolio' | 'foundry' | 'active';

export const LandingPage: React.FC<LandingPageProps> = ({
  objects,
  onOpenWorkstation
}) => {
  const { t, language } = useLanguage();
  const [heroTab, setHeroTab] = useState<PreviewTab>('requests');
  const [selectedStandardObjId, setSelectedStandardObjId] = useState<string>('OBJ-15K-02');
  const [activePipelineStage, setActivePipelineStage] = useState<number>(4);

  const selectedStandardObj =
    objects.find((o) => o.id === selectedStandardObjId) || objects[1];

  const pipelineStages = [
    {
      step: '01',
      label: 'Input / Request',
      stateLabel: 'Kundenproblem',
      detail:
        'Kundenanfrage (z. B. WhatsApp-Lieferschein-Chaos im Handwerk) oder roher Signal-Input landet ungefiltert in der D.T. Workstation.',
      example: '„Monteure schicken Lieferscheine über WhatsApp — ich brauche ein Dashboard mit Vollständigkeitsampel.“'
    },
    {
      step: '02',
      label: 'Analyse',
      stateLabel: 'Kontext-Prüfung',
      detail:
        'D.T. isoliert Kernproblem, Zielpersona, reale Kostenstruktur, Self-Hosting-Fähigkeit und DSGVO-Leitplanken.',
      example: 'Prüfung: DSGVO-Speicherung in Deutschland, Budget 250 € / Mo'
    },
    {
      step: '03',
      label: 'Reuse Foundry',
      stateLabel: 'Komposition vor Neucode',
      detail:
        'Das System matcht bestehende Foundry Capabilities (OCR, Auth, Storage, Notifications, Dashboard) und OSS-Defaults (PocketBase/Supabase).',
      example: 'Reuse-Quote: 88% — OCR-Pipeline & PocketBase sofort wiederverwendet'
    },
    {
      step: '04',
      label: 'Missing Parts',
      stateLabel: 'Spezifische Hooks',
      detail:
        'Nur die echten Lücken (z. B. WhatsApp Inbound Webhook Listener, 3.5h) werden als Custom Logic definiert.',
      example: 'Aufwand: 5.5h Custom Code statt 6 Wochen Projektstart von Null'
    },
    {
      step: '05',
      label: 'Cost & Manifest',
      stateLabel: 'Wirtschaftlichkeit',
      detail:
        'Automatische Kalkulation der Monatskosten (z. B. 9,30 €) gegen Zielpreis (180 €) → 94,8% Bruttomarge für den Betreiber.',
      example: 'Deckungsbeitrag: 170,70 € monatlich pro Kunde bei 4 € Serverkosten'
    },
    {
      step: '06',
      label: 'Approval',
      stateLabel: 'Bauplan freigeben',
      detail:
        'Der Betreiber gibt das SaaS Build Manifest frei. Alle Schnittstellen und Datenbank-Schemas sind normiert.',
      example: 'Status: Approved · Stack: PocketBase + Surya OCR + shadcn/ui'
    },
    {
      step: '07',
      label: 'SaaS Build',
      stateLabel: 'Materialisierung',
      detail:
        'Schlüsselfertige Bereitstellung in 2–3 Tagen statt Monaten dank gehärteter Bausteine.',
      example: 'Lieferzeit: 3 Tage bis zum produktiven Pilotbetrieb'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F1F5F9]">
      {/* Top Navigation Bar — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-40 h-16 border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1380px] items-center justify-between px-6">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="font-display text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap"
          >
            D.T. Workstation
          </a>

          {/* Zone 2: 5 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a
              href="#systematik"
              className="hover:text-slate-100 hover:underline underline-offset-8 decoration-emerald-500/70 transition-colors whitespace-nowrap"
            >
              {t('landingSystematic')}
            </a>
            <a
              href="#objekt-standard"
              className="hover:text-slate-100 hover:underline underline-offset-8 decoration-emerald-500/70 transition-colors whitespace-nowrap"
            >
              {t('landingStandardObj')}
            </a>
            <a
              href="#reopen-trigger"
              className="hover:text-slate-100 hover:underline underline-offset-8 decoration-emerald-500/70 transition-colors whitespace-nowrap"
            >
              {t('landingReopen')}
            </a>
            <a
              href="#zielgruppe"
              className="hover:text-slate-100 hover:underline underline-offset-8 decoration-emerald-500/70 transition-colors whitespace-nowrap"
            >
              {t('landingForBuilders')}
            </a>
            <button
              type="button"
              onClick={() => onOpenWorkstation('requests')}
              className="hover:text-slate-100 hover:underline underline-offset-8 decoration-emerald-500/70 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <span className="text-emerald-400">●</span>
              <span>{t('landingClientRequests')}</span>
            </button>
          </nav>

          {/* Zone 3: Primary actions & Language toggle */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => onOpenWorkstation('registry', 'OBJ-15K-01')}
              className="hidden sm:inline-flex items-center px-3.5 py-2 text-xs font-medium text-slate-300 border border-slate-800 rounded-lg hover:bg-slate-900 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              {t('landingViewWorkstation')}
            </button>
            <button
              type="button"
              onClick={() => onOpenWorkstation('requests')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>{t('landingStartDemo')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* BEREICH 1 — HERO */}
      <section id="top" className="relative pt-14 pb-24 md:pt-20 md:pb-28 border-b border-slate-800/80">
        <div className="mx-auto max-w-[1380px] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
            {/* Left Column: Dominant Typographic Statement */}
            <div className="lg:col-span-5 pt-2">
              <div className="text-xs font-mono text-emerald-400 tracking-wide mb-5">
                Personal Foundry · Customer Request → SaaS Composition Plane
              </div>

              <h1
                className="font-display text-4xl sm:text-5xl xl:text-[56px] font-bold tracking-tight text-white leading-[1.06] mb-6"
                style={{ textWrap: 'balance' }}
              >
                Simpel. Gratis. Autark.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-[54ch]">
                Baue dir eine Plattform, die Wissen, Tools, OSS-Repos und
                Möglichkeiten einsammelt, strukturiert, bewertet und unter den
                richtigen Bedingungen wieder aktiviert — oder Kundenanfragen direkt in schlüsselfertige SaaS-Baupläne komponiert.
              </p>

              {/* 2 CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 mb-10">
                <button
                  type="button"
                  onClick={() => onOpenWorkstation('requests')}
                  className="inline-flex items-center gap-2.5 px-5 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Kostprobe starten</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenWorkstation('overview')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-200 bg-[#111723] border border-slate-800 rounded-lg hover:border-slate-700 hover:bg-slate-900 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Workstation ansehen</span>
                </button>
              </div>

              {/* Unboxed Metadata Discipline */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-6">
                <div>
                  <div className="font-mono text-xl font-semibold text-white tabular-nums">
                    88%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Wiederverwendung erprobter Foundry-Bausteine
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xl font-semibold text-white tabular-nums">
                    &lt; 10 €
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Monatliche Betriebskosten pro Kunden-Instanz
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xl font-semibold text-emerald-400 tabular-nums">
                    3 Tage
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Von der Kundenanfrage zum fertigen Piloten
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Product Preview / App-Mockup */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-slate-800 bg-[#111723] overflow-hidden">
                {/* Preview Window Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-800 bg-[#0D131F]">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-medium text-slate-300">
                      D.T. Control Plane · Live-Vorschau
                    </span>
                    <span className="text-slate-600" aria-hidden="true">·</span>
                    <span className="text-xs font-mono text-emerald-400">
                      Foundry Composer aktiv
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenWorkstation(heroTab)}
                    className="text-xs font-mono text-slate-300 hover:text-emerald-400 inline-flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>In Vollbild-Workstation öffnen</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Interactive Segmented Bar */}
                <div className="px-4 py-2.5 border-b border-slate-800 bg-[#0B0F17]/60 flex items-center gap-1.5 overflow-x-auto">
                  {(
                    [
                      { id: 'requests', label: 'Kundenanfragen (Neu)', count: 2 },
                      { id: 'inbox', label: 'Input Inbox', count: 5 },
                      { id: 'review', label: 'Review Queue', count: 3 },
                      { id: 'registry', label: 'Registry', count: 4 },
                      { id: 'portfolio', label: 'Portfolio', count: 3 },
                      { id: 'foundry', label: 'Foundry', count: 8 },
                      { id: 'active', label: 'Active', count: 3 }
                    ] as { id: PreviewTab; label: string; count: number }[]
                  ).map((tab) => {
                    const isActive = heroTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setHeroTab(tab.id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className="font-mono text-[11px] opacity-75 tabular-nums">
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Preview Body Content based on active tab */}
                <div className="p-5">
                  {heroTab === 'requests' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-emerald-400">
                          SaaS Composition: Kundenproblem → Komponierter Bauplan
                        </span>
                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                          2 Entwürfe
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div
                          onClick={() => onOpenWorkstation('requests')}
                          className="p-3.5 rounded-lg border border-slate-800 bg-[#0B0F17]/80 hover:border-emerald-500/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-sm font-semibold text-white">
                              Weber Elektroanlagen GmbH · Lieferschein-Vault
                            </span>
                            <span className="text-xs font-mono text-emerald-400">
                              Proposal ready · 88% Reuse
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 italic mb-2">
                            „Monteure schicken Lieferscheine über WhatsApp. Wir brauchen automatische Projektzuordnung und Ampel-Dashboard.“
                          </p>
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                            <span>Stack: PocketBase + Surya OCR + shadcn/ui</span>
                            <span className="text-emerald-400 font-semibold">Kosten: 9,30 € · Preis: 180 €/Mo</span>
                          </div>
                        </div>

                        <div
                          onClick={() => onOpenWorkstation('requests')}
                          className="p-3.5 rounded-lg border border-slate-800 bg-[#0B0F17]/80 hover:border-emerald-500/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-sm font-semibold text-white">
                              Praxis Lindner &amp; Partner · PraxisVoice Triage
                            </span>
                            <span className="text-xs font-mono text-emerald-400">
                              Approved · 92% Reuse
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 italic mb-2">
                            „Telefon montags von 8 bis 11 Uhr überlastet durch Rezeptbestellungen. Entlastung durch Triage-Agent.“
                          </p>
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                            <span>Reaktiviertes 15K-Objekt: OBJ-15K-02</span>
                            <span className="text-emerald-400 font-semibold">Kosten: 22,70 € · Preis: 220 €/Mo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {heroTab === 'inbox' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-slate-400">
                          Input Inbox · Rohe Signale vor Standardisierung
                        </span>
                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                          5 Einträge
                        </span>
                      </div>
                      <div className="divide-y divide-slate-800/80 border-t border-b border-slate-800/80">
                        {[
                          {
                            kind: 'GitHub Repo',
                            name: 'PocketBase',
                            note: 'Single-Binary Go Backend mit SQLite, Auth & Realtime',
                            state: 'Approved → Registry',
                            objId: 'OBJ-15K-01'
                          },
                          {
                            kind: 'Tool',
                            name: 'Convex',
                            note: 'Reaktives TypeScript-Backend mit automatischer State-Synchronisation',
                            state: 'Review pending',
                            objId: 'OBJ-15K-03'
                          },
                          {
                            kind: 'Artikel',
                            name: 'Product Foundry',
                            note: 'Architektur-Trennung zwischen gehärteten Capabilities und Produkt-Hüllen',
                            state: 'Approved candidate',
                            objId: 'OBJ-15K-04'
                          },
                          {
                            kind: 'Idee',
                            name: 'Voice-Rezeptionist für kleine Praxen',
                            note: 'Asynchroner Telefon-Triage-Agent für Facharztpraxen',
                            state: 'Armed · 15K Object',
                            objId: 'OBJ-15K-02'
                          },
                          {
                            kind: 'Workflow',
                            name: 'PDF → OCR → Review → Export',
                            note: 'Deterministische Beleg-Extraktion mit Konfidenz-Schwellenwert',
                            state: 'Needs clarification',
                            objId: 'OBJ-15K-05'
                          }
                        ].map((item) => (
                          <div
                            key={item.name}
                            onClick={() => onOpenWorkstation('inbox', item.objId)}
                            className="py-3 flex items-center justify-between gap-4 hover:bg-slate-800/30 px-2 -mx-2 rounded transition-colors cursor-pointer"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                                <span className="text-emerald-400">{item.kind}</span>
                                <span>·</span>
                                <span className="text-slate-200 font-sans font-semibold text-sm truncate">
                                  {item.name}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 truncate mt-0.5">
                                {item.note}
                              </p>
                            </div>
                            <span className="text-xs font-mono text-slate-300 whitespace-nowrap shrink-0">
                              {item.state}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {heroTab === 'review' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-slate-400">
                          Review Queue · Strukturierung &amp; Architektur-Entscheidung
                        </span>
                        <span className="text-xs font-mono text-amber-400 tabular-nums">
                          3 offene Entscheidungen
                        </span>
                      </div>
                      <div className="space-y-3">
                        {[
                          {
                            title: 'Convex (Tool Evaluation)',
                            status: 'Review pending',
                            question: 'Erfüllt das Docker-Self-Hosting unsere strikten Autarkie-Anforderungen?',
                            objId: 'OBJ-15K-03'
                          },
                          {
                            title: 'PDF → OCR → Review → Export',
                            status: 'Needs clarification',
                            question: 'Lokales Surya-OCR auf CPU-Worker vs. API-Fallback für Handschrift-Notizen?',
                            objId: 'OBJ-15K-05'
                          },
                          {
                            title: 'Product Foundry Methodology',
                            status: 'Approved candidate',
                            question: 'Bereit zur Übernahme als verbindlicher Standard für alle neuen Initiativen.',
                            objId: 'OBJ-15K-04'
                          }
                        ].map((row) => (
                          <div
                            key={row.title}
                            onClick={() => onOpenWorkstation('review', row.objId)}
                            className="p-3.5 rounded-lg border border-slate-800 bg-[#0B0F17]/70 hover:border-slate-700 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-sm font-semibold text-white">
                                {row.title}
                              </span>
                              <span className="text-xs font-mono text-amber-400 whitespace-nowrap">
                                {row.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">{row.question}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {heroTab === 'registry' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-slate-400">
                          Approved Registry · Bestätigte System-Defaults
                        </span>
                        <span className="text-xs font-mono text-emerald-400">
                          Sofort einsatzbereit
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          {
                            name: 'PocketBase',
                            role: 'Backend Small',
                            meta: 'Go + SQLite · 0 € · Single Binary',
                            next: 'Compare against Supabase default',
                            objId: 'OBJ-15K-01'
                          },
                          {
                            name: 'Supabase',
                            role: 'Multi-tenant Default',
                            meta: 'PostgreSQL + RLS · pgvector ready',
                            next: 'Produktiver Kern in Baustellen-MVP',
                            objId: 'OBJ-15K-06'
                          },
                          {
                            name: 'Traccar',
                            role: 'GPS Evidence Layer',
                            meta: 'Self-Hosted Telemetry · Apache-2.0',
                            next: 'Geofence-Webhook in Sprint 4',
                            objId: 'OBJ-15K-07'
                          },
                          {
                            name: 'shadcn/ui',
                            role: 'UI default',
                            meta: 'Radix + Tailwind v4 · Voller Quellcode',
                            next: 'Standard für alle Frontends',
                            objId: 'OBJ-15K-08'
                          }
                        ].map((card) => (
                          <div
                            key={card.name}
                            onClick={() => onOpenWorkstation('registry', card.objId)}
                            className="p-3.5 rounded-lg border border-slate-800 bg-[#0B0F17]/80 hover:border-emerald-500/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-white">
                                {card.name}
                              </span>
                              <span className="text-xs font-mono text-emerald-400">
                                → {card.role}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1.5 font-mono">
                              {card.meta}
                            </div>
                            <div className="text-xs text-slate-300 mt-2 pt-2 border-t border-slate-800/80">
                              Status: Approved · {card.next}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {heroTab === 'portfolio' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-slate-400">
                          Opportunity Portfolio · Geparkte &amp; Überwachte Chancen
                        </span>
                        <span className="text-xs font-mono text-cyan-400">
                          Trigger-Überwachung aktiv
                        </span>
                      </div>
                      <div className="space-y-3">
                        {[
                          {
                            title: 'Voice-Rezeptionist für kleine Praxen',
                            state: 'Armed',
                            trigger: 'Trigger: Sub-400ms EU-SIP + 3 Pilot-Praxen ohne PVS-Zwang',
                            objId: 'OBJ-15K-02'
                          },
                          {
                            title: 'Autarke Handwerker-Angebots-Engine',
                            state: 'Parked',
                            trigger: 'Trigger: 5 zahlende Kunden auf Baustellenplattform + GAEB-Stammdaten',
                            objId: 'OBJ-15K-09'
                          },
                          {
                            title: 'Lokales Regulierungs- & Normen-Radar (DIN / VOB)',
                            state: 'Reopened',
                            trigger: 'Trigger ausgelöst: Pilotkunde #2 fordert automatisches VOB-Prüfprotokoll',
                            objId: 'OBJ-15K-10'
                          }
                        ].map((item) => (
                          <div
                            key={item.title}
                            onClick={() => onOpenWorkstation('portfolio', item.objId)}
                            className="p-3.5 rounded-lg border border-slate-800 bg-[#0B0F17]/80 hover:border-slate-700 transition-colors cursor-pointer flex items-start justify-between gap-4"
                          >
                            <div>
                              <div className="text-sm font-semibold text-white">
                                {item.title}
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                {item.trigger}
                              </div>
                            </div>
                            <span className="text-xs font-mono text-emerald-400 whitespace-nowrap shrink-0">
                              {item.state}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {heroTab === 'foundry' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-slate-400">
                          Foundry Capabilities · Wiederverwendbare Plattform-Bausteine
                        </span>
                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                          8 Module
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {FOUNDRY_CAPABILITIES.map((cap) => (
                          <div
                            key={cap.id}
                            onClick={() => onOpenWorkstation('foundry', cap.linkedObjectId)}
                            className="p-3 rounded-lg border border-slate-800 bg-[#0B0F17]/80 hover:border-slate-700 transition-colors cursor-pointer"
                          >
                            <div className="text-xs font-mono text-emerald-400">
                              {cap.status}
                            </div>
                            <div className="text-sm font-semibold text-white mt-1 truncate">
                              {cap.name.split(' & ')[0]}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 mt-1 tabular-nums">
                              In {cap.usedInCount} Projekten
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {heroTab === 'active' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-slate-400">
                          Active Initiatives · Laufende Materialisierungen
                        </span>
                        <span className="text-xs font-mono text-emerald-400 tabular-nums">
                          3 Aktiv
                        </span>
                      </div>
                      <div className="space-y-3">
                        {ACTIVE_INITIATIVES.map((init) => (
                          <div
                            key={init.id}
                            onClick={() => onOpenWorkstation('active')}
                            className="p-3.5 rounded-lg border border-slate-800 bg-[#0B0F17]/80 hover:border-slate-700 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-white">
                                {init.name}
                              </span>
                              <span className="text-xs font-mono text-emerald-400 tabular-nums">
                                {init.progress}% · {init.stage}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1 font-mono">
                              {init.stackSummary}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preview Bottom Status Line */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                    <span>
                      Fokus: <strong className="text-slate-200 font-medium">Reuse first. Compose before create.</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenWorkstation(heroTab)}
                      className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                    >
                      Komplette Workstation-Ansicht öffnen →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEREICH 2 — WAS DIE PLATTFORM MACHT (5 Schritte) */}
      <section id="systematik" className="py-24 border-b border-slate-800/80">
        <div className="mx-auto max-w-[1380px] px-6">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-mono text-emerald-400 mb-3">
              01. Systemischer Prozess
            </div>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4"
              style={{ textWrap: 'balance' }}
            >
              Vom ungefilterten Impuls zur wiederverwendbaren Produkt-Fähigkeit.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Klassische Notiz-Apps werden zum digitalen Friedhof. D.T. arbeitet
              als deterministische Pipeline, die jeden Input entweder verwirft,
              als Standard-Baustein registriert oder mit klaren Reopen-Triggern
              bewaffnet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {[
              {
                num: '01.',
                title: 'Sammeln',
                desc: 'Lade Artikel, GitHub-Repos, Tools und Ideen hoch.',
                detail: 'Zentrale Inbox ohne Formatierungszwang. Links, Architektur-Notizen und Roh-Gedanken landen an einem Ort.',
                target: 'inbox' as WorkstationSection
              },
              {
                num: '02.',
                title: 'Strukturieren',
                desc: 'D.T. erzeugt nicht nur Zusammenfassungen, sondern standardisierte Objekte.',
                detail: 'Jeder Input wird in ein festes 15K-Schema mit Kostenprofil, Abhängigkeiten und Systemrolle überführt.',
                target: 'review' as WorkstationSection
              },
              {
                num: '03.',
                title: 'Bewerten',
                desc: 'Jede Möglichkeit bekommt Kontext, Status und Reopen Trigger.',
                detail: 'Klare Entscheidung: Sofort in die Registry übernehmen, klären oder mit präziser Bedingung parken.',
                target: 'registry' as WorkstationSection
              },
              {
                num: '04.',
                title: 'Reaktivieren',
                desc: 'Das System erkennt, wann eine geparkte Möglichkeit wieder relevant wird.',
                detail: 'Ändern sich Preise, APIs oder Kundenbedürfnisse, schaltet das Objekt automatisch von Parked auf Reopened.',
                target: 'portfolio' as WorkstationSection
              },
              {
                num: '05.',
                title: 'Materialisieren',
                desc: 'Aus bestätigten Bausteinen entstehen reale Fähigkeiten, Workflows oder Produkte.',
                detail: 'Kombiniere fertige Foundry-Capabilities (OCR, Auth, GPS, Billing) zu lauffähigen Initiativen.',
                target: 'foundry' as WorkstationSection
              }
            ].map((step) => (
              <div
                key={step.title}
                onClick={() => onOpenWorkstation(step.target)}
                className="group rounded-xl border border-slate-800 bg-[#111723] p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-colors cursor-pointer"
              >
                <div>
                  <div className="font-mono text-xs text-emerald-400 mb-4">
                    {step.num} Phase
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-200 font-medium leading-snug mb-3">
                    {step.desc}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.detail}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-emerald-400 transition-colors">
                  <span>In Workstation öffnen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEREICH 3 — STANDARDISIERTES OBJEKT (15K Object Inspector) */}
      <section id="objekt-standard" className="py-24 border-b border-slate-800/80 bg-[#0D121C]">
        <div className="mx-auto max-w-[1380px] px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="text-xs font-mono text-emerald-400 mb-3">
                02. Operable Datenstruktur
              </div>
              <h2
                className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4"
                style={{ textWrap: 'balance' }}
              >
                Die Plattform speichert nicht nur Informationen, sondern operable Einheiten.
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Jedes <strong className="text-slate-200 font-medium">15K Object</strong> beantwortet exakt die 15 Fragen, die ein Builder braucht, um in Sekunden über Einsatz, Kosten, Blockaden und Reaktivierung zu entscheiden.
              </p>
            </div>

            {/* Object Switcher */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#111723] p-1.5 rounded-lg border border-slate-800">
              {[
                { id: 'OBJ-15K-02', label: '15K Opportunity: Voice-Rezeptionist' },
                { id: 'OBJ-15K-01', label: 'OSS Repo: PocketBase' },
                { id: 'OBJ-15K-05', label: 'Workflow: PDF → OCR → Export' }
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedStandardObjId(preset.id)}
                  className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedStandardObjId === preset.id
                      ? 'bg-emerald-400 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 15-Field Standardized Object Panel */}
          <div className="rounded-xl border border-slate-800 bg-[#111723] overflow-hidden">
            {/* Object Header Bar */}
            <div className="px-6 py-5 border-b border-slate-800 bg-[#0B0F17]/70 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="text-emerald-400 font-semibold">15K OBJECT SCHEMA</span>
                  <span>·</span>
                  <span className="tabular-nums">ID: {selectedStandardObj.id}</span>
                  <span>·</span>
                  <span className="tabular-nums">Last reviewed: {selectedStandardObj.lastReviewed}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {selectedStandardObj.title}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[11px] font-mono text-slate-400">Current state</div>
                  <div className="text-sm font-mono font-semibold text-emerald-400">
                    {selectedStandardObj.currentState}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenWorkstation(selectedStandardObj.section, selectedStandardObj.id)}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Objekt in Workstation bearbeiten
                </button>
              </div>
            </div>

            {/* 15 Standardized Attributes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {/* Column 1: Identity & Value */}
              <div className="divide-y divide-slate-800">
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-mono text-slate-400">01 · ID</div>
                      <div className="text-sm font-mono font-semibold text-white mt-1 tabular-nums">
                        {selectedStandardObj.id}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-slate-400">02 · Type</div>
                      <div className="text-sm font-medium text-slate-200 mt-1">
                        {selectedStandardObj.type}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-xs font-mono text-slate-400">03 · Source</div>
                  <div className="text-sm font-mono text-emerald-400 mt-1 break-all">
                    {selectedStandardObj.source}
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-xs font-mono text-slate-400">04 · What it does</div>
                  <p className="text-sm text-slate-200 mt-1.5 leading-relaxed">
                    {selectedStandardObj.whatItDoes}
                  </p>
                </div>

                <div className="p-5">
                  <div className="text-xs font-mono text-slate-400">05 · Value</div>
                  <p className="text-sm text-slate-200 mt-1.5 leading-relaxed">
                    {selectedStandardObj.value}
                  </p>
                </div>

                <div className="p-5">
                  <div className="text-xs font-mono text-slate-400">06 · Where it fits</div>
                  <div className="text-sm font-mono text-slate-300 mt-1.5">
                    {selectedStandardObj.whereItFits}
                  </div>
                </div>
              </div>

              {/* Column 2: State, Blockers & Reopen Mechanism */}
              <div className="divide-y divide-slate-800">
                <div className="p-5">
                  <div className="text-xs font-mono text-slate-400">07 · Current state</div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-sm font-mono font-semibold text-emerald-400">
                      {selectedStandardObj.currentState}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Role: {selectedStandardObj.role}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-xs font-mono text-amber-400/90">08 · Why not now</div>
                  <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                    {selectedStandardObj.whyNotNow}
                  </p>
                </div>

                <div className="p-5 bg-emerald-950/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      09 · Reopen triggers
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Relevance: {selectedStandardObj.reopenRelevance}
                    </span>
                  </div>
                  <ul className="mt-2.5 space-y-2">
                    {selectedStandardObj.reopenTriggers.map((trig, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-200 leading-relaxed flex items-start gap-2"
                      >
                        <span className="font-mono text-emerald-400 shrink-0">
                          [{idx + 1}]
                        </span>
                        <span>{trig}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5">
                  <div className="text-xs font-mono text-cyan-400">10 · Reopen action</div>
                  <p className="text-sm font-medium text-white mt-1.5 leading-snug">
                    {selectedStandardObj.reopenAction}
                  </p>
                </div>
              </div>

              {/* Column 3: Economics, Dependencies & Proof */}
              <div className="divide-y divide-slate-800">
                <div className="p-5">
                  <div className="text-xs font-mono text-slate-400">11 · Dependencies</div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono text-slate-300">
                    {selectedStandardObj.dependencies.map((dep, i) => (
                      <span key={dep}>
                        {dep}
                        {i < selectedStandardObj.dependencies.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-xs font-mono text-slate-400">12 · Cost &amp; Hosting</div>
                  <div className="text-sm font-mono text-emerald-400 mt-1">
                    {selectedStandardObj.cost}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    Hosting: {selectedStandardObj.hosting}
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-xs font-mono text-slate-400">13 · Evidence</div>
                  <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                    {selectedStandardObj.evidence}
                  </p>
                </div>

                <div className="p-5">
                  <div className="text-xs font-mono text-slate-400">14 · Relationships</div>
                  <div className="mt-1.5 text-xs font-mono text-slate-300">
                    {selectedStandardObj.relationships.join(' · ')}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">15 · Last reviewed</span>
                    <span className="text-sm font-mono text-slate-200 tabular-nums">
                      {selectedStandardObj.lastReviewed}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEREICH 4 — REOPEN TRIGGER & SAAS COMPOSITION */}
      <section id="reopen-trigger" className="py-24 border-b border-slate-800/80">
        <div className="mx-auto max-w-[1380px] px-6">
          <div className="max-w-3xl mb-14">
            <div className="text-xs font-mono text-emerald-400 mb-3">
              03. Reopen Trigger &amp; SaaS Composition Plane
            </div>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4"
              style={{ textWrap: 'balance' }}
            >
              Geparkte Möglichkeiten sterben nicht. Sie werden zu kundenfertigen Produkten komponiert.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Ob eine eigene Idee wieder aktiviert wird oder ein Kunde mit einem handfesten Problem anfragt: Die D.T. Workstation baut nicht neu von null, sondern schöpft aus dem Fundus getesteter Bausteine.
            </p>
          </div>

          {/* Interactive 7-Stage Pipeline Visualization */}
          <div className="rounded-xl border border-slate-800 bg-[#111723] p-6 sm:p-8">
            <div className="text-xs font-mono text-slate-400 mb-4">
              Klicke auf eine Phase der Kompositions- und Reaktivierungs-Kette:
            </div>

            {/* Pipeline Chain */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-8">
              {pipelineStages.map((item, idx) => {
                const isSelected = activePipelineStage === idx;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActivePipelineStage(idx)}
                    className={`text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500/10'
                        : 'border-slate-800 bg-[#0B0F17]/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                      <span className="tabular-nums">{item.step}</span>
                      {idx < 6 && <span className="text-slate-600">→</span>}
                    </div>
                    <div
                      className={`text-sm font-semibold whitespace-nowrap truncate ${
                        isSelected ? 'text-emerald-300' : 'text-white'
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {item.stateLabel}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Inspector Box */}
            <div className="rounded-lg border border-slate-800 bg-[#0B0F17] p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8">
                <div className="text-xs font-mono text-emerald-400 mb-1">
                  Phase {pipelineStages[activePipelineStage].step} ·{' '}
                  {pipelineStages[activePipelineStage].label} ({pipelineStages[activePipelineStage].stateLabel})
                </div>
                <p className="text-base text-slate-200 leading-relaxed mt-2">
                  {pipelineStages[activePipelineStage].detail}
                </p>
                <div className="mt-3 text-xs font-mono text-slate-400">
                  Praxis-Beispiel: <span className="text-slate-300">{pipelineStages[activePipelineStage].example}</span>
                </div>
              </div>

              <div className="lg:col-span-4 flex lg:justify-end">
                <button
                  type="button"
                  onClick={() => onOpenWorkstation('requests')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Kundenanfragen in Workstation prüfen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEREICH 5 — FÜR WEN */}
      <section id="zielgruppe" className="py-24 border-b border-slate-800/80 bg-[#0D121C]">
        <div className="mx-auto max-w-[1380px] px-6">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-mono text-emerald-400 mb-3">
              04. Einsatzprofil
            </div>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4"
              style={{ textWrap: 'balance' }}
            >
              Gebaut für unabhängige Produkt-Architekten.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Kein aufgeblähtes Enterprise-Projektmanagement. D.T. ist das persönliche Control Center für Menschen, die aus Code, Open-Source-Modulen und Kundenproblemen systematisch reale Micro-SaaS-Produkte bauen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              {
                index: '01.',
                role: 'Für Solopreneure',
                desc: 'Baue und verkaufe schlüsselfertige Software an lokale Betriebe, ohne monatelang am Rad neu zu erfinden.'
              },
              {
                index: '02.',
                role: 'Für Builder',
                desc: 'Kuratierte Registry deiner besten Tools, Datenbanken und Self-Hosted-Repos mit klaren „Default vs. Fallback“-Regeln.'
              },
              {
                index: '03.',
                role: 'Für KI-gestriebene Produktentwicklung',
                desc: 'Strukturierte 15K-Objekte liefern deterministischen Kontext für Coding-Agents und ultraschnelle Prototypen.'
              },
              {
                index: '04.',
                role: 'Für OSS-/SaaS-Foundry-Aufbau',
                desc: 'Einmal gebaute Fähigkeiten (OCR, Auth, GPS, Billing) werden als Bausteine in jedes Folgeprojekt übernommen.'
              },
              {
                index: '05.',
                role: 'Für Menschen mit vielen Ideen',
                desc: 'Schütze deinen aktuellen Fokus: Parke neue Chancen ruhigen Gewissens, weil Reopen Trigger sie rechtzeitig zurückholen.'
              }
            ].map((item) => (
              <div
                key={item.role}
                className="rounded-xl border border-slate-800 bg-[#111723] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-emerald-400 mb-3">
                    {item.index}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2.5">
                    {item.role}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEREICH 6 — FINAL CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-[1380px] px-6">
          <div className="rounded-2xl border border-slate-800 bg-[#111723] p-8 sm:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div className="max-w-2xl">
              <div className="text-xs font-mono text-emerald-400 mb-3">
                D.T. Workstation · Bereit zur Inspektion
              </div>
              <h2
                className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-4"
                style={{ textWrap: 'balance' }}
              >
                Baue dein eigenes einfaches, kostenloses und autarkes Ideen- und Capability-OS.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Erkunde jetzt die Kundenanfragen-Sektion, das 15K Opportunity Portfolio und die wiederverwendbaren Foundry Capabilities.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => onOpenWorkstation('requests')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Kostprobe öffnen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenWorkstation('overview')}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-slate-200 bg-[#0B0F17] border border-slate-700 rounded-lg hover:border-slate-500 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Zur Workstation</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-xs text-slate-500">
        <div className="mx-auto max-w-[1380px] px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-slate-300">
              D.T. Workstation
            </span>
            <span>·</span>
            <span>Simpel. Gratis. Autark.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#systematik" className="hover:text-slate-300 transition-colors">
              Systematik
            </a>
            <a href="#objekt-standard" className="hover:text-slate-300 transition-colors">
              15K Schema
            </a>
            <button
              type="button"
              onClick={() => onOpenWorkstation('requests')}
              className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Kundenanfragen &amp; SaaS Composer →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
