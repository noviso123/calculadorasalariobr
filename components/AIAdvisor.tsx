
import React, { useState, useEffect } from 'react';
import { AIContext } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface Props {
  context: AIContext | null;
}

const AIAdvisor: React.FC<Props> = ({ context }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const handleGenerateAdvice = async () => {
    if (!context) return;
    setLoading(true);
    const text = await getFinancialAdvice(context);
    setAdvice(text);
    setLoading(false);
    setHasFetched(true);
  };

  useEffect(() => {
    setHasFetched(false);
    setAdvice('');
  }, [context?.gross]);

  if (!context) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Planejamento 2026 (IA)
        </h3>
        {!hasFetched && !loading && (
          <button
            onClick={handleGenerateAdvice}
            className="w-full sm:w-auto px-4 py-2 bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200"
          >
            Gerar Conselhos
          </button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-6 space-y-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
          <p className="text-blue-700 text-xs font-semibold animate-pulse">Consultando API Gemini...</p>
        </div>
      )}

      {!loading && advice && (
        <div className="prose prose-blue max-w-none text-slate-700 text-sm leading-relaxed bg-white p-4 rounded-xl border border-blue-100">
           <div dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        </div>
      )}

      {!loading && !advice && !hasFetched && (
        <p className="text-blue-400 text-xs text-center">
          Dica: Use a inteligência artificial para receber dicas personalizadas sobre este cálculo.
        </p>
      )}
    </div>
  );
};

export default AIAdvisor;
