import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto pb-24">
      <Helmet>
        <title>Termos de Uso - Calculadora Salário 2026</title>
        <meta name="description" content="Termos de Uso e Condições do site Calculadora Salário 2026. Leia sobre responsabilidades e isenções legais." />
        <link rel="canonical" href="https://calculadorasalario2026.com.br/termos" />
      </Helmet>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Termos de Uso
        </h1>

        <div className="prose prose-blue max-w-none text-slate-600">
          <p className="lead">Ao acessar o site <strong>Calculadora Salário 2026</strong>, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>

          <div className="bg-red-50 p-6 rounded-xl border border-red-100 not-prose mb-8">
            <h4 className="font-bold text-red-900 text-lg mb-2">1. Isenção de Responsabilidade (Disclaimer)</h4>
            <p className="text-red-800">
              Os materiais no site da Calculadora Salário 2026 são fornecidos "como estão". Esta ferramenta é destinada a simulações e estimativas.
              <strong>Os resultados não têm valor legal para fins de homologação trabalhista.</strong>
              Podem ocorrer variações devido a Convenções Coletivas de Trabalho (CCT), particularidades contratuais e interpretações jurídicas.
              Recomendamos sempre a conferência por um contador ou profissional de RH qualificado.
            </p>
          </div>

          <h3>2. Uso de Licença</h3>
          <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Calculadora Salário 2026, apenas para visualização transitória pessoal e não comercial.</p>

          <h3>3. Precisão dos Materiais</h3>
          <p>Os materiais exibidos no site da Calculadora Salário 2026 podem incluir erros técnicos, tipográficos ou fotográficos. Não garantimos que qualquer material em seu site seja preciso, completo ou atual, embora nos esforcemos para manter as tabelas de INSS e IRRF atualizadas conforme a legislação vigente.</p>

          <h3>4. Links</h3>
          <p>O Calculadora Salário 2026 não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Calculadora Salário 2026 do site. O uso de qualquer site vinculado é por conta e risco do usuário.</p>

          <h3>5. Modificações</h3>
          <p>O Calculadora Salário 2026 pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsView;
