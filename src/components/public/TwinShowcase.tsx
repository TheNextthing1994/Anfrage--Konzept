import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Cpu } from 'lucide-react';
import { Reveal } from './PublicEffects';
import { usePublicText } from './usePublicText';

export function TwinShowcase() {
  const { text } = usePublicText();
  const reduced = useReducedMotion();
  return <section className="dt-public-section dt-public-container dt-twin-showcase" aria-labelledby="twin-showcase-title">
    <Reveal className="dt-twin-copy">
      <p className="dt-eyebrow"><Cpu aria-hidden="true" />{text('Ihr digitaler Zwilling', 'Ваш цифровой двойник')}</p>
      <h2 id="twin-showcase-title">{text('Ihr Wissen wird im Alltag nutzbar.', 'Ваши знания помогают в работе.')}</h2>
      <p className="dt-twin-lead">{text('Ihre Erfahrung. Ihre Regeln. Ein gemeinsamer Ablauf.', 'Ваш опыт. Ваши правила. Единый рабочий процесс.')}</p>
      <p className="dt-section-copy">{text('Ihr Fachwissen, Ihre Regeln und Ihre Abläufe bilden die Grundlage der Lösung. Ihr Team behält die Entscheidung bei offenen Fragen und wichtigen Freigaben.', 'Ваши знания, правила и процессы становятся основой решения. Открытые вопросы и важные решения остаются за вашей командой.')}</p>
      <div className="dt-twin-features">{[
        [text('Wissen verbinden', 'Объединять знания'), text('Dokumente, Erfahrungswissen und wiederkehrende Fragen zusammenbringen.', 'Соединять документы, опыт и повторяющиеся вопросы.')],
        [text('Arbeit vorbereiten', 'Готовить работу'), text('Informationen ordnen, Vorschläge erstellen und fehlende Angaben sichtbar machen.', 'Упорядочивать информацию, готовить предложения и видеть недостающие данные.')],
        [text('Bewusst freigeben', 'Осознанно согласовывать'), text('Ihr Team prüft Ausnahmen und entscheidet über den nächsten Schritt.', 'Ваша команда проверяет исключения и определяет следующий шаг.')]
      ].map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
    </Reveal>
    <Reveal delay={.15} className="dt-twin-visual">
      <div className="dt-twin-console-frame"><div className="dt-twin-console">
        <div className="dt-twin-console-header"><span className="dt-console-lights" aria-hidden="true"><i /><i /><i /></span><span>DEMO // TWIN_SYNC</span></div>
        <div className="dt-console-metrics"><div><p>EFFICIENCY_GAIN</p><strong>+70%</strong></div><div><p>UPTIME</p><strong>99.99%</strong></div></div>
        <div className="dt-console-charts"><div><p>NEURAL_PROCESSING</p><div className="dt-console-processing">{[85, 62].map((value, index) => <span key={value}><motion.i style={{ width: `${value}%` }} initial={reduced ? false : { width: 0 }} whileInView={{ width: `${value}%` }} transition={{ duration: reduced ? 0 : 1.5, delay: reduced ? 0 : .5 + index * .2 }} /></span>)}</div></div>
          <div><p>DATA_THROUGHPUT</p><div className="dt-console-throughput">{[40, 70, 45, 90, 65, 80, 50, 85].map((value, index) => <motion.i key={index} style={{ height: `${value}%` }} initial={reduced ? false : { height: 0 }} whileInView={{ height: `${value}%` }} transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : .8 + index * .05 }} />)}</div></div>
        </div>
        <div className="dt-console-log">&gt; INITIALIZING_KNOWLEDGE_BASE... &gt; EXTRACTING_EXPERT_PATTERNS... &gt; GENERATING_DIGITAL_TWIN_INSTANCE... &gt; STATUS: SYNCHRONIZED<span aria-hidden="true" className="dt-console-cursor">_</span></div>
      </div></div>
      <p className="dt-caption dt-console-caption">{text('Funktionsillustration mit Beispielwerten.', 'Иллюстрация работы с примерными значениями.')}</p>
    </Reveal>
  </section>;
}
