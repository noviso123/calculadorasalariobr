
import React, { memo } from 'react';
import { ExtrasInput } from '../types';

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

export const InputGroup: React.FC<InputGroupProps> = memo(({ label, value, onChange, placeholder, required, isSmall }) => (
  <div className="w-full">
    <label className={`block text-xs font-black text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1`}>{label}</label>
    <div className="relative group">
      {!isSmall && <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black pointer-events-none group-focus-within:text-blue-500 transition-colors">R$</span>}
      <input
        type="number"
        inputMode="decimal"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || '0,00'}
        className={`w-full ${isSmall ? 'px-4 py-3 text-sm' : 'pl-12 pr-6 py-4.5 text-xl'} rounded-3xl glass-input outline-none text-slate-800 font-black placeholder:text-slate-200`}
        required={required}
      />
    </div>
  </div>
));

// --- EXTRAS SECTION ---
interface ExtrasSectionProps {
  isActive: boolean;
  onToggle: (v: boolean) => void;
  data: ExtrasInput;
  onChange: (d: ExtrasInput) => void;
  labelOverride?: string;
}

export const ExtrasSection: React.FC<ExtrasSectionProps> = memo(({ isActive, onToggle, data, onChange, labelOverride }) => (
  <div className={`rounded-3xl border-2 transition-all duration-300 ${isActive ? 'bg-orange-50/50 border-orange-100' : 'bg-slate-50/50 border-slate-100'}`}>
    <label className="flex items-center gap-4 p-5 cursor-pointer select-none">
       <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${isActive ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-slate-200'}`}>
        {isActive && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
      <input type="checkbox" className="hidden" checked={isActive} onChange={(e) => onToggle(e.target.checked)} />
      <span className="text-sm font-bold text-slate-700">{labelOverride || "Incluir Adicionais e Horas Extras"}</span>
    </label>

    {isActive && (
      <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-scale-in border-t border-orange-100/30 mt-2">
        <div className="col-span-1 sm:col-span-2 mt-4">
           <InputGroup label="Carga Mensal" value={data.workload} onChange={v => onChange({...data, workload: Number(v)})} isSmall />
        </div>
        <InputGroup label="H. Extra 50%" value={data.hours50} onChange={v => onChange({...data, hours50: Number(v)})} isSmall />
        <InputGroup label="H. Extra 100%" value={data.hours100} onChange={v => onChange({...data, hours100: Number(v)})} isSmall />
        <InputGroup label="Adic. Noturno" value={data.hoursNight} onChange={v => onChange({...data, hoursNight: Number(v)})} isSmall />
        <InputGroup label="Sobreaviso" value={data.hoursStandby} onChange={v => onChange({...data, hoursStandby: Number(v)})} isSmall />
      </div>
    )}
  </div>
));

// --- RESULT CARD ---
interface ResultCardProps {
  label: string;
  value: number;
  isMain?: boolean;
  isDanger?: boolean;
  isConsigned?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = memo(({ label, value, isMain, isDanger, isConsigned }) => {
  let bgClass = "bg-white/70 border-white/50 premium-shadow";
  let labelClass = "text-slate-400";
  let valueClass = "text-slate-900";

  if (isMain) {
    bgClass = "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-transparent shadow-xl shadow-blue-500/20";
    labelClass = "text-blue-100/70";
    valueClass = "text-white drop-shadow-md";
  } else if (isDanger) {
    bgClass = "bg-white/70 border-red-100/50 shadow-red-900/5";
    labelClass = "text-red-400";
    valueClass = "text-red-600";
  } else if (isConsigned) {
    bgClass = "bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/20";
    labelClass = "text-indigo-100/70";
    valueClass = "text-white";
  }

  return (
    <div className={`p-8 rounded-[2rem] border backdrop-blur-xl flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-2xl duration-500 animate-scale-in ${bgClass} will-change-transform`}>
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${labelClass}`}>{label}</span>
      <span className={`text-3xl md:text-5xl font-black break-words tracking-tighter ${valueClass}`}>
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
      </span>
    </div>
  );
});

// --- ROW ---
interface RowProps {
  label: string;
  value: number;
  isPositive?: boolean;
  highlight?: boolean;
  informational?: boolean;
}

export const Row: React.FC<RowProps> = memo(({ label, value, isPositive, highlight, informational }) => (
  <div className={`flex justify-between items-center py-2 gap-4 ${highlight ? 'font-black text-blue-600' : ''} ${informational ? 'text-slate-400 text-xs' : ''}`}>
    <span className={`${informational ? '' : 'text-slate-500 font-bold'} break-words text-sm`}>{label}</span>
    <span className={`font-black whitespace-nowrap shrink-0 ${isPositive ? 'text-emerald-600' : informational ? '' : value < 0 ? 'text-red-500' : 'text-slate-800'}`}>
      {value === 0 ? 'R$ 0,00' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
    </span>
  </div>
));
