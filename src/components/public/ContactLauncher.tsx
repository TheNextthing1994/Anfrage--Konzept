import React, { useEffect, useId, useRef, useState } from 'react';
import { Mail, MessageCircle, MessagesSquare, Phone, X } from 'lucide-react';
import { PUBLIC_CONTACT_LINKS } from '../../data/publicContact';
import { usePublicText } from './usePublicText';

export function ContactLauncher() {
  const { text } = usePublicText();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return <div ref={root} className="dt-contact-launcher">
    {open && <div id={panelId} role="group" className="dt-contact-launcher-options dt-glass" aria-label={text('Kontaktmöglichkeiten', 'Способы связи')}>
      <p>{text('Wie möchten Sie uns erreichen?', 'Как вам удобнее связаться?')}</p>
      <a href={PUBLIC_CONTACT_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="dt-contact-action dt-contact-action-whatsapp"><MessageCircle aria-hidden="true" /><span>WhatsApp</span></a>
      <a href={PUBLIC_CONTACT_LINKS.phone} className="dt-contact-action"><Phone aria-hidden="true" /><span>{text('Anrufen', 'Позвонить')}</span></a>
      <a href={PUBLIC_CONTACT_LINKS.email} className="dt-contact-action"><Mail aria-hidden="true" /><span>{text('E-Mail', 'Эл. почта')}</span></a>
    </div>}
    <button ref={trigger} type="button" className="dt-contact-launcher-trigger" aria-expanded={open} aria-controls={open ? panelId : undefined}
      aria-label={open ? text('Kontakt schließen', 'Закрыть контакты') : text('Kontakt öffnen', 'Открыть контакты')}
      onClick={() => setOpen(value => !value)}>{open ? <X aria-hidden="true" /> : <MessagesSquare aria-hidden="true" />}<span>{text('Kontakt', 'Связаться')}</span></button>
  </div>;
}
