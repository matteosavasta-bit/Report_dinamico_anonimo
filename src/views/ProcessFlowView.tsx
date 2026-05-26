import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  TrendingUp,
  Search,
  Ruler,
  ClipboardList,
  Factory,
  Truck,
  Receipt,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

const processData = [
  {
    id: 1,
    title: 'Richiesta cliente',
    subtitle: 'Ingresso',
    shortDesc: 'Ricezione richiesta di offerta via mail, PDF o Excel con distinta taglio.',
    fullDesc: 'Il ciclo parte dalla richiesta del cliente: una mail con allegato PDF/Excel della distinta, un elenco di lunghezze e quantità, talvolta integrato da un disegno tecnico. La richiesta finisce nella casella condivisa del commerciale di riferimento, senza un sistema di ticketing strutturato. La prima classificazione (cliente nuovo/ricorrente, urgenza, completezza dati) avviene a lettura umana.',
    icon: Mail,
    painPoints: [
      { id: 'RC-a', desc: 'Richieste eterogenee (PDF scansionati, email discorsive, Excel non standardizzati) — nessuna pre-strutturazione', importance: 4 },
      { id: 'RC-b', desc: 'Mancanza di tracciamento delle richieste aperte: si fa affidamento sulla memoria del commerciale', importance: 3 },
    ]
  },
  {
    id: 2,
    title: 'Analisi commerciale & verifica disponibilità',
    subtitle: 'Pre-offerta',
    shortDesc: 'Interpretazione della distinta, verifica giacenze, valutazione marginalità.',
    fullDesc: 'Il commerciale interpreta la distinta, consulta Sage X3 per le giacenze attuali, confronta lo storico prezzi del cliente e valuta se la richiesta può essere soddisfatta da stock o se sarà necessario emettere RDA ai fornitori. Per ogni riga si stima la marginalità incrociando prezzo di vendita atteso e costo di acquisto, spesso con calcoli Excel manuali (€/metro ↔ €/tonnellata).',
    icon: TrendingUp,
    painPoints: [
      { id: 'AC-a', desc: 'Assenza di BI: il vecchio Excel di analisi non è più utilizzabile e Sage X3 non offre viste operative sintetiche', importance: 5 },
      { id: 'AC-b', desc: 'Conversione €/m ↔ €/ton manuale via Excel per ogni articolo, soggetta a errori', importance: 4 },
      { id: 'AC-c', desc: 'Esposizione cliente incompleta: partite Sage non mostrano le RIBA emesse non ancora scadute', importance: 4 },
    ]
  },
  {
    id: 3,
    title: 'Scouting fornitori',
    subtitle: 'Acquisti',
    shortDesc: 'circa 240 RDA da novembre, 6–7 fornitori × 6–7 righe, tutto via copia-incolla.',
    fullDesc: 'Quando il materiale non è a stock, il commerciale invia richieste a 6–7 fornitori per ogni riga della RDA, tipicamente con copia-incolla della stessa mail. Ogni mattina i 3 fornitori principali inviano PDF con le disponibilità giornaliere (convenzione D/d), che vanno aperti e scorsi a mano per trovare profili e qualità richiesti. Le risposte tornano in €/metro e devono essere normalizzate manualmente.',
    icon: Search,
    painPoints: [
      { id: 'SF-a', desc: 'Scouting completamente manuale: circa 240 RDA da novembre, ciascuna con 6–7 righe × 6–7 fornitori', importance: 5 },
      { id: 'SF-b', desc: 'Scansione manuale di 3 PDF disponibilità/mattina per ricerca profili e qualità acciaio', importance: 4 },
      { id: 'SF-c', desc: 'Conversione manuale €/m → €/ton per confronto offerte omogeneo', importance: 4 },
    ]
  },
  {
    id: 4,
    title: 'Ufficio tecnico & preparazione disegni',
    subtitle: 'Engineering',
    shortDesc: 'sistema di gestione job + CAD 3D per macchine + SolidWorks su 27k disegni d\'archivio. Anonimizzazione manuale.',
    fullDesc: 'L\'ufficio tecnico prepara o recupera i disegni dall\'archivio (~27.000 disegni storici) usando sistema di gestione job per la gestione, CAD 3D per macchine per la generazione dei programmi CNC (STEP→CNC) e SolidWorks per le modifiche. Prima di inviare un disegno a un fornitore, il disegno deve essere sanitizzato rimuovendo manualmente ogni riferimento al cliente finale (nome, telefono, email, indirizzo) con LibreOffice sul PDF.',
    icon: Ruler,
    painPoints: [
      { id: 'UT-a', desc: 'Anonimizzazione manuale dei disegni con LibreOffice — operazione lunga, ripetitiva e prona a errori', importance: 5 },
      { id: 'UT-b', desc: 'Archivio 27k disegni privo di ricerca intelligente: difficile riutilizzare lavori simili già fatti', importance: 3 },
    ]
  },
  {
    id: 5,
    title: 'Conferma ordine & distinta di prelievo',
    subtitle: 'Operations',
    shortDesc: 'Ordine confermato, distinta generata, richiesta a magazzino.',
    fullDesc: 'Con l\'offerta accettata, il commerciale emette l\'ordine in Sage X3 e prepara la distinta di prelievo — spesso ancora su Excel — per comunicare al magazzino pezzi, lunghezze, lotti e priorità. In questa fase si decide se il pezzo si produce da barra intera o da spezzone, con impatto diretto sullo scarto. L\'ottimizzazione del taglio è affidata a un tool di cutting esterno (tool online non pienamente affidabile).',
    icon: ClipboardList,
    painPoints: [
      { id: 'CO-a', desc: 'Ottimizzazione taglio su un tool di cutting esterno online, risultati non pienamente affidabili — collo di bottiglia ufficio tecnico', importance: 5 },
      { id: 'CO-b', desc: 'Distinta di prelievo su Excel, disallineata rispetto ai movimenti effettivi in Sage', importance: 3 },
      { id: 'CO-c', desc: 'Fatturazione attiva: Sage ha restrizioni di documento, ogni modifica deve passare per fattura', importance: 4 },
    ]
  },
  {
    id: 6,
    title: 'Produzione (MES di stabilimento MES)',
    subtitle: 'Fabbrica',
    shortDesc: 'Fasi di lavorazione tracciate in MES di stabilimento. Semilavorati senza modello unificato.',
    fullDesc: 'La produzione è orchestrata da MES di stabilimento (MES) con fasi di lavorazione, macchinari e operatori. Il principale attrito è che Sage X3 non gestisce il semilavorato come entità con fasi: per ogni fase di lavorazione si crea un nuovo codice articolo (MP001360 → PL007069 → PL007069_TRATT), perdendo la vista unificata del percorso materiale → prodotto finito.',
    icon: Factory,
    painPoints: [
      { id: 'PR-a', desc: 'Sage X3 non legge il semilavorato come entità con fasi — nuovo prodotto per ogni fase di lavorazione', importance: 4 },
      { id: 'PR-b', desc: 'Sincronizzazione MES di stabilimento ↔ Sage non formalizzata: dipende da interventi ad hoc', importance: 3 },
    ]
  },
  {
    id: 7,
    title: 'Logistica & spedizione',
    subtitle: 'Delivery',
    shortDesc: 'DDT in Sage, certificati materiale, tracciabilità lotto→cliente.',
    fullDesc: 'A lavorazione completata, il magazzino emette il DDT in Sage X3, allega il certificato materiale del lotto di provenienza e organizza la spedizione. Il DDT deve poi essere tramutato in fattura: la tracciabilità di "quali DDT sono già stati fatturati" è tenuta su un file Excel manuale, parallelo a Sage.',
    icon: Truck,
    painPoints: [
      { id: 'LS-a', desc: 'Tracciabilità DDT → fattura su Excel manuale, parallelo a Sage — fonte di errori e ritardi', importance: 4 },
      { id: 'LS-b', desc: 'Voci doganali assenti in anagrafica articolo: collegamento manuale in fattura da parte dell\'amministrazione', importance: 3 },
    ]
  },
  {
    id: 8,
    title: 'Fatturazione & amministrazione',
    subtitle: 'Back-office',
    shortDesc: 'Fattura elettronica, XML passivo, Intrastat, CONAI, dichiarazioni d\'intento.',
    fullDesc: 'L\'amministrazione chiude il ciclo: emissione fatture attive, importazione XML dal cassetto fiscale (con 2–3 passaggi manuali e PDF da ricollegare), compilazione mensile Intrastat sul portale Dogana, registrazione fatture per CONAI trimestrale, gestione delle dichiarazioni d\'intento e monitoraggio delle scadenze bancarie. La tesoreria è tenuta su fogli Excel separati per banca.',
    icon: Receipt,
    painPoints: [
      { id: 'FA-a', desc: 'XML fatture passive con 2–3 passaggi manuali, PDF separato da ricollegare', importance: 4 },
      { id: 'FA-b', desc: 'Intrastat compilato manualmente sul portale Dogana, con Excel di appoggio', importance: 3 },
      { id: 'FA-c', desc: 'CONAI: ogni fattura registrata su Excel per calcolo totale trimestrale', importance: 3 },
      { id: 'FA-d', desc: 'Tesoreria su Excel per banca — no vista unificata di saldi, fidi e utilizzo', importance: 4 },
      { id: 'FA-e', desc: 'Dichiarazioni d\'intento: rischio di dimenticanze, impossibile modificare l\'ordine a valle', importance: 4 },
    ]
  }
];

export function ProcessFlowView() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (id: number) => {
    if (expandedStep === id) {
      setExpandedStep(null);
    } else {
      setExpandedStep(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-normal">
          Il ciclo end-to-end di Analisi strategica e piano introduzione AI
        </h1>
        <p className="text-gray-400 leading-relaxed max-w-4xl">
          Dall\'arrivo della richiesta cliente alla fatturazione: otto fasi operative che attraversano area commerciale, ufficio tecnico, magazzino e amministrazione. La mappa è il risultato dell\'audit processi condotto a febbraio 2026 sui quattro reparti (Commerciale, Logistica, Magazzino/Fiscale, Ufficio Tecnico) e identifica dove l\'attuale perimetro Sage X3 + strumenti esterni genera attrito. I pain point associati ad ogni fase sono i 18 rilevati nei verbali.
        </p>
      </header>

      <div className="relative mt-12 pb-12">
        <div className="absolute left-[27px] md:left-[39px] top-8 bottom-0 w-0.5 bg-[var(--color-dark-border)] z-0"></div>

        <div className="space-y-6 relative z-10">
          {processData.map((step, index) => {
            const isExpanded = expandedStep === step.id;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative"
              >
                <div className="flex items-start gap-4 md:gap-6">
                  <div
                    className={`shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center border-2 transition-colors duration-300 bg-[var(--color-dark-bg)] cursor-pointer z-10
                      ${isExpanded ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-[var(--color-dark-border)] text-gray-500 hover:border-gray-400 hover:text-gray-300'}`}
                    onClick={() => toggleStep(step.id)}
                  >
                    <span className="text-xs md:text-sm font-bold mb-0.5">Fase {step.id}</span>
                    <step.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>

                  <Card
                    className={`flex-1 cursor-pointer transition-all duration-300 ${isExpanded ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/50' : 'hover:border-gray-500'}`}
                    onClick={() => toggleStep(step.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="text-lg md:text-xl font-bold text-white">{step.title}</h3>
                          {step.subtitle && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--color-dark-bg)] text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                              {step.subtitle}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm md:text-base">{step.shortDesc}</p>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-gray-500 mt-1 shrink-0 ml-4"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 mt-4 border-t border-[var(--color-dark-border)]">
                            <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Descrizione dettagliata</h4>
                            <p className="text-gray-300 leading-relaxed mb-8">
                              {step.fullDesc}
                            </p>

                            <div className="bg-[var(--color-dark-bg)] rounded-lg p-4 md:p-5 border border-[var(--color-dark-border)]">
                              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                Pain Points identificati
                              </h4>

                              <div className="space-y-3">
                                {step.painPoints.map(pp => (
                                  <div key={pp.id} className="flex items-start gap-3 bg-[var(--color-dark-surface)] p-3 rounded border border-[var(--color-dark-border)]">
                                    <div className="shrink-0 mt-0.5">
                                      <span className="text-xs font-mono text-gray-500 bg-black/30 px-1.5 py-0.5 rounded">{pp.id}</span>
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-300">{pp.desc}</p>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-1" title={`Importanza: ${pp.importance}/5`}>
                                      {[...Array(5)].map((_, i) => (
                                        <div
                                          key={i}
                                          className={`w-1.5 h-4 rounded-sm ${i < pp.importance ? (pp.importance >= 4 ? 'bg-red-500' : pp.importance === 3 ? 'bg-yellow-500' : 'bg-blue-500') : 'bg-gray-700'}`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
