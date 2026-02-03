import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { InputGroup, ResultCard } from '../Shared';
import { calculateSalary } from '../../services/taxService';
import { SalaryInput, CalculationResult } from '../../types';

// Tipos locais para comparação
interface PjInput {
  grossMonthly: number;
  taxRate: number; // Simples Nacional (ex: 6%, 15.5%)
  accountantCost: number; // Contador
}

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
    taxRate: 6, // Padrão Anexo III TI Fator R ideal
    accountantCost: 300,
  });

  const [resultClt, setResultClt] = useState<CalculationResult | null>(null);
  const [resultPj, setResultPj] = useState<{net: number, totalTax: number} | null>(null);

  // Real-time calculation
  React.useEffect(() => {
    if (cltData.grossSalary > 0 && pjData.grossMonthly > 0) {
        // Calcular CLT
        const resClt = calculateSalary(cltData);
        setResultClt(resClt);

        // Calcular PJ (Simples)
        const taxPj = pjData.grossMonthly * (pjData.taxRate / 100);
        const netPj = pjData.grossMonthly - taxPj - pjData.accountantCost;

        setResultPj({
            net: netPj,
            totalTax: taxPj
        });
    } else {
        setResultClt(null);
        setResultPj(null);
    }
  }, [cltData, pjData]);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    // Scroll logic if needed
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="w-full max-w-6xl mx-auto pb-24">
       <Helmet>
        <title>Comparador CLT x PJ 2026</title>
      </Helmet>

      <header className="mb-8 md:mb-12">
        <h2 className="text-3xl font-bold text-slate-800">Comparador CLT vs PJ</h2>
        <p className="text-slate-500">Descubra qual regime compensa mais para o seu bolso.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* LADO ESQUERDO: INPUTS */}
        <section className="w-full lg:w-5/12 glass-card p-6 md:p-8 rounded-3xl animate-fade-in-up relative z-10 transition-all">
            <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">IN</span>
                Dados de Entrada
            </h3>

            <form onSubmit={handleCalc} className="space-y-6">
                {/* BLOCO CLT */}
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-700 uppercase mb-3">Opção A: CLT (Carteira Assinada)</h4>
                    <InputGroup label="Salário Bruto Mensal" value={cltData.grossSalary} onChange={v => setCltData({...cltData, grossSalary: Number(v)})} required />
                    <div className="mt-3">
                         <InputGroup label="Outros Benefícios (VR/VA)" value={cltData.otherDiscounts} onChange={v => setCltData({...cltData, otherDiscounts: Number(v)})} placeholder="Ex: R$ 800,00 (Somar ao Líquido)" />
                         <p className="text-[10px] text-blue-400 mt-1">* Insira aqui o valor de benefícios (VR, VA) para somar ao líquido estimado.</p>
                    </div>
                </div>

                {/* BLOCO PJ */}
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                    <h4 className="text-sm font-bold text-indigo-700 uppercase mb-3">Opção B: PJ (Prestador de Serviço)</h4>
                    <InputGroup label="Faturamento Bruto Mensal" value={pjData.grossMonthly} onChange={v => setPjData({...pjData, grossMonthly: Number(v)})} required />

                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Imposto Simples (%)</label>
                             <input type="number" value={pjData.taxRate} onChange={e => setPjData({...pjData, taxRate: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-2xl glass-input outline-none font-bold text-slate-700" />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Contador (R$)</label>
                             <input type="number" value={pjData.accountantCost} onChange={e => setPjData({...pjData, accountantCost: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-2xl glass-input outline-none font-bold text-slate-700" />
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98]">
                    Comparar Cenários
                </button>
            </form>
        </section>

        {/* LADO DIREITO: RESULTADOS */}
        <section className="w-full lg:w-7/12 relative z-10">
            {resultClt && resultPj && (
             <div className="animate-fade-in-up space-y-6">

                {/* VERSUS CARD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CARD CLT */}
                    <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-lg relative overflow-hidden group hover:border-blue-300 transition-colors">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
                        <h4 className="text-blue-600 font-bold text-lg mb-1">CLT Líquido</h4>
                        <p className="text-xs text-slate-400 mb-4">Salário + Benefícios</p>

                        <p className="text-3xl font-black text-slate-800 mb-2">{formatCurrency(resultClt.finalNetSalary + resultClt.otherDiscounts)}</p>

                        <div className="space-y-1 text-xs text-slate-500">
                             <div className="flex justify-between"><span>Bruto:</span> <span>{formatCurrency(resultClt.grossSalary)}</span></div>
                             <div className="flex justify-between text-red-500"><span>Descontos:</span> <span>-{formatCurrency(resultClt.totalDiscounts)}</span></div>
                             <div className="flex justify-between text-emerald-600 font-bold"><span>FGTS (Depósito):</span> <span>+{formatCurrency(resultClt.fgtsMonthly)}</span></div>
                        </div>
                    </div>

                    {/* CARD PJ */}
                    <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-lg relative overflow-hidden group hover:border-indigo-300 transition-colors">
                         <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500"></div>
                         <h4 className="text-indigo-600 font-bold text-lg mb-1">PJ Líquido</h4>
                         <p className="text-xs text-slate-400 mb-4">Faturamento - Impostos</p>

                         <p className="text-3xl font-black text-slate-800 mb-2">{formatCurrency(resultPj.net)}</p>

                         <div className="space-y-1 text-xs text-slate-500">
                             <div className="flex justify-between"><span>Faturamento:</span> <span>{formatCurrency(pjData.grossMonthly)}</span></div>
                             <div className="flex justify-between text-red-500"><span>Imposto ({pjData.taxRate}%):</span> <span>-{formatCurrency(resultPj.totalTax)}</span></div>
                             <div className="flex justify-between text-red-400"><span>Contador:</span> <span>-{formatCurrency(pjData.accountantCost)}</span></div>
                        </div>
                    </div>
                </div>

                {/* RESULTADO FINAL (VENCEDOR) */}
                <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6">
                    <div className={`p-4 rounded-full ${resultPj.net > (resultClt.finalNetSalary + resultClt.otherDiscounts) ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800">
                            {resultPj.net > (resultClt.finalNetSalary + resultClt.otherDiscounts) ? 'PJ Compensa Mais' : 'CLT Compensa Mais'}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                             A diferença líquida mensal é de <strong className="text-emerald-600">{formatCurrency(Math.abs(resultPj.net - (resultClt.finalNetSalary + resultClt.otherDiscounts)))}</strong>.
                             {resultPj.net > (resultClt.finalNetSalary + resultClt.otherDiscounts) ? ' Lembre-se que PJ não tem 13º, Férias remuneradas ou FGTS (a menos que negociado).' : ' CLT oferece maior segurança com FGTS, Férias e 13º garantidos.'}
                        </p>
                    </div>
                </div>

             </div>
            )}
        </section>
      </div>
    </div>
  );
};

export default CompareView;
