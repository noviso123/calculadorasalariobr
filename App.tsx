
import React, { useState, useEffect } from 'react';
import { CalculationResult, SalaryInput, ViewType, ThirteenthInput, ThirteenthResult, TerminationInput, TerminationResult, ExtrasInput, ExtrasBreakdown, VacationInput, VacationResult } from './types';
import { calculateSalary, calculateThirteenth, calculateTermination, calculateVacation } from './services/taxService';
import PieChartVisual from './components/PieChartVisual';
import AIAdvisor from './components/AIAdvisor';
import AdUnit from './components/AdUnit';

// --- AD SENSE SLOTS (PLACEHOLDERS - SUBSTITUA PELOS SEUS IDS REAIS DO GOOGLE) ---
const AD_SLOTS = {
  TOP_BANNER: "top-banner-slot",           // Anúncio do Topo (Horizontal)
  SIDEBAR: "sidebar-ad-slot",              // Anúncio do Menu Lateral (Quadrado/Retângulo)
  MIDDLE_MOBILE: "mobile-middle-slot",     // Anúncio no meio do resultado (Mobile)
  MIDDLE_CONTENT: "middle-content-slot",   // Anúncio no meio do conteúdo (Geral)
  MIDDLE_THIRTEENTH: "middle-thirteenth-slot",
  MIDDLE_TERMINATION: "middle-termination-slot",
  BOTTOM: "bottom-slot",                   // Anúncio de Rodapé
  BOTTOM_VACATION: "bottom-vacation-slot",
  BOTTOM_TERMINATION: "bottom-termination-slot"
};

// --- ICONS ---
const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>;
const CoinsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7 .71-2.82 2.82"/></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 12"/></svg>;

// --- MAIN APP ---
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('salary');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- INITIAL STATES ---
  const initialExtras: ExtrasInput = {
    workload: 220, hours50: 0, hours100: 0, hoursNight: 0, hoursStandby: 0, hoursInterjornada: 0, includeDsr: true
  };

  const [salaryData, setSalaryData] = useState<SalaryInput>({
    grossSalary: 0, dependents: 0, otherDiscounts: 0, healthInsurance: 0,
    transportVoucherPercent: 6, includeTransportVoucher: false, transportDailyCost: 0, workDays: 22,
    includeExtras: false, extras: initialExtras
  });
  const [salaryResult, setSalaryResult] = useState<CalculationResult | null>(null);

  const [thirteenthData, setThirteenthData] = useState<ThirteenthInput>({
    grossSalary: 0, monthsWorked: 12, dependents: 0,
    includeExtras: false, extras: initialExtras
  });
  const [thirteenthResult, setThirteenthResult] = useState<ThirteenthResult | null>(null);

  const [terminationData, setTerminationData] = useState<TerminationInput>({
    grossSalary: 0, startDate: '', endDate: '', reason: 'dismissal_no_cause', noticeStatus: 'indemnified', hasExpiredVacation: false, thirteenthAdvancePaid: false, dependents: 0,
    includeExtras: false, extras: initialExtras
  });
  const [terminationResult, setTerminationResult] = useState<TerminationResult | null>(null);

  const [vacationData, setVacationData] = useState<VacationInput>({
    grossSalary: 0, dependents: 0, daysTaken: 30, sellDays: false, daysSold: 10, advanceThirteenth: false,
    includeExtras: false, extras: initialExtras
  });
  const [vacationResult, setVacationResult] = useState<VacationResult | null>(null);

  // --- AUTOMATION EFFECT FOR 13th ADVANCE ---
  useEffect(() => {
    if (terminationData.endDate) {
      const end = new Date(terminationData.endDate + 'T12:00:00');
      const month = end.getMonth(); // 0-11
      
      // Regra 1: Se estamos em Dezembro (11), legalmente a 1ª parcela já deve ter sido paga.
      if (month === 11) {
         setTerminationData(prev => ({ ...prev, thirteenthAdvancePaid: true }));
      }
      // Regra 2 (EXCEÇÃO): Se estamos em Janeiro, o 13º proporcional é do NOVO ano. 
      // Não deve descontar adiantamento do ano anterior.
      else if (month === 0) {
         setTerminationData(prev => ({ ...prev, thirteenthAdvancePaid: false }));
      }
    }
  }, [terminationData.endDate]);


  // --- HANDLERS ---
  const handleSalaryCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setSalaryResult(calculateSalary(salaryData));
  };

  const handleThirteenthCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setThirteenthResult(calculateThirteenth(thirteenthData));
  };

  const handleTerminationCalc = (e: React.FormEvent) => {
    e.preventDefault();
    if(terminationData.startDate && terminationData.endDate) {
      setTerminationResult(calculateTermination(terminationData));
    }
  };

  const handleVacationCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setVacationResult(calculateVacation(vacationData));
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const NavItem = ({ view, icon, label }: { view: ViewType, icon: React.ReactNode, label: string }) => (
    <button 
      onClick={() => { setCurrentView(view); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${currentView === view ? 'bg-blue-700 text-white shadow-lg shadow-blue-900/20' : 'text-blue-100 hover:bg-white/10'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-800 font-sans flex flex-col md:flex-row overflow-x-hidden">
      
      {/* MOBILE HEADER - BUTTON ON LEFT */}
      <div className="md:hidden bg-[#1e3a8a] text-white p-4 flex items-center justify-start gap-4 sticky top-0 z-50 shadow-md">
         <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 hover:bg-white/10 rounded-lg"><MenuIcon /></button>
         <span className="font-bold text-lg flex items-center gap-2"><CalculatorIcon /> Calc 2026</span>
      </div>

      {/* MOBILE MENU BACKDROP */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR (RESPONSIVE) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1e3a8a] text-white transform transition-transform duration-300 ease-in-out shadow-2xl 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:relative md:sticky md:top-0 md:h-screen md:flex md:w-64 md:flex-col md:shadow-none lg:w-72`}
      >
        <div className="p-6 border-b border-blue-800 flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg hidden md:block">
              <CalculatorIcon />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Cálculo <span className="text-blue-300 font-light">2026</span></h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-blue-200"><CloseIcon /></button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem view="salary" icon={<CalculatorIcon />} label="Salário Líquido" />
          <NavItem view="vacation" icon={<SunIcon />} label="Férias" />
          <NavItem view="thirteenth" icon={<CoinsIcon />} label="Décimo Terceiro" />
          <NavItem view="termination" icon={<BriefcaseIcon />} label="Rescisão" />
        </nav>

        {/* SIDEBAR AD UNIT (Visible on Desktop AND Mobile Menu) */}
        <div className="p-4">
           <AdUnit slotId={AD_SLOTS.SIDEBAR} format="rectangle" />
        </div>

        <div className="p-6 border-t border-blue-800">
          <div className="bg-blue-900/50 p-4 rounded-xl text-xs text-blue-200 border border-blue-800/50">
            <p className="font-bold text-white mb-2 text-sm">Base Legal 2026</p>
            <p className="flex justify-between"><span>Salário Mínimo:</span> <span className="text-white">R$ 1.631</span></p>
            <p className="flex justify-between"><span>Isenção IR:</span> <span className="text-white">Até 5k</span></p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto h-auto md:h-screen">
        
        {/* TOP AD UNIT */}
        <AdUnit slotId={AD_SLOTS.TOP_BANNER} className="mb-8" />

        {/* VIEW: SALARIO LIQUIDO */}
        {currentView === 'salary' && (
          <div className="max-w-7xl mx-auto animate-fade-in space-y-6 md:space-y-8">
            <header>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Salário Líquido</h2>
              <p className="text-slate-500 text-sm md:text-base mt-1">Simule seus ganhos reais com as novas regras de 2026.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              {/* Input Section */}
              <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
                 <form onSubmit={handleSalaryCalc} className="space-y-5">
                    <InputGroup label="Salário Bruto" name="grossSalary" value={salaryData.grossSalary} onChange={(v) => setSalaryData({...salaryData, grossSalary: Number(v)})} required />
                    
                    {/* EXTRAS SECTION */}
                    <ExtrasSection 
                      isActive={salaryData.includeExtras} 
                      onToggle={(checked) => setSalaryData({...salaryData, includeExtras: checked})}
                      data={salaryData.extras}
                      onChange={(newExtras) => setSalaryData({...salaryData, extras: newExtras})}
                    />

                    {/* VT Toggle */}
                    <div className={`p-4 rounded-xl border transition-all ${salaryData.includeTransportVoucher ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" checked={salaryData.includeTransportVoucher} onChange={(e) => setSalaryData({...salaryData, includeTransportVoucher: e.target.checked})} className="h-5 w-5 accent-blue-600 rounded" />
                        <span className="text-sm font-semibold text-slate-700">Incluir Vale Transporte</span>
                      </label>
                      {salaryData.includeTransportVoucher && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                          <InputGroup label="Custo Diário" name="transportDailyCost" value={salaryData.transportDailyCost} onChange={(v) => setSalaryData({...salaryData, transportDailyCost: Number(v)})} isSmall />
                          <InputGroup label="Dias Úteis" name="workDays" value={salaryData.workDays} onChange={(v) => setSalaryData({...salaryData, workDays: Number(v)})} isSmall />
                        </div>
                      )}
                    </div>

                    <InputGroup label="Plano de Saúde" name="healthInsurance" value={salaryData.healthInsurance} onChange={(v) => setSalaryData({...salaryData, healthInsurance: Number(v)})} />
                    <InputGroup label="Outros Descontos" name="otherDiscounts" value={salaryData.otherDiscounts} onChange={(v) => setSalaryData({...salaryData, otherDiscounts: Number(v)})} />
                    
                    <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] text-lg">
                      Calcular Líquido
                    </button>
                 </form>
              </div>

              {/* Result Section */}
              {salaryResult && (
                <div className="lg:col-span-7 space-y-6 animate-fade-in">
                   {/* MIDDLE AD UNIT (High Engagement) */}
                   <div className="block lg:hidden">
                      <AdUnit slotId={AD_SLOTS.MIDDLE_MOBILE} />
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ResultCard label="Salário Líquido" value={salaryResult.netSalary} isMain />
                      <ResultCard label="Total Descontos" value={salaryResult.totalDiscounts} isDanger />
                   </div>
                   
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                      <h4 className="font-bold text-slate-800 mb-5 border-b pb-3 flex justify-between items-center">
                        <span>Detalhamento</span>
                        <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded">Base 2026</span>
                      </h4>
                      <div className="space-y-3 text-sm md:text-base">
                        <Row label="Salário Bruto Base" value={salaryResult.grossSalary} isPositive />
                        
                        {/* DETALHAMENTO DE EXTRAS */}
                        {salaryResult.totalExtras > 0 && (
                          <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100/50 space-y-1 my-2">
                             <ExtrasDetailedRows breakdown={salaryResult.extrasBreakdown} />
                          </div>
                        )}

                        <Row label="INSS" value={-salaryResult.inss} />
                        <Row label="IRPF" value={-salaryResult.irpf} highlight={salaryResult.irpf === 0} />
                        {salaryResult.transportVoucher > 0 && <Row label="Vale Transporte" value={-salaryResult.transportVoucher} />}
                        {salaryResult.healthInsurance > 0 && <Row label="Plano de Saúde" value={-salaryResult.healthInsurance} />}
                        {salaryResult.otherDiscounts > 0 && <Row label="Outros" value={-salaryResult.otherDiscounts} />}
                        
                        <div className="border-t border-slate-100 mt-4 pt-3">
                           <Row label="FGTS Mensal (Depósito)" value={salaryResult.fgtsMonthly} informational />
                        </div>
                      </div>
                      <div className="mt-8 flex justify-center h-56 md:h-64">
                         <PieChartVisual data={salaryResult} />
                      </div>
                   </div>
                   <AIAdvisor result={salaryResult} />
                   
                   {/* BOTTOM AD UNIT */}
                   <AdUnit slotId={AD_SLOTS.BOTTOM} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: FÉRIAS */}
        {currentView === 'vacation' && (
           <div className="max-w-5xl mx-auto animate-fade-in space-y-6 md:space-y-8">
             <header>
               <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Calculadora de Férias</h2>
               <p className="text-slate-500 text-sm md:text-base mt-1">Simule o valor a receber nas suas férias.</p>
             </header>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
                  <form onSubmit={handleVacationCalc} className="space-y-5">
                     <InputGroup label="Salário Bruto" name="grossSalary" value={vacationData.grossSalary} onChange={(v) => setVacationData({...vacationData, grossSalary: Number(v)})} required />
                     
                     <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Dias de Descanso</label>
                        <select 
                          value={vacationData.daysTaken}
                          onChange={(e) => setVacationData({...vacationData, daysTaken: Number(e.target.value)})}
                          className="w-full p-3 border rounded-xl bg-slate-50 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
                        >
                           <option value="30">30 dias</option>
                           <option value="20">20 dias</option>
                           <option value="15">15 dias</option>
                           <option value="10">10 dias</option>
                        </select>
                     </div>

                     <div className={`p-4 rounded-xl border transition-all ${vacationData.sellDays ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                           <input type="checkbox" checked={vacationData.sellDays} onChange={(e) => setVacationData({...vacationData, sellDays: e.target.checked})} className="h-5 w-5 accent-blue-600 rounded" />
                           <span className="text-sm font-semibold text-slate-700">Vender Férias (Abono)?</span>
                        </label>
                        {vacationData.sellDays && (
                           <div className="mt-3 animate-fade-in">
                              <label className="block text-[10px] font-bold text-blue-700 mb-1 uppercase">Dias para Vender (Max 10)</label>
                              <input type="number" max="10" min="1" value={vacationData.daysSold} onChange={(e) => setVacationData({...vacationData, daysSold: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none" />
                           </div>
                        )}
                     </div>

                     <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                        <input type="checkbox" checked={vacationData.advanceThirteenth} onChange={(e) => setVacationData({...vacationData, advanceThirteenth: e.target.checked})} className="h-5 w-5 accent-blue-600 rounded" />
                        <span className="text-sm font-semibold text-slate-700">Adiantar 1ª Parcela 13º?</span>
                     </label>

                     <ExtrasSection 
                       isActive={vacationData.includeExtras} 
                       onToggle={(checked) => setVacationData({...vacationData, includeExtras: checked})}
                       data={vacationData.extras}
                       onChange={(newExtras) => setVacationData({...vacationData, extras: newExtras})}
                       labelOverride="Incluir Média de Extras"
                     />

                     <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-2 active:scale-[0.98] text-lg">Calcular Férias</button>
                  </form>
                </div>

                {vacationResult && (
                   <div className="lg:col-span-7 space-y-6 animate-fade-in">
                      {/* MIDDLE AD UNIT */}
                      <AdUnit slotId={AD_SLOTS.MIDDLE_CONTENT} />

                      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-yellow-400 flex flex-col items-center justify-center transform hover:scale-[1.01] transition-transform">
                          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest text-center mb-1">Total Líquido a Receber</p>
                          <p className="text-4xl md:text-5xl font-black text-center tracking-tight drop-shadow-sm">
                              {formatCurrency(vacationResult.totalNet)}
                          </p>
                      </div>

                      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100">
                          <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b">Detalhamento</h4>
                          <div className="space-y-3 text-sm md:text-base">
                             <Row label="Férias (Dias de Descanso)" value={vacationResult.vacationGross} isPositive />
                             <Row label="1/3 Constitucional" value={vacationResult.vacationThird} isPositive />
                             
                             {/* EXTRAS */}
                             {vacationResult.baseSalary > vacationData.grossSalary && (
                                <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100/50 space-y-1 my-2">
                                  <ExtrasDetailedRows breakdown={vacationResult.extrasBreakdown} />
                                </div>
                             )}

                             {vacationResult.allowanceGross > 0 && (
                                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 space-y-1 my-2">
                                   <Row label="(+) Abono Pecuniário (Venda)" value={vacationResult.allowanceGross} isPositive />
                                   <Row label="(+) 1/3 sobre Abono" value={vacationResult.allowanceThird} isPositive />
                                   <p className="text-[10px] text-emerald-600 font-semibold text-right">* Isento de IR e INSS</p>
                                </div>
                             )}

                             {vacationResult.advanceThirteenth > 0 && (
                                <Row label="Adiantamento 13º Salário" value={vacationResult.advanceThirteenth} isPositive />
                             )}

                             <div className="border-t border-slate-100 pt-3 mt-3 space-y-2">
                                <h5 className="text-xs font-bold text-slate-400 uppercase">Descontos (Sobre Férias + 1/3)</h5>
                                <Row label="(-) INSS" value={-vacationResult.discountInss} />
                                <Row label="(-) IRPF" value={-vacationResult.discountIr} highlight={vacationResult.discountIr === 0} />
                                <Row label="Total de Descontos" value={-vacationResult.totalDiscounts} informational />
                             </div>
                          </div>
                      </div>
                      
                      {/* BOTTOM AD UNIT */}
                      <AdUnit slotId={AD_SLOTS.BOTTOM_VACATION} />
                   </div>
                )}
             </div>
           </div>
        )}

        {/* VIEW: DECIMO TERCEIRO */}
        {currentView === 'thirteenth' && (
           <div className="max-w-5xl mx-auto animate-fade-in space-y-6 md:space-y-8">
              <header>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Décimo Terceiro</h2>
                <p className="text-slate-500 text-sm md:text-base mt-1">Simule o recebimento da 1ª e 2ª parcela.</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                 <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
                    <form onSubmit={handleThirteenthCalc} className="space-y-5">
                       <InputGroup label="Salário Bruto" name="grossSalary" value={thirteenthData.grossSalary} onChange={(v) => setThirteenthData({...thirteenthData, grossSalary: Number(v)})} required />
                       <InputGroup label="Meses Trabalhados" name="monthsWorked" value={thirteenthData.monthsWorked} onChange={(v) => setThirteenthData({...thirteenthData, monthsWorked: Math.min(12, Number(v))})} isSmall />
                       
                       <ExtrasSection 
                         isActive={thirteenthData.includeExtras} 
                         onToggle={(checked) => setThirteenthData({...thirteenthData, includeExtras: checked})}
                         data={thirteenthData.extras}
                         onChange={(newExtras) => setThirteenthData({...thirteenthData, extras: newExtras})}
                         labelOverride="Incluir Média de Extras"
                       />

                       <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-2 active:scale-[0.98] text-lg">Simular Parcelas</button>
                    </form>
                 </div>

                 {thirteenthResult && (
                    <div className="lg:col-span-7 space-y-6 animate-fade-in">
                       {/* MIDDLE AD UNIT */}
                       <AdUnit slotId={AD_SLOTS.MIDDLE_THIRTEENTH} />

                       <h3 className="font-bold text-slate-700 md:text-lg">Fluxo de Recebimento</h3>
                       
                       {/* PARCELA 1 */}
                       <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl relative overflow-hidden shadow-sm">
                          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <CoinsIcon />
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 mb-2">
                             <div>
                                <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider">1ª Parcela (Nov)</p>
                                <p className="text-3xl md:text-4xl font-extrabold text-emerald-800 mt-1">{formatCurrency(thirteenthResult.parcel1.value)}</p>
                             </div>
                             <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full w-fit">SEM DESCONTOS</span>
                          </div>
                          <p className="text-xs text-emerald-600">50% do valor bruto proporcional</p>
                       </div>

                       <div className="flex justify-center -my-2 opacity-30 text-slate-400 rotate-90 md:rotate-0">
                          <ArrowRightIcon />
                       </div>

                       {/* PARCELA 2 */}
                       <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                          <div className="flex justify-between items-end mb-4">
                             <div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">2ª Parcela (Dez)</p>
                                <p className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-1">{formatCurrency(thirteenthResult.parcel2.value)}</p>
                             </div>
                          </div>
                          
                          <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
                             <Row label="Valor Bruto Total" value={thirteenthResult.totalGross} isPositive />
                             
                             {/* DETALHAMENTO EXTRAS 13 */}
                             {thirteenthResult.totalExtrasAverage > 0 && (
                                <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100/50 space-y-1 my-2">
                                  <ExtrasDetailedRows breakdown={thirteenthResult.extrasBreakdown} />
                                </div>
                             )}

                             <Row label="(-) Adiantamento" value={-thirteenthResult.parcel2.discountAdvance} />
                             <Row label="(-) INSS Total" value={-thirteenthResult.parcel2.inss} />
                             <Row label="(-) IRPF Total" value={-thirteenthResult.parcel2.irpf} highlight={thirteenthResult.parcel2.irpf === 0} />
                          </div>
                       </div>
                       
                       {/* TOTAL LÍQUIDO DESTACADO */}
                       <div className="mt-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-blue-400 flex flex-col items-center justify-center transform hover:scale-[1.01] transition-transform">
                          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest text-center mb-1">Valor Total Líquido (Soma)</p>
                          <p className="text-4xl md:text-5xl font-black text-center tracking-tight drop-shadow-sm">
                              {formatCurrency(thirteenthResult.totalNet)}
                          </p>
                          <p className="text-center text-xs text-blue-200 mt-2 font-medium bg-blue-900/30 px-3 py-1 rounded-full">1ª Parcela + 2ª Parcela</p>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* VIEW: RESCISÃO */}
        {currentView === 'termination' && (
           <div className="max-w-7xl mx-auto animate-fade-in space-y-6 md:space-y-8">
              <header>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Rescisão</h2>
                <p className="text-slate-500 text-sm md:text-base mt-1">Estimativa de valores para desligamento.</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                 <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
                    <form onSubmit={handleTerminationCalc} className="space-y-4">
                       <InputGroup label="Salário Bruto" name="grossSalary" value={terminationData.grossSalary} onChange={(v) => setTerminationData({...terminationData, grossSalary: Number(v)})} required />
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Data Início (Admissão)</label>
                            <input type="date" value={terminationData.startDate} onChange={(e) => setTerminationData({...terminationData, startDate: e.target.value})} className="w-full p-3 border rounded-lg text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" required />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Data Fim (Saída)</label>
                            <input type="date" value={terminationData.endDate} onChange={(e) => setTerminationData({...terminationData, endDate: e.target.value})} className="w-full p-3 border rounded-lg text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" required />
                          </div>
                       </div>
                       
                       {terminationData.startDate && terminationData.endDate && terminationData.startDate > terminationData.endDate && (
                          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold animate-pulse border border-red-200">
                             ⚠️ Erro: Data de Início é maior que a Data de Fim. Verifique as datas.
                          </div>
                       )}
                       
                       <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Motivo do Desligamento</label>
                          <select 
                            value={terminationData.reason} 
                            onChange={(e) => {
                              const r = e.target.value as any;
                              // Auto set Notice Status based on Reason default
                              let ns = terminationData.noticeStatus;
                              if (r === 'dismissal_no_cause') ns = 'indemnified';
                              if (r === 'resignation') ns = 'worked';
                              if (r === 'dismissal_cause') ns = 'worked'; // Irrelevant
                              setTerminationData({...terminationData, reason: r, noticeStatus: ns});
                            }}
                            className="w-full p-3 border rounded-xl bg-slate-50 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
                          >
                             <option value="dismissal_no_cause">Demissão sem Justa Causa</option>
                             <option value="dismissal_cause">Demissão por Justa Causa</option>
                             <option value="resignation">Pedido de Demissão</option>
                          </select>
                       </div>

                       {terminationData.reason !== 'dismissal_cause' && (
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Situação do Aviso Prévio</label>
                            <select 
                              value={terminationData.noticeStatus} 
                              onChange={(e) => setTerminationData({...terminationData, noticeStatus: e.target.value as any})}
                              className="w-full p-3 border rounded-xl bg-slate-50 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
                            >
                               {terminationData.reason === 'dismissal_no_cause' && (
                                 <>
                                   <option value="indemnified">Indenizado (Recebe Valor)</option>
                                   <option value="worked">Trabalhado (Cumpre Dias)</option>
                                 </>
                               )}
                               {terminationData.reason === 'resignation' && (
                                 <>
                                   <option value="worked">Trabalhado (Normal)</option>
                                   <option value="not_fulfilled">Não Cumprido (Desconto)</option>
                                   <option value="waived">Não Cumprido (Dispensado/Sem Desconto)</option>
                                 </>
                               )}
                            </select>
                         </div>
                       )}

                       <ExtrasSection 
                         isActive={terminationData.includeExtras} 
                         onToggle={(checked) => setTerminationData({...terminationData, includeExtras: checked})}
                         data={terminationData.extras}
                         onChange={(newExtras) => setTerminationData({...terminationData, extras: newExtras})}
                         labelOverride="Incluir Extras do Período / Base"
                       />

                       <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                            <input type="checkbox" checked={terminationData.hasExpiredVacation} onChange={(e) => setTerminationData({...terminationData, hasExpiredVacation: e.target.checked})} className="h-5 w-5 accent-blue-600 rounded" />
                            <span className="text-sm font-semibold text-slate-700">Possui Férias Vencidas?</span>
                        </label>
                        
                        <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${terminationData.thirteenthAdvancePaid ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}>
                            <input type="checkbox" checked={terminationData.thirteenthAdvancePaid} onChange={(e) => setTerminationData({...terminationData, thirteenthAdvancePaid: e.target.checked})} className="h-5 w-5 accent-blue-600 rounded" />
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-700">1ª Parcela do 13º já foi paga?</span>
                              <span className="text-[10px] text-slate-400">Referente ao ano atual ({terminationData.endDate ? new Date(terminationData.endDate).getFullYear() : 'AAAA'})</span>
                            </div>
                        </label>
                       </div>

                       <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-2 active:scale-[0.98] text-lg">Simular Rescisão</button>
                       <p className="text-[10px] text-center text-slate-400 mt-2">*Cálculo estimado. Consulte um contador.</p>
                    </form>
                 </div>

                 {terminationResult && (
                    <div className="lg:col-span-7 space-y-6 animate-fade-in">
                       {/* MIDDLE AD UNIT */}
                       <AdUnit slotId={AD_SLOTS.MIDDLE_TERMINATION} />

                       <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                             <p className="text-slate-300 text-xs font-bold uppercase">Total Líquido Estimado</p>
                             <p className="text-3xl font-extrabold mt-1">{formatCurrency(terminationResult.totalNet)}</p>
                          </div>
                          
                          <div className="sm:text-right border-t sm:border-t-0 border-slate-600 pt-4 sm:pt-0 min-w-[140px]">
                             <div className="mb-2">
                                <p className="text-slate-400 text-[10px] font-bold uppercase">FGTS Total (Saque)</p>
                                <p className="text-xl font-bold text-emerald-400">{formatCurrency(terminationResult.totalFgts)}</p>
                             </div>
                          </div>
                       </div>

                       <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100">
                          <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b">Detalhamento das Verbas</h4>
                          
                          {/* -- REMOVIDO BLOCO DE REMUNERAÇÃO BASE PARA CÁLCULOS -- */}

                          <div className="space-y-3 text-sm md:text-base">
                             <Row label="Saldo de Salário (Dias Fixos)" value={terminationResult.balanceSalary} isPositive />
                             
                             {/* DETALHAMENTO EXTRAS RESCISAO */}
                             {terminationResult.totalExtrasAverage > 0 && (
                                <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100/50 space-y-1 my-2">
                                  <div className="mb-2 text-[10px] font-bold text-orange-400 uppercase tracking-wider">Horas Extras/Adicionais (Valor Integral)</div>
                                  <ExtrasDetailedRows breakdown={terminationResult.extrasBreakdown} />
                                </div>
                             )}

                             {terminationResult.noticeWarning > 0 && <Row label="Aviso Prévio Indenizado" value={terminationResult.noticeWarning} isPositive />}
                             <Row label={`Férias Proporcionais (${terminationResult.vacationMonths}/12 avos)`} value={terminationResult.vacationProportional} isPositive />
                             {/* VACATION PERIOD REF */}
                             <div className="text-[10px] text-slate-400 pl-4 -mt-2 mb-2 italic">Ref: {terminationResult.vacationPeriodLabel}</div>

                             <Row label="1/3 Férias" value={terminationResult.vacationThird} isPositive />
                             <Row label={`13º Proporcional (${terminationResult.thirteenthMonths}/12 avos)`} value={terminationResult.thirteenthProportional} isPositive />
                             {/* 13th PERIOD REF */}
                             <div className="text-[10px] text-slate-400 pl-4 -mt-2 mb-2 italic">Ref: {terminationResult.thirteenthPeriodLabel}</div>

                             {terminationResult.vacationExpired > 0 && <Row label="Férias Vencidas" value={terminationResult.vacationExpired} isPositive />}
                             
                             <div className="border-t border-slate-100 pt-3 mt-3 space-y-2">
                                <h5 className="text-xs font-bold text-slate-400 uppercase">Deduções</h5>
                                {terminationResult.noticeDeduction > 0 && <Row label="(-) Desconto Aviso Não Cumprido" value={-terminationResult.noticeDeduction} />}
                                {terminationResult.thirteenthAdvanceDeduction > 0 && <Row label="(-) Desconto Adiantamento 13º" value={-terminationResult.thirteenthAdvanceDeduction} />}
                                <Row label="(-) Desconto INSS sobre verbas" value={-terminationResult.discountInss} />
                                <Row label="(-) Desconto IRPF sobre verbas" value={-terminationResult.discountIr} highlight={terminationResult.discountIr === 0} />
                                <Row label="Total de Descontos" value={-terminationResult.totalDiscounts} informational />
                             </div>

                             <div className="border-t border-slate-100 pt-3 mt-3 space-y-2">
                                <h5 className="text-xs font-bold text-slate-400 uppercase">Fundo de Garantia (Detalhamento)</h5>
                                <Row label="Saldo FGTS Estimado" value={terminationResult.estimatedFgtsBalance} informational />
                                {terminationResult.fgtsFine > 0 && (
                                   <Row label="Multa Rescisória (40%)" value={terminationResult.fgtsFine} isPositive />
                                )}
                                <div className="mt-2 bg-slate-50 p-2 rounded border border-slate-200">
                                   <Row label="Total FGTS (Saldo + Multa)" value={terminationResult.totalFgts} informational />
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* BOTTOM AD UNIT */}
                       <AdUnit slotId={AD_SLOTS.BOTTOM_TERMINATION} />
                    </div>
                 )}
              </div>
           </div>
        )}

      </main>
    </div>
  );
};

// --- COMPONENTS HELPERS ---
const InputGroup = ({ label, name, value, onChange, placeholder, required, isSmall }: any) => (
  <div className="w-full">
    <label className={`block text-xs font-bold text-slate-500 uppercase mb-1`}>{label}</label>
    <div className="relative group">
      {!isSmall && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none group-focus-within:text-blue-500 transition-colors">R$</span>}
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || '0,00'}
        className={`w-full ${isSmall ? 'px-3 py-2 text-sm' : 'pl-10 pr-4 py-3.5 text-base md:text-lg'} rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-slate-800 font-bold transition-all shadow-sm`}
        required={required}
      />
    </div>
  </div>
);

const ExtrasSection = ({ isActive, onToggle, data, onChange, labelOverride }: { isActive: boolean, onToggle: (v: boolean) => void, data: ExtrasInput, onChange: (d: ExtrasInput) => void, labelOverride?: string }) => (
  <div className={`rounded-xl border transition-all ${isActive ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'}`}>
    <label className="flex items-center gap-3 p-4 cursor-pointer select-none">
      <input type="checkbox" checked={isActive} onChange={(e) => onToggle(e.target.checked)} className="h-5 w-5 accent-orange-600 rounded" />
      <span className="text-sm font-semibold text-slate-700">{labelOverride || "Incluir Adicionais e Horas Extras"}</span>
    </label>
    
    {isActive && (
      <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in border-t border-orange-100/50 mt-2 pt-4">
        
        {/* NEW WORKLOAD FIELD */}
        <div className="col-span-1 sm:col-span-2 mb-2 bg-white/50 p-2 rounded-lg border border-orange-100">
           <label className="block text-[10px] font-bold text-orange-700 mb-1 uppercase">Carga Horária Mensal (Padrão 220)</label>
           <input type="number" value={data.workload || ''} onChange={e => onChange({...data, workload: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none" placeholder="220" />
        </div>

        <div className="col-span-1">
          <label className="block text-[10px] font-bold text-orange-700 mb-1 uppercase">H. Extra 50% (Horas)</label>
          <input type="number" value={data.hours50 || ''} onChange={e => onChange({...data, hours50: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none" placeholder="0" />
        </div>
        <div className="col-span-1">
          <label className="block text-[10px] font-bold text-orange-700 mb-1 uppercase">H. Extra 100% (Horas)</label>
          <input type="number" value={data.hours100 || ''} onChange={e => onChange({...data, hours100: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none" placeholder="0" />
        </div>
        <div className="col-span-1">
          <label className="block text-[10px] font-bold text-orange-700 mb-1 uppercase">Interjornada 50% (Horas)</label>
          <input type="number" value={data.hoursInterjornada || ''} onChange={e => onChange({...data, hoursInterjornada: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none" placeholder="0" />
        </div>
        <div className="col-span-1">
          <label className="block text-[10px] font-bold text-orange-700 mb-1 uppercase">Ad. Noturno 20% (Horas)</label>
          <input type="number" value={data.hoursNight || ''} onChange={e => onChange({...data, hoursNight: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none" placeholder="0" />
        </div>
        <div className="col-span-1">
          <label className="block text-[10px] font-bold text-orange-700 mb-1 uppercase">Sobreaviso 1/3 (Horas)</label>
          <input type="number" value={data.hoursStandby || ''} onChange={e => onChange({...data, hoursStandby: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none" placeholder="0" />
        </div>
        <div className="col-span-1 sm:col-span-2 pt-2">
           <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={data.includeDsr} onChange={e => onChange({...data, includeDsr: e.target.checked})} className="h-4 w-4 accent-orange-600 rounded" />
              <span className="text-xs font-semibold text-orange-800">Calcular reflexo DSR (Estimado ~20%)</span>
           </label>
        </div>
      </div>
    )}
  </div>
);

// HELPER FOR DETAILED EXTRAS
const ExtrasDetailedRows = ({ breakdown }: { breakdown: ExtrasBreakdown }) => {
   return (
     <>
       {breakdown.value50 > 0 && <Row label="(+) Hora Extra 50%" value={breakdown.value50} isPositive />}
       {breakdown.value100 > 0 && <Row label="(+) Hora Extra 100%" value={breakdown.value100} isPositive />}
       {breakdown.valueInterjornada > 0 && <Row label="(+) Interjornada 50%" value={breakdown.valueInterjornada} isPositive />}
       {breakdown.valueNight > 0 && <Row label="(+) Adicional Noturno 20%" value={breakdown.valueNight} isPositive />}
       {breakdown.valueStandby > 0 && <Row label="(+) Sobreaviso 1/3" value={breakdown.valueStandby} isPositive />}
       {breakdown.valueDsr > 0 && <Row label="(+) Reflexo DSR (Est.)" value={breakdown.valueDsr} isPositive />}
     </>
   );
};

const ResultCard = ({ label, value, isMain, isDanger }: any) => (
   <div className={`p-5 md:p-6 rounded-2xl border ${isMain ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
      <p className={`text-xs font-bold uppercase tracking-wide ${isMain ? 'text-blue-100' : 'text-slate-400'}`}>{label}</p>
      <p className={`text-2xl md:text-3xl font-extrabold mt-1 ${isMain ? 'text-white' : isDanger ? 'text-red-500' : 'text-slate-800'}`}>
         {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
      </p>
   </div>
);

const Row = ({ label, value, isPositive, highlight, informational }: any) => {
   const format = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(v));
   return (
     <div className={`flex justify-between items-center p-2.5 rounded-lg transition-colors ${highlight ? 'bg-blue-50 text-blue-800 font-bold' : 'hover:bg-slate-50'}`}>
       <span className="text-slate-600">{label}</span>
       <span className={`font-mono font-bold ${informational ? 'text-slate-400' : isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
         {!informational && (isPositive ? '+' : '-')} {format(value)}
       </span>
     </div>
   )
}

export default App;
