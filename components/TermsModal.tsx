
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden relative flex flex-col animate-[fadeIn_0.3s_ease-out]">

        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Termos de Uso
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 12"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-slate-600 text-sm leading-relaxed space-y-5">
          <p>Ao acessar o site <strong>Calculadora Salário 2026</strong>, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>

          <h4 className="font-bold text-slate-800 text-base border-b pb-1">1. Isenção de Responsabilidade (Disclaimer)</h4>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <p className="text-red-900 font-medium">
              Os materiais no site da Calculadora Salário 2026 são fornecidos "como estão". Esta ferramenta é destinada a simulações e estimativas.
              <strong>Os resultados não têm valor legal para fins de homologação trabalhista.</strong>
              Podem ocorrer variações devido a Convenções Coletivas de Trabalho (CCT), particularidades contratuais e interpretações jurídicas.
              Recomendamos sempre a conferência por um contador ou profissional de RH qualificado.
            </p>
          </div>

          <h4 className="font-bold text-slate-800 text-base border-b pb-1">2. Uso de Licença</h4>
          <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Calculadora Salário 2026, apenas para visualização transitória pessoal e não comercial.</p>

          <h4 className="font-bold text-slate-800 text-base border-b pb-1">3. Precisão dos Materiais</h4>
          <p>Os materiais exibidos no site da Calculadora Salário 2026 podem incluir erros técnicos, tipográficos ou fotográficos. Não garantimos que qualquer material em seu site seja preciso, completo ou atual, embora nos esforcemos para manter as tabelas de INSS e IRRF atualizadas conforme a legislação vigente.</p>

          <h4 className="font-bold text-slate-800 text-base border-b pb-1">4. Links</h4>
          <p>O Calculadora Salário 2026 não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Calculadora Salário 2026 do site. O uso de qualquer site vinculado é por conta e risco do usuário.</p>

          <h4 className="font-bold text-slate-800 text-base border-b pb-1">5. Modificações</h4>
          <p>O Calculadora Salário 2026 pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.</p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-200">
            Concordo e Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
