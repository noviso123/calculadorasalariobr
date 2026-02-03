import { AIContext } from '../types';
import { FINANCIAL_KNOWLEDGE } from '../config/financialKnowledge';

export const getFinancialAdvice = async (context: AIContext): Promise<string> => {
  // Simula processamento para UX
  await new Promise(resolve => setTimeout(resolve, 800));

  const { net, type } = context;
  if (!net || net <= 0) return 'Aguardando dados para realizar a análise financeira...';

  // 1. Encontrar o Tier de Renda
  const tier = FINANCIAL_KNOWLEDGE.tiers.find(t => net >= t.min && net <= t.max) || FINANCIAL_KNOWLEDGE.tiers[0];

  let advice = `### 💰 Plano Financeiro Personalizado: ${tier.label}\n\n`;

  // 2. REGRA 50-30-20
  const needs = net * 0.5;
  const wants = net * 0.3;
  const invest = net * 0.2;

  advice += `Para um orçamento equilibrado de **${formatCurrency(net)}**, siga a regra 50-30-20:\n\n`;
  advice += `- 🏠 **Necessidades (50%):** ${formatCurrency(needs)}\n`;
  advice += `- 🎯 **Estilo de Vida (30%):** ${formatCurrency(wants)}\n`;
  advice += `- 📈 **Investimento (20%):** **${formatCurrency(invest)}**\n\n`;

  // 3. ESTRATÉGIA DE PROTEÇÃO
  const reserveGoal = needs * 6;
  advice += `#### 🛡️ Proteção e Reserva de Emergência\n`;
  advice += `Ideal: **${formatCurrency(reserveGoal)}** (para cobrir 6 meses de gastos essenciais).\n\n`;

  // 4. PORTFÓLIO SUGERIDO (DATA-DRIVEN)
  advice += `#### 🚀 Estratégia de Alocação (Perfil: ${tier.label})\n`;
  advice += `*${tier.strategy}*\n\n`;

  tier.allocations.forEach(alloc => {
      advice += `- **${alloc.percentage}% em ${alloc.asset}**: ${alloc.description} *[Risco: ${alloc.risk}]*\n`;
  });

  advice += `\n💡 **Dica Fiscal:** ${tier.taxTip}\n\n`;

  // 5. INSIGHTS ESPECÍFICOS POR CONTEXTO
  if (type === 'vacation') {
      advice += `> **⚠️ Estratégia de Férias:** Utilize o seu 1/3 extra para quitar dívidas de curto prazo ou blindar sua reserva. Evite usar este valor para consumo imediato se sua reserva não estiver completa.\n`;
  } else if (type === 'thirteenth') {
      advice += `> **🎁 Estratégia de 13º:** Como é um rendimento de tributação exclusiva, é o momento perfeito para aportar em **PGBL** e reduzir seu imposto de renda futuro em até 12% da renda bruta.\n`;
  } else if (type === 'termination') {
      advice += `> **💼 Gestão de Rescisão:** Priorize liquidez absoluta (Tesouro Selic). Não trave este capital em ativos de prazo longo enquanto não houver nova previsibilidade salarial.\n`;
  } else if (type === 'irpf') {
      advice += `> **⚖️ Otimização IRPF:** Pela sua renda, o mercado sugere ${net > 7000 ? 'consultar o Modelo Legal' : 'manter o Modelo Simplificado'}. ${FINANCIAL_KNOWLEDGE.scenarios.transition}\n`;
  }

  advice += `\n---\n*Esta análise utiliza dados do mercado financeiro e princípios de asset management. Não constitui recomendação direta de compra/venda de ativos.*`;

  return advice;
};

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
