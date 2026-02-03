import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto pb-24">
      <Helmet>
        <title>Política de Privacidade - Calculadora Salário 2026</title>
        <meta name="description" content="Política de Privacidade do Calculadora Salário 2026. Saiba como protegemos seus dados e como utilizamos cookies." />
        <link rel="canonical" href="https://calculadorasalario2026.com.br/politica-privacidade" />
      </Helmet>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Política de Privacidade
        </h1>

        <div className="prose prose-blue max-w-none text-slate-600">
          <p className="text-sm text-slate-400 uppercase font-bold tracking-wider mb-6">Última atualização: Janeiro de 2026</p>

          <p>A sua privacidade é extremamente importante para nós. Esta política de privacidade documenta os tipos de informações pessoais que são recebidas e coletadas pelo <strong>Calculadora Salário 2026</strong> e como elas são utilizadas.</p>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 not-prose mb-8">
            <h4 className="font-bold text-blue-900 text-lg mb-2">Resumo LGPD</h4>
            <p className="text-blue-800">Nós não coletamos dados pessoais sensíveis (como nome, CPF ou e-mail) nos formulários de cálculo. Todos os cálculos são realizados localmente no seu navegador ou de forma anônima. Os cookies são utilizados apenas para fins publicitários e estatísticos.</p>
          </div>

          <h3>1. Arquivos de Log</h3>
          <p>Como muitos outros sites, nós fazemos uso de arquivos de log. As informações dentro dos arquivos de log incluem endereços de protocolo de internet (IP), tipo de navegador, provedor de serviços de Internet (ISP), carimbo de data/hora, páginas de referência/saída e número de cliques para analisar tendências, administrar o site, rastrear o movimento do usuário no site e coletar informações demográficas. Endereços IP e outras informações não estão vinculados a nenhuma informação que seja pessoalmente identificável.</p>

          <h3>2. Cookies e Web Beacons</h3>
          <p>Utilizamos cookies para armazenar informações sobre as preferências dos visitantes, registrar informações específicas do usuário sobre as páginas que o usuário acessa ou visita, personalizar o conteúdo da página da web com base no tipo de navegador do visitante ou outras informações que o visitante envia através do seu navegador.</p>

          <h3>3. Cookie DoubleClick DART</h3>
          <ul>
             <li>O Google, como fornecedor terceirizado, utiliza cookies para veicular anúncios em nosso site.</li>
             <li>O uso do cookie DART pelo Google permite que ele veicule anúncios para nossos usuários com base em sua visita ao nosso site e a outros sites na Internet.</li>
             <li>Os usuários podem optar por não usar o cookie DART visitando a Política de Privacidade da rede de conteúdo e anúncios do Google no seguinte URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="nofollow noreferrer">https://policies.google.com/technologies/ads</a></li>
          </ul>

          <h3>4. Nossos Parceiros Publicitários</h3>
          <p>Alguns dos nossos parceiros publicitários podem usar cookies e web beacons em nosso site. Nosso parceiro publicitário inclui o <strong>Google AdSense</strong>.</p>
          <p>Esses servidores de anúncios de terceiros ou redes de anúncios usam tecnologia para os anúncios e links que aparecem no Calculadora Salário 2026 enviados diretamente para o seu navegador. Eles recebem automaticamente o seu endereço IP quando isso ocorre. Outras tecnologias (como cookies, JavaScript ou Web Beacons) também podem ser usadas pelas redes de anúncios de terceiros para medir a eficácia de suas campanhas publicitárias e/ou para personalizar o conteúdo publicitário que você vê.</p>

          <h3>5. Consentimento</h3>
          <p>Ao utilizar nosso site, você concorda com nossa política de privacidade e concorda com seus termos.</p>

          <h3>6. Simulações Financeiras e Consignado</h3>
          <p><strong>Isenção de Responsabilidade:</strong> As ferramentas de cálculo de salário, rescisão e empréstimo consignado são apenas para fins informativos e de simulação.</p>
          <ul>
            <li>Não armazenamos dados bancários, saldos de FGTS ou informações de crédito.</li>
            <li>Os valores inseridos para cálculo de Garantia de FGTS e Margem Consignável são processados localmente no seu dispositivo e descartados ao fechar a página.</li>
            <li>O site não realiza empréstimos e não tem vínculo com instituições financeiras.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyView;
