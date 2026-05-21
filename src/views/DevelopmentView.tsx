import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Euro,
  Star,
  Clock,
  TrendingUp,
  Target,
  Layers,
  ChevronDown,
  Rocket,
  ShieldCheck,
  Activity,
  Compass,
  Flame,
  Radar,
  Wrench,
  MessageSquare
} from 'lucide-react';

const modulesData = [
  {
    id: 'm1',
    name: 'BUSSOLA — BI & Analytics',
    description: 'Dashboard vendite, magazzino, verifica LIFO automatizzata, tracciabilità DDT→fattura, report leggibili per revisori.',
    time: '8 – 10 settimane',
    cost: '35.000 – 50.000 €',
    ranking: 5,
    icon: Compass,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    id: 'm2',
    name: 'CASSA FORTE — Financial Intelligence',
    description: 'Esposizione cliente completa (fatture + RIBA + ordini), tesoreria multi-banca, dichiarazioni d\'intento, supporto fatturazione attiva.',
    time: '10 – 12 settimane',
    cost: '40.000 – 60.000 €',
    ranking: 5,
    icon: ShieldCheck,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  {
    id: 'm3',
    name: 'FORGIA — Document Automation',
    description: 'Anonimizzazione disegni, parsing XML fatture passive, generazione Intrastat/CONAI, gestione voci doganali.',
    time: '10 – 14 settimane',
    cost: '45.000 – 65.000 €',
    ranking: 4,
    icon: Flame,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20'
  },
  {
    id: 'm4',
    name: 'SENTINELLA — Supplier Intelligence',
    description: 'Gestione centralizzata RDA, invio mail automatico 6–7 fornitori, parsing PDF disponibilità, conversione €/m↔€/ton.',
    time: '8 – 12 settimane',
    cost: '35.000 – 55.000 €',
    ranking: 4,
    icon: Radar,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  },
  {
    id: 'm5',
    name: 'BANCO — Material Optimization',
    description: 'Ottimizzazione taglio 1D (cutting stock), calcolo automatico materia prima, gestione semilavorati con fasi di lavorazione.',
    time: '10 – 14 settimane',
    cost: '40.000 – 60.000 €',
    ranking: 3,
    icon: Wrench,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20'
  },
  {
    id: 'm6',
    name: 'MAESTRO — AI Assistant',
    description: 'Interrogazione dati cross-modulo in linguaggio naturale, knowledge base aziendale, notifiche proattive, digest giornalieri.',
    time: '6 – 10 settimane',
    cost: '25.000 – 45.000 €',
    ranking: 3,
    icon: MessageSquare,
    color: 'text-[var(--color-accent)]',
    bgColor: 'bg-[var(--color-accent)]/10',
    borderColor: 'border-[var(--color-accent)]/20'
  }
];

const roadmapPhases = [
  {
    id: 'phase1',
    title: 'Fase 1 — Fondazione',
    modules: ['BUSSOLA', 'CASSA FORTE'],
    description: 'Mesi 1–4. Foundation Layer operativo (ETL + write-back Sage X3 + email engine) e primi moduli di valore immediato.\n\n• BUSSOLA: dashboard vendite + magazzino, verifica LIFO, tracciabilità DDT, report leggibili per revisori.\n• CASSA FORTE (Fase 1): esposizione cliente completa (fatture + RIBA) e tesoreria multi-banca base.\n\nPrerequisito bloccante: validazione API della software house Sage per il write-back.\nCopertura pain point: #6, #8, #9, #11, #12, #15, #16 (7 di 18).',
    icon: Rocket,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 'phase2',
    title: 'Fase 2 — Automazione',
    modules: ['FORGIA', 'SENTINELLA', 'CASSA FORTE (completamento)'],
    description: 'Mesi 4–9. Automazione documentale, supporto intelligente agli acquisti, completamento della gestione finanziaria.\n\n• FORGIA: anonimizzazione disegni, XML passivo, Intrastat, CONAI, voci doganali.\n• SENTINELLA: gestione RDA centralizzata, invio mail 6–7 fornitori, parsing PDF disponibilità, conversione UoM.\n• CASSA FORTE completa: dichiarazioni d\'intento + cash flow forecasting AI.\n\nRichiede API della software house Sage attive e accesso IMAP/SMTP al server di posta del cliente.\nCopertura pain point: #1, #2, #3, #5, #10, #13, #14, #17, #18 (+9 → 16 di 18).',
    icon: ShieldCheck,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'phase3',
    title: 'Fase 3 — Intelligenza',
    modules: ['BANCO', 'MAESTRO'],
    description: 'Mesi 9–12. Ottimizzazione materiali e intelligenza conversazionale cross-modulo.\n\n• BANCO: ottimizzazione tagli (bin packing 1D), calcolo materia prima da distinta cliente, modello unificato semilavorati.\n• MAESTRO: interrogazione dati in linguaggio naturale, knowledge base, notifiche proattive, digest giornaliero.\n\nCopertura finale: #4, #7 (+2 → 18 di 18 pain point coperti).',
    icon: Activity,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30'
  }
];

const renderStars = (ranking: number) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= ranking ? 'fill-[var(--color-accent)] text-[var(--color-accent)]' : 'fill-gray-700 text-gray-700'}`}
        />
      ))}
    </div>
  );
};

export function DevelopmentView() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>('phase1');

  const togglePhase = (id: string) => {
    if (expandedPhase === id) {
      setExpandedPhase(null);
    } else {
      setExpandedPhase(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-10"
    >
      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Piano di Sviluppo — 6 moduli, 12 mesi
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed max-w-4xl">
          La piattaforma modulare si sviluppa in 3 fasi per un totale di 12 mesi. Ogni modulo è indipendente e attivabile singolarmente: già la Fase 1 risolve 7 dei 18 pain point identificati. Tempi e costi sotto sono riferiti a MVP per singolo modulo — obiettivo: valore sul campo prima delle evoluzioni avanzate.
        </p>
      </header>

      <section>
        <Card className="bg-gradient-to-br from-[var(--color-dark-surface)] to-[var(--color-dark-bg)] border-[var(--color-accent)]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-[var(--color-accent)]" />
                Stima piattaforma completa
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
                Sviluppo parzialmente parallelo tra team frontend, backend e AI con metodologia Agile. I range riflettono la differenza tra implementazione base e funzionalità avanzate (forecasting AI, anomaly detection, supplier recommendation).
                <br /><br />
                <span className="text-[var(--color-accent)] font-medium">Costi operativi mensili:</span> €300–€1.400/mese a piena attività (infrastruttura + AI + email), dettaglio nella proposta commerciale.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-[var(--color-dark-bg)] p-4 rounded-xl border border-[var(--color-dark-border)] min-w-[200px]">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Clock className="w-5 h-5 text-[var(--color-accent)]" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Durata totale</span>
                  </div>
                  <div className="text-xl font-bold text-white">12 mesi</div>
                </div>

                <div className="bg-[var(--color-dark-bg)] p-4 rounded-xl border border-[var(--color-dark-border)] min-w-[200px]">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Euro className="w-5 h-5 text-[var(--color-accent)]" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Costo sviluppo</span>
                  </div>
                  <div className="text-xl font-bold text-white">220.000 – 335.000 €</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-[var(--color-dark-bg)] p-4 rounded-xl border border-[var(--color-dark-border)] min-w-[200px]">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Fase 1 (quick win)</span>
                  </div>
                  <div className="text-xl font-bold text-white">4 mesi</div>
                </div>

                <div className="bg-[var(--color-dark-bg)] p-4 rounded-xl border border-[var(--color-dark-border)] min-w-[200px]">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Euro className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Investimento Fase 1</span>
                  </div>
                  <div className="text-xl font-bold text-white">75.000 – 110.000 €</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-[var(--color-accent)]" />
            Moduli della piattaforma
          </h2>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
            Stime riferite a MVP per singolo modulo
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[var(--color-dark-border)] bg-[var(--color-dark-surface)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-dark-bg)] border-b border-[var(--color-dark-border)]">
                <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Modulo</th>
                <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Copertura</th>
                <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap">Stima tempi</th>
                <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap">Stima costi (€)</th>
                <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap">Complessità</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-dark-border)]">
              {modulesData.map((mod) => (
                <tr key={mod.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 align-top">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${mod.bgColor} ${mod.color} shrink-0 mt-0.5`}>
                        <mod.icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-white">{mod.name}</span>
                    </div>
                  </td>
                  <td className="p-4 align-top text-sm text-gray-400 leading-relaxed min-w-[300px]">
                    {mod.description}
                  </td>
                  <td className="p-4 align-top text-sm text-gray-300 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {mod.time}
                    </div>
                  </td>
                  <td className="p-4 align-top text-sm text-gray-300 whitespace-nowrap font-mono">
                    {mod.cost}
                  </td>
                  <td className="p-4 align-top whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {renderStars(mod.ranking)}
                      <span className="text-xs text-gray-500 font-medium">Livello {mod.ranking}/5</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[var(--color-accent)]" />
          Roadmap di Rilascio
        </h2>

        <div className="relative border-l-2 border-[var(--color-dark-border)] ml-4 md:ml-6 space-y-8 pb-4">
          {roadmapPhases.map((phase) => (
            <div key={phase.id} className="relative pl-8 md:pl-10">
              <div className={`absolute -left-[17px] top-4 w-8 h-8 rounded-full bg-[var(--color-dark-bg)] border-2 ${phase.borderColor} flex items-center justify-center z-10`}>
                <div className={`w-3 h-3 rounded-full ${phase.color.replace('text-', 'bg-')}`}></div>
              </div>

              <Card
                className={`cursor-pointer transition-all duration-300 border ${expandedPhase === phase.id ? `border-[var(--color-accent)] bg-[var(--color-dark-surface)]` : 'border-[var(--color-dark-border)] hover:border-gray-500'}`}
                onClick={() => togglePhase(phase.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${phase.bgColor} flex items-center justify-center ${phase.color} border ${phase.borderColor}`}>
                      <phase.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {phase.modules.map((mod, i) => (
                          <span key={i} className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-dark-bg)] text-gray-300 border border-[var(--color-dark-border)]">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 self-end md:self-auto ${expandedPhase === phase.id ? 'rotate-180 text-[var(--color-accent)]' : ''}`} />
                </div>

                <AnimatePresence>
                  {expandedPhase === phase.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 mt-4 border-t border-[var(--color-dark-border)]">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                          {phase.description}
                        </p>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {modulesData.filter(m => phase.modules.some(pm => m.name.startsWith(pm.replace(' (completamento)', '')))).map(mod => (
                            <div key={mod.id} className="bg-[var(--color-dark-bg)] p-4 rounded-lg border border-[var(--color-dark-border)]">
                              <div className="flex items-center gap-3 mb-2">
                                <mod.icon className={`w-5 h-5 ${mod.color}`} />
                                <h4 className="text-sm font-bold text-white truncate">{mod.name.split(' — ')[1]}</h4>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-800">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {mod.time}</span>
                                <span className="flex items-center gap-1"><Euro className="w-3 h-3" /> {mod.cost}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Card className="border-[var(--color-dark-border)]">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-[var(--color-accent)]" />
                Significato della Complessità
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                La complessità (1–5) riflette architettura, integrazioni richieste (la software house Sage, primario assicuratore crediti, banche, cassetto fiscale) e peso algoritmico (ML, ottimizzazione combinatoria, RAG). Non è un indicatore di priorità: la priorità segue l\'ordine di Fase.
              </p>
            </div>

            <div className="flex-[2] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)]">
                <div className="flex items-center gap-0.5 shrink-0 w-16">
                  <span className="font-bold text-white mr-1">5</span>
                  <Star className="w-3 h-3 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                </div>
                <span className="text-sm text-gray-300 font-medium">Complessità massima — BUSSOLA, CASSA FORTE</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)]">
                <div className="flex items-center gap-0.5 shrink-0 w-16">
                  <span className="font-bold text-white mr-1">4</span>
                  <Star className="w-3 h-3 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                </div>
                <span className="text-sm text-gray-300 font-medium">Complessità alta — FORGIA, SENTINELLA</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] sm:col-span-2">
                <div className="flex items-center gap-0.5 shrink-0 w-16">
                  <span className="font-bold text-white mr-1">3</span>
                  <Star className="w-3 h-3 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                </div>
                <span className="text-sm text-gray-300 font-medium">Complessità media — BANCO, MAESTRO</span>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </motion.div>
  );
}
