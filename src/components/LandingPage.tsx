import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, FileSearch, FileText, MessageSquare, RotateCcw, ShieldCheck } from 'lucide-react';
import { usePublicText } from './public/usePublicText';

// The former homepage now explains one customer workflow. All state is demo-only;
// it never reads or writes the workstation's requests, initiatives or approvals.
export default function ProductDemo() {
  const { text } = usePublicText();
  const [step, setStep] = useState(0);
  const [processNode, setProcessNode] = useState(0);
  const [project, setProject] = useState('north');
  const [assignedProject, setAssignedProject] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const [approved, setApproved] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const steps = [text('Anfrage verstehen', 'Понять запрос'), text('Prozess prüfen', 'Проверить процесс'), text('Vorschau ansehen', 'Посмотреть прототип'), text('Lösung freigeben', 'Согласовать решение')];
  const titles = [text('Was braucht der Kunde wirklich?', 'Что действительно нужно клиенту?'), text('Der Ablauf wird gemeinsam sichtbar.', 'Вместе делаем процесс понятным.'), text('Probieren Sie die Zuordnung aus.', 'Попробуйте распределить документ.'), text('Die Entscheidung bleibt bei Ihnen.', 'Решение остаётся за вами.')];
  const process = [
    { icon: MessageSquare, name: text('Eingang', 'Приём'), detail: text('Der Betrieb klärt, wie Belege eintreffen. Die passende Anbindung wird für diesen Kanal gesondert geprüft.', 'Уточняем, как поступают документы. Возможность подключения каждого канала проверяется отдельно.') },
    { icon: FileSearch, name: text('Erkennen', 'Распознавание'), detail: text('Belegnummer und Baustelle werden als Vorschlag erkannt. Unsichere Angaben werden zur Prüfung markiert.', 'Предлагаем номер документа и объект. Неуверенно распознанные данные отмечаются для проверки.') },
    { icon: ShieldCheck, name: text('Prüfen', 'Проверка'), detail: text('Das Team bestätigt die Zuordnung oder korrigiert sie. Eine offene Frage wird ausdrücklich angezeigt.', 'Команда подтверждает или исправляет распределение. Открытые вопросы видны явно.') },
    { icon: CheckCircle2, name: text('Überblick', 'Обзор'), detail: text('Der gemeinsame Stand zeigt zugeordnete Belege und offene Rückfragen je Baustelle.', 'В общем списке видны распределённые документы и вопросы по каждому объекту.') }
  ];
  const projectName = (value: string) => value === 'north' ? text('Baustelle Nord', 'Объект Север') : text('Baustelle West', 'Объект Запад');

  const moveTo = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const restart = () => {
    setAssignedProject(null); setProject('north'); setReviewed(false); setApproved(false); setProcessNode(0); moveTo(0);
  };

  return <div className="dt-public-container dt-demo-page">
    <div className="dt-demo-intro"><div><p className="dt-eyebrow">{text('Die Einführung', 'Знакомство с продуктом')}</p><h1>{text('Aus einer Anfrage wird ein klarer Plan.', 'От обращения — к понятному плану.')}</h1><p className="dt-section-copy">{text('Gehen Sie einen Kundenvorgang Schritt für Schritt durch: verstehen, prüfen, ausprobieren und freigeben.', 'Пройдите путь клиента по шагам: разобраться, проверить, попробовать и согласовать.')}</p></div><span className="dt-demo-badge">{text('Interaktive Demo · Beispieldaten', 'Интерактивное демо · Учебные данные')}</span></div>
    <nav className="dt-demo-stepper" aria-label={text('Schritte der Einführung', 'Шаги знакомства')}>
      {steps.map((label, index) => <button key={index} type="button" aria-current={step === index ? 'step' : undefined} onClick={() => moveTo(index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{label}</strong></button>)}
    </nav>
    <section className="dt-glass dt-demo-workspace" aria-labelledby="demo-step-title">
      <div className="dt-demo-workspace-top"><span>{text('Musterbau · Demo-Vorgang', 'Учебная компания · Пример обращения')}</span><span>{step + 1} / 4</span></div>
      <div className="dt-demo-step-body">
        <p className="dt-eyebrow">{steps[step]}</p><h2 id="demo-step-title" ref={heading} tabIndex={-1}>{titles[step]}</h2>
        {step === 0 && <div className="dt-demo-two-columns">
          <div className="dt-demo-message"><MessageSquare aria-hidden="true" /><p className="dt-caption">{text('Beispiel einer eingegangenen Nachricht', 'Пример входящего сообщения')}</p><blockquote>{text('„Unsere Monteure schicken Lieferscheine als Fotos. Im Büro suchen wir ständig, welcher Beleg zu welcher Baustelle gehört. Ich möchte sehen, was vollständig ist und wo noch etwas fehlt.“', '«Монтажники присылают фотографии накладных. В офисе мы постоянно ищем, к какому объекту относится документ. Хочется видеть, где всё в порядке, а чего ещё не хватает».')}</blockquote></div>
          <dl className="dt-demo-understanding"><div><dt>{text('Das Problem', 'Проблема')}</dt><dd>{text('Belege und Rückfragen sind verteilt. Der gemeinsame Überblick fehlt.', 'Документы и вопросы разбросаны. Нет общего обзора.')}</dd></div><div><dt>{text('Das gewünschte Ergebnis', 'Желаемый результат')}</dt><dd>{text('Jeder Beleg hat eine Baustelle. Fehlende Angaben und offene Rückfragen sind sichtbar.', 'У каждого документа есть объект. Недостающие данные и открытые вопросы видны.')}</dd></div><div><dt>{text('Vor der Umsetzung klären', 'Уточнить до внедрения')}</dt><dd>{text('Welche Eingangskanäle? Wer prüft die Angaben? Wo sollen die Dokumente liegen?', 'Какие каналы поступления? Кто проверяет данные? Где хранить документы?')}</dd></div></dl>
        </div>}
        {step === 1 && <>
          <p className="dt-section-copy">{text('Öffnen Sie einen Schritt. So werden Aufgaben und Übergaben verständlich, bevor etwas gebaut wird.', 'Выберите шаг. Так задачи и передачи между участниками становятся понятны до начала разработки.')}</p>
          <ol className="dt-demo-process">{process.map((node, index) => <li key={index}><button type="button" aria-pressed={processNode === index} onClick={() => setProcessNode(index)}><node.icon aria-hidden="true" /><span>0{index + 1}</span><strong>{node.name}</strong></button>{index < process.length - 1 && <ArrowRight className="dt-process-connector" aria-hidden="true" />}</li>)}</ol>
          <div className="dt-demo-explanation"><h3>{process[processNode].name}</h3><p>{process[processNode].detail}</p></div>
          <p className="dt-caption">{text('Beispielprozess. Die technische Kanalintegration gehört zur späteren Umsetzung.', 'Учебный процесс. Техническое подключение каналов относится к последующему внедрению.')}</p>
        </>}
        {step === 2 && <>
          <p className="dt-section-copy">{text('Beim zweiten Beleg ist die Baustelle unklar. Wählen Sie ein Projekt und bestätigen Sie die Zuordnung.', 'У второго документа не указан объект. Выберите проект и подтвердите распределение.')}</p>
          <div className="dt-demo-preview-table" aria-label={text('Belegvorschau', 'Прототип списка документов')}>
            <div className="dt-demo-document"><FileText aria-hidden="true" /><div><strong>LS-1042.pdf</strong><span>{projectName('north')}</span></div><span className="dt-document-status"><CheckCircle2 aria-hidden="true" />{text('Zugeordnet', 'Распределён')}</span></div>
            <div className="dt-demo-document dt-demo-document-action"><FileText aria-hidden="true" /><div><strong>LS-1043.jpg</strong><span>{assignedProject ? projectName(assignedProject) : text('Baustelle noch offen', 'Объект ещё не указан')}</span></div>
              {assignedProject ? <div className="dt-demo-assigned"><span className="dt-document-status"><CheckCircle2 aria-hidden="true" />{text('Zugeordnet', 'Распределён')}</span><button type="button" className="dt-text-link" onClick={() => { setAssignedProject(null); setReviewed(false); setApproved(false); }}>{text('Ändern', 'Изменить')}</button></div> : <div className="dt-demo-assignment"><label htmlFor="demo-project">{text('Projekt auswählen', 'Выбрать проект')}</label><select id="demo-project" value={project} onChange={event => setProject(event.target.value)}><option value="north">{projectName('north')}</option><option value="west">{projectName('west')}</option></select><button type="button" className="dt-button dt-button-small" onClick={() => { setAssignedProject(project); setReviewed(false); setApproved(false); }}>{text('Zuordnen', 'Распределить')}<Check aria-hidden="true" /></button></div>}
            </div>
            <div className="dt-demo-document"><FileText aria-hidden="true" /><div><strong>LS-1044.pdf</strong><span>{projectName('west')}</span></div><span className="dt-document-status"><CheckCircle2 aria-hidden="true" />{text('Zugeordnet', 'Распределён')}</span></div>
          </div>
          <p className="dt-demo-feedback" role="status">{assignedProject ? text('Die Zuordnung im Beispiel ist bestätigt. Alle drei Belege haben jetzt eine Baustelle.', 'Распределение в примере подтверждено. Теперь у всех трёх документов указан объект.') : text('Eine Rückfrage bleibt offen.', 'Один вопрос остаётся открытым.')}</p>
        </>}
        {step === 3 && <div className="dt-demo-two-columns">
          <div><p className="dt-section-copy">{text('Der Plan fasst zusammen, was umgesetzt werden soll. Vor dem echten Projektstart werden Umfang, Kosten und Verantwortlichkeiten vereinbart.', 'План описывает, что предстоит реализовать. До старта реального проекта согласуются объём, стоимость и ответственность.')}</p><ul className="dt-demo-scope">{[text('Gemeinsamer Belegeingang', 'Общий список документов'), text('Vorschläge prüfen und zuordnen', 'Проверка и подтверждение распределения'), text('Offene Rückfragen sichtbar halten', 'Видимые открытые вопросы')].map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul><p className="dt-caption">{text('In diesem Beispiel bleibt eine echte Kanal- und Speicheranbindung noch zu klären.', 'В этом примере подключение каналов и хранилища ещё предстоит уточнить.')}</p></div>
          <div className="dt-demo-approval">
            {approved ? <div role="status"><CheckCircle2 className="dt-demo-complete-icon" aria-hidden="true" /><h3>{text('Demo abgeschlossen.', 'Демо завершено.')}</h3><p>{text('Sie haben den Ablauf geprüft und die Freigabe im Beispiel erteilt. In einem echten Vorgang beginnt danach die vereinbarte Umsetzung.', 'Вы проверили процесс и дали согласие в учебном примере. В реальном проекте затем начинается согласованное внедрение.')}</p><a href="#/kontakt" className="dt-button">{text('Eigenen Ablauf besprechen', 'Обсудить свой процесс')}<ArrowRight aria-hidden="true" /></a></div> : <><p className="dt-demo-badge">{text('Freigabe im Beispiel', 'Учебное согласование')}</p><label className="dt-demo-checkbox"><input type="checkbox" checked={reviewed} onChange={event => setReviewed(event.target.checked)} /><span>{text('Ich habe Prozess und Vorschau geprüft.', 'Я проверил(а) процесс и прототип.')}</span></label><button type="button" className="dt-button" disabled={!reviewed} onClick={() => setApproved(true)}><ShieldCheck aria-hidden="true" />{text('Freigabe demonstrieren', 'Попробовать согласование')}</button></>}
          </div>
        </div>}
      </div>
      <div className="dt-demo-controls"><button type="button" className="dt-button dt-button-quiet" disabled={step === 0} onClick={() => moveTo(step - 1)}><ArrowLeft aria-hidden="true" />{text('Zurück', 'Назад')}</button><span className="dt-caption">{text('Sie arbeiten ausschließlich mit Beispieldaten.', 'Вы работаете только с учебными данными.')}</span>{step < 3 ? <button type="button" className="dt-button" onClick={() => moveTo(step + 1)}>{text('Weiter', 'Далее')}<ArrowRight aria-hidden="true" /></button> : <button type="button" className="dt-button dt-button-quiet" onClick={restart}><RotateCcw aria-hidden="true" />{text('Neu starten', 'Начать заново')}</button>}</div>
    </section>
    <div className="dt-demo-return"><a href="#/" className="dt-text-link"><ArrowLeft aria-hidden="true" />{text('Zur Website', 'На сайт')}</a><a href="#/workstation" className="dt-text-link">{text('Zur Workstation', 'В рабочую область')}<ArrowRight aria-hidden="true" /></a></div>
  </div>;
}
