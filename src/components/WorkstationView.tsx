import React, { useState, useEffect } from 'react';
import {
  Inbox,
  CheckSquare,
  Database,
  Briefcase,
  Cpu,
  Activity,
  Settings,
  Search,
  Plus,
  SlidersHorizontal,
  Layers,
  Sparkles,
  MessageSquareQuote,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import {
  StandardizedObject,
  WorkstationSection,
  ObjectState,
  FOUNDRY_CAPABILITIES,
  ACTIVE_INITIATIVES,
  ActiveInitiative,
  ClientRequest,
  ClientRequestState,
  INITIAL_CLIENT_REQUESTS,
  SaaSBuildManifest,
  RequestAnalysis
} from '../data/workstationData';
import { ClientRequestIntake } from './ClientRequestIntake';
import { RequestAnalysisView } from './RequestAnalysisView';
import { BuildWorkspace } from './BuildWorkspace';
import { PortfolioRadarView } from './PortfolioRadarView';
import { LiveFoundryIntakeSplitView } from './LiveFoundryIntakeSplitView';
import { LivingProcessMapView } from './LivingProcessMapView';
import { WorkstationSidebar } from './WorkstationSidebar';

interface WorkstationViewProps {
  objects: StandardizedObject[];
  activeSection: WorkstationSection;
  onSectionChange: (section: WorkstationSection) => void;
  selectedObjectId: string;
  onSelectObject: (id: string) => void;
  onUpdateObjectState: (id: string, newState: ObjectState, newSection?: StandardizedObject['section']) => void;
  onAddObject: (newObj: StandardizedObject) => void;
  onBackToLanding: () => void;
  // Specific requested trigger to immediately launch Customer Request Intake
  initialOpenIntake?: boolean;
}

export const WorkstationView: React.FC<WorkstationViewProps> = ({
  objects,
  activeSection,
  onSectionChange,
  selectedObjectId,
  onSelectObject,
  onUpdateObjectState,
  onAddObject,
  onBackToLanding,
  initialOpenIntake = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewInputModal, setShowNewInputModal] = useState(false);
  const [showRequestIntake, setShowRequestIntake] = useState(initialOpenIntake);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Client requests with local persistence and schema sanitization
  const [clientRequests, setClientRequests] = useState<ClientRequest[]>(() => {
    try {
      const stored = localStorage.getItem('dt_client_requests');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((req: any) => {
            if (req && req.analysis) {
              const mps = req.analysis.manualProcessSummary;
              const sm = req.analysis.successMetrics;
              return {
                ...req,
                analysis: {
                  ...req.analysis,
                  manualProcessSummary: Array.isArray(mps)
                    ? mps
                    : typeof mps === 'string' && mps
                    ? mps.split('\n').map((s: string) => s.trim()).filter(Boolean)
                    : ['Manuelle Datensichtung und Dokumenten-Sortierung'],
                  successMetrics: Array.isArray(sm)
                    ? sm
                    : typeof sm === 'string' && sm
                    ? sm.split('\n').map((s: string) => s.trim()).filter(Boolean)
                    : ['Erfolgskriterien definiert'],
                  matchedCapabilities: Array.isArray(req.analysis.matchedCapabilities)
                    ? req.analysis.matchedCapabilities
                    : [],
                  missingCapabilities: Array.isArray(req.analysis.missingCapabilities)
                    ? req.analysis.missingCapabilities
                    : [],
                  recommendedStack: Array.isArray(req.analysis.recommendedStack)
                    ? req.analysis.recommendedStack
                    : []
                }
              };
            }
            return req;
          });
        }
      }
    } catch (e) {
      // fallback
    }
    return INITIAL_CLIENT_REQUESTS;
  });

  const [selectedRequestId, setSelectedRequestId] = useState<string>('REQ-2026-017');
  const [requestsViewMode, setRequestsViewMode] = useState<'process-map' | 'split' | 'analysis' | 'list'>('process-map');

  // Active Initiatives with local persistence
  const [initiatives, setInitiatives] = useState<ActiveInitiative[]>(() => {
    try {
      const stored = localStorage.getItem('dt_initiatives');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return ACTIVE_INITIATIVES;
  });

  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string | null>('INIT-BAU-01');

  useEffect(() => {
    if (initialOpenIntake) {
      setShowRequestIntake(true);
    }
  }, [initialOpenIntake]);

  useEffect(() => {
    try {
      localStorage.setItem('dt_client_requests', JSON.stringify(clientRequests));
    } catch (e) {}
  }, [clientRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('dt_initiatives', JSON.stringify(initiatives));
    } catch (e) {}
  }, [initiatives]);

  // Input intake form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<StandardizedObject['category']>('Repo');
  const [newSource, setNewSource] = useState('');
  const [newWhatItDoes, setNewWhatItDoes] = useState('');
  const [newTrigger, setNewTrigger] = useState('');

  // Settings toggles
  const [autoTriggerCheck, setAutoTriggerCheck] = useState(true);
  const [strictZeroLockIn, setStrictZeroLockIn] = useState(true);
  const [sqliteWalSync, setSqliteWalSync] = useState(true);

  const selectedObject =
    objects.find((o) => o.id === selectedObjectId) || objects[0];

  const selectedRequest =
    clientRequests.find((r) => r.id === selectedRequestId) || clientRequests[0];

  const selectedInitiative =
    initiatives.find((i) => i.id === selectedInitiativeId);

  const triggerFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => {
      setActionFeedback(null);
    }, 3800);
  };

  const handleCreateInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const createdId = `OBJ-15K-${String(objects.length + 1).padStart(2, '0')}`;
    const created: StandardizedObject = {
      id: createdId,
      title: newTitle.trim(),
      subtitle: newWhatItDoes.trim() || 'Neu erfasster Input zur Strukturierung in ein 15K Object',
      type: `${newCategory} / Unclassified Signal`,
      category: newCategory,
      tags: [newCategory, 'Quick Intake', 'Unclassified'],
      source: newSource.trim() || 'Manual Workstation Intake',
      whatItDoes:
        newWhatItDoes.trim() ||
        'Wurde über den Quick-Intake der D.T. Workstation erfasst und wartet auf Detail-Strukturierung.',
      value: 'Potenzieller Baustein für künftige Foundry-Capabilities oder 15K-Initiativen.',
      whereItFits: 'Evaluation Queue · System-Zuordnung ausstehend',
      currentState: 'Review pending',
      role: 'Inbox Candidate',
      whyNotNow: 'Frischer Input — Architektur- und Kostenprüfung steht noch aus.',
      reopenTriggers: [
        newTrigger.trim() || 'Abschluss des wöchentlichen Architektur-Reviews am Freitag'
      ],
      reopenAction: 'In 15K-Standard-Schema überführen und gegen bestehende Registry prüfen',
      reopenRelevance: 'Mittel',
      dependencies: ['Standardized Object Schema v1.4'],
      cost: 'free / Zu prüfen',
      hosting: 'Self-Hosted bevorzugt',
      evidence: 'Manuell eingereicht durch Operator.',
      relationships: ['D.T. Workstation V1'],
      lastReviewed: '2026-10-03',
      section: 'inbox'
    };

    onAddObject(created);
    onSelectObject(created.id);
    setNewTitle('');
    setNewSource('');
    setNewWhatItDoes('');
    setNewTrigger('');
    setShowNewInputModal(false);
    triggerFeedback(`Objekt ${created.id} (${created.title}) in Inbox angelegt.`);
  };

  // Analyze request with full RequestAnalysis & SaaSBuildManifest generation
  const handleProcessIntake = (formData: any) => {
    const newId = `REQ-2026-${String(clientRequests.length + 1).padStart(2, '0')}`;
    const lower = formData.rawRequest.toLowerCase();

    const isWhatsAppDoc = lower.includes('lieferschein') || lower.includes('whatsapp') || lower.includes('foto') || lower.includes('ocr');
    const isVoice = lower.includes('telefon') || lower.includes('anruf') || lower.includes('rezept') || lower.includes('stimme');
    const isImmo = lower.includes('miet') || lower.includes('schaden') || lower.includes('email') || lower.includes('outlook') || lower.includes('wohnung');

    let reusePercent = 88;
    let infraCost = 4.0;
    let varCost = 3.2;
    let backupCost = 1.5;
    let defaultPrice = formData.targetPrice || 150;

    const matchedCaps = [
      {
        capabilityId: 'CAP-06',
        name: 'Dashboard Shell',
        matchScorePercent: 92,
        source: 'shadcn/ui Control Preset (OBJ-15K-08)',
        status: 'READY' as const,
        reason: 'Barrierefreie Übersichts-Tabellen mit Tabular-Nums und Filterleiste.'
      },
      {
        capabilityId: 'CAP-02',
        name: 'Auth & Session Guard',
        matchScorePercent: 94,
        source: 'PocketBase Auth Guard (OBJ-15K-01)',
        status: 'READY' as const,
        reason: 'Rollen-Trennung ohne externe Benutzergebühren.'
      }
    ];

    if (isWhatsAppDoc) {
      matchedCaps.push(
        {
          capabilityId: 'CAP-01',
          name: 'OCR & Document Parsing',
          matchScorePercent: 98,
          source: 'PDF → OCR → Review → Export (OBJ-15K-05)',
          status: 'READY' as const,
          reason: 'Liest Lieferschein-Nummern und Datumsstempel direkt aus Fotos.'
        },
        {
          capabilityId: 'CAP-03',
          name: 'File Storage & Evidence Vault',
          matchScorePercent: 95,
          source: 'Foundry File Storage',
          status: 'READY' as const,
          reason: 'Manipulationssichere Speicherung der Original-Fotos mit SHA-256 Prüfsumme auf S3.'
        }
      );
    } else if (isVoice) {
      matchedCaps.push({
        capabilityId: 'CAP-05',
        name: 'Notifications & Trigger Dispatch',
        matchScorePercent: 96,
        source: 'Voice-Rezeptionist 15K Object (OBJ-15K-02)',
        status: 'READY' as const,
        reason: 'Sendet Push-Alarm an Rezeption bei Notfall-Keywords.'
      });
      reusePercent = 92;
      defaultPrice = formData.targetPrice || 220;
    } else if (isImmo) {
      matchedCaps.push(
        {
          capabilityId: 'CAP-07',
          name: 'Search & Lexical Indexing',
          matchScorePercent: 95,
          source: 'SQLite FTS5 / Registry (OBJ-15K-01)',
          status: 'READY' as const,
          reason: 'Findet Adressen und Liegenschaften in Millisekunden über FTS5 Volltext-Index.'
        },
        {
          capabilityId: 'CAP-03',
          name: 'File Storage & Evidence Vault',
          matchScorePercent: 93,
          source: 'Foundry File Storage',
          status: 'READY' as const,
          reason: 'Speichert Schadensfotos aus Mail-Anhängen revisionssicher ab.'
        }
      );
      reusePercent = 89;
      defaultPrice = formData.targetPrice || 190;
    }

    const totalCost = 25;
    const targetPriceNum = typeof defaultPrice === 'number' ? defaultPrice : parseInt(String(defaultPrice)) || 150;
    const margin = Math.max(0, targetPriceNum - totalCost);
    const marginPct = Math.round((margin / targetPriceNum) * 100);

    const analysis: RequestAnalysis = {
      problemSummary: formData.rawRequest.slice(0, 160) + '...',
      desiredOutcome: formData.desiredOutcome || 'Automatisierte Erfassung, Strukturierung und Büro-Dashboard.',
      manualProcessSummary: [
        formData.currentProcess || 'WhatsApp-Nachrichten sichten und herunterladen (ca. 1–2 h/Tag)',
        'Dateien manuell benennen und Projekten zuordnen (ca. 1–2 h/Tag)',
        'Statusberichte manuell erstellen (ca. 0,5 h/Tag)'
      ],
      successMetrics: [
        'Drastische Zeitersparnis bei der wöchentlichen Nachbearbeitung (>80%)',
        '0 verlorene Vorgänge durch lückenlose Status-Ampel',
        'Volle Datenhoheit auf autarkem Server in Deutschland'
      ],
      matchedCapabilities: matchedCaps.map((c) => ({
        capabilityId: c.capabilityId,
        name: c.name,
        description: c.reason,
        matchScorePercent: c.matchScorePercent,
        source: c.source,
        status: c.status
      })),
      reusableObjects: ['OBJ-15K-01', 'OBJ-15K-05', 'OBJ-15K-09'],
      missingCapabilities: [
        {
          name: isWhatsAppDoc ? 'WhatsApp Intake Adapter' : isVoice ? 'SIP-Trunk Gateway Hook' : 'Inbound Mail Poller',
          description: 'Spezifischer Inbound-Listener zur Entgegennahme von Roh-Nachrichten.',
          effortBadge: 'M',
          status: 'Geplant'
        },
        {
          name: 'Kundenspezifische Zuordnungs-Regeln',
          description: 'Regelwerk zur automatischen Projekt- und Mandantenzuweisung.',
          effortBadge: 'S',
          status: 'Geplant'
        }
      ],
      recommendedStack: [
        {
          layer: 'Frontend',
          selectedOption: 'React 19 + shadcn/ui Control Preset',
          rationale: 'Erprobtes Workstation-Preset, barrierefrei, sofort einsatzbereit.'
        },
        {
          layer: 'Backend',
          selectedOption: 'PocketBase Single-Binary Go',
          rationale: 'Minimaler Wartungsaufwand, eingebettetes SQLite, ideal für kalkulierbare Kosten.'
        },
        {
          layer: 'Storage',
          selectedOption: 'PocketBase Storage (Evidence Vault)',
          rationale: 'Direkte Integration, Versionierung, Zugriffskontrolle.'
        },
        {
          layer: 'Automation',
          selectedOption: 'n8n (Self-Hosted)',
          rationale: 'Flexible Workflows für Verarbeitung und Klassifikation.'
        },
        {
          layer: 'Hosting',
          selectedOption: 'Hetzner Cloud VPS (4.00 € / Mo)',
          rationale: 'Volle Autarkie, DSGVO-konformer Standort Deutschland.'
        },
        {
          layer: 'Monitoring',
          selectedOption: 'Uptime Kuma + Logs',
          rationale: 'Überwachung, Logs und Alerts für stabilen Betrieb.'
        }
      ],
      estimatedBuildReusePercent: reusePercent,
      infrastructureCostMonthly: 18,
      estimatedTotalCostMonthly: totalCost,
      targetCustomerPriceMonthly: targetPriceNum,
      contributionMarginMonthly: margin,
      marginPercent: marginPct,
      recommendation: 'BUILD'
    };

    const manifest: SaaSBuildManifest = {
      requestId: newId,
      productName: formData.company ? `${formData.company} Control Hub` : `SaaS Assistant ${newId}`,
      productType: 'Vertical Automated Micro-SaaS Appliance',
      modules: ['Inbound Receiver', 'Data Extraction Engine', 'Review Queue', 'Admin Dashboard'],
      frontend: ['React 19', 'Tailwind v4', 'shadcn/ui Control Preset'],
      backend: ['PocketBase Single Binary Go', 'Custom Inbound Webhook Service'],
      database: ['SQLite WAL Mode', 'Litestream S3 Backup'],
      auth: ['Magic Link Auth', 'Role Guard'],
      storage: ['Evidence Vault S3'],
      automation: ['Pipeline Blueprint OBJ-15K-05'],
      integrations: [formData.integrations || 'Webhook API'],
      deployment: ['Single-Tenant Docker auf Hetzner VPS', 'Caddy TLS'],
      monitoring: ['Foundry Uptime Pulse'],
      reusedObjectIds: ['OBJ-15K-01', 'OBJ-15K-08'],
      reusedCapabilities: matchedCaps.map((c) => c.name),
      newWorkRequired: ['Inbound Hook Service (3.5h)', 'Zuordnungs-Heuristik (2h)'],
      acceptanceCriteria: [
        'Kunde kann Daten einspeisen',
        'System extrahiert Kerninformationen',
        'Unklare Datensätze landen in Review Queue',
        'Büro-Dashboard zeigt lückenlose Übersicht'
      ],
      estimatedMonthlyCost: totalCost,
      targetMonthlyPrice: defaultPrice,
      buildSteps: [
        'Initialize Foundry project shell from shadcn/ui preset',
        'Deploy PocketBase on Hetzner VPS',
        'Configure Inbound Adapter & Hooks',
        'Deploy Review Dashboard with Tabular Nums',
        'Run acceptance tests & deliver credentials'
      ]
    };

    const newRequest: ClientRequest = {
      id: newId,
      customerName: formData.customerName || 'Interessent',
      company: formData.company || 'Kundenbetrieb',
      industry: formData.industry || 'Dienstleistung',
      rawRequest: formData.rawRequest,
      desiredOutcome: formData.desiredOutcome,
      currentProcess: formData.currentProcess,
      userCount: formData.userCount,
      monthlyBudget: formData.monthlyBudget,
      targetPrice: defaultPrice,
      integrations: formData.integrations ? formData.integrations.split(',') : ['Webhook'],
      constraints: ['Autarkes Self-Hosting'],
      selfHostingRequired: formData.selfHostingRequired,
      complianceNotes: formData.complianceNotes,
      deadline: formData.deadline,
      notes: formData.notes,
      state: 'Proposal ready',
      createdAt: '2026-10-03',
      analysis,
      buildManifest: manifest
    };

    setClientRequests((prev) => [newRequest, ...prev]);
    setSelectedRequestId(newRequest.id);
    setRequestsViewMode('analysis');
    onSectionChange('requests');
    setShowRequestIntake(false);
    triggerFeedback(`Kundenanfrage ${newId} erfolgreich analysiert: ${reusePercent}% Reusable Components!`);
  };

  const handleLoadDemoExample = (idx: number) => {
    const preset = INITIAL_CLIENT_REQUESTS[idx];
    if (preset) {
      setSelectedRequestId(preset.id);
      setRequestsViewMode('analysis');
      onSectionChange('requests');
      triggerFeedback(`Beispiel ${preset.id} (${preset.company}) geladen.`);
    }
  };

  // APPROVE & BUILD FLOW (Section 12 of prompt)
  const handleApproveAndBuild = (req: ClientRequest) => {
    // 1. Set request state to Approved
    setClientRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, state: 'Approved' } : r))
    );

    // 2. Create a new ActiveInitiative and put it into Active section with status BUILD QUEUED
    const initiativeId = `INIT-${req.id.replace('REQ-', 'SAAS-')}`;
    const newInitiative: ActiveInitiative = {
      id: initiativeId,
      name: req.buildManifest?.productName || `${req.company || req.customerName} SaaS Solution`,
      code: `Kundenprojekt · ${req.company || req.customerName}`,
      stage: 'Building (In Ausführung)',
      progress: 75,
      stackSummary: req.buildManifest
        ? `${req.buildManifest.backend[0]} · ${req.buildManifest.frontend[0]}`
        : 'PocketBase · Surya OCR · shadcn/ui · n8n',
      nextMilestone: 'Tests ausführen & Kundengebung deployen',
      updatedAt: 'Gerade eben',
      linkedObjectIds: req.buildManifest?.reusedObjectIds || ['OBJ-15K-01', 'OBJ-15K-05', 'OBJ-15K-07'],
      description: `Kundenfertige SaaS-Lösung für ${req.company || req.customerName}: ${req.desiredOutcome || req.rawRequest}`,
      clientRequestId: req.id,
      customerName: req.company || req.customerName,
      goalSummary: req.desiredOutcome || 'WhatsApp-Dokumentenfluss automatisieren',
      buildStatus: 'BUILDING',
      pipelineStage: 'BUILDING',
      reusedModules: [
        { name: 'OCR Pipeline', description: 'PDF / Bild zu Text · Dokumentenverarbeitung', status: 'REUSED' },
        { name: 'PocketBase', description: 'Backend · Auth · DB · Storage', status: 'REUSED' },
        { name: 'Auth Template', description: 'Nutzer-Authentifizierung · Multi-Tenant', status: 'REUSED' },
        { name: 'File Storage', description: 'Sichere Ablage · Metadaten · Versionierung', status: 'REUSED' },
        { name: 'Dashboard Shell', description: 'Standard UI · Projekte · Dokumente', status: 'REUSED' },
        { name: 'Notification Layer', description: 'E-Mail · In-App · Webhooks', status: 'REUSED' }
      ],
      newWorkRequired: [
        { name: 'WhatsApp Adapter', description: 'WhatsApp Business API · Dokumenten-Intake', status: 'NEU' },
        { name: 'Projektklassifikation', description: 'KI-gestützte Zuordnung zu Bauprojekten', status: 'NEU' }
      ],
      buildStepsList: [
        { step: 1, title: 'Infrastruktur provisionieren', description: 'PocketBase Instanz, Storage Bucket, Grundkonfiguration', duration: '2 Min', status: 'VERIFIED' },
        { step: 2, title: 'Wiederverwendete Module integrieren', description: 'OCR Pipeline, Auth, Dashboard, Notifications', duration: '3 Min', status: 'VERIFIED' },
        { step: 3, title: 'Neue Module erstellen', description: 'WhatsApp Adapter, Projektklassifikation', duration: '~ 8 Min', status: 'BUILDING' },
        { step: 4, title: 'Tests ausführen', description: 'Unit Tests, Integrations-Tests, Akzeptanz-Tests', duration: '~ 4 Min', status: 'TODO' },
        { step: 5, title: 'Kundenumgebung deployen', description: 'Konfiguration, Datenmigration, Go-Live', duration: '~ 3 Min', status: 'TODO' }
      ],
      activityLogs: [
        { time: '14:26', title: 'Build gestartet', description: 'Build Pipeline initialisiert' },
        { time: '14:28', title: 'Infrastruktur bereit', description: 'PocketBase Instanz erstellt' },
        { time: '14:30', title: 'OCR Pipeline integriert', description: 'Modul aus Registry (v2.1)' },
        { time: '14:33', title: 'WhatsApp Adapter Build läuft', description: '4 von 6 Schritten abgeschlossen' }
      ],
      foundryGain: {
        capabilityName: req.rawRequest.toLowerCase().includes('whatsapp')
          ? 'WhatsApp Document Intake'
          : req.rawRequest.toLowerCase().includes('telefon')
          ? 'Healthcare Audio Triage Hook'
          : 'Tenant Mail Dispatch Adapter',
        description: 'Aus diesem Kundenauftrag extrahierter, generischer Inbound-Webhook-Adapter für Folgeprojekte.',
        savedAsCandidate: false
      }
    };

    setInitiatives((prev) => [newInitiative, ...prev]);
    setSelectedInitiativeId(newInitiative.id);
    onSectionChange('active');
    triggerFeedback(`Bauplan freigegeben! Neue Active Initiative ${newInitiative.code} mit Status „BUILD QUEUED“ angelegt.`);
  };

  const handleClarify = (req: ClientRequest) => {
    setClientRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, state: 'Needs clarification' } : r))
    );
    triggerFeedback(`Anfrage ${req.id} als „Needs clarification“ markiert.`);
  };

  const handlePark = (req: ClientRequest) => {
    setClientRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, state: 'New' } : r))
    );

    // Create a 15K Parked Object with explicit Reopen Triggers
    const parkedObjId = `OBJ-15K-PARK-${req.id.slice(-2)}`;
    const newParkedObj: StandardizedObject = {
      id: parkedObjId,
      title: `${req.company || req.customerName} Opportunity`,
      subtitle: req.desiredOutcome || 'Geparkte Kundenmöglichkeit aus Intake',
      type: 'Opportunity / Client Request Pool',
      category: 'Idee',
      tags: ['Opportunity', 'Kundenanfrage', 'Parked'],
      source: `Kundenanfrage ${req.id}`,
      whatItDoes: req.rawRequest,
      value: `Kunden-Zahlungsbereitschaft von ${req.targetPrice || 150} € / Monat validiert.`,
      whereItFits: 'Portfolio · 15K Opportunity Pool',
      currentState: 'Parked',
      role: 'Parked Opportunity',
      whyNotNow: 'Kunde wünscht vor Baubeginn noch Klärung interner Prozesse oder Terminierung in Q1.',
      reopenTriggers: [
        'Kunde bestätigt Startfreigabe und Projektbudget',
        'Fertigstellung des passenden Inbound-Adapters in einer Schwester-Initiative'
      ],
      reopenAction: `SaaS Build Manifest ${req.id} sofort reaktivieren und Build Pipeline starten`,
      reopenRelevance: 'Hoch',
      dependencies: ['PocketBase Standard', 'shadcn/ui Preset'],
      cost: '0.00 € (geparkt)',
      hosting: 'On-Demand bei Reaktivierung',
      evidence: `Schriftliche Kundenanfrage ${req.id} liegt vor.`,
      relationships: ['15K Opportunity Pool', 'D.T. Workstation V1'],
      lastReviewed: '2026-10-03',
      section: 'portfolio'
    };

    onAddObject(newParkedObj);
    onSelectObject(newParkedObj.id);
    onSectionChange('portfolio');
    triggerFeedback(`Anfrage ${req.id} als 15K-Objekt ${parkedObjId} mit Reopen Triggern im Portfolio geparkt.`);
  };

  // Foundry Feedback Loop: Save extracted capability into Review
  const handleExtractCapability = (initiativeId: string, capName: string) => {
    const newCapObjId = `OBJ-15K-CAP-${String(objects.length + 1).padStart(2, '0')}`;
    const newCapObj: StandardizedObject = {
      id: newCapObjId,
      title: capName,
      subtitle: `Aus Kunden-Initiative ${initiativeId} extrahierter Plattform-Baustein`,
      type: 'Foundry Capability Candidate / Adapter',
      category: 'Workflow',
      tags: ['Capability', 'Foundry Gain', 'Adapter', 'Wiederverwendbar'],
      source: `Initiative ${initiativeId}`,
      whatItDoes: `Wiederverwendbarer Service-Baustein zur automatisierten Datenentgegennahme ohne Re-Engineering in Folgeprojekten.`,
      value: `Erhöht die Foundry-Reuse-Quote für zukünftige SaaS-Aufträge um weitere 8–12%.`,
      whereItFits: 'Foundry Registry · Inbound Adapter',
      currentState: 'Approved candidate',
      role: 'Capability Candidate',
      whyNotNow: 'Review zur Generalisierung und Dokumentation der Umgebungsvariablen läuft.',
      reopenTriggers: ['Nächste Kundenanfrage mit identischem Inbound-Kanal trifft ein'],
      reopenAction: 'Als dauerhafte Foundry Capability CAP-09 in Registry verankern',
      reopenRelevance: 'Hoch',
      dependencies: ['Node/Go Webhook Worker', 'Evidence Vault S3'],
      cost: '0.00 € (Eigenentwicklung)',
      hosting: 'Containerized',
      evidence: `Erfolgreich im Produktiv-Test von Initiative ${initiativeId} verifiziert.`,
      relationships: ['D.T. Workstation V1', initiativeId],
      lastReviewed: '2026-10-03',
      section: 'review'
    };

    onAddObject(newCapObj);
    setInitiatives((prev) =>
      prev.map((i) =>
        i.id === initiativeId
          ? {
              ...i,
              foundryGain: i.foundryGain ? { ...i.foundryGain, savedAsCandidate: true } : undefined
            }
          : i
      )
    );
    triggerFeedback(`Global Feedback Loop: „${capName}“ als Capability-Kandidat ${newCapObjId} in Review gespeichert!`);
  };

  const handleUpdateStepStatus = (initiativeId: string, stepIndex: number) => {
    setInitiatives((prev) =>
      prev.map((i) => {
        if (i.id !== initiativeId || !i.buildStepsList) return i;
        const current = i.buildStepsList[stepIndex].status;
        const next: 'BUILDING' | 'PENDING' | 'TODO' | 'VERIFIED' =
          current === 'TODO'
            ? 'BUILDING'
            : current === 'BUILDING'
            ? 'VERIFIED'
            : current === 'VERIFIED'
            ? 'PENDING'
            : 'TODO';

        const updated = i.buildStepsList.map((st, idx) =>
          idx === stepIndex ? { ...st, status: next } : st
        );

        return {
          ...i,
          buildStepsList: updated,
          progress: Math.min(100, i.progress + 10)
        };
      })
    );
  };

  const filteredObjects = objects.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.title.toLowerCase().includes(q) ||
      o.type.toLowerCase().includes(q) ||
      o.role.toLowerCase().includes(q) ||
      o.currentState.toLowerCase().includes(q) ||
      o.whereItFits.toLowerCase().includes(q)
    );
  });

  const navItems: {
    id: WorkstationSection;
    label: string;
    count?: number;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'overview',
      label: 'Control Plane',
      count: objects.length,
      icon: <Layers className="w-4 h-4" />
    },
    {
      id: 'inbox',
      label: 'Inbox',
      count: 5,
      icon: <Inbox className="w-4 h-4" />
    },
    {
      id: 'requests',
      label: 'Requests',
      count: clientRequests.length,
      icon: <MessageSquareQuote className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'review',
      label: 'Review',
      count: objects.filter((o) =>
        ['Review pending', 'Needs clarification', 'Approved candidate'].includes(o.currentState)
      ).length,
      icon: <CheckSquare className="w-4 h-4" />
    },
    {
      id: 'registry',
      label: 'Registry',
      count: objects.filter((o) => o.section === 'registry' || o.currentState === 'Approved').length,
      icon: <Database className="w-4 h-4" />
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      count: objects.filter((o) =>
        ['Parked', 'Armed', 'Reopened'].includes(o.currentState)
      ).length,
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      id: 'foundry',
      label: 'Foundry',
      count: FOUNDRY_CAPABILITIES.length,
      icon: <Cpu className="w-4 h-4" />
    },
    {
      id: 'active',
      label: 'Active',
      count: initiatives.length,
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  const getStateColorText = (state: ObjectState | ClientRequestState) => {
    switch (state) {
      case 'Approved':
      case 'Active':
      case 'Ready':
      case 'Abgeschlossen':
        return 'text-emerald-400';
      case 'Armed':
      case 'Reopened':
      case 'Approved candidate':
      case 'Proposal ready':
      case 'Building':
      case 'In Umsetzung':
        return 'text-cyan-400';
      case 'Review pending':
      case 'Needs clarification':
      case 'In Analyse':
        return 'text-amber-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="dt-workstation-shell bg-[#0B0F17] text-[#F1F5F9]">
      <WorkstationSidebar
        items={navItems}
        activeSection={activeSection}
        onSectionChange={(section) => {
          onSectionChange(section);
          setSelectedInitiativeId(null);
        }}
        onBackToLanding={onBackToLanding}
      />

      {/* MAIN WORKSPACE COLUMN */}
      <div className="dt-workstation-main flex-1 flex flex-col min-w-0">
        {/* TOPBAR WITH FOUNDRY OS WORKFLOW STEPS (Matching Screenshot) */}
        <header className="min-h-14 border-b border-slate-800 bg-[#0D121C]/95 px-4 lg:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
          {/* Workflow Tabs from Screenshot: 1. Kundenanfragen | 2. Analyse & Komposition | 3. Review & Feinschliff | 4. Build & Deployment | 5. Portfolio */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5 max-w-full">
            {/* Step 1: Kundenanfrage */}
            <button
              type="button"
              onClick={() => {
                onSectionChange('requests');
                setRequestsViewMode('list');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSection === 'requests' && requestsViewMode === 'list'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-sm shadow-blue-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-blue-500/30 text-blue-400 text-[10px] flex items-center justify-center font-bold">1</span>
              <span>1. Kundenanfrage</span>
            </button>

            {/* Step 2: Living Process Map (Phase 1: VERSTEHEN) */}
            <button
              type="button"
              onClick={() => {
                onSectionChange('requests');
                setRequestsViewMode('process-map');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                (activeSection === 'requests' && requestsViewMode === 'process-map') || activeSection === 'process-map'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm shadow-purple-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-purple-500/30 text-purple-400 text-[10px] flex items-center justify-center font-bold">2</span>
              <span>2. Living Process Map</span>
            </button>

            {/* Step 3: UX Preview (Phase 2: ERLEBEN) */}
            <button
              type="button"
              onClick={() => {
                onSectionChange('requests');
                setRequestsViewMode('split');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                (activeSection === 'requests' && requestsViewMode === 'split') || activeSection === 'preview'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-400 text-[10px] flex items-center justify-center font-bold">3</span>
              <span>3. UX Preview</span>
            </button>

            {/* Step 4: Solution Composition (Phase 3: KOMPOSITION) */}
            <button
              type="button"
              onClick={() => {
                onSectionChange('requests');
                setRequestsViewMode('analysis');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                (activeSection === 'requests' && requestsViewMode === 'analysis') || activeSection === 'composition'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-cyan-500/30 text-cyan-400 text-[10px] flex items-center justify-center font-bold">4</span>
              <span>4. Solution Composition</span>
            </button>

            {/* Step 5: Harden & Build (Phase 4: HÄRTEN) */}
            <button
              type="button"
              onClick={() => {
                onSectionChange('active');
                if (!selectedInitiativeId && initiatives.length > 0) {
                  setSelectedInitiativeId(initiatives[0].id);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSection === 'active' || activeSection === 'harden'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-sm shadow-indigo-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-400 text-[10px] flex items-center justify-center font-bold">5</span>
              <span>5. Harden &amp; Build</span>
            </button>

            {/* Step 6: Portfolio */}
            <button
              type="button"
              onClick={() => onSectionChange('portfolio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSection === 'portfolio'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm shadow-purple-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-purple-500/30 text-purple-400 text-[10px] flex items-center justify-center font-bold">6</span>
              <span>6. Portfolio</span>
            </button>
          </div>

          {/* Topbar Search & Prominent Action Buttons */}
          <div className="flex items-center gap-2.5 ml-auto">
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Suchen... ⌘K"
                className="w-36 lg:w-48 pl-8 pr-3 py-1 text-xs bg-[#0B0F17] border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            {/* MANDATORY GLOBAL QUICK ACTION: + Neue Anfrage */}
            <button
              type="button"
              onClick={() => setShowRequestIntake(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors whitespace-nowrap cursor-pointer shadow-md shadow-emerald-950"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Neue Anfrage</span>
            </button>
          </div>
        </header>

        {/* Action Feedback Toast */}
        {actionFeedback && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-6 py-2.5 text-xs font-mono text-emerald-300 flex items-center justify-between">
            <span>✓ {actionFeedback}</span>
            <button
              type="button"
              onClick={() => setActionFeedback(null)}
              className="text-emerald-400 hover:text-white cursor-pointer ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* MAIN BODY AREA */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* CASE 1: BUILD WORKSPACE FOR ACTIVE INITIATIVE */}
          {activeSection === 'active' && selectedInitiative ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-2 cursor-pointer shadow-sm shadow-cyan-950"
                >
                  <span>⚙️ Build Workspace: {selectedInitiative.name}</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInitiativeId(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors cursor-pointer"
                >
                  <span>📋 Alle aktiven Initiativen ({initiatives.length})</span>
                </button>
              </div>

              <BuildWorkspace
                initiative={selectedInitiative}
                onExtractCapability={handleExtractCapability}
                onUpdateStepStatus={handleUpdateStepStatus}
                onBackToInitiatives={() => setSelectedInitiativeId(null)}
              />
            </div>
          ) : ((activeSection === 'requests' && requestsViewMode === 'process-map') || activeSection === 'process-map') ? (
            /* CASE 2A: LIVING PROCESS MAP (PHASE 1: VERSTEHEN - EVENT STORMING) */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setRequestsViewMode('process-map')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-2 cursor-pointer shadow-sm shadow-purple-950"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                  <span>🗺️ 2. Living Process Map (Event Storming)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRequestsViewMode('split')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>🖥️ 3. UX Preview &amp; Reverse-Traceability</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRequestsViewMode('analysis')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors cursor-pointer"
                >
                  <span>📄 4. Solution Composition</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRequestsViewMode('list')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors cursor-pointer"
                >
                  <span>📋 Tabellen-Übersicht ({clientRequests.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestIntake(true)}
                  className="sm:ml-auto px-3.5 py-1.5 rounded-lg text-xs font-mono text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Neues Kundenproblem erfassen</span>
                </button>
              </div>

              <LivingProcessMapView
                request={selectedRequest || clientRequests[0]}
                allRequests={clientRequests}
                onSelectRequestId={(id) => setSelectedRequestId(id)}
                onNavigateToPreview={() => {
                  onSectionChange('requests');
                  setRequestsViewMode('split');
                }}
                onNavigateToComposition={() => {
                  onSectionChange('requests');
                  setRequestsViewMode('analysis');
                }}
                onSaveAllNodes={(newNodes) => {
                  const targetReqId = selectedRequest?.id || clientRequests[0]?.id;
                  if (!targetReqId) return;
                  setClientRequests((prev) =>
                    prev.map((r) =>
                      r.id === targetReqId
                        ? {
                            ...r,
                            processMap: {
                              ...(r.processMap || {
                                title: 'Living Process Map',
                                summary: '',
                                understandingScore: 90,
                                confirmedCount: 0,
                                inferredCount: 0,
                                unclearCount: 0,
                                questionCount: 0
                              }),
                              nodes: newNodes
                            }
                          }
                        : r
                    )
                  );
                }}
              />
            </div>
          ) : activeSection === 'requests' && requestsViewMode === 'split' ? (
            /* CASE 2B: FOUNDRY OS LIVE SPLIT VIEW (Matching User Screenshot & Prompt) */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setRequestsViewMode('process-map')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>🗺️ 2. Living Process Map</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRequestsViewMode('split')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-950"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>🖥️ 3. UX Preview &amp; Fließband ({selectedRequest?.company || selectedRequest?.customerName || selectedRequestId})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRequestsViewMode('analysis')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors cursor-pointer"
                >
                  <span>📄 4. Solution Composition</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRequestsViewMode('list')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors cursor-pointer"
                >
                  <span>📋 Tabellen-Übersicht ({clientRequests.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestIntake(true)}
                  className="sm:ml-auto px-3.5 py-1.5 rounded-lg text-xs font-mono text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Neues Kundenproblem erfassen</span>
                </button>
              </div>

              <LiveFoundryIntakeSplitView
                requests={clientRequests}
                selectedRequestId={selectedRequestId}
                onSelectRequestId={(id) => setSelectedRequestId(id)}
                onApproveAndBuild={handleApproveAndBuild}
                onClarify={handleClarify}
                onRejectOrPark={handlePark}
                onOpenDetailedAnalysis={(req) => {
                  setSelectedRequestId(req.id);
                  setRequestsViewMode('analysis');
                }}
                onOpenProcessMap={(req) => {
                  setSelectedRequestId(req.id);
                  setRequestsViewMode('process-map');
                }}
              />
            </div>
          ) : activeSection === 'requests' && requestsViewMode === 'analysis' && selectedRequest ? (
            /* CASE 2B: DETAILED REQUEST ANALYSIS SCREEN (Section 4 & 5-11 of prompt) */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setRequestsViewMode('split')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>← 🖥️ Zurück zur Live-Komposition</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRequestsViewMode('analysis')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-2 cursor-pointer shadow-sm shadow-cyan-950"
                >
                  <span>📄 Detaillierte Analyse &amp; SaaS-Komposition ({selectedRequest.id})</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                </button>
                <button
                  type="button"
                  onClick={() => setRequestsViewMode('list')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors cursor-pointer"
                >
                  <span>📋 Alle Kundenanfragen ({clientRequests.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestIntake(true)}
                  className="sm:ml-auto px-3.5 py-1.5 rounded-lg text-xs font-mono text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Neues Kundenproblem lösen</span>
                </button>
              </div>

              <RequestAnalysisView
                request={selectedRequest}
                onApproveAndBuild={handleApproveAndBuild}
                onClarify={handleClarify}
                onPark={handlePark}
                onBackToList={() => setRequestsViewMode('split')}
              />
            </div>
          ) : activeSection === 'portfolio' ? (
            /* CASE 3: PORTFOLIO / REOPEN TRIGGER RADAR (Matching Screenshot 3) */
            <PortfolioRadarView
              objects={objects}
              selectedObjectId={selectedObjectId}
              onSelectObject={onSelectObject}
              onTriggerReopen={(id) => {
                onUpdateObjectState(id, 'Reopened');
                triggerFeedback(`Reopen Trigger für ${id} ausgelöst! Objekt reaktiviert.`);
              }}
            />
          ) : (
            /* CASE 4: DEFAULT SPLIT WORKSPACE */
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left / Center List (7 cols) */}
              <div className="xl:col-span-7 space-y-6">
                {/* REQUESTS LIST SECTION */}
                {activeSection === 'requests' && (
                  <section className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
                      <button
                        type="button"
                        onClick={() => setRequestsViewMode('split')}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>🖥️ Live-Komposition &amp; Fließband</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRequestId(selectedRequest?.id || 'REQ-2026-017');
                          setRequestsViewMode('analysis');
                        }}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>📄 Detaillierte Analyse &amp; Manifest</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequestsViewMode('list')}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-950"
                      >
                        <span>📋 Alle Kundenanfragen ({clientRequests.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRequestIntake(true)}
                        className="sm:ml-auto px-3.5 py-1.5 rounded-lg text-xs font-mono text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+ Neues Kundenproblem lösen</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-semibold text-white">
                          Kundenanfragen (Foundry Composition Pool)
                        </h2>
                        <p className="text-xs text-slate-400">
                          Reale Kundenprobleme — Wähle eine Anfrage, um die strukturierte Analyse &amp; Kostenkalkulation anzuzeigen
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-[#111723] divide-y divide-slate-800">
                      {clientRequests.map((req) => {
                        const isSelected = selectedRequestId === req.id;
                        return (
                          <div
                            key={req.id}
                            onClick={() => {
                              setSelectedRequestId(req.id);
                              setRequestsViewMode('analysis');
                            }}
                            className={`p-5 transition-colors cursor-pointer ${
                              isSelected ? 'bg-emerald-500/10' : 'hover:bg-slate-800/40'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-white">
                                    {req.company || req.customerName}
                                  </span>
                                  <span className="text-xs font-mono text-slate-400">
                                    · {req.industry}
                                  </span>
                                </div>
                                <div className="text-xs font-mono text-slate-500 mt-0.5 tabular-nums">
                                  ID: {req.id} · Ansprechpartner: {req.customerName}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-mono font-semibold ${getStateColorText(
                                    req.state
                                  )}`}
                                >
                                  [{req.state}]
                                </span>
                              </div>
                            </div>

                            <div className="p-3 rounded-lg border border-slate-800/80 bg-[#0B0F17]/80 text-xs text-slate-300 italic leading-relaxed mb-3">
                              „{req.rawRequest}“
                            </div>

                            {req.analysis && (
                              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-3 border-t border-slate-800/80">
                                <div className="flex items-center gap-4 text-slate-400">
                                  <span className="text-emerald-400 font-bold tabular-nums">
                                    {req.analysis.estimatedBuildReusePercent}% Reuse
                                  </span>
                                  <span>
                                    Kosten: ~ {req.analysis.estimatedTotalCostMonthly || 25} € / Mo
                                  </span>
                                  <span>
                                    Preis: {req.analysis.targetCustomerPriceMonthly || (typeof req.targetPrice === 'number' ? req.targetPrice : 150)} € / Mo
                                  </span>
                                  <span className="text-emerald-400 font-semibold">
                                    Marge: {req.analysis.marginPercent || 83}%
                                  </span>
                                </div>

                                <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                                  <span>Detail-Analyse öffnen</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* OVERVIEW OR INBOX */}
                {(activeSection === 'overview' || activeSection === 'inbox') && (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-semibold text-white">
                        Inbox — Neue Inputs
                      </h2>
                      <span className="text-xs font-mono text-slate-400">5 Rohe Signale</span>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-[#111723] divide-y divide-slate-800">
                      {objects.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => onSelectObject(item.id)}
                          className={`p-4 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                            selectedObjectId === item.id ? 'bg-emerald-500/10' : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white truncate">
                              {item.category}: {item.title}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5 truncate">
                              {item.subtitle}
                            </div>
                          </div>
                          <span
                            className={`text-xs font-mono ${getStateColorText(item.currentState)}`}
                          >
                            {item.currentState}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ACTIVE INITIATIVES SECTION */}
                {(activeSection === 'overview' || activeSection === 'active') && (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-semibold text-white">
                        Active — Laufende Initiativen &amp; Builds
                      </h2>
                      <span className="text-xs font-mono text-emerald-400 tabular-nums">
                        {initiatives.length} Aktive Systeme
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {initiatives.map((init) => (
                        <div
                          key={init.id}
                          onClick={() => setSelectedInitiativeId(init.id)}
                          className="rounded-xl border border-slate-800 bg-[#111723] p-5 hover:border-emerald-500/50 transition-colors cursor-pointer flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                              <span>{init.code}</span>
                              <span className="text-emerald-400 font-bold tabular-nums">
                                {init.buildStatus || `${init.progress}%`}
                              </span>
                            </div>
                            <h3 className="text-base font-semibold text-white mb-1.5">
                              {init.name}
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-3">
                              {init.description}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                            <div className="font-mono text-slate-300 text-[11px]">
                              Stack: {init.stackSummary}
                            </div>
                            <div className="text-emerald-400 font-mono text-[11px] flex items-center justify-between">
                              <span>Build Workspace öffnen →</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* REVIEW */}
                {activeSection === 'review' && (
                  <section className="space-y-4">
                    <h2 className="text-base font-semibold text-white">Review Queue</h2>
                    <div className="space-y-3">
                      {objects
                        .filter((o) =>
                          ['Review pending', 'Needs clarification', 'Approved candidate'].includes(
                            o.currentState
                          )
                        )
                        .map((rev) => (
                          <div
                            key={rev.id}
                            onClick={() => onSelectObject(rev.id)}
                            className="p-4 rounded-xl border border-slate-800 bg-[#111723] cursor-pointer hover:border-slate-700"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-semibold text-white">{rev.title}</span>
                              <span className="text-xs font-mono text-amber-400">{rev.currentState}</span>
                            </div>
                            <p className="text-xs text-slate-400">{rev.whyNotNow}</p>
                          </div>
                        ))}
                    </div>
                  </section>
                )}

                {/* REGISTRY */}
                {activeSection === 'registry' && (
                  <section className="space-y-4">
                    <h2 className="text-base font-semibold text-white">
                      Registry — Bestätigte System-Standards
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {objects
                        .filter((o) => o.section === 'registry' || o.currentState === 'Approved')
                        .map((reg) => (
                          <div
                            key={reg.id}
                            onClick={() => onSelectObject(reg.id)}
                            className="p-4 rounded-xl border border-slate-800 bg-[#111723] cursor-pointer hover:border-emerald-500/50"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-semibold text-white">{reg.title}</span>
                              <span className="text-xs font-mono text-emerald-400">Approved</span>
                            </div>
                            <div className="text-xs text-slate-400">{reg.role}</div>
                          </div>
                        ))}
                    </div>
                  </section>
                )}

                {/* FOUNDRY */}
                {activeSection === 'foundry' && (
                  <section className="space-y-4">
                    <h2 className="text-base font-semibold text-white">Foundry Capabilities</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {FOUNDRY_CAPABILITIES.map((cap) => (
                        <div
                          key={cap.id}
                          onClick={() => onSelectObject(cap.linkedObjectId)}
                          className="p-4 rounded-xl border border-slate-800 bg-[#111723] cursor-pointer hover:border-emerald-500/50"
                        >
                          <div className="text-xs font-mono text-emerald-400">{cap.domain}</div>
                          <div className="text-sm font-semibold text-white mt-1">{cap.name}</div>
                          <div className="text-xs text-slate-400 mt-1">{cap.summary}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* SETTINGS */}
                {activeSection === 'settings' && (
                  <section className="space-y-4">
                    <h2 className="text-base font-semibold text-white">Settings</h2>
                    <div className="p-5 rounded-xl border border-slate-800 bg-[#111723] text-xs font-mono text-slate-300">
                      Foundry Engine v1.4 · Lokaler SQLite Store · DSGVO Autarkie aktiv.
                    </div>
                  </section>
                )}
              </div>

              {/* Right Column: Object Inspector (5 cols) */}
              <div className="xl:col-span-5 bg-[#0D121C] p-6 rounded-xl border border-slate-800">
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      OBJECT INSPECTOR · {selectedObject.id}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {selectedObject.currentState}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-white">
                      {selectedObject.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {selectedObject.subtitle}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs font-mono bg-[#0B0F17] p-3.5 rounded-lg border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type</span>
                      <span className="text-white">{selectedObject.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cost</span>
                      <span className="text-emerald-400">{selectedObject.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hosting</span>
                      <span className="text-white">{selectedObject.hosting}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Role</span>
                      <span className="text-cyan-400">{selectedObject.role}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-3">
                    <div>
                      <span className="font-mono text-slate-400 block mb-1">What it does:</span>
                      <p>{selectedObject.whatItDoes}</p>
                    </div>
                    <div>
                      <span className="font-mono text-slate-400 block mb-1">Why not now / Boundary:</span>
                      <p className="text-slate-400">{selectedObject.whyNotNow}</p>
                    </div>
                    <div>
                      <span className="font-mono text-emerald-400 block mb-1">
                        Reopen triggers ({selectedObject.reopenTriggers.length}):
                      </span>
                      <ul className="space-y-1">
                        {selectedObject.reopenTriggers.map((t, i) => (
                          <li key={i} className="text-slate-300 flex items-start gap-1.5">
                            <span className="text-emerald-400 font-mono">[{i + 1}]</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: CUSTOMER REQUEST INTAKE */}
      <ClientRequestIntake
        isOpen={showRequestIntake}
        onClose={() => setShowRequestIntake(false)}
        onSubmit={handleProcessIntake}
        onLoadExample={handleLoadDemoExample}
      />

      {/* MODAL: RAW SIGNAL INTAKE */}
      {showNewInputModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-[#111723] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-[#0B0F17] flex items-center justify-between">
              <div className="text-sm font-semibold text-white">
                Neuen Input in D.T. Inbox erfassen
              </div>
              <button
                type="button"
                onClick={() => setShowNewInputModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInput} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Titel / Name (Repo, Tool, Idee oder Workflow) *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="z. B. Coolify Self-Hosted PaaS"
                  className="w-full px-3.5 py-2 text-sm bg-[#0B0F17] border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  What it does
                </label>
                <textarea
                  rows={2}
                  value={newWhatItDoes}
                  onChange={(e) => setNewWhatItDoes(e.target.value)}
                  placeholder="Beschreibung..."
                  className="w-full px-3.5 py-2 text-sm bg-[#0B0F17] border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewInputModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
