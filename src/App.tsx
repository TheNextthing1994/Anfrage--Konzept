import React, { lazy, Suspense, useEffect, useState } from 'react';
import { PublicLayout } from './components/public/PublicLayout';
import { PublicWebsite } from './components/public/PublicWebsite';
import { useLanguage } from './i18n/LanguageContext';
import './styles/public-site.css';

const ProductDemo = lazy(() => import('./components/LandingPage'));
const WorkstationApp = lazy(() => import('./components/WorkstationApp'));

function readLocation() {
  const path = window.location.hash.replace(/^#\/?/, '');
  return {
    page: path === 'workstation' ? 'workstation' : path === 'demo' ? 'demo' : 'website',
    section: ['loesungen', 'ablauf', 'kontakt'].includes(path) ? path : null
  };
}

export default function App() {
  const [location, setLocation] = useState(readLocation);
  const [hasOpenedWorkstation, setHasOpenedWorkstation] = useState(() => readLocation().page === 'workstation');
  const { language } = useLanguage();
  const ru = language === 'ru';

  useEffect(() => {
    const update = () => setLocation(readLocation());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  useEffect(() => {
    if (location.page === 'workstation') setHasOpenedWorkstation(true);
    const frame = requestAnimationFrame(() => {
      if (location.section) {
        const section = document.getElementById(location.section);
        section?.scrollIntoView({ block: 'start' });
        section?.focus({ preventScroll: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    });
    document.title = location.page === 'workstation' ? 'D.T. Workstation'
      : location.page === 'demo' ? (ru ? 'Знакомство с продуктом · D.T.' : 'Produktdemo · D.T.')
      : 'DigitalTwinArchitecs.io · ' + (ru ? 'Автоматизация для вашего бизнеса' : 'Automatisierung für Ihren Betrieb');
    return () => cancelAnimationFrame(frame);
  }, [location, ru]);

  const loading = <p className="dt-page-loading" role="status">{ru ? 'Загрузка…' : 'Wird geladen…'}</p>;

  return (
    <div 
      className="min-h-screen text-[#F1F5F9] flex flex-col relative bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: `url('/assets/aistudio/image_989a6b56.png')` }}
    >
      {/* Atmospheric dark gradient overlay to ensure perfect contrast while letting the background floor and lighting shine through */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070b12]/70 via-[#070b12]/60 to-[#070b12]/80 backdrop-blur-[1px] pointer-events-none z-0" />
      
      {/* BODY VIEW */}
      <div className="flex-1 min-h-0 flex flex-col relative z-10">
        {(hasOpenedWorkstation || location.page === 'workstation') && (
          <div className={location.page === 'workstation' ? 'flex-1 min-h-0 flex flex-col' : 'hidden'}>
            <Suspense fallback={loading}><WorkstationApp /></Suspense>
          </div>
        )}
        {location.page !== 'workstation' && (
          <PublicLayout page={location.page === 'demo' ? 'demo' : 'website'}>
            <Suspense fallback={loading}>
              {location.page === 'demo' ? <ProductDemo /> : <PublicWebsite />}
            </Suspense>
          </PublicLayout>
        )}
      </div>
    </div>
  );
}
