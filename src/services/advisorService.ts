// Smart Advisor 2026 - Estratégias de Mercado e Planejamento Financeiro
// Implementa Regra 50-30-20, Reserva de Emergência e Alocação de Ativos

import { AIContext } from '../types';

export const getFinancialAdvice = async (context: AIContext): Promise<string> => {
  // Simula processamento para UX
  await new Promise(resolve => setTimeout(resolve, 800));

  const { net, gross, type } = context;
  if (!net || net <= 0) return 'Aguardando dados para realizar a análise...';

  let advice = `### 💹 Planejamento Financeiro Inteligente\n\n`;

  // 1. REGRA 50-30-20 (Orçamento Base)
  const needs = net * 0.5;
  const wants = net * 0.3;
  const invest = net * 0.2;

  advice += `Para o seu líquido de **${formatCurrency(net)}**, a estratégia ideal de orçamento é:\n\n`;
  advice += `- 🏠 **Essencial (50%):** ${formatCurrency(needs)} (Aluguel, Contas, Alimentação)\n`;
  advice += `- 🎡 **Lazer/Desejos (30%):** ${formatCurrency(wants)} (Sair, Assinaturas, Hobbies)\n`;
  advice += `- 📈 **Futuro/Investimento (20%):** **${formatCurrency(invest)}** (Otimização de Patrimônio)\n\n`;

  // 2. ESTRATÉGIA DE RESERVA DE EMERGÊNCIA
  const reserveGoal = needs * 6; // 6 meses de gastos essenciais
  advice += `#### 🛡️ Sua Proteção Financeira\n`;
  advice += `Sua meta de **Reserva de Emergência** deve ser de **${formatCurrency(reserveGoal)}**. `;
  advice += `Este valor deve estar em ativos de **liquidez imediata** (você pode sacar hoje se precisar) e baixo risco.\n\n`;

  // 3. ESTRATÉGIA DE INVESTIMENTO (PERSONALIZADA POR RENDA OU CENÁRIO)
  advice += `#### 🚀 Estratégia de Alocação (Mercado 2026)\n`;

  if (net < 3000) {
      advice += `Foco total em **Reserva de Oportunidade**. Utilize **CDBs de Liquidez Diária** que rendam pelo menos 100% do CDI. Evite Taxas de Administração em corretoras.\n`;
  } else if (net < 8000) {
      advice += `- **60% em Renda Fixa Social:** Tesouro Selic ou CDBs de bancos médios.\n`;
      advice += `- **30% em IPCA+:** Proteja seu poder de compra contra a inflação de 2026.\n`;
      advice += `- **10% em Fundos Imobiliários (FIIs):** Comece a gerar renda passiva isenta de IR.\n`;
  } else {
      advice += `- **Renda Fixa (40%):** Diversifique entre Selic e Prefixado para travar taxas altas.\n`;
      advice += `- **Renda Variável (40%):** Explore ETFs de baixo custo (BOVA11, IVVB11 para dolarizar parte do patrimônio).\n`;
      advice += `- **Investimento Global (20%):** Com sua renda, vale a pena abrir conta internacional para fugir do risco Brasil.\n`;
  }

  // 4. INSIGHTS ESPECÍFICOS POR FERRAMENTA
  if (type === 'vacation') {
      advice += `\n> **⚠️ Alerta de Férias:** Seu "extra" de ${formatCurrency(net/4)} (1/3 constitucional) não deve ser gasto impulsivamente. Use-o para quitar dívidas de juros altos ou aportar na Reserva.\n`;
  } else if (type === 'thirteenth') {
      advice += `\n> **🎁 Dica de 13º:** É o melhor momento para fazer aportes em **Previdência Privada (PGBL)** se você faz declaração completa, reduzindo seu IR em até 12%.\n`;
  } else if (type === 'termination') {
      advice += `\n> **💼 Gestão de Rescisão:** Mantenha este montante em um **Tesouro Selic**. Não invista em ativos bloqueados ou de risco (Ações) enquanto não tiver uma nova fonte de renda garantida.\n`;
  } else if (type === 'irpf') {
      advice += `\n> **⚖️ Otimização Fiscal:** Sua base de cálculo foi otimizada pelo modelo **${context.gross > context.net ? 'Simplificado' : 'Legal'}**. `;
      advice += `Se você tiver planos de previdência complementar (PGBL) ou mais dependentes no futuro, lembre-se de conferir se o modelo Legal passa a compensar mais.`;
  }

  advice += `\n---\n*Análise autônoma baseada em princípios de educação financeira. Consulte um assessor para decisões específicas.*`;

  return advice;
};

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
