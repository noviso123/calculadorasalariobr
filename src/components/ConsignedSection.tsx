
import React from 'react';
import { ConsignedInput } from '../types';

interface Props {
  isActive: boolean;
  onToggle: (v: boolean) => void;
  data: ConsignedInput;
  onChange: (d: ConsignedInput) => void;
  isTermination?: boolean;
}

const ConsignedSection: React.FC<Props> = React.memo(({ isActive, onToggle, data, onChange, isTermination = false }) => {
  return (
    <div className={`rounded-xl border transition-all ${isActive ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
      <label className="flex items-center gap-3 p-4 cursor-pointer select-none">
        <input type="checkbox" checked={isActive} onChange={(e) => onToggle(e.target.checked)} className="h-5 w-5 accent-indigo-600 rounded" />
        <span className="text-sm font-semibold text-slate-700">Incluir Empréstimo Consignado</span>
      </label>

      {isActive && (
        <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in border-t border-indigo-100/50 mt-2 pt-4">

          <div className="col-span-1">
             <label className="block text-[10px] font-bold text-indigo-700 mb-1 uppercase">Valor da Parcela Mensal</label>
             <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-indigo-400 font-bold text-xs">R$</span>
                <input
                  type="number"
                  value={data.monthlyInstallment || ''}
                  onChange={e => onChange({...data, monthlyInstallment: Number(e.target.value)})}
                  className="w-full p-2 pl-7 text-sm rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                  placeholder="0,00"
                />
             </div>
          </div>

          <div className="col-span-1">
             <label className="block text-[10px] font-bold text-indigo-700 mb-1 uppercase">Saldo Devedor Total</label>
             <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-indigo-400 font-bold text-xs">R$</span>
                <input
                  type="number"
                  value={data.outstandingBalance || ''}
                  onChange={e => onChange({...data, outstandingBalance: Number(e.target.value)})}
                  className="w-full p-2 pl-7 text-sm rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                  placeholder="0,00"
                />
             </div>
             {isTermination && <p className="text-[9px] text-indigo-500 mt-1">*Essencial para cálculo de rescisão</p>}
          </div>

          {isTermination && (
             <>
               <div className="col-span-1 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={data.hasFgtsWarranty} onChange={(e) => onChange({...data, hasFgtsWarranty: e.target.checked})} className="h-4 w-4 accent-indigo-600 rounded" />
                    <span className="text-xs font-bold text-indigo-800">Possui Garantia de FGTS Contratada?</span>
                  </label>
               </div>

               {data.hasFgtsWarranty && (
                 <div className="col-span-1 sm:col-span-2 bg-white/60 p-3 rounded-lg border border-indigo-200">
                    <label className="block text-[10px] font-bold text-indigo-700 mb-1 uppercase">Saldo TOTAL Atual do FGTS (Para cálculo de garantia)</label>
                    <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-indigo-400 font-bold text-xs">R$</span>
                        <input
                          type="number"
                          value={data.fgtsBalance || ''}
                          onChange={e => onChange({...data, fgtsBalance: Number(e.target.value)})}
                          className="w-full p-2 pl-7 text-sm rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none placeholder:text-indigo-300"
                          placeholder="Deixe vazio para usar o cálculo automático"
                        />
                    </div>
                    <p className="text-[9px] text-indigo-500 mt-1">
                      (Se deixado em branco, usaremos o saldo estimado do tempo de casa automaticamente)
                    </p>
                 </div>
               )}
             </>
          )}

          <div className="col-span-1 sm:col-span-2">
             <p className="text-[10px] text-indigo-500 italic">
               O desconto mensal é limitado a 35% da renda. Na rescisão, a garantia (10%) e multa (40%) podem ser usadas para quitação dependendo do tipo de demissão.
             </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default ConsignedSection;
