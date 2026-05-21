import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Bot,
  User,
  Database,
  Sparkles,
  Code,
  ChevronDown,
  MessageSquare
} from 'lucide-react';

type Source = { name: string; system: 'Sage X3' | 'MES di stabilimento' | 'sistema di gestione job' };

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: React.ReactNode;
  sources?: Source[];
  sql?: string;
};

const SUGGESTIONS = [
  {
    id: 'top5',
    label: 'Top 5 clienti Q4',
    prompt: 'Mostrami i top 5 clienti per fatturato Q4 con trend vs Q3',
  },
  {
    id: 'simili',
    label: 'Pezzi simili a DIS-2847',
    prompt: 'Trovami pezzi simili al disegno DIS-2847 negli ultimi 24 mesi',
  },
  {
    id: 'rda',
    label: 'RDA aperte >7 giorni',
    prompt: 'Quali RDA sono aperte da più di 7 giorni senza risposta completa?',
  },
  {
    id: 'scadenze',
    label: 'Scadenze settimana prossima',
    prompt: 'Scadenze pagamenti fornitori della prossima settimana',
  },
  {
    id: 'lifo',
    label: 'LIFO articolo BAR-40×20',
    prompt: 'Qual è il valore LIFO corrente dell\'articolo BAR-40×20?',
  }
];

export function Solution6Demo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: (
        <div>
          Ciao, sono MAESTRO — l\'assistente AI del cliente. Conosco i dati di <strong>Sage X3</strong>, <strong>MES di stabilimento</strong> e <strong>sistema di gestione job</strong>, le procedure aziendali e i 27k disegni d\'archivio. Chiedi pure in italiano.
        </div>
      ),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [expandedSql, setExpandedSql] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleSql = (id: string) => setExpandedSql(prev => ({ ...prev, [id]: !prev[id] }));

  const handleSuggestion = (s: typeof SUGGESTIONS[0]) => {
    if (isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: s.prompt };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let ai: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: null };

      if (s.id === 'top5') {
        ai.content = (
          <div className="space-y-3">
            <p>I top 5 clienti Q4 per fatturato, con trend vs Q3:</p>
            <div className="space-y-1.5">
              {[
                { n: 'Cliente A (CLI-001)', q4: 340, trend: 12 },
                { n: 'Cliente B (CLI-002)', q4: 298, trend: 4 },
                { n: 'Cliente C (CLI-003)', q4: 234, trend: -27 },
                { n: 'Cliente D (CLI-004)', q4: 187, trend: 8 },
                { n: 'Cliente E (CLI-005)', q4: 162, trend: 3 },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] rounded px-3 py-1.5 text-sm">
                  <span className="text-gray-300">{i + 1}. {c.n}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-white font-mono">€ {c.q4}k</span>
                    <span className={`text-xs font-semibold ${c.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>{c.trend > 0 ? '+' : ''}{c.trend}%</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">⚠️ Cliente C in calo del 27% — già segnalato da BUSSOLA come anomalia.</p>
          </div>
        );
        ai.sources = [{ name: 'SINVOICE + SINVOICED', system: 'Sage X3' }, { name: 'STAT', system: 'Sage X3' }];
        ai.sql = 'SELECT BPCNUM_0, SUM(AMTATI_0) AS q4_rev FROM SINVOICE\nWHERE ACCDAT_0 BETWEEN \'2025-10-01\' AND \'2025-12-31\'\nGROUP BY BPCNUM_0 ORDER BY q4_rev DESC LIMIT 5;';
      } else if (s.id === 'simili') {
        ai.content = (
          <div className="space-y-3">
            <p>Ho trovato <strong>3 disegni</strong> con somiglianza &gt;85% a DIS-2847 (tubo quadro 80×80×6, S235JR):</p>
            <div className="space-y-2">
              <div className="bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">DIS-2156 — Officine Alpha</span>
                  <span className="text-xs text-[var(--color-accent)]">94% match</span>
                </div>
                <div className="text-xs text-gray-400">Ottobre 2024 · 24 pezzi · € 17,40/m applicato · margine 18%</div>
              </div>
              <div className="bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">DIS-1987 — Beta Carpenterie</span>
                  <span className="text-xs text-[var(--color-accent)]">89% match</span>
                </div>
                <div className="text-xs text-gray-400">Marzo 2024 · 30 pezzi · € 16,95/m applicato · margine 21%</div>
              </div>
              <div className="bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">DIS-2412 — Gamma Lavorazioni</span>
                  <span className="text-xs text-[var(--color-accent)]">87% match</span>
                </div>
                <div className="text-xs text-gray-400">Maggio 2025 · 18 pezzi · € 17,80/m applicato · margine 15%</div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Prezzo medio storico: € 17,38/m. Suggerimento: partire da € 17,20–17,60/m per coerenza col portafoglio.</p>
          </div>
        );
        ai.sources = [{ name: '27k disegni + metadati', system: 'sistema di gestione job' }, { name: 'SINVOICED', system: 'Sage X3' }];
      } else if (s.id === 'rda') {
        ai.content = (
          <div className="space-y-3">
            <p>4 RDA aperte da più di 7 giorni senza risposta completa:</p>
            <div className="space-y-2">
              {[
                { id: 'RDA-2026-0211', days: 12, supplier: 'Acciai del Sud', piece: 'Tubo 60×60×4 S235' },
                { id: 'RDA-2026-0218', days: 9, supplier: 'Steel Trading', piece: 'Barra 40×20 S355' },
                { id: 'RDA-2026-0223', days: 8, supplier: 'Metalli Lombardi', piece: 'Lamiera 3mm' },
                { id: 'RDA-2026-0225', days: 8, supplier: 'SideroNord', piece: 'Profilato L 50×50' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] rounded px-3 py-2 text-sm">
                  <div className="min-w-0">
                    <div className="font-mono text-white truncate">{r.id} — {r.piece}</div>
                    <div className="text-xs text-gray-500 truncate">{r.supplier}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 shrink-0 ml-3">{r.days}gg</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">Vuoi che invii un sollecito automatico ai 4 fornitori?</p>
          </div>
        );
        ai.sources = [{ name: 'Workflow RDA SENTINELLA', system: 'MES di stabilimento' }, { name: 'BPSUPPLIER', system: 'Sage X3' }];
      } else if (s.id === 'scadenze') {
        ai.content = (
          <div className="space-y-3">
            <p>Scadenze pagamenti fornitori — <strong>21–27 aprile 2026</strong>:</p>
            <div className="bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] rounded p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Totale uscite previste</span>
                <span className="text-white font-mono font-bold">€ 184.320</span>
              </div>
              <div className="h-px bg-[var(--color-dark-border)]"></div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-400"><span>Lun 21 — Acciaierie Veneto (RIBA)</span><span className="font-mono">€ 48.500</span></div>
                <div className="flex justify-between text-gray-400"><span>Mer 23 — Officine Emiliane (bonifico)</span><span className="font-mono">€ 72.100</span></div>
                <div className="flex justify-between text-gray-400"><span>Gio 24 — SideroNord (RIBA)</span><span className="font-mono">€ 38.720</span></div>
                <div className="flex justify-between text-gray-400"><span>Ven 25 — Metalli Lombardi (bonifico)</span><span className="font-mono">€ 25.000</span></div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Liquidità prevista in settimana: € 210k (da CASSA FORTE forecasting). Copertura OK.</p>
          </div>
        );
        ai.sources = [{ name: 'GACCDUDATE + PAYMENTH', system: 'Sage X3' }, { name: 'CASSA FORTE forecast', system: 'Sage X3' }];
      } else if (s.id === 'lifo') {
        ai.content = (
          <div className="space-y-3">
            <p>Valore LIFO articolo <strong>BAR-40×20 S235JR</strong>:</p>
            <div className="bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] rounded p-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Valore LIFO corrente</div>
                <div className="text-xl font-bold text-white">€ 48.720</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Giacenza</div>
                <div className="text-xl font-bold text-white">4.280 kg</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ultimo snapshot</div>
                <div className="text-sm text-gray-300">31/03/2026</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Vs scheda magazzino</div>
                <div className="text-sm text-green-400">✓ Allineato</div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Nessuna discrepanza rilevata da BUSSOLA tra XXI0IMXSH e STOJOU per questo articolo.</p>
          </div>
        );
        ai.sources = [{ name: 'XXI0IMXSH (snapshot)', system: 'Sage X3' }, { name: 'STOJOU + STOCK', system: 'Sage X3' }];
      }

      setMessages(prev => [...prev, ai]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[650px] bg-[var(--color-dark-bg)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden shadow-2xl">
      <div className="flex items-center gap-3 px-6 py-4 bg-[var(--color-dark-surface)] border-b border-[var(--color-dark-border)]">
        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">MAESTRO — Assistente il cliente</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online · RAG su ~270 tabelle Sage X3 + MES di stabilimento + sistema di gestione job
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] text-gray-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.sources.map((src, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] text-xs text-gray-400">
                        <Database className="w-3 h-3" />
                        <span className="text-gray-500">{src.system}:</span>
                        <span>{src.name}</span>
                      </span>
                    ))}
                  </div>
                )}

                {msg.sql && (
                  <div className="w-full">
                    <button
                      onClick={() => toggleSql(msg.id)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[var(--color-accent)] transition-colors"
                    >
                      <Code className="w-3 h-3" />
                      Vedi query SQL
                      <motion.div animate={{ rotate: expandedSql[msg.id] ? 180 : 0 }}>
                        <ChevronDown className="w-3 h-3" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedSql[msg.id] && (
                        <motion.pre
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] rounded-lg p-3 text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre"
                        >
                          {msg.sql}
                        </motion.pre>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-[var(--color-dark-surface)] border-t border-[var(--color-dark-border)]">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {SUGGESTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => handleSuggestion(s)}
              disabled={isTyping}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] text-xs text-gray-300 hover:text-white hover:border-[var(--color-accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              {s.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Chiedi a MAESTRO in italiano…"
            disabled
            className="w-full bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)] disabled:opacity-50"
          />
          <button disabled className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-[var(--color-accent)] disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
