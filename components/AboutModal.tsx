
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden relative flex flex-col animate-[fadeIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Sobre Nós
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 12"/></svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto text-slate-600 text-sm leading-relaxed space-y-6">
          
          <section>
            <h4 className="font-bold text-slate-800 text-lg mb-2">Nossa Missão</h4>
            <p>
              O <strong>Calculadora Salário 2026</strong> nasceu com um propósito claro: democratizar o acesso à informação trabalhista no Brasil. 
              Sabemos que a legislação (CLT) pode ser complexa e que o cálculo de impostos como INSS e IRPF gera muitas dúvidas. 
              Nossa missão é fornecer ferramentas gratuitas, rápidas e transparentes para que todo trabalhador entenda exatamente quanto ganha e quais são seus direitos.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-800 text-lg mb-2">Compromisso com a Verdade (Dados Oficiais)</h4>
            <p className="mb-2">
              Em um cenário de desinformação, a precisão é nossa prioridade. Todos os algoritmos de cálculo utilizados neste site são auditados periodicamente e baseados estritamente em:
            </p>
            <ul className="list-disc pl-5 space-y-1 marker:text-blue-500">
                <li><strong>Decreto-lei nº 5.452 (CLT):</strong> Consolidação das Leis do Trabalho.</li>
                <li><strong>Instruções Normativas da Receita Federal:</strong> Para tabelas de Imposto de Renda Retido na Fonte (IRRF).</li>
                <li><strong>Portarias do Ministério da Previdência Social:</strong> Para atualização das faixas de contribuição do INSS.</li>
                <li><strong>Leis Complementares:</strong> Referentes ao FGTS (Fundo de Garantia) e Aviso Prévio.</li>
            </ul>
          </section>

          <section className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-900 text-base mb-2">Transparência Editorial</h4>
            <p className="text-blue-800 text-sm">
              Este site é mantido por uma equipe independente de desenvolvedores e entusiastas de educação financeira. 
              Embora nos esforcemos pela máxima precisão, <strong>não somos um órgão governamental</strong> e não temos vínculo com o Ministério do Trabalho. 
              Nossa ferramenta serve como simulador para planejamento pessoal.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-800 text-lg mb-2">Contato e Suporte</h4>
            <p>
              Valorizamos o feedback da nossa comunidade. Se você encontrou algum erro, tem sugestões de melhoria ou deseja anunciar conosco, entre em contato:
            </p>
            <a href="mailto:contato@calculadorasalariobr.com.br" className="mt-2 inline-flex items-center font-bold text-blue-600 hover:text-blue-800">
              ✉️ contato@calculadorasalariobr.com.br
            </a>
          </section>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
