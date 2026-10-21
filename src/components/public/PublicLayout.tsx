import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { LanguageToggle } from '../../i18n/LanguageContext';
import { usePublicText } from './usePublicText';

export function PublicLayout({ page, children }: { page: 'website' | 'demo'; children: React.ReactNode }) {
  const { text } = usePublicText();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [menuOpen]);

  return <div className="dt-public" onClick={event => {
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
          <a href="#/loesungen" onClick={() => setMenuOpen(false)}>{text('Lösungen', 'Решения')}</a>
          <a href="#/ablauf" onClick={() => setMenuOpen(false)}>{text('Zusammenarbeit', 'Как мы работаем')}</a>
          <a href="#/demo" onClick={() => setMenuOpen(false)} aria-current={page === 'demo' ? 'page' : undefined}>{text('Produktdemo', 'Демо продукта')}</a>
        </nav>
        <div className="dt-public-header-actions">
          <LanguageToggle compact />
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
    </footer>
  </div>;
}
