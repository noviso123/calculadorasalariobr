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

  const contentMap: Record<ViewType, React.ReactNode> = {
    salary: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Como Calcular o Salário Líquido em 2026?" icon={HelpCircle} defaultOpen={true}>
          <p>
            O <strong>Salário Líquido</strong> é o valor que efetivamente cai na sua conta após os descontos compulsórios.
            É a base real para o seu planejamento financeiro mensal. Para uma análise completa, considere também suas <InternalLink to="/ferias" label="Férias" /> e <InternalLink to="/decimo-terceiro" label="13º Salário" />.
          </p>
        </AccordionItem>

        <AccordionItem title="Desconto do INSS (Previdência Social)" icon={ShieldCheck}>
          <p>
            O primeiro desconto aplicado é o INSS, seguindo a tabela <strong>progressiva</strong> de 2026 (alíquotas de 7,5% a 14%):
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Calculado por faixas salariais para maior justiça tributária.</li>
            <li>Limitado ao "Teto da Previdência" estipulado por lei.</li>
            <li>Essencial para garantir direitos como auxílio-doença e aposentadoria.</li>
          </ul>
        </AccordionItem>

        <AccordionItem title="Imposto de Renda (IRPF) e Isenção" icon={FileText}>
          <p>
            O IRPF 2026 traz a nova faixa de isenção que beneficia quem ganha até R$ 5.000,00 (pelo desconto simplificado).
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Dependentes:</strong> Reduzem a base de cálculo (R$ 189,59 por dependente).</li>
            <li><strong>Modelos:</strong> O sistema opta automaticamente pelo menor imposto entre o Simplificado e as Deduções Legais.</li>
          </ul>
        </AccordionItem>

        <AccordionItem title="Vale Transporte e Outros Descontos" icon={Zap}>
          <p>
            A empresa pode descontar até 6% do salário básico para o Vale Transporte.
            Outros descontos permitidos incluem plano de saúde, faltas não justificadas e atrasos, que também refletem no Descanso Semanal Remunerado (DSR).
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
            <Info size={16} className="text-blue-500 shrink-0 mt-1" />
            <p className="text-xs text-blue-800">
               <strong>Dica:</strong> Se o custo real das suas passagens for menor que 6% do seu salário básico, a empresa deve descontar apenas o valor real gasto.
            </p>
          </div>
        </AccordionItem>
      </div>
    ),
    vacation: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Guia de Férias CLT e Prazos" icon={HelpCircle} defaultOpen={true}>
          <p>
            As férias são um direito anual de 30 dias de descanso remunerado após 12 meses de contrato (período aquisitivo).
            O pagamento deve ocorrer obrigatoriamente até 2 dias antes do início do descanso escolhido.
          </p>
        </AccordionItem>

        <AccordionItem title="Composição do Pagamento e Adicionais" icon={Info}>
          <p>As férias são calculadas sobre o salário bruto somado ao <strong>Terço Constitucional</strong> (bônus obrigatório de 33,33%).</p>
          <p>Verbas variáveis como horas extras, adicionais noturnos e comissões do último ano entram na média para aumentar o valor total.</p>
        </AccordionItem>

        <AccordionItem title="Abono Pecuniário (Venda de Férias)" icon={Zap}>
          <p>
            É a conversão de até 1/3 do período de férias (geralmente 10 dias) em dinheiro.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>O valor do abono tem natureza indenizatória.</li>
            <li><strong>Isenção:</strong> Não há incidência de INSS ou Imposto de Renda sobre os dias vendidos.</li>
            <li>É uma estratégia comum para aumentar o fôlego financeiro em viagens ou quitação de dívidas.</li>
          </ul>
        </AccordionItem>
      </div>
    ),
    thirteenth: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Funcionamento do 13º Salário (Gratificação)" icon={HelpCircle} defaultOpen={true}>
          <p>
             O 13º salário representa o pagamento proporcional ao tempo trabalhado no ano. Se trabalhou 12 meses, recebe um salário extra integral.
             Em caso de demissão antecipada, o valor proporcional é pago na <InternalLink to="/rescisao" label="Rescisão" />.
          </p>
        </AccordionItem>

        <AccordionItem title="Dinâmica da Primeira Parcela" icon={Zap}>
          <p>Deve ser paga entre 1º de fevereiro e 30 de novembro. Corresponde a 50% do salário bruto atual sem qualquer desconto de impostos.</p>
        </AccordionItem>

        <AccordionItem title="Segunda Parcela e Descontos Fiscais" icon={ShieldCheck}>
          <p>Ocorre até 20 de dezembro. Calcula-se o valor total do 13º, aplicam-se os descontos de INSS e IR sobre o total, e subtrai-se o que já foi pago na primeira parcela.</p>
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
             <p className="text-xs text-emerald-800 font-bold">
               Nota: Como a tributação do 13º é exclusiva, ele não soma com o seu salário do mês para fins de cálculo de alíquota, protegendo sua renda.
             </p>
          </div>
        </AccordionItem>
      </div>
    ),
    termination: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Principais Verbas na Rescisão" icon={HelpCircle} defaultOpen={true}>
          <p>Dependendo da modalidade (Pedido ou Demissão), você tem direito a Saldo de Salário, Férias Vencidas/Proporcionais (+1/3), 13º Proporcional e Aviso Prévio.</p>
        </AccordionItem>

        <AccordionItem title="Regras do FGTS e Multa de 40%" icon={ShieldCheck}>
          <p>Na demissão sem justa causa, o trabalhador saca o saldo do FGTS e recebe uma multa indenizatória de 40% paga pela empresa. Este valor é isento de impostos.</p>
        </AccordionItem>

        <AccordionItem title="Empréstimo Consignado e Retenção Legal" icon={AlertTriangle}>
          <p>
            Muitos ignoram que a Lei 10.820 autoriza a retenção de até 35% das suas verbas rescisórias líquidas para quitar empréstimos consignados ativos.
          </p>
          <p className="mt-2">Simule o impacto e sua margem na nossa <InternalLink to="/consignado" label="Calculadora de Consignado" /> para se planejar.</p>
        </AccordionItem>
      </div>
    ),
    consigned: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Margem Consignável e a Lei dos 35%" icon={ShieldCheck} defaultOpen={true}>
          <p>
            O crédito consignado é limitado a 35% da sua renda líquida mensal (margem livre). É a linha de crédito mais barata para funcionários CLT.
          </p>
        </AccordionItem>

        <AccordionItem title="Antecipação do Saque-Aniversário FGTS" icon={Zap}>
          <p>
            Permite usar o saldo do fundo como garantia para obter crédito rápido sem comprometer sua renda mensal, já que o pagamento é descontado anualmente do próprio FGTS.
          </p>
        </AccordionItem>

        <AccordionItem title="Diferença entre Taxa Nominal e CET" icon={Info}>
          <p>
            Sempre olhe o <strong>Custo Efetivo Total (CET)</strong>. Ele inclui juros, IOF, taxas administrativas e seguros, revelando o custo real do seu empréstimo.
          </p>
        </AccordionItem>
      </div>
    ),
    compare: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Análise Estratégica: CLT ou PJ?" icon={HelpCircle} defaultOpen={true}>
          <p>
             A escolha entre ser CLT ou PJ no Brasil de 2026 exige entender que na PJ você é seu próprio RH. Enquanto o CLT oferece segurança e benefícios fixos, o PJ entrega maior liquidez imediata.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest block mb-3 border-b border-blue-200 pb-1">Segurança CLT</span>
              <ul className="text-xs space-y-2">
                <li className="flex gap-2"><Check size={12} className="text-blue-500 shrink-0" /> FGTS + Multa de 40%</li>
                <li className="flex gap-2"><Check size={12} className="text-blue-500 shrink-0" /> Férias + 1/3 e 13º Salário</li>
                <li className="flex gap-2"><Check size={12} className="text-blue-500 shrink-0" /> Seguro Desemprego e Aviso</li>
              </ul>
            </div>
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest block mb-3 border-b border-indigo-200 pb-1">Liquidez PJ</span>
              <ul className="text-xs space-y-2">
                <li className="flex gap-2"><Check size={12} className="text-indigo-500 shrink-0" /> Carga tributária reduzida</li>
                <li className="flex gap-2"><Check size={12} className="text-indigo-500 shrink-0" /> Salário mensal muito maior</li>
                <li className="flex gap-2"><Check size={12} className="text-indigo-500 shrink-0" /> Flexibilidade de contratos</li>
              </ul>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem title="A Regra de Ouro da Transição (Break-even)" icon={Lightbulb}>
          <p>
            Especialistas financeiros recomendam que, para manter o mesmo padrão de vida, um contrato PJ deve faturar entre <strong>30% e 50% a mais</strong> do que o salário bruto CLT equivalente.
            Isso cobre os custos com contador, INSS autônomo e provisões para o próprio período de descanso.
          </p>
          <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3">
             <AlertTriangle size={16} className="text-orange-600 shrink-0 mt-1" />
             <p className="text-xs text-orange-800">
               <strong>Cuidado:</strong> PJ sem "Fator R" (em serviços intelectuais) pode ter imposto alto (15,5% no Simples Nacional). Fale com um contador.
             </p>
          </div>
        </AccordionItem>
      </div>
    ),
    irpf: (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <AccordionItem title="Mudanças no IRPF para 2026" icon={HelpCircle} defaultOpen={true}>
          <p>Com a correção das tabelas, a faixa de isenção agora protege rendimentos de até R$ 5.000,00 por meio do desconto simplificado padrão da Receita Federal.</p>
        </AccordionItem>

        <AccordionItem title="Cálculo Legal vs Modelo Simplificado" icon={ShieldCheck}>
          <p>
            O <strong>Modelo Legal</strong> é vantajoso para quem possui altas deduções (saúde, instrução, pensão ou dependentes).
            O <strong>Modelo Simplificado</strong> substitui as deduções por um valor fixo (R$ 564,80), sendo a melhor opção para a maioria dos assalariados.
          </p>
        </AccordionItem>

        <AccordionItem title="O que é a Alíquota Efetiva?" icon={Info}>
          <p>
            É a porcentagem real paga sobre o seu salário total. Graças à progressividade e às parcelas a deduzir de cada faixa, a alíquota efetiva será sempre menor que a alíquota máxima em que você se enquadra.
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

      {contentMap[view]}

      <div className="pb-10">
        <MethodologyFooter />
      </div>
    </div>
  );
};

export default SEOContent;
