import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CalculationResult } from '../types';

interface Props {
  data: CalculationResult;
}

// Cores "Corporate Blue"
const COLORS = [
  '#1e40af', // Salário Líquido (Blue 800)
  '#60a5fa', // INSS (Blue 400)
  '#3b82f6', // IRPF (Blue 500)
  '#0ea5e9', // Plano de Saúde (Sky 500)
  '#94a3b8', // Outros (Slate 400)
];

const PieChartVisual: React.FC<Props> = ({ data }) => {
  const chartData = [
    { name: 'Líquido', value: data.netSalary },
    { name: 'INSS', value: data.inss },
    { name: 'IRPF', value: data.irpf },
    { name: 'Saúde', value: data.healthInsurance },
    { name: 'Outros/VT', value: data.otherDiscounts + data.transportVoucher },
  ].filter(item => item.value > 0);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#1e3a8a', fontWeight: 600 }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle" 
            iconSize={8}
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartVisual;