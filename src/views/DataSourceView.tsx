import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  Server,
  Download,
  FileText,
  Share2,
  Network,
  BrainCircuit,
  MessageSquare,
  Zap,
  FolderOpen,
  Globe,
  ChevronDown,
  ArrowRight,
  Filter,
  CheckCircle2,
  Cpu,
  Layers,
  PenTool,
  Mail
} from 'lucide-react';

type EcosystemEntry = {
  id: string;
  category: string;
  type: string;
  icon: any;
  description: string;
  sources: string[];
  provides: string[];
  color: string;
  bgColor: string;
  borderColor: string;
};

const ecosystemData: EcosystemEntry[] = [
  {
    id: 'erp',
    category: 'ERP & MES',
    type: 'Dati interni strutturati',
    icon: Server,
    description: 'Il cuore transazionale del cliente. Sage X3 è la fonte unica di verità per ordini, fatture, magazzino e contabilità; MES di stabilimento traccia la produzione; sistema di gestione job gestisce l\'archivio tecnico.',
    sources: [
      'Sage X3 — SQL Server, circa 270 tabelle attive, oltre 16M righe, ~130 GB',
      'MES di stabilimento (MES) — avanzamenti produzione, fasi, macchinari',
      'sistema di gestione job — gestione archivio disegni tecnici (27k disegni)'
    ],
    provides: [
      'Ordini, DDT, fatture attive/passive',
      'Giacenze, movimenti, LIFO snapshot',
      'Contabilità generale + analitica',
      'Stato avanzamento produzione'
    ],
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    id: 'cad',
    category: 'CAD & Strumenti tecnici',
    type: 'Dati interni semi-strutturati',
    icon: PenTool,
    description: 'Gli strumenti dell\'ufficio tecnico che producono disegni, programmi CNC e piani di taglio. Vivono accanto a Sage X3 e richiedono integrazioni puntuali per alimentare la piattaforma.',
    sources: [
      'CAD 3D per macchine — generazione programmi CNC (STEP → CNC)',
      'SolidWorks — modellazione e modifica disegni',
      'un tool di cutting esterno — ottimizzazione taglio online (non pienamente affidabile)'
    ],
    provides: [
      'File STEP, PDF tecnici, programmi CNC',
      'Distinte di taglio con lunghezze e quantità',
      'Modelli 3D e viste 2D per ordini'
    ],
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20'
  },
  {
    id: 'sheets',
    category: 'Fogli & Email',
    type: 'Dati interni non strutturati',
    icon: FolderOpen,
    description: 'Il patrimonio operativo fuori dal gestionale: tesoreria, dichiarazioni fiscali periodiche, RDA e corrispondenza quotidiana. Oggi frammentato in Excel e caselle di posta individuali.',
    sources: [
      'Excel tesoreria multi-banca (saldi, affidamenti, utilizzo fidi)',
      'Excel CONAI trimestrale (registrazione fatture per contributo)',
      'Excel Intrastat mensile (appoggio per portale Dogana)',
      'Excel scadenziario fatture passive',
      'Email RDA e risposte fornitori (copia-incolla)',
      'Email feedback commerciale e ordini cliente'
    ],
    provides: [
      'Saldi bancari e utilizzo fidi',
      'Dati CONAI e Intrastat',
      'Storico conversazioni cliente/fornitore',
      'PDF disponibilità fornitori giornalieri'
    ],
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  },
  {
    id: 'external',
    category: 'Dati esterni',
    type: 'Dati esterni strutturati',
    icon: Globe,
    description: 'Portali e servizi esterni che forniscono dati fiscali, assicurativi, doganali e HR. Tutti con API o flussi file-based integrabili nel Foundation Layer della piattaforma.',
    sources: [
      'Cassetto Fiscale — XML SDI fatture passive',
      'sistema di conservazione fatture — conservazione digitale a norma',
      'Agenzia delle Dogane — portale Intrastat',
      'Primario assicuratore crediti — massimali e coperture per cliente',
      'Rileva Fullweb — gestione presenze HR'
    ],
    provides: [
      'XML FatturaPA + PDF fatture passive',
      'Dichiarazioni Intrastat trasmesse',
      'Fidi assicurativi per cliente',
      'Nomenclatura doganale (codici 72.. / 73..)',
      'Presenze e ore lavorate'
    ],
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  }
];

export function DataSourceView() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [expandedLayer, setExpandedLayer] = useState<number | null>(1);

  const filteredEcosystem = activeFilter === 'All'
    ? ecosystemData
    : ecosystemData.filter(item => item.type.includes(activeFilter));

  const toggleLayer = (layer: number) => {
    if (expandedLayer === layer) {
      setExpandedLayer(null);
    } else {
      setExpandedLayer(layer);
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
          Architettura Dati della Piattaforma
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed max-w-4xl">
          La piattaforma modulare non sostituisce Sage X3: lo legge, lo arricchisce e — quando serve — gli scrive di ritorno. Il Foundation Layer consolida i dati dei quattro domini sorgente (ERP/MES, CAD, Fogli/Email, Servizi esterni) in un ambiente analitico e in un\'interfaccia conversazionale. Sage X3 resta la <strong>fonte unica di verità</strong>; la piattaforma è lo strato intelligente che la rende operativa.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-[var(--color-accent)]" />
          Foundation Layer — come funziona
        </h2>

        <div className="flex flex-col gap-4">
          <Card
            className={`cursor-pointer transition-all duration-300 border ${expandedLayer === 1 ? 'border-[var(--color-accent)] bg-[var(--color-dark-surface)]' : 'border-[var(--color-dark-border)] hover:border-gray-500'}`}
            onClick={() => toggleLayer(1)}
          >
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-dark-bg)] flex items-center justify-center text-[var(--color-accent)] border border-[var(--color-dark-border)]">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Layer 1 — Data Engine</h3>
                  <p className="text-sm text-gray-400">Replica analitica + write-back controllato verso Sage X3</p>
                </div>
              </div>
              <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${expandedLayer === 1 ? 'rotate-180 text-[var(--color-accent)]' : ''}`} />
            </div>

            <AnimatePresence>
              {expandedLayer === 1 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 mt-4 border-t border-[var(--color-dark-border)] grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-[var(--color-accent)] font-semibold flex items-center gap-2">
                        <Database className="w-4 h-4" /> Lettura (tutti i moduli)
                      </h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gray-500" /> ETL incrementale ogni 15 min sui dati transazionali</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gray-500" /> Replica oraria delle anagrafiche</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gray-500" /> Database analitico separato (zero impatto su ERP)</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gray-500" /> Schema di staging con validazione integrità</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[var(--color-accent)] font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Scrittura (via API della software house Sage)
                      </h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gray-500" /> Solo API/web service Sage X3 (mai INSERT diretti)</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gray-500" /> Validazione pre-scrittura + conferma operatore</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gray-500" /> Audit trail immutabile chi/cosa/quando</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gray-500" /> Fail-safe: Sage X3 resta operativo in autonomia</li>
                      </ul>
                    </div>
                    <div className="md:col-span-2 bg-[var(--color-dark-bg)] p-4 rounded-lg border border-[var(--color-dark-border)]">
                      <h4 className="text-white font-medium mb-3 text-sm">Moduli e direzione del flusso:</h4>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 border border-gray-700">BUSSOLA [R]</span>
                        <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 border border-gray-700">CASSA FORTE [R+W]</span>
                        <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 border border-gray-700">FORGIA [R+W+E]</span>
                        <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 border border-gray-700">SENTINELLA [R+W+E]</span>
                        <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 border border-gray-700">BANCO [R+W]</span>
                        <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 border border-gray-700">MAESTRO [R]</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-300 border ${expandedLayer === 2 ? 'border-[var(--color-accent)] bg-[var(--color-dark-surface)]' : 'border-[var(--color-dark-border)] hover:border-gray-500'}`}
            onClick={() => toggleLayer(2)}
          >
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-dark-bg)] flex items-center justify-center text-[var(--color-accent)] border border-[var(--color-dark-border)]">
                  <Network className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Layer 2 — AI Engine + Knowledge</h3>
                  <p className="text-sm text-gray-400">LLM, ML e vector database addestrati sul perimetro del cliente</p>
                </div>
              </div>
              <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${expandedLayer === 2 ? 'rotate-180 text-[var(--color-accent)]' : ''}`} />
            </div>

            <AnimatePresence>
              {expandedLayer === 2 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 mt-4 border-t border-[var(--color-dark-border)]">
                    <p className="text-gray-300 mb-6">Tre componenti lavorano insieme: modelli di linguaggio, modelli statistici tradizionali e indice vettoriale.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[var(--color-dark-bg)] p-4 rounded-lg border border-[var(--color-dark-border)]">
                        <BrainCircuit className="w-6 h-6 text-blue-400 mb-3" />
                        <h4 className="text-white font-semibold mb-2">LLM (GPT/Claude class)</h4>
                        <p className="text-sm text-gray-400">Parsing XML fatture, anonimizzazione disegni via OCR+NLP, chat MAESTRO, suggerimento voci doganali.</p>
                      </div>
                      <div className="bg-[var(--color-dark-bg)] p-4 rounded-lg border border-[var(--color-dark-border)]">
                        <Cpu className="w-6 h-6 text-purple-400 mb-3" />
                        <h4 className="text-white font-semibold mb-2">ML models</h4>
                        <p className="text-sm text-gray-400">Cash-flow forecasting 90 giorni, anomaly detection vendite, price prediction fornitori, predictive waste taglio barre.</p>
                      </div>
                      <div className="bg-[var(--color-dark-bg)] p-4 rounded-lg border border-[var(--color-dark-border)]">
                        <Share2 className="w-6 h-6 text-emerald-400 mb-3" />
                        <h4 className="text-white font-semibold mb-2">Vector Index</h4>
                        <p className="text-sm text-gray-400">Embeddings su catalogo 31k articoli, 2,6k fornitori, 27k disegni archivio — per ricerca semantica cross-modulo.</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded-lg">
                      <p className="text-sm text-[var(--color-accent)] font-medium text-center">
                        Ogni suggerimento AI mostra confidenza + fonte dati + override manuale. Nessuna decisione critica automatica.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-300 border ${expandedLayer === 3 ? 'border-[var(--color-accent)] bg-[var(--color-dark-surface)]' : 'border-[var(--color-dark-border)] hover:border-gray-500'}`}
            onClick={() => toggleLayer(3)}
          >
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-dark-bg)] flex items-center justify-center text-[var(--color-accent)] border border-[var(--color-dark-border)]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Layer 3 — Email Engine + Integration Bus</h3>
                  <p className="text-sm text-gray-400">IMAP/SMTP, webhook e API REST verso portali esterni</p>
                </div>
              </div>
              <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${expandedLayer === 3 ? 'rotate-180 text-[var(--color-accent)]' : ''}`} />
            </div>

            <AnimatePresence>
              {expandedLayer === 3 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 mt-4 border-t border-[var(--color-dark-border)] flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                      <p className="text-gray-300">Email e integrazioni esterne sono parte del Foundation Layer: le automazioni non si fermano al perimetro Sage.</p>
                      <ol className="space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-dark-bg)] text-[var(--color-accent)] text-xs font-bold border border-[var(--color-dark-border)] shrink-0">1</span>
                          <span className="text-sm text-gray-300">SENTINELLA invia RDA a 6–7 fornitori e parse-izza automaticamente le risposte</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-dark-bg)] text-[var(--color-accent)] text-xs font-bold border border-[var(--color-dark-border)] shrink-0">2</span>
                          <span className="text-sm text-gray-300">FORGIA invia i disegni anonimizzati e i PDF Intrastat</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-dark-bg)] text-[var(--color-accent)] text-xs font-bold border border-[var(--color-dark-border)] shrink-0">3</span>
                          <span className="text-sm text-gray-300">MAESTRO invia digest giornalieri e alert proattivi</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-dark-bg)] text-[var(--color-accent)] text-xs font-bold border border-[var(--color-dark-border)] shrink-0">4</span>
                          <span className="text-sm text-gray-300">Integration Bus: cassetto fiscale (SDI), Dogana, primario assicuratore crediti, banche</span>
                        </li>
                      </ol>
                    </div>

                    <div className="flex-1 bg-[var(--color-dark-bg)] p-5 rounded-xl border border-[var(--color-dark-border)]">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-semibold text-white">Esempio: RDA SENTINELLA</span>
                      </div>
                      <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 mb-4">
                        <p className="text-sm text-gray-300 italic">"Richiesta tubo quadro 80×80×6mm qualità S235 — 240 metri, consegna 15gg"</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Il sistema esegue automaticamente:</p>
                        <ul className="space-y-1">
                          <li className="flex items-center gap-2 text-sm text-[var(--color-accent)]"><CheckCircle2 className="w-3 h-3" /> Template mail personalizzato per 6 fornitori</li>
                          <li className="flex items-center gap-2 text-sm text-[var(--color-accent)]"><CheckCircle2 className="w-3 h-3" /> Parsing risposte e conversione €/m → €/ton</li>
                          <li className="flex items-center gap-2 text-sm text-[var(--color-accent)]"><CheckCircle2 className="w-3 h-3" /> Dashboard comparativa: prezzo, tempi, disponibilità</li>
                        </ul>
                        <p className="text-sm text-white mt-3 font-medium">30 min diventano 2 min.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-[var(--color-accent)]" />
            Ecosistema dati del cliente
          </h2>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter className="w-4 h-4 text-gray-400 mr-1" />
            {['All', 'interni strutturati', 'interni semi-strutturati', 'interni non strutturati', 'esterni strutturati'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? 'bg-[var(--color-accent)] text-black'
                    : 'bg-[var(--color-dark-bg)] text-gray-400 border border-[var(--color-dark-border)] hover:text-white'
                }`}
              >
                {filter === 'All' ? 'Tutti' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredEcosystem.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`h-full border-[var(--color-dark-border)] hover:border-gray-500 transition-colors flex flex-col`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${cat.bgColor} ${cat.color} border ${cat.borderColor} shrink-0`}>
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{cat.category}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${cat.bgColor} ${cat.color} ${cat.borderColor}`}>
                          {cat.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-6">{cat.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sorgenti</h4>
                      <ul className="space-y-2">
                        {cat.sources.map((source, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${cat.color.replace('text-', 'bg-')}`}></div>
                            {source}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dati forniti</h4>
                      <ul className="space-y-2">
                        {cat.provides.map((prov, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <ArrowRight className="w-4 h-4 text-gray-500 shrink-0" />
                            {prov}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <section>
        <Card className="bg-gradient-to-br from-[var(--color-dark-surface)] to-[var(--color-dark-bg)] border-[var(--color-accent)]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-[var(--color-accent)]" />
                Perché questa architettura
              </h2>
              <p className="text-gray-300 leading-relaxed">
                il cliente ha già investito in Sage X3, MES di stabilimento, sistema di gestione job, CAD 3D per macchine e SolidWorks. La piattaforma modulare li <strong>somma</strong> invece di sostituirli, aggiungendo l\'unico pezzo oggi mancante: uno strato intelligente che legge, interpreta e — dove serve — scrive. Sage X3 resta la fonte unica di verità; i commerciali, il back-office e l\'ufficio tecnico guadagnano visibilità e automazioni senza cambiare i loro strumenti di riferimento.
              </p>
            </div>

            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Zero impatto su Sage X3 in lettura',
                  'Scrittura solo via API della software house Sage',
                  'Audit trail completo',
                  'Fail-safe: ERP sempre operativo'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)]">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>
    </motion.div>
  );
}
