import React, { useState, useEffect } from 'react';
import { AIContext } from '../types';
import { getFinancialAdvice } from '../services/advisorService';
import ReactMarkdown from 'react-markdown';

interface Props {
  context: AIContext | null;
}

const AIAdvisor: React.FC<Props> = ({ context }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (context) {
      setLoading(true);
      // Simula uma pequena espera para UX
      getFinancialAdvice(context)
        .then(setAdvice)
        .catch(() => setAdvice('Não foi possível gerar a análise.'))
        .finally(() => setLoading(false));
    } else {
        setAdvice('');
    }
  }, [context?.gross, context?.type, context?.net]);

  if (!context) return null;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm transition-all hover:shadow-md mt-8 relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 relative z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </div>
            <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Estratégia do Especialista</h3>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atualizado: Fev 2026</span>
                </div>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="text-indigo-600 text-sm font-bold animate-pulse">Consultando base de dados financeira...</p>
        </div>
      ) : (
        <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white shadow-inner relative z-10">
           <ReactMarkdown>{advice}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
