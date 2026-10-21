import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, BadgeHelp, ChevronDown, CircleDollarSign, Home, Menu, Play, X, Zap } from 'lucide-react';
import { LanguageToggle } from '../../i18n/LanguageContext';
import { usePublicText } from './usePublicText';
import { ContactLauncher } from './ContactLauncher';
import { SocialLinks } from './SocialLinks';

export function PublicLayout({ page, activeSection, children }: { page: 'website' | 'demo'; activeSection?: string | null; children: React.ReactNode }) {
  const { text } = usePublicText();
  const [menuOpen, setMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const solutionsButton = useRef<HTMLButtonElement>(null);
  const solutionsRoot = useRef<HTMLDivElement>(null);
  const solutionsActive = page === 'website' && ['loesungen', 'beratung', 'automatisierung', 'chatbots', 'ablauf'].includes(activeSection || '');
  const closeNavigation = () => { setMenuOpen(false); setSolutionsOpen(false); };

  useEffect(() => {
    const close = () => { setMenuOpen(false); setSolutionsOpen(false); };
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);
  useEffect(() => {
    if (!menuOpen && !solutionsOpen) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (solutionsOpen) { setSolutionsOpen(false); solutionsButton.current?.focus(); }
        else { setMenuOpen(false); menuButton.current?.focus(); }
      }
    };
    const outside = (event: PointerEvent) => { if (!solutionsRoot.current?.contains(event.target as Node)) setSolutionsOpen(false); };
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); };
  }, [menuOpen, solutionsOpen]);

  return <div className="dt-public" data-page={page} onClick={event => {
    const href = (event.target as HTMLElement).closest('a')?.getAttribute('href');
    // A repeated hash link does not emit hashchange. It must still scroll to its destination.
    if (href?.startsWith('#/') && href === window.location.hash) {
      const target = document.getElementById(href.slice(2));
      if (target) { event.preventDefault(); target.scrollIntoView({ block: 'start' }); target.focus({ preventScroll: true }); }
      else if (href === '#/') { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'instant' }); }
    }
  }}>
    <a className="dt-skip-link" href="#main-content" onClick={event => {
      event.preventDefault(); document.getElementById('main-content')?.focus();
    }}>{text('Zum Inhalt', 'К содержимому')}</a>
    <header className="dt-public-header">
      <div className="dt-public-header-inner">
        <a href="#/" className="dt-public-brand" aria-label="DigitalTwinArchitecs.io">
          <span className="dt-public-monogram" aria-hidden="true">D.T.</span>
          <span>DigitalTwin<span className="dt-brand-accent">Architecs</span><small>.io</small></span>
        </a>
        <nav id="public-navigation" className="dt-public-nav" data-open={menuOpen} aria-label={text('Website-Navigation', 'Навигация сайта')}>
          <a href="#/" className="dt-nav-pill" onClick={closeNavigation} aria-current={page === 'website' && !activeSection ? 'page' : undefined}><Home aria-hidden="true" />{text('Start', 'Главная')}</a>
          <div className="dt-solutions-navigation" ref={solutionsRoot}>
            <button type="button" ref={solutionsButton} className="dt-nav-pill" data-active={solutionsActive} aria-expanded={solutionsOpen} aria-controls={solutionsOpen ? 'public-solutions' : undefined} onClick={() => setSolutionsOpen(open => !open)}><Zap aria-hidden="true" />{text('Lösungen', 'Решения')}<ChevronDown aria-hidden="true" /></button>
            {solutionsOpen && <div id="public-solutions" className="dt-solutions-dropdown dt-glass">
              {[
                ['loesungen', text('Alle Lösungen', 'Все решения')], ['beratung', text('KI-Beratung', 'Консультация по ИИ')],
                ['automatisierung', text('Automatisierung', 'Автоматизация')], ['chatbots', text('Chatbots & Wissenszugang', 'Чат-боты и знания')], ['ablauf', text('Zusammenarbeit', 'Как мы работаем')]
              ].map(([section, label]) => <a key={section} href={`#/${section}`} onClick={closeNavigation} aria-current={page === 'website' && activeSection === section ? 'location' : undefined}>{label}<ArrowRight aria-hidden="true" /></a>)}
            </div>}
          </div>
          <a href="#/demo" className="dt-nav-pill" onClick={closeNavigation} aria-current={page === 'demo' ? 'page' : undefined}><Play aria-hidden="true" />{text('Produktdemo', 'Демо продукта')}</a>
          <a href="#/preise" className="dt-nav-pill" onClick={closeNavigation} aria-current={page === 'website' && activeSection === 'preise' ? 'location' : undefined}><CircleDollarSign aria-hidden="true" />{text('Preise', 'Стоимость')}</a>
          <a href="#/faq" className="dt-nav-pill" onClick={closeNavigation} aria-current={page === 'website' && activeSection === 'faq' ? 'location' : undefined}><BadgeHelp aria-hidden="true" />FAQ</a>
          <div className="dt-public-language-desktop"><LanguageToggle /></div>
        </nav>
        <div className="dt-public-header-actions">
          <div className="dt-public-language-mobile"><LanguageToggle compact /></div>
          <a className="dt-button dt-button-small dt-header-contact" href="#/kontakt">{text('Ablauf besprechen', 'Обсудить задачу')}<ArrowRight aria-hidden="true" /></a>
          <button ref={menuButton} type="button" className="dt-public-menu-button" aria-controls="public-navigation" aria-expanded={menuOpen}
            aria-label={menuOpen ? text('Menü schließen', 'Закрыть меню') : text('Menü öffnen', 'Открыть меню')}
            onClick={() => setMenuOpen(open => !open)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
    <main id="main-content" tabIndex={-1}>{children}</main>
    <footer className="dt-public-footer dt-public-container">
      <div><a href="#/" className="dt-footer-brand">DigitalTwinArchitecs.io</a><p>{text('Digitale Abläufe, die zu Ihrem Betrieb passen.', 'Цифровые процессы для вашего бизнеса.')}</p></div>
      <nav aria-label={text('Weitere Zugänge', 'Дополнительные разделы')}>
        <a href="#/kontakt">{text('Kontakt', 'Контакт')}</a>
        <a href="#/demo">{text('Einführung', 'Знакомство с продуктом')}</a>
        <a href="#/workstation">Workstation</a>
      </nav>
      <SocialLinks />
    </footer>
    {page === 'website' && <ContactLauncher />}
  </div>;
}
