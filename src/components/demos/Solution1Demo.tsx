import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  Users,
  AlertTriangle,
  TrendingDown,
  Compass,
  Sparkles
} from 'lucide-react';

type Tab = 'fatturato' | 'clienti' | 'anomalie';

const fatturatoMonths = [
  { m: 'Mag', v: 840 },
  { m: 'Giu', v: 920 },
  { m: 'Lug', v: 870 },
  { m: 'Ago', v: 540 },
  { m: 'Set', v: 1080 },
  { m: 'Ott', v: 1140 },
  { m: 'Nov', v: 1020 },
  { m: 'Dic', v: 960 },
  { m: 'Gen', v: 880 },
  { m: 'Feb', v: 1010 },
  { m: 'Mar', v: 1180 },
  { m: 'Apr', v: 1230 }
];

const topClients = [
  { name: 'Cliente A (CLI-001)', rev: 1240, share: 100 },
  { name: 'Cliente B (CLI-002)', rev: 980, share: 79 },
  { name: 'Cliente C (CLI-003)', rev: 760, share: 61 },
  { name: 'Cliente D (CLI-004)', rev: 640, share: 52 },
  { name: 'Cliente E (CLI-005)', rev: 560, share: 45 },
  { name: 'Cliente F (CLI-006)', rev: 480, share: 39 },
  { name: 'Cliente G (CLI-007)', rev: 420, share: 34 },
  { name: 'Cliente H (CLI-008)', rev: 380, share: 31 },
  { name: 'Cliente I (CLI-009)', rev: 340, share: 27 },
  { name: 'Cliente J (CLI-010)', rev: 290, share: 23 }
];

export function Solution1Demo() {
  const [tab, setTab] = useState<Tab>('fatturato');

  const maxVal = Math.max(...fatturatoMonths.map(d => d.v));
  const minVal = Math.min(...fatturatoMonths.map(d => d.v));

  const pathPoints = fatturatoMonths.map((d, i) => {
    const x = (i / (fatturatoMonths.length - 1)) * 560 + 40;
    const y = 180 - ((d.v - minVal) / (maxVal - minVal)) * 140;
    return { x, y, ...d };
  });

  const linePath = pathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${pathPoints[pathPoints.length - 1].x} 180 L ${pathPoints[0].x} 180 Z`;

  return (
    <div className="flex flex-col min-h-[650px] bg-[var(--color-dark-bg)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden shadow-2xl">
      <div className="flex items-center gap-3 px-6 py-4 bg-[var(--color-dark-surface)] border-b border-[var(--color-dark-border)]">
        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">BUSSOLA — Dashboard commerciale</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Sync Sage X3 — 2 min fa
          </p>
        </div>
      </div>

      <div className="flex border-b border-[var(--color-dark-border)] bg-[var(--color-dark-surface)] overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setTab('fatturato')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${tab === 'fatturato' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <BarChart3 className="w-4 h-4" />
          Fatturato 12M
        </button>
        <button
          onClick={() => setTab('clienti')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${tab === 'clienti' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Users className="w-4 h-4" />
          Top 10 Clienti
        </button>
        <button
          onClick={() => setTab('anomalie')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${tab === 'anomalie' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <AlertTriangle className="w-4 h-4" />
          Anomalie AI
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === 'fatturato' && (
            <motion.div key="fat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] p-4 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">Fatturato 12M</div>
                  <div className="text-2xl font-bold text-white">€ 11,87M</div>
                  <div className="text-xs text-green-400 mt-2">+8,2% vs anno precedente</div>
                </div>
                <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] p-4 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">Margine medio</div>
                  <div className="text-2xl font-bold text-white">18,4%</div>
                  <div className="text-xs text-gray-400 mt-2">Stabile vs Q3</div>
                </div>
                <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] p-4 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">Mese record</div>
                  <div className="text-2xl font-bold text-white">Apr</div>
                  <div className="text-xs text-[var(--color-accent)] mt-2">€ 1,23M</div>
                </div>
              </div>

              <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] p-5 rounded-xl">
                <h3 className="text-white font-bold mb-4">Trend fatturato — ultimi 12 mesi (k€)</h3>
                <svg viewBox="0 0 640 220" className="w-full h-auto">
                  <defs>
                    <linearGradient id="fatGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9FC428" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#9FC428" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3].map(i => (
                    <line key={i} x1="40" x2="600" y1={40 + i * 40} y2={40 + i * 40} stroke="#2a2d35" strokeDasharray="3,3" />
                  ))}
                  <motion.path
                    d={areaPath}
                    fill="url(#fatGrad)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                  <motion.path
                    d={linePath}
                    fill="none"
                    stroke="#9FC428"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />
                  {pathPoints.map((p, i) => (
                    <g key={i}>
                      <motion.circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#9FC428"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.04 }}
                      />
                      <text x={p.x} y="205" textAnchor="middle" className="text-[10px] fill-gray-500">{p.m}</text>
                    </g>
                  ))}
                </svg>
              </div>
            </motion.div>
          )}

          {tab === 'clienti' && (
            <motion.div key="cli" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] p-5 rounded-xl">
                <h3 className="text-white font-bold mb-4">Top 10 clienti per fatturato (k€)</h3>
                <div className="space-y-3">
                  {topClients.map((c, idx) => (
                    <div key={c.name} className="flex items-center gap-3">
                      <div className="w-48 text-sm text-gray-300 truncate">{idx + 1}. {c.name}</div>
                      <div className="flex-1 h-7 bg-[var(--color-dark-bg)] rounded-md overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c.share}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.05 }}
                          className="h-full bg-gradient-to-r from-[var(--color-accent)]/80 to-[var(--color-accent)] flex items-center justify-end pr-2"
                        >
                          <span className="text-xs font-semibold text-black">€ {c.rev}k</span>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'anomalie' && (
            <motion.div key="ano" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div className="bg-orange-500/10 border border-orange-500/30 p-5 rounded-xl flex items-start gap-4">
                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 shrink-0">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-orange-400 font-bold">Anomalia rilevata — Cliente C (CLI-003)</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">Confidenza 92%</span>
                  </div>
                  <p className="text-sm text-orange-200/80 mb-3">
                    Fatturato calato del <strong>−27%</strong> rispetto alla media rolling 6 mesi. Ordini aperti in discesa (−4 vs media). Ultimo contatto commerciale: 41 giorni fa.
                  </p>
                  <div className="bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] rounded-lg p-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Fonti dati</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300">SINVOICE</span>
                      <span className="text-xs px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300">SORDER</span>
                      <span className="text-xs px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300">STAT</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>Azione suggerita: pianificare contatto commerciale entro 7 giorni</span>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] p-5 rounded-xl">
                <h4 className="text-white font-bold mb-3">Altre anomalie della settimana</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-3 bg-[var(--color-dark-bg)] rounded-lg border border-[var(--color-dark-border)]">
                    <span className="text-gray-300">Cliente F — margine calato da 22% a 14%</span>
                    <span className="text-xs text-yellow-400">Media</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--color-dark-bg)] rounded-lg border border-[var(--color-dark-border)]">
                    <span className="text-gray-300">Articolo BAR-40×20 — giacenza sotto soglia</span>
                    <span className="text-xs text-yellow-400">Media</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--color-dark-bg)] rounded-lg border border-[var(--color-dark-border)]">
                    <span className="text-gray-300">Fornitore CLI-004 — ritardi consegne +3gg</span>
                    <span className="text-xs text-yellow-400">Media</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
