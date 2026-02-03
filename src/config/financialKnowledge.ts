/**
 * Planejamento Financeiro e Inteligência de Mercado 2026
 * Base de dados para alocação de ativos e estratégias fiscais.
 */

export interface Allocation {
    asset: string;
    percentage: number;
    description: string;
    risk: 'Baixo' | 'Médio' | 'Alto';
}

export interface IncomeTier {
    min: number;
    max: number;
    label: string;
    strategy: string;
    allocations: Allocation[];
    taxTip: string;
}

export const FINANCIAL_KNOWLEDGE = {
    tiers: [
        {
            min: 0,
            max: 3500,
            label: 'Sobrevivência e Formação',
            strategy: 'Foco total em segurança e reserva de oportunidade.',
            allocations: [
                { asset: 'Tesouro Selic / CDI', percentage: 100, description: 'Liquidez diária para emergências.', risk: 'Baixo' }
            ],
            taxTip: 'O Desconto Simplificado é quase sempre o melhor caminho aqui.'
        },
        {
            min: 3501,
            max: 7500,
            label: 'Crescimento Conservador',
            strategy: 'Proteção contra inflação e início de diversificação.',
            allocations: [
                { asset: 'CDBs / Tesouro Selic', percentage: 60, description: 'Reserva e previsibilidade.', risk: 'Baixo' },
                { asset: 'IPCA+', percentage: 30, description: 'Proteção real contra o custo de vida.', risk: 'Baixo' },
                { asset: 'FIIs (Papel)', percentage: 10, description: 'Renda mensal isenta de IR.', risk: 'Médio' }
            ],
            taxTip: 'Atenção à faixa de isenção de 5k. Pequenos aportes em PGBL podem te manter isento.'
        },
        {
            min: 7501,
            max: 15000,
            label: 'Consolidação de Patrimônio',
            strategy: 'Equilíbrio entre renda fixa e variável no Brasil.',
            allocations: [
                { asset: 'IPCA+ e Prefixados', percentage: 40, description: 'Garantir taxas históricas.', risk: 'Baixo' },
                { asset: 'Ações High Div (Brasil)', percentage: 30, description: 'Sócios de grandes empresas.', risk: 'Alto' },
                { asset: 'FIIs (Tijolo)', percentage: 20, description: 'Exposição ao mercado imobiliário físico.', risk: 'Médio' },
                { asset: 'Dólar (IVVB11)', percentage: 10, description: 'Proteção cambial.', risk: 'Alto' }
            ],
            taxTip: 'A declaração completa (Modelo Legal) costuma ser vantajosa a partir daqui.'
        },
        {
            min: 15001,
            max: 30000,
            label: 'Aceleração Global',
            strategy: 'Internacionalização e otimização fiscal agressiva.',
            allocations: [
                { asset: 'Renda Fixa IPCA+', percentage: 30, description: 'Base sólida em moeda local.', risk: 'Baixo' },
                { asset: 'Mercado Americano (S&P 500)', percentage: 30, description: 'Investimento na maior economia do mundo.', risk: 'Alto' },
                { asset: 'Ações e FIIs Brasil', percentage: 30, description: 'Geração de dividendos isentos.', risk: 'Alto' },
                { asset: 'Criptoativos (BTC/ETH)', percentage: 10, description: 'Assimetria de retorno.', risk: 'Alto' }
            ],
            taxTip: 'PGBL até o limite de 12% da renda bruta é obrigatório para otimização máxima.'
        },
        {
            min: 30001,
            max: Infinity,
            label: 'Wealth Management',
            strategy: 'Preservação de poder de compra e sucessão familiar.',
            allocations: [
                { asset: 'Offshore / Global Portfolios', percentage: 50, description: 'Foco em Jurisdições fortes.', risk: 'Médio' },
                { asset: 'Private Equity / Real Estate', percentage: 20, description: 'Ativos alternativos de alto retorno.', risk: 'Alto' },
                { asset: 'Renda Fixa Estratégica', percentage: 30, description: 'Aproveitar distorções de juros locais.', risk: 'Baixo' }
            ],
            taxTip: 'Estruturas de PJ (Holding) podem ser mais eficientes do que CPF para grandes patrimônios.'
        }
    ] as IncomeTier[],

    scenarios: {
        clt: 'Aproveite o FGTS como uma "poupança forçada" para o primeiro imóvel.',
        pj: 'Sua responsabilidade é dobrada: você é seu próprio RH. Invista pesado em previdência privada própria.',
        transition: 'Para mudar de CLT para PJ, exija um faturamento pelo menos 40% superior ao seu salário bruto.'
    }
};
