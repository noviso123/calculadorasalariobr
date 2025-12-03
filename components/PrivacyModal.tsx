import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden relative flex flex-col animate-[fadeIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Política de Privacidade
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 12"/></svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto text-slate-600 text-sm leading-relaxed space-y-5">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Última atualização: Janeiro de 2026</p>
          
          <p>A sua privacidade é extremamente importante para nós. Esta política de privacidade documenta os tipos de informações pessoais que são recebidas e coletadas pelo <strong>Calculadora Salário 2026</strong> e como elas são utilizadas.</p>
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-900 text-base mb-2">Resumo LGPD</h4>
            <p className="text-blue-800">Nós não coletamos dados pessoais sensíveis (como nome, CPF ou e-mail) nos formulários de cálculo. Todos os cálculos são realizados localmente no seu navegador ou de forma anônima. Os cookies são utilizados apenas para fins publicitários e estatísticos.</p>
          </div>

          <h4 className="font-bold text-slate-800 text-base border-b pb-1">1. Arquivos de Log</h4>
          <p>Como muitos outros sites, nós fazemos uso de arquivos de log. As informações dentro dos arquivos de log incluem endereços de protocolo de internet (IP), tipo de navegador, provedor de serviços de Internet (ISP), carimbo de data/hora, páginas de referência/saída e número de cliques para analisar tendências, administrar o site, rastrear o movimento do usuário no site e coletar informações demográficas. Endereços IP e outras informações não estão vinculados a nenhuma informação que seja pessoalmente identificável.</p>
          
          <h4 className="font-bold text-slate-800 text-base border-b pb-1">2. Cookies e Web Beacons</h4>
          <p>Utilizamos cookies para armazenar informações sobre as preferências dos visitantes, registrar informações específicas do usuário sobre as páginas que o usuário acessa ou visita, personalizar o conteúdo da página da web com base no tipo de navegador do visitante ou outras informações que o visitante envia através do seu navegador.</p>

          <h4 className="font-bold text-slate-800 text-base border-b pb-1">3. Cookie DoubleClick DART</h4>
          <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
             <li>O Google, como fornecedor terceirizado, utiliza cookies para veicular anúncios em nosso site.</li>
             <li>O uso do cookie DART pelo Google permite que ele veicule anúncios para nossos usuários com base em sua visita ao nosso site e a outros sites na Internet.</li>
             <li>Os usuários podem optar por não usar o cookie DART visitando a Política de Privacidade da rede de conteúdo e anúncios do Google no seguinte URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="nofollow noreferrer" className="text-blue-600 underline">https://policies.google.com/technologies/ads</a></li>
          </ul>

          <h4 className="font-bold text-slate-800 text-base border-b pb-1">4. Nossos Parceiros Publicitários</h4>
          <p>Alguns dos nossos parceiros publicitários podem usar cookies e web beacons em nosso site. Nosso parceiro publicitário inclui o <strong>Google AdSense</strong>.</p>
          <p>Esses servidores de anúncios de terceiros ou redes de anúncios usam tecnologia para os anúncios e links que aparecem no Calculadora Salário 2026 enviados diretamente para o seu navegador. Eles recebem automaticamente o seu endereço IP quando isso ocorre. Outras tecnologias (como cookies, JavaScript ou Web Beacons) também podem ser usadas pelas redes de anúncios de terceiros para medir a eficácia de suas campanhas publicitárias e/ou para personalizar o conteúdo publicitário que você vê.</p>

          <h4 className="font-bold text-slate-800 text-base border-b pb-1">5. Consentimento</h4>
          <p>Ao utilizar nosso site, você concorda com nossa política de privacidade e concorda com seus termos. Se tiver dúvidas, entre em contato.</p>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors">
            Entendi e Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;