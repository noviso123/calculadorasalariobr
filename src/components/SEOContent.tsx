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

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
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

  const contentMap: Record<ViewType, React.ReactNode> = {
    salary: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Como Calcular o Salário Líquido?" icon={HelpCircle} defaultOpen={true}>
          <p>
            O <strong>Salário Líquido</strong> é o valor que efetivamente cai na sua conta após os descontos.
            Muitas vezes confundido com o salário nominal da carteira, ele exige o cálculo preciso de impostos e benefícios.
            Entenda também suas <InternalLink to="/ferias" label="Férias" /> e <InternalLink to="/decimo-terceiro" label="13º Salário" />.
          </p>
        </AccordionItem>

        <AccordionItem title="Desconto do INSS (Previdência)" icon={ShieldCheck}>
          <p>
            O INSS segue uma tabela <strong>progressiva</strong> (7,5% a 14%). Isso significa que as alíquotas são aplicadas por faixas de renda:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Garante justiça tributária (quem ganha menos, paga proporcionalmente menos).</li>
            <li>O desconto é limitado ao "Teto do INSS" vigente.</li>
          </ul>
        </AccordionItem>

        <AccordionItem title="Imposto de Renda Retido na Fonte (IRPF)" icon={FileText}>
          <p>
            Calculado sobre a base após o desconto do INSS. Em 2026, a faixa de isenção beneficia quem ganha até R$ 5.000,00.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Dependentes legais reduzem a base de cálculo.</li>
            <li>O sistema escolhe automaticamente entre o modelo Simplificado ou com Deduções Legais.</li>
          </ul>
        </AccordionItem>

        <AccordionItem title="Vale Transporte e Outros Descontos" icon={Zap}>
          <p>
            O Vale Transporte pode ser descontado em até 6%, mas limitado ao custo real das passagens.
            Outros itens comuns incluem Planos de Saúde (coparticipação) e Faltas (que impactam o Descanso Semanal Remunerado).
          </p>
        </AccordionItem>
      </div>
    ),
    vacation: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Regras de Férias CLT 2026" icon={HelpCircle} defaultOpen={true}>
          <p>
            Todo trabalhador tem direito a 30 dias de descanso após 12 meses de trabalho.
            O pagamento deve ser feito até 2 dias antes do início do descanso.
          </p>
        </AccordionItem>

        <AccordionItem title="O que compõe o valor?" icon={Info}>
          <p>As férias são compostas pelo salário base do período mais o <strong>1/3 Constitucional</strong> (bônus de 33,33%).</p>
          <p>Horas extras e comissões também geram médias que elevam este valor.</p>
        </AccordionItem>

        <AccordionItem title="Abono Pecuniário (Vender Férias)" icon={Zap}>
          <p>
            Você pode converter até 10 dias (1/3) de suas férias em dinheiro.
            <strong>Vantagem:</strong> O abono pecuniário é isento de INSS e Imposto de Renda, garantindo um ganho líquido maior.
          </p>
        </AccordionItem>
      </div>
    ),
    thirteenth: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Guia do 13º Salário" icon={HelpCircle} defaultOpen={true}>
          <p>Também chamado de Gratificação Natalina, é pago proporcionalmente aos meses trabalhados durante o ano.</p>
        </AccordionItem>

        <AccordionItem title="Primeira Parcela (Adiantamento)" icon={Zap}>
          <p>Paga entre fevereiro e novembro. Corresponde a 50% do bruto e <strong>não possui nenhum desconto</strong> de imposto.</p>
        </AccordionItem>

        <AccordionItem title="Segunda Parcela (Quitação)" icon={ShieldCheck}>
          <p>Paga até 20 de dezembro. Aqui ocorrem os descontos totais de INSS e IR, subtraindo o valor já antecipado.</p>
        </AccordionItem>
      </div>
    ),
    termination: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Verbas Rescisórias Principais" icon={HelpCircle} defaultOpen={true}>
          <p>Inclui Saldo de Salário, Aviso Prévio (trabalhado ou indenizado), Férias Proporcionais/Vencidas e 13º Proporcional.</p>
        </AccordionItem>

        <AccordionItem title="Multa de 40% e Saque do FGTS" icon={Info}>
          <p>Na demissão sem justa causa, o empregador paga 40% sobre o total depositado no FGTS. Este valor é isento de impostos.</p>
        </AccordionItem>

        <AccordionItem title="Empréstimo Consignado na Saída" icon={AlertTriangle}>
          <p>
            Cuidado: A lei permite que a empresa desconte até 35% do líquido da sua rescisão para quitar parcelas de empréstimos ativos.
            Simule na nossa <InternalLink to="/consignado" label="Calculadora de Consignado" /> para evitar surpresas.
          </p>
        </AccordionItem>
      </div>
    ),
    consigned: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Margem Consignável (Lei 35%)" icon={ShieldCheck} defaultOpen={true}>
          <p>
            A soma das parcelas não pode ultrapassar 35% da sua renda líquida mensal.
            É a modalidade com os menores juros do mercado devido à garantia em folha.
          </p>
        </AccordionItem>

        <AccordionItem title="Garantia de FGTS (Saque-Aniversário)" icon={Zap}>
          <p>
            Você pode antecipar parcelas do saque-aniversário sem comprometer sua renda mensal,
            usando o saldo do fundo como garantia direta para o banco.
          </p>
        </AccordionItem>
      </div>
    ),
    compare: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Comparativo CLT vs PJ" icon={HelpCircle} defaultOpen={true}>
          <p>A escolha depende da sua prioridade entre segurança (CLT) ou maior liquidez imediata (PJ).</p>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest block mb-2">Vantagens CLT</span>
              <ul className="text-xs space-y-1">
                <li className="flex gap-2"><Check size={12} /> FGTS e Multa 40%</li>
                <li className="flex gap-2"><Check size={12} /> Seguro Desemprego</li>
                <li className="flex gap-2"><Check size={12} /> Férias Remuneradas</li>
              </ul>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest block mb-2">Vantagens PJ</span>
              <ul className="text-xs space-y-1">
                <li className="flex gap-2"><Check size={12} /> Menor Carga Tributária</li>
                <li className="flex gap-2"><Check size={12} /> Maior Salário Líquido</li>
                <li className="flex gap-2"><Check size={12} /> Liberdade Contratual</li>
              </ul>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem title="A Regra de Ouro da Transição" icon={Lightbulb}>
          <p>
            Para compensar a perda de direitos (13º, Férias, FGTS), um salário PJ deve ser entre
            <strong>30% e 50% maior</strong> do que o salário bruto CLT equivalente.
          </p>
        </AccordionItem>
      </div>
    ),
    irpf: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Novas Regras IRPF 2026" icon={HelpCircle} defaultOpen={true}>
          <p>Em 2026, quem ganha até R$ 5.000,00 está isento de Imposto de Renda através do desconto simplificado.</p>
        </AccordionItem>

        <AccordionItem title="Modelo Legal vs Simplificado" icon={Info}>
          <p>
            O <strong>Modelo Legal</strong> é vantajoso para quem tem muitas despesas dedutíveis (filhos, saúde, educação).
            O <strong>Simplificado</strong> aplica um desconto padrão (R$ 564,80) na base de cálculo.
          </p>
        </AccordionItem>
      </div>
    )
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-8 px-4">
        <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
          <FileText className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Guia de Direitos 2026</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Informações Oficiais & Base Legal</p>
        </div>
      </div>

      {contentMap[view]}

      <div className="px-4">
        <MethodologyFooter />
      </div>
    </div>
  );
};

export default SEOContent;
