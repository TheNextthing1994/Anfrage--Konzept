/** Public contact details retained from the owner's previous website. */
export const PUBLIC_CONTACT = {
  email: 'office@digitaltwinarchitecs.io',
  phone: '+436604763085',
  phoneLabel: '+43 660 47 63 085',
  city: { de: 'Bregenz, Österreich', ru: 'Брегенц, Австрия' },
  // Add verified profile URLs here. Unconfigured platforms are not rendered as links.
  socialProfiles: [
    { platform: 'github' as const, label: 'GitHub', href: 'https://github.com/TheNextthing1994' }
  ]
};

export const PUBLIC_CONTACT_LINKS = {
  email: `mailto:${PUBLIC_CONTACT.email}`,
  phone: `tel:${PUBLIC_CONTACT.phone}`,
  whatsapp: `https://wa.me/${PUBLIC_CONTACT.phone.replace('+', '')}`
};
