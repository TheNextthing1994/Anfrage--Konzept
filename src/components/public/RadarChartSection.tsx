import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, ExternalLink, Info, X } from 'lucide-react';
import { type LocalizedText, usePublicText } from './usePublicText';

// Original demo values, retained for visual continuity. These are illustrative,
// not measurements of a customer's business or values attributed to a study.
const categories: { id: string; label: LocalizedText; potential: number; usage: number; detail: LocalizedText }[] = [
  { id: 'management', label: ['Management', 'Управление'], potential: 85, usage: 18, detail: ['Berichte bündeln, Wissen auffindbar machen und Entscheidungen vorbereiten. Ziele und Freigaben bleiben bei den verantwortlichen Menschen.', 'Собирать отчёты, находить знания и готовить решения. Цели и согласования остаются за ответственными людьми.'] },
  { id: 'finances', label: ['Finanzen', 'Финансы'], potential: 92, usage: 22, detail: ['Belege und wiederkehrende Auswertungen strukturieren. Fachliche Prüfung und verbindliche Entscheidungen gehören zum vereinbarten Ablauf.', 'Упорядочивать документы и регулярные отчёты. Профессиональная проверка и окончательные решения входят в согласованный процесс.'] },
  { id: 'it', label: ['IT & Software', 'ИТ и ПО'], potential: 95, usage: 35, detail: ['Dokumentation erschließen, Entwicklung unterstützen und wiederkehrende Aufgaben vereinfachen. Änderungen werden vor dem Einsatz geprüft.', 'Использовать документацию, помогать в разработке и упрощать повторяющиеся задачи. Изменения проверяются до внедрения.'] },
  { id: 'engineering', label: ['Ingenieurwesen', 'Инженерия'], potential: 78, usage: 12, detail: ['Planstände, Unterlagen und Projektwissen zusammenführen. Technische Freigaben werden durch die zuständigen Fachleute erteilt.', 'Объединять версии чертежей, документы и знания проекта. Технические согласования выполняют ответственные специалисты.'] },
  { id: 'legal', label: ['Recht & Compliance', 'Право и комплаенс'], potential: 88, usage: 10, detail: ['Dokumente erschließen und relevante Textstellen für die fachliche Prüfung vorbereiten. Der konkrete Einsatz wird mit den Verantwortlichen geklärt.', 'Разбирать документы и подготавливать важные фрагменты для профессиональной проверки. Конкретное применение согласуется с ответственными.'] },
  { id: 'education', label: ['Bildung', 'Образование'], potential: 75, usage: 15, detail: ['Vorhandenes Wissen in verständliche Anleitungen, Lernmaterial und Antworten verwandeln. Inhalte werden auf ihre Richtigkeit geprüft.', 'Превращать имеющиеся знания в понятные инструкции, учебные материалы и ответы. Содержание проверяется на достоверность.'] },
  { id: 'media', label: ['Medien & Design', 'Медиа и дизайн'], potential: 82, usage: 25, detail: ['Entwürfe, Varianten und Inhalte vorbereiten. Stil, Qualität und Veröffentlichung bleiben eine bewusste Entscheidung Ihres Teams.', 'Готовить черновики, варианты и материалы. Стиль, качество и публикацию определяет ваша команда.'] },
  { id: 'health', label: ['Gesundheitswesen', 'Здравоохранение'], potential: 65, usage: 8, detail: ['Organisatorische Aufgaben wie Dokumentensuche und Terminabläufe betrachten. Medizinische Entscheidungen gehören zu qualifizierten Fachpersonen.', 'Рассматривать организационные задачи: поиск документов и запись на приём. Медицинские решения принимают квалифицированные специалисты.'] },
  { id: 'sales', label: ['Vertrieb', 'Продажи'], potential: 72, usage: 14, detail: ['Kundenanliegen ordnen, Rückfragen vorbereiten und offene Vorgänge sichtbar halten. So kann Ihr Team gezielter nachfassen.', 'Упорядочивать обращения, готовить уточняющие вопросы и видеть открытые задачи. Это помогает команде вовремя продолжить общение.'] },
  { id: 'admin', label: ['Verwaltung', 'Администрирование'], potential: 90, usage: 28, detail: ['Datenübertragung, Ablage und wiederkehrende Dokumentenarbeit vereinfachen. Ausnahmen und fehlende Angaben bleiben sichtbar.', 'Упрощать перенос данных, хранение и регулярную работу с документами. Исключения и недостающие сведения остаются видимыми.'] }
];

const point = (index: number, radius: number) => {
  const angle = -Math.PI / 2 + index * Math.PI * 2 / categories.length;
  return { x: 300 + Math.cos(angle) * radius, y: 280 + Math.sin(angle) * radius };
};
const polygon = (value: (index: number) => number) => categories.map((_, index) => {
  const p = point(index, value(index)); return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
}).join(' ');

export function RadarChartSection() {
  const { text, localized } = usePublicText();
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const categoryButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId().replace(/:/g, '');
  const titleId = `radar-title-${id}`;
  const detailId = `radar-detail-${id}`;
  const tooltipId = `radar-tooltip-${id}`;
  const category = selected === null ? null : categories[selected];
  const preview = selected === null && hovered !== null ? categories[hovered] : null;
  const active = selected ?? hovered;

  const chartCategory = (event: { currentTarget: SVGSVGElement; clientX: number; clientY: number }) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width * 600 - 300;
    const y = (event.clientY - box.top) / box.height * 560 - 280;
    if (Math.hypot(x, y) < 12 || Math.hypot(x, y) > 188) return null;
    const angle = (Math.atan2(y, x) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
    return Math.round(angle / (Math.PI * 2) * categories.length) % categories.length;
  };
  const open = (index: number) => { setHovered(null); setSelected(index); };

  const close = () => { if (selected !== null) categoryButtons.current[selected]?.focus({ preventScroll: true }); setHovered(null); setSelected(null); };
  useEffect(() => {
    if (selected === null) return;
    closeButton.current?.focus({ preventScroll: true });
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { categoryButtons.current[selected]?.focus({ preventScroll: true }); setHovered(null); setSelected(null); }
    };
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setSelected(null); };
    document.addEventListener('keydown', escape); document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); };
  }, [selected]);

  return <div ref={root} className="dt-radar" aria-labelledby={titleId} onKeyDown={event => { if (event.key === 'Escape') setHovered(null); }}>
    <div className="dt-radar-heading"><p className="dt-eyebrow">{text('Möglichkeiten entdecken', 'Откройте возможности')}</p><h2 id={titleId}>{text('KI-Potenzial', 'Потенциал ИИ')}</h2><p>{text('Erkunden Sie das Diagramm. Klicken oder tippen Sie für die Analyse.', 'Исследуйте диаграмму. Нажмите на область для анализа.')}</p></div>
    <div className="dt-radar-stage" role="group" aria-label={text('Interaktives Spinnendiagramm', 'Интерактивная лепестковая диаграмма')}>
      <svg viewBox="0 0 600 560" aria-hidden="true" focusable="false"
        onPointerMove={event => { if (event.pointerType !== 'touch') setHovered(chartCategory(event)); }}
        onPointerLeave={() => setHovered(null)} onClick={event => { const index = chartCategory(event); if (index !== null) open(index); }}>
        <defs><radialGradient id={`potential-${id}`}><stop offset="0" stopColor="#bedcfd" stopOpacity=".3" /><stop offset="1" stopColor="#8baed8" stopOpacity=".1" /></radialGradient><radialGradient id={`usage-${id}`}><stop offset="0" stopColor="#f0d6bb" stopOpacity=".44" /><stop offset="1" stopColor="#bd9675" stopOpacity=".22" /></radialGradient></defs>
        {[.25, .5, .75, 1].map(scale => <polygon key={scale} points={polygon(() => 166 * scale)} className="dt-radar-grid" />)}
        {categories.map((_, index) => { const p = point(index, 166); return <line key={index} x1={300} y1={280} x2={p.x} y2={p.y} className={active === index ? 'dt-radar-axis dt-radar-axis-active' : 'dt-radar-axis'} />; })}
        <polygon points={polygon(index => categories[index].potential / 100 * 166)} fill={`url(#potential-${id})`} className="dt-radar-potential" />
        <polygon points={polygon(index => categories[index].usage / 100 * 166)} fill={`url(#usage-${id})`} className="dt-radar-usage" />
        {categories.map((item, index) => { const p = point(index, item.potential / 100 * 166); const u = point(index, item.usage / 100 * 166); return <g key={item.id}><circle cx={p.x} cy={p.y} r={active === index ? 6 : 3} className="dt-radar-point" /><circle cx={u.x} cy={u.y} r={active === index ? 5 : 2.5} className="dt-radar-point dt-radar-point-usage" /></g>; })}
        <circle cx={300} cy={280} r={3} fill="#e1edfc" />
      </svg>
      {categories.map((item, index) => {
        const p = point(index, 222);
        return <button key={item.id} ref={element => { categoryButtons.current[index] = element; }} type="button" className="dt-radar-label"
          style={{ left: `${p.x / 600 * 100}%`, top: `${p.y / 560 * 100}%` }} aria-expanded={selected === index}
          aria-controls={selected === index ? detailId : undefined} aria-describedby={preview && hovered === index ? tooltipId : undefined}
          onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(index); }} onPointerLeave={() => setHovered(null)}
          onFocus={() => setHovered(index)} onBlur={() => setHovered(null)} onClick={() => open(index)}>{localized(item.label)}</button>;
      })}
      {preview && <div id={tooltipId} role="tooltip" className={`dt-radar-tooltip ${hovered !== null && point(hovered, 1).y < 280 ? 'dt-radar-tooltip-bottom' : ''}`}>
        <strong>{localized(preview.label)}</strong>
        <dl><div><dt>{text('Potenzial', 'Потенциал')}</dt><dd>{preview.potential}%</dd></div><div><dt>{text('Aktuelle Nutzung', 'Текущее применение')}</dt><dd>{preview.usage}%</dd></div></dl>
        <span>{text('Beispielwerte · Klicken für Analyse', 'Примерные значения · Нажмите для анализа')}<ArrowRight aria-hidden="true" /></span>
      </div>}
      {category && <div key={category.id} id={detailId} className="dt-radar-detail dt-glass" role="region" aria-label={localized(category.label)}>
        <div className="dt-radar-detail-top"><Info aria-hidden="true" /><div><h3>{localized(category.label)}</h3><p>{text('Tiefenanalyse', 'Глубокий анализ')}</p></div><button ref={closeButton} type="button" aria-label={text('Bereich schließen', 'Закрыть область')} onClick={close}><X aria-hidden="true" /></button></div>
        <p>{localized(category.detail)}</p>
        <dl className="dt-radar-values">{[
          { label: text('Potenzial · Beispiel', 'Потенциал · пример'), value: category.potential },
          { label: text('Aktuelle Nutzung · Beispiel', 'Текущее применение · пример'), value: category.usage }
        ].map(item => <div key={item.label}><dt>{item.label}</dt><dd><span>{item.value}%</span><span className="dt-radar-meter" aria-hidden="true"><i style={{ '--dt-radar-value': item.value / 100 } as React.CSSProperties} /></span></dd></div>)}</dl>
        <a className="dt-text-link" href="#/kontakt">{text('Eigenen Ablauf besprechen', 'Обсудить свой процесс')}<ArrowRight aria-hidden="true" /></a>
      </div>}
    </div>
    <div className="dt-radar-legend"><span><i />{text('Potenzial', 'Потенциал')}</span><span><i />{text('Aktuelle Nutzung', 'Текущее применение')}</span></div>
    <a className="dt-radar-source" href="https://www.anthropic.com/research/labor-market-impacts" target="_blank" rel="noopener noreferrer">{text('Hintergrund: Anthropic Research', 'Обзор: Anthropic Research')}<ExternalLink aria-hidden="true" /></a>
    <p className="dt-caption dt-radar-caption">{text('Illustration mit Beispielwerten. Ihr Betriebsprofil klären wir im Gespräch.', 'Иллюстрация с примерными значениями. Профиль вашего бизнеса уточним в беседе.')}</p>
  </div>;
}
