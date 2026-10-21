import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PUBLIC_CONTACT, PUBLIC_CONTACT_LINKS } from '../../data/publicContact';
import { usePublicText } from './usePublicText';

export function ContactDetails() {
  const { language, text } = usePublicText();
  return <address className="dt-contact-details" aria-label={text('Kontaktdaten', 'Контактные данные')}>
    <a href={PUBLIC_CONTACT_LINKS.email}><span><Mail aria-hidden="true" /></span>{PUBLIC_CONTACT.email}</a>
    <a href={PUBLIC_CONTACT_LINKS.phone}><span><Phone aria-hidden="true" /></span>{PUBLIC_CONTACT.phoneLabel}</a>
    <p><span><MapPin aria-hidden="true" /></span>{PUBLIC_CONTACT.city[language]}</p>
  </address>;
}
