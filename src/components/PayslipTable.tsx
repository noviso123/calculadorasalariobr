import React from 'react';

export interface PayslipItem {
  label: string;
  reference?: string;
  value: number;
  type: 'earning' | 'discount' | 'neutral';
  isTotal?: boolean;
}

interface PayslipProps {
  earnings: PayslipItem[];
  discounts: PayslipItem[];
  totalGross: number;
  totalDiscounts: number;
  netValue: number;
  footerNote?: React.ReactNode;
}

const PayslipTable: React.FC<PayslipProps> = React.memo(({ earnings, discounts, totalGross, totalDiscounts, netValue, footerNote }) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-mono text-sm">
      {/* Header Mobile/Desktop */}
      <div className="bg-slate-100 p-3 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
        <span>Demonstrativo de Pagamento</span>
        <span>Ref: 2026</span>
      </div>

      <div className="flex flex-col md:flex-row">

        {/* COLUNA PROVENTOS */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-200">
          <div className="bg-emerald-50/50 p-2 text-center text-emerald-700 font-bold border-b border-emerald-100/50 text-xs uppercase">
            Proventos (Ganhos)
          </div>
          <div className="p-0">
             {earnings.map((item, idx) => (
               <div key={`earn-${idx}`} className={`flex justify-between items-center p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors gap-3 ${item.isTotal ? 'font-bold bg-slate-50' : ''}`}>
                  <div className="flex flex-col min-w-0">
                    <span className="text-slate-700 break-words leading-tight">{item.label}</span>
                    {item.reference && <span className="text-[10px] text-slate-400 mt-0.5">{item.reference}</span>}
                  </div>
                  <span className="text-emerald-700 font-medium whitespace-nowrap shrink-0">{formatCurrency(item.value)}</span>
               </div>
             ))}
             {/* Filler to align heights if needed, or just min-height */}
             {earnings.length === 0 && <div className="p-4 text-center text-slate-300 italic">Sem proventos adicionais</div>}
          </div>
        </div>

        {/* COLUNA DESCONTOS */}
        <div className="flex-1">
          <div className="bg-red-50/50 p-2 text-center text-red-700 font-bold border-b border-red-100/50 text-xs uppercase">
            Descontos
          </div>
          <div className="p-0">
             {discounts.map((item, idx) => (
               <div key={`disc-${idx}`} className="flex justify-between items-center p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors gap-3">
                  <div className="flex flex-col min-w-0">
                    <span className="text-slate-700 break-words leading-tight">{item.label}</span>
                    {item.reference && <span className="text-[10px] text-slate-400 mt-0.5">{item.reference}</span>}
                  </div>
                  <span className="text-red-600 font-medium whitespace-nowrap shrink-0">{formatCurrency(Math.abs(item.value))}</span>
               </div>
             ))}
             {discounts.length === 0 && <div className="p-4 text-center text-slate-300 italic">Sem descontos</div>}
          </div>
        </div>
      </div>

      {/* FOOTER TOTALS */}
      <div className="bg-slate-50 border-t border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
           <div className="flex justify-between items-center md:block md:text-center p-3 rounded border border-slate-200 bg-white">
              <span className="block text-[10px] font-bold text-slate-400 uppercase md:mb-1">Total de Proventos</span>
              <span className="block font-bold text-emerald-700 text-lg">{formatCurrency(totalGross)}</span>
           </div>
           <div className="flex justify-between items-center md:block md:text-center p-3 rounded border border-slate-200 bg-white">
              <span className="block text-[10px] font-bold text-slate-400 uppercase md:mb-1">Total de Descontos</span>
              <span className="block font-bold text-red-600 text-lg">{formatCurrency(totalDiscounts)}</span>
           </div>
           <div className="flex justify-between items-center md:block md:text-center p-3 rounded border border-blue-200 bg-blue-50">
              <span className="block text-[10px] font-bold text-blue-500 uppercase md:mb-1">Valor Líquido</span>
              <span className="block font-bold text-blue-800 text-lg">{formatCurrency(netValue)}</span>
           </div>
        </div>
        {footerNote && <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 text-center">{footerNote}</div>}
      </div>
    </div>
  );
};

export default PayslipTable;
