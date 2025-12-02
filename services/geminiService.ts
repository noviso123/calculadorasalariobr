import { GoogleGenAI } from "@google/genai";
import { CalculationResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getFinancialAdvice = async (result: CalculationResult): Promise<string> => {
  if (!apiKey) {
    return "API Key não configurada. Não é possível gerar conselhos financeiros personalizados.";
  }

  const prompt = `
    Atue como um consultor financeiro sênior brasileiro especializado em planejamento pessoal para 2026.
    
    Analise os seguintes dados de um salário mensal:
    - Salário Bruto: R$ ${result.grossSalary.toFixed(2)}
    - Salário Líquido: R$ ${result.netSalary.toFixed(2)}
    - Descontos Totais (INSS+IRPF+Saúde+Outros): R$ ${result.totalDiscounts.toFixed(2)}
    - Alíquota Efetiva: ${result.effectiveRate.toFixed(1)}%
    
    Contexto: O usuário está no Brasil, ano de 2026.
    Regras de Tributação aplicadas (Lei 2026):
    1. INSS: Base Salário Mínimo R$ 1.631,00 (Tabela progressiva ajustada).
    2. Isenção Total IRPF: Até R$ 5.000,00 de Salário Bruto.
    3. Faixa Intermediária IRPF: De R$ 5.000,01 a R$ 7.350,00 aplica-se 15% de imposto sobre o Bruto (com dedução).
    4. Faixa Superior IRPF: Acima de R$ 7.350,00 aplica-se 27,5% de imposto sobre o Bruto SEM NENHUMA DEDUÇÃO. (Paga-se 27,5% cheio).
    
    Forneça 3 conselhos curtos, práticos e acionáveis (bullet points) sobre:
    1. Organização do orçamento (Regra 50/30/20) considerando o novo líquido.
    2. Sugestão de investimento conservador/moderado para a sobra de caixa.
    3. Uma dica específica sobre a faixa tributária em que ele caiu.
    
    Mantenha o tom otimista, profissional e direto. Use formatação Markdown simples.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar conselhos no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao conectar com o consultor IA. Tente novamente mais tarde.";
  }
};