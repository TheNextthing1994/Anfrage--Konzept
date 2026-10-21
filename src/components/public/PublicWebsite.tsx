import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, CheckCircle2, Hammer, MessageSquare, ShoppingBag } from 'lucide-react';
import { PotentialCheck } from './PotentialCheck';
import { type LocalizedText, usePublicText } from './usePublicText';
import { RadarChartSection } from './RadarChartSection';
import { PricingAndFaq, ServiceOverview, ServicePage } from './WebsiteInformation';
import { TwinShowcase } from './TwinShowcase';
import { IndustryTicker } from './IndustryTicker';
import { Reveal } from './PublicEffects';

// Curated from Berufsgruppen-DigitalTwinArchitecs.io: the brand, industry examples and potential check.
const examples: { icon: typeof Hammer; name: LocalizedText; title: LocalizedText; problem: LocalizedText; result: LocalizedText; items: LocalizedText[] }[] = [
  { icon: Hammer, name: ['Handwerk', 'Ремесленный бизнес'], title: ['Lieferscheine im Blick.', 'Документы под контролем.'],
    problem: ['Fotos, Nachrichten und Belege landen an verschiedenen Stellen. Im Büro beginnt die Suche.', 'Фото, сообщения и накладные приходят в разные места. Сотрудники тратят время на поиск.'],
    result: ['Ein gemeinsamer Eingang zeigt, welcher Beleg zu welcher Baustelle gehört und wo noch etwas fehlt.', 'Общий список показывает, к какому объекту относится документ и чего ещё не хватает.'],
    items: [['Belege zuordnen', 'Распределять документы'], ['Fehlendes erkennen', 'Видеть недостающее'], ['Rückfragen gezielt klären', 'Уточнять детали адресно']] },
  { icon: MessageSquare, name: ['Dienstleistung', 'Сфера услуг'], title: ['Aus Nachrichten werden klare Anfragen.', 'Из сообщений — в понятные задачи.'],
    problem: ['Neue Interessenten schreiben über verschiedene Wege. Details und offene Fragen gehen im Verlauf unter.', 'Клиенты обращаются по разным каналам. Детали и открытые вопросы теряются в переписке.'],
    result: ['Ein strukturierter Vorgang bündelt das Anliegen, die nächsten Rückfragen und den aktuellen Bearbeitungsstand.', 'В одной карточке собраны задача клиента, уточняющие вопросы и текущий статус.'],
    items: [['Anliegen zusammenfassen', 'Собирать суть обращения'], ['Rückfragen vorbereiten', 'Готовить уточнения'], ['Bearbeitung verfolgen', 'Отслеживать работу']] },
  { icon: ShoppingBag, name: ['Onlinehandel', 'Интернет-магазины'], title: ['Wiederkehrende Fragen schneller klären.', 'Быстрее отвечать на повторяющиеся вопросы.'],
    problem: ['Lieferstatus, Rückgaben und Produktfragen binden Ihr Team immer wieder.', 'Вопросы о доставке, возвратах и товарах постоянно занимают команду.'],
    result: ['Geprüftes Produktwissen und klare Übergaben unterstützen Antworten. Unklare Fälle bleiben beim Team.', 'Проверенная информация о товарах помогает готовить ответы. Неясные ситуации передаются сотрудникам.'],
    items: [['Wissen zugänglich machen', 'Открывать доступ к знаниям'], ['Antworten vorbereiten', 'Готовить ответы'], ['Ausnahmen übergeben', 'Передавать сложные случаи']] }
];

export function PublicWebsite({ activeSection }: { activeSection?: string | null }) {
  const { text, localized } = usePublicText();
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [contactExample, setContactExample] = useState<number | null>(null);
  const [contactIndustry, setContactIndustry] = useState('');
  const [entered, setEntered] = useState<string | null>(null);
  const example = examples[selected];
  const page = ['beratung', 'automatisierung', 'chatbots', 'preise', 'faq'].includes(activeSection || '') ? activeSection! : 'home';
  return <>
    <AnimatePresence mode="wait">
    <motion.div key={page} className="dt-public-page" data-view={page} data-ready={entered === page}
      initial={reduced ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
      transition={{ duration: reduced ? 0 : .4, ease: [.2, .8, .2, 1] }} onAnimationComplete={definition => { if (typeof definition === 'object' && !Array.isArray(definition) && definition.opacity === 1) { setEntered(page); window.dispatchEvent(new Event('dt-public-page-ready')); } }}>
    {page === 'home' ? <>
    <section className="dt-public-hero dt-public-container" aria-labelledby="hero-title">
      <div className="dt-hero-copy">
        <p className="dt-eyebrow"><span className="dt-live-dot" />{text('KI · Automatisierung · Individuelle Software', 'ИИ · Автоматизация · Программные решения')}</p>
        <h1 id="hero-title">{text('Wir machen Ihren Betrieb', 'Помогаем вашему бизнесу работать')}<br /><span>{text('effizienter.', 'эффективнее.')}</span></h1>
        <p className="dt-hero-description">{text('Weniger Suchen. Weniger Nachtragen. Mehr Zeit für Ihre eigentliche Arbeit. Wir entwickeln digitale Abläufe, die Ihr Team im Alltag entlasten.', 'Меньше поисков и ручного ввода. Больше времени на основную работу. Создаём цифровые процессы, которые помогают вашей команде каждый день.')}</p>
        <div className="dt-button-row dt-hero-actions"><a href="#/kontakt" className="dt-button dt-button-glow"><span>{text('Potenzial-Check starten', 'Оценить свою задачу')}</span><ArrowRight aria-hidden="true" /></a><a href="#/demo" className="dt-button dt-button-metal"><span>{text('So funktioniert’s', 'Как это работает')}</span></a></div>
        <ul className="dt-hero-promises">{[
          { label: text('Demo direkt ausprobieren', 'Попробовать демо'), href: '#/demo' },
          { label: text('Umfang und Preis vorab', 'Объём и цена заранее'), href: '#/preise' },
          { label: text('Direkter Kontakt zum Entwickler', 'Связь с разработчиком'), href: '#/kontakt' }
        ].map(item => <li key={item.href}><a href={item.href}><span className="dt-trust-mark"><CheckCircle2 aria-hidden="true" /></span>{item.label}</a></li>)}</ul>
      </div>
      <div className="dt-hero-visual"><RadarChartSection /></div>
    </section>

    <section id="loesungen" tabIndex={-1} className="dt-public-section dt-solutions-section" aria-labelledby="solutions-title">
      <div className="dt-public-container">
        <ServiceOverview />
        <div className="dt-section-heading"><div><p className="dt-eyebrow">{text('Im Alltag beginnt die Lösung', 'Решение начинается с повседневных задач')}</p><h2 id="solutions-title">{text('Kommt Ihnen das bekannt vor?', 'Знакомая ситуация?')}</h2></div><p className="dt-section-copy">{text('Drei Beispiele für einen sinnvollen ersten Schritt. Wir beginnen dort, wo Ihrem Team heute Arbeit liegen bleibt.', 'Три примера для первого шага. Начинаем с того, что сегодня отнимает время у вашей команды.')}</p></div>
        <div className="dt-industry-options" role="group" aria-label={text('Branchenbeispiele', 'Примеры по отраслям')}>
          {examples.map((item, index) => <button type="button" key={index} aria-pressed={selected === index} onClick={() => setSelected(index)}><item.icon aria-hidden="true" />{localized(item.name)}</button>)}
        </div>
        <Reveal className="dt-example-detail" key={selected}>
          <div><p className="dt-eyebrow">{text('Heute', 'Сегодня')}</p><p className="dt-example-problem">{localized(example.problem)}</p></div>
          <div><p className="dt-eyebrow">{text('So könnte es gehen', 'Как может быть')}</p><h3>{localized(example.title)}</h3><p className="dt-section-copy">{localized(example.result)}</p><ul className="dt-example-features">{example.items.map((item, index) => <li key={index}><Check aria-hidden="true" />{localized(item)}</li>)}</ul><a href="#/kontakt" className="dt-text-link" onClick={() => { setContactIndustry(''); setContactExample(selected); }}>{text('Diesen Ablauf besprechen', 'Обсудить этот процесс')}<ArrowRight aria-hidden="true" /></a></div>
        </Reveal>
        <p className="dt-caption">{text('Die Beispiele zeigen mögliche Lösungen. Umfang, Schnittstellen und Machbarkeit klären wir für Ihren Betrieb.', 'Это примеры возможных решений. Объём, интеграции и реализуемость уточняем для вашего бизнеса.')}</p>
      </div>
    </section>

    <section id="ablauf" tabIndex={-1} className="dt-public-section dt-public-container" aria-labelledby="collaboration-title">
      <p className="dt-eyebrow">{text('So arbeiten wir zusammen', 'Как мы работаем вместе')}</p><div className="dt-section-heading"><h2 id="collaboration-title">{text('Erst verstehen. Dann vereinfachen.', 'Сначала понять. Затем упростить.')}</h2><a href="#/demo" className="dt-text-link">{text('Am Beispiel durchspielen', 'Пройти на примере')}<ArrowRight aria-hidden="true" /></a></div>
      <ol className="dt-collaboration-steps">{[
        [text('Ihren Alltag verstehen', 'Понять вашу работу'), text('Sie zeigen uns einen Ablauf, die beteiligten Menschen und die heutigen Hindernisse.', 'Вы показываете один процесс, его участников и текущие сложности.')],
        [text('Eine Lösung greifbar machen', 'Показать решение'), text('Wir prüfen die Möglichkeiten und zeigen eine Vorschau. Sie sehen früh, ob der Ansatz passt.', 'Проверяем возможности и показываем прототип. Вы рано видите, подходит ли подход.')],
        [text('Gemeinsam entscheiden', 'Решить вместе'), text('Umfang, Kosten und nächste Schritte werden vereinbart, bevor die Umsetzung beginnt.', 'Согласуем объём, стоимость и дальнейшие шаги до начала внедрения.')]
      ].map(([title, body], index) => <li key={index}><span className="dt-step-number">0{index + 1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
    </section>

    <TwinShowcase />
    <IndustryTicker onChoose={industry => { setContactIndustry(industry); setContactExample(null); window.location.hash = '/kontakt'; }} />
    </> : page === 'preise' || page === 'faq' ? <PricingAndFaq only={page} /> : <ServicePage page={page as 'beratung' | 'automatisierung' | 'chatbots'} />}
    </motion.div>
    </AnimatePresence>
    <PotentialCheck example={contactIndustry || (contactExample === null ? '' : localized(examples[contactExample].title))} />
  </>;
}
