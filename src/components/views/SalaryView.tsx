import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { CalculationResult, SalaryInput, ExtrasInput, ConsignedInput, AIContext } from '../../types';
import { calculateSalary } from '../../services/taxService';
import { InputGroup, ExtrasSection, ResultCard } from '../Shared';
import { Check } from 'lucide-react';
import ConsignedSection from '../ConsignedSection';
import PayslipTable, { PayslipItem } from '../PayslipTable';
import AdUnit from '../AdUnit';

// Lazy loading for heavy components
const PieChartVisual = React.lazy(() => import('../PieChartVisual'));
const AIAdvisor = React.lazy(() => import('../AIAdvisor'));

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

  // Real-time calculation
  React.useEffect(() => {
    if (data.grossSalary > 0) {
        setResult(calculateSalary(data));
    } else {
        setResult(null);
    }
  }, [data]);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    // Optional: Scroll to results if needed, or just do nothing as it's auto-calc
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };


  const aiContext: AIContext | null = React.useMemo(() => {
    if (!result) return null;
    return {
      type: 'salary' as const,
      gross: result.grossSalary,
      net: result.finalNetSalary,
      discounts: result.totalDiscounts + result.consignedDiscount,
      inss: result.inss,
      extras: result.totalExtras
    };
  }, [result]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="w-full max-w-7xl mx-auto pb-24">
      <Helmet>
        <title>Calculadora Salário Líquido 2026 - Oficial e Atualizada</title>
        <meta name="description" content="Calcule seu salário líquido 2026 com as novas tabelas de INSS e IRRF. Simule descontos, horas extras e benefícios. Grátis e preciso." />
        <link rel="canonical" href="https://calculadorasalario2026.com.br/" />
      </Helmet>

      {/* 1. CABEÇALHO */}
      <header className="mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">Salário Líquido <span className="text-blue-600">2026</span></h2>
        <p className="text-slate-500 text-lg md:text-xl mt-3 max-w-2xl leading-relaxed">Simule seus ganhos reais, descontos oficiais e impostos atualizados com precisão cirúrgica.</p>
      </header>

      {/* 2. ÁREA DE CÁLCULO E RESULTADOS */}
      {/* Container flex para Desktop, mas bloco normal para Mobile para evitar sobreposição */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full relative">

        {/* CONTAINER A: FORMULÁRIO */}
        {/* CONTAINER A: FORMULÁRIO */}
        <section className="w-full lg:w-5/12 glass-card p-6 md:p-10 rounded-[2.5rem] relative z-10 animate-fade-in-up border-none shadow-2xl">
           <div className="mb-8 pl-1">
              <h3 className="text-xl font-black text-slate-800">Configuração de Ganhos</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Dados oficiais CLT</p>
           </div>

           <form onSubmit={handleCalc} className="space-y-6">
              <InputGroup label="Salário Bruto Mensal" value={data.grossSalary} onChange={(v) => setData({...data, grossSalary: Number(v)})} required />

              <div className={`p-5 rounded-3xl border-2 transition-all ${data.includeDependents ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50/50 border-slate-100'}`}>
                <label className="flex items-center gap-4 cursor-pointer select-none">
                  <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${data.includeDependents ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200'}`}>
                    {data.includeDependents && <Check size={14} strokeWidth={3} />}
                  </div>
                  <input type="checkbox" className="hidden" checked={data.includeDependents} onChange={(e) => setData({...data, includeDependents: e.target.checked})} />
                  <span className="text-sm font-bold text-slate-700">Dependentes para IRPF</span>
                </label>
                {data.includeDependents && (
                  <div className="mt-4 animate-scale-in">
                    <InputGroup label="Quantidade de Dependentes" value={data.dependents} onChange={(v) => setData({...data, dependents: Number(v)})} isSmall placeholder="0" />
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

              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all transform active:scale-[0.98] text-lg mt-2">
                Calcular Líquido
              </button>
           </form>
        </section>

        {/* CONTAINER B: RESULTADOS FINANCEIROS */}
        <section className="w-full lg:w-7/12 relative z-10">
           {result && (
             <div ref={resultsRef} className="space-y-6 animate-fade-in-up scroll-mt-6">

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
                       ...(result.familySalary > 0 ? [{ label: 'Salário Família', value: result.familySalary, type: 'earning' } as PayslipItem] : []),
                       ...(result.extrasBreakdown.value50 > 0 ? [{ label: 'Hora Extra 50%', value: result.extrasBreakdown.value50, type: 'earning' } as PayslipItem] : []),
                       ...(result.extrasBreakdown.value100 > 0 ? [{ label: 'Hora Extra 100%', value: result.extrasBreakdown.value100, type: 'earning' } as PayslipItem] : []),
                       ...(result.extrasBreakdown.valueNight > 0 ? [{ label: 'Adicional Noturno', value: result.extrasBreakdown.valueNight, type: 'earning' } as PayslipItem] : []),
                       ...(result.extrasBreakdown.valueStandby > 0 ? [{ label: 'Sobreaviso', value: result.extrasBreakdown.valueStandby, type: 'earning' } as PayslipItem] : []),
                       ...(result.extrasBreakdown.valueInterjornada > 0 ? [{ label: 'Interjornada', value: result.extrasBreakdown.valueInterjornada, type: 'earning' } as PayslipItem] : []),
                       ...(result.extrasBreakdown.valueDsr > 0 ? [{ label: 'DSR', value: result.extrasBreakdown.valueDsr, type: 'earning' } as PayslipItem] : []),
                     ]}
                     discounts={[
                       { label: 'INSS', value: result.inss, type: 'discount' },
                       { label: 'Imposto de Renda (IRPF)', value: result.irpf, type: 'discount' },
                       ...(result.transportVoucher > 0 ? [{ label: 'Vale Transporte', value: result.transportVoucher, type: 'discount' } as PayslipItem] : []),
                       ...(result.healthInsurance > 0 ? [{ label: 'Plano de Saúde', value: result.healthInsurance, type: 'discount' } as PayslipItem] : []),
                       ...(result.otherDiscounts > 0 ? [{ label: 'Outros Descontos', value: result.otherDiscounts, type: 'discount' } as PayslipItem] : []),
                       ...(result.consignedDiscount > 0 ? [{ label: 'Empréstimo Consignado', value: result.consignedDiscount, type: 'discount' } as PayslipItem] : []),
                     ]}
                     totalGross={result.grossSalary + result.totalExtras + result.familySalary}
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
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-center h-fit min-h-[300px]">
                    <React.Suspense fallback={<div className="h-[300px] w-full bg-slate-50 animate-pulse rounded-full flex items-center justify-center text-slate-300">Carregando visualização...</div>}>
                      <PieChartVisual data={result} />
                    </React.Suspense>
                  </div>

                 {/* BOTÃO PDF */}
                 <div className="flex justify-center mt-4">
                    <button
                      onClick={() => import('../../utils/pdfGenerator').then(mod => mod.generatePayslipPdf(result))}
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                      Baixar Holerite (PDF)
                    </button>
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
                <React.Suspense fallback={<div className="h-32 bg-slate-50 animate-pulse rounded-2xl border border-slate-100"></div>}>
                  <AIAdvisor context={aiContext} />
                </React.Suspense>
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
