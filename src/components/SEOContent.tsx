import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ViewType } from '../types';
import {
  Check,
  X,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  AlertTriangle,
  ChevronDown,
  FileText
} from 'lucide-react';

// --- Sub-componentes ---

const InternalLink = ({ to, label }: { to: string, label: string }) => (
  <Link
    to={to}
    className="text-blue-600 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
  >
    {label}
    <ChevronRight size={12} strokeWidth={3} />
  </Link>
);

const AccordionItem = ({ title, icon: Icon, children, defaultOpen = false }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-slate-50 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
            <Icon size={20} />
          </div>
          <span className={`font-bold transition-colors ${isOpen ? 'text-blue-700' : 'text-slate-700'}`}>{title}</span>
        </div>
        <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 pt-0 ml-14 text-slate-600 prose prose-blue prose-sm max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};

const MethodologyFooter = () => (
  <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 bg-slate-50 p-4 rounded-lg flex items-start gap-3">
    <ShieldCheck size={16} className="text-slate-400 mt-0.5 shrink-0" />
    <p className="leading-relaxed">
      <strong>Metodologia e Fontes Legais:</strong> Os cálculos utilizam como base a CLT (Decreto-lei nº 5.452/1943) e atualizações da Reforma Trabalhista.
      Alíquotas de INSS e IRRF seguem as tabelas oficiais de 2026 da Receita Federal.
    </p>
  </div>
);

// --- Componente Principal ---

interface Props {
  view: ViewType;
}

const SEOContent: React.FC<Props> = ({ view }) => {
  const Schema = React.lazy(() => import('./Schema'));

  // Generate FAQ Schema for current view
  const getFaqSchema = () => {
    const questions = {
      salary: [
        { q: "Como funciona o salário líquido em 2026?", a: "O salário líquido é o valor que o trabalhador recebe após descontos de INSS e IRPF, seguindo a nova tabela de isenção de 5k de 2026." },
        { q: "Qual a isenção do IRPF 2026?", a: "Para 2026, rendimentos até o limite estipulado pela nova tabela (aprox. 5 mil reais considerando o desconto simplificado) são isentos de imposto de renda." }
      ],
      vacation: [
        { q: "Qual o prazo para pagamento das férias?", a: "O pagamento das férias deve ser feito obrigatoriamente até 2 dias antes do início do descanso." },
        { q: "Posso vender 10 dias de férias?", a: "Sim, o trabalhador tem o direito de converter até 1/3 do seu período de férias em abono pecuniário (venda de dias)." }
      ],
      thirteenth: [
          { q: "Quando é paga a primeira parcela do 13º?", a: "A primeira parcela (adiantamento) deve ser paga obrigatoriamente entre 1º de fevereiro e 30 de novembro." }
      ],
      termination: [
          { q: "Quanto tempo a empresa tem para pagar a rescisão?", a: "A empresa tem o prazo legal de 10 dias corridos após o término do contrato para realizar o pagamento integral." }
      ]
    };

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": (questions[view as keyof typeof questions] || questions.salary).map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": { "@type": "Answer", "text": item.a }
      }))
    };
  };

  const contentMap: Record<ViewType, React.ReactNode> = {
    // ... rest of the map remains the same, but we ensure headings are H2 inside the components if needed,
    // although they are wrapped here as sub-components.
    salary: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <h2 className="sr-only">Dúvidas sobre Salário Líquido 2026</h2>
        <AccordionItem title="Como Funciona o Cálculo do Salário Líquido em 2026?" icon={HelpCircle} defaultOpen={true}>
          <p>
            O <strong>Salário Líquido</strong> é o valor final que o trabalhador recebe após todos os descontos obrigatórios em folha de pagamento. Com as novas tabelas progressivas de 2026, entender cada rubrica é essencial para o planejamento financeiro.
          </p>
          <p className="mt-4">
            Nosso simulador processa automaticamente as faixas de INSS e IRPF, considerando inclusive as mudanças no salário mínimo e as isenções vigentes. Para uma visão 360º, recomendamos também simular suas <InternalLink to="/ferias" label="Férias" /> e o impacto do <InternalLink to="/decimo-terceiro" label="13º Salário" /> no seu orçamento anual.
          </p>
        </AccordionItem>

        <AccordionItem title="Tabela Progressiva do INSS 2026" icon={ShieldCheck}>
          <p>
            A Previdência Social utiliza um sistema de alíquotas progressivas (7,5% a 14%), o que significa que o desconto é calculado "fatia por fatia" do seu salário bruto.
          </p>
          <div className="bg-blue-50/50 p-6 rounded-2xl my-4 border border-blue-100">
            <h5 className="font-bold text-blue-800 text-sm mb-4 uppercase tracking-tighter">Entenda a Lógica:</h5>
            <ul className="list-disc pl-4 space-y-3 text-sm leading-relaxed">
              <li><strong>Alíquota Efetiva:</strong> Graças ao sistema progressivo, a porcentagem real descontada é sempre menor que a alíquota da sua faixa máxima.</li>
              <li><strong>Teto Previdenciário:</strong> Existe um limite máximo para o desconto do INSS, garantindo que salários muito altos não paguem proporcionalmente mais do que o teto da aposentadoria.</li>
              <li><strong>Garantias:</strong> Este desconto garante seu acesso ao auxílio-doença, auxílio-maternidade e aposentadoria futura.</li>
            </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Imposto de Renda (IRPF) 2026: A Nova Isenção" icon={FileText}>
          <p>
            O IRPF 2026 traz uma das mudanças mais significativas dos últimos anos. Com a nova faixa de isenção que atinge até R$ 5.000,00 (considerando o desconto simplificado), milhões de brasileiros deixaram de pagar o imposto na fonte.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 text-xs block mb-2 uppercase tracking-widest">Modelo Simplificado</span>
              <p className="text-xs">Usa um desconto padrão fixo. Ideal para quem tem poucas despesas dedutíveis.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 text-xs block mb-2 uppercase tracking-widest">Deduções Legais</span>
              <p className="text-xs">Considera gastos com dependentes (R$ 189,59/mês), saúde, educação e pensão alimentícia.</p>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem title="Vale Transporte e Descontos Facultativos" icon={Zap}>
          <p>
            O Vale Transporte tem um teto de desconto de 6% sobre o salário base. Contudo, se o custo real gasto pela empresa com o seu transporte for inferior a esses 6%, o desconto deve ser limitado ao custo real.
          </p>
          <div className="mt-4 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-4">
             <AlertTriangle className="text-indigo-500 shrink-0 mt-1" size={18} />
             <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                <strong>Importante:</strong> Outros descontos como plano de saúde, seguro de vida e vale alimentação (PAT) dependem de acordos coletivos e contratos individuais de trabalho, podendo variar significativamente entre empresas.
             </p>
          </div>
        </AccordionItem>
      </div>
    ),
    vacation: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Guia Completo de Férias: Prazos e Direitos" icon={HelpCircle} defaultOpen={true}>
          <p>
            As férias são o período de descanso anual remunerado concedido após cada 12 meses de vigência do contrato de trabalho (período aquisitivo). O empregador tem os 12 meses seguintes (período concessivo) para determinar a data do descanso.
          </p>
          <p className="mt-3">
             Pela legislação vigente, o pagamento deve cair na conta do trabalhador até 2 dias antes do primeiro dia de férias.
          </p>
        </AccordionItem>

        <AccordionItem title="O Terço Constitucional e Verbas Variáveis" icon={Info}>
          <p>O cálculo básico das férias é: Salário Bruto + 1/3 Constitucional (33,33% do valor do salário).</p>
          <p className="mt-4">
             <strong>Atenção às Médias:</strong> Verbas variáveis como horas extras, comissões, adicional noturno e insalubridade recebidas nos últimos 12 meses são somadas e incluídas na base de cálculo para garantir que o trabalhador não tenha perda salarial no período de descanso.
          </p>
        </AccordionItem>

        <AccordionItem title="Venda de Férias (Abono Pecuniário)" icon={Zap}>
          <p>
            O trabalhador tem o direito facultativo de "vender" até 1/3 do seu período de férias (máximo 10 dias). Essa é uma opção exclusiva do empregado, e a empresa não pode obrigar a venda.
          </p>
          <div className="mt-6 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-inner">
             <h5 className="text-emerald-900 font-black text-xs uppercase mb-3 tracking-widest leading-none">Vantagem Financeira:</h5>
             <p className="text-emerald-800 text-sm leading-relaxed italic">
                O Abono Pecuniário tem natureza indenizatória. Isso significa que **não há desconto de INSS nem de Imposto de Renda** sobre o valor recebido pelos dias vendidos, tornando-o excelente para reforço de caixa.
             </p>
          </div>
        </AccordionItem>
      </div>
    ),
    thirteenth: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Funcionamento da Gratificação Natalina (13º)" icon={HelpCircle} defaultOpen={true}>
          <p>
             Instituído pela Lei 4.090/62, o 13º salário é uma gratificação devida a todo trabalhador urbano ou rural que tenha trabalhado pelo menos 15 dias no mês corrente. Ele é calculado de forma proporcional (1/12 para cada mês trabalhado).
          </p>
          <p className="mt-4">
             O valor base é o salário bruto de dezembro, ou caso haja aumento salarial no ano, o valor atualizado.
          </p>
        </AccordionItem>

        <AccordionItem title="1ª Parcela (Adiantamento): Sem Impostos" icon={Zap}>
          <p>
            Deve ser paga obrigatoriamente entre 1º de fevereiro e 30 de novembro. Corresponde a 50% do salário bruto atual. Importante: nesta parcela **não incide nenhum desconto fiscal** (INSS/IRPF), o valor chega "limpo" ao trabalhador.
          </p>
        </AccordionItem>

        <AccordionItem title="2ª Parcela: Ajuste e Tributação Final" icon={ShieldCheck}>
          <p>Ocorre até dia 20 de dezembro. É o momento onde o governo aplica toda a carga tributária do ano sobre o valor total do 13º.</p>
          <ul className="list-disc pl-4 space-y-3 text-sm mt-4 text-slate-500">
            <li><strong>Tributação Exclusiva:</strong> O imposto do 13º não se soma ao seu salário mensal do mês, evitando que você suba de faixa de alíquota injustamente.</li>
            <li><strong>Desconto da 1ª Parcela:</strong> O valor bruto da 2ª parcela é calculado, os impostos são retidos sobre este total, e então subtrai-se o adiantamento já pago.</li>
          </ul>
        </AccordionItem>
      </div>
    ),
    termination: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Entendendo as Modalidades de Rescisão" icon={HelpCircle} defaultOpen={true}>
          <p>A rescisão do contrato de trabalho encerra o vínculo jurídico. As verbas devidas variam drasticamente conforme o motivo:</p>
          <div className="space-y-4 mt-6">
            <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-blue-500">
               <span className="font-bold text-slate-800 block text-sm">Sem Justa Causa</span>
               <p className="text-xs text-slate-500 mt-1">Garante Saldo Salarial, Aviso Prévio, Férias + 1/3, 13º Proporcional, Saque do FGTS + Multa de 40% e Seguro Desemprego.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-orange-500">
               <span className="font-bold text-slate-800 block text-sm">Pedido de Demissão</span>
               <p className="text-xs text-slate-500 mt-1">O trabalhador perde o direito ao Aviso Prévio (se não trabalhado), saque do FGTS, Multa de 40% e Seguro Desemprego.</p>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem title="FGTS e a Multa Indenizatória" icon={ShieldCheck}>
          <p>
            Na demissão imotivada, a empresa é obrigada a pagar uma multa equivalente a 40% do total de depósitos feitos na conta do FGTS do trabalhador ao longo de todo o contrato.
          </p>
          <div className="mt-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
             <AlertTriangle className="text-blue-600 shrink-0 mt-1" size={18} />
             <p className="text-xs text-blue-900 font-medium">
               <strong>Fique Atento:</strong> Se você optou pelo Saque-Aniversário, a multa de 40% ainda é devida em dinheiro na rescisão, mas você não poderá sacar o saldo principal do FGTS imediatamente.
             </p>
          </div>
        </AccordionItem>

        <AccordionItem title="Prazos de Pagamento e Quitação" icon={Zap}>
          <p>Independentemente do aviso prévio (trabalhado ou indenizado), a empresa tem o prazo legal de **10 dias corridos** após o último dia trabalhado para realizar o pagamento integral das verbas rescisórias.</p>
          <p className="mt-3">O atraso neste pagamento gera uma multa em favor do empregado no valor de um salário nominal (Artigo 477 da CLT).</p>
        </AccordionItem>
      </div>
    ),
    consigned: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Margem Consignável: Conceito e Limites" icon={ShieldCheck} defaultOpen={true}>
          <p>
            O empréstimo consignado é uma modalidade de crédito onde as parcelas são descontadas diretamente do seu holerite. Para proteção do trabalhador, existe a **Margem Consignável**, que é o limite máximo que a parcela pode ocupar da sua renda.
          </p>
          <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
             <h5 className="font-bold text-slate-700 text-xs uppercase mb-3 tracking-widest">Divisão da Margem:</h5>
             <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>Empréstimo Convencional:</span> <span className="font-bold">35%</span></li>
                <li className="flex justify-between"><span>Cartão de Crédito Consignado:</span> <span className="font-bold">5%</span></li>
                <li className="flex justify-between border-t border-slate-300 pt-2 mt-2"><span>Total Permitido:</span> <span className="font-bold text-blue-700">40%</span></li>
             </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Antecipação FGTS (Saque-Aniversário)" icon={Zap}>
          <p>
            Esta modalidade permite que você use o saldo parado no seu FGTS como garantia para empréstimo. É uma das taxas mais baixas do mercado, pois o risco para o banco é praticamente zero.
          </p>
          <p className="mt-3 text-sm italic">
             Vantagem principal: Não compromete sua renda mensal, pois o pagamento é feito anualmente pelo próprio fundo.
          </p>
        </AccordionItem>
      </div>
    ),
    compare: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Análise Estratégica: CLT ou PJ?" icon={HelpCircle} defaultOpen={true}>
          <p>
             A decisão entre CLT e PJ vai além do salário bruto. Trata-se de comparar pacotes de remuneração total versus autonomia e liquidez imediata.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 ring-1 ring-blue-200">
               <h5 className="text-blue-700 font-black text-xs uppercase mb-4 tracking-widest pl-2">Vantagens CLT</h5>
               <ul className="text-xs space-y-3">
                 <li className="flex gap-3"><Check size={14} className="text-blue-500 mt-0.5" /> Segurança previdenciária total</li>
                 <li className="flex gap-3"><Check size={14} className="text-blue-500 mt-0.5" /> Férias remuneradas e 13º garantido</li>
                 <li className="flex gap-3"><Check size={14} className="text-blue-500 mt-0.5" /> FGTS (8% ao mês) + Multa 40%</li>
                 <li className="flex gap-3"><Check size={14} className="text-blue-500 mt-0.5" /> Seguro Desemprego</li>
               </ul>
            </div>
            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 ring-1 ring-indigo-200">
               <h5 className="text-indigo-700 font-black text-xs uppercase mb-4 tracking-widest pl-2">Vantagens PJ</h5>
               <ul className="text-xs space-y-3">
                 <li className="flex gap-3"><Check size={14} className="text-indigo-500 mt-0.5" /> Carga tributária reduzida (Simples)</li>
                 <li className="flex gap-3"><Check size={14} className="text-indigo-500 mt-0.5" /> Maior poder de negociação</li>
                 <li className="flex gap-3"><Check size={14} className="text-indigo-500 mt-0.5" /> Recebimento integral imediato</li>
                 <li className="flex gap-3"><Check size={14} className="text-indigo-500 mt-0.5" /> Flexibilidade de horários</li>
               </ul>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem title="O Coeficiente de Conversão (Regra de Ouro)" icon={Lightbulb}>
          <p>
            Para que um contrato PJ seja vantajoso, ele deve prever uma reserva para os meses em que você não emitirá nota (férias) e cobrir os benefícios que você deixa de ter (saúde, refeição).
          </p>
          <div className="mt-6 p-6 bg-slate-900 text-white rounded-[2rem] shadow-xl">
             <p className="text-center font-bold text-sm">DICA DE ESPECIALISTA</p>
             <p className="text-center text-4xl font-black my-4 tracking-tighter text-blue-400">1.4x a 1.6x</p>
             <p className="text-center text-xs text-slate-400">Este é o multiplicador recomendado. Se o CLT paga R$ 5k, o PJ deve pagar entre R$ 7k e R$ 8k para manter o mesmo padrão de vida real.</p>
          </div>
        </AccordionItem>
      </div>
    ),
    irpf: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="O que Mudou no IRPF para 2026?" icon={HelpCircle} defaultOpen={true}>
          <p>O Imposto de Renda passou por uma correção focada na preservação da renda média brasileira. A grande novidade é a manutenção da isenção agressiva para quem ganha até R$ 5.000,00 beneficiando diretamente a classe trabalhadora.</p>
        </AccordionItem>

        <AccordionItem title="Como Funciona a Alíquota Efetiva?" icon={Info}>
          <p>
            Muitas pessoas se assustam ao ver uma alíquota de 27,5% na tabela. Contudo, essa é a alíquota **nominal**.
          </p>
          <p className="mt-3">
             A **Alíquota Efetiva** é o quanto você paga de verdade. Graças à base isenta e à parcela a deduzir de cada faixa, se você ganha R$ 10.000,00 sua alíquota efetiva será significativamente menor que os 27,5% da sua faixa máxima. Nosso simulador calcula esse valor exato para você.
          </p>
        </AccordionItem>
      </div>
    )
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto animate-fade-in px-4">
      <div className="flex items-center gap-4 mb-10 pl-2">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-500/20 ring-4 ring-blue-50">
          <FileText className="text-white" size={26} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Central de Conhecimento 2026</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Dúvidas Frequentes & Base Legal</p>
        </div>
      </div>

      <React.Suspense fallback={null}>
        <Schema data={getFaqSchema()} />
      </React.Suspense>

      {contentMap[view]}

      <div className="pb-10">
        <MethodologyFooter />
      </div>
    </div>
  );
};

export default SEOContent;
