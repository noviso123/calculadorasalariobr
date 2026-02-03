import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto pb-24">
       <Helmet>
        <title>Sobre Nós - Calculadora Salário 2026</title>
        <meta name="description" content="Conheça a missão do Calculadora Salário 2026. Transparência, dados oficiais e educação financeira gratuita para todos os brasileiros." />
        <link rel="canonical" href="https://calculadorasalario2026.com.br/sobre" />
      </Helmet>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Sobre Nós
        </h1>

        <div className="prose prose-blue max-w-none text-slate-600">

          <section className="mb-8">
            <p className="lead text-lg text-slate-700">
              O <strong>Calculadora Salário 2026</strong> nasceu com um propósito claro: democratizar o acesso à informação trabalhista no Brasil.
              Sabemos que a legislação (CLT) pode ser complexa e que o cálculo de impostos como INSS e IRPF gera muitas dúvidas.
              Nossa missão é fornecer ferramentas gratuitas, rápidas e transparentes para que todo trabalhador entenda exatamente quanto ganha e quais são seus direitos.
            </p>
          </section>

          <section className="mb-8">
            <h3>Compromisso com a Verdade (Dados Oficiais)</h3>
            <p>
              Em um cenário de desinformação, a precisão é nossa prioridade. Todos os algoritmos de cálculo utilizados neste site são auditados periodicamente e baseados estritamente nas fontes oficiais do Governo Federal (Gov.br):
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
                <li><strong>CLT (Decreto-lei nº 5.452):</strong> Consolidação das Leis do Trabalho.</li>
                <li><strong>Lei do Consignado (Lei nº 14.431/2022):</strong> Regras para descontos em folha e garantias de FGTS.</li>
                <li><strong>Teto INSS 2026 (Portaria Interministerial):</strong> Base de R$ 8.475,55 e alíquotas progressivas.</li>
                <li><strong>Imposto de Renda (RFB):</strong> Nova faixa de isenção e tabelas de dedução vigentes.</li>
            </ul>
          </section>

          <section className="bg-blue-50 p-6 rounded-xl border border-blue-100 not-prose mb-8">
            <h4 className="font-bold text-blue-900 text-lg mb-2">Transparência Editorial</h4>
            <p className="text-blue-800">
              Este site é mantido por uma equipe independente de desenvolvedores e entusiastas de educação financeira.
              Embora nos esforcemos pela máxima precisão, <strong>não somos um órgão governamental</strong> e não temos vínculo com o Ministério do Trabalho.
              Nossa ferramenta serve como simulador para planejamento pessoal.
            </p>
          </section>

          <section>
            <h3>Contato e Suporte</h3>
            <p>
              Valorizamos o feedback da nossa comunidade. Se você encontrou algum erro, tem sugestões de melhoria ou deseja anunciar conosco, entre em contato:
            </p>
            <a href="mailto:contato@calculadorasalariobr.com.br" className="inline-flex items-center font-bold text-blue-600 hover:text-blue-800 text-lg no-underline hover:underline">
              ✉️ contato@calculadorasalariobr.com.br
            </a>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AboutView;
