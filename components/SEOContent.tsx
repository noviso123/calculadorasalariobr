
import React from 'react';
import { ViewType } from '../types';

interface Props {
  view: ViewType;
}

const SEOContent: React.FC<Props> = ({ view }) => {
  const contentMap: Record<ViewType, React.ReactNode> = {
    salary: (
      <article className="prose prose-blue max-w-none text-slate-600">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Como calcular o Salário Líquido em 2026?</h2>
        <p className="mb-4">
          O cálculo do <strong>Salário Líquido</strong> é fundamental para o planejamento financeiro de qualquer trabalhador CLT. 
          O valor que cai na conta é resultado do salário bruto menos os descontos obrigatórios (INSS e IRPF) e eventuais benefícios (como Vale Transporte).
        </p>
        
        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">1. Desconto do INSS 2026 (Previdência)</h3>
        <p className="mb-4">
          O primeiro desconto aplicado é o INSS. A tabela é progressiva, ou seja, quem ganha mais paga uma alíquota maior, 
          mas calculada por faixas. Isso garante justiça tributária. O teto de desconto é limitado ao teto da previdência.
        </p>
        
        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">2. Imposto de Renda (IRPF)</h3>
        <p className="mb-4">
          Após descontar o INSS, a base de cálculo é usada para o Imposto de Renda. Em 2026, a faixa de isenção beneficia 
          quem ganha até R$ 5.000,00 (conforme regras atualizadas/projetadas). Dependentes legais ajudam a reduzir este imposto (R$ 189,59 por dependente).
        </p>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-6">
          <h4 className="font-bold text-blue-900 mb-3">Dúvidas Frequentes</h4>
          <details className="mb-2 group">
            <summary className="cursor-pointer font-medium text-blue-800 hover:text-blue-600 transition-colors list-none flex items-center justify-between">
              <span>O Vale Transporte é obrigatório descontar 6%?</span>
              <span className="text-blue-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2 text-sm text-slate-600 pl-4 border-l-2 border-blue-200">
              Não. A lei diz que o desconto é de <strong>até 6%</strong> do salário básico. Se o custo real das passagens for menor que 6% do salário, o desconto deve ser limitado ao valor real do custo.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-blue-800 hover:text-blue-600 transition-colors list-none flex items-center justify-between">
              <span>Como o FGTS aparece no cálculo?</span>
              <span className="text-blue-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2 text-sm text-slate-600 pl-4 border-l-2 border-blue-200">
              O FGTS (8%) <strong>não é descontado</strong> do seu salário. Ele é um depósito extra feito pelo empregador em uma conta vinculada. Por isso, ele não afeta seu salário líquido, mas aparece no holerite como referência.
            </p>
          </details>
        </div>
      </article>
    ),
    vacation: (
      <article className="prose prose-blue max-w-none text-slate-600">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Guia Completo de Férias CLT</h2>
        <p className="mb-4">
          Todo trabalhador tem direito a 30 dias de férias após 12 meses de trabalho (período aquisitivo). 
          O pagamento deve ser feito até 2 dias antes do início do descanso.
        </p>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">O que eu recebo nas férias?</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Salário das Férias:</strong> O valor correspondente aos dias que você ficará fora.</li>
          <li><strong>1/3 Constitucional:</strong> Um bônus de 33,33% sobre o valor das férias.</li>
          <li><strong>Média de Extras:</strong> Se você fez horas extras ou recebeu comissões no ano, uma média entra no cálculo.</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">Abono Pecuniário (Venda de Férias)</h3>
        <p className="mb-4">
          A CLT permite "vender" até 10 dias de férias. Sobre esses dias, você recebe o valor do dia trabalhado + 1/3, 
          mas <strong>sem desconto de INSS ou IR</strong> (pois é verba indenizatória). É uma ótima forma de aumentar o ganho líquido.
        </p>

        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 mt-6">
          <p className="text-sm text-yellow-800 font-bold">
            ⚠️ Atenção: Ao solicitar adiantamento do 13º salário nas férias, lembre-se que no final do ano você receberá apenas a diferença (2ª parcela), o que pode deixar o natal mais "apertado".
          </p>
        </div>
      </article>
    ),
    thirteenth: (
      <article className="prose prose-blue max-w-none text-slate-600">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Como funciona o 13º Salário?</h2>
        <p className="mb-4">
          Conhecido como Gratificação Natalina, o Décimo Terceiro é pago em duas parcelas. 
          O valor é proporcional aos meses trabalhados no ano (considera-se mês trabalhado a fração igual ou superior a 15 dias).
        </p>

        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <h4 className="font-bold text-emerald-700 mb-2">1ª Parcela (Adiantamento)</h4>
            <p className="text-sm">
              Paga entre <strong>1º de fevereiro e 30 de novembro</strong>. Corresponde a 50% do salário atual, sem descontos de INSS ou Imposto de Renda.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700 mb-2">2ª Parcela (Quitação)</h4>
            <p className="text-sm">
              Paga até <strong>20 de dezembro</strong>. É calculado o valor total, descontado o INSS e IR sobre o todo, e subtraído o valor já pago na 1ª parcela.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">Médias de Horas Extras</h3>
        <p className="mb-4">
          Horas extras, adicionais noturnos e comissões integram a base de cálculo. É feita uma média anual dessas verbas variáveis 
          para compor o valor final do seu 13º.
        </p>
      </article>
    ),
    termination: (
      <article className="prose prose-blue max-w-none text-slate-600">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Entenda o Cálculo de Rescisão</h2>
        <p className="mb-4">
          A rescisão do contrato de trabalho envolve o pagamento de diversas verbas, dependendo do motivo do desligamento 
          (pedido de demissão, justa causa ou sem justa causa).
        </p>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">Principais Verbas Rescisórias</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Saldo de Salário:</strong> Dias trabalhados no mês da saída.</li>
          <li><strong>Aviso Prévio:</strong> Pode ser trabalhado ou indenizado. Em demissões sem justa causa, adiciona-se 3 dias por ano trabalhado (Lei 12.506).</li>
          <li><strong>Férias + 1/3:</strong> Pagamento de férias vencidas (se houver) e proporcionais ao tempo trabalhado no ano.</li>
          <li><strong>13º Proporcional:</strong> Avos adquiridos no ano corrente.</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">Multa do FGTS</h3>
        <p className="mb-4">
          Na demissão sem justa causa, a empresa paga uma multa de <strong>40%</strong> sobre todo o saldo de FGTS depositado durante o contrato. 
          Este valor é pago diretamente ao trabalhador.
        </p>
        
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 mt-6 shadow-sm">
           <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             Cuidado com o Consignado
           </h4>
           <div className="text-sm text-red-800 space-y-2">
             <p>
               Se você tem empréstimo consignado, a lei permite descontar até <strong>35% das verbas rescisórias</strong> para abater a dívida.
             </p>
             <p>
               Além disso, até 10% do saldo do FGTS pode ser retido pelo banco como garantia.
             </p>
             <p className="font-bold bg-red-100 p-2 rounded text-red-950 border border-red-200">
               ⚠️ ATENÇÃO: A multa de 40% do FGTS (em caso de demissão sem justa causa) pode ser TOTALMENTE descontada para amortizar a dívida, dependendo do contrato com o banco.
             </p>
           </div>
        </div>
      </article>
    ),
    consigned: (
      <article className="prose prose-blue max-w-none text-slate-600">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Simulador de Margem Consignável 2026</h2>
        <p className="mb-4">
          O Crédito Consignado é uma modalidade de empréstimo com desconto direto em folha de pagamento. 
          Por ter baixo risco para o banco, oferece as menores taxas de juros do mercado para pessoa física.
        </p>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">A Regra dos 35% (Lei do Consignado)</h3>
        <p className="mb-4">
          A legislação define que a soma das parcelas mensais não pode ultrapassar <strong>35% da sua renda líquida</strong> (margem consignável). 
          Além disso, 5% adicionais são exclusivos para cartão de crédito consignado.
        </p>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">Empréstimo com Garantia de FGTS</h3>
        <p className="mb-4">
          Recentemente, tornou-se popular a modalidade onde o trabalhador usa o Saque-Aniversário ou o saldo do FGTS como garantia. 
          Isso não compromete a renda mensal, mas bloqueia parte do saldo do Fundo de Garantia.
        </p>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-6">
          <h4 className="font-bold text-blue-900 mb-2">Dica de Ouro</h4>
          <p className="text-sm text-blue-800">
            Sempre compare o Custo Efetivo Total (CET) entre diferentes bancos. Uma diferença pequena na taxa de juros 
            pode significar milhares de reais economizados ao final de um contrato longo.
          </p>
        </div>
      </article>
    )
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-fade-in">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Guia Explicativo & Base Legal</span>
      </div>
      {contentMap[view]}
    </div>
  );
};

export default SEOContent;