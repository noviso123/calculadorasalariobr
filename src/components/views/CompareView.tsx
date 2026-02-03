import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { InputGroup } from '../Shared';
import { calculateSalary, calculatePjTax } from '../../services/taxService';
import { SalaryInput, CalculationResult, PjInput, PjResult, PjRegime } from '../../types';

const CompareView: React.FC = () => {
  // Estado CLT
  const [cltData, setCltData] = useState<SalaryInput>({
    grossSalary: 0, dependents: 0, includeDependents: false, otherDiscounts: 0, healthInsurance: 0,
    transportVoucherPercent: 6, includeTransportVoucher: false, includeExtras: false,
    extras: {workload:220, hours50:0, hours100:0, hoursNight:0, hoursStandby:0, hoursInterjornada:0, includeDsr:false},
    includeConsigned: false, consigned: {monthlyInstallment:0, outstandingBalance:0, hasFgtsWarranty:false, fgtsBalance:0}
  });

  // Estado PJ
  const [pjData, setPjData] = useState<PjInput>({
    grossMonthly: 0,
    regime: 'simples_nacional_3',
    accountantCost: 300,
  });

  const [resultClt, setResultClt] = useState<CalculationResult | null>(null);
  const [resultPj, setResultPj] = useState<PjResult | null>(null);

  // Real-time calculation
  React.useEffect(() => {
    if (cltData.grossSalary > 0 && pjData.grossMonthly > 0) {
        const resClt = calculateSalary(cltData);
        setResultClt(resClt);
        const resPj = calculatePjTax(pjData);
        setResultPj(resPj);
    } else {
        setResultClt(null);
        setResultPj(null);
    }
  }, [cltData, pjData]);

  const handleCalc = (e: React.FormEvent) => { e.preventDefault(); };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="w-full max-w-7xl mx-auto pb-24">
       <Helmet>
        <title>Comparador CLT x PJ 2026 - Mensal vs Mensal</title>
      </Helmet>

      <header className="mb-8 md:mb-12">
        <h2 className="text-3xl font-bold text-slate-800 text-center md:text-left">Comparador CLT vs PJ</h2>
        <p className="text-slate-500 text-center md:text-left text-lg">Qual o seu rendimento real **mensal** em cada regime?</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* LADO ESQUERDO: INPUTS */}
        <section className="w-full lg:w-4/12 glass-card p-6 md:p-8 rounded-3xl animate-fade-in-up relative z-10 transition-all">
            <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">Configurações</h3>

            <form onSubmit={handleCalc} className="space-y-6">
                {/* BLOCO CLT */}
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-inner">
                    <h4 className="text-xs font-bold text-blue-700 uppercase mb-4 tracking-tighter">Opção A: CLT (Carteira Assinada)</h4>
                    <InputGroup label="Salário Bruto Mensal" value={cltData.grossSalary} onChange={v => setCltData({...cltData, grossSalary: Number(v)})} required />
                    <div className="mt-4">
                         <InputGroup label="Benefícios (VR/VA/Auxílio)" value={cltData.otherDiscounts} onChange={v => setCltData({...cltData, otherDiscounts: Number(v)})} placeholder="Ex: 1000" />
                    </div>
                </div>

                {/* BLOCO PJ */}
                <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 shadow-inner">
                    <h4 className="text-xs font-bold text-indigo-700 uppercase mb-4 tracking-tighter">Opção B: PJ (Empresa)</h4>
                    <InputGroup label="Faturamento Bruto Mensal" value={pjData.grossMonthly} onChange={v => setPjData({...pjData, grossMonthly: Number(v)})} required />

                    <div className="mt-4 space-y-4">
                        <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Regime Tributário</label>
                             <select
                                value={pjData.regime}
                                onChange={e => setPjData({...pjData, regime: e.target.value as PjRegime})}
                                className="w-full px-4 py-3 rounded-2xl bg-white border border-indigo-200 outline-none focus:ring-2 ring-indigo-500/20 font-bold text-slate-700 transition-all text-sm"
                             >
                                <option value="mei">MEI (Ideal até R$ 6.750/mês)</option>
                                <option value="simples_nacional_3">Simples Nacional (III - TI/Serviços)</option>
                                <option value="simples_nacional_5">Simples Nacional (V - Sem Fator R)</option>
                                <option value="lucro_presumido">Lucro Presumido</option>
                             </select>
                        </div>
                        <InputGroup label="Custo Contador (Mensal)" value={pjData.accountantCost} onChange={v => setPjData({...pjData, accountantCost: Number(v)})} />
                    </div>
                </div>
            </form>
        </section>

        {/* LADO DIREITO: ANALISE MENSAL DETALHADA */}
        <section className="w-full lg:w-8/12 relative z-10">
            {resultClt && resultPj ? (
             <div className="animate-fade-in-up space-y-6">

                {/* ANALISE DE IMPACTO MENSAL MÉDIO */}
                <div className="bg-white p-1 rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                    <div className="bg-slate-800 text-white p-5 flex justify-between items-center">
                         <div>
                            <h4 className="text-lg font-bold">Rendimento Líquido Mensal</h4>
                            <p className="text-xs opacity-60">Considerando provisões de 13º, Férias e FGTS</p>
                         </div>
                         <div className="text-right">
                             <span className="text-xs uppercase font-medium opacity-50 block">Diferença Mensal</span>
                             <span className={`text-2xl font-black ${ (resultPj.net) > (resultClt.finalNetSalary + resultClt.otherDiscounts + (resultClt.finalNetSalary/12) + (resultClt.grossSalary/3/12) + resultClt.fgtsMonthly) ? 'text-emerald-400' : 'text-blue-400'}`}>
                                {formatCurrency(Math.abs((resultPj.net) - (resultClt.finalNetSalary + resultClt.otherDiscounts + (resultClt.finalNetSalary/12) + (resultClt.grossSalary/3/12) + resultClt.fgtsMonthly)))}
                             </span>
                         </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100">
                                    <th className="px-6 py-4 text-left">Item / Provento</th>
                                    <th className="px-6 py-4 text-center">CLT (Média Mensal)</th>
                                    <th className="px-6 py-4 text-center">PJ (Líquido Mensal)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                <tr>
                                    <td className="px-6 py-4">Salário Líquido / Nota Fiscal (- Impostos)</td>
                                    <td className="px-6 py-4 text-center">{formatCurrency(resultClt.finalNetSalary)}</td>
                                    <td className="px-6 py-4 text-center">{formatCurrency(resultPj.net)}</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4">Benefícios (VR/VA/Auxílios)</td>
                                    <td className="px-6 py-4 text-center">{formatCurrency(resultClt.otherDiscounts)}</td>
                                    <td className="px-6 py-4 text-center">—</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4">Provisão Mensal 13º (Salário / 12)</td>
                                    <td className="px-6 py-4 text-center text-blue-600">+{formatCurrency(resultClt.finalNetSalary / 12)}</td>
                                    <td className="px-6 py-4 text-center">—</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4">Provisão Mensal Férias (+1/3 / 12)</td>
                                    <td className="px-6 py-4 text-center text-blue-600">+{formatCurrency((resultClt.grossSalary / 3) / 12)}</td>
                                    <td className="px-6 py-4 text-center font-normal italic opacity-50">—</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4">Depósito FGTS (8% Mensal)</td>
                                    <td className="px-6 py-4 text-center text-emerald-600 font-bold">+{formatCurrency(resultClt.fgtsMonthly)}</td>
                                    <td className="px-6 py-4 text-center">—</td>
                                </tr>
                                <tr className="bg-slate-50 font-black text-lg text-slate-900	">
                                    <td className="px-6 py-5">Rendimento Real Mensal</td>
                                    <td className="px-6 py-5 text-center text-blue-700">
                                        {formatCurrency(resultClt.finalNetSalary + resultClt.otherDiscounts + (resultClt.finalNetSalary / 12) + (resultClt.grossSalary / 3 / 12) + resultClt.fgtsMonthly)}
                                    </td>
                                    <td className="px-6 py-5 text-center text-indigo-700">
                                        {formatCurrency(resultPj.net)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* VEREDITO PERSONALIZADO */}
                {(() => {
                    const cltMonthlyReal = resultClt.finalNetSalary + resultClt.otherDiscounts + (resultClt.finalNetSalary / 12) + (resultClt.grossSalary / 3 / 12) + resultClt.fgtsMonthly;
                    const pjIsBetter = resultPj.net > cltMonthlyReal;
                    const breakEvenMonthly = (cltMonthlyReal + pjData.accountantCost) / (1 - (resultPj.taxRate / 100));

                    return (
                        <div className={`p-8 rounded-3xl border-2 shadow-lg transition-all ${pjIsBetter ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200'}`}>
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className={`h-20 w-20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${pjIsBetter ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}`}>
                                    {pjIsBetter ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
                                    )}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-2xl font-black text-slate-800 mb-2">
                                        {pjIsBetter ? 'O modelo PJ entrega mais dinheiro mensal!' : 'O modelo CLT ainda é mais lucrativo no mês!'}
                                    </h3>
                                    <div className="space-y-4">
                                        <p className="text-slate-600 leading-relaxed">
                                            Considerando todos os direitos (FGTS, 13º, Férias), o CLT equivale a ter
                                            <strong className="text-xl mx-2 text-slate-800 underline decoration-indigo-400 decoration-4 underline-offset-4">{formatCurrency(cltMonthlyReal)}</strong>
                                            disponíveis todo mês.
                                        </p>
                                        <div className="p-4 bg-white/60 rounded-2xl border border-slate-200">
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Para valer a pena mudar:</p>
                                            <p className="text-slate-700">
                                                Deveria pedir um faturamento PJ de no mínimo
                                                <strong className="text-indigo-600 ml-1">{formatCurrency(breakEvenMonthly)}</strong>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

             </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-20"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                    <p className="font-bold text-lg">Aguardando dados para análise...</p>
                    <p className="text-sm">Insira os valores mensais para comparar os regimes.</p>
                </div>
            )}
        </section>
      </div>
    </div>
  );
};

export default CompareView;
