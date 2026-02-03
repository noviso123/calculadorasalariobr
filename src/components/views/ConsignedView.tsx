
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { calculateSalary } from '../../services/taxService';
import { InputGroup } from '../Shared';

const ConsignedView: React.FC = () => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [grossSalary, setGrossSalary] = useState(0);
  const [result, setResult] = useState<{margin: number, maxInstallment: number} | null>(null);

  // Real-time calculation
  React.useEffect(() => {
    if (grossSalary > 0) {
      // Simula cálculo de salário básico para obter a margem
      const simResult = calculateSalary({
        grossSalary,
        includeDependents: false, dependents: 0, otherDiscounts: 0, healthInsurance: 0, transportVoucherPercent: 0, includeTransportVoucher: false,
        includeExtras: false, extras: { workload: 220, hours50: 0, hours100: 0, hoursNight: 0, hoursStandby: 0, hoursInterjornada: 0, includeDsr: false },
        includeConsigned: true, consigned: { monthlyInstallment: 9999999, outstandingBalance: 0, hasFgtsWarranty: false, fgtsBalance: 0 } // Força o cálculo da margem máxima
      });
      setResult({
        margin: simResult.maxConsignableMargin,
        maxInstallment: simResult.maxConsignableMargin
      });
    } else {
        setResult(null);
    }
  }, [grossSalary]);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
   <div className="max-w-4xl mx-auto animate-fade-in space-y-6 md:space-y-8">
     <Helmet>
        <title>Simulador Margem Consignável 2026 - Cálculo Exato</title>
        <meta name="description" content="Descubra sua margem consignável (35% da renda líquida) de acordo com a regra de 2026. Evite endividamento excessivo." />
        <link rel="canonical" href="https://calculadorasalario2026.com.br/consignado" />
     </Helmet>
     <header>
       <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Simulador de Margem Consignável</h2>
       <p className="text-slate-500 text-sm md:text-base mt-1">Descubra quanto você pode comprometer do seu salário.</p>
     </header>

     <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleCalc} className="space-y-6">
           <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
             <p className="text-indigo-800 text-sm mb-4">
               A legislação permite comprometer até <strong>35% da renda líquida</strong> com empréstimo consignado.
               Este simulador calcula sua margem baseada nas regras de 2026.
             </p>
             <InputGroup label="Seu Salário Bruto" value={grossSalary} onChange={(v) => setGrossSalary(Number(v))} required />
           </div>
           <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-lg">Calcular Margem</button>
        </form>

        {result && (
           <div ref={resultsRef} className="mt-8 space-y-6 animate-fade-in scroll-mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Margem Disponível (Mensal)</p>
                    <p className="text-3xl font-extrabold mt-2">{formatCurrency(result.margin)}</p>
                    <p className="text-xs text-indigo-200 mt-2">Valor máximo da parcela</p>
                 </div>
                 <div className="bg-white border-2 border-slate-100 p-6 rounded-2xl">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Renda Líquida Base</p>
                    <p className="text-2xl font-bold text-slate-700 mt-2">{formatCurrency(result.margin / 0.35)}</p>
                    <p className="text-xs text-slate-400 mt-2">Base de cálculo (Bruto - Impostos)</p>
                 </div>
              </div>
           </div>
        )}
     </div>
   </div>
  );
};

export default ConsignedView;
