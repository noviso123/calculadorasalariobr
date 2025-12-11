import { GoogleGenAI } from "@google/genai";
import { AIContext } from "../types";

// Inicializa o cliente Gemini usando a variável de ambiente segura
// ATENÇÃO: A chave deve estar no arquivo .env como VITE_API_KEY ou API_KEY
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

// --- PROMPT GENERATOR ---
const generatePrompt = (context: AIContext) => {
  const baseInfo = `
    DADOS FINANCEIROS DO USUÁRIO:
    - Bruto: R$ ${context.gross.toFixed(2)}
    - Líquido: R$ ${context.net.toFixed(2)}
    - Descontos Totais: R$ ${context.discounts.toFixed(2)}
    ${context.extras ? `- Extras: R$ ${context.extras.toFixed(2)}` : ''}
  `;

  let specificTask = '';

  switch (context.type) {
    case 'salary':
      specificTask = `
        TAREFA (SALÁRIO MENSAL):
        1. Análise de Orçamento: Sugira como dividir este salário líquido na regra 50/30/20.
        2. Impostos: Comente brevemente se o desconto de impostos está alto e se há algo legal a fazer (ex: dependentes).
        3. Dica de Ouro: Um conselho rápido para sobrar dinheiro no fim do mês.
      `;
      break;
    case 'vacation':
      specificTask = `
        TAREFA (FÉRIAS):
        O usuário vai sair de férias (${context.daysTaken || 30} dias).
        1. Gestão do Dinheiro: Lembre que receber adiantado exige disciplina na volta. Dê uma dica de como guardar parte para o mês de retorno "magro".
        2. Lazer Consciente: Sugira como aproveitar o valor extra sem se endividar.
        3. Abono: Se o valor líquido for alto, sugira um investimento curto (CDB/Tesouro).
      `;
      break;
    case 'thirteenth':
      specificTask = `
        TAREFA (13º SALÁRIO - ${context.monthsWorked || 12} meses trabalhados):
        1. Prioridades: Dívidas caras (Cartão/Cheque Especial) vs Investimentos.
        2. Compras de Fim de Ano: Como usar este valor para presentes sem comprometer o início do ano (IPVA/IPTU).
        3. Investimento: Sugira uma aplicação segura para este montante extra.
      `;
      break;
    case 'termination':
      specificTask = `
        TAREFA (RESCISÃO DE CONTRATO - Motivo: ${context.terminationReason || 'Geral'}):
        1. Fundo de Emergência: Enfatize que este dinheiro deve durar até a recolocação. Não gaste com supérfluos.
        2. FGTS: Se houver saque, sugira não deixar parado na conta corrente (Poupança ou CDB Liquidez Diária).
        3. Carreira: Uma frase motivacional sobre recolocação e atualização profissional.
      `;
      break;
  }

  return `
    Atue como um consultor financeiro pessoal sênior para um trabalhador brasileiro em 2026.
    
    ${baseInfo}
    
    CONTEXTO TRIBUTÁRIO (BRASIL 2026):
    - Salário Mínimo: R$ 1.631,00
    - Isenção IRPF: Até R$ 5.000,00
    
    ${specificTask}
    
    FORMATO:
    Forneça 3 conselhos curtos e estratégicos (máximo 2-3 linhas cada).
    Use markdown com **negrito** para destacar pontos chave. 
    Seja empático, direto e use Português do Brasil.
  `;
};

export const getFinancialAdvice = async (context: AIContext): Promise<string> => {
  if (!apiKey) {
    return "A chave de API não foi configurada. Por favor, configure a variável de ambiente API_KEY.";
  }

  const prompt = generatePrompt(context);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    if (response.text) {
      return response.text;
    } else {
      throw new Error("Resposta vazia do modelo.");
    }
  } catch (err) {
    console.error("[AI Error]", err);
    return "O consultor IA está indisponível no momento. Tente novamente mais tarde.";
  }
};