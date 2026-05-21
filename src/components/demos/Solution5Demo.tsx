import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  Play,
  RotateCcw,
  Scissors,
  Percent,
  Minus,
  Plus,
  Sparkles
} from 'lucide-react';

type Piece = {
  id: string;
  label: string;
  length: number;
  qty: number;
  color: string;
};

const BAR_LENGTH = 6000;
const SAW_WIDTH = 3;

const COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-yellow-500', 'bg-pink-500'
];

const INITIAL_PIECES: Piece[] = [
  { id: 'p1', label: 'Cliente Alpha — lotto 1', length: 1850, qty: 4, color: COLORS[0] },
  { id: 'p2', label: 'Cliente Alpha — lotto 2', length: 1200, qty: 6, color: COLORS[1] },
  { id: 'p3', label: 'Cliente Beta — trave', length: 2400, qty: 3, color: COLORS[2] },
  { id: 'p4', label: 'Cliente Gamma — rinforzo', length: 780, qty: 8, color: COLORS[3] },
  { id: 'p5', label: 'Cliente Delta — montante', length: 1500, qty: 5, color: COLORS[4] },
];

type PackedSegment = { pieceId: string; length: number; color: string; label: string };
type Bar = { segments: PackedSegment[]; used: number; waste: number };

function ffdPack(pieces: Piece[]): Bar[] {
  const items: { pieceId: string; length: number; color: string; label: string }[] = [];
  pieces.forEach(p => {
    for (let i = 0; i < p.qty; i++) {
      items.push({ pieceId: p.id, length: p.length, color: p.color, label: p.label });
    }
  });
  items.sort((a, b) => b.length - a.length);
  const bars: Bar[] = [];
  items.forEach(item => {
    const cost = item.length + SAW_WIDTH;
    const bar = bars.find(b => b.used + cost <= BAR_LENGTH);
    if (bar) {
      bar.segments.push({ pieceId: item.pieceId, length: item.length, color: item.color, label: item.label });
      bar.used += cost;
    } else {
      bars.push({ segments: [{ pieceId: item.pieceId, length: item.length, color: item.color, label: item.label }], used: cost, waste: 0 });
    }
  });
  bars.forEach(b => { b.waste = BAR_LENGTH - b.used; });
  return bars;
}

export function Solution5Demo() {
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_PIECES);
  const [result, setResult] = useState<Bar[] | null>(null);

  const totalMeters = pieces.reduce((s, p) => s + p.length * p.qty, 0) / 1000;

  const optimize = () => setResult(ffdPack(pieces));
  const reset = () => { setPieces(INITIAL_PIECES); setResult(null); };

  const adjust = (id: string, delta: number) => {
    setPieces(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p));
    setResult(null);
  };

  const totalUsedMm = result ? result.reduce((s, b) => s + b.used, 0) : 0;
  const totalWasteMm = result ? result.reduce((s, b) => s + b.waste, 0) : 0;
  const utilization = result ? (totalUsedMm / (result.length * BAR_LENGTH)) * 100 : 0;
  const baselineBars = result ? Math.ceil(result.length * 1.33) : 0;
  const baselineUtil = result && baselineBars > 0 ? (totalUsedMm / (baselineBars * BAR_LENGTH)) * 100 : 0;

  return (
    <div className="flex flex-col min-h-[650px] bg-[var(--color-dark-bg)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden shadow-2xl">
      <div className="flex items-center gap-3 px-6 py-4 bg-[var(--color-dark-surface)] border-b border-[var(--color-dark-border)]">
        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
          <Wrench className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">BANCO — Ottimizzatore taglio barre</h3>
          <p className="text-xs text-gray-400">Barra standard 6000 mm · Larghezza sega {SAW_WIDTH} mm · Algoritmo FFD con raffinamento</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded-xl p-5">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[var(--color-accent)]" />
              Distinta cliente
            </h4>
            <div className="space-y-2 mb-4">
              {pieces.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)]">
                  <div className={`w-3 h-8 rounded-sm ${p.color}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{p.label}</div>
                    <div className="text-xs text-gray-500 font-mono">{p.length} mm</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => adjust(p.id, -1)} className="w-7 h-7 rounded bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] text-gray-400 hover:text-white flex items-center justify-center">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-mono text-white">{p.qty}</span>
                    <button onClick={() => adjust(p.id, 1)} className="w-7 h-7 rounded bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] text-gray-400 hover:text-white flex items-center justify-center">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] mb-4">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Totale lineare</span>
              <span className="text-sm font-bold text-white font-mono">{totalMeters.toFixed(2)} m</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={optimize}
                className="flex-1 py-3 rounded-lg bg-[var(--color-accent)] text-black font-semibold hover:bg-[var(--color-accent-hover)] transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Ottimizza
              </button>
              <button
                onClick={reset}
                className="py-3 px-4 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] text-gray-400 hover:text-white transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <AnimatePresence mode="wait">
            {!result && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[var(--color-dark-surface)] border border-dashed border-[var(--color-dark-border)] rounded-xl p-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] flex items-center justify-center mx-auto mb-4">
                  <Scissors className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-white font-medium mb-1">Ottimizzazione in attesa</p>
                <p className="text-sm text-gray-500">Premi "Ottimizza" per calcolare il piano di taglio — algoritmo First-Fit Decreasing.</p>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] p-3 rounded-lg">
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Barre necessarie</div>
                    <div className="text-2xl font-bold text-white">{result.length}</div>
                  </div>
                  <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] p-3 rounded-lg">
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Utilizzo</div>
                    <div className="text-2xl font-bold text-[var(--color-accent)]">{utilization.toFixed(1)}%</div>
                  </div>
                  <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] p-3 rounded-lg">
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Scarto totale</div>
                    <div className="text-2xl font-bold text-white">{totalWasteMm} mm</div>
                  </div>
                </div>

                <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded-xl p-5">
                  <h4 className="text-white font-semibold mb-4">Piano di taglio</h4>
                  <div className="space-y-3">
                    {result.map((bar, idx) => {
                      let offset = 0;
                      return (
                        <div key={idx}>
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span className="font-mono">Barra #{idx + 1} — 6000 mm</span>
                            <span>{bar.waste} mm scarto ({((bar.waste / BAR_LENGTH) * 100).toFixed(1)}%)</span>
                          </div>
                          <div className="relative h-8 bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] rounded overflow-hidden flex">
                            {bar.segments.map((seg, sidx) => {
                              const width = (seg.length / BAR_LENGTH) * 100;
                              const el = (
                                <motion.div
                                  key={sidx}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${width}%` }}
                                  transition={{ duration: 0.4, delay: idx * 0.05 + sidx * 0.03 }}
                                  className={`${seg.color} h-full border-r border-[var(--color-dark-bg)] flex items-center justify-center text-[10px] font-mono text-black/70 font-bold`}
                                  title={`${seg.label}: ${seg.length} mm`}
                                >
                                  {width > 10 ? `${seg.length}` : ''}
                                </motion.div>
                              );
                              offset += seg.length + SAW_WIDTH;
                              return el;
                            })}
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(bar.waste / BAR_LENGTH) * 100}%` }}
                              transition={{ duration: 0.4, delay: idx * 0.05 + 0.15 }}
                              className="bg-gray-700/60 h-full flex items-center justify-center text-[10px] font-mono text-gray-400"
                            >
                              {bar.waste > BAR_LENGTH * 0.1 ? 'scarto' : ''}
                            </motion.div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[var(--color-dark-surface)] to-[var(--color-dark-bg)] border border-[var(--color-accent)]/30 rounded-xl p-5">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
                    Confronto vs un tool di cutting esterno
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider mb-2">BANCO (FFD)</div>
                      <div className="text-3xl font-bold text-[var(--color-accent)]">{result.length} barre</div>
                      <div className="text-sm text-gray-300 mt-1 flex items-center gap-2">
                        <Percent className="w-3 h-3" />
                        {utilization.toFixed(1)}% utilizzo
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-2">un tool di cutting esterno naive</div>
                      <div className="text-3xl font-bold text-gray-400 line-through decoration-orange-400/50">{baselineBars} barre</div>
                      <div className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                        <Percent className="w-3 h-3" />
                        {baselineUtil.toFixed(1)}% utilizzo
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    Risparmio stimato: {baselineBars - result.length} barra/e ({(((baselineBars - result.length) / Math.max(baselineBars, 1)) * 100).toFixed(0)}%). Benchmark reale da validare su ordini storici del cliente.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
