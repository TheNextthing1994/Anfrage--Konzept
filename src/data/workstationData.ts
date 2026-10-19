export type WorkstationSection =
  | 'overview'
  | 'inbox'
  | 'requests'
  | 'process-map'
  | 'preview'
  | 'composition'
  | 'harden'
  | 'review'
  | 'registry'
  | 'portfolio'
  | 'foundry'
  | 'active'
  | 'settings';

export type ObjectState =
  | 'Raw Input'
  | 'Review pending'
  | 'Needs clarification'
  | 'Approved candidate'
  | 'Approved'
  | 'Parked'
  | 'Armed'
  | 'Reopened'
  | 'Active';

export type TriggerRelevance = 'Niedrig' | 'Mittel' | 'Hoch' | 'Kritisch';

export interface StandardizedObject {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  category: 'Repo' | 'Tool' | 'Artikel' | 'Idee' | 'Workflow' | 'Capability' | 'Initiative' | 'Design' | 'Datenquelle' | 'Code';
  tags: string[];
  source: string;
  whatItDoes: string;
  value: string;
  whereItFits: string;
  currentState: ObjectState;
  role: string;
  whyNotNow: string;
  reopenTriggers: string[];
  reopenAction: string;
  reopenRelevance: TriggerRelevance;
  dependencies: string[];
  cost: string;
  hosting: string;
  evidence: string;
  relationships: string[];
  lastReviewed: string;
  nextReviewInDays?: number;
  section: 'inbox' | 'review' | 'registry' | 'portfolio' | 'foundry' | 'active';
}

export interface FoundryCapability {
  id: string;
  name: string;
  domain: string;
  defaultProvider: string;
  fallbackProvider: string;
  status: 'Ready' | 'Evaluating' | 'Standardized';
  costProfile: string;
  usedInCount: number;
  linkedObjectId: string;
  summary: string;
}

export interface ActiveInitiative {
  id: string;
  name: string;
  code: string;
  stage: string;
  progress: number;
  stackSummary: string;
  nextMilestone: string;
  updatedAt: string;
  linkedObjectIds: string[];
  description: string;
  // Specific for Build Workspace
  clientRequestId?: string;
  customerName?: string;
  goalSummary?: string;
  buildStatus?: 'BUILD QUEUED' | 'BUILDING' | 'VERIFIED' | 'READY';
  pipelineStage?: 'REQUEST' | 'ANALYSIS' | 'COMPOSITION' | 'APPROVAL' | 'BUILDING' | 'VERIFY' | 'DEPLOY';
  reusedModules?: {
    name: string;
    description: string;
    status: 'REUSED';
  }[];
  newWorkRequired?: {
    name: string;
    description: string;
    status: 'NEU' | 'BUILDING' | 'DONE';
  }[];
  buildStepsList?: {
    step: number;
    title: string;
    description: string;
    duration: string;
    status: 'VERIFIED' | 'BUILDING' | 'PENDING' | 'TODO';
  }[];
  activityLogs?: {
    time: string;
    title: string;
    description: string;
  }[];
  foundryGain?: {
    capabilityName: string;
    description: string;
    savedAsCandidate: boolean;
  };
}

// ==========================================
// REQUEST ANALYSIS & SAAS BUILD MANIFEST
// ==========================================

export type ClientRequestState =
  | 'New'
  | 'In Analyse'
  | 'In Umsetzung'
  | 'Abgeschlossen'
  | 'Archiviert'
  | 'Proposal ready'
  | 'Needs clarification'
  | 'Approved'
  | 'Building'
  | 'Ready';

export interface CapabilityMatch {
  capabilityId: string;
  name: string;
  description: string;
  matchScorePercent: number; // e.g. 95
  source: string;
  status: 'READY' | 'ADAPT' | 'EVALUATING';
  reason?: string;
}

export interface MissingFeature {
  name: string;
  description: string;
  effortBadge: 'S' | 'M' | 'L';
  status: 'Geplant' | 'In Bearbeitung';
}

export interface StackDecision {
  layer: string;
  selectedOption: string;
  rationale: string;
}

export interface RequestAnalysis {
  problemSummary: string;
  desiredOutcome: string;
  manualProcessSummary: string[];
  successMetrics: string[];

  matchedCapabilities: CapabilityMatch[];
  reusableObjects: string[];

  missingCapabilities: MissingFeature[];

  recommendedStack: StackDecision[];

  estimatedBuildReusePercent: number; // e.g. 87%

  // Financials matching Screenshot 1
  infrastructureCostMonthly: number; // e.g. 18 €
  estimatedTotalCostMonthly: number; // e.g. 25 €
  targetCustomerPriceMonthly: number; // e.g. 150 €
  contributionMarginMonthly: number; // e.g. 125 €
  marginPercent: number; // e.g. 83%

  recommendation: 'BUILD' | 'CLARIFY' | 'REJECT' | 'PARK';
}

export interface SaaSBuildManifest {
  requestId: string;
  productName: string;
  productType: string;
  modules: string[];
  frontend: string[];
  backend: string[];
  database: string[];
  auth: string[];
  storage: string[];
  automation: string[];
  integrations: string[];
  deployment: string[];
  monitoring: string[];
  reusedObjectIds: string[];
  reusedCapabilities: string[];
  newWorkRequired: string[];
  acceptanceCriteria: string[];
  estimatedMonthlyCost: number;
  targetMonthlyPrice: number;
  buildSteps: string[];
}

export interface DeltaMetrics {
  reuseScore: number; // e.g. 82
  deltaSize: number; // e.g. 18
  deltaCriticality: 'Niedrig' | 'Mittel' | 'Hoch';
  humanTouch: 'Gering' | 'Mittel' | 'Hoch';
  humanTouchMinutes?: number;
  reuseScoreText?: string;
  deltaSizeText?: string;
  deltaCriticalityText?: string;
  humanTouchText?: string;
}

export interface MatchingSolutionPattern {
  id: string;
  title: string;
  score: number; // e.g. 91
  description: string;
  category?: string;
  isRecommended?: boolean;
}

export interface AssembledComponentInfo {
  reused: { id: string; name: string; tag: 'Core' | 'Ready' | 'Adapter' }[];
  missing: { id: string; name: string; tag: 'Neu' | 'Custom'; description?: string }[];
}

export interface PreviewProjectItem {
  id?: string;
  name: string;
  status: 'In Bau' | 'Planung' | 'Prüfung' | 'Abgeschlossen';
  progress: number;
  lastActivity: string;
}

export interface UIPreviewConfig {
  appName: string;
  logoText: string;
  industry: string;
  activeProjectsCount: number;
  documentsCount: number;
  openTasksCount: number;
  projects: PreviewProjectItem[];
}

export type ProcessNodeStatus = 'CONFIRMED' | 'INFERRED' | 'UNCLEAR' | 'QUESTION';
export type ProcessNodeType = 'ACTOR' | 'COMMAND' | 'EVENT' | 'POLICY' | 'READ_MODEL' | 'SYSTEM' | 'EXCEPTION';

export interface ProcessNodeDetail {
  id: string;
  type: ProcessNodeType;
  title: string;
  actorOrSubject?: string;
  status: ProcessNodeStatus;
  statusReason?: string;

  // Interaktive Reflexionsfragen aus der Living Map
  rationale: string; // Warum glauben wir, dass das nötig ist?
  sourceQuote?: string; // Quelle im Kundentext
  failureHandling?: string; // Was passiert, wenn kein Projekt erkannt wird / im Fehlerfall?
  authorizedRoles?: string; // Wer darf korrigieren / entscheiden?
  notifyCustomer?: boolean | string; // Muss der Kunde benachrichtigt werden?
  requiredData?: string[]; // Welche Daten werden dafür benötigt?

  // Reverse Traceability (Welcher Screen/Element in der UX Preview existiert deswegen?)
  linkedUiComponent?: string;
  linkedScreenName?: string;
  reverseTraceabilityExplanation?: string;

  // Fluss & Verzweigung
  parentId?: string;
  branch?: 'default' | 'success' | 'failure' | 'uncertain';
}

export interface LivingProcessMap {
  title: string;
  summary: string;
  understandingScore: number; // 0..100 %
  confirmedCount: number;
  inferredCount: number;
  unclearCount: number;
  questionCount: number;
  nodes: ProcessNodeDetail[];
}

export interface ClientRequest {
  id: string;
  customerName: string;
  company?: string;
  industry?: string;

  customerNumber?: string;
  companySize?: string;
  location?: string;
  isNewCustomer?: boolean;

  sourceChannel?: string;
  urgency?: 'Niedrig' | 'Mittel' | 'Hoch';
  projectType?: string;
  budgetRange?: string;

  rawRequest: string;
  desiredOutcome?: string;
  currentProcess?: string;
  problemStatement?: string;
  goals?: string[];
  expectedOutcome?: string;

  userCount?: number;
  monthlyBudget?: string | number;
  targetPrice?: string | number;

  integrations: string[];
  constraints: string[];

  selfHostingRequired?: boolean;
  complianceNotes?: string;
  deadline?: string;
  targetLiveWeeks?: string;
  notes?: string;

  state: ClientRequestState;
  createdAt: string;

  deltaMetrics?: DeltaMetrics;
  matchingPatterns?: MatchingSolutionPattern[];
  assembledComponents?: AssembledComponentInfo;
  uiPreview?: UIPreviewConfig;
  conveyorStage?: 'Intake' | 'PatternMatch' | 'UIPreview' | 'Acceptance' | 'BuildQueue';

  processMap?: LivingProcessMap;

  analysis?: RequestAnalysis;
  buildManifest?: SaaSBuildManifest;
}

export interface TriggerMatchSignal {
  id: string;
  signalName: string;
  source: 'Tech News' | 'Monitoring' | 'Preis-Tracking' | 'Kunden-Feedback';
  matchingObjectIds: string[];
  relevance: 'Hoch' | 'Mittel' | 'Kritisch';
  timestamp: string;
}

// ==========================================
// MASTER INITIAL DATA (Matching Screenshots)
// ==========================================

export const INITIAL_OBJECTS: StandardizedObject[] = [
  {
    id: 'OBJ-15K-01',
    title: 'PocketBase',
    subtitle: 'Single-Binary Go Backend mit eingebettetem SQLite, Auth & Echtzeit-Subscriptions',
    type: 'Backend / Auth / DB / Storage',
    category: 'Repo',
    tags: ['Tool', 'Backend', 'Open Source', 'Leichtgewichtig', 'Selbst hostbar'],
    source: 'github.com/pocketbase/pocketbase',
    whatItDoes:
      'Leichtgewichtiges Backend (SQLite) mit Nutzer-Authentifizierung, Dateispeicher und Admin-Dashboard in einer einzigen ausführbaren Datei. Ideal für Prototypen, interne Tools und fokussierte Micro-SaaS-Produkte.',
    value:
      'Eliminiert Cloud-Vendor-Lock-in und monatliche Grundkosten für interne Tools, Prototypen und fokussierte Micro-SaaS-Produkte. Deployment auf 4€ Hetzner VPS in unter 3 Minuten.',
    whereItFits: 'Internal tools, prototypes, small SaaS, single-tenant client appliances',
    currentState: 'Approved',
    role: 'Foundry candidate · Backend Small',
    whyNotNow:
      'Für hochgradig verteilte Multi-Region-Workloads mit komplexen Row-Level-Policies bleibt PostgreSQL (Supabase) der Standard.',
    reopenTriggers: [
      'Neues internes Tool oder Micro-SaaS benötigt Auth + CRUD unter 2 Stunden Setup-Zeit',
      'Hosting-Budget einer Initiative liegt strikt unter 5 € / Monat',
      'Kundenprojekt fordert isoliertes Single-Tenant Self-Hosting auf eigener Hardware'
    ],
    reopenAction: 'compare against Supabase default · Benchmark für Baustellen-Submodul starten',
    reopenRelevance: 'Mittel',
    dependencies: ['Go Binary v0.22+', 'SQLite WAL-Mode', 'Litestream (S3 Backup Sync)'],
    cost: 'free (Open Source MIT)',
    hosting: 'Low-cost (3.80 € / mo VPS oder Fly.io Free/Micro)',
    evidence: '42k+ GitHub Stars, >10.000 Req/s lokal getestet, in 2 internen Prototypen produktiv verifiziert.',
    relationships: ['Supabase (Multi-tenant Default)', 'Litestream Backup', 'D.T. Workstation V1'],
    lastReviewed: '2024-01-15',
    nextReviewInDays: 3,
    section: 'registry'
  },
  {
    id: 'OBJ-15K-02',
    title: 'Voice-Rezeptionist für kleine Praxen',
    subtitle: '15K Opportunity · Telefon-Triage ohne VPS · Lock-In',
    type: 'Opportunity / Vertical AI Product',
    category: 'Idee',
    tags: ['Idee', 'AI', 'Voice', 'SMB', 'Healthcare'],
    source: 'Interne Feldnotiz · Praxis-Interviews Q3',
    whatItDoes:
      'Nimmt eingehende Praxisanrufe bei besetzter Leitung entgegen, klassifiziert Anliegen (Rezept, Akutfall, Terminverschiebung) und schreibt strukturierte Rückrufkarten direkt in das Praxis-Dashboard.',
    value:
      'Entlastet MFA-Personal um durchschnittlich 90 Minuten Telefonzeit pro Tag; verhindert Patientenverlust bei Spitzenlast am Montagmorgen.',
    whereItFits: 'Vertical SaaS · Healthcare Operations · 15K Opportunity Pool',
    currentState: 'Armed',
    role: 'Primary 15K Opportunity Object',
    whyNotNow:
      'Noch kein kostengünstiges, EU-konformes Whisper/TTS-Hosting unter 0.015 €/Minute verfügbar. Zudem fehlten stabile SIP-Anbieter mit < 400ms Latenz in der EU.',
    reopenTriggers: [
      'EU-konformes Whisper/TTS-Hosting unter 0.015 €/Minute',
      'SIP-Latenz < 400ms in EU-Region',
      'Hosting-Budget < 5 € / Monat',
      'Pilotkunde aus Praxis akzeptiert Testlauf'
    ],
    reopenAction: 'Minimalen MVP bauen (Single-Tenant), 1–2 Pilotkunden ansprechen, Telefon-Triage + Terminbuchung testen.',
    reopenRelevance: 'Hoch',
    dependencies: ['Whisper/TTS-Provider (EU)', 'SIP-Provider', 'DSGVO-Konzept', 'einfache Terminbuchung (z. B. Cal.com)'],
    cost: 'free (Eigenbau-Kern) · ~0.02 € / Gesprächsminute',
    hosting: 'Hetzner Cloud EU (Falkenstein) · DSGVO-isoliert',
    evidence: 'Marktanalysen, Preise mehrerer Provider, Gespräche mit 3 Praxen, positives Feedback zu Use Case.',
    relationships: ['15K Opportunity Pool', 'Foundry Notifications', 'PDF → OCR → Review → Export'],
    lastReviewed: '2024-01-11',
    nextReviewInDays: 3,
    section: 'portfolio'
  },
  {
    id: 'OBJ-15K-03',
    title: 'Tool: Convex',
    subtitle: 'Reaktives Backend & State-Engine · TypeScript',
    type: 'Backend / Realtime State / Sync Engine',
    category: 'Tool',
    tags: ['Tool', 'Backend', 'Realtime'],
    source: 'convex.dev · Evaluation Log #41',
    whatItDoes:
      'Ersetzt klassische REST-APIs und State-Management durch Ende-zu-Ende-typisierte, reaktive Datenbankfunktionen in reinem TypeScript.',
    value:
      'Halbiert den Boilerplate-Code bei kollaborativen Echtzeit-Oberflächen und Agentic-Workflows mit vielen parallelen Status-Updates.',
    whereItFits: 'Multi-User Realtime Apps, kollaborative Workspaces',
    currentState: 'Review pending',
    role: 'Inbox / Review Candidate',
    whyNotNow:
      'Self-Hosting-Option (Open-Source-Backend) muss gegen unsere Autarkie-Kriterien und Exportierbarkeit geprüft werden.',
    reopenTriggers: [
      'Projekt benötigt echte Multiplayer-Synchronisation ohne eigenen WebSocket-Server',
      'Verifizierung des Docker-Self-Hosted-Stacks auf eigenem Server abgeschlossen'
    ],
    reopenAction: 'Architektur-Vergleich gegen Supabase Realtime + Drizzle durchführen',
    reopenRelevance: 'Mittel',
    dependencies: ['Node.js / TypeScript 5+', 'Docker Compose (für Self-Hosted Test)'],
    cost: 'Freier Starter-Tarif · Self-Hosted Apache-2.0',
    hosting: 'Cloud oder Self-Hosted Docker',
    evidence: 'Lokaler Test-Branch zeigt 60% weniger Client-Sync-Code als klassischer React-Query-Aufbau.',
    relationships: ['PocketBase', 'Supabase', 'D.T. Workstation V1'],
    lastReviewed: '2024-01-14',
    nextReviewInDays: 5,
    section: 'inbox'
  },
  {
    id: 'OBJ-15K-04',
    title: 'Artikel: Product Foundry',
    subtitle: 'Methodik zur Trennung von Capabilities & Produkt-Hüllen',
    type: 'Methodik / Architektur-Prinzip',
    category: 'Artikel',
    tags: ['Content', 'Methodik', 'Best Practice'],
    source: 'Interne Synthese · Foundry Architecture Notes',
    whatItDoes:
      'Definiert, wie Kernfunktionen (Auth, OCR, Billing, PDF-Pipeline, GPS-Evidence) einmalig als gehärtete Module gebaut und in neuen MVPs nur noch orchestriert werden.',
    value:
      'Senkt die Zeit von einer validierten Idee bis zum produktiven MVP von 6 Wochen auf 4 Tage bei voller Code-Eigentümerschaft.',
    whereItFits: 'Plattform-Kern · Alle Foundry-Initiativen',
    currentState: 'Approved candidate',
    role: 'Foundry Operating Standard',
    whyNotNow: 'Dokumentation der Schnittstellen-Verträge für Vector Memory noch in Feinschliff.',
    reopenTriggers: [
      'Start jeder neuen Produkt-Initiative aus dem 15K Opportunity Pool',
      'Extraktion eines bewährten Bausteins aus dem Baustellenplattform MVP'
    ],
    reopenAction: 'Als verbindliches Blueprint-Template in Foundry verankern',
    reopenRelevance: 'Hoch',
    dependencies: ['Standardized Object Schema v1.4', 'Monorepo / Package Registry'],
    cost: 'free',
    hosting: 'Lokal / Git-basiert',
    evidence: 'Wiederverwendung von Auth, File Storage und OCR zwischen 3 internen Projekten nachgewiesen.',
    relationships: ['D.T. Workstation V1', 'Baustellenplattform MVP'],
    lastReviewed: '2024-01-12',
    nextReviewInDays: 7,
    section: 'review'
  },
  {
    id: 'OBJ-15K-05',
    title: 'Workflow: PDF → OCR → Review → Export',
    subtitle: 'Deterministische Dokumenten-Pipeline mit Human-in-the-Loop',
    type: 'Workflow / Automation Pipeline',
    category: 'Workflow',
    tags: ['Workflow', 'OCR', 'Automation'],
    source: 'Internal Pipeline Blueprint #08',
    whatItDoes:
      'Zerlegt eingehende Lieferscheine, Bautagebücher oder Rechnungen per strukturiertem OCR-Parsing, markiert unsichere Felder unter 94% Konfidenz für die Review Queue und exportiert sauberes JSON/CSV.',
    value:
      'Verhindert stille KI-Halluzinationen bei kritischen kaufmännischen Belegen durch klaren Schwellenwert-Filter.',
    whereItFits: 'Baustellenplattform MVP, Buchhaltungs-Vorstufe, Dokumenten-Inbox',
    currentState: 'Needs clarification',
    role: 'Core Workflow Blueprint',
    whyNotNow:
      'Entscheidung offen, ob Tabellen-Extraktion bei handschriftlichen Baustellen-Notizen lokal (Surya OCR) oder per API läuft.',
    reopenTriggers: [
      'Baustellenplattform benötigt Lieferschein-Erfassung im Feld',
      'Mehr als 50 PDF-Belege pro Woche in einer aktiven Initiative'
    ],
    reopenAction: 'Benchmark mit 25 realen Baustellen-Lieferscheinen abschließen und freigeben',
    reopenRelevance: 'Hoch',
    dependencies: ['Foundry OCR Capability', 'Foundry File Storage', 'Review Queue UI'],
    cost: '0.002 € / Seite',
    hosting: 'Worker-Container auf bestehendem Hetzner-Node',
    evidence: '98.4% Feldgenauigkeit bei gedruckten Lieferscheinen im Testlauf.',
    relationships: ['Baustellenplattform MVP', 'OCR Capability'],
    lastReviewed: '2024-01-10',
    nextReviewInDays: 2,
    section: 'review'
  },
  {
    id: 'OBJ-15K-06',
    title: 'Supabase: Auth Template',
    subtitle: 'Starter-Template mit User-Management & RLS',
    type: 'Backend / Multi-Tenant Database / Auth',
    category: 'Tool',
    tags: ['Template', 'Auth', 'Database'],
    source: 'supabase.com · Foundry Registry #02',
    whatItDoes:
      'Stellt mandantenfähiges PostgreSQL mit deklarativen RLS-Policies, pgvector und S3-kompatiblem Storage als Standard-Fundament für größere SaaS-Projekte bereit.',
    value:
      'Sofortige Mandantentrennung auf Datenbankebene; kein manuelles Schreiben von Tenant-Filter-Logik in jedem Endpoint.',
    whereItFits: 'Multi-tenant B2B SaaS, Baustellenplattform MVP, 15K Skalierungs-Stufe',
    currentState: 'Approved',
    role: 'Registry Standard · Multi-tenant Default',
    whyNotNow: 'Bereits als primärer Standard für Multi-Tenant-Architekturen aktiv gesetzt.',
    reopenTriggers: [
      'Projekt überschreitet Single-Node SQLite Grenzen oder benötigt komplexe Mandanten-Rollen',
      'Bedarf an pgvector für hybride semantische Suche in derselben Transaktionsdatenbank'
    ],
    reopenAction: 'Standard-Migrations-Skript (Tenant + RBAC) in neues Repo klonen',
    reopenRelevance: 'Hoch',
    dependencies: ['PostgreSQL 16', 'Row-Level Security Blueprint', 'Drizzle ORM'],
    cost: 'free (Self-Hosted / Free Tier) · 25 $ / mo Pro',
    hosting: 'Self-Hosted Docker oder Managed EU-Central (Frankfurt)',
    evidence: 'Läuft seit 11 Monaten fehlerfrei als Kern der Baustellenplattform MVP.',
    relationships: ['PocketBase', 'Baustellenplattform MVP', 'Vector Memory'],
    lastReviewed: '2024-01-09',
    nextReviewInDays: 14,
    section: 'registry'
  },
  {
    id: 'OBJ-15K-07',
    title: 'Baustellen-Dokumentenassistent',
    subtitle: 'Baupläne & Protokolle per Sprache · Multi-Tenant',
    type: 'Opportunity / Field Service SaaS',
    category: 'Idee',
    tags: ['Bau', 'OCR', 'Dokumente', 'B2B'],
    source: 'Customer Request REQ-2024-012',
    whatItDoes:
      'Erfasst und klassifiziert Lieferscheine, Baustellen-Fotos und Sprachprotokolle automatisch über WhatsApp und E-Mail für das Projekt-Dashboard.',
    value:
      'Spart Bauleitern 2 Stunden tägliche Sortierarbeit und schließt Dokumentationslücken für die Abrechnung.',
    whereItFits: 'Bau & Handwerk · Active Pipeline',
    currentState: 'Parked',
    role: 'Pipeline Candidate',
    whyNotNow: 'Wartet auf finale Freigabe der WhatsApp Business API Webhook Credentials.',
    reopenTriggers: [
      'WhatsApp Business API Account verifiziert',
      '3 Pilotbaustellen für Testphase terminiert'
    ],
    reopenAction: 'Deployment auf Hetzner VPS und WhatsApp Webhook einhängen',
    reopenRelevance: 'Mittel',
    dependencies: ['PocketBase', 'Surya OCR', 'WhatsApp Ingestion'],
    cost: '~25 € / Monat Betriebskosten',
    hosting: 'Hetzner VPS Nürnberg',
    evidence: 'BauGrund OS GmbH Vertrag vorliegend.',
    relationships: ['OBJ-15K-01', 'OBJ-15K-05'],
    lastReviewed: '2024-01-05',
    nextReviewInDays: 4,
    section: 'portfolio'
  },
  {
    id: 'OBJ-15K-08',
    title: 'Lead-OS für lokale Dienstleister',
    subtitle: 'Inbound, Qualifizierung, Follow-ups',
    type: 'Opportunity / Growth Automation',
    category: 'Idee',
    tags: ['CRM', 'Automatisierung', 'B2B', 'SaaS'],
    source: 'Internal Growth Lab',
    whatItDoes:
      'Automatisiert die Erstkontakt-Qualifizierung von Interessenten für Handwerker und Praxen via Formular & SMS-Triage.',
    value: 'Erhöht die Abschlussquote durch Reaktionszeiten unter 5 Minuten.',
    whereItFits: 'Portfolio · Active Signal Match',
    currentState: 'Reopened',
    role: 'Reopened Opportunity',
    whyNotNow: 'War geparkt wegen fehlender Twilio-SMS-Preisschwelle, jetzt durch Trigger Match reaktiviert.',
    reopenTriggers: [
      'Lokaler SMS-Provider unter 0.04 € / Nachricht',
      'Nachfrage von 2 Kunden nach automatischer Termin-Bestätigung'
    ],
    reopenAction: 'Mit n8n-Workflow und PocketBase verknüpfen',
    reopenRelevance: 'Kritisch',
    dependencies: ['PocketBase', 'n8n', 'SMS Gateway'],
    cost: '5 € / Monat',
    hosting: 'VPS',
    evidence: 'Positive Testkampagne mit 42 Leads.',
    relationships: ['OBJ-15K-01'],
    lastReviewed: '2024-01-10',
    nextReviewInDays: 1,
    section: 'portfolio'
  },
  {
    id: 'OBJ-15K-09',
    title: 'Design: Praxis-Website (V2)',
    subtitle: 'Schlankes One-Pager Design für lokale Dienstleister',
    type: 'UI Architecture / Component System',
    category: 'Design',
    tags: ['Design', 'Website', 'Template'],
    source: 'shadcn/ui + Tailwind Design Preset',
    whatItDoes: 'Kompakte, ablenkungsfreie Landingpage mit Termin-Intake und mobil-optimierter Typografie.',
    value: '100% Google Lighthouse Score, 0 KB externe JS-Bloatware.',
    whereItFits: 'Alle Frontend Clients',
    currentState: 'Review pending',
    role: 'UI Default Candidate',
    whyNotNow: 'Accessibility Audit für Kontraste im Dark-Mode steht noch aus.',
    reopenTriggers: ['WCAG AA Kontrast-Check bestanden'],
    reopenAction: 'Als Standard-Theme in Foundry Dashboard CAP-06 aufnehmen',
    reopenRelevance: 'Mittel',
    dependencies: ['Tailwind v4', 'Lucide React'],
    cost: '0.00 € (MIT)',
    hosting: 'Static Edge CDN',
    evidence: 'In 3 Prototypen erprobt.',
    relationships: ['OBJ-15K-02'],
    lastReviewed: '2024-01-08',
    nextReviewInDays: 6,
    section: 'review'
  },
  {
    id: 'OBJ-15K-10',
    title: 'Tool: n8n',
    subtitle: 'Workflow Automation · Self-Hosted / Cloud',
    type: 'Workflow / Automation Engine',
    category: 'Tool',
    tags: ['Tool', 'Automation', 'Integration'],
    source: 'github.com/n8n-io/n8n',
    whatItDoes: 'Visuelle Workflow-Automatisierung mit über 400 Integrationen, komplett auf eigenem Server betreibbar.',
    value: 'Spart teure Zapier-Abos (50–200 € / Monat) bei komplexen Multi-Step Pipelines.',
    whereItFits: 'Foundry Automation Layer',
    currentState: 'Approved candidate',
    role: 'Automation Default',
    whyNotNow: 'Container-Ressourcenverbrauch bei kleinen 1GB-VPS evaluieren.',
    reopenTriggers: ['Automations-Bedarf mit mehr als 5 Drittsystemen'],
    reopenAction: 'Docker-Compose Vorlage in Registry hinterlegen',
    reopenRelevance: 'Hoch',
    dependencies: ['Docker', 'Node.js', 'PostgreSQL / SQLite'],
    cost: 'free (Sustainable Use License)',
    hosting: 'Self-Hosted Docker',
    evidence: 'In Baustellen-MVP für Webhook-Verarbeitung aktiv.',
    relationships: ['OBJ-15K-01'],
    lastReviewed: '2024-01-07',
    nextReviewInDays: 10,
    section: 'registry'
  },
  {
    id: 'OBJ-15K-11',
    title: 'Datenquelle: BMG Verzeichnis',
    subtitle: 'Öffentliche Arztdaten · CSV Import Pipeline',
    type: 'Data Asset / Ingestion Pipeline',
    category: 'Datenquelle',
    tags: ['Datenquelle', 'Health', 'ETL'],
    source: 'Bundesministerium für Gesundheit Open Data',
    whatItDoes: 'Liefert strukturierte Stammdaten deutscher Fachärzte und Kliniken inklusive Fachgebiete und PLZ.',
    value: 'Ermöglicht sofortige Validierung von Überweisungen und Adressen in Healthcare-SaaS.',
    whereItFits: 'Foundry Data Layer',
    currentState: 'Armed',
    role: 'Reference Data',
    whyNotNow: 'Quartals-Update für Q1 steht noch aus.',
    reopenTriggers: ['Start einer neuen Ärzte-SaaS Initiative'],
    reopenAction: 'In SQLite Datenbank einpflegen und FTS5 Index aktualisieren',
    reopenRelevance: 'Mittel',
    dependencies: ['Python ETL Script', 'SQLite'],
    cost: 'free (Open Data)',
    hosting: 'Lokal',
    evidence: '142.000 Datensätze bereinigt vorhanden.',
    relationships: ['OBJ-15K-02'],
    lastReviewed: '2024-01-06',
    nextReviewInDays: 18,
    section: 'portfolio'
  },
  {
    id: 'OBJ-15K-12',
    title: 'Code: WhatsApp Connector',
    subtitle: 'Schnittstelle für Terminanfragen · Twilio / Baileys',
    type: 'Integration Code / Webhook Adapter',
    category: 'Code',
    tags: ['Integration', 'WhatsApp', 'Webhook'],
    source: 'Internal Inbound Adapter',
    whatItDoes: 'Empfängt eingehende Textnachrichten, Bilder und Sprachnachrichten von WhatsApp und leitet sie als JSON weiter.',
    value: 'Erlaubt Endkunden-Interaktion ohne App-Download direkt im gewohnten Messenger.',
    whereItFits: 'Inbound Gateways',
    currentState: 'Needs clarification',
    role: 'Integration Adapter',
    whyNotNow: 'Wahl zwischen offizieller Meta Cloud API (gebührenpflichtig) und Baileys OSS Socket.',
    reopenTriggers: ['Kunde akzeptiert Meta Cloud API Konversationskosten'],
    reopenAction: 'Meta App Review einreichen und Produktiv-Token anlegen',
    reopenRelevance: 'Hoch',
    dependencies: ['Node.js', 'FastAPI'],
    cost: '0.00 € Code · ~0.03 € / Meta Konversation',
    hosting: 'Containerized',
    evidence: 'In Elektro-Pilot erfolgreich getestet.',
    relationships: ['OBJ-15K-07'],
    lastReviewed: '2024-01-05',
    nextReviewInDays: 3,
    section: 'review'
  }
];

export const FOUNDRY_CAPABILITIES: FoundryCapability[] = [
  {
    id: 'CAP-01',
    name: 'OCR & Document Parsing',
    domain: 'Document Intelligence',
    defaultProvider: 'Surya OCR + Structured Schema Validator',
    fallbackProvider: 'Cloud Vision Fallback',
    status: 'Standardized',
    costProfile: '0.00 € fix · 0.002 € / Seite',
    usedInCount: 4,
    linkedObjectId: 'OBJ-15K-05',
    summary: 'Texterkennung für PDFs, Bilder und gescannte Dokumente mit Konfidenz-Scoring.'
  },
  {
    id: 'CAP-02',
    name: 'Auth & Session Guard',
    domain: 'Identity & Access',
    defaultProvider: 'PocketBase Auth / Supabase RLS',
    fallbackProvider: 'Lucia / JWT Hardened',
    status: 'Standardized',
    costProfile: '0.00 € (Self-Hosted)',
    usedInCount: 5,
    linkedObjectId: 'OBJ-15K-01',
    summary: 'Nutzer-Authentifizierung und Rollen (Multi-Tenant) ohne externe SaaS-Gebühren.'
  },
  {
    id: 'CAP-03',
    name: 'File Storage & Evidence Vault',
    domain: 'Storage Layer',
    defaultProvider: 'PocketBase Storage / Hetzner S3',
    fallbackProvider: 'Cloudflare R2',
    status: 'Standardized',
    costProfile: '~1.50 € / 100 GB',
    usedInCount: 4,
    linkedObjectId: 'OBJ-15K-01',
    summary: 'Sichere Dateiablage mit Metadaten, Prüfsummen und GoBD-konformer Versionierung.'
  },
  {
    id: 'CAP-04',
    name: 'Dashboard & Control Surfaces',
    domain: 'Interface Layer',
    defaultProvider: 'shadcn/ui + Tailwind v4',
    fallbackProvider: 'Minimal HTML/HTMX Readout',
    status: 'Standardized',
    costProfile: '0.00 € (MIT)',
    usedInCount: 6,
    linkedObjectId: 'OBJ-15K-09',
    summary: 'Admin- und Kunden-Dashboard mit Tabular-Nums, schnellen Filtern und Ampel-Status.'
  },
  {
    id: 'CAP-05',
    name: 'Notifications & Dispatch',
    domain: 'Communication',
    defaultProvider: 'Resend / SMTP + Webhook Bus',
    fallbackProvider: 'Telegram / Pushover Alert',
    status: 'Standardized',
    costProfile: '0.00 € bis 3.000 Events',
    usedInCount: 5,
    linkedObjectId: 'OBJ-15K-02',
    summary: 'E-Mail, In-App und WhatsApp Benachrichtigungen bei neuen Vorgängen oder Alarmen.'
  },
  {
    id: 'CAP-06',
    name: 'Search & Lexical Indexing',
    domain: 'Retrieval',
    defaultProvider: 'SQLite FTS5 / PostgreSQL tsvector',
    fallbackProvider: 'Meilisearch',
    status: 'Ready',
    costProfile: '0.00 €',
    usedInCount: 3,
    linkedObjectId: 'OBJ-15K-01',
    summary: 'Millisekunden-schnelle Volltextsuche über Akten, Rechnungen und Baustellennotizen.'
  },
  {
    id: 'CAP-07',
    name: 'Workflow Automation',
    domain: 'Orchestration',
    defaultProvider: 'n8n Self-Hosted',
    fallbackProvider: 'In-Process Cron Workers',
    status: 'Ready',
    costProfile: '0.00 €',
    usedInCount: 3,
    linkedObjectId: 'OBJ-15K-10',
    summary: 'Flexible Workflows für Datenverarbeitung und Drittsystem-Anbindung.'
  },
  {
    id: 'CAP-08',
    name: 'Vector Memory & Context Graph',
    domain: 'Semantic Layer',
    defaultProvider: 'pgvector / sqlite-vec',
    fallbackProvider: 'Embeddings Memory Buffer',
    status: 'Evaluating',
    costProfile: '0.00 €',
    usedInCount: 2,
    linkedObjectId: 'OBJ-15K-06',
    summary: 'KI-gestützte semantische Zuordnung von Dokumenten zu bestehenden Projekten.'
  }
];

// Signals matching Screenshot 3
export const INITIAL_SIGNALS: TriggerMatchSignal[] = [
  {
    id: 'SIG-01',
    signalName: 'EU-konformes Whisper/TTS-Hosting unter 0.015 €/Minute',
    source: 'Tech News',
    matchingObjectIds: ['OBJ-15K-02'],
    relevance: 'Hoch',
    timestamp: '10:24'
  },
  {
    id: 'SIG-02',
    signalName: 'SIP-Latenz < 400ms in EU-Region',
    source: 'Monitoring',
    matchingObjectIds: ['OBJ-15K-02'],
    relevance: 'Mittel',
    timestamp: '09:41'
  },
  {
    id: 'SIG-03',
    signalName: 'Hosting-Budget < 5 € / Monat',
    source: 'Preis-Tracking',
    matchingObjectIds: ['OBJ-15K-01', 'OBJ-15K-02'],
    relevance: 'Hoch',
    timestamp: '08:12'
  },
  {
    id: 'SIG-04',
    signalName: 'Pilotkunde akzeptiert Ticket-Modus',
    source: 'Kunden-Feedback',
    matchingObjectIds: ['OBJ-15K-02', 'OBJ-15K-07'],
    relevance: 'Kritisch',
    timestamp: '07:56'
  }
];

// Active Initiatives matching Screenshot 4
export const INITIAL_INITIATIVES: ActiveInitiative[] = [
  {
    id: 'INIT-BAU-01',
    name: 'Baustellen-Dokumentenassistent',
    code: 'Kundenprojekt · BauGrund OS',
    stage: 'Building (In Ausführung seit 14 Min)',
    progress: 78,
    stackSummary: 'PocketBase · Surya OCR · shadcn/ui · n8n',
    nextMilestone: 'Tests ausführen & Kundengebung deployen',
    updatedAt: '08.01.2024, 14:26',
    linkedObjectIds: ['OBJ-15K-01', 'OBJ-15K-05', 'OBJ-15K-07'],
    description: 'Automatisierte Erfassung, Klassifikation und Ablage von Baustellendokumenten über WhatsApp für die Müller Bau GmbH.',
    clientRequestId: 'REQ-2024-012',
    customerName: 'Müller Bau GmbH',
    goalSummary: 'Dokumenteneingang automatisieren und Projekten zuordnen',
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
      { step: 4, title: 'Tests ausführen', description: 'Unit Tests, Integrations-Tests, Akzeptanz-Tests', duration: '~ 4 Min', status: 'PENDING' },
      { step: 5, title: 'Kundenumgebung deployen', description: 'Konfiguration, Datenmigration, Go-Live', duration: '~ 3 Min', status: 'PENDING' }
    ],
    activityLogs: [
      { time: '14:26', title: 'Build gestartet', description: 'Build Pipeline initialisiert' },
      { time: '14:28', title: 'Infrastruktur bereit', description: 'PocketBase Instanz erstellt' },
      { time: '14:30', title: 'OCR Pipeline integriert', description: 'Modul aus Registry (v2.1)' },
      { time: '14:33', title: 'WhatsApp Adapter Build läuft', description: '4 von 6 Schritten abgeschlossen' }
    ],
    foundryGain: {
      capabilityName: 'WhatsApp Document Intake',
      description: 'Generischer Dokumenten-Intake über WhatsApp mit Datei-Parsing, OCR und Metadaten-Extraktion.',
      savedAsCandidate: false
    }
  }
];

export const ACTIVE_INITIATIVES = INITIAL_INITIATIVES;

// Requests matching Screenshot 1 & 2 & Foundry OS Split View
export const INITIAL_CLIENT_REQUESTS: ClientRequest[] = [
  {
    id: 'REQ-2026-01',
    customerNumber: 'REQ-2026-01',
    customerName: 'Weber Elektroanlagen GmbH',
    company: 'Weber Elektroanlagen GmbH',
    industry: 'Handwerk & Elektroinstallation',
    companySize: '14 Monteure + 3 Büro',
    location: 'Nürnberg, DE',
    isNewCustomer: true,
    sourceChannel: 'E-Mail',
    urgency: 'Hoch',
    projectType: 'WhatsApp-Pipeline & Abrechnungs-Cockpit',
    budgetRange: '15.000 – 30.000 €',
    targetLiveWeeks: 'in 4 Wochen',
    rawRequest:
      'Ich leite einen kleinen Elektrobetrieb mit 14 Monteuren. Die Jungs schicken Lieferscheine, Baustellenfotos und handschriftliche Aufmaß-Zettel kreuz und quer über WhatsApp in verschiedene Gruppen. Ich will, dass alle Dokumente automatisch dem richtigen Projekt zugeordnet werden, fehlende Lieferscheine rot markiert sind und ich im Büro ein einfaches Dashboard habe, wo ich sofort sehe, was für die Abrechnung noch fehlt.',
    problemStatement:
      'Lieferscheine, Fotos und handschriftliche Aufmaße kommen ungeordnet über mehrere WhatsApp-Gruppen. Fehlende Belege verzögern Rechnungsstellung.',
    goals: [
      'Automatische Zuordnung aller WhatsApp-Dokumente zu Projekten',
      'Handschriften- und Belegextraktion (OCR) für Aufmaß-Zettel',
      'Prüffach für unklare Belege & 1-Klick Zuweisung im Büro',
      'Signalrote Markierung für fehlende Lieferscheine',
      'Übersichtliches Dashboard mit Ampelstatus für Abrechnungsreife'
    ],
    expectedOutcome:
      'Zentrales Büro-Cockpit mit automatischer WhatsApp-Pipeline und sofortiger Transparenz über abrechnungsbereite Baustellen.',
    desiredOutcome:
      'Zentrales Büro-Cockpit mit automatischer WhatsApp-Pipeline und sofortiger Transparenz über abrechnungsbereite Baustellen.',
    currentProcess:
      '14 Monteure schicken Zettel in diverse Gruppen. Büro tippt ab und sucht fehlende Lieferscheine tagelang zusammen.',
    userCount: 17,
    monthlyBudget: '800 – 1.500 €',
    targetPrice: 240,
    integrations: ['WhatsApp Cloud API', 'OCR Engine', 'PocketBase Storage', 'E-Mail Benachrichtigung'],
    constraints: ['Keine App-Installation für die 14 Monteure (muss rein über WhatsApp laufen)', 'DSGVO-konform'],
    selfHostingRequired: true,
    complianceNotes: 'DSGVO-konform, Hosting Hetzner Nürnberg',
    deadline: '15.11.2026',
    notes: 'Kritisch: Rote Signalmarkierung für fehlende Lieferscheine ist der Haupthebel für schnellen Cashflow.',
    state: 'In Analyse',
    createdAt: '08. Okt. 2026, 14:00 Uhr',
    processMap: {
      title: 'WhatsApp-Dokumentenfluss & Abrechnungs-Radar (14 Monteure)',
      summary: 'Event Storming Modell: Von WhatsApp-Gruppen über Handschrift-OCR bis zum Abrechnungs-Cockpit mit Fehlteile-Radar.',
      understandingScore: 94,
      confirmedCount: 7,
      inferredCount: 2,
      unclearCount: 1,
      questionCount: 1,
      nodes: [
        {
          id: 'NODE-01',
          type: 'ACTOR',
          title: '14 Monteure vor Ort auf Baustellen',
          actorOrSubject: 'Monteure / Techniker',
          status: 'CONFIRMED',
          statusReason: 'Explizit im Kundentext genannt („14 Monteure“)',
          rationale: 'Ausgangspunkt des Prozesses: Die 14 Monteure dokumentieren Material, Zettel und Fortschritt direkt vor Ort.',
          sourceQuote: 'Ich leite einen kleinen Elektrobetrieb mit 14 Monteuren. Die Jungs schicken Lieferscheine, Baustellenfotos und handschriftliche Aufmaß-Zettel...',
          authorizedRoles: '14 Monteure (Außendienst)',
          notifyCustomer: false,
          requiredData: ['Smartphone mit WhatsApp', 'Foto-Kamera', 'Baustellen-Material']
        },
        {
          id: 'NODE-02',
          type: 'COMMAND',
          title: 'Senden Fotos, Lieferscheine & Aufmaße per WhatsApp',
          actorOrSubject: 'Monteure via WhatsApp-Gruppen',
          status: 'CONFIRMED',
          statusReason: 'Explizit im Kundentext genannt („kreuz und quer über WhatsApp“)',
          rationale: 'Niedrigschwelliger Versand ohne App-Download: Monteure nutzen ihre gewohnten Chat-Gruppen.',
          sourceQuote: '...schicken Lieferscheine, Baustellenfotos und handschriftliche Aufmaß-Zettel kreuz und quer über WhatsApp in verschiedene Gruppen.',
          failureHandling: 'Offline-Pufferung im Smartphone; automatische Nachsendung bei Netzempfang.',
          authorizedRoles: 'Monteure',
          notifyCustomer: 'Automatische WhatsApp-Eingangsbestätigung („Beleg registriert“)',
          requiredData: ['Foto vom Lieferschein', 'Foto vom handschriftlichen Aufmaßzettel', 'Baustellenfoto']
        },
        {
          id: 'NODE-03',
          type: 'EVENT',
          title: 'WhatsApp-Nachricht & Beleg eingegangen',
          actorOrSubject: 'WhatsApp Ingestion Gateway',
          status: 'CONFIRMED',
          statusReason: 'Technisch zwingender Eingangspunkt der Pipeline',
          rationale: 'Zentraler Empfangspunkt über die WhatsApp Cloud API. Trennt Mediendaten und Metadaten (Absender, Gruppe, Zeit).',
          sourceQuote: '...über WhatsApp in verschiedene Gruppen.',
          failureHandling: 'Idempotente Webhook-Warteschlange (verhindert Doppeleinreichungen bei schlechtem Netz).',
          authorizedRoles: 'System Automation',
          notifyCustomer: false,
          requiredData: ['Sender-ID / Telefonnummer', 'WhatsApp Gruppen-ID', 'Media-URL / Bildstrom']
        },
        {
          id: 'NODE-04',
          type: 'POLICY',
          title: 'Handschrift-OCR & Projekt-Matching durchführen',
          actorOrSubject: 'OCR-Engine & Confidence-Router',
          status: 'INFERRED',
          statusReason: 'Logisch von Jev abgeleitet, um handschriftliche Zettel & Lieferscheine automatisch zuzuordnen',
          rationale: 'Extrahiert Lieferscheinnummern, Kundenadressen und Handschrift von Aufmaß-Zetteln und gleicht sie mit dem Baustellenstamm ab.',
          sourceQuote: 'Ich will, dass alle Dokumente automatisch dem richtigen Projekt zugeordnet werden...',
          failureHandling: 'Zweige: Bei Konfidenz ≥ 85% sofortige Zuordnung (Pfad A), sonst Weiterleitung ins Büro-Prüffach (Pfad B).',
          authorizedRoles: 'AI OCR Model & Match Engine',
          notifyCustomer: false,
          requiredData: ['Projektstamm / Kundenadressen', 'Textextrakt aus Handschrift', 'Geokoordinaten']
        },
        {
          id: 'NODE-05',
          type: 'COMMAND',
          title: 'Pfad A: Sicher erkannt (≥ 85%) → Sofort Projekt zuordnen',
          actorOrSubject: 'Automatischer Zuweiser',
          status: 'CONFIRMED',
          branch: 'success',
          statusReason: 'Hauptziel des Kunden („automatisch dem richtigen Projekt zugeordnet“)',
          rationale: 'Eindeutige Dokumente (z.B. Lieferschein mit bekannter Projektnummer) werden in Millisekunden vollautomatisch archiviert.',
          sourceQuote: '...dass alle Dokumente automatisch dem richtigen Projekt zugeordnet werden',
          failureHandling: 'Revisionssichere Protokollierung mit Rückgängig-Möglichkeit für das Büro.',
          authorizedRoles: 'System Bot',
          notifyCustomer: false,
          requiredData: ['Projekt-ID', 'Dokumententyp (Lieferschein / Aufmaß / Foto)', 'Extrahierte Beträge/Mengen'],
          linkedUiComponent: 'Projektakte & Dokumentenliste',
          linkedScreenName: 'Projekt-Ablage'
        },
        {
          id: 'NODE-06',
          type: 'EXCEPTION',
          title: 'Pfad B: Unsicher / Handschrift unklar → In Büro-Prüffach leiten',
          actorOrSubject: 'Prüffach-Router',
          status: 'INFERRED',
          branch: 'uncertain',
          statusReason: 'Sicherheits-Mechanismus gegen Fehlzuordnung bei handschriftlichen Aufmaßen',
          rationale: 'Handschriftliche Notizen und unklare Baustellenfotos dürfen nicht verloren gehen oder falsch abgelegt werden.',
          sourceQuote: '...handschriftliche Aufmaß-Zettel kreuz und quer in verschiedene Gruppen...',
          failureHandling: 'Beleg erhält Status „UNKLAR“ und wird im Büro-Dashboard mit Top-3-Projektvorschlägen präsentiert.',
          authorizedRoles: 'System Exception Handler',
          notifyCustomer: false,
          requiredData: ['Dokument-ID', 'Konfidenzwert (z.B. 48%)', 'Top-Kandidaten-Baustellen'],
          linkedUiComponent: 'Prüffach & Triage-Liste',
          linkedScreenName: 'Büro-Prüffach'
        },
        {
          id: 'NODE-07',
          type: 'ACTOR',
          title: 'Büromitarbeiter prüft & ordnet mit 1 Klick zu',
          actorOrSubject: 'Büromitarbeiter / Innendienst',
          status: 'CONFIRMED',
          branch: 'uncertain',
          statusReason: 'Explizit für Büro gefordert („ich im Büro ein einfaches Dashboard habe“)',
          rationale: 'Menschliche Expertise löst Zweifelsfälle in Sekunden durch 1-Klick-Bestätigung des wahrscheinlichsten Projekts.',
          sourceQuote: '...und ich im Büro ein einfaches Dashboard habe...',
          failureHandling: 'Rückfrage-Button, um Monteur direkt aus der Maske per WhatsApp um Klarstellung zu bitten.',
          authorizedRoles: 'Büro / Assistenz / Bauleiter',
          notifyCustomer: 'Optional: Rückfrage an Monteur',
          requiredData: ['Dokumentenvorschau', 'Projekt-Schnellauswahl'],
          linkedUiComponent: 'Manuelle 1-Klick Zuordnung',
          linkedScreenName: 'Büro-Prüffach'
        },
        {
          id: 'NODE-08',
          type: 'POLICY',
          title: 'Fehlteile-Radar: Vollständigkeitsprüfung für Abrechnung',
          actorOrSubject: 'Abrechnungs-Wächter & Regelwerk',
          status: 'CONFIRMED',
          statusReason: 'Kernanforderung des Kunden („fehlende Lieferscheine rot markiert“)',
          rationale: 'Gleicht verbuchte Materialbestellungen oder Monteur-Aufmaße gegen vorhandene Lieferscheine ab.',
          sourceQuote: '...fehlende Lieferscheine rot markiert sind...',
          failureHandling: 'Fehlt ein Beleg zur Abrechnungsposition, schlägt die Ampel des Projekts auf Rot um.',
          authorizedRoles: 'Regelwerk / Abrechnungslogik',
          notifyCustomer: false,
          requiredData: ['Auftragspositionen', 'Vorhandene Lieferscheine', 'Aufmaß-Gesamtsummen']
        },
        {
          id: 'NODE-09',
          type: 'EXCEPTION',
          title: 'Fehlender Lieferschein signalrot markiert',
          actorOrSubject: 'Alarm- und Ampel-Engine',
          status: 'CONFIRMED',
          statusReason: 'Explizite Kundenanforderung („fehlende Lieferscheine rot markiert sind“)',
          rationale: 'Verhindert, dass Rechnungen ohne Nachweis gestellt werden oder Geld durch vergessene Belege verloren geht.',
          sourceQuote: '...fehlende Lieferscheine rot markiert sind und ich sofort sehe, was für die Abrechnung noch fehlt.',
          failureHandling: 'Sammelliste offener Belege exportierbar zur Nachforderung beim Großhändler oder Monteur.',
          authorizedRoles: 'Büroteam & Geschäftsführung',
          notifyCustomer: false,
          requiredData: ['Fehlender Belegtyp', 'Betroffenes Gewerk/Projekt', 'Verzugstage'],
          linkedUiComponent: 'Rot-Ampel & Fehlteile-Badge',
          linkedScreenName: 'Abrechnungs-Cockpit'
        },
        {
          id: 'NODE-10',
          type: 'READ_MODEL',
          title: 'Büro-Dashboard: Revisionssichere Akte & Abrechnungs-Cockpit',
          actorOrSubject: 'Zentrales Büro-Cockpit',
          status: 'CONFIRMED',
          statusReason: 'Hauptanforderung („einfaches Dashboard, wo ich sofort sehe, was für die Abrechnung noch fehlt“)',
          rationale: 'Auf einen Blick sichtbare Übersicht aller 14 Monteure, geordnet nach Projekten, mit Ampel grün/rot.',
          sourceQuote: '...und ich im Büro ein einfaches Dashboard habe, wo ich sofort sehe, was für die Abrechnung noch fehlt.',
          authorizedRoles: 'Geschäftsleitung Weber Elektroanlagen, Bürokräfte',
          notifyCustomer: false,
          requiredData: ['Projektübersicht', 'Status Abrechnungsreife', 'Vollständigkeitsquote in %'],
          linkedUiComponent: 'Abrechnungs-Cockpit & Baustellen-Monitor',
          linkedScreenName: 'Dashboard'
        },
        {
          id: 'NODE-11',
          type: 'POLICY',
          title: 'Klärungsfrage: Automatische WhatsApp-Rückfrage an Monteur?',
          actorOrSubject: 'Prozess-Owner / Geschäftsleitung',
          status: 'QUESTION',
          statusReason: 'Muss noch vor der Implementierung geklärt werden',
          rationale: 'Soll das System den Monteur automatisch in der WhatsApp-Gruppe anpingen („Bitte leserliches Foto von Aufmaß Baustelle X nachreichen“) oder entscheidet immer zuerst das Büro?',
          sourceQuote: '...kreuz und quer über WhatsApp in verschiedene Gruppen.',
          failureHandling: 'Klärung im Process Contract: Standard ist „Büro prüft zuerst im Prüffach, bevor Monteure kontaktiert werden“.',
          authorizedRoles: 'Geschäftsleitung',
          notifyCustomer: true,
          requiredData: ['Monteur-Telefonnummern', 'Gruppenberechtigungen']
        }
      ]
    },
    deltaMetrics: {
      reuseScore: 89,
      deltaSize: 11,
      deltaCriticality: 'Niedrig',
      humanTouch: 'Gering',
      humanTouchMinutes: 12,
      reuseScoreText: '89 % der Module aus der Foundry Registry wiederverwendbar.',
      deltaSizeText: 'Nur WhatsApp Gruppen-Adapter & Handschrift-OCR Konfiguration nötig.',
      deltaCriticalityText: 'Standard Webhook & File Storage, kein Risiko.',
      humanTouchText: '12 Min. für WhatsApp Cloud API Webhook Secrets.'
    },
    matchingPatterns: [
      { id: 'PAT-E01', title: 'WhatsApp Handwerker Board', score: 95, description: 'Gruppen-Intake für 14 Monteure mit OCR & Ampel.', isRecommended: true },
      { id: 'PAT-E02', title: 'Lieferschein Vault', score: 88, description: 'Revisionssichere Belegablage mit Fehlteile-Radar.' }
    ],
    assembledComponents: {
      reused: [
        { id: 'C-01', name: 'WhatsApp Cloud Ingestion', tag: 'Core' },
        { id: 'C-02', name: 'Foundry OCR Engine', tag: 'Core' },
        { id: 'C-03', name: 'PocketBase DB & Auth', tag: 'Core' },
        { id: 'C-04', name: 'Prüffach Triage UI', tag: 'Core' }
      ],
      missing: [
        { id: 'M-01', name: 'Fehlteile-Radar Worker', tag: 'Neu', description: 'Signalrote Markierung bei fehlendem Lieferschein' }
      ]
    },
    uiPreview: {
      appName: 'Weber Elektro OS',
      logoText: 'WE',
      industry: 'Handwerk & Elektroinstallation',
      activeProjectsCount: 14,
      documentsCount: 218,
      openTasksCount: 3,
      projects: [
        { name: 'Neubau Ärztehaus (14 Monteure)', status: 'In Bau', progress: 75, lastActivity: 'vor 12 Min.' },
        { name: 'Sanierung Wohnpark West', status: 'Prüfung', progress: 90, lastActivity: 'vor 1 Std.' },
        { name: 'Gewerbebau Halle 4', status: 'Planung', progress: 30, lastActivity: 'vor 3 Std.' }
      ]
    }
  },
  {
    id: 'REQ-2026-017',
    customerNumber: 'K-2026-017',
    customerName: 'Hoffmann Bau GmbH',
    company: 'Hoffmann Bau GmbH',
    industry: 'Mittelstand • Bau & Sanierung',
    companySize: '25–100 MA',
    location: 'München, DE',
    isNewCustomer: true,
    sourceChannel: 'Website / Kontaktformular',
    urgency: 'Hoch',
    projectType: 'Web-App / Kundenportal',
    budgetRange: '25.000 – 50.000 €',
    targetLiveWeeks: 'in 6–8 Wochen',
    rawRequest:
      'Kunden und Handwerker schicken uns ständig Baustellenfotos und Lieferscheine per WhatsApp oder E-Mail. Unsere Bauleiter und Kunden haben keinen transparenten Überblick über den Projektfortschritt. Oft wissen wir im Büro nicht sofort, zu welcher Baustelle ein Foto gehört – zum Beispiel wenn Herr Müller vom Bauhof nur "Hier die Rohre" schreibt. Wir brauchen ein Kundenportal für Bauprojekte mit automatischer Projekterkennung, wo unklare Fotos in ein Prüffach für das Büro laufen, Dokumentenmanagement mit Plänen, transparentem Projektstatus und direkter Kommunikation zwischen Bauherren und Bauleitern.',
    problemStatement:
      'Aktuell viele E-Mails und manuelle Dateiablage. Unklare Fotos führen zu Fehlern und Verzögerungen. Kunden haben keinen transparenten Überblick über den Projektfortschritt.',
    goals: [
      'Transparenter Projektstatus für Bauherren & Handwerker',
      'Automatische Projekterkennung & Prüffach für unklare Fotos',
      'Sichere Dokumentenablage für Pläne und Freigaben',
      'Direkte Kommunikation (Nachrichten mit Lesebestätigung)',
      'Rollenbasierter Zugriff für Kunden, Bauleiter und Subunternehmer'
    ],
    expectedOutcome:
      'Eine moderne, sofort erlebbare Web-App, die Bauprojekte digital abbildet, Fehlzuordnungen eliminiert und die Kommunikation transparent macht.',
    desiredOutcome:
      'Eine moderne, sofort erlebbare Web-App, die Bauprojekte digital abbildet, Fehlzuordnungen eliminiert und die Kommunikation transparent macht.',
    currentProcess:
      'Fotos und Lieferscheine kommen ungeordnet per WhatsApp/Mail. Büro verbringt täglich 2 Stunden mit Zuweisung und telefonischen Nachfragen.',
    userCount: 35,
    monthlyBudget: '1.200 – 2.000 €',
    targetPrice: 280,
    integrations: ['WhatsApp / Benachrichtigung', 'PDF / Pläne Storage', 'E-Mail Dispatch', 'Rollen-Login', 'KI-Bild- & OCR-Pipeline'],
    constraints: ['Einfache Bedienung für Bauherren & Handwerker', 'DSGVO konform', 'Mobil optimiert auf Baustellen'],
    selfHostingRequired: true,
    complianceNotes: 'DSGVO-konform, Hosting in Deutschland (Hetzner)',
    deadline: '01.12.2026',
    notes: 'Priorität auf Verstehen vor Bauen: Erst Living Process Map bestätigen, dann UX Preview testen.',
    state: 'In Analyse',
    createdAt: '02. Okt. 2026, 09:14 Uhr',
    processMap: {
      title: 'Baustellenfoto & Dokumenten-Intake Prozess',
      summary: 'Event Storming Modell: Vom Smartphone auf der Baustelle bis zur revisionssicheren Projektakte mit intelligentem Prüffach.',
      understandingScore: 88,
      confirmedCount: 6,
      inferredCount: 2,
      unclearCount: 1,
      questionCount: 1,
      nodes: [
        {
          id: 'NODE-01',
          type: 'ACTOR',
          title: 'Kunde / Handwerker vor Ort',
          actorOrSubject: 'Bauherr / Handwerker',
          status: 'CONFIRMED',
          statusReason: 'Explizit im Kundentext genannt',
          rationale: 'Ausgangspunkt des Prozesses: Die Person vor Ort auf der Baustelle dokumentiert den Baufortschritt oder Materiallieferungen.',
          sourceQuote: 'Kunden und Handwerker schicken uns ständig Baustellenfotos und Lieferscheine per WhatsApp oder E-Mail.',
          authorizedRoles: 'Kunde, Bauleiter, Subunternehmer',
          notifyCustomer: false,
          requiredData: ['Smartphone', 'Foto-Kamera', 'WhatsApp / Mobil-Browser']
        },
        {
          id: 'NODE-02',
          type: 'COMMAND',
          title: 'Sendet Baustellenfoto & Notiz ein',
          actorOrSubject: 'Kunde / Handwerker',
          status: 'CONFIRMED',
          statusReason: 'Explizit im Kundentext genannt',
          rationale: 'Übertragung von Fotos, Lieferscheinen oder Mängeln direkt von der Baustelle.',
          sourceQuote: '...schicken uns ständig Baustellenfotos und Lieferscheine per WhatsApp oder E-Mail.',
          failureHandling: 'Offline-Pufferung im Mobil-Web / WhatsApp Retry bei Netzschwäche.',
          authorizedRoles: 'Alle Baustellenbeteiligten',
          notifyCustomer: 'Eingangsbestätigung "Foto erhalten"',
          requiredData: ['Bilddatei', 'Optionale Sprach-/Textnotiz', 'EXIF-Metadaten'],
          linkedUiComponent: 'Foto-Upload & Chat-Widget',
          linkedScreenName: 'Baustellen & Fotos',
          reverseTraceabilityExplanation: 'Dieser Upload-Button existiert, damit Handwerker und Kunden ohne Login-Hürde direkt Fotos einreichen können.'
        },
        {
          id: 'NODE-03',
          type: 'EVENT',
          title: 'Foto eingegangen & validiert',
          actorOrSubject: 'Foundry Ingestion Service',
          status: 'CONFIRMED',
          statusReason: 'Logisch verifiziert durch Intake-Pipeline',
          rationale: 'Eingehende Mediendaten müssen normalisiert, auf Integrität geprüft und für OCR/Vision vorbereitet werden.',
          sourceQuote: 'Wir brauchen ein Kundenportal für Bauprojekte mit automatischer Projekterkennung...',
          failureHandling: 'Formatkonvertierung (HEIC -> WebP/JPEG), Virenscan.',
          authorizedRoles: 'System Automation',
          notifyCustomer: false,
          requiredData: ['Upload-ID', 'Dateiformat', 'Dateigröße']
        },
        {
          id: 'NODE-04',
          type: 'POLICY',
          title: 'Projekt automatisch erkennen',
          actorOrSubject: 'KI-Triage & Regelwerk',
          status: 'INFERRED',
          statusReason: 'Jev hat es logisch aus der Kundenproblematik abgeleitet',
          rationale: 'Automatische Zuordnung anhand Absender-Rufnummer, Geofence-Koordinaten und Texterkennung (OCR).',
          sourceQuote: 'Oft wissen wir im Büro nicht sofort, zu welcher Baustelle ein Foto gehört – zum Beispiel wenn Herr Müller vom Bauhof nur "Hier die Rohre" schreibt.',
          failureHandling: 'Gabelung: Bei Konfidenz >= 85% sofortige Zuordnung (Pfad A), sonst ins Prüffach (Pfad B).',
          authorizedRoles: 'Vision Model / Rule Engine',
          notifyCustomer: false,
          requiredData: ['Geofence der Baustellen', 'Telefonbuch der Bauherren', 'OCR-Textextrakt']
        },
        {
          id: 'NODE-05',
          type: 'COMMAND',
          title: 'Pfad A: Sicher erkannt → Projekt direkt zuordnen',
          actorOrSubject: 'Automatischer Zuweiser',
          status: 'CONFIRMED',
          statusReason: 'Bestätigt im Standard-Arbeitsablauf',
          branch: 'success',
          rationale: 'Wenn die Baustelle eindeutig ist (z.B. Bauherr Müller, Baustelle Neubau Müller), erfolgt die Zuordnung vollautomatisch ohne Verzögerung.',
          sourceQuote: '...digital abbildet und transparente Dateiablage',
          failureHandling: 'Im Fehlerfall Rückstufung zu unklar.',
          authorizedRoles: 'System Bot',
          notifyCustomer: false,
          requiredData: ['Projekt-ID', 'Bauabschnitt', 'Zeitstempel'],
          linkedUiComponent: 'Projekt-Akte & Baustellen-Stream',
          linkedScreenName: 'Baustellen & Fotos',
          reverseTraceabilityExplanation: 'Dieser Feed zeigt automatisch zugeordnete Baustellenfotos mit Zeitstempel und Gewerk.'
        },
        {
          id: 'NODE-06',
          type: 'EXCEPTION',
          title: 'Pfad B: Unsicher erkannt → In Prüffach leiten',
          actorOrSubject: 'Prüffach-Router',
          status: 'INFERRED',
          statusReason: 'Jev hat diesen Schutz-Mechanismus hinzugefügt',
          branch: 'uncertain',
          rationale: 'Wenn keine eindeutige Projektnummer oder Adresse erkennbar ist, darf das Foto nicht falsch abgelegt werden.',
          sourceQuote: '...wo unklare Fotos in ein Prüffach für das Büro laufen',
          failureHandling: 'Dokument erhält Tag "UNGEKLÄRT" und wird Büromitarbeitern mit hoher Dringlichkeit vorgelegt.',
          authorizedRoles: 'System Router',
          notifyCustomer: false,
          requiredData: ['Dokument-ID', 'Konfidenzwert (z.B. 42%)', 'Mögliche Projektkandidaten'],
          linkedUiComponent: 'Ungeklärte Dokumente (Prüffach)',
          linkedScreenName: 'Ungeklärte Dokumente',
          reverseTraceabilityExplanation: 'Dieser Screen existiert wegen: Event: PHOTO_UPLOADED, Policy: Confidence < threshold, Human Action: Büromitarbeiter ordnet Projekt manuell zu.'
        },
        {
          id: 'NODE-07',
          type: 'ACTOR',
          title: 'Büromitarbeiter prüft & ordnet manuell zu',
          actorOrSubject: 'Büromitarbeiter (Frau Weber)',
          status: 'CONFIRMED',
          statusReason: 'Explizit von Hoffmann Bau bestätigt',
          rationale: 'Menschliche Expertise löst Zweifelsfälle in Sekunden. Der Mitarbeiter sieht Vorschläge und wählt die richtige Baustelle mit 1 Klick.',
          sourceQuote: '...wo unklare Fotos in ein Prüffach für das Büro laufen',
          failureHandling: 'Möglichkeit, direkt beim Kunden/Handwerker nachzufragen.',
          authorizedRoles: 'Büro, Assistenz, Bauleiter',
          notifyCustomer: 'Optional: Rückfrage per WhatsApp senden',
          requiredData: ['Kandidatenliste Baustellen', 'Foto-Vorschau'],
          linkedUiComponent: 'Manuelle Zuordnungs-Aktion',
          linkedScreenName: 'Ungeklärte Dokumente',
          reverseTraceabilityExplanation: 'Ermöglicht dem Büromitarbeiter mit 1 Klick die richtige Baustelle auszuwählen.'
        },
        {
          id: 'NODE-08',
          type: 'READ_MODEL',
          title: 'Dokument gespeichert & revisionssicher abgelegt',
          actorOrSubject: 'Baudokumenten-Hub',
          status: 'CONFIRMED',
          statusReason: 'Explizit im Kernziel gefordert',
          rationale: 'Zentrale, revisionssichere Ablage mit Zeitstempel, Urheber, EXIF-Daten und Gewerk-Zuordnung.',
          sourceQuote: 'Dokumentenmanagement mit Plänen, transparentem Projektstatus...',
          authorizedRoles: 'Bauherr (Lesen), Bauleiter (Schreiben/Lesen)',
          notifyCustomer: false,
          requiredData: ['Speicherpfad', 'Vorschaubild', 'Kategorie (Rohbau, Sanitär, Mangel)'],
          linkedUiComponent: 'Dokumente-Grid & Planablage',
          linkedScreenName: 'Dokumente',
          reverseTraceabilityExplanation: 'Hier finden Bauherr und Bauleiter alle geprüften Dokumente und Fotos nach Gewerken sortiert.'
        },
        {
          id: 'NODE-09',
          type: 'EVENT',
          title: 'Büro & Bauherr sehen neuen Vorgang im Dashboard',
          actorOrSubject: 'Kundenportal & App-Feed',
          status: 'CONFIRMED',
          statusReason: 'Kernversprechen des Portals',
          rationale: 'Beide Parteien sehen den Baufortschritt in Echtzeit. Verhindert Anrufe wie "Sind die Rohre schon geliefert?".',
          sourceQuote: '...transparenter Überblick über den Projektfortschritt und direkte Kommunikation.',
          authorizedRoles: 'Alle Projektbeteiligten',
          notifyCustomer: 'Push-Benachrichtigung oder WhatsApp Digest',
          requiredData: ['Projekt-Feed', 'Aktivitäts-Log'],
          linkedUiComponent: 'Projekt-Dashboard & Aktivitäten',
          linkedScreenName: 'Dashboard',
          reverseTraceabilityExplanation: 'Verhindert zeitraubende Rückfragen per Telefon ("Sind die Rohre schon da?").'
        },
        {
          id: 'NODE-10',
          type: 'POLICY',
          title: 'Detailfrage: Automatische WhatsApp-Rückfrage an Kunde?',
          actorOrSubject: 'Prozess-Owner / Geschäftsleitung',
          status: 'QUESTION',
          statusReason: 'Muss noch vor der Implementierung geklärt werden',
          rationale: 'Soll bei unklarem Foto sofort automatisch via WhatsApp beim Handwerker nachgefragt werden ("Welche Baustelle meinst du?") oder soll immer zuerst ein Mensch im Büro entscheiden?',
          sourceQuote: '...wenn Herr Müller vom Bauhof nur "Hier die Rohre" schreibt.',
          failureHandling: 'Klären im Process Contract: Standard ist "Mensch entscheidet zuerst im Prüffach".',
          authorizedRoles: 'Geschäftsleitung Hoffmann Bau',
          notifyCustomer: true,
          requiredData: ['Kundenpräferenz Rückfragekanal', 'WhatsApp Template Freigabe']
        }
      ]
    },
    deltaMetrics: {
      reuseScore: 82,
      deltaSize: 18,
      deltaCriticality: 'Niedrig',
      humanTouch: 'Mittel',
      humanTouchMinutes: 18,
      reuseScoreText: 'Hohe Wiederverwendung vorhandener Komponenten.',
      deltaSizeText: 'Kleine Anpassungen erforderlich.',
      deltaCriticalityText: 'Keine kritischen Änderungen.',
      humanTouchText: 'Individuelle Anpassungen für Branche & Prozesse.'
    },
    matchingPatterns: [
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
    ],
    assembledComponents: {
      reused: [
        { id: 'C-01', name: 'Authentifizierung & Rollen', tag: 'Core' },
        { id: 'C-02', name: 'Projekt-Dashboard', tag: 'Core' },
        { id: 'C-03', name: 'Dokumentenverwaltung', tag: 'Core' },
        { id: 'C-04', name: 'Benachrichtigungen', tag: 'Core' },
        { id: 'C-05', name: 'Responsive UI-Layout', tag: 'Core' }
      ],
      missing: [
        { id: 'M-01', name: 'Bauprojekt-spezifische Ansicht', tag: 'Neu', description: 'Gewerke, Bauabschnitte & Baustellen-Kamera Stream' },
        { id: 'M-02', name: 'Kunden-Kommunikationsmodul', tag: 'Neu', description: 'Direktkanal zwischen Bauherr und Bauleiter' }
      ]
    },
    uiPreview: {
      appName: 'Hoffmann Bau',
      logoText: 'HB',
      industry: 'Mittelstand • Bau & Sanierung',
      activeProjectsCount: 12,
      documentsCount: 248,
      openTasksCount: 7,
      projects: [
        { name: 'Neubau Müller', status: 'In Bau', progress: 76, lastActivity: 'vor 2 Tagen' },
        { name: 'Sanierung Schulstr.', status: 'Planung', progress: 30, lastActivity: 'vor 5 Stunden' },
        { name: 'Wohnanlage West', status: 'Prüfung', progress: 60, lastActivity: 'vor 1 Tag' }
      ]
    },
    conveyorStage: 'Intake',
    analysis: {
      problemSummary:
        'Aktuell viele E-Mails und manuelle Dateiablage. Bauherren und Kunden haben keinen transparenten Überblick über den Baufortschritt.',
      desiredOutcome:
        'Kundenportal für Bauprojekte mit Dokumentenmanagement, Projektstatus und Kommunikation für Kunden und Bauleiter.',
      manualProcessSummary: [
        'E-Mails und Baupläne manuell per PDF weiterleiten (ca. 1,5 h/Tag)',
        'Telefonische Rückfragen von Bauherren zum aktuellen Stand beantworten (ca. 1 h/Tag)',
        'Mängellisten und Dokumente per E-Mail verstreut ablegen'
      ],
      successMetrics: [
        'Transparenter Projektstatus in Echtzeit für Kunden',
        'Zentrale, revisionssichere Dokumentenablage für Pläne und Freigaben',
        'Direkter Kommunikationskanal (Nachrichten mit Lesebestätigung)',
        'Rollengetrennter Zugriff (Kunde vs. Bauleiter vs. Subunternehmer)',
        'Go-Live in 6–8 Wochen'
      ],
      matchedCapabilities: [
        {
          capabilityId: 'CAP-02',
          name: 'Authentifizierung & Rollen',
          description: 'Rollen-Trennung (Kunde, Bauleiter, Admin) via PocketBase Auth',
          matchScorePercent: 95,
          source: 'PocketBase Core Auth',
          status: 'READY'
        },
        {
          capabilityId: 'CAP-04',
          name: 'Projekt-Dashboard',
          description: 'Übersichtliche KPI-Karten und Projektfortschritt-Listen',
          matchScorePercent: 90,
          source: 'Foundry Dashboard Preset',
          status: 'READY'
        },
        {
          capabilityId: 'CAP-03',
          name: 'Dokumentenverwaltung',
          description: 'Sichere Dateiablage mit Metadaten, Versionierung und PDF-Preview',
          matchScorePercent: 92,
          source: 'Evidence Vault',
          status: 'READY'
        },
        {
          capabilityId: 'CAP-05',
          name: 'Benachrichtigungen',
          description: 'E-Mail & Web-Push bei neuen Dokumenten und Status-Updates',
          matchScorePercent: 88,
          source: 'Foundry Dispatcher',
          status: 'READY'
        },
        {
          capabilityId: 'CAP-06',
          name: 'Responsive UI-Layout',
          description: 'Mobile und Desktop-fähige Shell mit Tailwind & shadcn',
          matchScorePercent: 96,
          source: 'shadcn Shell',
          status: 'READY'
        }
      ],
      reusableObjects: ['OBJ-15K-01', 'OBJ-15K-05', 'OBJ-15K-08'],
      missingCapabilities: [
        {
          name: 'Bauprojekt-spezifische Ansicht',
          description: 'Gewerke, Bauabschnitte & Baustellen-Fortschritt visualisiert',
          effortBadge: 'M',
          status: 'Geplant'
        },
        {
          name: 'Kunden-Kommunikationsmodul',
          description: 'Direktkanal mit Chat-Feed und Freigabe-Buttons',
          effortBadge: 'S',
          status: 'Geplant'
        }
      ],
      recommendedStack: [
        { layer: 'Frontend', selectedOption: 'React 19 + Tailwind CSS + Vite', rationale: 'Ultraschnell, component-based, modular' },
        { layer: 'Backend', selectedOption: 'PocketBase Go Binary', rationale: 'Single-Binary mit Auth, SQLite & File Storage' },
        { layer: 'Storage', selectedOption: 'PocketBase S3/Local Bucket', rationale: 'Automatisierte PDF-Vorschau und sichere URLs' },
        { layer: 'Hosting', selectedOption: 'Hetzner Cloud VPS (Nürnberg)', rationale: 'DSGVO konform, < 5 € / Monat, volle Datenhoheit' }
      ],
      estimatedBuildReusePercent: 82,
      infrastructureCostMonthly: 12,
      estimatedTotalCostMonthly: 18,
      targetCustomerPriceMonthly: 280,
      contributionMarginMonthly: 262,
      marginPercent: 93,
      recommendation: 'BUILD'
    },
    buildManifest: {
      requestId: 'REQ-2026-017',
      productName: 'Hoffmann Bau Kundenportal',
      productType: 'Construction Client Portal & Document Workspace',
      modules: ['Auth Guard', 'Project Status Engine', 'Document Vault', 'Client Messenger'],
      frontend: ['React 19', 'Tailwind CSS v4', 'shadcn/ui Control Preset'],
      backend: ['PocketBase Single Binary Go'],
      database: ['SQLite WAL Mode'],
      auth: ['Magic Link & Passwort Rollen-Guard'],
      storage: ['PocketBase Object Store'],
      automation: ['Inbound Event Hook', 'Status Notification Worker'],
      integrations: ['E-Mail SMTP', 'PDF Viewer'],
      deployment: ['Docker Container auf Hetzner VPS', 'Caddy Auto-TLS'],
      monitoring: ['Uptime Kuma Ping'],
      reusedObjectIds: ['OBJ-15K-01', 'OBJ-15K-05', 'OBJ-15K-08'],
      reusedCapabilities: ['Authentifizierung & Rollen', 'Projekt-Dashboard', 'Dokumentenverwaltung', 'Benachrichtigungen', 'Responsive UI-Layout'],
      newWorkRequired: ['Bauprojekt-spezifische Ansicht', 'Kunden-Kommunikationsmodul'],
      acceptanceCriteria: [
        'Kunde kann sich mit Rollen-Login einloggen',
        'Projektstatus und Fortschrittsbalken sichtbar',
        'PDF-Dokumente und Pläne können hochgeladen und heruntergeladen werden',
        'Nachrichten zwischen Bauherr und Bauleiter austauschbar'
      ],
      estimatedMonthlyCost: 18.0,
      targetMonthlyPrice: 280.0,
      buildSteps: [
        'Infrastruktur mit PocketBase auf VPS aufsetzen',
        'Wiederverwendete Core-Module assemblieren (Auth, Dashboard, Storage)',
        'Bauprojekt-Ansicht und Kommunikationsmodul implementieren',
        'UX-Preview mit echten Projektdaten verifizieren',
        'Freigabe und Kundendeployment starten'
      ]
    }
  },
  {
    id: 'REQ-2024-012',
    customerName: 'BauGrund OS GmbH',
    company: 'BauGrund OS GmbH',
    industry: 'Baustellen- & Projektmanagement',
    rawRequest:
      'Wir sind ein mittelständisches Bauunternehmen. Baustellen-Berichte (Fotos, Notizen, PDFs) kommen per WhatsApp und E-Mail und müssen manuell sortiert, benannt und Projekten zugeordnet werden. Das kostet täglich mehrere Stunden. Wir wollen eine zentrale, einfache Plattform, die eingehende Baustellen-Informationen automatisch erfasst, klassifiziert und den richtigen Projekten zuordnet — inkl. Dashboard für Team und Kunden.',
    desiredOutcome:
      'Eine zentrale, einfache Plattform, die eingehende Baustellen-Informationen automatisch erfasst, klassifiziert und den richtigen Projekten zuordnet — inkl. Dashboard für Team und Kunden.',
    currentProcess: 'WhatsApp-Nachrichten sichten und herunterladen (ca. 1–2 h/Tag), Dateien manuell benennen und zuordnen, Statusberichte manuell erstellen.',
    userCount: 12,
    monthlyBudget: '500 – 1.000 €',
    targetPrice: 150,
    integrations: ['WhatsApp / WhatsApp Business', 'E-Mail', 'Google Drive', 'DATEV'],
    constraints: ['Einfache Bedienung für Baustellen-Team (mobile Nutzung)', 'Betriebskosten < 30 €/Monat'],
    selfHostingRequired: true,
    complianceNotes: 'DSGVO / GoBD konform, Server in Deutschland',
    deadline: '31.03.2025',
    targetLiveWeeks: '4–6 Wochen',
    notes: 'Möglichst einfache Bedienung. Später evtl. Zeiterfassung integrieren.',
    state: 'In Analyse',
    createdAt: '08. Jan. 2024',
    customerNumber: 'K-2024-012',
    companySize: '10–50 MA',
    location: 'Osnabrück, DE',
    isNewCustomer: false,
    sourceChannel: 'E-Mail Anfrage',
    urgency: 'Mittel',
    projectType: 'Web-App / WhatsApp Pipeline',
    budgetRange: '15.000 – 30.000 €',
    processMap: {
      title: 'WhatsApp Beleg- & Foto-Ingestion Flow',
      summary: 'Event Storming Modell: WhatsApp Eingang -> Bildextraktion -> Baustellen-Matching -> Freigabe & Ablage.',
      understandingScore: 92,
      confirmedCount: 5,
      inferredCount: 2,
      unclearCount: 1,
      questionCount: 0,
      nodes: [
        {
          id: 'NODE-BG-01',
          type: 'ACTOR',
          title: 'Polier / Handwerker auf Baustelle',
          actorOrSubject: 'Polier vor Ort',
          status: 'CONFIRMED',
          rationale: 'Sendet Fotos von Baufortschritt oder Lieferscheinen direkt via WhatsApp.',
          sourceQuote: 'Baustellen-Berichte (Fotos, Notizen, PDFs) kommen per WhatsApp und E-Mail...',
          authorizedRoles: 'Baustellenpersonal'
        },
        {
          id: 'NODE-BG-02',
          type: 'COMMAND',
          title: 'WhatsApp Nachricht mit Anhang senden',
          actorOrSubject: 'Polier',
          status: 'CONFIRMED',
          rationale: 'Einfachste Eingabeform ohne Notwendigkeit einer App-Installation.',
          sourceQuote: '...kommen per WhatsApp und E-Mail'
        },
        {
          id: 'NODE-BG-03',
          type: 'EVENT',
          title: 'WhatsApp Webhook ausgelöst',
          actorOrSubject: 'Meta Cloud API Webhook',
          status: 'CONFIRMED',
          rationale: 'Echtzeit-Empfang von Bild- und PDF-Anhängen.',
          sourceQuote: '...automatisch erfasst, klassifiziert und zugeordnet'
        },
        {
          id: 'NODE-BG-04',
          type: 'POLICY',
          title: 'Klassifikation & Baustellen-Match',
          actorOrSubject: 'Klassifikations-Engine',
          status: 'INFERRED',
          rationale: 'Analysiert Dateinamen, Absendernummer und OCR-Text auf Baustellennummern.',
          sourceQuote: '...müssen manuell sortiert, benannt und Projekten zugeordnet werden.'
        },
        {
          id: 'NODE-BG-05',
          type: 'READ_MODEL',
          title: 'BauGrund Projekt-Dashboard aktualisiert',
          actorOrSubject: 'BauGrund OS Plattform',
          status: 'CONFIRMED',
          rationale: 'Zentrales Dashboard für Team und Kunden mit aktuellen Belegen.',
          sourceQuote: '...inkl. Dashboard für Team und Kunden.',
          linkedUiComponent: 'Dashboard & Team-Feed',
          linkedScreenName: 'Dashboard'
        }
      ]
    },
    deltaMetrics: {
      reuseScore: 87,
      deltaSize: 13,
      deltaCriticality: 'Niedrig',
      humanTouch: 'Mittel',
      humanTouchMinutes: 14,
      reuseScoreText: '87 % der Bausteine existieren bereits in der Registry.',
      deltaSizeText: 'Nur WhatsApp Webhook & OCR Parsing nötig.',
      deltaCriticalityText: 'Standard Webhook-Architektur, kein Enterprise-Risiko.',
      humanTouchText: '14 Min. für Adapter-Secret & WhatsApp Cloud Token Konfiguration.'
    },
    matchingPatterns: [
      { id: 'PAT-W01', title: 'WhatsApp Doc Ingest', score: 94, description: 'Automatisierter Beleg- & Foto-Upload per WhatsApp Webhook.', isRecommended: true },
      { id: 'PAT-W02', title: 'Baustellen Logbuch', score: 85, description: 'Chronologische Projekt-Ablage mit Statusanzeige.' },
      { id: 'PAT-W03', title: 'Bautagebuch Pro', score: 79, description: 'Team-Zuweisung und tägliche Zusammenfassungen.' }
    ],
    assembledComponents: {
      reused: [
        { id: 'C-01', name: 'PocketBase Core Auth', tag: 'Core' },
        { id: 'C-02', name: 'Foundry OCR Engine', tag: 'Core' },
        { id: 'C-03', name: 'Evidence Vault S3', tag: 'Core' },
        { id: 'C-04', name: 'Dashboard Shell', tag: 'Core' }
      ],
      missing: [
        { id: 'M-01', name: 'WhatsApp Cloud Webhook Adapter', tag: 'Neu', description: 'Empfang von Foto-Anhängen und OCR-Vorbereitung' },
        { id: 'M-02', name: 'Projekt-Klassifikation', tag: 'Neu', description: 'Zuordnung nach Baustellennummer' }
      ]
    },
    uiPreview: {
      appName: 'BauGrund OS',
      logoText: 'BG',
      industry: 'Bau & Projektmanagement',
      activeProjectsCount: 8,
      documentsCount: 142,
      openTasksCount: 5,
      projects: [
        { name: 'Gewerbepark Nord', status: 'In Bau', progress: 82, lastActivity: 'vor 3 Std.' },
        { name: 'Erweiterung Halle B', status: 'Planung', progress: 45, lastActivity: 'vor 1 Tag' },
        { name: 'Kundenumbau Süd', status: 'Prüfung', progress: 70, lastActivity: 'vor 2 Tagen' }
      ]
    },
    conveyorStage: 'Intake',
    analysis: {
      problemSummary:
        'Baustellen-Berichte (Fotos, Notizen, PDFs) kommen per WhatsApp und E-Mail und müssen manuell sortiert, benannt und Projekten zugeordnet werden. Das kostet täglich mehrere Stunden.',
      desiredOutcome:
        'Eine zentrale, einfache Plattform, die eingehende Baustellen-Informationen automatisch erfasst, klassifiziert und den richtigen Projekten zuordnet — inkl. Dashboard für Team und Kunden.',
      manualProcessSummary: [
        'WhatsApp-Nachrichten sichten und herunterladen (ca. 1–2 h/Tag)',
        'Dateien manuell benennen und Projekten zuordnen (ca. 1–2 h/Tag)',
        'Statusberichte manuell erstellen (ca. 0,5 h/Tag)',
        'Rückfragen mit Team und Kunden (ca. 0,5 h/Tag)'
      ],
      successMetrics: [
        '> 80 % der eingehenden Informationen werden automatisch verarbeitet',
        'Projektspezifische Zuordnung mit hoher Genauigkeit (> 90 %)',
        'Einfache Bedienung für Baustellen-Team (mobile Nutzung)',
        'Go-Live innerhalb von 4–6 Wochen',
        'Betriebskosten < 30 €/Monat'
      ],
      matchedCapabilities: [
        {
          capabilityId: 'CAP-01',
          name: 'OCR',
          description: 'Texterkennung für PDFs, Bilder und gescannte Doks',
          matchScorePercent: 95,
          source: 'Foundry OCR Engine',
          status: 'READY'
        },
        {
          capabilityId: 'CAP-03',
          name: 'File Storage',
          description: 'Sichere Dateiablage mit Metadaten und Versionen',
          matchScorePercent: 90,
          source: 'Evidence Vault',
          status: 'READY'
        },
        {
          capabilityId: 'CAP-02',
          name: 'Auth',
          description: 'Nutzer-Authentifizierung und Rollen (Multi-Tenant)',
          matchScorePercent: 95,
          source: 'PocketBase Auth',
          status: 'READY'
        },
        {
          capabilityId: 'CAP-04',
          name: 'Dashboard',
          description: 'Admin- und Kunden-Dashboard (shadcn/ui)',
          matchScorePercent: 85,
          source: 'shadcn/ui Control Preset',
          status: 'READY'
        },
        {
          capabilityId: 'CAP-05',
          name: 'Notifications',
          description: 'E-Mail, In-App und WhatsApp Benachrichtigungen',
          matchScorePercent: 80,
          source: 'Foundry Dispatcher',
          status: 'READY'
        }
      ],
      reusableObjects: ['OBJ-15K-01', 'OBJ-15K-05', 'OBJ-15K-09'],
      missingCapabilities: [
        {
          name: 'WhatsApp Intake Adapter',
          description: 'Empfang und Verarbeitung von WhatsApp-Nachrichten (Bilder, PDFs, Texte)',
          effortBadge: 'M',
          status: 'Geplant'
        },
        {
          name: 'Automatische Projektklassifikation',
          description: 'KI-gestützte Zuordnung von Nachrichten und Dokumenten zu bestehenden Projekten',
          effortBadge: 'M',
          status: 'Geplant'
        }
      ],
      recommendedStack: [
        {
          layer: 'Frontend',
          selectedOption: 'React + Tailwind + shadcn/ui',
          rationale: 'Schnelle Entwicklung, konsistentes UI, bewährte Komponenten'
        },
        {
          layer: 'Backend',
          selectedOption: 'PocketBase',
          rationale: 'Leichtgewichtig, alles in einem (Auth, DB, API, Storage)'
        },
        {
          layer: 'Storage',
          selectedOption: 'PocketBase Storage',
          rationale: 'Direkte Integration, Versionierung, Zugriffskontrolle'
        },
        {
          layer: 'Automation',
          selectedOption: 'n8n (Self-Hosted)',
          rationale: 'Flexible Workflows für Verarbeitung und Klassifikation'
        },
        {
          layer: 'Hosting',
          selectedOption: 'VPS (Hetzner)',
          rationale: 'Kostengünstig, skalierbar, EU-Standort'
        },
        {
          layer: 'Monitoring',
          selectedOption: 'Uptime Kuma + Logs',
          rationale: 'Überwachung, Logs und Alerts für stabilen Betrieb'
        }
      ],
      estimatedBuildReusePercent: 87,
      infrastructureCostMonthly: 18,
      estimatedTotalCostMonthly: 25,
      targetCustomerPriceMonthly: 150,
      contributionMarginMonthly: 125,
      marginPercent: 83,
      recommendation: 'BUILD'
    },
    buildManifest: {
      requestId: 'REQ-2024-012',
      productName: 'Baustellen-Dokumentenassistent',
      productType: 'Vertical Field Service Document Pipeline',
      modules: ['WhatsApp Ingest', 'OCR Extractor', 'Project Assign Engine', 'Office Review Dashboard'],
      frontend: ['React 19', 'Tailwind CSS v4', 'shadcn/ui Control Preset'],
      backend: ['PocketBase Single Binary Go', 'n8n Workflow Service'],
      database: ['SQLite WAL Mode', 'Litestream S3 Replication'],
      auth: ['Magic Link Auth', 'Multi-Tenant Role Guard'],
      storage: ['Evidence Vault S3', 'Hetzner VPS Nürnberg'],
      automation: ['n8n Self-Hosted', 'OCR Confidence Filter'],
      integrations: ['WhatsApp Cloud API Webhook', 'E-Mail IMAP'],
      deployment: ['Single-Tenant Docker auf Hetzner VPS', 'Caddy Auto-TLS'],
      monitoring: ['Uptime Kuma', 'Pulse Ping'],
      reusedObjectIds: ['OBJ-15K-01', 'OBJ-15K-05', 'OBJ-15K-09'],
      reusedCapabilities: ['OCR', 'File Storage', 'Auth', 'Dashboard', 'Notifications'],
      newWorkRequired: ['WhatsApp Intake Adapter', 'Automatische Projektklassifikation'],
      acceptanceCriteria: [
        'User can upload or send document via WhatsApp',
        'OCR extracts required fields',
        'Document assigned to project with >90% precision',
        'Office user can approve in dashboard'
      ],
      estimatedMonthlyCost: 25.0,
      targetMonthlyPrice: 150.0,
      buildSteps: [
        'Infrastruktur provisionieren (PocketBase auf VPS)',
        'Wiederverwendete Module integrieren (OCR, Auth, Dashboard)',
        'WhatsApp Adapter & Projektklassifikation erstellen',
        'Tests ausführen & Kundengebung deployen'
      ]
    }
  },
  {
    id: 'REQ-2024-011',
    customerName: 'Elektro Meier GmbH',
    company: 'Elektro Meier GmbH',
    industry: 'Elektroinstallation / Handwerk',
    rawRequest:
      'Wir sind ein kleiner Elektroinstallationsbetrieb mit 8 Mitarbeitern. Unsere Kunden senden uns Anfragen und Aufträge hauptsächlich per WhatsApp — oft mit Fotos von der Baustelle und handschriftlichen Notizen. Aktuell müssen wir diese Infos manuell sichten, in Excel übertragen und den Projekten zuordnen. Das ist zeitaufwendig und unübersichtlich. Wir möchten eine einfache Lösung, bei der eingehende WhatsApp-Nachrichten automatisch erfasst und dem richtigen Projekt zugeordnet werden.',
    desiredOutcome:
      'Automatische Erfassung von WhatsApp-Anfragen, Zuordnung zu Projekten/Kunden, übersichtliches Dashboard für das Team.',
    currentProcess: 'Anfragen kommen per WhatsApp. Fotos und Notizen werden manuell gelesen und in Excel übertragen. Projekte werden manuell angelegt und zugeordnet.',
    userCount: 8,
    monthlyBudget: '500 – 1.000 €',
    targetPrice: '1.000 – 2.500 € (einmalig) / 120 € mtl.',
    integrations: ['WhatsApp / WhatsApp Business', 'E-Mail', 'Google Drive', 'DATEV'],
    constraints: ['Möglichst einfache Bedienung', 'Mobile Nutzung wichtig'],
    selfHostingRequired: false,
    complianceNotes: 'Cloud möglich, DSGVO-konform',
    deadline: '31.03.2025',
    targetLiveWeeks: '3–4 Wochen',
    notes: 'Später evtl. Zeiterfassung und Angebotserstellung integrieren.',
    state: 'Proposal ready',
    createdAt: '05. Jan. 2024',
    customerNumber: 'K-2024-011',
    companySize: '5–10 MA',
    location: 'Augsburg, DE',
    isNewCustomer: false,
    sourceChannel: 'Empfehlung',
    urgency: 'Mittel',
    projectType: 'Mobile Web-App / Handwerker Hub',
    budgetRange: '10.000 – 20.000 €',
    deltaMetrics: {
      reuseScore: 88,
      deltaSize: 12,
      deltaCriticality: 'Niedrig',
      humanTouch: 'Gering',
      humanTouchMinutes: 10,
      reuseScoreText: '88 % Match mit bestehendem Handwerker-Stack.',
      deltaSizeText: 'Minimales Customizing für mobile Ampel-Ansicht.',
      deltaCriticalityText: 'Keine Fremdsystem-Abhängigkeiten.',
      humanTouchText: '10 Min. Branding & Team-Benutzer anlegen.'
    },
    matchingPatterns: [
      { id: 'PAT-E01', title: 'Handwerker Board', score: 92, description: 'Einfaches mobiles Dashboard für Zettel & Aufträge.', isRecommended: true },
      { id: 'PAT-E02', title: 'Service Auftragsbuch', score: 81, description: 'Kundenadressen und Fotodokumentation vor Ort.' },
      { id: 'PAT-E03', title: 'Schnell-Erfassung', score: 75, description: 'Sprach- und Fotonotiz Direktablage.' }
    ],
    assembledComponents: {
      reused: [
        { id: 'C-01', name: 'Foundry OCR Engine', tag: 'Core' },
        { id: 'C-02', name: 'PocketBase Auth & DB', tag: 'Core' },
        { id: 'C-03', name: 'Team Dashboard', tag: 'Core' }
      ],
      missing: [
        { id: 'M-01', name: 'WhatsApp Webhook Listener', tag: 'Neu', description: 'Direkte Weiterleitung in Auftragsliste' }
      ]
    },
    uiPreview: {
      appName: 'Elektro Meier',
      logoText: 'EM',
      industry: 'Elektroinstallation / Handwerk',
      activeProjectsCount: 6,
      documentsCount: 94,
      openTasksCount: 4,
      projects: [
        { name: 'Kundenauftrag Praxis Dr. Weiss', status: 'In Bau', progress: 90, lastActivity: 'vor 1 Std.' },
        { name: 'Neubau Verteilerkasten Süd', status: 'Planung', progress: 20, lastActivity: 'vor 4 Std.' },
        { name: 'E-Check Wohnblock 4', status: 'Prüfung', progress: 50, lastActivity: 'vor 1 Tag' }
      ]
    },
    conveyorStage: 'Intake',
    analysis: {
      problemSummary: 'Fotos und handschriftliche Zettel kommen per WhatsApp und müssen manuell in Excel übertragen werden.',
      desiredOutcome: 'Automatische Erfassung und Projekt-Dashboard mit Ampel.',
      manualProcessSummary: ['WhatsApp sichten (1h)', 'Excel pflegen (1h)', 'Rückfragen (0.5h)'],
      successMetrics: ['>80% automatische Zuordnung', 'Einfache mobile Bedienung'],
      matchedCapabilities: [
        { capabilityId: 'CAP-01', name: 'OCR', description: 'Belege & Handschrift lesen', matchScorePercent: 95, source: 'Foundry OCR', status: 'READY' },
        { capabilityId: 'CAP-04', name: 'Dashboard', description: 'Team Dashboard', matchScorePercent: 90, source: 'shadcn/ui', status: 'READY' }
      ],
      reusableObjects: ['OBJ-15K-01', 'OBJ-15K-05'],
      missingCapabilities: [
        { name: 'WhatsApp Intake Adapter', description: 'Webhook Listener', effortBadge: 'M', status: 'Geplant' }
      ],
      recommendedStack: [
        { layer: 'Frontend', selectedOption: 'React + shadcn/ui', rationale: 'Einfache mobile Ansicht' },
        { layer: 'Backend', selectedOption: 'PocketBase', rationale: 'Geringe Betriebskosten' }
      ],
      estimatedBuildReusePercent: 88,
      infrastructureCostMonthly: 15,
      estimatedTotalCostMonthly: 22,
      targetCustomerPriceMonthly: 120,
      contributionMarginMonthly: 98,
      marginPercent: 81,
      recommendation: 'BUILD'
    }
  }
];
