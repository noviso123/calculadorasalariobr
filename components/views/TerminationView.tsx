import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { TerminationInput, TerminationResult, ExtrasInput, ConsignedInput, AIContext } from '../../types';
import { calculateTermination } from '../../services/taxService';
import { InputGroup, ExtrasSection, Row } from '../Shared';
import ConsignedSection from '../ConsignedSection';
import AIAdvisor from '../AIAdvisor';
import AdUnit from '../AdUnit';

const BankIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="21" width="18" height="2" rx="1"/><rect x="5" y="3" width="14" height="14" rx="2"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M9 11h.01"/><path d="M15 11h.01"/><path d="M12 15h.01"/></svg>;

const initialExtras: ExtrasInput = {
  workload: 220, hours50: 0, hours100: 0, hoursNight: 0, hoursStandby: 0, hoursInterjornada: 0, includeDsr: true
};
const initialConsigned: ConsignedInput = {
  monthlyInstallment: 0, outstandingBalance: 0, hasFgtsWarranty: false, fgtsBalance: 0
};

const TerminationView: React.FC = () => {
  const resultsRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<TerminationInput>({
    grossSalary: 0, startDate: '', endDate: '', reason: 'dismissal_no_cause', noticeStatus: 'indemnified', hasExpiredVacation: false, thirteenthAdvancePaid: false, includeDependents: false, dependents: 0,
    includeExtras: false, extras: initialExtras,
    includeConsigned: false, consigned: initialConsigned
  });

  const [result, setResult] = useState<TerminationResult | null>(null);



  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    if(data.startDate && data.endDate) {
      setResult(calculateTermination(data));
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const aiContext = React.useMemo(() => {
    if (!result) return null;
    return {
      type: 'termination' as const,
      gross: result.totalGross,
      net: result.finalNetTermination,
      discounts: result.totalDiscounts + result.consignedDiscount,
      inss: result.discountInss,
      terminationReason: data.reason
    };
  }, [result, data.reason]);

  return (
   <div className="w-full max-w-7xl mx-auto pb-24">
      <Helmet>
        <title>Calculadora de Rescisão 2026 - Cálculo Trabalhista</title>
        <meta name="description" content="Simulador de Rescisão de Contrato de Trabalho 2026. Calcule saldo de salário, aviso prévio, férias proporcionais e multa do FGTS." />
        <link rel="canonical" href="https://calculadorasalario2026.com.br/rescisao" />
      </Helmet>
      {/* 1. CABEÇALHO */}
      <header className="mb-8 md:mb-12">
        <h2 className="text-3xl font-bold text-slate-800">Rescisão de Contrato</h2>
        <p className="text-slate-500">Estimativa completa de valores para desligamento trabalhista.</p>
      </header>

      {/* 2. ÁREA DE CÁLCULO */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full relative">

         {/* CONTAINER A: FORMULÁRIO */}
         <section className="w-full lg:w-5/12 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 relative z-10">
            <form onSubmit={handleCalc} className="space-y-4">
               <InputGroup label="Salário Bruto" value={data.grossSalary} onChange={(v) => setData({...data, grossSalary: Number(v)})} required />
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Data Admissão</label>
                    <input type="date" value={data.startDate} onChange={(e) => setData({...data, startDate: e.target.value})} className="w-full p-3 border rounded-lg text-slate-700 bg-slate-50 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Data Saída</label>
                    <input type="date" value={data.endDate} onChange={(e) => {
                      const newDate = e.target.value;
                      let newThirteenthPaid = data.thirteenthAdvancePaid;

                      if (newDate) {
                        const end = new Date(newDate + 'T12:00:00');
                        const month = end.getMonth();
                        if (month === 11) newThirteenthPaid = true;
                        else if (month === 0) newThirteenthPaid = false;
                      }

                      setData({...data, endDate: newDate, thirteenthAdvancePaid: newThirteenthPaid});
                    }} className="w-full p-3 border rounded-lg text-slate-700 bg-slate-50 outline-none" required />
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Motivo do Desligamento</label>
                  <select
                    value={data.reason}
                    onChange={(e) => {
                      const r = e.target.value as 'dismissal_no_cause' | 'dismissal_cause' | 'resignation' | 'agreement';
                      let ns = data.noticeStatus;
                      if (r === 'dismissal_no_cause') ns = 'indemnified';
                      if (r === 'resignation') ns = 'worked';
                      if (r === 'dismissal_cause') ns = 'worked';
                      if (r === 'agreement') ns = 'indemnified';
                      setData({...data, reason: r, noticeStatus: ns});
                    }}
                    className="w-full p-3 border rounded-xl bg-slate-50 font-medium text-slate-700 outline-none"
                  >
                     <option value="dismissal_no_cause">Demissão sem Justa Causa</option>
                     <option value="dismissal_cause">Demissão por Justa Causa</option>
                     <option value="resignation">Pedido de Demissão</option>
                     <option value="agreement">Acordo (Culpa Recíproca)</option>
                  </select>
               </div>

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

              {data.reason !== 'dismissal_cause' && (
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Aviso Prévio</label>
                    <select
                      value={data.noticeStatus}
                      onChange={(e) => setData({...data, noticeStatus: e.target.value as 'worked' | 'indemnified' | 'not_fulfilled' | 'waived'})}
                      className="w-full p-3 border rounded-xl bg-slate-50 font-medium text-slate-700 outline-none"
                    >
                       {data.reason === 'dismissal_no_cause' && (
                         <>
                           <option value="indemnified">Indenizado</option>
                           <option value="worked">Trabalhado</option>
                         </>
                       )}
                       {data.reason === 'resignation' && (
                         <>
                           <option value="worked">Trabalhado</option>
                           <option value="not_fulfilled">Não Cumprido (Desconto)</option>
                           <option value="waived">Dispensado</option>
                         </>
                       )}
                       {data.reason === 'agreement' && (
                         <>
                           <option value="indemnified">Indenizado</option>
                           <option value="worked">Trabalhado</option>
                         </>
                       )}
                    </select>
                 </div>
               )}

               <ExtrasSection
                 isActive={data.includeExtras}
                 onToggle={(v) => setData({...data, includeExtras: v})}
                 data={data.extras}
                 onChange={(d) => setData({...data, extras: d})}
                 labelOverride="Incluir Extras / Base"
               />

               <ConsignedSection
                isActive={data.includeConsigned}
                onToggle={(v) => setData({...data, includeConsigned: v})}
                data={data.consigned}
                onChange={(d) => setData({...data, consigned: d})}
                isTermination
              />

               <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer">
                    <input type="checkbox" checked={data.hasExpiredVacation} onChange={(e) => setData({...data, hasExpiredVacation: e.target.checked})} className="h-5 w-5 accent-blue-600 rounded" />
                    <span className="text-sm font-semibold text-slate-700">Possui Férias Vencidas?</span>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${data.thirteenthAdvancePaid ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent'}`}>
                    <input type="checkbox" checked={data.thirteenthAdvancePaid} onChange={(e) => setData({...data, thirteenthAdvancePaid: e.target.checked})} className="h-5 w-5 accent-blue-600 rounded" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700">1ª Parcela do 13º já paga?</span>
                    </div>
                </label>
               </div>

               <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-2 active:scale-[0.98] text-lg">Simular Rescisão</button>
            </form>
         </section>

         {/* CONTAINER B: RESULTADOS */}
         <section className="w-full lg:w-7/12 relative z-10">
            {result && (
               <div ref={resultsRef} className="space-y-6 animate-fade-in scroll-mt-6">
                  {/* CARDS DE RESULTADO: RESCISÃO + FGTS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* CARD 1: RESCISÃO LÍQUIDA (DINHEIRO NA MÃO) */}
                      <div className={`text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between ${result.finalNetTermination === 0 ? 'bg-red-900' : 'bg-slate-800'}`}>
                        <p className={`${result.finalNetTermination === 0 ? 'text-red-200' : 'text-slate-300'} text-xs font-bold uppercase tracking-wider`}>Líquido Rescisório (TRCT)</p>
                        <p className="text-3xl font-extrabold mt-2 break-words">{formatCurrency(result.finalNetTermination)}</p>
                        <p className={`${result.finalNetTermination === 0 ? 'text-red-300' : 'text-slate-400'} text-xs mt-2`}>
                          {result.finalNetTermination === 0 ? 'Deduções superiores aos ganhos (Zerado)' : 'Valor depositado em conta'}
                        </p>
                      </div>

                      {/* CARD 2: SAQUE FGTS */}
                      <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                        <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Líquido FGTS a Sacar</p>
                        <p className="text-3xl font-extrabold mt-2 break-words">{formatCurrency(result.finalFgtsToWithdraw)}</p>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-emerald-200">Saldo Disponível no App FGTS</p>
                        </div>
                      </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-4">
                      <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Detalhamento TRCT</h4>

                      <Row label="Saldo de Salário" value={result.balanceSalary} />
                      {result.noticeWarning > 0 && <Row label="Aviso Prévio Indenizado" value={result.noticeWarning} />}
                      <Row label={`Férias Proporcionais (${result.vacationMonths}/12)`} value={result.vacationProportional} />
                      <Row label="1/3 Férias" value={result.vacationThird} />
                      <Row label={`13º Proporcional (${result.thirteenthMonths}/12)`} value={result.thirteenthProportional} />
                      {result.vacationExpired > 0 && <Row label="Férias Vencidas" value={result.vacationExpired} />}

                      <div className="my-2 border-t border-slate-50"></div>

                      <Row label="INSS (Total)" value={-result.discountInss} />
                      <Row label="IRPF (Base Unificada)" value={-result.discountIr} highlight />

                      {result.noticeDeduction > 0 && <Row label="Desconto Aviso Prévio" value={-result.noticeDeduction} />}
                      {result.thirteenthAdvanceDeduction > 0 && <Row label="Adiantamento 13º" value={-result.thirteenthAdvanceDeduction} />}
                      {result.consignedDiscount > 0 && <Row label="Empréstimo Consignado" value={-result.consignedDiscount} highlight />}

                      <div className="border-t border-slate-100 my-3"></div>
                      <div className="flex justify-between font-bold text-lg text-slate-700">
                        <span>Total Proventos</span>
                        <span className="text-emerald-600">{formatCurrency(result.totalGross)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg text-slate-700">
                        <span>Total Descontos</span>
                        <span className="text-red-600">{formatCurrency(result.totalDiscounts + result.consignedDiscount)}</span>
                      </div>
                  </div>

                  {/* FLUXO DE QUITAÇÃO DE CONSIGNADO */}
                  {result.consignedDiscount > 0 && (
                      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mt-4 space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-indigo-600 text-white p-1 rounded"><BankIcon /></div>
                          <h5 className="text-sm font-bold text-indigo-800 uppercase">Fluxo de Quitação do Empréstimo</h5>
                        </div>

                        <div className="space-y-2 text-xs md:text-sm text-indigo-900">
                          <div className="flex justify-between border-b border-indigo-200 pb-1">
                              <span>Dívida Inicial Declarada:</span>
                              <strong>{formatCurrency(result.remainingLoanBalance + result.consignedDiscount + result.totalFgtsDeduction)}</strong>
                          </div>

                          <Row label="1. Abatido na Rescisão (TRCT 35%)" value={-result.consignedDiscount} />

                          {result.totalFgtsDeduction > 0 && (
                              <div className="bg-white/60 p-2 rounded border border-indigo-200 mt-2">
                                <p className="text-[10px] font-bold text-indigo-500 uppercase mb-1">Garantia FGTS Executada</p>
                                {result.warrantyUsed > 0 && <Row label="(-) Uso da Garantia (10%)" value={-result.warrantyUsed} />}
                                {result.fineUsed > 0 && <Row label="(-) Uso da Multa (40%)" value={-result.fineUsed} />}
                              </div>
                          )}

                          <div className="flex justify-between font-bold text-indigo-700 bg-indigo-100 p-2 rounded mt-2">
                              <span>Saldo Devedor Restante:</span>
                              <span>{formatCurrency(result.remainingLoanBalance)}</span>
                          </div>
                          {result.remainingLoanBalance > 0 && (
                            <p className="text-[10px] text-red-500 text-right mt-1">*O valor restante deverá ser renegociado com o banco.</p>
                          )}
                        </div>
                      </div>
                  )}

                  {/* NOVO DETALHAMENTO FGTS */}
                  <div className="bg-[#ecfdf5] p-6 rounded-2xl border border-emerald-200 mt-6 shadow-sm relative overflow-hidden">
                      <div className="absolute -right-6 -top-6 text-emerald-100 opacity-50 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M2 9h20v13H2V9zm2 2v9h16v-9H4zm14-5v2H6V6h12zM8 3v2h8V3H8z"/></svg>
                      </div>

                      <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4 border-b border-emerald-200/60 pb-3">
                          <div className="flex items-center gap-2">
                              <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                              </div>
                              <h5 className="font-bold text-emerald-800 text-sm md:text-base">Detalhamento FGTS</h5>
                          </div>
                          {data.consigned.fgtsBalance > 0 ? (
                              <span className="text-[10px] bg-white text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-100 shadow-sm">Base: Informado</span>
                          ) : (
                              <span className="text-[10px] bg-white text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-100 shadow-sm">Base: Estimado</span>
                          )}
                        </div>

                        <div className="space-y-2 text-sm text-emerald-900">
                          <Row label="Saldo de Depósitos" value={result.estimatedFgtsBalance} />
                          <Row label="Multa Rescisória (40%)" value={result.fgtsFine} />

                          <div className="border-t border-emerald-200/60 my-2"></div>

                          <div className="flex justify-between items-center">
                              <span className="text-emerald-700 font-medium">Total Bruto</span>
                              <span className="font-bold text-emerald-900 text-lg">{formatCurrency(result.totalFgts)}</span>
                          </div>

                          {result.totalFgtsDeduction > 0 && (
                              <div className="bg-red-50/80 p-3 rounded-lg border border-red-100 mt-2 backdrop-blur-sm">
                                <div className="flex justify-between text-red-600 font-medium text-xs md:text-sm">
                                    <span>(-) Amortização Empréstimo</span>
                                    <span>{formatCurrency(-result.totalFgtsDeduction)}</span>
                                </div>
                              </div>
                          )}
                        </div>
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
                <AIAdvisor context={aiContext} />
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

export default TerminationView;
