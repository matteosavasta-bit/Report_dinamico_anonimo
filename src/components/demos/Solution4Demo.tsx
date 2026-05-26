import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Radar,
  Factory,
  Edit2
} from 'lucide-react';

type Status = 'red' | 'yellow' | 'green';

type Supplier = {
  id: string;
  name: string;
  sentAt: string;
  status: Status;
  priceMeter: number | null;
  priceTon: number | null;
  leadDays: number | null;
  note: string;
};

const LINEAR_WEIGHT_KG_PER_M = 13.9;

const SUPPLIERS: Supplier[] = [
  { id: 'F001', name: 'Acciaierie Veneto S.p.A.', sentAt: '08:14', status: 'green', priceMeter: 16.80, priceTon: null, leadDays: 10, note: 'In stock' },
  { id: 'F002', name: 'SideroNord S.r.l.', sentAt: '08:14', status: 'green', priceMeter: 17.20, priceTon: null, leadDays: 14, note: 'Da produrre' },
  { id: 'F003', name: 'Metalli Lombardi', sentAt: '08:14', status: 'yellow', priceMeter: 16.40, priceTon: null, leadDays: null, note: 'Parziale — manca disponibilità' },
  { id: 'F004', name: 'Officine Emiliane', sentAt: '08:14', status: 'green', priceMeter: 17.50, priceTon: null, leadDays: 7, note: 'Pronto consegna' },
  { id: 'F005', name: 'Acciai del Sud', sentAt: '08:14', status: 'red', priceMeter: null, priceTon: null, leadDays: null, note: 'Nessuna risposta' },
  { id: 'F006', name: 'Steel Trading S.r.l.', sentAt: '08:14', status: 'red', priceMeter: null, priceTon: null, leadDays: null, note: 'Nessuna risposta' },
];

const suppliersWithNorm = SUPPLIERS.map(s => ({
  ...s,
  priceTon: s.priceMeter != null ? (s.priceMeter / LINEAR_WEIGHT_KG_PER_M) * 1000 : null
}));

export function Solution4Demo() {
  const [tab, setTab] = useState<'rda' | 'email'>('rda');

  const responded = suppliersWithNorm.filter(s => s.status !== 'red').length;
  const completed = suppliersWithNorm.filter(s => s.status === 'green').length;
  const bestPrice = suppliersWithNorm
    .filter(s => s.priceTon != null)
    .sort((a, b) => (a.priceTon! - b.priceTon!))[0];

  const statusBadge = (s: Status) => {
    if (s === 'green') return { cls: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle2, label: 'Risposta completa' };
    if (s === 'yellow') return { cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock, label: 'Parziale' };
    return { cls: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertCircle, label: 'Nessuna risposta' };
  };

  return (
    <div className="flex flex-col min-h-[650px] bg-[var(--color-dark-bg)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden shadow-2xl">
      <div className="flex items-center gap-3 px-6 py-4 bg-[var(--color-dark-surface)] border-b border-[var(--color-dark-border)]">
        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
          <Radar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">SENTINELLA — RDA Tubo quadro 80×80×6 (S235JR)</h3>
          <p className="text-xs text-gray-400">240 m richiesti — 6 fornitori contattati alle 08:14 — conversione automatica €/m → €/ton</p>
        </div>
      </div>

      <div className="flex border-b border-[var(--color-dark-border)] bg-[var(--color-dark-surface)]">
        <button
          onClick={() => setTab('rda')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${tab === 'rda' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Factory className="w-4 h-4" />
          RDA Builder (semafori)
        </button>
        <button
          onClick={() => setTab('email')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${tab === 'email' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Mail className="w-4 h-4" />
          Email Preview
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === 'rda' && (
            <motion.div key="rda" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] p-3 rounded-lg">
                  <div className="text-xs text-gray-400">Fornitori contattati</div>
                  <div className="text-xl font-bold text-white">6</div>
                </div>
                <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] p-3 rounded-lg">
                  <div className="text-xs text-gray-400">Risposte ricevute</div>
                  <div className="text-xl font-bold text-white">{responded}/6</div>
                </div>
                <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] p-3 rounded-lg">
                  <div className="text-xs text-gray-400">Best price €/ton</div>
                  <div className="text-xl font-bold text-[var(--color-accent)]">€ {bestPrice?.priceTon?.toFixed(0) ?? '—'}</div>
                </div>
              </div>

              <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-gray-400 uppercase bg-[var(--color-dark-bg)] border-b border-[var(--color-dark-border)]">
                      <tr>
                        <th className="px-4 py-3 text-left">Fornitore</th>
                        <th className="px-4 py-3 text-center">Stato</th>
                        <th className="px-4 py-3 text-right">€/m</th>
                        <th className="px-4 py-3 text-right">€/ton</th>
                        <th className="px-4 py-3 text-right">Consegna</th>
                        <th className="px-4 py-3 text-left">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-dark-border)]">
                      {suppliersWithNorm.map(s => {
                        const b = statusBadge(s.status);
                        const isBest = bestPrice?.id === s.id;
                        return (
                          <tr key={s.id} className={`hover:bg-white/5 transition-colors ${isBest ? 'bg-[var(--color-accent)]/5' : ''}`}>
                            <td className="px-4 py-3 font-medium text-white">
                              {s.name}
                              {isBest && <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/30">Best</span>}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs ${b.cls}`}>
                                <b.icon className="w-3 h-3" />
                                {b.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-gray-300">{s.priceMeter != null ? `€ ${s.priceMeter.toFixed(2)}` : '—'}</td>
                            <td className="px-4 py-3 text-right font-mono text-white">{s.priceTon != null ? `€ ${s.priceTon.toFixed(0)}` : '—'}</td>
                            <td className="px-4 py-3 text-right text-gray-300">{s.leadDays != null ? `${s.leadDays} gg` : '—'}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{s.note}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 bg-[var(--color-dark-bg)] border-t border-[var(--color-dark-border)] text-xs text-gray-500">
                  Conversione automatica: peso lineare {LINEAR_WEIGHT_KG_PER_M} kg/m da ITMMASTER. {completed}/6 risposte complete.
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'email' && (
            <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-dark-bg)] border-b border-[var(--color-dark-border)]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[var(--color-accent)]" />
                    <span className="text-sm font-semibold text-white">Template generato — per ogni fornitore</span>
                  </div>
                  <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                    <Edit2 className="w-3 h-3" />
                    Modifica template
                  </button>
                </div>
                <div className="p-5 space-y-3 text-sm">
                  <div className="grid grid-cols-[80px_1fr] gap-2 text-gray-400">
                    <span className="text-gray-500">Da:</span><span>acquisti@primario-player.it</span>
                    <span className="text-gray-500">A:</span><span>ordini@fornitore-acciaio.it</span>
                    <span className="text-gray-500">Oggetto:</span><span className="text-white font-medium">RDA-2026-0237 — Tubo quadro 80×80×6 S235JR</span>
                  </div>
                  <div className="pt-3 border-t border-[var(--color-dark-border)] text-gray-300 space-y-2 leading-relaxed">
                    <p>Buongiorno,</p>
                    <p>richiediamo cortese offerta per la fornitura seguente:</p>
                    <div className="bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] rounded-lg p-3 font-mono text-xs text-gray-300">
                      Articolo: Tubo quadro 80×80×6 mm (peso 13,9 kg/m)<br />
                      Qualità: S235JR<br />
                      Lunghezza barre: 6000 mm<br />
                      Quantità totale: 240 m (~3,34 t)<br />
                      Consegna: entro 15 giorni al cliente — [città cliente]
                    </div>
                    <p>Vi chiediamo di indicare: prezzo €/m, disponibilità (D/d), tempi di consegna.</p>
                    <p>Cordiali saluti,<br />Ufficio Acquisti</p>
                  </div>
                </div>
                <div className="px-5 py-3 bg-[var(--color-dark-bg)] border-t border-[var(--color-dark-border)] flex items-center justify-between">
                  <span className="text-xs text-gray-500">Invio programmato in coda a 6 fornitori</span>
                  <button disabled className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-accent)]/80 text-black text-xs font-semibold rounded-lg">
                    <Send className="w-3 h-3" />
                    Invia a 6 fornitori
                  </button>
                </div>
              </div>

              <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded-xl p-5">
                <h4 className="text-white font-semibold mb-3">Tracker risposte — live</h4>
                <div className="space-y-2">
                  {suppliersWithNorm.map(s => {
                    const b = statusBadge(s.status);
                    return (
                      <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)]">
                        <span className="text-sm text-gray-300 truncate">{s.name}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs ${b.cls}`}>
                          <b.icon className="w-3 h-3" />
                          {b.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
