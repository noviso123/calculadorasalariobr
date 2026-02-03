import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdUnit from './AdUnit';
import CookieConsent from './CookieConsent';

// Icons
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 12"/></svg>;
const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>;
const CoinsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7 .71-2.82 2.82"/></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const BankIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="21" width="18" height="2" rx="1"/><rect x="5" y="3" width="14" height="14" rx="2"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M9 11h.01"/><path d="M15 11h.01"/><path d="M12 15h.01"/></svg>;


const NavItem = ({ to, icon, label, currentPath }: { to: string, icon: React.ReactNode, label: string, currentPath: string }) => {
    const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));
    return (
        <Link
            to={to}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold group relative overflow-hidden ${isActive ? 'bg-white/15 text-white shadow-xl shadow-black/10' : 'text-blue-100 hover:bg-white/5 hover:text-white'}`}
        >
            {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-full"></div>}
            <div className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:-rotate-6'}`}>{icon}</div>
            <span className={`tracking-tight whitespace-nowrap ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform duration-300`}>{label}</span>
        </Link>
    );
};

const Layout: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const location = useLocation();

    // Scroll to top on route change
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMobileMenuOpen(false);
    }, [location.pathname]);



    return (
        <div className="min-h-screen bg-[#F0F4F8] text-slate-800 font-sans flex flex-col md:flex-row">
            <Helmet>
                <html lang="pt-BR" />
                <meta name="robots" content="index, follow" />
            </Helmet>

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
                    <h1 className="text-xl font-bold tracking-tight">Calculadora <span className="text-blue-300 font-light">Salário BR</span></h1>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-blue-200"><CloseIcon /></button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem to="/" icon={<CalculatorIcon />} label="Salário Líquido" currentPath={location.pathname} />
                    <NavItem to="/ferias" icon={<SunIcon />} label="Férias" currentPath={location.pathname} />
                    <NavItem to="/decimo-terceiro" icon={<CoinsIcon />} label="Décimo Terceiro" currentPath={location.pathname} />
                    <NavItem to="/rescisao" icon={<BriefcaseIcon />} label="Rescisão" currentPath={location.pathname} />
                    <NavItem to="/consignado" icon={<BankIcon />} label="Simular Consignado" currentPath={location.pathname} />
                    <NavItem to="/comparar" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M21 3 9 15"/><path d="M21 13v8h-8"/><path d="M13 21 3 9"/></svg>} label="CLT vs PJ" currentPath={location.pathname} />
                    <NavItem to="/irpf-simulador" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>} label="Simulador IRPF" currentPath={location.pathname} />
                </nav>

                <div className="p-4">
                    <AdUnit slotId="7977197949" format="rectangle" label="Publicidade" />
                </div>

                <div className="p-6 border-t border-blue-800">
                <div className="bg-blue-900/50 p-4 rounded-xl text-xs text-blue-200 border border-blue-800/50">
                    <p className="font-bold text-white mb-2 text-sm">Base Legal 2026</p>
                    <p className="flex justify-between"><span>Salário Mínimo:</span> <span className="text-white">R$ 1.621</span></p>
                    <p className="flex justify-between"><span>Isenção IR:</span> <span className="text-white">Até 5k</span></p>
                </div>
                <div className="mt-4 text-center flex justify-center gap-3">
                    <Link to="/sobre" className="text-[10px] text-blue-400 hover:text-white underline">Sobre Nós</Link>
                    <Link to="/politica-privacidade" className="text-[10px] text-blue-400 hover:text-white underline">Privacidade</Link>
                </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-4 md:p-8 lg:p-10 w-full max-w-full flex flex-col pb-24 relative z-0 overflow-x-hidden">
                <AdUnit slotId="7977197949" className="mb-8" />

                <Outlet />

                {/* SITE FOOTER */}
                <footer className="mt-12 py-8 border-t border-slate-200 text-center text-slate-400 text-xs">
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
                        <Link to="/sobre" className="hover:text-blue-600 transition-colors">Sobre Nós</Link>
                        <span className="hidden sm:inline">•</span>
                        <Link to="/politica-privacidade" className="hover:text-blue-600 transition-colors">Política de Privacidade</Link>
                        <span className="hidden sm:inline">•</span>
                        <Link to="/termos" className="hover:text-blue-600 transition-colors">Termos de Uso</Link>
                        <span className="hidden sm:inline">•</span>
                        <a href="mailto:contato@calculadorasalariobr.com.br" className="hover:text-blue-600 transition-colors">Contato</a>
                        <span className="hidden sm:inline">•</span>
                        <span>&copy; 2026 Calculadora Salário BR</span>
                    </div>
                </footer>
            </main>

            <CookieConsent />
        </div>
    );
};

export default Layout;
