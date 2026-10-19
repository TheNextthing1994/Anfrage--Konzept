import React, { useState } from 'react';
import {
  X,
  Sparkles,
  HelpCircle,
  Clock,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Bookmark
} from 'lucide-react';
import { ClientRequest } from '../data/workstationData';

interface ClientRequestIntakeProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  onParkAs15k?: (formData: any) => void;
  onLoadExample?: (exampleIndex: number) => void;
}

export const ClientRequestIntake: React.FC<ClientRequestIntakeProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onParkAs15k,
  onLoadExample
}) => {
  const [rawRequest, setRawRequest] = useState(
    'Wir sind ein kleiner Elektroinstallationsbetrieb mit 8 Mitarbeitern. Unsere Kunden senden uns Anfragen und Aufträge hauptsächlich per WhatsApp — oft mit Fotos von der Baustelle und handschriftlichen Notizen. Aktuell müssen wir diese Infos manuell sichten, in Excel übertragen und den Projekten zuordnen. Das ist zeitaufwendig und unübersichtlich.\n\nWir möchten eine einfache Lösung, bei der eingehende WhatsApp-Nachrichten (Texte, Bilder) automatisch erfasst, den richtigen Projekten bzw. Kunden zugeordnet werden und unser Team darüber informiert wird. Zusätzlich wünschen wir uns ein übersichtliches Dashboard, in dem wir alle Anfragen, Projekte und den aktuellen Status sehen können.'
  );
  const [customerName, setCustomerName] = useState('Elektro Meier GmbH');
  const [company, setCompany] = useState('Elektro Meier GmbH');
  const [industry, setIndustry] = useState('Elektroinstallation / Handwerk');
  const [userCount, setUserCount] = useState<number | undefined>(8);
  const [desiredOutcome, setDesiredOutcome] = useState(
    'Automatische Erfassung von WhatsApp-Anfragen, Zuordnung zu Projekten/Kunden, übersichtliches Dashboard für das Team.'
  );
  const [currentProcess, setCurrentProcess] = useState(
    'Anfragen kommen per WhatsApp. Fotos und Notizen werden manuell gelesen und in Excel übertragen. Projekte werden manuell angelegt und zugeordnet. Oft gehen Infos verloren.'
  );
  const [monthlyBudget, setMonthlyBudget] = useState('500 – 1.000 €');
  const [targetPrice, setTargetPrice] = useState('1.000 – 2.500 € (einmalig)');
  const [integrations, setIntegrations] = useState<string[]>([
    'WhatsApp / WhatsApp Business',
    'E-Mail',
    'Google Drive',
    'evtl. DATEV'
  ]);
  const [selfHostingRequired, setSelfHostingRequired] = useState(false);
  const [deadline, setDeadline] = useState('31.03.2025');
  const [notes, setNotes] = useState('Möglichst einfache Bedienung. Mobile Nutzung wichtig. Später evtl. Zeiterfassung und Angebotserstellung integrieren.');

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawRequest.trim()) return;

    onSubmit({
      rawRequest,
      customerName,
      company,
      industry,
      userCount,
      desiredOutcome,
      currentProcess,
      monthlyBudget,
      targetPrice,
      integrations,
      selfHostingRequired,
      deadline,
      notes
    });
  };

  const handleParkSubmit = () => {
    if (!rawRequest.trim()) return;
    if (onParkAs15k) {
      onParkAs15k({
        rawRequest,
        customerName,
        company,
        industry,
        userCount,
        desiredOutcome,
        currentProcess,
        monthlyBudget,
        targetPrice,
        integrations,
        selfHostingRequired,
        deadline,
        notes
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-6xl rounded-2xl border border-slate-800 bg-[#0B0F17] overflow-hidden my-6 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Breadcrumb & Title */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0D121C] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Requests</span>
              <span>›</span>
              <span className="text-slate-200">Neue Kundenanfrage</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                💬
              </span>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Neue Kundenanfrage
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Beschreibe das Kundenproblem so detailliert wie möglich. Die KI analysiert die Anfrage und schlägt passende Bausteine, Tools und eine Lösung vor.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal 2-Column Content (Matching Screenshot 2) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Input Form (8 cols) */}
          <form id="requestIntakeForm" onSubmit={handleFormSubmit} className="lg:col-span-8 space-y-4">
            {/* Was braucht der Kunde? */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-white">
                  Was braucht der Kunde? <span className="text-red-400">*</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                  {rawRequest.length}/5000
                </span>
              </div>
              <textarea
                required
                rows={7}
                value={rawRequest}
                onChange={(e) => setRawRequest(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#111723] border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 leading-relaxed font-sans"
              />
            </div>

            {/* Kunde / Firma & Aktueller Prozess */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    Kunde / Firma <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 text-xs">👤</span>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        setCompany(e.target.value);
                      }}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-[#111723] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    Branche <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔧</span>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-[#111723] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Elektroinstallation / Handwerk">Elektroinstallation / Handwerk</option>
                      <option value="Baustellen- & Projektmanagement">Baustellen- & Projektmanagement</option>
                      <option value="Gesundheitswesen / Arztpraxis">Gesundheitswesen / Arztpraxis</option>
                      <option value="Immobilienwirtschaft / Hausverwaltung">Immobilienwirtschaft / Hausverwaltung</option>
                      <option value="Agentur / Dienstleistung">Agentur / Dienstleistung</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    Anzahl Nutzer <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 text-xs">👥</span>
                    <input
                      type="number"
                      required
                      value={userCount || ''}
                      onChange={(e) => setUserCount(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-[#111723] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right column: Aktueller Prozess */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    Aktueller Prozess (wie läuft es heute?) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      rows={5}
                      required
                      value={currentProcess}
                      onChange={(e) => setCurrentProcess(e.target.value)}
                      className="w-full p-2.5 text-xs bg-[#111723] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    Monatliches Budget (Richtwert)
                  </label>
                  <select
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#111723] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="< 500 €">&lt; 500 €</option>
                    <option value="500 – 1.000 €">500 – 1.000 €</option>
                    <option value="1.000 – 2.500 €">1.000 – 2.500 €</option>
                    <option value="> 2.500 €">&gt; 2.500 €</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Gewünschtes Ergebnis & Gewünschter Preis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Gewünschtes Ergebnis <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={desiredOutcome}
                  onChange={(e) => setDesiredOutcome(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#111723] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    Gewünschter Preis für den Kunden (Richtwert)
                  </label>
                  <select
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#111723] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="500 – 1.000 € (einmalig)">500 – 1.000 € (einmalig)</option>
                    <option value="1.000 – 2.500 € (einmalig)">1.000 – 2.500 € (einmalig)</option>
                    <option value="150 € / Monat SaaS">150 € / Monat SaaS</option>
                    <option value="Individuelles Angebot">Individuelles Angebot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    Wichtige Integrationen
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#111723] border border-slate-800 rounded-lg">
                    {integrations.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-200"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => setIntegrations(integrations.filter((_, i) => i !== idx))}
                          className="hover:text-red-400 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const next = prompt('Integration hinzufügen (z. B. DATEV, Slack):');
                        if (next) setIntegrations([...integrations, next.trim()]);
                      }}
                      className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 px-1.5 py-0.5 cursor-pointer"
                    >
                      + Weitere hinzufügen
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Self-Hosting, Deadline, Notizen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Self-hosting erforderlich?
                </label>
                <select
                  value={selfHostingRequired ? 'Ja' : 'Nein (Cloud möglich)'}
                  onChange={(e) => setSelfHostingRequired(e.target.value === 'Ja')}
                  className="w-full px-3 py-2 text-xs bg-[#111723] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Nein (Cloud möglich)">Nein (Cloud möglich)</option>
                  <option value="Ja">Ja (Autark VPS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Deadline / Zielzeitpunkt
                </label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#111723] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Weitere Notizen
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#111723] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors cursor-pointer shadow-md shadow-emerald-950"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Gesuch analysieren →</span>
                </button>

                <button
                  type="button"
                  onClick={handleParkSubmit}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-300 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Als 15K parken</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white px-3 py-2 cursor-pointer"
              >
                Abbrechen
              </button>
            </div>
          </form>

          {/* RIGHT COLUMN: Helper Card matching Screenshot 2 (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Card 1: Was passiert als Nächstes? */}
            <div className="rounded-xl border border-slate-800 bg-[#111723] p-5 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold">
                <span>💡</span>
                <span>Was passiert als Nächstes?</span>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  {
                    step: 1,
                    title: 'Problem verstehen',
                    desc: 'Die KI analysiert deine Beschreibung und extrahiert Anforderungen, Ziele und Constraints.'
                  },
                  {
                    step: 2,
                    title: 'Bausteine matchen',
                    desc: 'Passende Tools, Templates und eigene Bausteine werden aus dem Foundry und Registry gefunden.'
                  },
                  {
                    step: 3,
                    title: 'Stack wählen',
                    desc: 'Es wird ein optimaler Technologie-Stack für deinen Use Case vorgeschlagen.'
                  },
                  {
                    step: 4,
                    title: 'Kosten prüfen',
                    desc: 'Aufwand, Infrastruktur und Preisrahmen werden realistisch kalkuliert.'
                  },
                  {
                    step: 5,
                    title: 'Build Manifest',
                    desc: 'Du erhältst einen fertigen Lösungsplan mit Architektur, Komponenten und nächstem Schritt.'
                  }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </span>
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Tipps für eine gute Anfrage */}
            <div className="rounded-xl border border-slate-800 bg-[#111723] p-4 text-xs space-y-2">
              <div className="text-cyan-400 font-mono font-semibold flex items-center gap-1.5 text-[11px]">
                <span>🎯</span>
                <span>Tipps für eine gute Anfrage</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>Beschreibe den aktuellen Prozess und die Pain Points</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>Nenne die gewünschten Ziele und den erwarteten Nutzen</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>Gib einen realistischen Budget-Rahmen an</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>Erwähne wichtige Integrationen oder bestehende Tools</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>Je mehr Kontext, desto besser die Ergebnisqualität</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Beispiel-Anfragen */}
            <div className="rounded-xl border border-slate-800 bg-[#111723] p-4 text-xs space-y-2">
              <div className="text-slate-400 font-mono text-[11px]">
                Beispiel-Anfragen laden:
              </div>
              <div className="space-y-1.5">
                {[
                  'Rechnungsautomatisierung für Agentur',
                  'Kundenportal für Handwerksbetrieb',
                  'FAQ-Chatbot für E-Commerce Shop'
                ].map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (onLoadExample) onLoadExample(i);
                    }}
                    className="w-full text-left p-2 rounded bg-[#0B0F17] hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{sample}</span>
                    <span className="text-slate-500">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
