import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Pause, Play, X } from 'lucide-react';
import { PUBLIC_INDUSTRIES, type PublicIndustry } from '../../data/publicIndustries';
import { usePublicText } from './usePublicText';

export function IndustryTicker({ onChoose }: { onChoose: (industry: string) => void }) {
  const { text, localized } = usePublicText();
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<PublicIndustry | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const returnFocus = useRef(true);
  const rows = [PUBLIC_INDUSTRIES.slice(0, 10), PUBLIC_INDUSTRIES.slice(10)];

  useEffect(() => {
    if (!selected) return;
    const previous = document.activeElement as HTMLElement | null;
    const scroll = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setSelected(null); }
      if (event.key !== 'Tab') return;
      const targets = dialog.current?.querySelectorAll<HTMLElement>('button, a[href]');
      if (!targets?.length) return;
      const first = targets[0], last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keyboard);
    return () => { document.body.style.overflow = scroll; document.removeEventListener('keydown', keyboard); if (returnFocus.current) previous?.focus({ preventScroll: true }); };
  }, [selected]);

  return <>
    <section className="dt-industry-ticker" data-paused={paused || !!reduced} data-dialog-open={!!selected} aria-labelledby="industry-ticker-title"
      onFocusCapture={event => { if ((event.target as HTMLElement).matches('.dt-industry-tile:focus-visible')) setPaused(true); }}>
      <div className="dt-public-container dt-industry-ticker-heading"><h2 id="industry-ticker-title">{text('Unsere Zielgruppen & Möglichkeiten', 'Наши отрасли и возможности')}</h2>
        {!reduced && <button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}{paused ? text('Bewegung fortsetzen', 'Продолжить движение') : text('Bewegung pausieren', 'Приостановить движение')}</button>}
      </div>
      {rows.map((row, rowIndex) => <div key={rowIndex} className="dt-industry-row"><div className="dt-industry-track" data-direction={rowIndex === 0 ? 'left' : 'right'}>
        {[0, 1].map(copy => <div key={copy} className="dt-industry-set" aria-hidden={copy === 1 ? true : undefined}>
          {row.map(industry => <motion.button key={industry.id} type="button" tabIndex={copy === 1 ? -1 : 0} className="dt-industry-tile"
            onMouseDown={copy === 1 ? event => event.preventDefault() : undefined}
            whileHover={reduced ? undefined : { scale: 1.05, y: -8, rotateX: 5, rotateY: 2 }} whileTap={reduced ? undefined : { scale: .95 }}
            onClick={() => { returnFocus.current = true; setSelected(industry); }} aria-haspopup="dialog">
            <span>{localized(industry.label)}</span>
          </motion.button>)}
        </div>)}
      </div></div>)}
    </section>
    {createPortal(<div className="dt-public dt-public-modal-root"><AnimatePresence>
      {selected && <motion.div className="dt-industry-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }}
        onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}>
        <motion.div ref={dialog} className="dt-industry-modal" role="dialog" aria-modal="true" aria-labelledby="industry-modal-title"
          initial={reduced ? false : { opacity: 0, scale: .95, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, scale: .95, y: 40 }}>
          <button type="button" className="dt-industry-modal-close" aria-label={text('Branche schließen', 'Закрыть отрасль')} onClick={() => setSelected(null)}><X aria-hidden="true" /></button>
          <div className="dt-industry-modal-intro"><p className="dt-eyebrow">{text('Branchen-Ideen', 'Идеи для отрасли')}</p><h2 id="industry-modal-title">{localized(selected.label)}</h2>
            <p>{text('So könnte Ihr Fachwissen im Arbeitsalltag nutzbar werden.', 'Так ваши знания могут помогать в ежедневной работе.')}</p>
            <button type="button" className="dt-button" onClick={() => { returnFocus.current = false; onChoose(localized(selected.label)); setSelected(null); }}>{text('Eigenen Ablauf besprechen', 'Обсудить свой процесс')}<ArrowRight aria-hidden="true" /></button>
          </div>
          <div className="dt-industry-modal-ideas"><h3>{text('Mögliche Ansatzpunkte', 'Возможные направления')}</h3>
            {selected.solutions.map((solution, index) => <motion.div className="dt-industry-idea" key={index} initial={reduced ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduced ? 0 : .2 + index * .1 }}><i aria-hidden="true" /><span>{localized(solution)}</span></motion.div>)}
            <p className="dt-caption">{text('Dies sind Beispiele. Den passenden Umfang und die Machbarkeit klären wir für Ihren Betrieb.', 'Это примеры. Подходящий объём и возможность реализации уточним для вашего бизнеса.')}</p>
          </div>
        </motion.div>
      </motion.div>}
    </AnimatePresence></div>, document.body)}
  </>;
}
