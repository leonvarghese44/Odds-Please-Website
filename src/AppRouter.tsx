import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UnderageModal } from './components/UnderageModal';
import { DemoProvider } from './context/DemoContext';
import { ToastContainer } from './components/ToastContainer';
import { REGION_CONFIG, type Region, type Language, type OddsFormat } from './constants';
import App from './App';
import { SaferGamblingPage } from './pages/SaferGamblingPage';
import { ResponsibleGamingPage } from './pages/ResponsibleGamingPage';
import { GiocoResponsabilePage } from './pages/GiocoResponsabilePage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CareersPage } from './pages/CareersPage';
import { PartnershipsPage } from './pages/PartnershipsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const STATIC_ROUTES = ['/careers', '/partnerships', '/terms', '/privacy'];
const SG_HUB_ROUTES = ['/safer-gambling', '/responsible-gaming', '/gioco-responsabile'];
const MINIMAL_HEADER_ROUTES = [...STATIC_ROUTES, ...SG_HUB_ROUTES];

function isStaticPage(pathname: string) {
  return STATIC_ROUTES.some((r) => pathname.startsWith(r));
}

function isMinimalHeader(pathname: string) {
  return MINIMAL_HEADER_ROUTES.some((r) => pathname.startsWith(r));
}

export function AppRouter() {
  const location = useLocation();
  const [region, setRegion] = useState<Region>(
    () => (localStorage.getItem('ss_region') as Region) || 'UK',
  );
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem('ss_lang') as Language) || 'ENG',
  );
  const [oddsFormat, setOddsFormat] = useState<OddsFormat>(
    () => (localStorage.getItem('ss_odds') as OddsFormat) || 'fractional',
  );
  const [underageOpen, setUnderageOpen] = useState(false);
  const staticPage = isStaticPage(location.pathname);
  const minimalHeader = isMinimalHeader(location.pathname);

  useEffect(() => {
    localStorage.setItem('ss_region', region);
  }, [region]);

  useEffect(() => {
    localStorage.setItem('ss_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('ss_odds', oddsFormat);
  }, [oddsFormat]);

  const handleRegionChange = (r: Region) => {
    setRegion(r);
    setOddsFormat(REGION_CONFIG[r].defaultOddsFormat);
    setLanguage(REGION_CONFIG[r].defaultLanguage);
  };

  return (
    <DemoProvider>
    <div className="flex min-h-screen flex-col bg-ink-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute top-1/2 right-0 h-80 w-80 rounded-full bg-emerald-500/3 blur-[100px]" />
      </div>

      <div className="relative flex flex-1 flex-col">
        <Header
          region={region}
          language={language}
          oddsFormat={oddsFormat}
          onRegionChange={handleRegionChange}
          onLanguageChange={setLanguage}
          onOddsFormatChange={setOddsFormat}
          minimal={minimalHeader}
        />

        <ScrollToTop />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <App
                  key={region}
                  region={region}
                  language={language}
                  oddsFormat={oddsFormat}
                  onOddsFormatChange={setOddsFormat}
                />
              }
            />
            <Route path="/safer-gambling" element={<SaferGamblingPage region={region} language={language} />} />
            <Route path="/responsible-gaming" element={<ResponsibleGamingPage region={region} language={language} />} />
            <Route path="/gioco-responsabile" element={<GiocoResponsabilePage region={region} language={language} />} />
            <Route path="/privacy" element={<PrivacyPage region={region} language={language} />} />
            <Route path="/terms" element={<TermsPage region={region} language={language} />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/partnerships" element={<PartnershipsPage />} />
          </Routes>
        </main>

        <Footer
          region={region}
          language={language}
          onAgeBadgeClick={() => setUnderageOpen(true)}
          showRGCard={!staticPage}
        />
      </div>

      <UnderageModal
        open={underageOpen}
        onClose={() => setUnderageOpen(false)}
        region={region}
        language={language}
      />
      <ToastContainer />
    </div>
    </DemoProvider>
  );
}
