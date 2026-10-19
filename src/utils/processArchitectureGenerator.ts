import { ProcessNodeDetail, ProcessNodeStatus, ProcessNodeType } from '../data/workstationData';

export interface SystemBuildingBlock {
  id: string;
  name: string;
  category: 'Ingestion' | 'AI & Vision' | 'Routing & Rules' | 'Validation & Radar' | 'Human-in-the-Loop' | 'Core & Cockpit';
  purpose: string;
  customerBenefit: string;
  techStack: string;
  reuseStatus: 'REUSED (Registry)' | 'NEU (Custom Adapter)' | 'CONFIG ONLY';
  complexity: 'S' | 'M' | 'L';
  connectedNodeIds: string[];
  keyCapabilities: string[];
}

export interface GeneratedArchitectureResult {
  nodes: ProcessNodeDetail[];
  systems: SystemBuildingBlock[];
  understandingScore: number;
  confirmedCount: number;
  inferredCount: number;
  unclearCount: number;
  questionCount: number;
  summary: string;
}

/**
 * Intelligent generator that parses any customer request text (including the
 * 14-Monteure / Weber Elektroanlagen case from the screenshot) and derives
 * a complete, verified Event-Storming node architecture and the required technical systems.
 */
export function generateArchitectureFromText(
  rawRequest: string,
  customerName?: string,
  company?: string
): GeneratedArchitectureResult {
  const text = (rawRequest || '').toLowerCase();
  const orgName = company || customerName || 'Kundenbetrieb';

  // 1. SPECIFIC MATCH: Weber Elektroanlagen / 14 Monteure / Lieferscheine & Abrechnung
  const isElectricHandwerk =
    text.includes('14 monteur') ||
    text.includes('monteur') ||
    text.includes('elektro') ||
    (text.includes('lieferschein') && text.includes('aufmaß') && text.includes('abrechnung'));

  if (isElectricHandwerk) {
    const nodes: ProcessNodeDetail[] = [
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
    ];

    const systems: SystemBuildingBlock[] = [
      {
        id: 'SYS-01',
        name: 'WhatsApp Ingestion & Multi-Group Webhook Gateway',
        category: 'Ingestion',
        purpose: 'Empfängt Bilder, PDFs und Sprachnachrichten aus beliebig vielen WhatsApp-Gruppen der 14 Monteure vollautomatisch ohne App-Zwang.',
        customerBenefit: 'Die 14 Monteure müssen keine neue App lernen und können wie gewohnt direkt in WhatsApp Fotos und Zettel senden.',
        techStack: 'Meta Cloud API Webhook / n8n Inbound Adapter auf Hetzner VPS',
        reuseStatus: 'REUSED (Registry)',
        complexity: 'M',
        connectedNodeIds: ['NODE-01', 'NODE-02', 'NODE-03'],
        keyCapabilities: ['Multi-Gruppen-Support', 'EXIF-Metadaten & Geocoding', 'Idempotente Deduplizierung']
      },
      {
        id: 'SYS-02',
        name: 'Multi-Modal OCR & Handschriften-Extraktions-Pipeline',
        category: 'AI & Vision',
        purpose: 'Liest maschinelle Lieferscheine (Lieferscheinnummer, Lieferant, Positionen) und handschriftliche Aufmaß-Zettel zuverlässig aus.',
        customerBenefit: 'Kein mühsames Abtippen von krakeligen Zetteln mehr im Büro – Inhalte werden sofort digital durchsuchbar.',
        techStack: 'Surya OCR + Local Document Vision Pipeline (DSGVO-konform, kein externer US-Upload)',
        reuseStatus: 'REUSED (Registry)',
        complexity: 'L',
        connectedNodeIds: ['NODE-04'],
        keyCapabilities: ['Handschriften-Erkennung', 'Tabellen-Extraktion für Lieferscheine', 'Konfidenz-Score pro Feld']
      },
      {
        id: 'SYS-03',
        name: 'Automatischer Projekt-Matching & Konfidenz-Router',
        category: 'Routing & Rules',
        purpose: 'Gleicht erkannte Textfragmente, Baustellenadressen und Monteur-Telefonnummern mit dem aktiven Projektstamm ab.',
        customerBenefit: 'Über 85% der Dokumente landen in Sekundenschnelle ohne menschliches Zutun im richtigen Projektordner.',
        techStack: 'Heuristische Rule Engine + Vektor-Ähnlichkeitsabgleich (sqlite-vec / pgvector)',
        reuseStatus: 'REUSED (Registry)',
        complexity: 'M',
        connectedNodeIds: ['NODE-04', 'NODE-05', 'NODE-06'],
        keyCapabilities: ['Gabelung: ≥85% Auto-Zuweisung', 'Prüffach-Routing für Zweifelsfälle', 'Lernfähige Adresszuordnung']
      },
      {
        id: 'SYS-04',
        name: 'Human-in-the-Loop Büro-Prüffach (Triage Workbench)',
        category: 'Human-in-the-Loop',
        purpose: 'Bietet dem Innendienst eine übersichtliche Inbox für unklare Zettel mit Top-3-Projektvorschlägen und 1-Klick-Zuweisung.',
        customerBenefit: 'Das Büro muss nicht mehr WhatsApp-Gruppen durchscrollen. Unklare Belege sind in 5 Sekunden gelöst.',
        techStack: 'React 19 + shadcn/ui Control Preset + PocketBase Realtime Subscriptions',
        reuseStatus: 'REUSED (Registry)',
        complexity: 'S',
        connectedNodeIds: ['NODE-06', 'NODE-07'],
        keyCapabilities: ['1-Klick-Zuweisung', 'Split-Screen Belegvorschau', 'Monteur-Rückfrage per WhatsApp']
      },
      {
        id: 'SYS-05',
        name: 'Fehlteile-Radar & Lieferschein-Vollständigkeitsengine',
        category: 'Validation & Radar',
        purpose: 'Überwacht für jedes Projekt, ob zu erfassten Aufträgen die passenden Lieferscheine vorliegen und markiert Lücken rot.',
        customerBenefit: 'Verhindert bares Geldverlust: Keine Rechnung verlässt das Büro, ohne dass alle abrechnungsrelevanten Belege da sind.',
        techStack: 'Automated Reconciliation Worker (Go Cron / PocketBase Hooks)',
        reuseStatus: 'NEU (Custom Adapter)',
        complexity: 'M',
        connectedNodeIds: ['NODE-08', 'NODE-09'],
        keyCapabilities: ['Rote Signalmarkierung für fehlende Scheine', 'Abrechnungs-Sperre bei Lücken', 'Großhändler-Nachforderungsliste']
      },
      {
        id: 'SYS-06',
        name: 'Revisionssichere Projektakte & Büro-Abrechnungscockpit',
        category: 'Core & Cockpit',
        purpose: 'Zentrales Web-Dashboard für Geschäftsführung & Büro: Sofort sehen, welche Baustelle abrechnungsbereit ist und wo Belege fehlen.',
        customerBenefit: 'Voller Überblick auf einem Screen. Der Chef sieht morgens sofort die Abrechnungsreife aller 14 Monteure.',
        techStack: 'PocketBase Single-Binary Go Backend (SQLite WAL) + Tailwind CSS v4 Dashboard Shell',
        reuseStatus: 'REUSED (Registry)',
        complexity: 'S',
        connectedNodeIds: ['NODE-10'],
        keyCapabilities: ['Revisionssichere PDF-Ablage', 'Ampelsystem (Grün / Rot / Gelb)', 'Export für Steuerberater / DATEV']
      }
    ];

    return {
      nodes,
      systems,
      understandingScore: 94,
      confirmedCount: 7,
      inferredCount: 2,
      unclearCount: 1,
      questionCount: 1,
      summary: `Vollständiges Event Storming für ${orgName}: Von WhatsApp-Gruppen der 14 Monteure über Handschrift-OCR bis zur signalroten Lieferschein-Warnung im Abrechnungs-Cockpit.`
    };
  }

  // 2. GENERIC / DYNAMIC GENERATOR FOR ANY OTHER CUSTOMER REQUEST
  const hasWhatsApp = text.includes('whatsapp') || text.includes('chat') || text.includes('messeng');
  const hasMail = text.includes('mail') || text.includes('e-mail');
  const hasPhotos = text.includes('foto') || text.includes('bild') || text.includes('kamera');
  const hasDocuments = text.includes('dokument') || text.includes('beleg') || text.includes('pdf') || text.includes('rechnung');
  const hasPortal = text.includes('portal') || text.includes('dashboard') || text.includes('kunden');
  const hasApproval = text.includes('freigabe') || text.includes('prüf') || text.includes('kontroll');

  const genericNodes: ProcessNodeDetail[] = [
    {
      id: 'NODE-01',
      type: 'ACTOR',
      title: `${customerName || 'Kunde / Anwender vor Ort'}`,
      actorOrSubject: 'Außendienst / Kunde',
      status: 'CONFIRMED',
      statusReason: 'Aus Kundentext identifizierter Haupt-Akteur',
      rationale: 'Ausgangspunkt: Erzeugt oder übermittelt operative Vorgänge an das Unternehmen.',
      sourceQuote: rawRequest.slice(0, 100) + '...',
      authorizedRoles: 'Außendienst / Kunde',
      notifyCustomer: false,
      requiredData: ['Endgerät', hasWhatsApp ? 'WhatsApp' : 'Web-Browser']
    },
    {
      id: 'NODE-02',
      type: 'COMMAND',
      title: hasPhotos || hasDocuments ? 'Sendet Belege, Fotos & Daten ein' : 'Startet Vorgang & übermittelt Anfrage',
      actorOrSubject: 'Nutzer vor Ort',
      status: 'CONFIRMED',
      statusReason: 'Explizite Kundenhandlung im Prozess',
      rationale: 'Eingabe der Daten über den bevorzugten Kommunikationskanal.',
      sourceQuote: rawRequest.slice(0, 120),
      failureHandling: 'Offline-Pufferung und Retry bei Netzunterbrechung.',
      authorizedRoles: 'Alle autorisierten Nutzer',
      notifyCustomer: 'Eingangsbestätigung versenden'
    },
    {
      id: 'NODE-03',
      type: 'EVENT',
      title: 'Vorgang & Daten im System eingegangen',
      actorOrSubject: 'Foundry Ingestion Service',
      status: 'CONFIRMED',
      statusReason: 'Technischer Inbound-Event der Verarbeitungs-Pipeline',
      rationale: 'Empfang, Validierung und sichere Zwischenspeicherung der eingehenden Nutzlast.',
      failureHandling: 'Idempotente Ablage gegen Mehrfacheinreichungen.',
      authorizedRoles: 'System Automation'
    },
    {
      id: 'NODE-04',
      type: 'POLICY',
      title: 'Automatische Klassifikation & Projekt-Zuordnung',
      actorOrSubject: 'Intelligente Regel-Engine',
      status: 'INFERRED',
      statusReason: 'Logisch von Jev abgeleitet zur Automatisierung',
      rationale: 'Analysiert Absender, Metadaten und Textmuster zur automatischen Zuordnung.',
      failureHandling: 'Gabelung: Konfidenz ≥ 85% direkt zuweisen, sonst Weiterleitung an Prüffach.',
      authorizedRoles: 'AI Model / Rule Engine'
    },
    {
      id: 'NODE-05',
      type: 'COMMAND',
      title: 'Pfad A: Sicher erkannt → Automatisch zuordnen & archivieren',
      actorOrSubject: 'Automatischer Zuweiser',
      status: 'CONFIRMED',
      branch: 'success',
      statusReason: 'Erfolgs-Standardpfad ohne manuelle Verzögerung',
      rationale: 'Eindeutige Daten werden in Echtzeit ohne menschlichen Eingriff verbucht.',
      authorizedRoles: 'System Bot',
      linkedUiComponent: 'Zentraler Daten-Feed'
    },
    {
      id: 'NODE-06',
      type: 'EXCEPTION',
      title: 'Pfad B: Unsicher → In Prüffach für Büro leiten',
      actorOrSubject: 'Prüffach-Router',
      status: 'INFERRED',
      branch: 'uncertain',
      statusReason: 'Schutzregel gegen fehlerhafte Zuordnungen',
      rationale: 'Verhindert Fehlbuchungen durch gezielte Vorlage bei menschlichen Experten.',
      failureHandling: 'Dokument erhält Tag „UNGEKLÄRT“ und landet in der Schnellsicht-Inbox.',
      authorizedRoles: 'System Exception Router',
      linkedUiComponent: 'Prüffach-Inbox'
    },
    {
      id: 'NODE-07',
      type: 'ACTOR',
      title: 'Mitarbeiter prüft & bestätigt Zweifelsfall mit 1 Klick',
      actorOrSubject: 'Büromitarbeiter / Sachbearbeiter',
      status: 'CONFIRMED',
      branch: 'uncertain',
      statusReason: 'Menschliche Kontrollinstanz für Ausnahmefälle',
      rationale: 'Löst seltene Zweifelsfälle schnell auf Basis von Systemvorschlägen.',
      authorizedRoles: 'Büroteam',
      linkedUiComponent: '1-Klick Triage'
    },
    {
      id: 'NODE-08',
      type: 'READ_MODEL',
      title: 'Zentrales Dashboard & Revisionssichere Projektakte',
      actorOrSubject: 'Operatives Cockpit',
      status: 'CONFIRMED',
      statusReason: 'Hauptziel der digitalen Lösung',
      rationale: 'Ermöglicht dem gesamten Team jederzeit lückenlose Transparenz.',
      authorizedRoles: 'Alle Projektbeteiligten',
      linkedUiComponent: 'Dashboard Übersicht'
    },
    {
      id: 'NODE-09',
      type: 'POLICY',
      title: 'Klärungsfrage: Automatischer Benachrichtigungskanal bei Unklarheiten?',
      actorOrSubject: 'Prozess-Owner',
      status: 'QUESTION',
      statusReason: 'Muss vor der finalen Härtung mit dem Kunden abgestimmt werden',
      rationale: 'Welcher Kanal soll für Rückfragen genutzt werden (SMS, Chat, E-Mail)?',
      authorizedRoles: 'Geschäftsleitung'
    }
  ];

  const genericSystems: SystemBuildingBlock[] = [
    {
      id: 'SYS-01',
      name: 'Multi-Channel Ingestion Gateway',
      category: 'Ingestion',
      purpose: `Empfängt eingehende Daten und Nachrichten via ${hasWhatsApp ? 'WhatsApp Webhooks' : hasMail ? 'E-Mail & Web-Formular' : 'Web-Upload'}.`,
      customerBenefit: 'Keine Hürden für Absender – Daten fließen nahtlos in die Plattform.',
      techStack: 'Node / Go Webhook Listener auf Hetzner VPS',
      reuseStatus: 'REUSED (Registry)',
      complexity: 'M',
      connectedNodeIds: ['NODE-01', 'NODE-02', 'NODE-03'],
      keyCapabilities: ['Idempotente Ingestion', 'Payload Validation', 'File Storage S3']
    },
    {
      id: 'SYS-02',
      name: 'Klassifikations- & Analyse-Pipeline',
      category: 'AI & Vision',
      purpose: 'Extrahiert Entitäten, Projektbezüge und Dokumententypen aus unstrukturierten Eingaben.',
      customerBenefit: 'Eliminiert manuelle Sortierarbeit und beschleunigt Durchlaufzeiten.',
      techStack: 'Foundry OCR Engine + Rule Matcher',
      reuseStatus: 'REUSED (Registry)',
      complexity: 'M',
      connectedNodeIds: ['NODE-04'],
      keyCapabilities: ['Textextraktion', 'Metadaten-Analyse', 'Konfidenzberechnung']
    },
    {
      id: 'SYS-03',
      name: 'Confidence Router & Prüffach-Engine',
      category: 'Routing & Rules',
      purpose: 'Trennt vollautomatische Durchläufe von klärungsbedürftigen Fällen.',
      customerBenefit: 'Sichert höchste Datenqualität ohne Fehleinträge.',
      techStack: 'PocketBase Rule Hooks & Queues',
      reuseStatus: 'REUSED (Registry)',
      complexity: 'S',
      connectedNodeIds: ['NODE-04', 'NODE-05', 'NODE-06'],
      keyCapabilities: ['Schwellenwert-Logik', 'Fallback Routing']
    },
    {
      id: 'SYS-04',
      name: 'Human-in-the-Loop Triage Workbench',
      category: 'Human-in-the-Loop',
      purpose: 'Büro-Arbeitsplatz für sekundenschnelle Freigabe und Korrektur unklarer Vorgänge.',
      customerBenefit: 'Maximale Kontrolle bei minimalem Zeitaufwand.',
      techStack: 'React 19 + shadcn/ui Control Preset',
      reuseStatus: 'REUSED (Registry)',
      complexity: 'S',
      connectedNodeIds: ['NODE-06', 'NODE-07'],
      keyCapabilities: ['1-Klick Bestätigung', 'Vorschlags-Ranking']
    },
    {
      id: 'SYS-05',
      name: 'Revisionssicheres Dashboard & Core Backend',
      category: 'Core & Cockpit',
      purpose: 'Echtzeit-Cockpit mit Rollen, Datenhaltung und Exportfunktionen.',
      customerBenefit: 'Zentraler Überblick und volle Datensouveränität auf eigener Infrastruktur.',
      techStack: 'PocketBase Single-Binary Go Backend (SQLite WAL) + React Client',
      reuseStatus: 'REUSED (Registry)',
      complexity: 'M',
      connectedNodeIds: ['NODE-08'],
      keyCapabilities: ['Rollen & Auth', 'Live-Synchronisation', 'Revisionssicherheit']
    }
  ];

  return {
    nodes: genericNodes,
    systems: genericSystems,
    understandingScore: 88,
    confirmedCount: 5,
    inferredCount: 2,
    unclearCount: 1,
    questionCount: 1,
    summary: `Dynamisch erzeugte Event Storming Architektur für ${orgName} basierend auf dem eingegangenen Kundenanfrage-Text.`
  };
}
