
import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto pb-24 animate-fade-in-up">
      <Helmet>
        <title>Termos de Uso - Calculadora Salário 2026</title>
        <meta name="description" content="Termos de Uso e Condições do site Calculadora Salário 2026. Leia sobre nossas isenções legais." />
        <link rel="canonical" href="https://calculadorasalariobr.com.br/termos" />
      </Helmet>

      <header className="mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">Termos de <span className="text-blue-600">Uso</span></h2>
        <p className="text-slate-500 text-lg md:text-xl mt-3 max-w-2xl leading-relaxed">Regulamento e isenções legais para o uso consciente das nossas ferramentas de simulação.</p>
      </header>

      <div className="glass-card p-8 md:p-14 rounded-[3rem] border-none shadow-2xl">
        <div className="prose prose-slate prose-lg max-w-none text-slate-600">

          <div className="bg-red-50/50 p-8 rounded-[2rem] border border-red-100/50 not-prose mb-12">
            <h4 className="font-black text-red-900 text-lg mb-3 flex items-center gap-2 lowercase">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Aviso de Isenção Legal
            </h4>
            <p className="text-red-800 font-medium leading-relaxed italic">
                Os resultados gerados são simulações matemáticas e **não substituem** a homologação formal de profissionais de contabilidade ou o RH das empresas. O portal não se responsabiliza por decisões financeiras tomadas com base nestas estimativas.
            </p>
          </div>

          <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight uppercase tracking-widest text-sm">1. Uso das Ferramentas</h3>
          <p>É permitida a utilização pessoal e não comercial das calculadoras para fins de planejamento educacional. É proibida a reprodução total ou parcial do código e algoritmos deste portal sem autorização expressa.</p>

          <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight mt-12 uppercase tracking-widest text-sm">2. Precisão das Regras 2026</h3>
          <p>Embora nos esforcemos para manter as tabelas de 2026 atualizadas (INSS, IRRF, Salário Mínimo), a legislação pode sofrer alterações pontuais através de Medidas Provisórias. O usuário é responsável por verificar a vigência da lei no momento do seu cálculo.</p>

          <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight mt-12 uppercase tracking-widest text-sm">3. Limitações</h3>
          <p>Em nenhum caso a Calculadora Salário 2026 será responsável por danos decorrentes do uso ou da incapacidade de usar os materiais em seu site, mesmo que tenhamos sido notificados oralmente ou por escrito da possibilidade de tais danos.</p>

          <div className="mt-16 text-center opacity-30">
              <div className="flex justify-center gap-2 mb-4">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-1.5 w-1.5 rounded-full bg-slate-900"></div>)}
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.4em]">Fim do Documento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsView;
