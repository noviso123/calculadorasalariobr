
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CalculationResult } from '../types';

interface Props {
  data: CalculationResult;
}


const CustomTooltip = ({ active, payload, totalGross }: { active?: boolean, payload?: { payload: { name: string; value: number; color: string } }[], totalGross: number }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    // Helper para formatar moeda dentro do tooltip (já que não tem acesso direto à função interna)
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
        <p className="text-xs font-bold text-slate-400 uppercase mb-1">{item.name}</p>
        <p className="text-lg font-bold" style={{ color: item.color }}>
          {formatCurrency(item.value)}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          {((item.value / totalGross) * 100).toFixed(1)}% do Bruto
        </p>
      </div>
    );
  }
  return null;
};

const PieChartVisual: React.FC<Props> = ({ data }) => {
  // Cores Semânticas
  const COLORS = {
    NET: '#059669',    // Emerald 600 (Dinheiro no bolso)
    INSS: '#dc2626',   // Red 600 (Imposto)
    IRPF: '#ea580c',   // Orange 600 (Imposto)
    OTHERS: '#94a3b8'  // Slate 400 (Outros)
  };

  const chartData = [
    { name: 'Salário Líquido', value: data.finalNetSalary, color: COLORS.NET },
    { name: 'INSS', value: data.inss, color: COLORS.INSS },
    { name: 'IRPF', value: data.irpf, color: COLORS.IRPF },
    { name: 'Outros/Saúde', value: data.healthInsurance + data.otherDiscounts + data.transportVoucher + data.consignedDiscount, color: COLORS.OTHERS },
  ].filter(item => item.value > 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);



  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-6">

      {/* Gráfico Donut */}
      <div className="relative h-48 w-48 md:h-56 md:w-56 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip totalGross={data.grossSalary + data.totalExtras} />} cursor={{ fill: 'transparent' }} />
          </PieChart>
        </ResponsiveContainer>

        {/* Texto Central (Destaque Líquido) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Líquido</span>
          <span className="text-lg md:text-xl font-extrabold text-emerald-600">
             {new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.finalNetSalary)}
          </span>
          <span className="text-[10px] text-emerald-600/60 font-medium">Reais</span>
        </div>
      </div>

      {/* Legenda Detalhada Lateral */}
      <div className="flex-1 w-full grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
             <span className="text-xs font-bold text-emerald-900">Salário Líquido</span>
           </div>
           <span className="text-sm font-bold text-emerald-700">{formatCurrency(data.finalNetSalary)}</span>
        </div>

        <div className="flex items-center justify-between p-2 border-b border-slate-50">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-red-600"></div>
             <span className="text-xs font-medium text-slate-600">INSS (Previdência)</span>
           </div>
           <span className="text-sm font-semibold text-slate-700">{formatCurrency(data.inss)}</span>
        </div>

        <div className="flex items-center justify-between p-2 border-b border-slate-50">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-orange-600"></div>
             <span className="text-xs font-medium text-slate-600">IRPF (Imposto de Renda)</span>
           </div>
           <span className="text-sm font-semibold text-slate-700">{formatCurrency(data.irpf)}</span>
        </div>

        {(data.healthInsurance + data.otherDiscounts + data.transportVoucher + data.consignedDiscount) > 0 && (
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400"></div>
              <span className="text-xs font-medium text-slate-600">Outros Descontos</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {formatCurrency(data.healthInsurance + data.otherDiscounts + data.transportVoucher + data.consignedDiscount)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChartVisual;
