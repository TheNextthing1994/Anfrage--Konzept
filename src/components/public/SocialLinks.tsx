import React from 'react';
import { Github, Instagram, Linkedin, Music2, Youtube } from 'lucide-react';
import { PUBLIC_CONTACT } from '../../data/publicContact';
import { usePublicText } from './usePublicText';

const icons = { github: Github, instagram: Instagram, linkedin: Linkedin, tiktok: Music2, youtube: Youtube };

export function SocialLinks() {
  const { text } = usePublicText();
  return <nav className="dt-social-links" aria-label={text('Unsere Profile', 'Наши профили')}>
    {PUBLIC_CONTACT.socialProfiles.map(profile => {
      const Icon = icons[profile.platform];
      return <a key={profile.platform} href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={profile.label} title={profile.label}><Icon aria-hidden="true" /></a>;
    })}
  </nav>;
}
