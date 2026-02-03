import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TrendingUp, ShieldCheck, Download, Info } from 'lucide-react';
import { InputGroup } from '../Shared';
import { calculateSalary, calculatePjTax, calculateEmployerCost } from '../../services/taxService';
import { SalaryInput, CalculationResult, PjInput, PjResult, PjRegime, ComparisonChartData } from '../../types';

const CompareView: React.FC = () => {
  // ... existing states ...
  const [cltData, setCltData] = useState<SalaryInput>({
    grossSalary: 0, dependents: 0, includeDependents: false, otherDiscounts: 0, healthInsurance: 0,
    transportVoucherPercent: 6, includeTransportVoucher: false, includeExtras: false,
    extras: {workload:220, hours50:0, hours100:0, hoursNight:0, hoursStandby:0, hoursInterjornada:0, includeDsr:false},
    includeConsigned: false, consigned: {monthlyInstallment:0, outstandingBalance:0, hasFgtsWarranty:false, fgtsBalance:0}
  });

  const [pjData, setPjData] = useState<PjInput>({
    grossMonthly: 0,
    regime: 'simples_nacional_3',
    accountantCost: 300,
    otherMonthlyExpenses: 0,
    vacationDaysTarget: 30,
  });

  const [resultClt, setResultClt] = useState<CalculationResult | null>(null);
  const [resultPj, setResultPj] = useState<PjResult | null>(null);
  const [showAnnual, setShowAnnual] = useState(false);

  // Generate Chart Data
  const chartData = useMemo<ComparisonChartData[]>(() => {
    if (!resultClt || !resultPj) return [];

    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    let cltAcc = 0;
    let pjAcc = 0;

    const monthlyClt = resultClt.finalNetSalary + resultClt.fgtsMonthly;

    return months.map((month, index) => {
        pjAcc += resultPj.monthlyAverageReal;

        // Simulação CLT: Adiciona 13o em Nov/Dez e Férias 1/3 em algum ponto
        cltAcc += monthlyClt;
        if (index === 10) cltAcc += (resultClt.finalNetSalary / 2); // 1a parcela 13o
        if (index === 11) cltAcc += (resultClt.finalNetSalary / 2); // 2a parcela 13o
        if (index === 6) cltAcc += (resultClt.grossSalary / 3); // Simulação Férias 1/3

        return {
            month,
            cltCumulative: Math.round(cltAcc),
            pjCumulative: Math.round(pjAcc)
        };
    });
  }, [resultClt, resultPj]);

  const employerCost = useMemo(() => {
    if (cltData.grossSalary <= 0) return null;
    return calculateEmployerCost(cltData.grossSalary);
  }, [cltData.grossSalary]);

  const handleExportPDF = () => {
    if (!resultClt || !resultPj) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Relatório Comparativo CLT vs PJ 2026', 20, 20);
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);

    const tableData = [
        ['Item', 'CLT (Mensal)', 'PJ (Mensal)'],
        ['Bruto', formatCurrency(cltData.grossSalary), formatCurrency(pjData.grossMonthly)],
        ['Líquido Real', formatCurrency(resultClt.finalNetSalary), formatCurrency(resultPj.netMonthly)],
        ['Benefícios/Extras', formatCurrency(resultClt.fgtsMonthly + resultClt.otherDiscounts), 'R$ 0,00'],
        ['Anual Acumulado', formatCurrency(resultClt.finalNetSalary * 13.33), formatCurrency(resultPj.annualNet)]
    ];

    autoTable(doc, { head: [tableData[0]], body: tableData.slice(1), startY: 40 });
    doc.save(`comparativo_clt_pj_${cltData.grossSalary}.pdf`);
  };

  const handleCalc = (e: React.FormEvent) => { e.preventDefault(); };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

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

  return (
    <div className="w-full max-w-7xl mx-auto pb-24">
       <Helmet>
        <title>Comparador CLT x PJ 2026 | Cálculo Anual Completo</title>
        <meta name="description" content="Descubra qual regime vale mais a pena em 2026. Comparação real entre CLT e PJ (MEI/Simples), incluindo 13º, férias, FGTS e impostos corporativos." />
      </Helmet>

      <header className="mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">CLT vs <span className="text-indigo-600">PJ 2026</span></h2>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-3">
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed">Simulação comparativa profunda considerando faturamento, impostos e benefícios anuais.</p>

            {/* Toggle Anual/Mensal */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-inner">
                <button
                  onClick={() => setShowAnnual(false)}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${!showAnnual ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setShowAnnual(true)}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${showAnnual ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Anual
                </button>
            </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* LADO ESQUERDO: INPUTS */}
        <section className="w-full lg:w-4/12 glass-card p-6 md:p-8 rounded-3xl animate-fade-in-up relative z-10 transition-all border-none shadow-2xl">
            <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">Configurar Valores</h3>

            <form onSubmit={handleCalc} className="space-y-6">
                {/* BLOCO CLT */}
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-inner">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <h4 className="text-xs font-black text-blue-700 uppercase tracking-widest">Opção CLT</h4>
                    </div>
                    <InputGroup label="Salário Bruto Mensal" value={cltData.grossSalary} onChange={v => setCltData({...cltData, grossSalary: Number(v)})} required />
                    <div className="mt-4">
                         <InputGroup label="Benefícios (Vale Refeição/Alimentação/Outros)" value={cltData.otherDiscounts} onChange={v => setCltData({...cltData, otherDiscounts: Number(v)})} placeholder="Ex: 1200" isSmall />
                    </div>
                </div>

                {/* BLOCO PJ */}
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 shadow-inner">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                        <h4 className="text-xs font-black text-indigo-700 uppercase tracking-widest">Opção PJ</h4>
                    </div>
                    <InputGroup label="Faturamento Mensal (NF)" value={pjData.grossMonthly} onChange={v => setPjData({...pjData, grossMonthly: Number(v)})} required />

                    <div className="mt-6 space-y-5">
                        <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Regime Tributário 2026</label>
                             <select
                                value={pjData.regime}
                                onChange={e => setPjData({...pjData, regime: e.target.value as PjRegime})}
                                className="w-full px-4 py-3.5 rounded-2xl bg-white border border-indigo-100 outline-none focus:ring-2 ring-indigo-500/20 font-bold text-slate-700 transition-all text-sm shadow-sm"
                             >
                                <option value="mei">MEI (Até R$ 6.750/mês)</option>
                                <option value="simples_nacional_3">Simples Nacional (III - Serviços/TI)</option>
                                <option value="simples_nacional_5">Simples Nacional (V - Sem Fator R)</option>
                                <option value="lucro_presumido">Lucro Presumido</option>
                             </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputGroup label="Contador (Mensal)" value={pjData.accountantCost} onChange={v => setPjData({...pjData, accountantCost: Number(v)})} isSmall />
                            <InputGroup label="Outros Gastos (Mensal)" value={pjData.otherMonthlyExpenses} onChange={v => setPjData({...pjData, otherMonthlyExpenses: Number(v)})} placeholder="Ex: Saúde, Impostos" isSmall />
                        </div>

                        <div className="pt-2">
                             <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Dias Sem Faturar (Férias/Ano)</label>
                             <input
                                type="range" min="0" max="45" step="5"
                                value={pjData.vacationDaysTarget}
                                onChange={v => setPjData({...pjData, vacationDaysTarget: Number(v.target.value)})}
                                className="w-full accent-indigo-600"
                             />
                             <div className="flex justify-between text-[10px] font-bold text-slate-500 px-1 mt-1">
                                <span>Sem Parar</span>
                                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{pjData.vacationDaysTarget} dias</span>
                             </div>
                        </div>
                    </div>
                </div>
            </form>
        </section>

        {/* LADO DIREITO: DASHBOARD DE COMPARAÇÃO */}
        <section className="w-full lg:w-8/12 relative z-10">
            {resultClt && resultPj ? (
             <div className="animate-fade-in-up space-y-8">

                {/* DASHBOARD DE RESUMO RÁPIDO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* CARD CLT */}
                    <div className="bg-white p-7 rounded-[2rem] border border-blue-100 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:bg-blue-100 transition-colors"></div>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] block mb-2 relative">Equivalente Real CLT</span>
                        <div className="flex items-baseline gap-1 relative">
                            <span className="text-3xl font-black text-slate-800">
                                {formatCurrency(showAnnual
                                  ? (resultClt.finalNetSalary * 13.33) + (resultClt.otherDiscounts * 12) + (resultClt.fgtsMonthly * 12)
                                  : resultClt.finalNetSalary + resultClt.otherDiscounts + (resultClt.finalNetSalary / 12) + (resultClt.grossSalary / 3 / 12) + resultClt.fgtsMonthly
                                )}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-4 leading-relaxed font-bold uppercase tracking-tighter">
                            {showAnnual ? 'Total Acumulado em 1 Ano' : 'Impacto Financeiro Mensal'}
                        </p>
                    </div>

                    {/* CARD PJ */}
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-7 rounded-[2rem] shadow-xl shadow-indigo-500/20 relative overflow-hidden group hover:scale-[1.02] transition-all text-white">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:bg-white/20 transition-colors"></div>
                        <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] block mb-2 relative">PJ Líquido Real</span>
                        <div className="flex items-baseline gap-1 relative">
                            <span className="text-3xl font-black">
                                {formatCurrency(showAnnual ? resultPj.annualNet : resultPj.monthlyAverageReal)}
                            </span>
                        </div>
                        <p className="text-[10px] text-indigo-200/70 mt-4 leading-relaxed font-bold uppercase tracking-tighter">
                            {showAnnual ? 'Líquido de Impostos e Despesas' : 'Média Mensal (Com Férias)'}
                        </p>
                    </div>

                    {/* CARD DIFERENÇA */}
                    {(() => {
                        const cltValue = showAnnual
                          ? (resultClt.finalNetSalary * 13.33) + (resultClt.otherDiscounts * 12) + (resultClt.fgtsMonthly * 12)
                          : resultClt.finalNetSalary + resultClt.otherDiscounts + (resultClt.finalNetSalary / 12) + (resultClt.grossSalary / 3 / 12) + resultClt.fgtsMonthly;
                        const pjValue = showAnnual ? resultPj.annualNet : resultPj.monthlyAverageReal;
                        const diff = pjValue - cltValue;
                        const pjIsBetter = diff > 0;

                        return (
                            <div className={`p-7 rounded-[2rem] border shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all ${pjIsBetter ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2">Vantagem {pjIsBetter ? 'PJ' : 'CLT'}</span>
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-3xl font-black ${pjIsBetter ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {formatCurrency(Math.abs(diff))}
                                    </span>
                                </div>
                                <p className={`text-[10px] mt-4 font-black uppercase tracking-tighter ${pjIsBetter ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {pjIsBetter ? 'PJ sobra mais no bolso' : 'CLT compensa mais os benefícios'}
                                </p>
                            </div>
                        );
                    })()}
                </div>

                {/* VISUALIZAÇÃO GRÁFICA (NOVO) */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden animate-fade-in">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                             <h4 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <TrendingUp className="text-indigo-500" />
                                Projeção de Acúmulo Anual
                             </h4>
                             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Comparativo de liquidez ao longo de 12 meses</p>
                        </div>
                        <button
                            onClick={handleExportPDF}
                            className="bg-slate-100 p-3 rounded-2xl hover:bg-slate-200 transition-colors text-slate-600 flex items-center gap-2 text-xs font-black uppercase tracking-tighter"
                        >
                            <Download size={16} /> Exportar PDF
                        </button>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorClt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorPj" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} tickFormatter={(v) => `R$ ${v/1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                                    formatter={(v: number) => [formatCurrency(v), '']}
                                />
                                <Legend verticalAlign="top" height={36}/>
                                <Area name="Acumulado CLT" type="monotone" dataKey="cltCumulative" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorClt)" />
                                <Area name="Acumulado PJ" type="monotone" dataKey="pjCumulative" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPj)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PODER DE NEGOCIAÇÃO: CUSTO EMPRESA (NOVO) */}
                {employerCost && (
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl animate-fade-in">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-125"></div>

                         <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                <div>
                                     <span className="bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 flex items-center gap-2 w-fit">
                                         <ShieldCheck size={14} /> Ferramenta de Negociação
                                     </span>
                                     <h3 className="text-3xl font-black mt-4 tracking-tight">Quanto você custa para a Empresa?</h3>
                                     <p className="text-slate-400 mt-2 text-lg">Use estes dados para negociar um valor PJ maior mostrando a economia do patrão.</p>
                                </div>
                                <div className="text-center md:text-right">
                                     <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Custo Anual Total (CLT)</p>
                                     <p className="text-4xl font-black text-indigo-400">{formatCurrency(employerCost.totalCostAnnual)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-colors">
                                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Encargos (INSS/RAT)</p>
                                     <p className="text-xl font-black">{formatCurrency(employerCost.inssPatronal + employerCost.rat + employerCost.terceiros)}</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-colors">
                                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Depósito FGTS</p>
                                     <p className="text-xl font-black">{formatCurrency(employerCost.fgts)}</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-colors">
                                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Provisões (13º/Férias)</p>
                                     <p className="text-xl font-black">{formatCurrency(employerCost.provision13th + employerCost.provisionVacation)}</p>
                                </div>
                                <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-3xl">
                                     <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">Margem de Negociação PJ</p>
                                     <p className="text-xl font-black text-indigo-400">Até {formatCurrency(employerCost.totalCostMonthly)}/mês</p>
                                </div>
                            </div>
                         </div>
                    </div>
                )}

                {/* TABELA COMPARATIVA DETALHADA */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden animate-scale-in">
                    <div className="bg-slate-900 text-white p-6 md:p-8 flex items-center justify-between">
                        <div>
                            <h4 className="text-xl font-black tracking-tight">{showAnnual ? 'Projeção Anual Completa 2026' : 'Composição Média Mensal'}</h4>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Detalhamento Técnico dos Regimes</p>
                        </div>
                        <div className="hidden md:block bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                            <span className="text-[10px] font-bold text-blue-400 mr-2 uppercase">Base:</span>
                            <span className="text-sm font-black underline decoration-blue-500 underline-offset-4">{resultPj.regimeLabel}</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-100">
                                    <th className="px-8 py-5 text-left">Rubrica / Item</th>
                                    <th className="px-8 py-5 text-center bg-blue-50/30 text-blue-600">CLT Total</th>
                                    <th className="px-8 py-5 text-center bg-indigo-50/30 text-indigo-600">PJ Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                                <tr>
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-slate-800">{showAnnual ? 'Faturamento / Salário Bruto' : 'Base Mensal'}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Valor antes de qualquer imposto ou desconto.</p>
                                    </td>
                                    <td className="px-8 py-5 text-center bg-blue-50/10">
                                        {formatCurrency(showAnnual ? (cltData.grossSalary * 13.33) : cltData.grossSalary)}
                                    </td>
                                    <td className="px-8 py-5 text-center bg-indigo-50/10">
                                        {formatCurrency(showAnnual ? (pjData.grossMonthly * ((360 - pjData.vacationDaysTarget)/30)) : pjData.grossMonthly)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-slate-800">Carga Tributária (Impostos)</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">CLT: INSS+IRPF | PJ: DAS/Simples/Irp.</p>
                                    </td>
                                    <td className="px-8 py-5 text-center text-red-500 bg-blue-50/10">
                                        -{formatCurrency(showAnnual ? ((resultClt.inss + resultClt.irpf) * 13.33) : (resultClt.inss + resultClt.irpf))}
                                    </td>
                                    <td className="px-8 py-5 text-center text-red-500 bg-indigo-50/10">
                                        -{formatCurrency(showAnnual ? resultPj.annualTax : resultPj.taxValue)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-slate-800">Gastos Operacionais / Folha</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">CLT: Outros Descontos | PJ: Contador+Outros.</p>
                                    </td>
                                    <td className="px-8 py-5 text-center text-red-500 bg-blue-50/10">
                                        -{formatCurrency(showAnnual ? (resultClt.otherDiscounts * 12) : resultClt.otherDiscounts)}
                                    </td>
                                    <td className="px-8 py-5 text-center text-red-500 bg-indigo-50/10">
                                        -{formatCurrency(showAnnual ? resultPj.annualExpenses : resultPj.totalMonthlyExpenses)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-slate-800">Benefícios & FGTS (Extras)</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Depósitos e benefícios que não entram no líquido.</p>
                                    </td>
                                    <td className="px-8 py-5 text-center text-emerald-600 bg-blue-50/10 font-bold">
                                        +{formatCurrency(showAnnual ? (resultClt.fgtsMonthly * 12) : resultClt.fgtsMonthly)}
                                    </td>
                                    <td className="px-8 py-5 text-center bg-indigo-50/10 opacity-30">—</td>
                                </tr>
                                <tr className="bg-slate-50 font-black text-xl text-slate-900 border-t-2 border-slate-200	">
                                    <td className="px-8 py-8">
                                        <p className="tracking-tight italic">DINHEIRO NO BOLSO <span className="text-xs font-bold text-slate-400 not-italic">(LÍQUIDO FINAL)</span></p>
                                    </td>
                                    <td className="px-8 py-8 text-center text-blue-700 bg-blue-50/20 shadow-inner">
                                        {formatCurrency(showAnnual
                                          ? (resultClt.finalNetSalary * 13.33) + (resultClt.fgtsMonthly * 12)
                                          : resultClt.finalNetSalary + (resultClt.finalNetSalary / 12) + (resultClt.grossSalary / 3 / 12) + resultClt.fgtsMonthly
                                        )}
                                    </td>
                                    <td className="px-8 py-8 text-center text-indigo-700 bg-indigo-50/20 shadow-inner">
                                        {formatCurrency(showAnnual ? resultPj.annualNet : resultPj.monthlyAverageReal)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* VEREDITO & BREAK-EVEN */}
                {(() => {
                    const cltValue = showAnnual
                      ? (resultClt.finalNetSalary * 13.33) + (resultClt.fgtsMonthly * 12)
                      : resultClt.finalNetSalary + (resultClt.finalNetSalary / 12) + (resultClt.grossSalary / 3 / 12) + resultClt.fgtsMonthly;
                    const pjValue = showAnnual ? resultPj.annualNet : resultPj.monthlyAverageReal;
                    const pjIsBetter = pjValue > cltValue;

                    // Break-even: Quanto o PJ mensal precisa ser para igualar o CLT Real
                    // Formula simplificada: (CLT_Real + Despesas_PJ) / (1 - TaxRate)
                    const annualIncomesForPj = (360 - pjData.vacationDaysTarget) / 30;
                    const targetAnnual = cltValue;
                    const estimatedBreakEven = (targetAnnual + resultPj.annualExpenses) / (annualIncomesForPj * (1 - (resultPj.taxRate / 100)));

                    return (
                        <div className={`p-10 rounded-[3rem] border-2 shadow-2xl relative overflow-hidden transition-all ${pjIsBetter ? 'bg-[#f0fdf4] border-emerald-200' : 'bg-blue-50 border-blue-200'}`}>
                            <div className="absolute top-0 right-0 p-8 opacity-10 text-slate-800">
                                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                                <div className={`h-24 w-24 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl animate-bounce-subtle ${pjIsBetter ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>
                                    {pjIsBetter ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                                    )}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">
                                        {pjIsBetter
                                          ? 'A mudança para PJ é Lucrativa!'
                                          : 'Cuidado: O CLT oferece mais proteção!'}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-lg mb-6">
                                        No seu perfil, o modelo {pjIsBetter ? 'PJ' : 'CLT'} deixa <strong className="text-slate-900">{formatCurrency(Math.abs(pjValue - cltValue))}</strong> a mais no seu bolso {showAnnual ? 'por ano' : 'por mês'}.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white/70 p-5 rounded-2xl border border-white shadow-sm">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Ponto de Equilíbrio (Break-even)</p>
                                            <p className="text-slate-700 font-medium">
                                                Para empatar com o CLT, sua Nota Fiscal deve ser de no mínimo:
                                                <strong className="text-indigo-600 text-xl block mt-1 tracking-tighter">{formatCurrency(estimatedBreakEven)} / mês</strong>
                                            </p>
                                        </div>
                                        <div className="bg-white/70 p-5 rounded-2xl border border-white shadow-sm flex items-center gap-4">
                                            <div className="h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase leading-tight">
                                                Lembre-se: PJ não tem Seguro Desemprego nem multa de FGTS. Considere isso no custo.
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
                <div className="flex flex-col items-center justify-center p-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 group">
                    <div className="bg-white p-6 rounded-full shadow-inner mb-6 transition-transform group-hover:scale-110 duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                    </div>
                    <p className="font-black text-xl text-slate-600 tracking-tight">Análise Inteligente Pronta</p>
                    <p className="text-sm mt-2 opacity-60">Preencha o faturamento PJ e o salário CLT para o veredito.</p>
                </div>
            )}
        </section>
      </div>
    </div>
  );
};

export default CompareView;
