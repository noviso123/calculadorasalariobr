import React, { useEffect, useRef, useState } from 'react';

interface AdUnitProps {
  slotId: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ slotId, format = 'auto', className = '', label = 'Publicidade' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const isPlaceholder = slotId.includes('slot'); // Detecta se é o placeholder padrão do App.tsx

  useEffect(() => {
    // Se for placeholder, não tenta carregar o script do AdSense
    if (isPlaceholder) return;

    const timer = setTimeout(() => {
      try {
        const container = containerRef.current;
        if (window.adsbygoogle && container && container.offsetWidth > 0) {
          const alreadyHasAd = container.querySelector('iframe');
          if (!alreadyHasAd) {
             (window.adsbygoogle = window.adsbygoogle || []).push({});
             setAdLoaded(true);
          }
        }
      } catch (e) {
        console.error("AdSense Error:", e);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [slotId, isPlaceholder]);

  // Se for placeholder, retorna um box visual de aviso
  if (isPlaceholder) {
    return (
      <div className={`w-full flex flex-col items-center my-6 ${className}`}>
        <span className="text-[10px] text-slate-300 uppercase tracking-widest mb-1">Espaço de Anúncio</span>
        <div className="w-full h-24 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-xs text-center p-4">
          Configure o ID do AdSense em App.tsx <br/> (Slot: {slotId})
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col items-center my-6 ${className}`}>
      <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{label}</span>
      <div 
        ref={containerRef}
        className="w-full bg-slate-50 min-h-[100px] flex items-center justify-center rounded-lg overflow-hidden border border-slate-100 relative"
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-9013233807727287"
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        {!adLoaded && (
             <span className="text-slate-300 text-xs absolute pointer-events-none">Carregando...</span>
        )}
      </div>
    </div>
  );
};

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default AdUnit;