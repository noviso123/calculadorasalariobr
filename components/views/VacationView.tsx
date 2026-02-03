import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { VacationInput, VacationResult, ExtrasInput, ConsignedInput, AIContext } from '../../types';
import { calculateVacation } from '../../services/taxService';
import { InputGroup, ExtrasSection, Row } from '../Shared';
import ConsignedSection from '../ConsignedSection';
import AIAdvisor from '../AIAdvisor';
import AdUnit from '../AdUnit';

const initialExtras: ExtrasInput = {
  workload: 220, hours50: 0, hours100: 0, hoursNight: 0, hoursStandby: 0, hoursInterjornada: 0, includeDsr: true
};
const initialConsigned: ConsignedInput = {
  monthlyInstallment: 0, outstandingBalance: 0, hasFgtsWarranty: false, fgtsBalance: 0
};

const VacationView: React.FC = () => {
  const resultsRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<VacationInput>({
    grossSalary: 0, includeDependents: false, dependents: 0, daysTaken: 30, sellDays: false, daysSold: 10, advanceThirteenth: false,
    includeExtras: false, extras: initialExtras,
    includeConsigned: false, consigned: initialConsigned
  });

  const [result, setResult] = useState<VacationResult | null>(null);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(calculateVacation(data));
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const getAIContext = (): AIContext | null => {
    if (!result) return null;
    return {
      type: 'vacation',
      gross: result.totalGross,
      net: result.finalNetVacation,
      discounts: result.totalDiscounts + result.consignedDiscount,
      inss: result.discountInss,
      extras: result.extrasBreakdown.total,
      daysTaken: data.daysTaken
    };
  };

  return (
   <div className="w-full max-w-5xl mx-auto pb-24">
     <Helmet>
        <title>Calculadora de Férias 2026 - CLT Atualizada</title>
        <meta name="description" content="Simule o valor exato das suas férias 2026. Inclui venda de dias (abono), 1/3 constitucional e adiantamento de 13º salário." />
        <link rel="canonical" href="https://calculadorasalario2026.com.br/ferias" />
     </Helmet>
     {/* 1. CABEÇALHO */}
     <header className="mb-8 md:mb-12">
       <h2 className="text-3xl font-bold text-slate-800">Calculadora de Férias</h2>
       <p className="text-slate-500">Simule o valor exato a receber nas suas férias.</p>
     </header>

     {/* 2. ÁREA DE CÁLCULO */}
     <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full relative">

        {/* CONTAINER A: FORMULÁRIO */}
        <section className="w-full lg:w-5/12 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 relative z-10">
          <form onSubmit={handleCalc} className="space-y-5">
             <InputGroup label="Salário Bruto" value={data.grossSalary} onChange={(v) => setData({...data, grossSalary: Number(v)})} required />

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

             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Dias de Descanso</label>
                <select
                  value={data.daysTaken}
                  onChange={(e) => setData({...data, daysTaken: Number(e.target.value)})}
                  className="w-full p-3 border rounded-xl bg-slate-50 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
                >
                   <option value="30">30 dias</option>
                   <option value="20">20 dias</option>
                   <option value="15">15 dias</option>
                   <option value="10">10 dias</option>
                </select>
             </div>

             <div className={`p-4 rounded-xl border transition-all ${data.sellDays ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                   <input type="checkbox" checked={data.sellDays} onChange={(e) => setData({...data, sellDays: e.target.checked})} className="h-5 w-5 accent-blue-600 rounded" />
                   <span className="text-sm font-semibold text-slate-700">Vender Férias (Abono)?</span>
                </label>
                {data.sellDays && (
                   <div className="mt-3 animate-fade-in">
                      <label className="block text-[10px] font-bold text-blue-700 mb-1 uppercase">Dias para Vender (Max 10)</label>
                      <input type="number" max="10" min="1" value={data.daysSold} onChange={(e) => setData({...data, daysSold: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none" />
                   </div>
                )}
             </div>

             <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={data.advanceThirteenth} onChange={(e) => setData({...data, advanceThirteenth: e.target.checked})} className="h-5 w-5 accent-blue-600 rounded" />
                <span className="text-sm font-semibold text-slate-700">Adiantar 1ª Parcela 13º?</span>
             </label>

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

             <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-2 active:scale-[0.98] text-lg">Calcular Férias</button>
          </form>
        </section>

        {/* CONTAINER B: RESULTADOS */}
        <section className="w-full lg:w-7/12 relative z-10">
            {result && (
               <div ref={resultsRef} className="space-y-6 animate-fade-in scroll-mt-6">
                  <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-yellow-400 flex flex-col items-center justify-center transform hover:scale-[1.01] transition-transform">
                      <p className="text-blue-200 text-xs font-bold uppercase tracking-widest text-center mb-1">Total Líquido a Receber</p>
                      <p className="text-4xl md:text-5xl font-black text-center tracking-tight drop-shadow-sm">
                          {formatCurrency(result.finalNetVacation)}
                      </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-4">
                     <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Detalhamento</h4>

                     <Row label="Férias (Bruto)" value={result.vacationGross} />
                     <Row label="1/3 Constitucional" value={result.vacationThird} />
                     {result.allowanceGross > 0 && <Row label="Abono Pecuniário" value={result.allowanceGross} />}
                     {result.allowanceThird > 0 && <Row label="1/3 Abono" value={result.allowanceThird} />}
                     {result.advanceThirteenth > 0 && <Row label="Adiantamento 13º" value={result.advanceThirteenth} />}

                     <Row label="Média de Extras" value={result.extrasBreakdown.total} />

                     <div className="my-2 border-t border-slate-50"></div>

                     <Row label="INSS" value={-result.discountInss} />
                     <Row label="IRPF" value={-result.discountIr} />
                     {result.consignedDiscount > 0 && <Row label="Empréstimo Consignado" value={-result.consignedDiscount} highlight />}

                     <div className="border-t border-slate-100 my-3"></div>
                     <div className="flex justify-between font-bold text-lg text-slate-700">
                       <span>Total Descontos</span>
                       <span className="text-red-600">{formatCurrency(result.totalDiscounts + result.consignedDiscount)}</span>
                     </div>
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

export default VacationView;
