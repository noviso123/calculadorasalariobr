import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ThirteenthInput, ThirteenthResult, ExtrasInput, ConsignedInput, AIContext } from '../../types';
import { calculateThirteenth } from '../../services/taxService';
import { InputGroup, ExtrasSection, Row } from '../Shared';
import ConsignedSection from '../ConsignedSection';
import AIAdvisor from '../AIAdvisor';
import AdUnit from '../AdUnit';

// Ícone customizado para evitar dependência extra
const ArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

const initialExtras: ExtrasInput = {
  workload: 220, hours50: 0, hours100: 0, hoursNight: 0, hoursStandby: 0, hoursInterjornada: 0, includeDsr: true
};
const initialConsigned: ConsignedInput = {
  monthlyInstallment: 0, outstandingBalance: 0, hasFgtsWarranty: false, fgtsBalance: 0
};

const ThirteenthView: React.FC = () => {
  const resultsRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ThirteenthInput>({
    grossSalary: 0, monthsWorked: 12, includeDependents: false, dependents: 0,
    includeExtras: false, extras: initialExtras,
    includeConsigned: false, consigned: initialConsigned
  });

  const [result, setResult] = useState<ThirteenthResult | null>(null);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(calculateThirteenth(data));
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const getAIContext = (): AIContext | null => {
    if (!result) return null;
    return {
      type: 'thirteenth',
      gross: result.totalGross,
      net: result.finalTotalNet,
      discounts: result.parcel2.inss + result.parcel2.irpf + result.parcel2.consignedDiscount,
      inss: result.parcel2.inss,
      monthsWorked: data.monthsWorked
    };
  };

  return (
   <div className="w-full max-w-5xl mx-auto pb-24">
      <Helmet>
        <title>Calculadora Décimo Terceiro 2026 - 1ª e 2ª Parcela</title>
        <meta name="description" content="Saiba quanto vai receber de 13º Salário em 2026. Cálculo exato da primeira e segunda parcela com descontos atualizados." />
        <link rel="canonical" href="https://calculadorasalario2026.com.br/decimo-terceiro" />
      </Helmet>
      {/* 1. CABEÇALHO */}
      <header className="mb-8 md:mb-12">
        <h2 className="text-3xl font-bold text-slate-800">Décimo Terceiro 2026</h2>
        <p className="text-slate-500">Simule o recebimento da 1ª e 2ª parcela com precisão.</p>
      </header>

      {/* 2. ÁREA DE CÁLCULO */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full relative">

         {/* CONTAINER A: FORMULÁRIO */}
         <section className="w-full lg:w-5/12 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 relative z-10">
            <form onSubmit={handleCalc} className="space-y-5">
               <InputGroup label="Salário Bruto" value={data.grossSalary} onChange={(v) => setData({...data, grossSalary: Number(v)})} required />
               <InputGroup label="Meses Trabalhados" value={data.monthsWorked} onChange={(v) => setData({...data, monthsWorked: Math.min(12, Number(v))})} isSmall />

               <div className={`p-4 rounded-xl border transition-all ${data.includeDependents ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                 <label className="flex items-center gap-3 cursor-pointer select-none">
                   <input type="checkbox" checked={data.includeDependents} onChange={(e) => setData({...data, includeDependents: e.target.checked})} className="h-5 w-5 accent-blue-600 rounded" />
                   <span className="text-sm font-semibold text-slate-700">Incluir Dependentes (IRPF)</span>
                 </label>
                 {data.includeDependents && (
                   <div className="mt-4 animate-fade-in">
                     <InputGroup label="Número de Dependentes" value={data.dependents} onChange={(v) => setData({...data, dependents: Number(v)})} isSmall placeholder="0" />
                   </div>
                 )}
               </div>

               <ExtrasSection
                 isActive={data.includeExtras}
                 onToggle={(v) => setData({...data, includeExtras: v})}
                 data={data.extras}
                 onChange={(d) => setData({...data, extras: d})}
                 labelOverride="Incluir Média de Extras"
               />

               <ConsignedSection
                isActive={data.includeConsigned}
                onToggle={(v) => setData({...data, includeConsigned: v})}
                data={data.consigned}
                onChange={(d) => setData({...data, consigned: d})}
              />

               <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-2 active:scale-[0.98] text-lg">Simular Parcelas</button>
            </form>
         </section>

         {/* CONTAINER B: RESULTADOS */}
         <section className="w-full lg:w-7/12 relative z-10">
            {result && (
               <div ref={resultsRef} className="space-y-6 animate-fade-in scroll-mt-6">
                  <h3 className="font-bold text-slate-700 md:text-lg">Fluxo de Recebimento</h3>

                  {/* CARD 1a PARCELA */}
                  <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl relative overflow-hidden shadow-sm">
                     <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 mb-2">
                        <div>
                           <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider">1ª Parcela (Nov)</p>
                           <p className="text-3xl md:text-4xl font-extrabold text-emerald-800 mt-1">{formatCurrency(result.parcel1.value)}</p>
                        </div>
                        <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full w-fit">SEM DESCONTOS</span>
                     </div>
                  </div>

                  <div className="flex justify-center -my-2 opacity-30 text-slate-400 rotate-90 md:rotate-0"><ArrowIcon /></div>

                  {/* CARD 2a PARCELA */}
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-end mb-4">
                           <div>
                               <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">2ª Parcela (Dez) - Líquida</p>
                               <p className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-1">{formatCurrency(result.parcel2.finalValue)}</p>
                           </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100">
                         <Row label="13º Salário Integral" value={result.totalGross} />
                         <Row label="Média de Extras" value={result.extrasBreakdown.total} />

                         <div className="my-2 border-t border-slate-50"></div>

                         <Row label="INSS" value={-result.parcel2.inss} />
                         <Row label="IRPF" value={-result.parcel2.irpf} />
                         <Row label="Desc. Adiantamento" value={-result.parcel2.discountAdvance} />
                         {result.parcel2.consignedDiscount > 0 && <Row label="Empréstimo Consignado" value={-result.parcel2.consignedDiscount} highlight />}
                      </div>
                  </div>

                  <div className="mt-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-blue-400 flex flex-col items-center justify-center transform hover:scale-[1.01] transition-transform">
                     <p className="text-blue-200 text-xs font-bold uppercase tracking-widest text-center mb-1">Total Líquido (Soma)</p>
                     <p className="text-4xl md:text-5xl font-black text-center tracking-tight drop-shadow-sm">
                         {formatCurrency(result.finalTotalNet)}
                     </p>
                  </div>
               </div>
            )}
         </section>
      </div>

      {/* SEPARADOR FÍSICO / OBRIGATÓRIO */}
      {result && <div className="w-full h-12 bg-transparent pointer-events-none" aria-hidden="true"></div>}

      {/* CONTAINER C: CONSULTORIA IA */}
      {result && (
        <section className="w-full relative z-0 block mt-8">
            <div className="w-full bg-white p-6 md:p-8 rounded-3xl border border-blue-100 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Análise Inteligente 2026</h3>
                        <p className="text-sm text-slate-500">Receba insights financeiros baseados no seu cálculo.</p>
                    </div>
                </div>
                <AIAdvisor context={getAIContext()} />
            </div>
        </section>
      )}

      {/* SEPARADOR FÍSICO / OBRIGATÓRIO */}
      {result && <div className="w-full h-12 bg-transparent pointer-events-none" aria-hidden="true"></div>}

      {/* CONTAINER D: PUBLICIDADE */}
      {result && (
        <section className="w-full relative z-0 block mt-8">
            <div className="w-full bg-slate-50 border border-slate-200 border-dashed rounded-xl p-6 flex justify-center">
                <AdUnit slotId="7977197949" />
            </div>
        </section>
      )}

   </div>
  );
};

export default ThirteenthView;
