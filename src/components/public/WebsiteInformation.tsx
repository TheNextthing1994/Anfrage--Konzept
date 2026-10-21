import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, ChevronDown, MessageSquare, Route, Sparkles } from 'lucide-react';
import { usePublicText } from './usePublicText';

function useServices() {
  const { text } = usePublicText();
  const services = [
    { id: 'beratung', icon: MessageSquare, title: text('KI-Beratung', 'Консультация по ИИ'), body: text('Wir schauen auf Ihren Arbeitsalltag, erkennen sinnvolle Ansatzpunkte und klären, welcher erste Schritt sich für Sie lohnt.', 'Изучаем вашу работу, находим полезные возможности и определяем подходящий первый шаг.') },
    { id: 'automatisierung', icon: Route, title: text('Automatisierung', 'Автоматизация'), body: text('Wiederkehrende Arbeitsschritte werden zu einem nachvollziehbaren Ablauf mit klaren Übergaben, Rückfragen und Freigaben.', 'Повторяющиеся действия превращаются в понятный процесс с чёткими передачами, уточнениями и согласованиями.') },
    { id: 'chatbots', icon: Sparkles, title: text('Chatbots & Wissenszugang', 'Чат-боты и доступ к знаниям'), body: text('Geprüftes Wissen unterstützt Antworten für Kunden und Team. Gemeinsam bestimmen wir, wann ein Mensch übernimmt.', 'Проверенные знания помогают отвечать клиентам и команде. Вместе определяем, когда подключается человек.') }
  ];
  return services;
}

export function ServiceOverview() {
  const { text } = usePublicText();
  const services = useServices();
  const reduced = useReducedMotion();
  return <div className="dt-service-overview" aria-label={text('Unsere Leistungen', 'Наши услуги')}>
    {services.map((service, index) => <motion.article key={service.id} initial={reduced ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: .15 }} transition={{ duration: reduced ? 0 : .6, delay: reduced ? 0 : index * .1 }}><service.icon aria-hidden="true" /><h3>{service.title}</h3><p>{service.body}</p><a className="dt-text-link" href={`#/${service.id}`}>{text('Mehr erfahren', 'Подробнее')}<ArrowRight aria-hidden="true" /></a></motion.article>)}
  </div>;
}

export function ServicePage({ page }: { page: 'beratung' | 'automatisierung' | 'chatbots' }) {
  const { text } = usePublicText();
  const reduced = useReducedMotion();
  const service = useServices().find(item => item.id === page)!;
  const steps = page === 'beratung' ? [
    [text('Den Ablauf verstehen', 'Понять процесс'), text('Wir betrachten einen konkreten Arbeitsablauf, seine Übergaben und die Stellen, an denen heute Zeit verloren geht.', 'Рассматриваем конкретный процесс, передачи задач и места, где сегодня теряется время.')],
    [text('Eine Vorschau prüfen', 'Проверить прототип'), text('Sie sehen einen ersten Vorschlag und können selbst beurteilen, ob er Ihren Arbeitsalltag trifft.', 'Вы видите первый вариант и можете сами оценить, подходит ли он для вашей работы.')],
    [text('Den Umfang vereinbaren', 'Согласовать объём'), text('Anforderungen, Schnittstellen, Kosten und nächste Schritte werden vor der Umsetzung geklärt.', 'Требования, интеграции, стоимость и дальнейшие шаги уточняем до реализации.')]
  ] : page === 'automatisierung' ? [
    [text('Informationen zusammenführen', 'Объединять информацию'), text('Nachrichten, Belege und Daten bekommen einen nachvollziehbaren Eingang statt vieler einzelner Ablagen.', 'Сообщения, документы и данные получают понятную точку входа вместо множества отдельных папок.')],
    [text('Regeln nutzbar machen', 'Применять правила'), text('Wiederkehrende Zuordnungen werden vorbereitet. Fehlende Angaben bleiben sichtbar und lassen sich gezielt klären.', 'Повторяющиеся распределения готовятся заранее. Недостающие данные остаются видимыми и уточняются адресно.')],
    [text('Menschen einbeziehen', 'Вовлекать людей'), text('Prüfung, Ausnahmen und Freigaben erhalten klare Zuständigkeiten und einen sichtbaren Bearbeitungsstand.', 'Проверки, исключения и согласования получают ответственных и видимый статус работы.')]
  ] : [
    [text('Ihr Wissen als Grundlage', 'Ваши знания — основа'), text('Wir bestimmen gemeinsam, welche Dokumente und Antworten der Assistent verwenden darf.', 'Вместе определяем, какие документы и ответы может использовать помощник.')],
    [text('Rückfragen statt Raten', 'Уточнять вместо догадок'), text('Fehlende Informationen werden erfragt. Unklare Anliegen bleiben für Ihr Team erkennbar.', 'Недостающие сведения уточняются. Неясные обращения остаются видимыми для команды.')],
    [text('Klare Übergabe ans Team', 'Понятная передача команде'), text('Gemeinsam legen wir fest, wann ein Mensch übernimmt und welche Informationen ihn dabei erreichen.', 'Вместе определяем, когда подключается человек и какую информацию он получает.')]
  ];
  return <section id={page} tabIndex={-1} className="dt-public-section dt-public-container dt-service-page" aria-labelledby="service-page-title">
    <p className="dt-eyebrow"><service.icon aria-hidden="true" />{text('Unsere Leistungen', 'Наши услуги')}</p><h1 id="service-page-title">{service.title}</h1><p className="dt-service-page-lead">{service.body}</p>
    <div className="dt-service-cards">{steps.map(([title, body], index) => <motion.article className="dt-glass" key={title} initial={reduced ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .6, delay: reduced ? 0 : .12 + index * .1 }}><span>0{index + 1}</span><h2>{title}</h2><p>{body}</p></motion.article>)}</div>
    <div className="dt-button-row"><a href="#/kontakt" className="dt-button">{text('Eigenen Ablauf besprechen', 'Обсудить свой процесс')}<ArrowRight aria-hidden="true" /></a><a href="#/demo" className="dt-button dt-button-quiet">{text('Produktdemo ausprobieren', 'Попробовать демо')}</a></div>
  </section>;
}

export function PricingAndFaq({ only }: { only?: 'preise' | 'faq' }) {
  const { text } = usePublicText();
  const Heading = only ? 'h1' : 'h2';
  const faqs = [
    [text('Womit fangen wir an?', 'С чего мы начнём?'), text('Mit einem konkreten Ablauf aus Ihrem Betrieb: Was passiert heute, wer ist beteiligt und wo entsteht unnötige Arbeit? Daraus entwickeln wir den ersten prüfbaren Vorschlag.', 'С одного конкретного процесса: что происходит сейчас, кто участвует и где возникает лишняя работа? На этой основе подготовим первый проверяемый вариант.')],
    [text('Muss ich mich mit Technik auskennen?', 'Нужно ли разбираться в технологиях?'), text('Sie kennen Ihren Betrieb. Wir machen Möglichkeiten und Grenzen verständlich und zeigen eine Vorschau, damit Sie den vorgeschlagenen Ablauf selbst beurteilen können.', 'Вы знаете свой бизнес. Мы понятно объясняем возможности и ограничения и показываем прототип, чтобы вы могли сами оценить решение.')],
    [text('Braucht jeder Ablauf künstliche Intelligenz?', 'Каждому процессу нужен искусственный интеллект?'), text('Viele Aufgaben lassen sich bereits mit klaren Regeln und vorhandenen Werkzeugen vereinfachen. Wir wählen die Umsetzung danach aus, was für Ihren Ablauf verlässlich funktioniert.', 'Многие задачи можно упростить с помощью понятных правил и имеющихся инструментов. Выбираем то, что надёжно работает для вашего процесса.')],
    [text('Wie werden Daten und Zugriffe geregelt?', 'Как определяются хранение данных и доступ?'), text('Vor dem Einsatz klären wir, welche Daten benötigt werden, wer darauf zugreifen darf und welche Systeme sie verarbeiten. Diese Entscheidungen gehören zum vereinbarten Projektumfang.', 'До внедрения определяем, какие данные нужны, кто имеет к ним доступ и какие системы их обрабатывают. Эти решения входят в согласованный объём проекта.')],
    [text('Lassen sich meine Nachrichtenkanäle verbinden?', 'Можно ли подключить мои каналы сообщений?'), text('Wir prüfen die verfügbaren Schnittstellen und Berechtigungen für den jeweiligen Kanal. Der konkrete Empfang, die Zuordnung und die Übergabe an Ihr Team werden anschließend vereinbart.', 'Проверяем доступные интерфейсы и разрешения каждого канала. Затем согласуем приём сообщений, их распределение и передачу вашей команде.')],
    [text('Wann stehen Preis und Zeitplan fest?', 'Когда будут известны стоимость и сроки?'), text('Sobald Anforderungen, Schnittstellen und die erste Umsetzung ausreichend geklärt sind. Sie erhalten ein Angebot mit Umfang, Kosten und nächsten Schritten, bevor die Umsetzung beginnt.', 'Когда достаточно уточнены требования, интеграции и первый этап. До начала реализации вы получите предложение с объёмом, стоимостью и дальнейшими шагами.')]
  ];
  return <>
    {only !== 'faq' && <section id="preise" tabIndex={-1} className="dt-public-section dt-public-container dt-pricing-section" aria-labelledby="pricing-title">
      <div><p className="dt-eyebrow">{text('Preise & Umfang', 'Стоимость и объём')}</p><Heading id="pricing-title">{text('Was kostet Ihr Vorhaben?', 'Сколько будет стоить ваш проект?')}</Heading><p className="dt-section-copy">{text('Der Preis richtet sich nach Ihrem Ablauf, den benötigten Anbindungen und dem vereinbarten Umfang. Wir machen diese Punkte vor dem Projektstart greifbar.', 'Стоимость зависит от вашего процесса, необходимых интеграций и согласованного объёма. Уточняем всё это до начала проекта.')}</p></div>
      <div className="dt-glass dt-pricing-card"><h3>{text('Ihr individuelles Angebot', 'Ваше индивидуальное предложение')}</h3><ul>{[
        text('Klar beschriebener Leistungsumfang', 'Чётко описанный объём работ'), text('Umsetzung und laufende Kosten getrennt', 'Отдельно внедрение и текущие расходы'), text('Vorschau und vereinbarte Freigabeschritte', 'Прототип и согласованные этапы проверки')
      ].map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul><a href="#/kontakt" className="dt-button">{text('Vorhaben besprechen', 'Обсудить проект')}<ArrowRight aria-hidden="true" /></a></div>
    </section>}
    {only !== 'preise' && <section id="faq" tabIndex={-1} className="dt-public-section dt-public-container dt-faq-section" aria-labelledby="faq-title">
      <div><p className="dt-eyebrow">{text('Gut zu wissen', 'Полезно знать')}</p><Heading id="faq-title">{text('Häufige Fragen', 'Частые вопросы')}</Heading><p className="dt-section-copy">{text('Die wichtigsten Antworten vor unserem ersten Gespräch.', 'Главное, что стоит знать до первой беседы.')}</p></div>
      <div className="dt-faq-list">{faqs.map(([question, answer], index) => <details key={index} name="public-faq"><summary>{question}<ChevronDown aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
    </section>}
  </>;
}
