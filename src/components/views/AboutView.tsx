
import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto pb-24 animate-fade-in-up">
       <Helmet>
        <title>Sobre Nós - Calculadora Salário 2026</title>
        <meta name="description" content="Conheça a missão do Calculadora Salário 2026. Transparência, dados oficiais e educação financeira gratuita para todos os brasileiros." />
        <link rel="canonical" href="https://calculadorasalariobr.com.br/sobre" />
      </Helmet>

      <header className="mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">Sobre o <span className="text-blue-600">Projeto</span></h2>
        <p className="text-slate-500 text-lg md:text-xl mt-3 max-w-2xl leading-relaxed">Nossa missão é democratizar a educação financeira e o entendimento dos direitos trabalhistas no Brasil.</p>
      </header>

      <div className="glass-card p-8 md:p-14 rounded-[3rem] border-none shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-600 relative z-10">

          <section className="mb-12">
            <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Propósito e Missão</h3>
            <p className="leading-relaxed">
              O <strong>Calculadora Salário 2026</strong> nasceu em um momento de transição na economia brasileira. Com as atualizações constantes nas tabelas de INSS, o novo teto de isenção do Imposto de Renda e as regras do Consignado, o trabalhador brasileiro precisava de uma ferramenta que fosse não apenas precisa, mas também fácil de usar e extremamente rápida.
            </p>
            <p className="mt-4 leading-relaxed">
              Nossa missão é fornecer ferramentas gratuitas, transparentes e baseadas 100% em dados oficiais para que cada cidadão possa planejar sua vida financeira com segurança.
            </p>
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Compromisso com a Precisão</h3>
            <p>
              Em um cenário de desinformação, a precisão é nossa prioridade. Todos os algoritmos de cálculo utilizados neste site são auditados e baseados estritamente nas fontes oficiais:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 not-prose">
                {[
                    { title: 'CLT Atualizada', desc: 'Base legal para cálculos de rescisão e férias.' },
                    { title: 'Lei 14.431/2022', desc: 'Diretrizes para margem consignável e FGTS.' },
                    { title: 'Teto INSS 2026', desc: 'Base progressiva de R$ 8.475,55.' },
                    { title: 'IRPF Federal', desc: 'Nova tabela de isenção e deduções.' }
                ].map((item, i) => (
                    <div key={i} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                        <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                    </div>
                ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-10 rounded-[2rem] not-prose mb-12 shadow-xl shadow-blue-500/10">
            <h4 className="font-black text-white text-xl mb-4 tracking-tight">Transparência Editorial</h4>
            <p className="text-blue-100 leading-relaxed font-medium">
              Este site é mantido por uma equipe independente de especialistas. Embora nos esforcemos pela máxima precisão, <strong>não somos um órgão governamental</strong>. Nossas simulações servem para planejamento pessoal e educativo.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Contato</h3>
            <p className="mb-6">Dúvida, sugestão ou feedback? Adoramos ouvir nossa comunidade.</p>
            <a href="mailto:contato@calculadorasalariobr.com.br" className="inline-flex items-center gap-3 bg-white border border-slate-200 px-6 py-4 rounded-2xl font-black text-blue-600 hover:border-blue-500 hover:shadow-lg transition-all active:scale-95 group">
              <span className="text-2xl group-hover:scale-110 transition-transform">✉️</span>
              contato@calculadorasalariobr.com.br
            </a>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AboutView;
