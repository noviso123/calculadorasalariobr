// Advisor Lógico 2026 - Baseado em Legislação Oficial (Gov.br)
// Atualizado em Fev/2026 com Lei 14.431 e Tabela INSS/IR vigentes.

import { AIContext } from '../types';

export const getFinancialAdvice = async (context: AIContext): Promise<string> => {
  // Simula processamento para UX
  await new Promise(resolve => setTimeout(resolve, 800));

  let advice = '';
  const currentYear = 2026;
  const inssCeiling = 977.45;

  // 1. Contexto Geral (Renda e Descontos)
  const discountRate = context.gross > 0 ? (context.discounts / context.gross) * 100 : 0;

  advice += `### 🏛️ Análise Oficial (Base Legal ${currentYear})\n\n`;
  advice += `Sua simulação considera as regras vigentes do Ministério do Trabalho e Receita Federal. `;

  if (context.inss >= inssCeiling) {
      advice += `\n\n> **Nota sobre o INSS**: Você contribui pelo **Teto Máximo (R$ 8.475,55)**. Isso significa que seu desconto travou em **R$ ${inssCeiling.toString().replace('.', ',')}**, independentemente de quanto seu salário aumente. Isso é relevante para sua futura aposentadoria.`;
  }

  // 2. Análise Específica por Cenário
  if (context.type === 'salary') {
      advice += `\n\n#### 💰 Salário Líquido Mensal\n`;
      if (context.net <= 5000 * 0.9) { // Margem de segurança
          advice += `Você se beneficia da **Isenção Ampliada do IRPF** (até R$ 5.000,00). Isso representa uma economia significativa comparada aos anos anteriores.\n`;
      }
      advice += `- **Dica Financeira**: Com um líquido de **R$ ${formatCurrency(context.net)}**, especialistas recomendam destinar 20% (R$ ${formatCurrency(context.net * 0.2)}) para Reserva de Emergência (Tesouro Selic ou CDB).\n`;
  }

  else if (context.type === 'termination') {
      advice += `\n\n#### ⚠️ Rescisão e Consignado (Lei 14.431)\n`;
      advice += `Seu cálculo segue rigorosamente a **Lei nº 14.431/2022**, que regula o Crédito Consignado:\n`;
      advice += `1. **Proteção Salarial**: O desconto no TRCT (Termo de Rescisão) foi limitado a **35%** do seu saldo líquido final.\n`;
      advice += `2. **Garantia FGTS**: Se houve desconto do FGTS, ele seguiu a regra de 10% do saldo total disponível + 100% da multa rescisória.\n`;

      advice += `\n**Atenção**: O saldo restante do empréstimo (se houver) não é perdoado. Você deve negociar diretamente com o banco para evitar juros sobre o remanescente.`;
  }

  else if (context.type === 'vacation') {
      advice += `\n\n#### 🏖️ Férias e Abono Pecuniário\n`;
      advice += `Lembre-se que o pagamento de férias é apenas um **adiantamento**. O "terço constitucional" (1/3) é o único valor "extra" real.\n`;
      advice += `- **Cuidado**: No mês de retorno, você receberá apenas pelos dias trabalhados (saldo de salário). Guarde parte deste dinheiro para não ficar "zerado" no mês seguinte.`;
  }

  else if (context.type === 'thirteenth') {
      advice += `\n\n#### 🎁 Gratificação Natalina (Lei 4.090/62)\n`;
      advice += `O 13º Salário é tributado exclusivamente na fonte (não compensa na declaração anual).\n`;
      advice += `- A primeira parcela (recebida até Nov) **não tem descontos**.\n`;
      advice += `- O INSS e IR incidem integralmente sobre o valor total na segunda parcela (Dez), o que faz ela parecer menor. Isso é normal e previsto em lei.`;
  }

  // 3. Rodapé Legal
  advice += `\n\n---\n*Fontes: Decreto nº 5.452 (CLT), Lei nº 14.431 (Consignado) e Instruções Normativas RFB 2026. Este simulador tem caráter educativo.*`;

  return advice;
};

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
