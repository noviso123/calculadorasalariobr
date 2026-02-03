
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { InputGroup } from '../Shared';
import AIAdvisor from '../AIAdvisor';
import { IrpfInput, IrpfResult } from '../../types';
import { calculateIrpfSimulated } from '../../services/taxService';

const IrpfView: React.FC = () => {
  const resultsRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<IrpfInput>({
    grossIncome: 0,
    dependents: 0,
    alimony: 0,
    otherDeductions: 0,
    officialPension: 0
  });

  const [result, setResult] = useState<IrpfResult | null>(null);

  // Real-time calculation
  React.useEffect(() => {
    if (data.grossIncome > 0) {
        setResult(calculateIrpfSimulated(data));
    } else {
        setResult(null);
    }
  }, [data]);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="w-full max-w-5xl mx-auto pb-24">
       <Helmet>
        <title>Simulador de Alíquota Efetiva IRPF 2026</title>
        <meta name="description" content="Simulador oficial de Imposto de Renda 2026. Compare o desconto simplificado x legal e descubra sua alíquota efetiva real." />
      </Helmet>

      <header className="mb-8 md:mb-12">
        <h2 className="text-3xl font-bold text-slate-800">Simulador de IRPF 2026</h2>
        <p className="text-slate-500">Compare o Modelo Completo vs Simplificado e descubra sua alíquota real.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

        {/* INPUTS - Estilo Receita Federal (Sóbrio mas moderno) */}
        <section className="w-full lg:w-5/12 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 relative z-10">
            <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Rendimentos e Deduções</h3>

            <form onSubmit={handleCalc} className="space-y-4">
                <InputGroup label="Rendimento Tributável Mensal (Bruto)" value={data.grossIncome} onChange={v => setData({...data, grossIncome: Number(v)})} required />

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deduções Legais</p>
                    <InputGroup label="Previdência Oficial (INSS)" value={data.officialPension} onChange={v => setData({...data, officialPension: Number(v)})} placeholder="Deixe 0 para cálculo automático" />
                    <InputGroup label="Dependentes (Quantidade)" value={data.dependents} onChange={v => setData({...data, dependents: Number(v)})} />
                    <InputGroup label="Pensão Alimentícia" value={data.alimony} onChange={v => setData({...data, alimony: Number(v)})} />
                    <InputGroup label="Outras Deduções (Previdência Privada, etc)" value={data.otherDeductions} onChange={v => setData({...data, otherDeductions: Number(v)})} />
                </div>

                <button type="submit" className="w-full bg-[#003673] hover:bg-[#002855] text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-4 active:scale-[0.98] text-lg flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                    Calcular Imposto
                </button>
            </form>
        </section>

        {/* RESULTS */}
        <section className="w-full lg:w-7/12 relative z-10" ref={resultsRef}>
            {result && result.baseSalary > 0 && (
             <div className="animate-fade-in space-y-6">

                {/* COMPARATIVO: SIMPLIFICADO vs LEGAL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* OPÇÃO 1: SIMPLIFICADO */}
                    <div className={`p-6 rounded-2xl border-2 transition-all ${result.isSimplifiedBest ? 'bg-emerald-50 border-emerald-500 shadow-md transform scale-[1.02]' : 'bg-white border-slate-100 opacity-70'}`}>
                        <div className="flex justify-between items-start mb-4">
                             <div>
                                <h4 className={`font-bold ${result.isSimplifiedBest ? 'text-emerald-800' : 'text-slate-600'}`}>Desconto Simplificado</h4>
                                <p className="text-xs text-slate-500">Substitui deduções legais</p>
                             </div>
                             {result.isSimplifiedBest && <span className="bg-emerald-200 text-emerald-800 text-[10px] uppercase font-bold px-2 py-1 rounded-full">Melhor Opção</span>}
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>Rendimento:</span> <span>{formatCurrency(result.baseSalary)}</span></div>
                            <div className="flex justify-between text-slate-600"><span>Dedução Padrão:</span> <span>- {formatCurrency(result.standardDeduction)}</span></div>
                            <div className="border-t border-slate-200 my-2"></div>
                            <div className="flex justify-between font-bold"><span>Base de Cálculo:</span> <span>{formatCurrency(result.simplifiedBase)}</span></div>
                        </div>
                    </div>

                    {/* OPÇÃO 2: DEDUÇÕES LEGAIS */}
                     <div className={`p-6 rounded-2xl border-2 transition-all ${!result.isSimplifiedBest ? 'bg-emerald-50 border-emerald-500 shadow-md transform scale-[1.02]' : 'bg-white border-slate-100 opacity-70'}`}>
                        <div className="flex justify-between items-start mb-4">
                             <div>
                                <h4 className={`font-bold ${!result.isSimplifiedBest ? 'text-emerald-800' : 'text-slate-600'}`}>Deduções Legais</h4>
                                <p className="text-xs text-slate-500">INSS + Dependentes + Outros</p>
                             </div>
                             {!result.isSimplifiedBest && <span className="bg-emerald-200 text-emerald-800 text-[10px] uppercase font-bold px-2 py-1 rounded-full">Melhor Opção</span>}
                        </div>

                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between text-red-400"><span>INSS:</span> <span>- {formatCurrency(result.inssDeduction)}</span></div>
                            <div className="flex justify-between text-red-400"><span>Dependentes:</span> <span>- {formatCurrency(result.dependentsDeduction)}</span></div>
                            <div className="flex justify-between text-red-400"><span>Outras:</span> <span>- {formatCurrency(result.baseSalary - result.legalBase - result.inssDeduction - result.dependentsDeduction)}</span></div>
                            <div className="border-t border-slate-200 my-2"></div>
                            <div className="flex justify-between font-bold"><span>Base de Cálculo:</span> <span>{formatCurrency(result.legalBase)}</span></div>
                        </div>
                    </div>
                </div>

                {/* RESULTADO FINAL (CARD GOV STYLE) */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-[#003673] text-white p-6">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Imposto Devido Mensal</p>
                        <div className="flex items-baseline gap-2">
                             <h3 className="text-4xl font-bold">R$ {result.taxValue.toFixed(2)}</h3>
                             <span className="text-sm font-light">a ser pago ou retido</span>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-bold mb-1">Base de Cálculo</p>
                            <p className="text-xl font-bold text-slate-800">{formatCurrency(result.appliedBase)}</p>
                            <p className="text-[10px] text-slate-400 leading-tight mt-1">Valor tributável final.</p>
                        </div>
                        <div className="md:border-x md:border-slate-100 md:px-6">
                            <p className="text-slate-500 text-xs uppercase font-bold mb-1">Parcela a Deduzir</p>
                            <p className="text-xl font-bold text-emerald-600">-{formatCurrency(result.deductibleAmount)}</p>
                            <p className="text-[10px] text-slate-400 leading-tight mt-1">Abatimento da faixa.</p>
                        </div>
                         <div>
                            <p className="text-slate-500 text-xs uppercase font-bold mb-1">Alíquota Efetiva</p>
                            <p className="text-xl font-bold text-indigo-600">{result.effectiveRate}%</p>
                            <p className="text-[10px] text-slate-400 leading-tight mt-1">Peso real sobre o bruto.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800 flex gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   <p>
                     <strong>Dica:</strong> Embora a alíquota nominal possa chegar a 27.5%, sua alíquota efetiva é de apenas <strong>{result.effectiveRate}%</strong> devido à progressividade da tabela e à parcela a deduzir.
                   </p>
                </div>

                {/* AI ADVISOR INTEGRATION */}
                <div className="mt-8">
                     <AIAdvisor
                        context={{
                            type: 'irpf',
                            gross: result.baseSalary,
                            net: result.baseSalary - result.taxValue, // Líquido após IR
                            discounts: result.taxValue + result.inssDeduction,
                            inss: result.inssDeduction
                        }}
                     />
                </div>

             </div>
            )}
        </section>
      </div>
    </div>
  );
};


export default IrpfView;
