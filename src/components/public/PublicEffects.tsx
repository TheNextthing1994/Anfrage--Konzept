import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

/** The original bevel, halo and moving reflections, recolored to slate/steel. */
export function GlossyText({ children }: { children: React.ReactNode }) {
  return <span className="dt-glossy-text">
    <span className="dt-glossy-depth" aria-hidden="true">{children}</span>
    <span className="dt-glossy-halo" aria-hidden="true">{children}</span>
    <span className="dt-glossy-body">{children}</span>
    <span className="dt-glossy-sweep" aria-hidden="true">{children}</span>
    <span className="dt-glossy-glare" aria-hidden="true">{children}</span>
  </span>;
}

export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: .12 }}
    transition={{ duration: reduced ? 0 : .6, delay: reduced ? 0 : delay, ease: [.2, .8, .2, 1] }}>{children}</motion.div>;
}
