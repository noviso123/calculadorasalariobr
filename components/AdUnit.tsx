import React, { useEffect, useRef, useState } from 'react';

interface AdUnitProps {
  slotId: string; // O ID do bloco de anúncio gerado no AdSense
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: string; // Para cumprir política de Labeling (Publicidade)
}

const AdUnit: React.FC<AdUnitProps> = ({ slotId, format = 'auto', className = '', label = 'Publicidade' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Pequeno delay para garantir que o DOM foi pintado e o elemento tem largura (width > 0)
    // Isso previne o erro "No slot size for availableWidth=0"
    const timer = setTimeout(() => {
      try {
        const container = containerRef.current;
        
        // Verifica se o script existe, se o container existe, e se ele tem largura visível
        if (window.adsbygoogle && container && container.offsetWidth > 0) {
          // Verifica se já não existe um iframe injetado (para evitar duplicidade em re-renders rápidos)
          const alreadyHasAd = container.querySelector('iframe');
          if (!alreadyHasAd) {
             (window.adsbygoogle = window.adsbygoogle || []).push({});
             setAdLoaded(true);
          }
        }
      } catch (e) {
        console.error("AdSense Error:", e);
      }
    }, 200); // 200ms de segurança

    return () => clearTimeout(timer);
  }, [slotId]); // Recarrega se o Slot ID mudar

  return (
    <div className={`w-full flex flex-col items-center my-6 ${className}`}>
      {/* Labeling Policy: Identificar claramente que é um anúncio */}
      <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{label}</span>
      
      {/* Container com Ref para validação de largura */}
      <div 
        ref={containerRef}
        className="w-full bg-slate-100 min-h-[100px] flex items-center justify-center rounded-lg overflow-hidden border border-slate-200 relative"
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-9013233807727287"
          data-ad-slot={slotId} // Substituir pelo ID do Slot Específico no App.tsx
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        
        {/* Placeholder visual que some quando o anúncio carrega (opcional) */}
        {!adLoaded && (
             <span className="text-slate-400 text-xs absolute pointer-events-none">Carregando Publicidade...</span>
        )}
      </div>
    </div>
  );
};

// Declaração global para TypeScript entender o objeto window.adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default AdUnit;