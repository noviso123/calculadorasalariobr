
import React, { useState, useEffect, useRef } from 'react';
import { CalculationResult, SalaryInput, ViewType, ThirteenthInput, ThirteenthResult, TerminationInput, TerminationResult, ExtrasInput, ExtrasBreakdown, VacationInput, VacationResult, ConsignedInput, AIContext } from './types';
import { calculateSalary, calculateThirteenth, calculateTermination, calculateVacation } from './services/taxService';
import PieChartVisual from './components/PieChartVisual';
import AIAdvisor from './components/AIAdvisor';
import AdUnit from './components/AdUnit';
import CookieConsent from './components/CookieConsent';
import PrivacyModal from './components/PrivacyModal';
import ConsignedSection from './components/ConsignedSection';
import PayslipTable from './components/PayslipTable';
import SEOContent from './components/SEOContent';

// --- CONFIGURAÇÃO DE ANÚNCIOS (GOOGLE ADSENSE) ---
const AD_SLOTS = {
  TOP_BANNER: "7977197949",           // Banner principal no topo
  SIDEBAR: "7977197949",              // Barra lateral (Desktop)
  MIDDLE_MOBILE: "7977197949",        // Entre resultados (Mobile)
  MIDDLE_CONTENT: "7977197949",       // Meio do conteúdo (Férias)
  MIDDLE_THIRTEENTH: "7977197949",    // Meio (13º Salário)
  BOTTOM_THIRTEENTH: "7977197949",    // Rodapé (13º Salário)
  MIDDLE_TERMINATION: "7977197949",   // Meio (Rescisão)
  BOTTOM: "7977197949",               // Rodapé dos resultados
  BOTTOM_VACATION: "7977197949",      // Rodapé (Férias)
  BOTTOM_TERMINATION: "7977197949"    // Rodapé (Rescisão)
};

// --- ICONS ---
const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>;
const CoinsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7 .71-2.82 2.82"/></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 12"/></svg>;
const BankIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="21" width="18" height="2" rx="1"/><rect x="5" y="3" width="14" height="14" rx="2"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M9 11h.01"/><path d="M15 11h.01"/><path d="M12 15h.01"/></svg>;

// --- MAIN APP ---
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('salary');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  
  // Ref for auto-scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);

  // --- INITIAL STATES ---
  const initialExtras: ExtrasInput = {
    workload: 220, hours50: 0, hours100: 0, hoursNight: 0, hoursStandby: 0, hoursInterjornada: 0, includeDsr: true
  };
  const initialConsigned: ConsignedInput = {
    monthlyInstallment: 0, outstandingBalance: 0, hasFgtsWarranty: false, fgtsBalance: 0
  };

  // --- STATE DEFINITIONS ---
  const [salaryData, setSalaryData] = useState<SalaryInput>({
    grossSalary: 0, includeDependents: false, dependents: 0, otherDiscounts: 0, healthInsurance: 0,
    transportVoucherPercent: 6, includeTransportVoucher: false, transportDailyCost: 0, workDays: 22,
    includeExtras: false, extras: initialExtras,
    includeConsigned: false, consigned: initialConsigned
  });
  const [salaryResult, setSalaryResult] = useState<CalculationResult | null>(null);

  const [thirteenthData, setThirteenthData] = useState<ThirteenthInput>({
    grossSalary: 0, monthsWorked: 12, includeDependents: false, dependents: 0,
    includeExtras: false, extras: initialExtras,
    includeConsigned: false, consigned: initialConsigned
  });
  const [thirteenthResult, setThirteenthResult] = useState<ThirteenthResult | null>(null);

  const [terminationData, setTerminationData] = useState<TerminationInput>({
    grossSalary: 0, startDate: '', endDate: '', reason: 'dismissal_no_cause', noticeStatus: 'indemnified', hasExpiredVacation: false, thirteenthAdvancePaid: false, includeDependents: false, dependents: 0,
    includeExtras: false, extras: initialExtras,
    includeConsigned: false, consigned: initialConsigned
  });
  const [terminationResult, setTerminationResult] = useState<TerminationResult | null>(null);

  const [vacationData, setVacationData] = useState<VacationInput>({
    grossSalary: 0, includeDependents: false, dependents: 0, daysTaken: 30, sellDays: false, daysSold: 10, advanceThirteenth: false,
    includeExtras: false, extras: initialExtras,
    includeConsigned: false, consigned: initialConsigned
  });
  const [vacationResult, setVacationResult] = useState<VacationResult | null>(null);

  const [consignedSimData, setConsignedSimData] = useState({ grossSalary: 0 });
  const [consignedSimResult, setConsignedSimResult] = useState<{margin: number, maxInstallment: number} | null>(null);

  // --- SCROLL HELPER ---
  const scrollToResults = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // --- SHARED STATE LOGIC ---
  const updateGrossSalary = (value: number) => {
    setSalaryData(prev => ({ ...prev, grossSalary: value }));
    setThirteenthData(prev => ({ ...prev, grossSalary: value }));
    setTerminationData(prev => ({ ...prev, grossSalary: value }));
    setVacationData(prev => ({ ...prev, grossSalary: value }));
    setConsignedSimData({ grossSalary: value });
  };

  const updateDependents = (include: boolean, count: number) => {
    setSalaryData(prev => ({ ...prev, includeDependents: include, dependents: count }));
    setThirteenthData(prev => ({ ...prev, includeDependents: include, dependents: count }));
    setTerminationData(prev => ({ ...prev, includeDependents: include, dependents: count }));
    setVacationData(prev => ({ ...prev, includeDependents: include, dependents: count }));
  };

  const updateExtras = (newExtras: ExtrasInput) => {
    setSalaryData(prev => ({ ...prev, extras: newExtras }));
    setThirteenthData(prev => ({ ...prev, extras: newExtras }));
    setTerminationData(prev => ({ ...prev, extras: newExtras }));
    setVacationData(prev => ({ ...prev, extras: newExtras }));
  };

  const updateExtrasToggle = (isActive: boolean) => {
    setSalaryData(prev => ({ ...prev, includeExtras: isActive }));
    setThirteenthData(prev => ({ ...prev, includeExtras: isActive }));
    setTerminationData(prev => ({ ...prev, includeExtras: isActive }));
    setVacationData(prev => ({ ...prev, includeExtras: isActive }));
  };

  const updateConsigned = (newConsigned: ConsignedInput) => {
    setSalaryData(prev => ({ ...prev, consigned: newConsigned }));
    setThirteenthData(prev => ({ ...prev, consigned: newConsigned }));
    setTerminationData(prev => ({ ...prev, consigned: newConsigned }));
    setVacationData(prev => ({ ...prev, consigned: newConsigned }));
  };

  const updateConsignedToggle = (isActive: boolean) => {
    setSalaryData(prev => ({ ...prev, includeConsigned: isActive }));
    setThirteenthData(prev => ({ ...prev, includeConsigned: isActive }));
    setTerminationData(prev => ({ ...prev, includeConsigned: isActive }));
    setVacationData(prev => ({ ...prev, includeConsigned: isActive }));
  };

  useEffect(() => {
    if (terminationData.endDate) {
      const end = new Date(terminationData.endDate + 'T12:00:00');
      const month = end.getMonth(); 
      if (month === 11) {
         setTerminationData(prev => ({ ...prev, thirteenthAdvancePaid: true }));
      }
      else if (month === 0) {
         setTerminationData(prev => ({ ...prev, thirteenthAdvancePaid: false }));
      }
    }
  }, [terminationData.endDate]);

  // --- HANDLERS ---
  const handleSalaryCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setSalaryResult(calculateSalary(salaryData));
    scrollToResults();
  };

  const handleThirteenthCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setThirteenthResult(calculateThirteenth(thirteenthData));
    scrollToResults();
  };

  const handleTerminationCalc = (e: React.FormEvent) => {
    e.preventDefault();
    if(terminationData.startDate && terminationData.endDate) {
      setTerminationResult(calculateTermination(terminationData));
      scrollToResults();
    }
  };

  const handleVacationCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setVacationResult(calculateVacation(vacationData));
    scrollToResults();
  };

  const handleConsignedSimCalc = (e: React.FormEvent) => {
    e.preventDefault();
    const simResult = calculateSalary({
      grossSalary: consignedSimData.grossSalary,
      includeDependents: false, dependents: 0, otherDiscounts: 0, healthInsurance: 0, transportVoucherPercent: 0, includeTransportVoucher: false,
      includeExtras: false, extras: initialExtras,
      includeConsigned: true, consigned: { ...initialConsigned, monthlyInstallment: 999999 } 
    });
    setConsignedSimResult({
      margin: simResult.maxConsignableMargin,
      maxInstallment: simResult.maxConsignableMargin
    });
    scrollToResults();
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // --- AI CONTEXT BUILDERS ---
  const getSalaryAIContext = (): AIContext | null => {
    if (!salaryResult) return null;
    return {
      type: 'salary',
      gross: salaryResult.grossSalary,
      net: salaryResult.finalNetSalary,
      discounts: salaryResult.totalDiscounts + salaryResult.consignedDiscount,
      extras: salaryResult.totalExtras
    };
  };

  const getVacationAIContext = (): AIContext | null => {
    if (!vacationResult) return null;
    return {
      type: 'vacation',
      gross: vacationResult.totalGross,
      net: vacationResult.finalNetVacation,
      discounts: vacationResult.totalDiscounts + vacationResult.consignedDiscount,
      extras: vacationResult.extrasBreakdown.total,
      daysTaken: vacationData.daysTaken
    };
  };

  const getThirteenthAIContext = (): AIContext | null => {
    if (!thirteenthResult) return null;
    return {
      type: 'thirteenth',
      gross: thirteenthResult.totalGross,
      net: thirteenthResult.finalTotalNet,
      discounts: thirteenthResult.parcel2.inss + thirteenthResult.parcel2.irpf + thirteenthResult.parcel2.consignedDiscount,
      monthsWorked: thirteenthData.monthsWorked
    };
  };

  const getTerminationAIContext = (): AIContext | null => {
    if (!terminationResult) return null;
    return {
      type: 'termination',
      gross: terminationResult.totalGross,
      net: terminationResult.finalNetTermination,
      discounts: terminationResult.totalDiscounts + terminationResult.consignedDiscount,
      terminationReason: terminationData.reason
    };
  };

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
    <div className="min-h-screen bg-[#F0F4F8] text-slate-800 font-sans flex flex-col md:flex-row">
      
      {/* MOBILE HEADER */}
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

      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1e3a8a] text-white transform transition-transform duration-300 ease-in-out shadow-2xl 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:relative md:sticky md:top-0 md:h-screen md:overflow-y-auto md:flex md:w-64 md:flex-col md:shadow-none lg:w-72 md:shrink-0`}
      >
        <div className="p-6 border-b border-blue-800 flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg hidden md:block">
              <CalculatorIcon />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Calculadora <span className="text-blue-300 font-light">Salário 2026</span></h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-blue-200"><CloseIcon /></button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem view="salary" icon={<CalculatorIcon />} label="Salário Líquido" />
          <NavItem view="vacation" icon={<SunIcon />} label="Férias" />
          <NavItem view="thirteenth" icon={<CoinsIcon />} label="Décimo Terceiro" />
          <NavItem view="termination" icon={<BriefcaseIcon />} label="Rescisão" />
          <NavItem view="consigned" icon={<BankIcon />} label="Simular Consignado" />
        </nav>

        <div className="p-4">
           <AdUnit slotId={AD_SLOTS.SIDEBAR} format="rectangle" label="Publicidade" />
        </div>

        <div className="p-6 border-t border-blue-800">
          <div className="bg-blue-900/50 p-4 rounded-xl text-xs text-blue-200 border border-blue-800/50">
            <p className="font-bold text-white mb-2 text-sm">Base Legal 2026</p>
            <p className="flex justify-between"><span>Salário Mínimo:</span> <span className="text-white">R$ 1.631</span></p>
            <p className="flex justify-between"><span>Isenção IR:</span> <span className="text-white">Até 5k</span></p>
          </div>
          <div className="mt-4 text-center">
             <button onClick={() => setIsPrivacyOpen(true)} className="text-[10px] text-blue-400 hover:text-white underline">
               Política de Privacidade
             </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 w-full max-w-full flex flex-col pb-24">
        
        <div className="flex-1">
        <AdUnit slotId={AD_SLOTS.TOP_BANNER} className="mb-8" />

        {/* VIEW: SALARIO LIQUIDO */}
        {currentView === 'salary' && (
          <div className="max-w-7xl mx-auto animate-fade-in space-y-6 md:space-y-8">
            <header>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Salário Líquido</h2>
              <p className="text-slate-500 text-sm md:text-base mt-1">Simule seus ganhos reais e impostos.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
                 <form onSubmit={handleSalaryCalc} className="space-y-5">
                    <InputGroup label="Salário Bruto" name="grossSalary" value={salaryData.grossSalary} onChange={(v: string) => updateGrossSalary(Number(v))} required />
                    
                    {/* Dependents Section */}
                    <div className={`p-4 rounded-xl border transition-all ${salaryData.includeDependents ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" checked={salaryData.includeDependents} onChange={(e) => updateDependents(e.target.checked, salaryData.dependents)} className="h-5 w-5 accent-blue-600 rounded" />
                        <span className="text-sm font-semibold text-slate-700">Incluir Dependentes (IRPF)</span>
                      </label>
                      {salaryData.includeDependents && (
                        <div className="mt-4 animate-fade-in">
                          <InputGroup label="Número de Dependentes" name="dependents" value={salaryData.dependents} onChange={(v: string) => updateDependents(true, Number(v))} isSmall placeholder="0" />
                        </div>
                      )}
                    </div>

                    <ExtrasSection 
                      isActive={salaryData.includeExtras} 
                      onToggle={updateExtrasToggle}
                      data={salaryData.extras}
                      onChange={updateExtras}
                    />

                    <ConsignedSection 
                      isActive={salaryData.includeConsigned}
                      onToggle={updateConsignedToggle}
                      data={salaryData.consigned}
                      onChange={updateConsigned}
                    />

                    <div className={`p-4 rounded-xl border transition-all ${salaryData.includeTransportVoucher ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" checked={salaryData.includeTransportVoucher} onChange={(e) => setSalaryData({...salaryData, includeTransportVoucher: e.target.checked})} className="h-5 w-5 accent-blue-600 rounded" />
                        <span className="text-sm font-semibold text-slate-700">Incluir Vale Transporte</span>
                      </label>
                      {salaryData.includeTransportVoucher && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                          <InputGroup label="Custo Diário" name="transportDailyCost" value={salaryData.transportDailyCost} onChange={(v: string) => setSalaryData({...salaryData, transportDailyCost: Number(v)})} isSmall />
                          <InputGroup label="Dias Úteis" name="workDays" value={salaryData.workDays} onChange={(v: string) => setSalaryData({...salaryData, workDays: Number(v)})} isSmall />
                        </div>
                      )}
                    </div>

                    <InputGroup label="Plano de Saúde" name="healthInsurance" value={salaryData.healthInsurance} onChange={(v: string) => setSalaryData({...salaryData, healthInsurance: Number(v)})} />
                    <InputGroup label="Outros Descontos" name="otherDiscounts" value={salaryData.otherDiscounts} onChange={(v: string) => setSalaryData({...salaryData, otherDiscounts: Number(v)})} />
                    
                    <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] text-lg">
                      Calcular Líquido
                    </button>
                 </form>
              </div>

              {salaryResult && (
                <div ref={resultsRef} className="lg:col-span-7 space-y-6 animate-fade-in scroll-mt-6">
                   
                   {/* CARDS LAYOUT */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ResultCard label="Salário Bruto" value={salaryResult.grossSalary} />
                      <ResultCard label="Salário Líquido" value={salaryResult.finalNetSalary} isMain />
                      
                      {salaryResult.consignedDiscount > 0 ? (
                         <ResultCard label="Empréstimo (Desc.)" value={salaryResult.consignedDiscount} isConsigned />
                      ) : (
                         <div className="hidden sm:block"></div>
                      )}
                      <ResultCard label="Total Descontos" value={salaryResult.totalDiscounts + salaryResult.consignedDiscount} isDanger />
                   </div>
                   
                   {/* PAYSLIP TABLE INTEGRATION (Professional Look) */}
                   <div className="mt-4">
                      <PayslipTable 
                        earnings={[
                          { label: 'Salário Base', value: salaryResult.grossSalary, type: 'earning' },
                          ...(salaryResult.extrasBreakdown.value50 > 0 ? [{ label: 'Hora Extra 50%', value: salaryResult.extrasBreakdown.value50, type: 'earning' } as any] : []),
                          ...(salaryResult.extrasBreakdown.value100 > 0 ? [{ label: 'Hora Extra 100%', value: salaryResult.extrasBreakdown.value100, type: 'earning' } as any] : []),
                          ...(salaryResult.extrasBreakdown.valueNight > 0 ? [{ label: 'Adicional Noturno', value: salaryResult.extrasBreakdown.valueNight, type: 'earning' } as any] : []),
                          ...(salaryResult.extrasBreakdown.valueStandby > 0 ? [{ label: 'Sobreaviso', value: salaryResult.extrasBreakdown.valueStandby, type: 'earning' } as any] : []),
                          ...(salaryResult.extrasBreakdown.valueInterjornada > 0 ? [{ label: 'Interjornada', value: salaryResult.extrasBreakdown.valueInterjornada, type: 'earning' } as any] : []),
                          ...(salaryResult.extrasBreakdown.valueDsr > 0 ? [{ label: 'DSR', value: salaryResult.extrasBreakdown.valueDsr, type: 'earning' } as any] : []),
                        ]}
                        discounts={[
                          { label: 'INSS', value: salaryResult.inss, type: 'discount' },
                          { label: 'Imposto de Renda (IRPF)', value: salaryResult.irpf, type: 'discount' },
                          ...(salaryResult.transportVoucher > 0 ? [{ label: 'Vale Transporte', value: salaryResult.transportVoucher, type: 'discount' } as any] : []),
                          ...(salaryResult.healthInsurance > 0 ? [{ label: 'Plano de Saúde', value: salaryResult.healthInsurance, type: 'discount' } as any] : []),
                          ...(salaryResult.otherDiscounts > 0 ? [{ label: 'Outros Descontos', value: salaryResult.otherDiscounts, type: 'discount' } as any] : []),
                          ...(salaryResult.consignedDiscount > 0 ? [{ label: 'Empréstimo Consignado', value: salaryResult.consignedDiscount, type: 'discount' } as any] : []),
                        ]}
                        totalGross={salaryResult.grossSalary + salaryResult.totalExtras}
                        totalDiscounts={salaryResult.totalDiscounts + salaryResult.consignedDiscount}
                        netValue={salaryResult.finalNetSalary}
                        footerNote={
                          <div className="flex items-center justify-center gap-2">
                             <span className="text-emerald-600 font-bold">FGTS do Mês: {formatCurrency(salaryResult.fgtsMonthly)}</span>
                             <span className="text-slate-300">|</span>
                             <span>Margem Disp: {formatCurrency(salaryResult.maxConsignableMargin)}</span>
                          </div>
                        }
                      />
                   </div>
                   
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-center h-56 md:h-64">
                       <PieChartVisual data={salaryResult} />
                   </div>
                   
                   <AIAdvisor context={getSalaryAIContext()} />
                   <AdUnit slotId={AD_SLOTS.BOTTOM} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: CONSIGNED SIMULATOR */}
        {currentView === 'consigned' && (
           <div className="max-w-4xl mx-auto animate-fade-in space-y-6 md:space-y-8">
             <header>
               <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Simulador de Margem Consignável</h2>
               <p className="text-slate-500 text-sm md:text-base mt-1">Descubra quanto você pode comprometer do seu salário.</p>
             </header>

             <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <form onSubmit={handleConsignedSimCalc} className="space-y-6">
                   <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                     <p className="text-indigo-800 text-sm mb-4">
                       A legislação permite comprometer até <strong>35% da renda líquida</strong> com empréstimo consignado.
                       Este simulador calcula sua margem baseada nas regras de 2026.
                     </p>
                     <InputGroup label="Seu Salário Bruto" name="grossSalary" value={consignedSimData.grossSalary} onChange={(v: string) => updateGrossSalary(Number(v))} required />
                   </div>
                   <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-lg">Calcular Margem</button>
                </form>

                {consignedSimResult && (
                   <div ref={resultsRef} className="mt-8 space-y-6 animate-fade-in scroll-mt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Margem Disponível (Mensal)</p>
                            <p className="text-3xl font-extrabold mt-2">{formatCurrency(consignedSimResult.margin)}</p>
                            <p className="text-xs text-indigo-200 mt-2">Valor máximo da parcela</p>
                         </div>
                         <div className="bg-white border-2 border-slate-100 p-6 rounded-2xl">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Renda Líquida Base</p>
                            <p className="text-2xl font-bold text-slate-700 mt-2">{formatCurrency(consignedSimResult.margin / 0.35)}</p>
                            <p className="text-xs text-slate-400 mt-2">Base de cálculo (Bruto - Impostos)</p>
                         </div>
                      </div>
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
                     <InputGroup label="Salário Bruto" name="grossSalary" value={vacationData.grossSalary} onChange={(v: string) => updateGrossSalary(Number(v))} required />
                     
                     {/* Dependents Section */}
                    <div className={`p-4 rounded-xl border transition-all ${vacationData.includeDependents ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" checked={vacationData.includeDependents} onChange={(e) => updateDependents(e.target.checked, vacationData.dependents)} className="h-5 w-5 accent-blue-600 rounded" />
                        <span className="text-sm font-semibold text-slate-700">Incluir Dependentes (IRPF)</span>
                      </label>
                      {vacationData.includeDependents && (
                        <div className="mt-4 animate-fade-in">
                          <InputGroup label="Número de Dependentes" name="dependents" value={vacationData.dependents} onChange={(v: string) => updateDependents(true, Number(v))} isSmall placeholder="0" />
                        </div>
                      )}
                    </div>

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
                       onToggle={updateExtrasToggle}
                       data={vacationData.extras}
                       onChange={updateExtras}
                       labelOverride="Incluir Média de Extras"
                     />
                     
                     <ConsignedSection 
                      isActive={vacationData.includeConsigned}
                      onToggle={updateConsignedToggle}
                      data={vacationData.consigned}
                      onChange={updateConsigned}
                    />

                     <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-2 active:scale-[0.98] text-lg">Calcular Férias</button>
                  </form>
                </div>

                {vacationResult && (
                   <div ref={resultsRef} className="lg:col-span-7 space-y-6 animate-fade-in scroll-mt-6">
                      <AdUnit slotId={AD_SLOTS.MIDDLE_CONTENT} />

                      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-yellow-400 flex flex-col items-center justify-center transform hover:scale-[1.01] transition-transform">
                          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest text-center mb-1">Total Líquido a Receber</p>
                          <p className="text-4xl md:text-5xl font-black text-center tracking-tight drop-shadow-sm">
                              {formatCurrency(vacationResult.finalNetVacation)}
                          </p>
                      </div>

                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-4">
                         <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Detalhamento</h4>
                         
                         <Row label="Férias (Bruto)" value={vacationResult.vacationGross} />
                         <Row label="1/3 Constitucional" value={vacationResult.vacationThird} />
                         {vacationResult.allowanceGross > 0 && <Row label="Abono Pecuniário" value={vacationResult.allowanceGross} />}
                         {vacationResult.allowanceThird > 0 && <Row label="1/3 Abono" value={vacationResult.allowanceThird} />}
                         {vacationResult.advanceThirteenth > 0 && <Row label="Adiantamento 13º" value={vacationResult.advanceThirteenth} />}
                         
                         <Row label="Média de Extras" value={vacationResult.extrasBreakdown.total} />
                         
                         <div className="my-2 border-t border-slate-50"></div>
                         
                         <Row label="INSS" value={-vacationResult.discountInss} />
                         <Row label="IRPF" value={-vacationResult.discountIr} />
                         {vacationResult.consignedDiscount > 0 && <Row label="Empréstimo Consignado" value={-vacationResult.consignedDiscount} highlight />}
                         
                         <div className="border-t border-slate-100 my-3"></div>
                         <div className="flex justify-between font-bold text-lg text-slate-700">
                           <span>Total Descontos</span>
                           <span className="text-red-600">{formatCurrency(vacationResult.totalDiscounts + vacationResult.consignedDiscount)}</span>
                         </div>
                      </div>

                      <AIAdvisor context={getVacationAIContext()} />
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
                       <InputGroup label="Salário Bruto" name="grossSalary" value={thirteenthData.grossSalary} onChange={(v: string) => updateGrossSalary(Number(v))} required />
                       <InputGroup label="Meses Trabalhados" name="monthsWorked" value={thirteenthData.monthsWorked} onChange={(v: string) => setThirteenthData({...thirteenthData, monthsWorked: Math.min(12, Number(v))})} isSmall />
                       
                       {/* Dependents Section */}
                      <div className={`p-4 rounded-xl border transition-all ${thirteenthData.includeDependents ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input type="checkbox" checked={thirteenthData.includeDependents} onChange={(e) => updateDependents(e.target.checked, thirteenthData.dependents)} className="h-5 w-5 accent-blue-600 rounded" />
                          <span className="text-sm font-semibold text-slate-700">Incluir Dependentes (IRPF)</span>
                        </label>
                        {thirteenthData.includeDependents && (
                          <div className="mt-4 animate-fade-in">
                            <InputGroup label="Número de Dependentes" name="dependents" value={thirteenthData.dependents} onChange={(v: string) => updateDependents(true, Number(v))} isSmall placeholder="0" />
                          </div>
                        )}
                      </div>

                       <ExtrasSection 
                         isActive={thirteenthData.includeExtras} 
                         onToggle={updateExtrasToggle}
                         data={thirteenthData.extras}
                         onChange={updateExtras}
                         labelOverride="Incluir Média de Extras"
                       />
                       
                       <ConsignedSection 
                        isActive={thirteenthData.includeConsigned}
                        onToggle={updateConsignedToggle}
                        data={thirteenthData.consigned}
                        onChange={updateConsigned}
                      />

                       <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-2 active:scale-[0.98] text-lg">Simular Parcelas</button>
                    </form>
                 </div>

                 {thirteenthResult && (
                    <div ref={resultsRef} className="lg:col-span-7 space-y-6 animate-fade-in scroll-mt-6">
                       <AdUnit slotId={AD_SLOTS.MIDDLE_THIRTEENTH} />

                       <h3 className="font-bold text-slate-700 md:text-lg">Fluxo de Recebimento</h3>
                       
                       {/* CARD 1a PARCELA */}
                       <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl relative overflow-hidden shadow-sm">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 mb-2">
                             <div>
                                <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider">1ª Parcela (Nov)</p>
                                <p className="text-3xl md:text-4xl font-extrabold text-emerald-800 mt-1">{formatCurrency(thirteenthResult.parcel1.value)}</p>
                             </div>
                             <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full w-fit">SEM DESCONTOS</span>
                          </div>
                       </div>

                       <div className="flex justify-center -my-2 opacity-30 text-slate-400 rotate-90 md:rotate-0"><ArrowRightIcon /></div>

                       {/* CARD 2a PARCELA */}
                       <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                           <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">2ª Parcela (Dez) - Líquida</p>
                                    <p className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-1">{formatCurrency(thirteenthResult.parcel2.finalValue)}</p>
                                </div>
                           </div>
                           
                           <div className="mt-4 pt-4 border-t border-slate-100">
                              <Row label="13º Salário Integral" value={thirteenthResult.totalGross} />
                              <Row label="Média de Extras" value={thirteenthResult.extrasBreakdown.total} />
                              
                              <div className="my-2 border-t border-slate-50"></div>
                              
                              <Row label="INSS" value={-thirteenthResult.parcel2.inss} />
                              <Row label="IRPF" value={-thirteenthResult.parcel2.irpf} />
                              <Row label="Desc. Adiantamento" value={-thirteenthResult.parcel2.discountAdvance} />
                              {thirteenthResult.parcel2.consignedDiscount > 0 && <Row label="Empréstimo Consignado" value={-thirteenthResult.parcel2.consignedDiscount} highlight />}
                           </div>
                       </div>
                       
                       <div className="mt-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-blue-400 flex flex-col items-center justify-center transform hover:scale-[1.01] transition-transform">
                          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest text-center mb-1">Total Líquido (Soma)</p>
                          <p className="text-4xl md:text-5xl font-black text-center tracking-tight drop-shadow-sm">
                              {formatCurrency(thirteenthResult.finalTotalNet)}
                          </p>
                       </div>
                       
                       <AIAdvisor context={getThirteenthAIContext()} />
                       <AdUnit slotId={AD_SLOTS.BOTTOM_THIRTEENTH} />
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
                       <InputGroup label="Salário Bruto" name="grossSalary" value={terminationData.grossSalary} onChange={(v: string) => updateGrossSalary(Number(v))} required />
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Data Admissão</label>
                            <input type="date" value={terminationData.startDate} onChange={(e) => setTerminationData({...terminationData, startDate: e.target.value})} className="w-full p-3 border rounded-lg text-slate-700 bg-slate-50 outline-none" required />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Data Saída</label>
                            <input type="date" value={terminationData.endDate} onChange={(e) => setTerminationData({...terminationData, endDate: e.target.value})} className="w-full p-3 border rounded-lg text-slate-700 bg-slate-50 outline-none" required />
                          </div>
                       </div>
                       
                       <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Motivo do Desligamento</label>
                          <select 
                            value={terminationData.reason} 
                            onChange={(e) => {
                              const r = e.target.value as any;
                              let ns = terminationData.noticeStatus;
                              if (r === 'dismissal_no_cause') ns = 'indemnified';
                              if (r === 'resignation') ns = 'worked';
                              if (r === 'dismissal_cause') ns = 'worked';
                              if (r === 'agreement') ns = 'indemnified';
                              setTerminationData({...terminationData, reason: r, noticeStatus: ns});
                            }}
                            className="w-full p-3 border rounded-xl bg-slate-50 font-medium text-slate-700 outline-none"
                          >
                             <option value="dismissal_no_cause">Demissão sem Justa Causa</option>
                             <option value="dismissal_cause">Demissão por Justa Causa</option>
                             <option value="resignation">Pedido de Demissão</option>
                             <option value="agreement">Acordo (Culpa Recíproca)</option>
                          </select>
                       </div>

                       {/* Dependents Section */}
                      <div className={`p-4 rounded-xl border transition-all ${terminationData.includeDependents ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input type="checkbox" checked={terminationData.includeDependents} onChange={(e) => updateDependents(e.target.checked, terminationData.dependents)} className="h-5 w-5 accent-blue-600 rounded" />
                          <span className="text-sm font-semibold text-slate-700">Incluir Dependentes (IRPF)</span>
                        </label>
                        {terminationData.includeDependents && (
                          <div className="mt-4 animate-fade-in">
                            <InputGroup label="Número de Dependentes" name="dependents" value={terminationData.dependents} onChange={(v: string) => updateDependents(true, Number(v))} isSmall placeholder="0" />
                          </div>
                        )}
                      </div>

                       {terminationData.reason !== 'dismissal_cause' && (
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Aviso Prévio</label>
                            <select 
                              value={terminationData.noticeStatus} 
                              onChange={(e) => setTerminationData({...terminationData, noticeStatus: e.target.value as any})}
                              className="w-full p-3 border rounded-xl bg-slate-50 font-medium text-slate-700 outline-none"
                            >
                               {terminationData.reason === 'dismissal_no_cause' && (
                                 <>
                                   <option value="indemnified">Indenizado</option>
                                   <option value="worked">Trabalhado</option>
                                 </>
                               )}
                               {terminationData.reason === 'resignation' && (
                                 <>
                                   <option value="worked">Trabalhado</option>
                                   <option value="not_fulfilled">Não Cumprido (Desconto)</option>
                                   <option value="waived">Dispensado</option>
                                 </>
                               )}
                               {terminationData.reason === 'agreement' && (
                                 <>
                                   <option value="indemnified">Indenizado</option>
                                   <option value="worked">Trabalhado</option>
                                 </>
                               )}
                            </select>
                         </div>
                       )}

                       <ExtrasSection 
                         isActive={terminationData.includeExtras} 
                         onToggle={updateExtrasToggle}
                         data={terminationData.extras}
                         onChange={updateExtras}
                         labelOverride="Incluir Extras / Base"
                       />
                       
                       <ConsignedSection 
                        isActive={terminationData.includeConsigned}
                        onToggle={updateConsignedToggle}
                        data={terminationData.consigned}
                        onChange={updateConsigned}
                        isTermination
                      />

                       <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer">
                            <input type="checkbox" checked={terminationData.hasExpiredVacation} onChange={(e) => setTerminationData({...terminationData, hasExpiredVacation: e.target.checked})} className="h-5 w-5 accent-blue-600 rounded" />
                            <span className="text-sm font-semibold text-slate-700">Possui Férias Vencidas?</span>
                        </label>
                        
                        <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${terminationData.thirteenthAdvancePaid ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent'}`}>
                            <input type="checkbox" checked={terminationData.thirteenthAdvancePaid} onChange={(e) => setTerminationData({...terminationData, thirteenthAdvancePaid: e.target.checked})} className="h-5 w-5 accent-blue-600 rounded" />
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-700">1ª Parcela do 13º já paga?</span>
                            </div>
                        </label>
                       </div>

                       <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-2 active:scale-[0.98] text-lg">Simular Rescisão</button>
                    </form>
                 </div>

                 {terminationResult && (
                    <div ref={resultsRef} className="lg:col-span-7 space-y-6 animate-fade-in scroll-mt-6">
                       <AdUnit slotId={AD_SLOTS.MIDDLE_TERMINATION} />

                       {/* CARDS DE RESULTADO: RESCISÃO + FGTS */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* CARD 1: RESCISÃO LÍQUIDA (DINHEIRO NA MÃO) */}
                          <div className={`text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between ${terminationResult.finalNetTermination === 0 ? 'bg-red-900' : 'bg-slate-800'}`}>
                             <p className={`${terminationResult.finalNetTermination === 0 ? 'text-red-200' : 'text-slate-300'} text-xs font-bold uppercase tracking-wider`}>Líquido Rescisório (TRCT)</p>
                             <p className="text-3xl font-extrabold mt-2">{formatCurrency(terminationResult.finalNetTermination)}</p>
                             <p className={`${terminationResult.finalNetTermination === 0 ? 'text-red-300' : 'text-slate-400'} text-xs mt-2`}>
                               {terminationResult.finalNetTermination === 0 ? 'Deduções superiores aos ganhos (Zerado)' : 'Valor depositado em conta'}
                             </p>
                          </div>
                          
                          {/* CARD 2: SAQUE FGTS */}
                          <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                             <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Líquido FGTS a Sacar</p>
                             <p className="text-3xl font-extrabold mt-2">{formatCurrency(terminationResult.finalFgtsToWithdraw)}</p>
                             <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-emerald-200">Saldo Disponível no App FGTS</p>
                             </div>
                          </div>
                       </div>

                       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-4">
                          <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Detalhamento TRCT</h4>
                          
                          <Row label="Saldo de Salário" value={terminationResult.balanceSalary} />
                          {terminationResult.noticeWarning > 0 && <Row label="Aviso Prévio Indenizado" value={terminationResult.noticeWarning} />}
                          <Row label={`Férias Proporcionais (${terminationResult.vacationMonths}/12)`} value={terminationResult.vacationProportional} />
                          <Row label="1/3 Férias" value={terminationResult.vacationThird} />
                          <Row label={`13º Proporcional (${terminationResult.thirteenthMonths}/12)`} value={terminationResult.thirteenthProportional} />
                          {terminationResult.vacationExpired > 0 && <Row label="Férias Vencidas" value={terminationResult.vacationExpired} />}
                          
                          <div className="my-2 border-t border-slate-50"></div>
                          
                          <Row label="INSS (Total)" value={-terminationResult.discountInss} />
                          
                          {/* UPDATED: Unified IR Display */}
                          <Row label="IRPF (Base Unificada)" value={-terminationResult.discountIr} highlight />
                          
                          {terminationResult.noticeDeduction > 0 && <Row label="Desconto Aviso Prévio" value={-terminationResult.noticeDeduction} />}
                          {terminationResult.thirteenthAdvanceDeduction > 0 && <Row label="Adiantamento 13º" value={-terminationResult.thirteenthAdvanceDeduction} />}
                          {terminationResult.consignedDiscount > 0 && <Row label="Empréstimo Consignado" value={-terminationResult.consignedDiscount} highlight />}

                          <div className="border-t border-slate-100 my-3"></div>
                          <div className="flex justify-between font-bold text-lg text-slate-700">
                             <span>Total Proventos</span>
                             <span className="text-emerald-600">{formatCurrency(terminationResult.totalGross)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg text-slate-700">
                             <span>Total Descontos</span>
                             <span className="text-red-600">{formatCurrency(terminationResult.totalDiscounts + terminationResult.consignedDiscount)}</span>
                          </div>
                       </div>

                       {/* FLUXO DE QUITAÇÃO DE CONSIGNADO */}
                       {terminationResult.consignedDiscount > 0 && (
                          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mt-4 space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="bg-indigo-600 text-white p-1 rounded"><BankIcon /></div>
                               <h5 className="text-sm font-bold text-indigo-800 uppercase">Fluxo de Quitação do Empréstimo</h5>
                            </div>
                            
                            <div className="space-y-2 text-xs md:text-sm text-indigo-900">
                               <div className="flex justify-between border-b border-indigo-200 pb-1">
                                  <span>Dívida Inicial Declarada:</span>
                                  <strong>{formatCurrency(terminationResult.remainingLoanBalance + terminationResult.consignedDiscount + terminationResult.totalFgtsDeduction)}</strong>
                               </div>

                               <Row label="1. Abatido na Rescisão (TRCT 35%)" value={-terminationResult.consignedDiscount} />
                               
                               {terminationResult.totalFgtsDeduction > 0 && (
                                  <div className="bg-white/60 p-2 rounded border border-indigo-200 mt-2">
                                     <p className="text-[10px] font-bold text-indigo-500 uppercase mb-1">Garantia FGTS Executada</p>
                                     {terminationResult.warrantyUsed > 0 && <Row label="(-) Uso da Garantia (10%)" value={-terminationResult.warrantyUsed} />}
                                     {terminationResult.fineUsed > 0 && <Row label="(-) Uso da Multa (40%)" value={-terminationResult.fineUsed} />}
                                  </div>
                               )}

                               <div className="flex justify-between font-bold text-indigo-700 bg-indigo-100 p-2 rounded mt-2">
                                  <span>Saldo Devedor Restante:</span>
                                  <span>{formatCurrency(terminationResult.remainingLoanBalance)}</span>
                               </div>
                               {terminationResult.remainingLoanBalance > 0 && (
                                 <p className="text-[10px] text-red-500 text-right mt-1">*O valor restante deverá ser renegociado com o banco.</p>
                               )}
                            </div>
                          </div>
                       )}

                       {/* NOVO DETALHAMENTO FGTS (MELHORADO) */}
                       <div className="bg-[#ecfdf5] p-6 rounded-2xl border border-emerald-200 mt-6 shadow-sm relative overflow-hidden">
                          {/* Decorative Background Icon */}
                          <div className="absolute -right-6 -top-6 text-emerald-100 opacity-50 pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M2 9h20v13H2V9zm2 2v9h16v-9H4zm14-5v2H6V6h12zM8 3v2h8V3H8z"/></svg>
                          </div>

                          <div className="relative z-10">
                            <div className="flex justify-between items-center mb-4 border-b border-emerald-200/60 pb-3">
                               <div className="flex items-center gap-2">
                                  <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                  </div>
                                  <h5 className="font-bold text-emerald-800 text-sm md:text-base">Detalhamento FGTS</h5>
                               </div>
                               {terminationData.consigned.fgtsBalance > 0 ? (
                                  <span className="text-[10px] bg-white text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-100 shadow-sm">Base: Informado</span>
                               ) : (
                                  <span className="text-[10px] bg-white text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-100 shadow-sm">Base: Estimado</span>
                               )}
                            </div>

                            <div className="space-y-2 text-sm text-emerald-900">
                               <Row label="Saldo de Depósitos" value={terminationResult.estimatedFgtsBalance} />
                               <Row label="Multa Rescisória (40%)" value={terminationResult.fgtsFine} />
                               
                               <div className="border-t border-emerald-200/60 my-2"></div>
                               
                               <div className="flex justify-between items-center">
                                  <span className="text-emerald-700 font-medium">Total Bruto</span>
                                  <span className="font-bold text-emerald-900 text-lg">{formatCurrency(terminationResult.totalFgts)}</span>
                               </div>

                               {terminationResult.totalFgtsDeduction > 0 && (
                                  <div className="bg-red-50/80 p-3 rounded-lg border border-red-100 mt-2 backdrop-blur-sm">
                                     <div className="flex justify-between text-red-600 font-medium text-xs md:text-sm">
                                        <span>(-) Amortização Empréstimo</span>
                                        <span>{formatCurrency(-terminationResult.totalFgtsDeduction)}</span>
                                     </div>
                                  </div>
                               )}
                            </div>
                          </div>
                       </div>
                       
                       <AIAdvisor context={getTerminationAIContext()} />
                       <AdUnit slotId={AD_SLOTS.BOTTOM_TERMINATION} />
                    </div>
                 )}
              </div>
           </div>
        )}

        </div>
        
        {/* SEO CONTENT FOOTER INJECTION */}
        <SEOContent view={currentView} />

        {/* FOOTER */}
        <footer className="mt-12 py-8 border-t border-slate-200 text-center text-slate-400 text-xs">
           <div className="flex justify-center gap-6 mb-4">
              <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-blue-600 transition-colors">Política de Privacidade</button>
              <span>•</span>
              <span>&copy; 2026 Calculadora Salário BR</span>
           </div>
           <p className="max-w-lg mx-auto leading-relaxed opacity-70">
             Este site é uma ferramenta de simulação. Os cálculos podem sofrer variações dependendo de convenções coletivas e interpretações legais. Consulte sempre um contador.
           </p>
        </footer>

      </main>

      <CookieConsent onOpenPrivacy={() => setIsPrivacyOpen(true)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
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
          <label className="block text-[10px] font-bold text-orange-700 mb-1 uppercase">Adicional Noturno (Horas)</label>
          <input type="number" value={data.hoursNight || ''} onChange={e => onChange({...data, hoursNight: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none" placeholder="0" />
        </div>
        
        <div className="col-span-1">
          <label className="block text-[10px] font-bold text-orange-700 mb-1 uppercase">Sobreaviso (Horas)</label>
          <input type="number" value={data.hoursStandby || ''} onChange={e => onChange({...data, hoursStandby: Number(e.target.value)})} className="w-full p-2 text-sm rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none" placeholder="0" />
        </div>

         <div className="col-span-1 sm:col-span-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={data.includeDsr} onChange={(e) => onChange({...data, includeDsr: e.target.checked})} className="h-4 w-4 accent-orange-600 rounded" />
              <span className="text-xs font-bold text-orange-800">Calcular DSR (Reflexo) Automático?</span>
            </label>
         </div>

      </div>
    )}
  </div>
);

const ResultCard = ({ label, value, isMain, isDanger, isConsigned }: any) => (
  <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${isMain ? 'bg-blue-600 text-white border-blue-600' : isDanger ? 'bg-white border-red-100' : isConsigned ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-100'}`}>
    <span className={`text-xs font-bold uppercase tracking-wider mb-2 ${isMain ? 'text-blue-200' : isDanger ? 'text-red-400' : isConsigned ? 'text-indigo-200' : 'text-slate-400'}`}>{label}</span>
    <span className={`text-2xl md:text-3xl font-extrabold ${isMain ? 'text-white' : isDanger ? 'text-red-600' : isConsigned ? 'text-white' : 'text-slate-800'}`}>
      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
    </span>
  </div>
);

const Row = ({ label, value, isPositive, highlight, informational }: any) => (
  <div className={`flex justify-between items-center py-1 ${highlight ? 'font-bold text-blue-600' : ''} ${informational ? 'text-slate-400 text-xs' : ''}`}>
    <span className={`${informational ? '' : 'text-slate-600'}`}>{label}</span>
    <span className={`font-semibold ${isPositive ? 'text-emerald-600' : informational ? '' : value < 0 ? 'text-red-500' : 'text-slate-800'}`}>
      {value === 0 ? 'R$ 0,00' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
    </span>
  </div>
);

export default App;
