import React, { useState } from 'react';
import {
  Menu,
  X,
  Activity,
  AlertTriangle,
  Layers,
  Database,
  Code,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND_LOGO_SRC, BRAND_MARK_SRC, POWERED_BY_NAME, REPORT_TITLE } from '../brand';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ activeSection, setActiveSection, isOpen, setIsOpen }: SidebarProps) {
  const [isSalesExpanded, setIsSalesExpanded] = useState(activeSection.startsWith('sales'));

  const menuItems = [
    { id: 'process', label: 'Flusso di processo', icon: Activity },
    { id: 'painpoints', label: 'Pain Points', icon: AlertTriangle },
  ];

  const salesModules = [
    { id: 'sales-mod1', label: 'BUSSOLA — BI & Analytics' },
    { id: 'sales-mod2', label: 'CASSA FORTE — Financial' },
    { id: 'sales-mod3', label: 'FORGIA — Document Automation' },
    { id: 'sales-mod4', label: 'SENTINELLA — Supplier Intel' },
    { id: 'sales-mod5', label: 'BANCO — Material Optim.' },
    { id: 'sales-mod6', label: 'MAESTRO — AI Assistant' },
  ];

  const bottomItems = [
    { id: 'datasource', label: 'Fonte Dati', icon: Database },
    { id: 'development', label: 'Sviluppo', icon: Code },
  ];

  const NavItem = ({ id, label, icon: Icon, isSubItem = false }: any) => {
    const isActive = activeSection === id;

    return (
      <button
        onClick={() => setActiveSection(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium'
            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
        } ${isSubItem ? 'pl-11 py-2 text-sm text-left' : ''}`}
      >
        {!isSubItem && <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--color-accent)]' : ''}`} />}
        {isOpen && <span className={isSubItem ? 'truncate' : ''}>{label}</span>}
      </button>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 280 : 80,
          x: isOpen ? 0 : (window.innerWidth < 1024 ? -80 : 0)
        }}
        className={`fixed top-0 left-0 h-full bg-[var(--color-dark-surface)] border-r border-[var(--color-dark-border)] z-30 flex flex-col transition-all duration-300 ease-in-out ${
          !isOpen && 'lg:translate-x-0 -translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-dark-border)]">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 min-w-0"
            >
              <img src={BRAND_MARK_SRC} alt="" className="h-7 w-7 object-contain shrink-0" />
              <span className="text-sm font-semibold text-white leading-tight whitespace-normal">{REPORT_TITLE}</span>
            </motion.div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors mx-auto lg:mx-0 shrink-0"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
          {menuItems.map(item => (
            <NavItem key={item.id} {...item} />
          ))}

          <div>
            <button
              onClick={() => {
                setIsSalesExpanded(!isSalesExpanded);
                if (!isOpen) setIsOpen(true);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                activeSection.startsWith('sales')
                  ? 'text-[var(--color-accent)] font-medium'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className={`w-5 h-5 ${activeSection.startsWith('sales') ? 'text-[var(--color-accent)]' : ''}`} />
                {isOpen && <span>Piattaforma Modulare</span>}
              </div>
              {isOpen && (
                <motion.div animate={{ rotate: isSalesExpanded ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              )}
            </button>

            <AnimatePresence>
              {isOpen && isSalesExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="py-1 space-y-1">
                    <NavItem id="sales-overview" label="Panoramica" isSubItem />
                    {salesModules.map(item => (
                      <NavItem key={item.id} {...item} isSubItem />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-6 mt-6 border-t border-[var(--color-dark-border)] space-y-1">
            {bottomItems.map(item => (
              <NavItem key={item.id} {...item} />
            ))}
          </div>
        </div>

        {isOpen && (
          <div className="px-4 py-4 border-t border-[var(--color-dark-border)]">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="uppercase tracking-wider">Powered by</span>
              <img src={BRAND_LOGO_SRC} alt={POWERED_BY_NAME} className="h-5 object-contain" />
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}
