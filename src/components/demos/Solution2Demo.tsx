import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  User,
  FileText,
  Landmark,
  Package,
  Truck,
  CheckCircle2,
  Loader2,
  AlertTriangle
} from 'lucide-react';

type Client = {
  id: string;
  name: string;
  fatture: number;
  riba: number;
  ordini: number;
  ddt: number;
  fido: number;
};

const CLIENTS: Client[] = [
  {
    id: 'CLI-001',
    name: 'Officine Meccaniche Alpha S.r.l.',
    fatture: 84500,
    riba: 62300,
    ordini: 138000,
    ddt: 21400,
    fido: 350000,
  },
  {
    id: 'CLI-002',
    name: 'Beta Carpenterie S.p.A.',
    fatture: 142000,
    riba: 98600,
    ordini: 55000,
    ddt: 0,
    fido: 280000,
  },
  {
    id: 'CLI-003',
    name: 'Gamma Lavorazioni Meccaniche',
    fatture: 41200,
    riba: 12800,
    ordini: 18600,
    ddt: 9500,
    fido: 120000,
  },
];

const STEPS = [
  { id: 1, label: 'Fatture aperte', icon: FileText, key: 'fatture' as const, desc: 'Partite aperte da SINVOICE' },
  { id: 2, label: 'RIBA emesse non scadute', icon: Landmark, key: 'riba' as const, desc: 'Presentate in banca, in attesa' },
  { id: 3, label: 'Ordini confermati', icon: Package, key: 'ordini' as const, desc: 'SORDER non ancora evasi' },
  { id: 4, label: 'DDT non fatturati', icon: Truck, key: 'ddt' as const, desc: 'SDELIVERY in attesa fattura' },
];

export function Solution2Demo() {
  const [selected, setSelected] = useState<Client>(CLIENTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  const handleRun = () => {
    setIsGenerating(true);
    setDone(false);
    setCurrentStep(0);
    [1, 2, 3, 4].forEach((s, i) => {
      setTimeout(() => setCurrentStep(s), (i + 1) * 500);
    });
    setTimeout(() => {
      setIsGenerating(false);
      setDone(true);
    }, 2500);
  };

  const totalExposure = selected.fatture + selected.riba + selected.ordini + selected.ddt;
  const fidoUsage = (totalExposure / selected.fido) * 100;
  const fidoColor = fidoUsage > 90 ? 'text-red-400' : fidoUsage > 75 ? 'text-orange-400' : 'text-[var(--color-accent)]';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded-xl p-5 shadow-xl">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[var(--color-accent)]" />
            Seleziona cliente
          </h3>
          <div className="space-y-2 mb-5">
            {CLIENTS.map(c => (
              <button
                key={c.id}
                onClick={() => { setSelected(c); setDone(false); setCurrentStep(0); }}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selected.id === c.id
                    ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]'
                    : 'bg-[var(--color-dark-bg)] border-[var(--color-dark-border)] hover:border-gray-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <User className={`w-4 h-4 mt-0.5 ${selected.id === c.id ? 'text-[var(--color-accent)]' : 'text-gray-400'}`} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{c.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{c.id}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={handleRun}
            disabled={isGenerating}
            className="w-full py-3 rounded-lg bg-[var(--color-accent)] text-black font-semibold hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Aggregazione in corso…
              </>
            ) : (
              'Calcola esposizione completa'
            )}
          </button>
          <p className="text-xs text-gray-500 mt-3">
            La piattaforma aggrega dati Sage X3 (fatture, RIBA, ordini, DDT) + fidi del primario assicuratore crediti in tempo reale.
          </p>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded-xl p-5 shadow-xl">
          <h3 className="text-white font-bold mb-4">Pipeline di aggregazione</h3>
          <div className="space-y-3">
            {STEPS.map(step => {
              const active = currentStep >= step.id;
              const value = selected[step.key];
              return (
                <motion.div
                  key={step.id}
                  animate={{ opacity: active ? 1 : 0.35 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)]"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' : 'bg-gray-800 text-gray-500'}`}>
                    {active && currentStep === step.id && isGenerating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : active ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{step.label}</div>
                    <div className="text-xs text-gray-500">{step.desc}</div>
                  </div>
                  <div className={`text-sm font-mono ${active ? 'text-white' : 'text-gray-600'}`}>
                    € {value.toLocaleString('it-IT')}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-br from-[var(--color-dark-surface)] to-[var(--color-dark-bg)] border border-[var(--color-accent)]/30 rounded-xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Esposizione complessiva</div>
                  <div className="text-3xl font-bold text-white">€ {totalExposure.toLocaleString('it-IT')}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Fido assicuratore crediti</div>
                  <div className={`text-lg font-bold ${fidoColor}`}>{fidoUsage.toFixed(1)}% utilizzato</div>
                  <div className="text-xs text-gray-500 font-mono">su € {selected.fido.toLocaleString('it-IT')}</div>
                </div>
              </div>

              <div className="flex h-4 rounded-full overflow-hidden bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] mb-2">
                {STEPS.map((s, i) => {
                  const value = selected[s.key];
                  const pct = (value / totalExposure) * 100;
                  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 'bg-emerald-500'];
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={`${colors[i]} h-full`}
                      title={`${s.label}: €${value.toLocaleString('it-IT')}`}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-500"></div> Fatture</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-purple-500"></div> RIBA emesse</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-yellow-500"></div> Ordini</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500"></div> DDT</div>
              </div>

              {fidoUsage > 75 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-200/80">
                    Fido assicuratore crediti sopra soglia di attenzione ({fidoUsage.toFixed(0)}%). Valutare richiesta di estensione o sollecito incassi prima di accettare nuovi ordini.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
