
import React from 'react';

const MaintenanceView: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full glass-card p-10 md:p-16 rounded-[3rem] text-center animate-scale-in shadow-2xl border-none relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 animate-pulse"></div>

        <div className="h-24 w-24 bg-amber-50 text-amber-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter mb-6">Em Manutenção</h1>
        <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-md mx-auto">
          Estamos aprimorando nossas ferramentas para garantir o cálculo mais preciso de 2026. Voltaremos em instantes!
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-bold">
           <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-600">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
             Status: Atualizando Tabelas INSS/IRPF
           </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em] mb-4">Calculadora Salário 202026</p>
            <div className="flex gap-4">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceView;
