import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LayoutGroup, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, BadgeHelp, CreditCard, Home, Menu, MessageSquare, Sparkles, X, Zap } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { usePublicText } from './usePublicText';
import { ContactLauncher } from './ContactLauncher';
import { SocialLinks } from './SocialLinks';
import { ParticleField } from './ParticleField';

function PublicLanguages() {
  const { language, setLanguage } = useLanguage();
  const { text } = usePublicText();
  return <div className="dt-public-languages" role="group" aria-label={text('Sprache wählen', 'Выбрать язык')}>
    {(['de', 'ru'] as const).map(value => <button type="button" key={value} aria-pressed={language === value} title={value === 'de' ? 'Deutsch' : 'Русский язык'} onClick={() => setLanguage(value)}><span>{value.toUpperCase()}</span></button>)}
  </div>;
}

export function PublicLayout({ page, activeSection, children }: { page: 'website' | 'demo'; activeSection?: string | null; children: React.ReactNode }) {
  const { text } = usePublicText();
  const reduced = useReducedMotion();
  const layoutId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 20);
  const [flight, setFlight] = useState<{ id: number; left: number; top: number; width: number; height: number; from: number } | null>(null);
  const flightNumber = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);
  const active = page === 'demo' ? 'demo' : ['beratung', 'automatisierung', 'chatbots', 'preise', 'faq'].includes(activeSection || '') ? activeSection : 'start';
  const links = [
    { id: 'start', href: '#/', label: text('Start', 'Главная'), icon: Home },
    { id: 'beratung', href: '#/beratung', label: text('KI-Beratung', 'ИИ-консалтинг'), icon: MessageSquare },
    { id: 'automatisierung', href: '#/automatisierung', label: text('Automatisierung', 'Автоматизация'), icon: Zap },
    { id: 'chatbots', href: '#/chatbots', label: text('Chatbot', 'Чат-бот'), icon: Sparkles },
    { id: 'preise', href: '#/preise', label: text('Preise', 'Стоимость'), icon: CreditCard },
    { id: 'faq', href: '#/faq', label: 'FAQ', icon: BadgeHelp }
  ];

  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 20);
    const close = () => setMenuOpen(false);
    window.addEventListener('scroll', scroll, { passive: true }); window.addEventListener('hashchange', close);
    return () => { window.removeEventListener('scroll', scroll); window.removeEventListener('hashchange', close); };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [menuOpen]);

  const selectTab = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false);
    // Recreate the requested upward flight deliberately, without scroll-coordinate drift.
    if (!reduced && window.scrollY > 120 && window.matchMedia('(min-width: 1101px)').matches) {
      const box = event.currentTarget.getBoundingClientRect();
      setFlight({ id: ++flightNumber.current, left: box.left, top: box.top, width: box.width, height: box.height, from: Math.max(box.bottom + 100, window.innerHeight * .72) });
    }
  };

  return <MotionConfig reducedMotion="user"><LayoutGroup id={layoutId}>
    <div className="dt-public" data-page={page} onClick={event => {
      const href = (event.target as HTMLElement).closest('a')?.getAttribute('href');
      if (href?.startsWith('#/') && href === window.location.hash) {
        const target = document.getElementById(href.slice(2));
        if (target) { event.preventDefault(); target.scrollIntoView({ block: 'start' }); target.focus({ preventScroll: true }); }
        else if (href === '#/') { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'instant' }); }
      }
    }}>
      <ParticleField />
      <a className="dt-skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>{text('Zum Inhalt', 'К содержимому')}</a>
      <header className="dt-public-header" data-scrolled={scrolled}>
        <div className="dt-public-header-inner">
          <a href="#/" className="dt-public-brand" aria-label="DigitalTwinArchitecs.io"><span className="dt-public-monogram" aria-hidden="true">D.T.</span><span>DigitalTwin<span className="dt-brand-accent">Architecs</span><small>.io</small></span></a>
          <nav id="public-navigation" className="dt-public-nav" data-open={menuOpen} aria-label={text('Website-Navigation', 'Навигация сайта')}>
            {links.map(link => <a key={link.id} href={link.href} className="dt-nav-pill" onClick={selectTab} aria-current={active === link.id ? 'page' : undefined}>
              {active === link.id && <motion.span layoutId="activePill" className="dt-nav-active-pill" aria-hidden="true" style={{ opacity: flight ? 0 : 1 }} transition={{ type: 'spring', bounce: .2, duration: .6 }} />}
              <span className="dt-nav-pill-content"><link.icon aria-hidden="true" />{link.label}</span>
            </a>)}
            <div className="dt-public-language-desktop"><PublicLanguages /></div>
          </nav>
          <div className="dt-public-header-actions">
            <div className="dt-public-language-mobile"><PublicLanguages /></div>
            <a className="dt-button dt-button-small dt-header-contact" href="#/kontakt">{text('Ablauf besprechen', 'Обсудить задачу')}<ArrowRight aria-hidden="true" /></a>
            <button ref={menuButton} type="button" className="dt-public-menu-button" aria-controls="public-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? text('Menü schließen', 'Закрыть меню') : text('Menü öffnen', 'Открыть меню')} onClick={() => setMenuOpen(open => !open)}>{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>{children}</main>
      <footer className="dt-public-footer dt-public-container">
        <div><a href="#/" className="dt-footer-brand">DigitalTwinArchitecs.io</a><p>{text('Digitale Abläufe, die zu Ihrem Betrieb passen.', 'Цифровые процессы для вашего бизнеса.')}</p></div>
        <nav aria-label={text('Weitere Zugänge', 'Дополнительные разделы')}><a href="#/kontakt">{text('Kontakt', 'Контакт')}</a><a href="#/demo">{text('Einführung', 'Знакомство с продуктом')}</a><a href="#/workstation">Workstation</a></nav>
        <SocialLinks />
      </footer>
      {page === 'website' && <ContactLauncher />}
    </div>
    {flight && createPortal(<motion.span key={flight.id} className="dt-nav-flight" aria-hidden="true" style={{ width: flight.width, height: flight.height }}
      initial={{ x: flight.left, y: flight.from, scale: .92, opacity: .65 }} animate={{ x: flight.left, y: flight.top, scale: 1, opacity: 1 }}
      transition={{ type: 'spring', bounce: .2, duration: .65 }} onAnimationComplete={() => setFlight(null)} />, document.body)}
  </LayoutGroup></MotionConfig>;
}
