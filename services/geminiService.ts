import { GoogleGenAI } from "@google/genai";
import { CalculationResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getFinancialAdvice = async (result: CalculationResult): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key Gemini não encontrada.");
    return "O consultor IA está indisponível no momento (Chave de API não configurada).";
  }

  const prompt = `
    Atue como um consultor financeiro pessoal sênior para um trabalhador brasileiro em 2026.
    
    DADOS FINANCEIROS DO USUÁRIO:
    - Salário Bruto: R$ ${result.grossSalary.toFixed(2)}
    - Salário Líquido: R$ ${result.netSalary.toFixed(2)}
    - Total de Descontos: R$ ${result.totalDiscounts.toFixed(2)}
    - Alíquota Efetiva: ${result.effectiveRate.toFixed(1)}%
    
    CONTEXTO TRIBUTÁRIO (BRASIL 2026):
    - Salário Mínimo: R$ 1.631,00
    - Isenção IRPF: Até R$ 5.000,00
    
    TAREFA:
    Forneça 3 conselhos curtos e estratégicos (máximo 2 linhas cada) focados em:
    1. Otimização do orçamento (Regra 50/30/20).
    2. Sugestão de alocação de investimentos para o perfil (Conservador/Moderado).
    3. Análise rápida se o imposto pago está alto e como mitigar (ex: previdência privada, se aplicável).
    
    FORMATO:
    Use markdown com **negrito** para destacar pontos chave. Seja direto e motivador.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar conselhos no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao conectar com a Inteligência Artificial. Por favor, tente novamente em alguns instantes.";
  }
};