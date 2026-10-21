import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Copy, Mail } from 'lucide-react';
import { type LocalizedText, usePublicText } from './usePublicText';
import { PUBLIC_CONTACT } from '../../data/publicContact';
import { ContactDetails } from './ContactDetails';
import { GlossyText, Reveal } from './PublicEffects';

const questions: { label: LocalizedText; options: LocalizedText[] }[] = [
  { label: ['Was soll im Alltag einfacher werden?', 'Что вы хотите упростить?'], options: [
    ['Kundenanfragen bearbeiten', 'Обработка обращений клиентов'], ['Dokumente und Abläufe ordnen', 'Документы и рабочие процессы'],
    ['Wissen im Team zugänglich machen', 'Доступ к знаниям команды'], ['Gemeinsam herausfinden', 'Разобраться вместе']
  ] },
  { label: ['Wie groß ist Ihr Team?', 'Сколько человек в вашей команде?'], options: [
    ['Ich arbeite allein', 'Работаю один / одна'], ['2–10 Personen', '2–10 человек'], ['11–50 Personen', '11–50 человек'], ['Mehr als 50 Personen', 'Больше 50 человек']
  ] },
  { label: ['Wann möchten Sie starten?', 'Когда вы хотите начать?'], options: [
    ['Möglichst bald', 'Как можно скорее'], ['In den nächsten Monaten', 'В ближайшие месяцы'], ['Ich möchte mich erst orientieren', 'Пока изучаю возможности']
  ] }
];

// Retained from the owner's existing website; no delivery service is implied.
export const CONTACT_EMAIL = PUBLIC_CONTACT.email;

export function PotentialCheck({ example }: { example: string }) {
  const { text, localized } = usePublicText();
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const draftHeading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  const moveTo = (next: number) => {
    moved.current = true; setStep(next); setDraft(null);
  };
  const prepareDraft = (event: React.FormEvent) => {
    event.preventDefault();
    const lines = [text('Guten Tag, ich möchte einen Ablauf besprechen.', 'Здравствуйте! Я хочу обсудить автоматизацию процесса.'), '',
      `${text('Name', 'Имя')}: ${name.trim()}`, `${text('E-Mail', 'Эл. почта')}: ${email.trim()}`,
      ...(company.trim() ? [`${text('Unternehmen', 'Компания')}: ${company.trim()}`] : []),
      ...questions.map((question, index) => `${localized(question.label)} ${localized(question.options[answers[index]])}`),
      ...(example ? [`${text('Interessantes Beispiel', 'Интересующий пример')}: ${example}`] : []), '',
      text('Mein Ablauf:', 'Мой рабочий процесс:'), message.trim()];
    setDraft(lines.join('\n')); setCopyStatus('');
    requestAnimationFrame(() => draftHeading.current?.focus());
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft || '');
      setCopyStatus(text('Anfragetext kopiert.', 'Текст обращения скопирован.'));
    } catch {
      setCopyStatus(text('Bitte markieren und kopieren Sie den Text unten.', 'Выделите и скопируйте текст ниже.'));
    }
  };
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(text('Anfrage · DigitalTwinArchitecs.io', 'Запрос · DigitalTwinArchitecs.io'))}&body=${encodeURIComponent(draft || '')}`;

  return <section id="kontakt" tabIndex={-1} className="dt-public-section dt-contact-section" aria-labelledby="contact-title">
    <Reveal className="dt-public-container dt-check-heading"><h2 id="contact-title">{text('Finden Sie Ihre', 'Найдите своё')} <GlossyText>{text('Passende KI-Lösung', 'решение с ИИ')}</GlossyText></h2></Reveal>
    <div className="dt-public-container dt-contact-grid">
      <div className="dt-contact-intro">
        <p className="dt-eyebrow">{text('Der nächste Schritt', 'Следующий шаг')}</p>
        <h3>{text('Wo verliert Ihr Team heute Zeit?', 'На что ваша команда тратит время?')}</h3>
        <p className="dt-section-copy">{text('Der Potenzial-Check hilft, Ihr Anliegen einzuordnen. Beschreiben Sie einen konkreten Ablauf – wir klären gemeinsam, was sich sinnvoll verbessern lässt.', 'Короткая анкета поможет сформулировать задачу. Опишите один конкретный процесс — вместе определим, что стоит улучшить.')}</p>
        <ContactDetails />
        <p className="dt-caption">{text('Die Antworten bleiben während des Checks in dieser Seite. Zum Versand öffnen Sie anschließend Ihr E-Mail-Programm.', 'Ответы остаются на этой странице во время заполнения. Для отправки вы затем откроете свою почтовую программу.')}</p>
      </div>
      <div className="dt-glass dt-check-card">
        <div className="dt-check-progress"><span>{text('Potenzial-Check', 'Оценка задачи')}</span><span>{step + 1} / 4</span></div>
        <div className="dt-check-progress-track" role="progressbar" aria-label={text('Fortschritt', 'Прогресс')} aria-valuemin={1} aria-valuemax={4} aria-valuenow={step + 1}><span style={{ width: `${(step + 1) * 25}%` }} /></div>
        <AnimatePresence mode="wait" initial={false}><motion.div key={step} className="dt-check-step" initial={reduced ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, x: -24 }} transition={{ duration: reduced ? 0 : .25 }} onAnimationComplete={() => { if (moved.current) { heading.current?.focus({ preventScroll: true }); moved.current = false; } }}>
        {step < 3 ? <>
          <h3 tabIndex={-1} ref={heading}>{localized(questions[step].label)}</h3>
          <div className="dt-check-options">
            {questions[step].options.map((option, index) => <button key={index} type="button" aria-pressed={answers[step] === index}
              onClick={() => { setAnswers(previous => { const next = [...previous]; next[step] = index; return next; }); setDraft(null); }}>
              <span>{localized(option)}</span><span className="dt-option-indicator" aria-hidden="true">{answers[step] === index && <Check />}</span>
            </button>)}
          </div>
          <div className="dt-check-controls">
            <button className="dt-button dt-button-quiet" type="button" disabled={step === 0} onClick={() => moveTo(step - 1)}><ArrowLeft aria-hidden="true" />{text('Zurück', 'Назад')}</button>
            <button className="dt-button" type="button" disabled={answers[step] === undefined} onClick={() => moveTo(step + 1)}>{text('Weiter', 'Далее')}<ArrowRight aria-hidden="true" /></button>
          </div>
        </> : <>
          <h3 tabIndex={-1} ref={heading}>{text('Erzählen Sie uns von Ihrem Ablauf.', 'Расскажите о своём процессе.')}</h3>
          {example && <p className="dt-selected-example">{text('Gewähltes Beispiel', 'Выбранный пример')}: {example}</p>}
          <form onSubmit={prepareDraft} className="dt-contact-form" onChange={() => { setDraft(null); setCopyStatus(''); }}>
            <div className="dt-form-row">
              <label>{text('Ihr Name', 'Ваше имя')}<input name="name" autoComplete="name" required maxLength={100} value={name} onChange={event => setName(event.target.value)} /></label>
              <label>{text('E-Mail', 'Эл. почта')}<input name="email" type="email" autoComplete="email" required maxLength={150} value={email} onChange={event => setEmail(event.target.value)} /></label>
            </div>
            <label>{text('Unternehmen (optional)', 'Компания (необязательно)')}<input name="company" autoComplete="organization" maxLength={150} value={company} onChange={event => setCompany(event.target.value)} /></label>
            <label>{text('Was passiert heute, was soll einfacher werden?', 'Что происходит сейчас и что хочется упростить?')}<textarea name="message" required minLength={10} maxLength={1200} rows={4} value={message} onChange={event => setMessage(event.target.value)} /></label>
            <div className="dt-check-controls"><button className="dt-button dt-button-quiet" type="button" onClick={() => moveTo(2)}><ArrowLeft aria-hidden="true" />{text('Zurück', 'Назад')}</button><button className="dt-button" type="submit">{text('Anfrage vorbereiten', 'Подготовить обращение')}<ArrowRight aria-hidden="true" /></button></div>
          </form>
          {draft && <div className="dt-mail-draft">
            <h4 ref={draftHeading} tabIndex={-1}>{text('Ihr Entwurf ist bereit.', 'Ваш черновик готов.')}</h4>
            <p>{text('Öffnen Sie den Entwurf und senden Sie die E-Mail dort ab.', 'Откройте черновик и отправьте письмо в почтовой программе.')}</p>
            <div className="dt-button-row"><a className="dt-button" href={mailto}><Mail aria-hidden="true" />{text('Im E-Mail-Programm öffnen', 'Открыть в почте')}</a><button type="button" className="dt-button dt-button-quiet" onClick={copy}><Copy aria-hidden="true" />{text('Text kopieren', 'Копировать текст')}</button></div>
            <p className="dt-caption" role="status">{copyStatus}</p>
            <label>{text('Anfragetext zum Prüfen und Kopieren', 'Текст для проверки и копирования')}<textarea readOnly rows={8} value={draft} /></label>
          </div>}
        </>}
        </motion.div></AnimatePresence>
      </div>
    </div>
  </section>;
}
