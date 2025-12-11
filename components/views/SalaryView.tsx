import React, { useState, useRef } from 'react';
import { CalculationResult, SalaryInput, ExtrasInput, ConsignedInput, AIContext } from '../../types';
import { calculateSalary } from '../../services/taxService';
import { InputGroup, ExtrasSection, ResultCard } from '../Shared';
import ConsignedSection from '../ConsignedSection';
import PieChartVisual from '../PieChartVisual';
import AIAdvisor from '../AIAdvisor';
import PayslipTable from '../PayslipTable';
import AdUnit from '../AdUnit';

const initialExtras: ExtrasInput = {
  workload: 220, hours50: 0, hours100: 0, hoursNight: 0, hoursStandby: 0, hoursInterjornada: 0, includeDsr: true
};
const initialConsigned: ConsignedInput = {
  monthlyInstallment: 0, outstandingBalance: 0, hasFgtsWarranty: false, fgtsBalance: 0
};

const SalaryView: React.FC = () => {
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<SalaryInput>({
    grossSalary: 0, includeDependents: false, dependents: 0, otherDiscounts: 0, healthInsurance: 0,
    transportVoucherPercent: 6, includeTransportVoucher: false, transportDailyCost: 0, workDays: 22,
    includeExtras: false, extras: initialExtras,
    includeConsigned: false, consigned: initialConsigned
  });
  
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(calculateSalary(data));
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  };

  const getAIContext = (): AIContext | null => {
    if (!result) return null;
    return {
      type: 'salary',
      gross: result.grossSalary,
      net: result.finalNetSalary,
      discounts: result.totalDiscounts + result.consignedDiscount,
      extras: result.totalExtras
    };
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="w-full max-w-7xl mx-auto pb-24">
      {/* 1. CABEÇALHO */}
      <header className="mb-8 md:mb-12">
        <h2 className="text-3xl font-bold text-slate-800">Salário Líquido 2026</h2>
        <p className="text-slate-500">Simule seus ganhos reais, descontos oficiais e impostos atualizados.</p>
      </header>
      
      {/* 2. ÁREA DE CÁLCULO E RESULTADOS */}
      {/* Container flex para Desktop, mas bloco normal para Mobile para evitar sobreposição */}
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

              <ExtrasSection 
                isActive={data.includeExtras} 
                onToggle={(v) => setData({...data, includeExtras: v})}
                data={data.extras}
                onChange={(d) => setData({...data, extras: d})}
              />

              <ConsignedSection 
                isActive={data.includeConsigned}
                onToggle={(v) => setData({...data, includeConsigned: v})}
                data={data.consigned}
                onChange={(d) => setData({...data, consigned: d})}
              />

              <div className={`p-4 rounded-xl border transition-all ${data.includeTransportVoucher ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" checked={data.includeTransportVoucher} onChange={(e) => setData({...data, includeTransportVoucher: e.target.checked})} className="h-5 w-5 accent-blue-600 rounded" />
                  <span className="text-sm font-semibold text-slate-700">Incluir Vale Transporte</span>
                </label>
                {data.includeTransportVoucher && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                    <InputGroup label="Custo Diário" value={data.transportDailyCost || 0} onChange={(v) => setData({...data, transportDailyCost: Number(v)})} isSmall />
                    <InputGroup label="Dias Úteis" value={data.workDays || 22} onChange={(v) => setData({...data, workDays: Number(v)})} isSmall />
                  </div>
                )}
              </div>

              <InputGroup label="Plano de Saúde" value={data.healthInsurance} onChange={(v) => setData({...data, healthInsurance: Number(v)})} />
              <InputGroup label="Outros Descontos" value={data.otherDiscounts} onChange={(v) => setData({...data, otherDiscounts: Number(v)})} />
              
              <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] text-lg">
                Calcular Líquido
              </button>
           </form>
        </section>

        {/* CONTAINER B: RESULTADOS FINANCEIROS */}
        <section className="w-full lg:w-7/12 relative z-10">
           {result && (
             <div ref={resultsRef} className="space-y-6 animate-fade-in scroll-mt-6">
                
                {/* Cards Principais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <ResultCard label="Salário Bruto" value={result.grossSalary} />
                   <ResultCard label="Salário Líquido" value={result.finalNetSalary} isMain />
                   
                   {result.consignedDiscount > 0 ? (
                      <ResultCard label="Empréstimo (Desc.)" value={result.consignedDiscount} isConsigned />
                   ) : (
                      <div className="hidden sm:block"></div>
                   )}
                   <ResultCard label="Total Descontos" value={result.totalDiscounts + result.consignedDiscount} isDanger />
                </div>
                
                {/* Tabela de Holerite */}
                <div className="mt-4">
                   <PayslipTable 
                     earnings={[
                       { label: 'Salário Base', value: result.grossSalary, type: 'earning' },
                       ...(result.extrasBreakdown.value50 > 0 ? [{ label: 'Hora Extra 50%', value: result.extrasBreakdown.value50, type: 'earning' } as any] : []),
                       ...(result.extrasBreakdown.value100 > 0 ? [{ label: 'Hora Extra 100%', value: result.extrasBreakdown.value100, type: 'earning' } as any] : []),
                       ...(result.extrasBreakdown.valueNight > 0 ? [{ label: 'Adicional Noturno', value: result.extrasBreakdown.valueNight, type: 'earning' } as any] : []),
                       ...(result.extrasBreakdown.valueStandby > 0 ? [{ label: 'Sobreaviso', value: result.extrasBreakdown.valueStandby, type: 'earning' } as any] : []),
                       ...(result.extrasBreakdown.valueInterjornada > 0 ? [{ label: 'Interjornada', value: result.extrasBreakdown.valueInterjornada, type: 'earning' } as any] : []),
                       ...(result.extrasBreakdown.valueDsr > 0 ? [{ label: 'DSR', value: result.extrasBreakdown.valueDsr, type: 'earning' } as any] : []),
                     ]}
                     discounts={[
                       { label: 'INSS', value: result.inss, type: 'discount' },
                       { label: 'Imposto de Renda (IRPF)', value: result.irpf, type: 'discount' },
                       ...(result.transportVoucher > 0 ? [{ label: 'Vale Transporte', value: result.transportVoucher, type: 'discount' } as any] : []),
                       ...(result.healthInsurance > 0 ? [{ label: 'Plano de Saúde', value: result.healthInsurance, type: 'discount' } as any] : []),
                       ...(result.otherDiscounts > 0 ? [{ label: 'Outros Descontos', value: result.otherDiscounts, type: 'discount' } as any] : []),
                       ...(result.consignedDiscount > 0 ? [{ label: 'Empréstimo Consignado', value: result.consignedDiscount, type: 'discount' } as any] : []),
                     ]}
                     totalGross={result.grossSalary + result.totalExtras}
                     totalDiscounts={result.totalDiscounts + result.consignedDiscount}
                     netValue={result.finalNetSalary}
                     footerNote={
                       <div className="flex items-center justify-center gap-2">
                          <span className="text-emerald-600 font-bold">FGTS do Mês: {formatCurrency(result.fgtsMonthly)}</span>
                          <span className="text-slate-300">|</span>
                          <span>Margem Disp: {formatCurrency(result.maxConsignableMargin)}</span>
                       </div>
                     }
                   />
                </div>
                
                {/* Gráfico */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-center h-fit">
                    <PieChartVisual data={result} />
                </div>
             </div>
           )}
        </section>
      </div>

      {/* SEPARADOR FÍSICO / OBRIGATÓRIO */}
      {result && <div className="w-full h-12 bg-transparent pointer-events-none" aria-hidden="true"></div>}

      {/* CONTAINER C: CONSULTORIA IA - BLOCO TOTALMENTE ISOLADO */}
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

      {/* CONTAINER D: PUBLICIDADE - BLOCO TOTALMENTE ISOLADO */}
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

export default SalaryView;
