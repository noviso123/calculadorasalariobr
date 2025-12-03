
import { GoogleGenAI } from "@google/genai";
import { AIContext } from "../types";

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
        O usuário vai sair de férias (${context.daysTaken} dias).
        1. Gestão do Dinheiro: Lembre que receber adiantado exige disciplina na volta. Dê uma dica de como guardar parte para o mês de retorno "magro".
        2. Lazer Consciente: Sugira como aproveitar o valor extra sem se endividar.
        3. Abono: Se o valor líquido for alto, sugira um investimento curto (CDB/Tesouro).
      `;
      break;
    case 'thirteenth':
      specificTask = `
        TAREFA (13º SALÁRIO):
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

// --- PROVIDER IMPLEMENTATIONS ---

// 1. Google Gemini
async function tryGemini(prompt: string): Promise<string> {
  // console.log("[AI Orchestrator] Tentando provedor: Gemini...");
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
  // console.log("[AI Orchestrator] Tentando provedor: OpenAI...");
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
  // console.log("[AI Orchestrator] Tentando provedor: Perplexity...");
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

export const getFinancialAdvice = async (context: AIContext): Promise<string> => {
  const prompt = generatePrompt(context);
  
  // Estratégia de Fallback: Tenta Gemini -> OpenAI -> Perplexity
  
  try {
    const text = await tryGemini(prompt);
    return text;
  } catch (err) {
    console.warn("[AI Orchestrator] Falha no Gemini. Iniciando Fallback...", err);
  }

  try {
    const text = await tryOpenAI(prompt);
    return text + "\n\n*(Gerado via OpenAI Backup)*"; 
  } catch (err) {
    console.warn("[AI Orchestrator] Falha na OpenAI. Iniciando Fallback...", err);
  }

  try {
    const text = await tryPerplexity(prompt);
    return text + "\n\n*(Gerado via Perplexity Backup)*";
  } catch (err) {
    console.error("[AI Orchestrator] CRÍTICO: Todos os provedores de IA falharam.", err);
  }

  return "O consultor IA está indisponível no momento. Tente novamente mais tarde.";
};
