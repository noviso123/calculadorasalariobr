
import React, { useState } from 'react';
import { ViewType } from './types';

// Importação das Views Refatoradas
import SalaryView from './components/views/SalaryView';
import VacationView from './components/views/VacationView';
import ThirteenthView from './components/views/ThirteenthView';
import TerminationView from './components/views/TerminationView';
import ConsignedView from './components/views/ConsignedView';

import AdUnit from './components/AdUnit';
import CookieConsent from './components/CookieConsent';
import PrivacyModal from './components/PrivacyModal';
import TermsModal from './components/TermsModal';
import AboutModal from './components/AboutModal';
import SEOContent from './components/SEOContent';

// --- ICONS ---
const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>;
const CoinsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7 .71-2.82 2.82"/></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 12"/></svg>;
const BankIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="21" width="18" height="2" rx="1"/><rect x="5" y="3" width="14" height="14" rx="2"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M9 11h.01"/><path d="M15 11h.01"/><path d="M12 15h.01"/></svg>;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('salary');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const NavItem = ({ view, icon, label }: { view: ViewType, icon: React.ReactNode, label: string }) => (
    <button 
      onClick={() => { setCurrentView(view); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${currentView === view ? 'bg-blue-700 text-white shadow-lg shadow-blue-900/20' : 'text-blue-100 hover:bg-white/10'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'salary': return <SalaryView />;
      case 'vacation': return <VacationView />;
      case 'thirteenth': return <ThirteenthView />;
      case 'termination': return <TerminationView />;
      case 'consigned': return <ConsignedView />;
      default: return <SalaryView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-800 font-sans flex flex-col md:flex-row">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-[#1e3a8a] text-white p-4 flex items-center justify-start gap-4 sticky top-0 z-50 shadow-md h-16">
         <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 hover:bg-white/10 rounded-lg"><MenuIcon /></button>
         <span className="font-bold text-lg flex items-center gap-2"><CalculatorIcon /> Calc 2026</span>
      </div>

      {/* MOBILE MENU BACKDROP */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[60] w-72 bg-[#1e3a8a] text-white transform transition-transform duration-300 ease-in-out shadow-2xl 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:relative md:sticky md:top-0 md:h-screen md:overflow-y-auto md:flex md:w-64 md:flex-col md:shadow-none lg:w-72 md:shrink-0`}
      >
        <div className="p-6 border-b border-blue-800 flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg hidden md:block">
              <CalculatorIcon />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Calculadora <span className="text-blue-300 font-light">Salário 2026</span></h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-blue-200"><CloseIcon /></button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem view="salary" icon={<CalculatorIcon />} label="Salário Líquido" />
          <NavItem view="vacation" icon={<SunIcon />} label="Férias" />
          <NavItem view="thirteenth" icon={<CoinsIcon />} label="Décimo Terceiro" />
          <NavItem view="termination" icon={<BriefcaseIcon />} label="Rescisão" />
          <NavItem view="consigned" icon={<BankIcon />} label="Simular Consignado" />
        </nav>

        <div className="p-4">
           <AdUnit slotId="7977197949" format="rectangle" label="Publicidade" />
        </div>

        <div className="p-6 border-t border-blue-800">
          <div className="bg-blue-900/50 p-4 rounded-xl text-xs text-blue-200 border border-blue-800/50">
            <p className="font-bold text-white mb-2 text-sm">Base Legal 2026</p>
            <p className="flex justify-between"><span>Salário Mínimo:</span> <span className="text-white">R$ 1.631</span></p>
            <p className="flex justify-between"><span>Isenção IR:</span> <span className="text-white">Até 5k</span></p>
          </div>
          <div className="mt-4 text-center flex justify-center gap-3">
             <button onClick={() => setIsAboutOpen(true)} className="text-[10px] text-blue-400 hover:text-white underline">Sobre Nós</button>
             <button onClick={() => setIsPrivacyOpen(true)} className="text-[10px] text-blue-400 hover:text-white underline">Privacidade</button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 w-full max-w-full flex flex-col pb-24 relative z-0 overflow-x-hidden">
        
        <AdUnit slotId="7977197949" className="mb-8" />

        {/* Dynamic View Render */}
        <div className="flex-1">
          {renderCurrentView()}
        </div>
        
        {/* SEO Footer Content */}
        <SEOContent view={currentView} onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />

        {/* SITE FOOTER */}
        <footer className="mt-12 py-8 border-t border-slate-200 text-center text-slate-400 text-xs">
           <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
              <button onClick={() => setIsAboutOpen(true)} className="hover:text-blue-600 transition-colors">Sobre Nós</button>
              <span className="hidden sm:inline">•</span>
              <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-blue-600 transition-colors">Política de Privacidade</button>
              <span className="hidden sm:inline">•</span>
              <button onClick={() => setIsTermsOpen(true)} className="hover:text-blue-600 transition-colors">Termos de Uso</button>
              <span className="hidden sm:inline">•</span>
              <a href="mailto:contato@calculadorasalariobr.com.br" className="hover:text-blue-600 transition-colors">Contato</a>
              <span className="hidden sm:inline">•</span>
              <span>&copy; 2026 Calculadora Salário BR</span>
           </div>
           <p className="max-w-lg mx-auto leading-relaxed opacity-70">
             Este site é uma ferramenta de simulação (Base: CLT/2026). Os cálculos podem sofrer variações dependendo de convenções coletivas. Consulte sempre um contador.
           </p>
        </footer>

      </main>

      <CookieConsent onOpenPrivacy={() => setIsPrivacyOpen(true)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
};

export default App;
