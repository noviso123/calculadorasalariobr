
import { GoogleGenAI } from "@google/genai";
import { CalculationResult } from "../types";

// --- API KEYS CONFIGURATION ---
// Chaves fornecidas para redundância dinâmica.
// A prioridade é Gemini -> OpenAI -> Perplexity.
const KEYS = {
  GEMINI: "AIzaSyDdb6Xac9AzhQp94x5PKzO-L0YvEoFMY2o",
  OPENAI: "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",
  PERPLEXITY: "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"
};

// Inicializa cliente Gemini (Google GenAI SDK)
const geminiClient = new GoogleGenAI({ apiKey: KEYS.GEMINI });

// --- PROMPT GENERATOR ---
const generatePrompt = (result: CalculationResult) => `
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
    Use markdown com **negrito** para destacar pontos chave. Seja direto e motivador. Responda em Português do Brasil.
`;

// --- PROVIDER IMPLEMENTATIONS ---

// 1. Google Gemini
async function tryGemini(prompt: string): Promise<string> {
  console.log("[AI Orchestrator] Tentando provedor: Gemini...");
  const response = await geminiClient.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  
  if (!response.text) {
    throw new Error("Gemini retornou resposta vazia.");
  }
  return response.text;
}

// 2. OpenAI (ChatGPT)
async function tryOpenAI(prompt: string): Promise<string> {
  console.log("[AI Orchestrator] Tentando provedor: OpenAI...");
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${KEYS.OPENAI}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // Modelo rápido e eficiente
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI Error: ${response.status} - ${err}`);
  }
  
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// 3. Perplexity
async function tryPerplexity(prompt: string): Promise<string> {
  console.log("[AI Orchestrator] Tentando provedor: Perplexity...");
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${KEYS.PERPLEXITY}`
    },
    body: JSON.stringify({
      model: "sonar", // Modelo otimizado para chat/busca
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Perplexity Error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// --- MAIN ORCHESTRATOR ---

export const getFinancialAdvice = async (result: CalculationResult): Promise<string> => {
  const prompt = generatePrompt(result);
  
  // Estratégia de Fallback: Tenta Gemini -> OpenAI -> Perplexity
  
  // 1. TENTATIVA: GEMINI (Prioridade Alta)
  try {
    const text = await tryGemini(prompt);
    return text;
  } catch (err) {
    console.warn("[AI Orchestrator] Falha no Gemini. Iniciando Fallback...", err);
  }

  // 2. TENTATIVA: OPENAI (Fallback 1)
  try {
    const text = await tryOpenAI(prompt);
    return text + "\n\n*(Gerado via OpenAI Backup)*"; // Opcional: marca d'água discreta para debug
  } catch (err) {
    console.warn("[AI Orchestrator] Falha na OpenAI. Iniciando Fallback...", err);
  }

  // 3. TENTATIVA: PERPLEXITY (Fallback 2 - Último Recurso)
  try {
    const text = await tryPerplexity(prompt);
    return text + "\n\n*(Gerado via Perplexity Backup)*";
  } catch (err) {
    console.error("[AI Orchestrator] CRÍTICO: Todos os provedores de IA falharam.", err);
  }

  return "O consultor IA está indisponível no momento devido a uma alta demanda nos servidores. Por favor, tente novamente em alguns instantes.";
};
