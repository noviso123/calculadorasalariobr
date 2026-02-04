import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    return !localStorage.getItem('cookie_consent_2026');
  });

  const handleAccept = () => {
    localStorage.setItem('cookie_consent_2026', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] animate-fade-in-up transition-transform duration-300">
        {/* Backdrop visual para separar do conteúdo */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent -top-12 pointer-events-none" />

        <div className="bg-slate-900 border-t border-slate-700 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] pb-[env(safe-area-inset-bottom)]">
            <div className="max-w-7xl mx-auto p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">

                <div className="flex-1 flex gap-4 items-start">
                    <div className="bg-slate-800 p-2.5 rounded-xl text-yellow-400 shrink-0 hidden md:block border border-slate-700">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4.3 4.3 0 0 1-5-5 4.3 4.3 0 0 1-5-5 10 10 0 0 0-4 4 4.3 4.3 0 0 1-5-5"/><path d="M8.5 7A1.5 1.5 0 0 1 7 5.5"/><path d="M11 12.5a1.5 1.5 0 0 1-3 0"/><path d="M16 16.5a1.5 1.5 0 0 1-3 0"/><path d="M16 10a2 2 0 0 1 0 2"/></svg>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-base mb-1">Privacidade e Transparência</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Utilizamos cookies para personalizar anúncios e analisar nosso tráfego.
                            Ao continuar, você concorda com nossa <Link to="/politica-privacidade" className="text-blue-400 hover:text-blue-300 underline font-semibold decoration-blue-400/30 underline-offset-2 transition-colors">Política de Privacidade</Link>.
                        </p>
                    </div>
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 md:py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-600/20 active:scale-95 text-sm md:text-base border border-blue-500/50"
                    >
                        Aceitar e Fechar
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CookieConsent;
