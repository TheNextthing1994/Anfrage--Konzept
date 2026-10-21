import React from 'react';
import { ArrowRight, Check, ChevronDown, MessageSquare, Route, Sparkles } from 'lucide-react';
import { usePublicText } from './usePublicText';

export function ServiceOverview() {
  const { text } = usePublicText();
  const services = [
    { id: 'beratung', icon: MessageSquare, title: text('KI-Beratung', 'Консультация по ИИ'), body: text('Wir schauen auf Ihren Arbeitsalltag, erkennen sinnvolle Ansatzpunkte und klären, welcher erste Schritt sich für Sie lohnt.', 'Изучаем вашу работу, находим полезные возможности и определяем подходящий первый шаг.') },
    { id: 'automatisierung', icon: Route, title: text('Automatisierung', 'Автоматизация'), body: text('Wiederkehrende Arbeitsschritte werden zu einem nachvollziehbaren Ablauf mit klaren Übergaben, Rückfragen und Freigaben.', 'Повторяющиеся действия превращаются в понятный процесс с чёткими передачами, уточнениями и согласованиями.') },
    { id: 'chatbots', icon: Sparkles, title: text('Chatbots & Wissenszugang', 'Чат-боты и доступ к знаниям'), body: text('Geprüftes Wissen unterstützt Antworten für Kunden und Team. Gemeinsam bestimmen wir, wann ein Mensch übernimmt.', 'Проверенные знания помогают отвечать клиентам и команде. Вместе определяем, когда подключается человек.') }
  ];
  return <div className="dt-service-overview" aria-label={text('Unsere Leistungen', 'Наши услуги')}>
    {services.map(service => <article key={service.id} id={service.id} tabIndex={-1}><service.icon aria-hidden="true" /><h3>{service.title}</h3><p>{service.body}</p></article>)}
  </div>;
}

export function PricingAndFaq() {
  const { text } = usePublicText();
  const faqs = [
    [text('Womit fangen wir an?', 'С чего мы начнём?'), text('Mit einem konkreten Ablauf aus Ihrem Betrieb: Was passiert heute, wer ist beteiligt und wo entsteht unnötige Arbeit? Daraus entwickeln wir den ersten prüfbaren Vorschlag.', 'С одного конкретного процесса: что происходит сейчас, кто участвует и где возникает лишняя работа? На этой основе подготовим первый проверяемый вариант.')],
    [text('Muss ich mich mit Technik auskennen?', 'Нужно ли разбираться в технологиях?'), text('Sie kennen Ihren Betrieb. Wir machen Möglichkeiten und Grenzen verständlich und zeigen eine Vorschau, damit Sie den vorgeschlagenen Ablauf selbst beurteilen können.', 'Вы знаете свой бизнес. Мы понятно объясняем возможности и ограничения и показываем прототип, чтобы вы могли сами оценить решение.')],
    [text('Braucht jeder Ablauf künstliche Intelligenz?', 'Каждому процессу нужен искусственный интеллект?'), text('Viele Aufgaben lassen sich bereits mit klaren Regeln und vorhandenen Werkzeugen vereinfachen. Wir wählen die Umsetzung danach aus, was für Ihren Ablauf verlässlich funktioniert.', 'Многие задачи можно упростить с помощью понятных правил и имеющихся инструментов. Выбираем то, что надёжно работает для вашего процесса.')],
    [text('Wie werden Daten und Zugriffe geregelt?', 'Как определяются хранение данных и доступ?'), text('Vor dem Einsatz klären wir, welche Daten benötigt werden, wer darauf zugreifen darf und welche Systeme sie verarbeiten. Diese Entscheidungen gehören zum vereinbarten Projektumfang.', 'До внедрения определяем, какие данные нужны, кто имеет к ним доступ и какие системы их обрабатывают. Эти решения входят в согласованный объём проекта.')],
    [text('Lassen sich meine Nachrichtenkanäle verbinden?', 'Можно ли подключить мои каналы сообщений?'), text('Wir prüfen die verfügbaren Schnittstellen und Berechtigungen für den jeweiligen Kanal. Der konkrete Empfang, die Zuordnung und die Übergabe an Ihr Team werden anschließend vereinbart.', 'Проверяем доступные интерфейсы и разрешения каждого канала. Затем согласуем приём сообщений, их распределение и передачу вашей команде.')],
    [text('Wann stehen Preis und Zeitplan fest?', 'Когда будут известны стоимость и сроки?'), text('Sobald Anforderungen, Schnittstellen und die erste Umsetzung ausreichend geklärt sind. Sie erhalten ein Angebot mit Umfang, Kosten und nächsten Schritten, bevor die Umsetzung beginnt.', 'Когда достаточно уточнены требования, интеграции и первый этап. До начала реализации вы получите предложение с объёмом, стоимостью и дальнейшими шагами.')]
  ];
  return <>
    <section id="preise" tabIndex={-1} className="dt-public-section dt-public-container dt-pricing-section" aria-labelledby="pricing-title">
      <div><p className="dt-eyebrow">{text('Preise & Umfang', 'Стоимость и объём')}</p><h2 id="pricing-title">{text('Was kostet Ihr Vorhaben?', 'Сколько будет стоить ваш проект?')}</h2><p className="dt-section-copy">{text('Der Preis richtet sich nach Ihrem Ablauf, den benötigten Anbindungen und dem vereinbarten Umfang. Wir machen diese Punkte vor dem Projektstart greifbar.', 'Стоимость зависит от вашего процесса, необходимых интеграций и согласованного объёма. Уточняем всё это до начала проекта.')}</p></div>
      <div className="dt-glass dt-pricing-card"><h3>{text('Ihr individuelles Angebot', 'Ваше индивидуальное предложение')}</h3><ul>{[
        text('Klar beschriebener Leistungsumfang', 'Чётко описанный объём работ'), text('Umsetzung und laufende Kosten getrennt', 'Отдельно внедрение и текущие расходы'), text('Vorschau und vereinbarte Freigabeschritte', 'Прототип и согласованные этапы проверки')
      ].map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul><a href="#/kontakt" className="dt-button">{text('Vorhaben besprechen', 'Обсудить проект')}<ArrowRight aria-hidden="true" /></a></div>
    </section>
    <section id="faq" tabIndex={-1} className="dt-public-section dt-public-container dt-faq-section" aria-labelledby="faq-title">
      <div><p className="dt-eyebrow">{text('Gut zu wissen', 'Полезно знать')}</p><h2 id="faq-title">{text('Häufige Fragen', 'Частые вопросы')}</h2><p className="dt-section-copy">{text('Die wichtigsten Antworten vor unserem ersten Gespräch.', 'Главное, что стоит знать до первой беседы.')}</p></div>
      <div className="dt-faq-list">{faqs.map(([question, answer], index) => <details key={index} name="public-faq"><summary>{question}<ChevronDown aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
    </section>
  </>;
}
