import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings2,
  Monitor,
  Sparkles,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

const categoriesData = [
  {
    id: 'process',
    title: 'Processo',
    icon: Settings2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    activeColor: 'bg-blue-500',
    desc: 'Operazioni ancora manuali, eseguite con strumenti generici (Excel, LibreOffice, portali web, email) che producono sforzo ripetitivo, copia-incolla e perdita di tempo nel passaggio tra reparti.',
    points: [
      { id: 'p1', title: 'Scouting fornitori copia-incolla', desc: 'circa 240 RDA da novembre 2025: per ogni richiesta si contattano 6–7 fornitori con la stessa mail copia-incollata, una riga per volta. Risposte gestite manualmente.' },
      { id: 'p2', title: 'Conversione €/m ↔ €/ton manuale', desc: 'I fornitori rispondono in €/metro, ma la marginalità si valuta in €/tonnellata. Conversione fatta su Excel per ogni riga, prona a errori di battitura.' },
      { id: 'p3', title: 'Scansione PDF disponibilità giornalieri', desc: 'Ogni mattina 3 fornitori principali inviano un PDF con le disponibilità del giorno (convenzione D/d). Il commerciale li apre e li scorre a mano per cercare profili e qualità.' },
      { id: 'p4', title: 'Anonimizzazione disegni su LibreOffice', desc: 'Prima di inviare un disegno al fornitore, ogni dato cliente (nome, telefono, email, indirizzo) viene cancellato manualmente sul PDF. Operazione lunga, ripetuta ogni volta.' },
      { id: 'p5', title: 'Distinta di prelievo su Excel', desc: 'La distinta che il commerciale passa al magazzino vive su Excel parallelo a Sage X3: richiede doppia digitazione e rischia disallineamenti.' },
    ]
  },
  {
    id: 'software',
    title: 'Software',
    icon: Monitor,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    activeColor: 'bg-yellow-500',
    desc: 'Limiti strutturali degli strumenti in uso: Sage X3 non copre tutti i casi d\'uso, i sistemi satellite (Access, MES di stabilimento, CAD 3D per macchine, un tool di cutting esterno) non dialogano, e alcuni flussi richiedono passaggi manuali tra piattaforme.',
    points: [
      { id: 's1', title: 'Sage limita la fatturazione attiva', desc: 'Le restrizioni Sage X3 sui documenti obbligano ogni modifica a passare dalla fattura — non è possibile modificare direttamente il DDT, generando rework amministrativo.' },
      { id: 's2', title: 'Access non integrato con Sage', desc: 'Database Access storici convivono con Sage X3 senza sincronizzazione: dati cliente duplicati, aggiornamenti asimmetrici, perdita di fonte unica di verità.' },
      { id: 's3', title: 'XML fatture passive in 2–3 passaggi manuali', desc: 'L\'XML scaricato dal cassetto fiscale richiede passaggi manuali per arrivare in Sage, e il PDF allegato si separa — va poi ricollegato a mano alla fattura.' },
      { id: 's4', title: 'Semilavorati senza fasi di lavorazione', desc: 'Sage X3 non tratta il semilavorato come entità con fasi: per ogni fase si crea un nuovo codice articolo (MP → PL → PL_TRATT), frammentando la tracciabilità del prodotto.' },
      { id: 's5', title: 'Sync MES di stabilimento ↔ Sage da chiarire', desc: 'Lo scambio dati tra il MES MES di stabilimento e Sage X3 non ha un contratto formale: gli avanzamenti di produzione arrivano in Sage in modo non sistematico.' },
    ]
  },
  {
    id: 'ai',
    title: 'Dati & AI',
    icon: Sparkles,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    activeColor: 'bg-purple-500',
    desc: 'Situazioni in cui i dati esistono già in Sage X3 (~270 tabelle, oltre 16M righe) ma non sono interrogabili, riconciliabili o resi leggibili da strumenti di analisi e intelligenza.',
    points: [
      { id: 'a1', title: 'Nessuna BI post-Excel vecchio', desc: 'Il vecchio file Excel collegato al software precedente non è più utilizzabile. Oggi non esiste alcuno strumento di analisi dati sui oltre 16M di righe storiche presenti in Sage X3.' },
      { id: 'a2', title: 'Esposizione cliente incompleta', desc: 'L\'analisi partite di Sage mostra solo fatture non pagate, non le RIBA emesse non ancora scadute. Impossibile avere la vista complessiva dell\'esposizione per cliente.' },
      { id: 'a3', title: 'LIFO vs schede magazzino divergenti', desc: 'Il prospetto LIFO per il bilancio mostra numeri diversi rispetto alle schede magazzino. Recupero dati lungo, riconciliazione manuale, risultato difficile da certificare.' },
      { id: 'a4', title: 'Report Sage illeggibili', desc: 'Mastrini e bilanci estratti da Sage mostrano solo codici numerici senza descrizioni. I revisori e sindaci ricevono documentazione che richiede ore di interpretazione.' },
      { id: 'a5', title: 'Voci doganali vuote in anagrafica', desc: 'Il campo voce doganale di ITMMASTER è tipicamente vuoto: i commerciali non lo compilano, l\'amministrazione collega manualmente le voci per ogni fattura a fine mese.' },
    ]
  }
];

export function PainPointsView() {
  const [activeTab, setActiveTab] = useState(categoriesData[0].id);
  const [expandedPoints, setExpandedPoints] = useState<Record<string, boolean>>({});

  const togglePoint = (id: string) => {
    setExpandedPoints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeCategory = categoriesData.find(c => c.id === activeTab) || categoriesData[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tight">
          Pain Points del ciclo il cliente
        </h1>
        <p className="text-gray-400 leading-relaxed max-w-4xl">
          Quindici criticità operative selezionate tra le 18 emerse nell\'audit processi 2026, organizzate in tre macro-categorie: <strong>Processo</strong> (manualità residue), <strong>Software</strong> (limiti degli strumenti in uso) e <strong>Dati & AI</strong> (dati presenti ma non sfruttabili). Ogni pain point è tracciato nei quattro verbali dei reparti ed è mappato a uno dei moduli della piattaforma.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categoriesData.map((category) => {
          const isActive = activeTab === category.id;
          return (
            <button
              key={category.id}
              onClick={() => {
                setActiveTab(category.id);
              }}
              className={`relative flex flex-col items-start p-5 rounded-xl border transition-all duration-300 text-left overflow-hidden ${
                isActive
                  ? `bg-[var(--color-dark-surface)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/50`
                  : `bg-[var(--color-dark-bg)] border-[var(--color-dark-border)] hover:border-gray-500`
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent)]"
                />
              )}
              <div className={`p-3 rounded-lg mb-4 ${isActive ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : `${category.bgColor} ${category.color}`}`}>
                <category.icon className="w-6 h-6" />
              </div>
              <h3 className={`text-lg font-bold mb-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                {category.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {category.points.length} criticità identificate
              </p>
            </button>
          );
        })}
      </div>

      <Card className="border-[var(--color-dark-border)] bg-[var(--color-dark-surface)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <activeCategory.icon className={`w-6 h-6 ${activeCategory.color}`} />
              {activeCategory.title}
            </h2>
            <p className="text-gray-400 mt-2 max-w-3xl text-sm">
              {activeCategory.desc}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {activeCategory.points.map((point, index) => {
              const isExpanded = expandedPoints[point.id];
              return (
                <motion.div
                  key={point.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div
                    className={`border rounded-lg overflow-hidden transition-colors duration-200 cursor-pointer ${
                      isExpanded
                        ? `border-[var(--color-accent)]/50 bg-[var(--color-dark-bg)]`
                        : `border-[var(--color-dark-border)] bg-[var(--color-dark-bg)] hover:border-gray-600`
                    }`}
                    onClick={() => togglePoint(point.id)}
                  >
                    <div className="flex items-center justify-between p-4 md:p-5">
                      <div className="flex items-center gap-4">
                        <div className={`shrink-0 p-2 rounded-full ${activeCategory.bgColor} ${activeCategory.color}`}>
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-200">
                          {point.title}
                        </h3>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-gray-500 shrink-0 ml-4"
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
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-4 md:px-5 pb-5 pt-2 border-t border-[var(--color-dark-border)]/50 text-gray-400 leading-relaxed">
                            <div className="flex gap-3">
                              <div className="w-9 shrink-0"></div>
                              <p>{point.desc}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          +3 pain point minori trattati nei moduli dedicati (tracciabilità DDT, voci doganali, dichiarazioni d\'intento).
        </p>
      </Card>
    </motion.div>
  );
}
