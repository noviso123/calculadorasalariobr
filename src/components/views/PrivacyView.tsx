
import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto pb-24 animate-fade-in-up">
      <Helmet>
        <title>Privacidade - Calculadora Salário 2026</title>
        <meta name="description" content="Política de Privacidade do Calculadora Salário 2026. Saiba como protegemos seus dados." />
        <link rel="canonical" href="https://calculadorasalario2026.com.br/politica-privacidade" />
      </Helmet>

      <header className="mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">Privacidade e <span className="text-blue-600">Dados</span></h2>
        <p className="text-slate-500 text-lg md:text-xl mt-3 max-w-2xl leading-relaxed">Sua segurança é nossa prioridade. Entenda como processamos suas simulações de forma anônima.</p>
      </header>

      <div className="glass-card p-8 md:p-14 rounded-[3rem] border-none shadow-2xl relative">
        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-8">Atualizado em 03 de Fevereiro de 2026</p>

          <div className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100/50 not-prose mb-12">
            <h4 className="font-black text-emerald-900 text-lg mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Compromisso com a LGPD
            </h4>
            <p className="text-emerald-800 font-medium leading-relaxed">
                Nós **não coletamos** dados pessoais sensíveis (nome, CPF, endereço). Todos os cálculos são realizados de forma anônima. Os cookies são utilizados apenas para performance e publicidade contextual.
            </p>
          </div>

          <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight italic">1. Simulações Anônimas</h3>
          <p>Diferente de sistemas bancários, o Calculadora Salário 2026 não exige login. Os valores inseridos para cálculos de Margem Consignável, FGTS ou Salário são processados localmente e descartados assim que você fecha a aba do navegador.</p>

          <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight mt-12">2. Google AdSense e Cookies</h3>
          <p>Utilizamos o Google AdSense para veicular anúncios. O Google pode usar cookies (como o cookie DART) para exibir anúncios baseados em suas visitas a este e outros sites. Você pode desativar o uso do cookie DART visitando a política de privacidade da rede de anúncios e conteúdo do Google.</p>

          <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight mt-12 italic">3. Segurança</h3>
          <p>Implementamos protocolos de segurança modernos para garantir que sua navegação seja protegida. Não vendemos, trocamos ou alugamos informações de identificação dos usuários para terceiros sob nenhuma circunstância.</p>

          <div className="mt-16 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center not-prose">
              <p className="text-slate-500 font-medium italic mb-2 leading-relaxed">
                  "Ao utilizar nosso portal, você manifesta sua concordância com estes termos."
              </p>
              <div className="h-1 w-12 bg-blue-400 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyView;
