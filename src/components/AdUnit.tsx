import React, { useEffect, useRef, useState } from 'react';

interface AdUnitProps {
  slotId: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ slotId, format = 'auto', className = '', label = 'Anúncio' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const isPlaceholder = slotId.includes('slot');

  useEffect(() => {
    if (isPlaceholder) return;

    const timer = setTimeout(() => {
      try {
        if (window.adsbygoogle && containerRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        }
      } catch (e) {
        console.error("AdSense Error:", e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [slotId, isPlaceholder]);

  if (isPlaceholder) {
    return (
      <div className={`w-full flex flex-col items-center my-8 ${className}`}>
        <span className="text-[10px] text-slate-300 uppercase font-black tracking-[0.2em] mb-2">{label} Placeholder</span>
        <div className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center text-slate-400 text-xs text-center p-6 italic">
          Configure o ID do AdSense para ativar monetização <br/> (Slot: {slotId})
        </div>
      </div>
    );
  }

  // Pre-define heights to prevent CLS (Layout Shift)
  const minHeight = format === 'rectangle' ? '250px' : '280px';

  return (
    <div className={`w-full flex flex-col items-center my-8 ${className}`}>
      <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-2">{label}</span>
      <div
        ref={containerRef}
        className="w-full bg-white flex items-center justify-center rounded-[2rem] transition-all duration-500 overflow-hidden relative border border-slate-100 shadow-sm"
        style={{ minHeight }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight }}
          data-ad-client="ca-pub-9013233807727287"
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        {!adLoaded && (
             <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center gap-3 shimmer">
                <div className="w-8 h-8 border-2 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-slate-300 text-[10px] uppercase font-bold tracking-widest">Sincronizando Anúncio...</span>
             </div>
        )}
      </div>
    </div>
  );
};

declare global {
  interface Window {
    adsbygoogle: object[];
  }
}

export default AdUnit;
