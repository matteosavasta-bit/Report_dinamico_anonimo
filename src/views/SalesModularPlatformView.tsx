import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { DiagramExpander } from '../components/ui/DiagramExpander';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  ArrowRight,
  Search,
  MessageSquare,
  Clock,
  TrendingUp,
  Target,
  ChevronDown,
  Database,
  FileText,
  ShieldCheck,
  FileSearch,
  ListChecks,
  AlertTriangle,
  Timer,
  LineChart,
  Presentation,
  Compass,
  Flame,
  Radar,
  Wrench,
  Mail,
  Euro,
  Package,
  Ruler,
  Scissors,
  BrainCircuit,
  BarChart3
} from 'lucide-react';
import { Solution1Demo } from '../components/demos/Solution1Demo';
import { Solution2Demo } from '../components/demos/Solution2Demo';
import { Solution3Demo } from '../components/demos/Solution3Demo';
import { Solution4Demo } from '../components/demos/Solution4Demo';
import { Solution5Demo } from '../components/demos/Solution5Demo';
import { Solution6Demo } from '../components/demos/Solution6Demo';

const moduleBussolaData = {
  id: 'Soluzione 1',
  title: 'BUSSOLA — Business Intelligence & Analytics',
  icon: Compass,
  phase: 'Fondazione (Fase 1)',
  integrations: 'STAT, SINVOICE, SORDER, STOJOU, XXI0IMXSH',
  overview: {
    description: 'BUSSOLA è lo strato di Business Intelligence che trasforma i oltre 16 milioni di righe presenti in Sage X3 in dashboard interattive, report leggibili e alert proattivi. Oggi il cliente opera senza BI: il vecchio Excel di analisi non è più utilizzabile e Sage offre solo mastrini numerici difficilmente interpretabili. Il modulo legge (mai scrive) le tabelle transazionali — fatture, ordini, DDT, giacenze, movimenti — e produce viste che rispondono in secondi a domande che oggi richiedono ore di raccolta manuale.',
    objective: 'L\'obiettivo è dare a direzione commerciale, amministrazione e magazzino/fiscale una vista unica e aggiornata sul business senza dover più ricorrere a file Excel paralleli. Il valore è immediato: il primo giorno dopo il go-live, il commerciale vede il fatturato per cliente in 10 secondi invece che in 2–4 ore, il fiscalista riconcilia il LIFO in un click invece che in 3–5 giorni, e i revisori ricevono report già formattati.',
  },
  features: [
    {
      id: 'f1',
      title: 'Dashboard Vendite & Magazzino',
      icon: BarChart3,
      description: 'Dashboard interattive per direzione commerciale: fatturato per cliente/prodotto/agente/area, trend vs anno precedente e budget, marginalità per riga d\'ordine (prezzo vendita − costo acquisto), conversione offerta→ordine per commerciale. Per il magazzino: giacenze real-time per articolo/lotto/ubicazione, rotazione scorte, alert sotto/sovra-scorta, drill-down dal totale al singolo movimento.',
      value: 'Tabelle STAT, SINVOICE, SORDER, SQUOTE, STOCK, STOJOU',
    },
    {
      id: 'f2',
      title: 'Verifica LIFO Automatizzata',
      icon: ShieldCheck,
      description: 'Riconciliazione automatica tra gli snapshot LIFO mensili (XXI0IMXSH, 765k righe) e le schede magazzino. Evidenzia le discrepanze con drill-down al movimento che le genera. Produce un prospetto LIFO certificabile per il bilancio con tracciabilità completa — 3–5 giorni di lavoro manuale diventano 1 click.',
      value: 'Pain point #15 risolto — XXI0IMXSH + STOJOU',
    },
    {
      id: 'f3',
      title: 'Tracciabilità DDT → Fattura + Report Leggibili',
      icon: FileText,
      description: 'Stato automatico di ogni DDT (consegnato, fatturato, parzialmente fatturato) con alert sui DDT non fatturati oltre N giorni — elimina il file Excel manuale. In parallelo: mastrini formattati con descrizioni testuali, esportazione PDF professionale per revisori e sindaci, situazioni infrannuali con piano dei conti personalizzato.',
      value: 'Pain point #9 + #16 risolti — SDELIVERY, SINVOICE, GACCENTRY',
    }
  ],
  kpis: [
    {
      title: 'Tempo per un report vendite',
      icon: Clock,
      description: 'Da 2–4 ore di raccolta dati manuale a 10 secondi di interrogazione dashboard.',
      impact: '−99% tempo di risposta'
    },
    {
      title: 'Verifica LIFO per bilancio',
      icon: ShieldCheck,
      description: 'Da 3–5 giorni di confronto manuale tra prospetto e schede a 1 click di riconciliazione.',
      impact: 'Bilancio certificabile'
    },
    {
      title: 'Qualità report per revisori',
      icon: TrendingUp,
      description: 'Da mastrini numerici illeggibili a report PDF con descrizioni testuali e piano dei conti personalizzato.',
      impact: 'Zero domande di chiarimento'
    }
  ],
  painPoints: [
    {
      title: '#6 — Assenza completa di BI',
      description: 'Il vecchio Excel collegato al software precedente non è più utilizzabile, nessuno strumento di analisi dati. BUSSOLA lo sostituisce con dashboard interattive su tutto lo storico Sage.',
      category: 'Commerciale',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      title: '#15 — Discrepanze LIFO',
      description: 'Il prospetto LIFO per il bilancio mostra numeri diversi rispetto alle schede magazzino. Riconciliazione automatica tra XXI0IMXSH e STOJOU con drill-down al movimento.',
      category: 'Magazzino/Fiscale',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    {
      title: '#9 + #16 — DDT→fattura e report illeggibili',
      description: 'File Excel manuale per la tracciabilità DDT→fattura e mastrini Sage senza descrizioni. Entrambi sostituiti da tracciamento automatico e PDF formattati.',
      category: 'Amministrazione',
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    }
  ]
};

const moduleCassaforteData = {
  id: 'Soluzione 2',
  title: 'CASSA FORTE — Financial Intelligence',
  icon: ShieldCheck,
  phase: 'Fondazione (Fase 1) + Automazione (Fase 2)',
  integrations: 'GACCDUDATE, PAYMENTH, PINVOICE, YATR*, SORDER',
  overview: {
    description: 'CASSA FORTE è il controllo finanziario che Sage X3 non riesce a dare. Oggi l\'esposizione cliente è incompleta (le partite mostrano solo le fatture non pagate, non le RIBA emesse non ancora scadute), la tesoreria vive su fogli Excel separati per banca, le dichiarazioni d\'intento dipendono dalla memoria individuale. Il modulo consolida scadenzario, partite, movimenti bancari e fidi del primario assicuratore crediti in un\'unica vista — e scrive su Sage X3 (via API della software house Sage) le riconciliazioni e i flag.',
    objective: 'Fornire alla direzione, all\'amministrazione e al controllo di gestione una vista unica e in tempo reale dell\'esposizione cliente e del cash flow previsto. Eliminare i rischi operativi della tesoreria manuale (errori di trascrizione, dimenticanze sulle dichiarazioni d\'intento) e anticipare i problemi di liquidità con modelli di forecasting a 90 giorni.',
  },
  features: [
    {
      id: 'f1',
      title: 'Esposizione Cliente Completa',
      icon: Euro,
      description: 'Vista unificata per cliente: fatture aperte + RIBA emesse non scadute + ordini confermati non consegnati + DDT non fatturati. Calcolo automatico dell\'esposizione totale, confronto con i fidi del primario assicuratore crediti (tabelle YATR*), storico pagamenti con indice di puntualità. Report esposizione "al 31/12" ricostruibile alla data per chiusura bilancio.',
      value: 'Pain point #11 risolto — GACCDUDATE + PAYMENTH + SINVOICE + SORDER + YATR*',
    },
    {
      id: 'f2',
      title: 'Tesoreria Intelligente',
      icon: LineChart,
      description: 'Dashboard unica per tutte le banche: saldi, affidamenti accordati, utilizzo fidi, disponibilità residua. Previsione cassa a 30/60/90 giorni basata su scadenze note. Importazione automatica movimenti bancari con riconciliazione proposta. I dati affidamenti/fidi non presenti in Sage vanno inseriti manualmente o integrati via API bancarie.',
      value: 'Pain point #12 risolto — GACCDUDATE + PINVOICE + PAYMENTH + API bancarie',
    },
    {
      id: 'f3',
      title: 'Dichiarazioni d\'Intento & Supporto Fatturazione',
      icon: AlertTriangle,
      description: 'Registro centralizzato delle dichiarazioni d\'intento per cliente (non tracciate in Sage — struttura dati nuova). Alert automatico quando un DDT o fattura coinvolge un cliente con dichiarazione attiva. Verifica coerenza IVA tra ordine/DDT/fattura. Cruscotto DDT pronti per fattura con suggerimento di raggruppamento.',
      value: 'Pain point #17 + #8 risolti',
    }
  ],
  kpis: [
    {
      title: 'Verifica esposizione cliente',
      icon: Timer,
      description: 'Da 20–30 min (prospetti manuali multipli) a istantanea (vista unificata con fidi del primario assicuratore crediti).',
      impact: '−95% tempo verifica'
    },
    {
      title: 'Gestione tesoreria',
      icon: Clock,
      description: 'Da 1–2 ore/giorno (Excel per banca) a 15 min/giorno (dashboard multi-banca automatizzata).',
      impact: '−87% tempo operativo'
    },
    {
      title: 'Rischio dichiarazioni d\'intento',
      icon: ShieldCheck,
      description: 'Da elevato (memoria individuale) a zero (alert automatici su DDT/fattura).',
      impact: 'Errori fiscali evitati'
    }
  ],
  painPoints: [
    {
      title: '#11 — Esposizione cliente incompleta',
      description: 'L\'analisi partite Sage non considera le RIBA emesse non ancora scadute. CASSA FORTE unifica fatture + RIBA + ordini + DDT per una vista totale dell\'esposizione.',
      category: 'Amministrazione',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      title: '#12 — Tesoreria su Excel',
      description: 'Affidamenti, utilizzo fidi e movimenti bancari vivono su fogli separati per banca. Dashboard unificata + previsione cassa AI a 90 giorni.',
      category: 'Amministrazione',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    {
      title: '#17 + #8 — Dichiarazioni d\'intento e fatturazione',
      description: 'Registro dichiarazioni + alert automatici e cruscotto fatturazione con raggruppamento DDT suggerito.',
      category: 'Amministrazione',
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    }
  ]
};

const moduleForgiaData = {
  id: 'Soluzione 3',
  title: 'FORGIA — Document Automation',
  icon: Flame,
  phase: 'Automazione (Fase 2)',
  integrations: 'XXI022XUQ, PINVOICE, SINVOICE, ITMMASTER, XXI00ATEXTRW',
  overview: {
    description: 'FORGIA automatizza i cinque flussi documentali più onerosi dell\'amministrazione e del commerciale del cliente: anonimizzazione disegni PDF (oggi manuale con LibreOffice, 5–10 min/disegno), importazione XML fatture passive (oggi 2–3 passaggi con PDF da ricollegare), generazione Intrastat (oggi compilazione mensile sul portale Dogana), calcolo CONAI (Excel trimestrale), gestione voci doganali (collegamento manuale dell\'amministrazione). Usa OCR + NLP per i dati personali, e modelli di classificazione per suggerire le voci tariffarie.',
    objective: 'Restituire ore-persona di back-office trasformando cinque attività ripetitive ad alto rischio di errore in automazioni verificate. Il commerciale non deve più sanitizzare manualmente i disegni; l\'amministrazione smette di compilare Excel paralleli per Intrastat e CONAI; le voci doganali vengono suggerite al momento giusto, non ricostruite a fine mese.',
  },
  features: [
    {
      id: 'f1',
      title: 'Anonimizzazione Automatica Disegni',
      icon: FileSearch,
      description: 'Upload del PDF tecnico → OCR + NLP rilevano automaticamente aree con dati sensibili (nome cliente, telefono, email, indirizzo) → mascheramento con rettangolo o sostituzione con dati del cliente → download PDF pulito. Batch processing. Accuratezza >95%. L\'operatore verifica il risultato prima dell\'invio.',
      value: 'Pain point #5 risolto — 5–10 min → 10 secondi',
    },
    {
      id: 'f2',
      title: 'XML Passivo → Sage + Intrastat + CONAI',
      icon: ListChecks,
      description: 'Parsing automatico XML FatturaPA: pre-compilazione campi Sage X3 (codice IVA, conto, fornitore) con suggerimenti da storico, ricollegamento PDF alla fattura, validazione contro ordine e DDT. Generazione Intrastat mensile pre-compilato (formato portale Dogana). Calcolo CONAI trimestrale con dettaglio per materiale.',
      value: 'Pain point #10 + #13 + #14 risolti',
    },
    {
      id: 'f3',
      title: 'Gestione Voci Doganali',
      icon: AlertTriangle,
      description: 'Suggerimento automatico della voce doganale basato su descrizione articolo e classificazione (codici 72.. / 73.. per acciaio). Compilazione massiva su ITMMASTER con voce doganale mancante. Distinzione automatica tra voce acquisto estero e vendita. Richiede campo custom su Sage X3 tramite la software house Sage.',
      value: 'Pain point #18 risolto — classificazione su 9.425 codici CN',
    }
  ],
  kpis: [
    {
      title: 'Anonimizzazione un disegno',
      icon: Timer,
      description: 'Da 5–10 minuti con LibreOffice a 10 secondi automatici.',
      impact: '−97% tempo'
    },
    {
      title: 'Importazione fattura passiva XML',
      icon: Clock,
      description: 'Da 15–20 min (3 passaggi manuali + PDF) a 2 min (pre-compilata, un click).',
      impact: '−88% tempo'
    },
    {
      title: 'Intrastat mensile + CONAI',
      icon: TrendingUp,
      description: 'Da 1–2 giorni (portale + Excel) + 1 giorno CONAI a 30 min + 15 min.',
      impact: '−95% tempo back-office'
    }
  ],
  painPoints: [
    {
      title: '#5 — Anonimizzazione disegni',
      description: 'Ogni disegno tecnico sanitizzato manualmente con LibreOffice prima dell\'invio al fornitore. OCR + NLP automatizzano il processo con mascheramento o sostituzione.',
      category: 'Commerciale',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      title: '#10 + #13 + #14 — Fatture passive + CONAI + Intrastat',
      description: 'Tre flussi oggi manuali e paralleli a Sage. FORGIA li consolida in un unico flusso automatizzato con verifica e esportazione nei formati richiesti.',
      category: 'Amministrazione',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    {
      title: '#18 — Voci doganali',
      description: 'Campo voce doganale tipicamente vuoto in ITMMASTER; amministrazione collega manualmente ogni fattura. Classificazione AI + compilazione massiva risolvono il problema all\'origine.',
      category: 'Amministrazione',
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    }
  ]
};

const moduleSentinellaData = {
  id: 'Soluzione 4',
  title: 'SENTINELLA — Supplier Intelligence',
  icon: Radar,
  phase: 'Automazione (Fase 2)',
  integrations: 'BPSUPPLIER, PORDER, PINVOICE, ITMMASTER, ITMBPS + email IMAP/SMTP',
  overview: {
    description: 'SENTINELLA trasforma lo scouting fornitori — il singolo flusso più pesante dell\'area commerciale del cliente — da attività manuale a vantaggio competitivo. Oggi per ogni richiesta cliente il commerciale contatta 6–7 fornitori con copia-incolla di mail (circa 240 RDA da novembre, ciascuna con 6–7 righe), apre ogni mattina 3 PDF di disponibilità, converte €/m → €/ton via Excel. Il modulo introduce un workflow RDA completamente nuovo (oggi non esistente in Sage), automatizza invio mail e parsing risposte, e consolida lo storico fornitori in scorecard.',
    objective: 'Passare da 30–45 minuti per inviare una RDA a 6 fornitori a 2 minuti, e da 1–2 ore di raccolta offerte comparate a una dashboard comparativa in tempo reale. Il commerciale sceglie su fatti (prezzo normalizzato €/ton, disponibilità, storico puntualità) invece di ricordi individuali. I 27k disegni archivio + catalogo articoli diventano una Knowledge Base interrogabile per ritrovare lavori simili già fatti.',
  },
  features: [
    {
      id: 'f1',
      title: 'RDA Builder + Invio Mail Automatico',
      icon: Target,
      description: 'Interfaccia unica per creare richieste d\'acquisto con righe multiple. Template personalizzato per ogni fornitore basato su storico. Invio automatico a 6–7 fornitori con tracciamento risposte via semafori (rosso/giallo/verde). Parsing delle risposte: estrazione prezzo + unità di misura + tempi + disponibilità. Dashboard comparativa live.',
      value: 'Pain point #1 risolto — 30 min → 2 min',
    },
    {
      id: 'f2',
      title: 'Conversione €/m ↔ €/ton + PDF Disponibilità',
      icon: FileSearch,
      description: 'Conversione istantanea basata sul peso lineare dell\'articolo (ITMMASTER). Normalizzazione prezzi per confronto omogeneo. Parsing automatico dei PDF giornalieri dei fornitori: estrazione strutturata dimensione/qualità/disponibilità (convenzione D/d)/prezzo/lotto. Ricerca indicizzata: "mostrami disponibilità tubo 80×80×6 oggi".',
      value: 'Pain point #2 + #3 risolti',
    },
    {
      id: 'f3',
      title: 'Knowledge Base Disegni + Scorecard Fornitori',
      icon: Search,
      description: 'Ricerca semantica sui 27k disegni d\'archivio + catalogo articoli per ritrovare lavori simili e offrire prezzi consistenti. Scorecard per fornitore: puntualità, competitività prezzi, reattività (lo scoring qualità non è coperto — modulo QLY* Sage vuoto). Price prediction e supplier recommendation AI.',
      value: 'Bonus cross-modulo — 27k disegni + ITMMASTER + BPSUPPLIER',
    }
  ],
  kpis: [
    {
      title: 'Invio RDA a 6 fornitori',
      icon: Mail,
      description: 'Da 30–45 min di copia-incolla a 2 min di invio automatizzato con tracking.',
      impact: '−95% tempo RDA'
    },
    {
      title: 'Confronto offerte comparate',
      icon: BarChart3,
      description: 'Da 1–2 ore (raccolta mail + Excel) a 5 min (dashboard live con €/ton normalizzato).',
      impact: 'Decisioni data-driven'
    },
    {
      title: 'Ricerca disponibilità PDF',
      icon: Timer,
      description: 'Da 15–20 min/mattina (apertura e lettura PDF) a 1 min (ricerca indicizzata).',
      impact: '−94% tempo mattutino'
    }
  ],
  painPoints: [
    {
      title: '#1 — Scouting fornitori manuale',
      description: 'circa 240 RDA × 6–7 righe × 6–7 fornitori con copia-incolla mail. SENTINELLA automatizza invio, tracking e parsing risposte con dashboard comparativa.',
      category: 'Commerciale',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      title: '#2 — Conversione unità di misura',
      description: 'Conversione €/m → €/ton manuale via Excel per ogni riga. Calcolo istantaneo basato su peso lineare da ITMMASTER.',
      category: 'Commerciale',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    {
      title: '#3 — Scansione PDF disponibilità',
      description: '3 PDF/mattina aperti a mano per cercare profili. Parsing automatico + ricerca indicizzata + alert su articoli cercati.',
      category: 'Commerciale',
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    }
  ]
};

const moduleBancoData = {
  id: 'Soluzione 5',
  title: 'BANCO — Material Optimization',
  icon: Wrench,
  phase: 'Intelligenza (Fase 3)',
  integrations: 'STOCK, STOJOU, MFGHEAD, YYTSQP, YENTDIVROTT + algoritmo FFD',
  overview: {
    description: 'BANCO risolve il nodo più tecnico dell\'area commerciale del cliente: il calcolo della materia prima dalla distinta cliente. Oggi il commerciale usa un tool di cutting esterno (sito online non pienamente affidabile) per stimare barre e scarto, oppure passa il lavoro all\'ufficio tecnico — collo di bottiglia. Il modulo implementa un algoritmo di ottimizzazione 1D (bin packing, First-Fit Decreasing con raffinamento), consulta le giacenze reali (STOCK), produce un piano di taglio con scarto minimo e lista d\'acquisto residua. In parallelo, introduce un modello unificato per i semilavorati, oggi frammentati in più codici articolo Sage.',
    objective: 'Eliminare il collo di bottiglia dell\'ufficio tecnico rendendo l\'ottimizzazione taglio self-service per il commerciale — con un algoritmo più preciso di un tool di cutting esterno e integrato con le giacenze. Dare per la prima volta al cliente una vista unificata del semilavorato (materia prima → fase 1 → fase 2 → prodotto finito) con tracciabilità lotto→cliente e accumulo costi per fase.',
  },
  features: [
    {
      id: 'f1',
      title: 'Ottimizzazione Taglio 1D',
      icon: Scissors,
      description: 'Input: distinta cliente (pezzi × lunghezza) + lunghezze barre disponibili. Algoritmo FFD greedy + raffinamento produce il piano di taglio ottimale con scarto minimo. Confronto scenari (diverse lunghezze standard). Integrazione con STOCK real-time. Storico tagli da YENTDIVROTT per identificare lunghezze più efficienti.',
      value: 'Pain point #4 risolto — sostituto intelligente di un tool di cutting esterno',
    },
    {
      id: 'f2',
      title: 'Calcolo Materia Prima da Distinta',
      icon: Ruler,
      description: 'Dalla distinta cliente al calcolo automatico delle materie prime (KG) necessarie. Verifica disponibilità a magazzino prima di emettere RDA. Stima tempi di approvvigionamento basata su storico fornitori. Il commerciale emette l\'offerta senza dipendere dall\'ufficio tecnico.',
      value: 'Self-service per commerciali — da ore/giorni a 1 min',
    },
    {
      id: 'f3',
      title: 'Modello Unificato Semilavorati',
      icon: Package,
      description: 'Vista overlay sul modello Sage X3 attuale (un codice per fase: MP001360 → PL007069 → PL007069_TRATT) che collega più record MFGHEAD tra loro. Calcolo costo per fase con accumulo costi (materiale + lavorazione interna/esterna). Tracciabilità lotto materia prima → pezzo consegnato.',
      value: 'Pain point #7 risolto — architettura overlay su MFGHEAD',
    }
  ],
  kpis: [
    {
      title: 'Calcolo materia prima',
      icon: Timer,
      description: 'Da 15–30 min (manuale + un tool di cutting esterno) a 1 min (automatico integrato STOCK).',
      impact: '−95% tempo'
    },
    {
      title: 'Scarto medio taglio',
      icon: Scissors,
      description: 'Da ~8–12% (stima verbale, da validare) a obiettivo: riduzione significativa vs un tool di cutting esterno (benchmark su ordini reali).',
      impact: 'Risparmio materia prima'
    },
    {
      title: 'Attesa ufficio tecnico',
      icon: Clock,
      description: 'Da ore/giorni (collo di bottiglia) a zero (self-service commerciali).',
      impact: 'Tempo-offerta azzerato'
    }
  ],
  painPoints: [
    {
      title: '#4 — Ottimizzazione taglio barre',
      description: 'un tool di cutting esterno online non pienamente affidabile; calcolo materia prima come collo di bottiglia ufficio tecnico. FFD interno + integrazione giacenze + confronto scenari.',
      category: 'Commerciale',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      title: '#7 — Semilavorati senza fasi',
      description: 'Sage X3 crea un nuovo codice articolo per ogni fase di lavorazione, frammentando la tracciabilità. Modello overlay unificato con vista fasi complete e accumulo costi.',
      category: 'Commerciale',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    }
  ]
};

const moduleMaestroData = {
  id: 'Soluzione 6',
  title: 'MAESTRO — AI Assistant',
  icon: MessageSquare,
  phase: 'Intelligenza (Fase 3)',
  integrations: 'Tutti i moduli — accesso read-only al Foundation Layer',
  overview: {
    description: 'MAESTRO è l\'assistente AI conversazionale che unifica l\'accesso a tutti i dati e le funzionalità della piattaforma. Non sostituisce gli altri moduli ma li rende interrogabili in linguaggio naturale. Risponde a domande come "Qual è l\'esposizione del cliente CLI-001?", "Mostrami le consegne in ritardo di questa settimana", "Pezzi simili al disegno DIS-2847". Ogni risposta cita la fonte dati (Sage X3, MES di stabilimento, sistema di gestione job) e, se richiesto, mostra la query SQL sottostante.',
    objective: 'Dare a chiunque in azienda (commerciali, magazzino, amministrazione, direzione) un\'interfaccia unica per accedere a dati, procedure e alert. L\'assistente conosce le procedure aziendali, sa correlare dati di moduli diversi ("il cliente X ordina di più ma paga più tardi") e invia digest giornalieri personalizzati per ruolo. Riduce il tempo di formazione dei nuovi dipendenti da settimane a giorni.',
  },
  features: [
    {
      id: 'f1',
      title: 'Interrogazione Dati in Linguaggio Naturale',
      icon: MessageSquare,
      description: 'RAG (Retrieval-Augmented Generation) sul perimetro del cliente: circa 270 tabelle attive, oltre 16M righe. L\'AI traduce la domanda in query, recupera i dati rilevanti, genera risposta testuale + grafico. Ogni risposta cita fonte e, su richiesta, mostra la query SQL.',
      value: 'Chat cross-modulo con citazioni fonti',
    },
    {
      id: 'f2',
      title: 'Knowledge Base Aziendale',
      icon: Search,
      description: 'Indicizzazione di procedure operative, listini, specifiche tecniche, 27k disegni archivio. Risposte contestuali che conoscono e applicano le procedure del cliente. FAQ automatiche ("come si fa una nota di credito?"). Formazione on-demand per nuovi dipendenti.',
      value: 'Vector index su procedure + disegni + catalogo',
    },
    {
      id: 'f3',
      title: 'Notifiche Proattive + Analisi Cross-Modulo',
      icon: AlertTriangle,
      description: 'Alert su clienti in ritardo, scadenze imminenti, giacenze critiche, dichiarazioni d\'intento in scadenza. Digest giornaliero personalizzato per ruolo (commerciale/amministrativo/acquisti). Correlazioni tra moduli: "il cliente X ordina più del solito ma paga sempre più tardi" → suggerimento azione.',
      value: 'Alert + digest + correlazioni AI',
    }
  ],
  kpis: [
    {
      title: 'Tempo per un dato specifico',
      icon: Timer,
      description: 'Da 5–30 min (navigazione Sage + Excel) a 10 secondi (domanda in linguaggio naturale).',
      impact: '−98% tempo di risposta'
    },
    {
      title: 'Formazione nuovi dipendenti',
      icon: Users,
      description: 'Da settimane di affiancamento a giorni con assistente sempre disponibile + knowledge base.',
      impact: 'On-boarding accelerato'
    },
    {
      title: 'Rilevamento situazioni critiche',
      icon: TrendingUp,
      description: 'Da reattivo (quando si scopre il problema) a proattivo (alert + correlazioni automatiche).',
      impact: 'Problemi anticipati'
    }
  ],
  painPoints: [
    {
      title: 'Trasversale — tutti i moduli',
      description: 'MAESTRO non risolve un singolo pain point: mette a fattor comune tutti i moduli rendendoli accessibili via linguaggio naturale e proattivi con notifiche e correlazioni AI.',
      category: 'Cross-modulo',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  ]
};

type ModuleData = typeof moduleBussolaData;

const moduleMap: Record<string, ModuleData> = {
  'Soluzione 1': moduleBussolaData,
  'Soluzione 2': moduleCassaforteData,
  'Soluzione 3': moduleForgiaData,
  'Soluzione 4': moduleSentinellaData,
  'Soluzione 5': moduleBancoData,
  'Soluzione 6': moduleMaestroData,
};

export function SalesModularPlatformView({ module, onNavigate }: { module?: string, onNavigate?: (module: string) => void }) {
  const isOverview = !module;
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});

  const toggleFeature = (id: string) => {
    setExpandedFeatures(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const overviewModules = [
    { id: 'Soluzione 1', title: 'BUSSOLA', subtitle: 'BI & Analytics', icon: Compass, desc: 'Dashboard vendite, magazzino e LIFO su Sage X3. Primo ritorno immediato.', phase: 'Fase 1' },
    { id: 'Soluzione 2', title: 'CASSA FORTE', subtitle: 'Financial Intelligence', icon: ShieldCheck, desc: 'Esposizione cliente completa, tesoreria multi-banca, cash flow AI.', phase: 'Fase 1–2' },
    { id: 'Soluzione 3', title: 'FORGIA', subtitle: 'Document Automation', icon: Flame, desc: 'Anonimizzazione disegni, XML passivo, Intrastat, CONAI, voci doganali.', phase: 'Fase 2' },
    { id: 'Soluzione 4', title: 'SENTINELLA', subtitle: 'Supplier Intelligence', icon: Radar, desc: 'RDA automatizzate, parsing PDF, conversione €/m↔€/ton, scorecard.', phase: 'Fase 2' },
    { id: 'Soluzione 5', title: 'BANCO', subtitle: 'Material Optimization', icon: Wrench, desc: 'Ottimizzazione taglio bin packing, calcolo materia prima, semilavorati.', phase: 'Fase 3' },
    { id: 'Soluzione 6', title: 'MAESTRO', subtitle: 'AI Assistant', icon: MessageSquare, desc: 'Chat cross-modulo in italiano, knowledge base, notifiche proattive.', phase: 'Fase 3' },
  ];

  const mod = module ? moduleMap[module] : undefined;
  const ModuleIcon = mod?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={module || 'overview'}
      className="space-y-8"
    >
      <header>
        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-tight">
          {isOverview || !mod ? 'Piattaforma Modulare il cliente' : mod.title}
        </h1>
        <p className="text-gray-400">
          {isOverview
            ? '6 moduli indipendenti, attivabili separatamente, coprono tutti i 18 pain point dell\'audit processi. Sage X3 resta la fonte unica di verità.'
            : 'Funzionalità principali, KPI di impatto e pain point risolti — con demo interattiva.'}
        </p>
      </header>

      {isOverview ? (
        <div className="space-y-8">
          <DiagramExpander
            src="/diagrams/piattaforma-modulare.svg"
            title="Architettura della piattaforma modulare"
            caption="6 moduli sopra un Foundation Layer — letture da Sage X3, scritture via API della software house Sage, email automatizzate."
            mvpIdea="La piattaforma si affianca a Sage X3 senza sostituirlo. Il Foundation Layer (Data Engine + AI Engine + Email Engine + Integration Bus + Security) è condiviso tra tutti i moduli; ogni modulo è attivabile separatamente e fornisce valore anche in isolamento. L\'ordine di attivazione consigliato (Fondazione → Automazione → Intelligenza) massimizza il ritorno sul primo mese e minimizza i prerequisiti API della software house Sage alle fasi successive."
          />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {overviewModules.map((mod, index) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card
                  className="h-full hover:border-[var(--color-accent)] transition-colors cursor-pointer group"
                  onClick={() => onNavigate?.(mod.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-[var(--color-dark-bg)] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-black transition-colors">
                      <mod.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-dark-bg)] text-gray-400 border border-[var(--color-dark-border)]">
                      {mod.phase}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{mod.title}</h3>
                  <p className="text-xs text-[var(--color-accent)] uppercase tracking-wider font-semibold mb-3">{mod.subtitle}</p>
                  <p className="text-gray-400 text-sm mb-4">{mod.desc}</p>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium">
                    <span>Esplora modulo</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ) : mod && ModuleIcon ? (
        <div className="space-y-8">
          <Card className="bg-[var(--color-dark-surface)] border-[var(--color-dark-border)] overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-[var(--color-dark-bg)] rounded-lg border border-[var(--color-dark-border)]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Fase roadmap</div>
                  <div className="text-sm font-medium text-white">{mod.phase}</div>
                </div>
              </div>

              <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/50 to-transparent"></div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                  <ModuleIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Modulo</div>
                  <div className="text-sm font-medium text-white">{mod.title}</div>
                </div>
              </div>

              <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Fonti dati</div>
                  <div className="text-sm font-medium text-white">{mod.integrations}</div>
                </div>
              </div>
            </div>
          </Card>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs">1</span>
              Overview
            </h2>
            <Card className="bg-gradient-to-br from-[var(--color-dark-surface)] to-[var(--color-dark-bg)] border-[var(--color-accent)]/20">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl bg-[var(--color-dark-bg)] text-[var(--color-accent)] border border-[var(--color-dark-border)] shrink-0">
                  <ModuleIcon className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Il ruolo del modulo</h3>
                    <p className="text-gray-300 leading-relaxed">{mod.overview.description}</p>
                  </div>
                  <div className="pt-4 border-t border-[var(--color-dark-border)]">
                    <h3 className="text-lg font-semibold text-white mb-2">Obiettivo operativo</h3>
                    <p className="text-gray-300 leading-relaxed">{mod.overview.objective}</p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {module === 'Soluzione 5' && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs">
                  <BrainCircuit className="w-3 h-3" />
                </span>
                Knowledge Base: 27k disegni come asset strategico
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DiagramExpander
                  src="/diagrams/drawings-quotes-kb.svg"
                  title="Ricerca semantica sui 27k disegni"
                  caption="Da archivio passivo a Knowledge Base interrogabile per prezzare lavori simili con coerenza."
                  mvpIdea="I 27.000 disegni d\'archivio del cliente sono oggi un patrimonio passivo: difficile ritrovare lavori simili, ogni offerta parte da zero. Con embeddings vettoriali sui disegni (via descrizione, tag, dimensioni) e sullo storico offerte, il commerciale trova in secondi gli ordini analoghi passati — con prezzi applicati, margini ottenuti, fornitori usati. BANCO alimenta la KB e l\'assistente MAESTRO la interroga."
                />
                <DiagramExpander
                  src="/diagrams/drawings-quotes-kb-half.svg"
                  title="Quotazione cut-to-size coerente"
                  caption="Pricing assistito con riferimento automatico a ordini storici e marginalità effettiva."
                  mvpIdea="Nel momento in cui il commerciale sta elaborando un\'offerta, la KB propone i 3 ordini storici più simili per lavorazione e materiale, con i prezzi €/ton applicati e il margine realizzato. La nuova offerta è allineata al mercato storico del cliente invece di dipendere dalla memoria del singolo commerciale — particolarmente utile quando il commerciale è nuovo o è in ferie."
                />
              </div>
            </section>
          )}

          {module === 'Soluzione 6' && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs">
                  <MessageSquare className="w-3 h-3" />
                </span>
                Come si parla con MAESTRO
              </h2>
              <DiagramExpander
                src="/diagrams/maestro-demo.svg"
                title="Esempio di interazione MAESTRO"
                caption="Domanda in italiano → RAG su Sage X3 + MES di stabilimento + sistema di gestione job → risposta con fonti e query opzionale."
                mvpIdea="MAESTRO è l\'interfaccia unica: chiunque presso il cliente può chiedere in italiano dati, procedure o correlazioni senza conoscere i nomi delle tabelle Sage. L\'AI traduce in SQL, recupera i dati, genera la risposta con citazione della fonte (Sage X3 tabella X, MES di stabilimento turno Y). Per l\'utente avanzato c\'è l\'opzione 'Vedi query SQL' per validare il ragionamento. La chat è anche il canale per i digest giornalieri e gli alert proattivi."
              />
            </section>
          )}

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs">2</span>
              Funzionalità principali
            </h2>
            <div className="space-y-3">
              {mod.features.map((feature) => {
                const isExpanded = expandedFeatures[feature.id];
                return (
                  <Card
                    key={feature.id}
                    className={`p-0 overflow-hidden transition-colors duration-200 cursor-pointer ${
                      isExpanded ? 'border-[var(--color-accent)]/50' : 'hover:border-gray-600'
                    }`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <div className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-[var(--color-dark-bg)] text-[var(--color-accent)]">
                          <feature.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                      </div>
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-gray-500">
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
                          <div className="px-5 pb-5 pt-2 border-t border-[var(--color-dark-border)]/50">
                            <p className="text-gray-300 mb-4 leading-relaxed whitespace-pre-line">{feature.description}</p>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-500 font-medium">Fonti dati / riferimento:</span>
                              <span className="text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-1 rounded-md">{feature.value}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs">3</span>
              KPI di impatto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mod.kpis.map((kpi, index) => (
                <Card key={index} className="flex flex-col h-full border-[var(--color-dark-border)] hover:border-[var(--color-accent)]/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-[var(--color-dark-bg)] text-[var(--color-accent)]">
                      <kpi.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{kpi.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 flex-grow">{kpi.description}</p>
                  <div className="pt-3 border-t border-[var(--color-dark-border)]/50">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Impatto:</span>
                    <div className="text-sm text-[var(--color-accent)] mt-1">{kpi.impact}</div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs">4</span>
              Pain Points risolti
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {mod.painPoints.map((pp, index) => (
                <Card key={index} className="border-[var(--color-dark-border)]">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-white">{pp.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border ${pp.color} font-medium`}>
                          {pp.category}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{pp.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs">5</span>
              Demo interattiva
            </h2>
            {module === 'Soluzione 1' ? (
              <Solution1Demo />
            ) : module === 'Soluzione 2' ? (
              <Solution2Demo />
            ) : module === 'Soluzione 3' ? (
              <Solution3Demo />
            ) : module === 'Soluzione 4' ? (
              <Solution4Demo />
            ) : module === 'Soluzione 5' ? (
              <Solution5Demo />
            ) : module === 'Soluzione 6' ? (
              <Solution6Demo />
            ) : (
              <Card className="border-[var(--color-dark-border)] bg-[var(--color-dark-surface)] min-h-[400px] flex items-center justify-center border-dashed">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] flex items-center justify-center mx-auto text-gray-500">
                    <Presentation className="w-8 h-8" />
                  </div>
                  <p className="text-gray-400 font-medium">Demo del modulo in preparazione.</p>
                </div>
              </Card>
            )}
          </section>
        </div>
      ) : null}
    </motion.div>
  );
}
