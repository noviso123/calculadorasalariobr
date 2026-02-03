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
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 text-white p-4 z-[60] backdrop-blur-md border-t border-slate-700 shadow-2xl transition-all duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-slate-300 text-center md:text-left leading-relaxed">
            <strong className="text-white">Aviso de Cookies:</strong> Utilizamos cookies e tecnologias semelhantes para personalizar anúncios (Google AdSense),
            melhorar sua experiência e analisar nosso tráfego. Ao continuar navegando, você concorda com nossa
            <Link to="/politica-privacidade" className="text-blue-400 hover:text-blue-300 underline ml-1 font-medium focus:outline-none">
              Política de Privacidade
            </Link>.
          </p>
        </div>
        <div className="flex gap-3">
            <button
            onClick={handleAccept}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-blue-900/50 text-sm whitespace-nowrap active:scale-95"
            >
            Aceitar e Continuar
            </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
