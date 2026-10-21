import React from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { PUBLIC_CONTACT_LINKS } from '../../data/publicContact';
import { usePublicText } from './usePublicText';

export function ContactLauncher() {
  const { text } = usePublicText();
  const actions = [
    { id: 'phone', label: text('Anrufen', 'Позвонить'), href: PUBLIC_CONTACT_LINKS.phone, icon: Phone },
    { id: 'whatsapp', label: 'WhatsApp', href: PUBLIC_CONTACT_LINKS.whatsapp, icon: MessageCircle },
    { id: 'email', label: text('E-Mail', 'Эл. почта'), href: PUBLIC_CONTACT_LINKS.email, icon: Mail }
  ];

  return <nav className="dt-contact-launcher" aria-label={text('Kontaktmöglichkeiten', 'Способы связи')}>
    {actions.map(({ id, label, href, icon: Icon }) => <a key={id} href={href}
      className={`dt-contact-orb dt-contact-orb-${id}`} aria-label={label}
      target={id === 'whatsapp' ? '_blank' : undefined} rel={id === 'whatsapp' ? 'noopener noreferrer' : undefined}>
      <span className="dt-contact-orb-label" aria-hidden="true">{label}</span>
      <span className="dt-contact-orb-icon"><Icon aria-hidden="true" /></span>
    </a>)}
  </nav>;
}
