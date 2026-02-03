
import React from 'react';
import { Link } from 'react-router-dom';
import { ViewType } from '../types';


// Componente auxiliar para link interno
const InternalLink = ({ to, label }: { to: string, label: string }) => (
  <Link
    to={to}
    className="text-blue-600 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
  >
    {label}
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 8v9"/></svg>
  </Link>
);

const MethodologyFooter = () => (
  <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 bg-slate-50 p-4 rounded-lg">
    <h5 className="font-bold text-slate-700 mb-1 uppercase tracking-wider">Metodologia e Fontes Legais</h5>
    <p className="leading-relaxed">
      Os cálculos apresentados nesta ferramenta utilizam como base a <strong>Consolidação das Leis do Trabalho (CLT) - Decreto-lei nº 5.452/1943</strong>,
      incluindo atualizações da Reforma Trabalhista (Lei 13.467/2017). As alíquotas de INSS e IRRF seguem as tabelas progressivas oficiais
      vigentes ou projetadas para o exercício de 2026, conforme diretrizes da Receita Federal e Previdência Social.
      <br/><br/>
      <em>Última revisão da metodologia: Janeiro/2026.</em>
    </p>
  </div>
);

interface Props {
  view: ViewType;
}

const SEOContent: React.FC<Props> = ({ view }) => {

  // Componente auxiliar para link interno




  const contentMap: Record<ViewType, React.ReactNode> = {
    salary: (
      <article className="prose prose-blue max-w-none text-slate-600">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Como calcular o Salário Líquido em 2026?</h2>
        <p className="mb-4">
          O cálculo do <strong>Salário Líquido</strong> é a base do planejamento financeiro de qualquer trabalhador CLT.
          Muitas vezes confundido com o "Salário Nominal" (aquele que está na carteira), o valor líquido é o que efetivamente cai na sua conta bancária após todos os descontos obrigatórios e opcionais.
          Para um planejamento financeiro completo, é essencial que você também entenda como funcionam suas <InternalLink to="/ferias" label="Férias" /> e o seu <InternalLink to="/decimo-terceiro" label="13º Salário" />.
        </p>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">1. Desconto do INSS 2026 (Previdência Social)</h3>
        <p className="mb-4">
          O primeiro desconto aplicado sobre o seu salário bruto é o INSS. Desde a reforma da previdência, a tabela é <strong>progressiva</strong>.
          Isso significa que, em vez de aplicar uma porcentagem única sobre todo o salário, aplicam-se alíquotas diferentes para cada faixa de renda (7,5%, 9%, 12% e 14%).
          Isso garante justiça tributária: quem ganha menos, paga proporcionalmente menos. O desconto é limitado ao "Teto do INSS", o que protege os salários mais altos de descontos excessivos.
        </p>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">2. Imposto de Renda Retido na Fonte (IRPF)</h3>
        <p className="mb-4">
          Após subtrair o INSS, obtemos a "Base de Cálculo do IR". Sobre este valor, aplicam-se as alíquotas do Imposto de Renda (que variam de 7,5% a 27,5%).
          Em 2026, a faixa de isenção foi atualizada para beneficiar quem ganha até R$ 5.000,00 (considerando o desconto simplificado).
          Além disso, cada <strong>dependente legal</strong> (filhos, cônjuges, pais) reduz a base de cálculo em R$ 189,59, diminuindo o imposto a pagar.
        </p>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">3. Outros Descontos Comuns</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
            <li><strong>Vale Transporte:</strong> A empresa pode descontar até 6% do seu salário base, mas limitado ao custo real das passagens.</li>
            <li><strong>Plano de Saúde:</strong> A coparticipação ou mensalidade depende do contrato da empresa com a operadora.</li>
            <li><strong>Faltas e Atrasos:</strong> Dias não trabalhados sem justificativa legal são descontados integralmente, impactando também o DSR (Descanso Semanal Remunerado).</li>
        </ul>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-6">
          <h4 className="font-bold text-blue-900 mb-3">Dúvidas Frequentes</h4>
          <details className="mb-2 group">
            <summary className="cursor-pointer font-medium text-blue-800 hover:text-blue-600 transition-colors list-none flex items-center justify-between">
              <span>O Vale Transporte é obrigatório descontar 6%?</span>
              <span className="text-blue-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2 text-sm text-slate-600 pl-4 border-l-2 border-blue-200">
              Não. A lei diz que o desconto é de <strong>até 6%</strong> do salário básico. Se o custo real das passagens que você utiliza for menor que 6% do salário, o desconto deve ser limitado ao valor real do custo. A empresa não pode lucrar com este desconto.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-blue-800 hover:text-blue-600 transition-colors list-none flex items-center justify-between">
              <span>Como o FGTS aparece no cálculo?</span>
              <span className="text-blue-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2 text-sm text-slate-600 pl-4 border-l-2 border-blue-200">
              O FGTS (8%) <strong>não é descontado</strong> do seu salário. Ele é um depósito extra e obrigatório feito pelo empregador em uma conta vinculada na Caixa Econômica Federal. Por isso, ele não reduz seu salário líquido mensal, mas é vital em caso de <InternalLink to="/rescisao" label="Rescisão de Contrato" />.
            </p>
          </details>
        </div>
        <MethodologyFooter />
      </article>
    ),
    vacation: (
      <article className="prose prose-blue max-w-none text-slate-600">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Guia Completo de Férias CLT 2026</h2>
        <p className="mb-4">
          O descanso anual remunerado é um direito fundamental garantido pela Constituição. Todo trabalhador tem direito a 30 dias de férias após cada período de 12 meses de trabalho (chamado de período aquisitivo).
          O pagamento das férias deve ser feito até 2 dias antes do início do descanso, o que exige planejamento financeiro. Se você está saindo de férias, verifique também se já recebeu a primeira parcela do seu <InternalLink to="/decimo-terceiro" label="Décimo Terceiro" />.
        </p>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">O que compõe o valor das férias?</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Salário das Férias:</strong> O valor correspondente aos dias que você ficará fora (ex: 20 ou 30 dias).</li>
          <li><strong>1/3 Constitucional:</strong> Um bônus obrigatório de 33,33% calculado sobre o valor das férias. Este adicional visa custear o lazer do trabalhador.</li>
          <li><strong>Média de Variáveis:</strong> Se você fez horas extras, recebeu comissões ou adicionais noturnos durante o período aquisitivo, uma média desses valores integra o pagamento das férias.</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">Abono Pecuniário ("Vender Férias")</h3>
        <p className="mb-4">
          Muitos trabalhadores optam por converter parte das férias em dinheiro. A CLT permite vender até 1/3 do período a que o empregado tiver direito (geralmente 10 dias).
          Sobre esses dias vendidos, você recebe o valor do dia trabalhado + o terço constitucional.
          <br/>
          <strong>Vantagem Tributária:</strong> O abono pecuniário tem natureza indenizatória, ou seja, <strong>não há desconto de INSS ou Imposto de Renda</strong> sobre este valor específico, o que aumenta o ganho líquido.
        </p>

        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 mt-6">
          <p className="text-sm text-yellow-800 font-bold">
            ⚠️ Atenção ao Retorno: Ao receber o pagamento das férias adiantado, lembre-se que, ao voltar ao trabalho, você já terá recebido o salário daquele mês. É comum passar o mês seguinte ao retorno com o orçamento apertado. Use nossa <InternalLink to="/" label="Calculadora de Salário Líquido" /> para planejar seus meses seguintes.
          </p>
        </div>
        <MethodologyFooter />
      </article>
    ),
    thirteenth: (
      <article className="prose prose-blue max-w-none text-slate-600">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Como funciona o 13º Salário?</h2>
        <p className="mb-4">
          Conhecido oficialmente como Gratificação Natalina, o Décimo Terceiro Salário foi instituído no Brasil em 1962. Ele representa um salário extra ao final do ano e é proporcional aos meses trabalhados.
          Se você trabalhou o ano todo, recebe um salário cheio. Se foi admitido durante o ano, recebe 1/12 avos por mês trabalhado (considera-se mês a fração igual ou superior a 15 dias).
          Em caso de saída da empresa, você recebe o proporcional na <InternalLink to="/rescisao" label="Rescisão" />.
        </p>

        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <h4 className="font-bold text-emerald-700 mb-2">1ª Parcela (Adiantamento)</h4>
            <p className="text-sm">
              Deve ser paga obrigatoriamente entre <strong>1º de fevereiro e 30 de novembro</strong>. Corresponde a 50% do salário do mês anterior. O grande diferencial é que, nesta parcela, <strong>não há descontos</strong> de impostos (INSS/IR).
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700 mb-2">2ª Parcela (Quitação)</h4>
            <p className="text-sm">
              Deve ser paga até <strong>20 de dezembro</strong>. Nesta etapa, calcula-se o valor total do 13º devido, descontam-se o INSS e o IR (sobre o valor total) e subtrai-se o adiantamento já recebido na primeira parcela.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">Integração de Horas Extras e Médias</h3>
        <p className="mb-4">
          O 13º Salário não é apenas o salário base. Horas extras, adicionais noturnos, de insalubridade ou periculosidade e comissões integram a base de cálculo.
          A empresa deve fazer uma média anual (habitualidade) dessas verbas variáveis para compor o valor final da gratificação.
        </p>
        <MethodologyFooter />
      </article>
    ),
    termination: (
      <article className="prose prose-blue max-w-none text-slate-600">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Entenda o Cálculo de Rescisão de Contrato</h2>
        <p className="mb-4">
          O momento do desligamento gera muitas dúvidas e insegurança financeira. O Termo de Rescisão do Contrato de Trabalho (TRCT) é o documento que detalha todas as verbas devidas.
          Os valores variam drasticamente dependendo do motivo da saída: pedido de demissão, justa causa, demissão sem justa causa ou acordo (distrato).
        </p>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">Principais Verbas Rescisórias</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Saldo de Salário:</strong> Pagamento proporcional aos dias efetivamente trabalhados no mês do desligamento.</li>
          <li><strong>Aviso Prévio:</strong> Pode ser trabalhado ou indenizado. Em demissões sem justa causa pelo empregador, adiciona-se 3 dias de aviso para cada ano trabalhado (Lei 12.506/2011), limitado a 90 dias no total.</li>
          <li><strong>Férias Vencidas e Proporcionais:</strong> Pagamento integral das férias não gozadas (vencidas), mais os meses trabalhados no ano atual (proporcionais), sempre acrescidas de 1/3.</li>
          <li><strong>13º Salário Proporcional:</strong> Fração de 1/12 por mês trabalhado no ano corrente.</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">Multa de 40% do FGTS</h3>
        <p className="mb-4">
          Na demissão sem justa causa, a empresa deve pagar uma multa de <strong>40%</strong> sobre todo o montante de FGTS depositado durante a vigência do contrato, corrigido monetariamente.
          Este valor é pago diretamente ao trabalhador e tem natureza indenizatória (sem descontos).
        </p>

        <div className="bg-red-50 p-6 rounded-xl border border-red-100 mt-6 shadow-sm">
           <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             Risco Financeiro: Empréstimo Consignado na Rescisão
           </h4>
           <div className="text-sm text-red-800 space-y-2">
             <p>
               Muitos trabalhadores desconhecem a Lei 10.820/2003, que permite o desconto de até <strong>35% das verbas rescisórias</strong> (Líquido do TRCT) para amortização de empréstimos consignados ativos.
               Isso pode reduzir significativamente o valor que você receberá em mãos.
               Recomendamos simular sua margem na nossa <InternalLink to="/consignado" label="Calculadora de Consignado" /> para evitar surpresas.
             </p>
             <p className="font-bold bg-red-100 p-2 rounded text-red-950 border border-red-200">
               ⚠️ ATENÇÃO: Se o valor da rescisão não cobrir a dívida, alguns contratos bancários preveem a retenção da Multa de 40% do FGTS ou até mesmo do Saldo do FGTS (se houve garantia contratada).
             </p>
           </div>
        </div>
        <MethodologyFooter />
      </article>
    ),
    consigned: (
      <article className="prose prose-blue max-w-none text-slate-600">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Simulador de Margem Consignável 2026</h2>
        <p className="mb-4">
          O Crédito Consignado é uma modalidade de empréstimo pessoal com desconto direto em folha de pagamento.
          Devido à garantia de recebimento pelo banco (baixo risco de inadimplência), ele oferece as menores taxas de juros do mercado para pessoa física, sendo muito mais vantajoso que cheque especial ou rotativo do cartão.
        </p>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">A Regra dos 35% (Lei do Consignado)</h3>
        <p className="mb-4">
          Para proteger o sustento do trabalhador, a legislação define que a soma das parcelas mensais de empréstimos não pode ultrapassar <strong>35% da sua renda líquida</strong> (margem consignável livre).
          Além dessa margem, existem percentuais adicionais exclusivos para cartão de crédito consignado (5%) e cartão benefício (5%).
          Para saber sua renda líquida exata, utilize a <InternalLink to="/" label="Calculadora de Salário Líquido" />.
        </p>

        <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-2">Empréstimo com Garantia de FGTS (Saque-Aniversário)</h3>
        <p className="mb-4">
          Recentemente popularizada, a Antecipação do Saque-Aniversário permite usar o saldo do FGTS como garantia.
          A grande diferença é que este empréstimo <strong>não compromete sua renda mensal</strong>, pois o pagamento é descontado anualmente direto do saldo do fundo.
          Porém, atenção: ao optar por isso, parte do seu saldo FGTS fica bloqueado, o que pode impactar o valor disponível para saque em uma eventual <InternalLink to="/rescisao" label="Rescisão" />.
        </p>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-6">
          <h4 className="font-bold text-blue-900 mb-2">Dica de Especialista: Olhe o CET</h4>
          <p className="text-sm text-blue-800">
            Muitos focam apenas na taxa de juros nominal, mas o indicador mais importante é o <strong>Custo Efetivo Total (CET)</strong>.
            Ele soma os juros, taxas administrativas, seguros e impostos (IOF). Um juro baixo com taxas altas pode tornar o empréstimo caro. Sempre compare o CET antes de contratar.
          </p>
        </div>
        <MethodologyFooter />
      </article>
    )
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-fade-in">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Guia Oficial & Base Legal</span>
      </div>
      {contentMap[view]}
    </div>
  );
};

export default SEOContent;
