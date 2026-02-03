import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Layout & Views
// Layout & Views
import Layout from './components/Layout';

// Lazy Load Views
const SalaryView = React.lazy(() => import('./components/views/SalaryView'));
const VacationView = React.lazy(() => import('./components/views/VacationView'));
const ThirteenthView = React.lazy(() => import('./components/views/ThirteenthView'));
const TerminationView = React.lazy(() => import('./components/views/TerminationView'));
const ConsignedView = React.lazy(() => import('./components/views/ConsignedView'));
const CompareView = React.lazy(() => import('./components/views/CompareView'));
const IrpfView = React.lazy(() => import('./components/views/IrpfView'));
const PrivacyView = React.lazy(() => import('./components/views/PrivacyView'));
const TermsView = React.lazy(() => import('./components/views/TermsView'));
const AboutView = React.lazy(() => import('./components/views/AboutView'));

import SEOContent from './components/SEOContent';

const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <React.Suspense fallback={<LoadingFallback />}>
            <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={
              <>
                <div className="flex-1"><SalaryView /></div>
                <SEOContent view="salary" />
              </>
            } />
            <Route path="ferias" element={
              <>
                <div className="flex-1"><VacationView /></div>
                <SEOContent view="vacation" />
              </>
            } />
            <Route path="decimo-terceiro" element={
              <>
                <div className="flex-1"><ThirteenthView /></div>
                <SEOContent view="thirteenth" />
              </>
            } />
            <Route path="rescisao" element={
              <>
                <div className="flex-1"><TerminationView /></div>
                <SEOContent view="termination" />
              </>
            } />
            <Route path="consignado" element={
              <>
                <div className="flex-1"><ConsignedView /></div>
                <SEOContent view="consigned" />
              </>
            } />
            <Route path="comparar" element={
              <>
                <div className="flex-1"><CompareView /></div>
                <SEOContent view="compare" />
              </>
            } />
            <Route path="irpf-simulador" element={
              <>
                <div className="flex-1"><IrpfView /></div>
                <SEOContent view="irpf" />
              </>
            } />
            {/* Legal Pages */}
            <Route path="politica-privacidade" element={<PrivacyView />} />
            <Route path="termos" element={<TermsView />} />
            <Route path="sobre" element={<AboutView />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        </React.Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
