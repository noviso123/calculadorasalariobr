import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Layout & Views
import Layout from './components/Layout';
import SalaryView from './components/views/SalaryView';
import VacationView from './components/views/VacationView';
import ThirteenthView from './components/views/ThirteenthView';
import TerminationView from './components/views/TerminationView';
import ConsignedView from './components/views/ConsignedView';
import PrivacyView from './components/views/PrivacyView';
import TermsView from './components/views/TermsView';
import AboutView from './components/views/AboutView';
import SEOContent from './components/SEOContent';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
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
            {/* Legal Pages */}
            <Route path="politica-privacidade" element={<PrivacyView />} />
            <Route path="termos" element={<TermsView />} />
            <Route path="sobre" element={<AboutView />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
