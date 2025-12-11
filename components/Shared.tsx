
import React from 'react';
import { ExtrasInput, ConsignedInput } from '../types';

// --- INPUT GROUP ---
interface InputGroupProps {
  label: string;
  name?: string;
  value: number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  isSmall?: boolean;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, placeholder, required, isSmall }) => (
  <div className="w-full">
    <label className={`block text-xs font-bold text-slate-500 uppercase mb-1`}>{label}</label>
    <div className="relative group">
      {!isSmall && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none group-focus-within:text-blue-500 transition-colors">R$</span>}
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || '0,00'}
        className={`w-full ${isSmall ? 'px-3 py-2 text-sm' : 'pl-10 pr-4 py-3.5 text-base md:text-lg'} rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-slate-800 font-bold transition-all shadow-sm`}
        required={required}
      />
    </div>
  </div>
);

// --- EXTRAS SECTION ---
interface ExtrasSectionProps {
  isActive: boolean;
  onToggle: (v: boolean) => void;
  data: ExtrasInput;
  onChange: (d: ExtrasInput) => void;
  labelOverride?: string;
}

export const ExtrasSection: React.FC<ExtrasSectionProps> = ({ isActive, onToggle, data, onChange, labelOverride }) => (
  <div className={`rounded-xl border transition-all ${isActive ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'}`}>
    <label className="flex items-center gap-3 p-4 cursor-pointer select-none">
      <input type="checkbox" checked={isActive} onChange={(e) => onToggle(e.target.checked)} className="h-5 w-5 accent-orange-600 rounded" />
      <span className="text-sm font-semibold text-slate-700">{labelOverride || "Incluir Adicionais e Horas Extras"}</span>
    </label>
    
    {isActive && (
      <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in border-t border-orange-100/50 mt-2 pt-4">
        
        <div className="col-span-1 sm:col-span-2 mb-2 bg-white/50 p-2 rounded-lg border border-orange-100">
           <label className="block text-[10px] font-bold text-orange-700 mb-1 uppercase">Carga Horária Mensal (Padrão 220)</label>
           <input type="number" value={data.workload || ''} onChange={e => onChange({...data,workload: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none" placeholder="220" />
        </div>

        <div className="col-span-1">
          <label className="block text-[10px] font-bold text-orange-700 mb-1 uppercase">H. Extra 50% (Horas)</label>
          <input type="number" value={data.hours50 || ''} onChange={e => onChange({...data, hours50: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none" placeholder="0" />
        </div>
        <div className="col-span-1">
          <label className="block text-[10px] font-bold text-orange-700 mb-1 uppercase">H. Extra 100% (Horas)</label>
          <input type="number" value={data.hours100 || ''} onChange={e => onChange({...data, hours100: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none" placeholder="0" />
        </div>
        <div className="col-span-1">
          <label className="block text-[10px] font-bold text-orange-700 mb-1 uppercase">Interjornada 50% (Horas)</label>
          <input type="number" value={data.hoursInterjornada || ''} onChange={e => onChange({...data, hoursInterjornada: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none" placeholder="0" />
        </div>

        <div className="col-span-1">
          <label className="block text-[10px] font-bold text-orange-700 mb-1 uppercase">Adicional Noturno (Horas)</label>
          <input type="number" value={data.hoursNight || ''} onChange={e => onChange({...data, hoursNight: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none" placeholder="0" />
        </div>
        
        <div className="col-span-1">
          <label className="block text-[10px] font-bold text-orange-700 mb-1 uppercase">Sobreaviso (Horas)</label>
          <input type="number" value={data.hoursStandby || ''} onChange={e => onChange({...data, hoursStandby: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none" placeholder="0" />
        </div>

         <div className="col-span-1 sm:col-span-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={data.includeDsr} onChange={(e) => onChange({...data, includeDsr: e.target.checked})} className="h-4 w-4 accent-orange-600 rounded" />
              <span className="text-xs font-bold text-orange-800">Calcular DSR (Reflexo) Automático?</span>
            </label>
         </div>

      </div>
    )}
  </div>
);

// --- RESULT CARD ---
interface ResultCardProps {
  label: string;
  value: number;
  isMain?: boolean;
  isDanger?: boolean;
  isConsigned?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ label, value, isMain, isDanger, isConsigned }) => (
  <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${isMain ? 'bg-blue-600 text-white border-blue-600' : isDanger ? 'bg-white border-red-100' : isConsigned ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-100'}`}>
    <span className={`text-xs font-bold uppercase tracking-wider mb-2 ${isMain ? 'text-blue-200' : isDanger ? 'text-red-400' : isConsigned ? 'text-indigo-200' : 'text-slate-400'}`}>{label}</span>
    <span className={`text-2xl md:text-3xl font-extrabold break-words ${isMain ? 'text-white' : isDanger ? 'text-red-600' : isConsigned ? 'text-white' : 'text-slate-800'}`}>
      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
    </span>
  </div>
);

// --- ROW ---
interface RowProps {
  label: string;
  value: number;
  isPositive?: boolean;
  highlight?: boolean;
  informational?: boolean;
}

export const Row: React.FC<RowProps> = ({ label, value, isPositive, highlight, informational }) => (
  <div className={`flex justify-between items-center py-1 gap-2 ${highlight ? 'font-bold text-blue-600' : ''} ${informational ? 'text-slate-400 text-xs' : ''}`}>
    <span className={`${informational ? '' : 'text-slate-600'} break-words`}>{label}</span>
    <span className={`font-semibold whitespace-nowrap shrink-0 ${isPositive ? 'text-emerald-600' : informational ? '' : value < 0 ? 'text-red-500' : 'text-slate-800'}`}>
      {value === 0 ? 'R$ 0,00' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
    </span>
  </div>
);
