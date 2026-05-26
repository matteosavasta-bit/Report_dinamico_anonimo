/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './views/LandingView';
import { ProcessFlowView } from './views/ProcessFlowView';
import { PainPointsView } from './views/PainPointsView';
import { SalesModularPlatformView } from './views/SalesModularPlatformView';
import { DataSourceView } from './views/DataSourceView';
import { DevelopmentView } from './views/DevelopmentView';
import { Menu } from 'lucide-react';
import { BRAND_MARK_SRC, REPORT_TITLE } from './brand';

export default function App() {
  const [activeSection, setActiveSection] = useState('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderContent = () => {
    if (activeSection === 'process') return <ProcessFlowView />;
    if (activeSection === 'painpoints') return <PainPointsView />;
    if (activeSection.startsWith('sales')) {
      const moduleMap: Record<string, string | undefined> = {
        'sales-overview': undefined,
        'sales-mod1': 'Soluzione 1',
        'sales-mod2': 'Soluzione 2',
        'sales-mod3': 'Soluzione 3',
        'sales-mod4': 'Soluzione 4',
        'sales-mod5': 'Soluzione 5',
        'sales-mod6': 'Soluzione 6',
      };
      return <SalesModularPlatformView module={moduleMap[activeSection]} onNavigate={(mod) => {
        const sectionId = Object.keys(moduleMap).find(key => moduleMap[key] === mod);
        if (sectionId) setActiveSection(sectionId);
      }} />;
    }
    if (activeSection === 'datasource') return <DataSourceView />;
    if (activeSection === 'development') return <DevelopmentView />;

    return <div className="text-white">Sezione non trovata</div>;
  };

  const isLanding = activeSection === 'landing';

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-gray-200 font-sans selection:bg-[var(--color-accent)] selection:text-black">
      <AnimatePresence mode="wait">
        {isLanding ? (
          <LandingView
            key="landing"
            onContinue={() => setActiveSection('process')}
          />
        ) : (
          <div key="app" className="contents">
            <Sidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              isOpen={isSidebarOpen}
              setIsOpen={setIsSidebarOpen}
            />

            <main
              className={`transition-all duration-300 ease-in-out min-h-screen ${
                isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[80px]'
              }`}
            >
              <div className="lg:hidden h-16 border-b border-[var(--color-dark-border)] bg-[var(--color-dark-surface)] flex items-center px-4 sticky top-0 z-20">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div className="ml-4 flex items-center gap-3 min-w-0">
                  <img src={BRAND_MARK_SRC} alt="" className="h-6 w-6 object-contain shrink-0" />
                  <span className="font-semibold text-sm leading-tight text-white whitespace-normal">{REPORT_TITLE}</span>
                </div>
              </div>

              <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </main>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
