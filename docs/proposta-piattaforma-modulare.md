# Proposta: Piattaforma Modulare AI/BI per Primario Player Siderurgico

**Documento**: Proposta tecnico-commerciale
**Versione**: 1.0 — Marzo 2026
**Preparato da**: Perspective AI
**Per**: Primario Player Siderurgico
**Stato**: Draft per discussione interna

---

## 1. Premessa e Visione

Il cliente opera con Sage X3 come sistema gestionale centrale, supportato da un database SQL Server con circa 1.700 tabelle, oltre 16 milioni di righe e ~130 GB di dati storici. Il sistema funziona, ma il processo di analisi condotto nel febbraio 2026 ha messo in luce **18 criticità operative** distribuite su tre aree:

- **Area Commerciale** — scouting fornitori manuale, conversioni unità di misura, scansione PDF, anonimizzazione disegni, ottimizzazione tagli, gestione semilavorati
- **Area Amministrativa** — esposizione cliente incompleta, tesoreria su Excel, fatturazione passiva laboriosa, dichiarazioni d'intento, CONAI, Intrastat, voci doganali
- **Area Magazzino/Fiscale** — assenza BI, report illeggibili, discrepanze LIFO, tracciabilità DDT

Queste criticità non derivano da difetti strutturali di Sage X3, ma dalla **mancanza di uno strato di intelligenza** che colleghi i dati già presenti nel sistema a strumenti decisionali moderni.

### La Visione

Proponiamo la realizzazione di una **piattaforma modulare** che si affianca a Sage X3 senza sostituirlo. La piattaforma legge i dati dal database, li arricchisce con intelligenza artificiale e — dove necessario — scrive i risultati in Sage X3 per mantenere il gestionale sincronizzato. Il risultato:

- **Dashboard interattive** al posto di report statici illeggibili
- **Automazioni intelligenti** al posto di operazioni manuali ripetitive
- **Analisi predittive** al posto di decisioni basate sull'esperienza individuale
- **Sincronizzazione bidirezionale** con Sage X3 per evitare doppia digitazione

La piattaforma è composta da **6 moduli indipendenti**, ciascuno attivabile separatamente, che coprono tutti i 18 pain point identificati. L'approccio è incrementale: si parte con i moduli a maggior ritorno immediato (BI e gestione finanziaria) per poi aggiungere automazione documentale, intelligence fornitori, ottimizzazione materiali e assistente AI.

---

## 2. Architettura della Piattaforma

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INTERFACCIA UTENTE                          │
│              Web App responsive + Notifiche + Report               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐          │
│  │  BUSSOLA  │ │CASSA FORTE│ │  FORGIA   │ │ SENTINELLA│          │
│  │  BI &     │ │ Finanza & │ │Documenti &│ │Intelligence│         │
│  │ Analytics │ │ Tesoreria │ │Automazione│ │ Fornitori  │         │
│  │  [R]      │ │  [R+W]    │ │  [R+W+E]  │ │  [R+W+E]  │         │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘         │
│        │              │              │              │               │
│  ┌─────┴─────┐ ┌─────┴─────┐                                      │
│  │   BANCO   │ │  MAESTRO  │                                       │
│  │Ottimizzaz.│ │ Assistente│                                       │
│  │ Materiali │ │    AI     │                                       │
│  │  [R+W]    │ │  [R]      │                                       │
│  └─────┬─────┘ └─────┬─────┘                                      │
│        │              │                                             │
├────────┴──────────────┴─────────────────────────────────────────────┤
│                     FOUNDATION LAYER                                │
│                                                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐      │
│  │ Data Engine │ │ AI Engine  │ │  Security  │ │Integration │      │
│  │            │ │            │ │   Layer    │ │    Bus     │      │
│  │ ETL read + │ │ LLM + ML  │ │ RBAC, audit│ │ REST API,  │      │
│  │ write-back │ │ embeddings │ │ encryption │ │ webhooks,  │      │
│  │ da/a X3    │ │ fine-tuned │ │ GDPR       │ │ Sage X3    │      │
│  └──────┬─────┘ └────────────┘ └────────────┘ └──────┬─────┘      │
│         │                                             │            │
│  ┌──────┴──────────────────────────────┐  ┌───────────┴─────┐      │
│  │         Email Engine                │  │  Sage X3 API    │      │
│  │  IMAP/SMTP · invio/ricezione mail  │  │  Write-back     │      │
│  │  template · parsing risposte       │  │  controllato    │      │
│  └──────┬──────────────────────────────┘  └───────────┬─────┘      │
│         │                                             │            │
├─────────┴─────────────────────────────────────────────┴────────────┤
│                    SAGE X3 — SQL Server                            │
│        [db produzione ERP] · circa 270 tabelle attive · schema PROD                 │
│                                                                    │
│  ┌──────────────────────────┐  ┌────────────────────────────────┐  │
│  │  Lettura (tutti i moduli) │  │  Scrittura (via API della software house Sage)  │  │
│  │  Replica analitica        │  │  Solo operazioni validate     │  │
│  │  Nessun impatto su ERP    │  │  Audit trail completo         │  │
│  └──────────────────────────┘  └────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘

Legenda: [R] = solo lettura  [R+W] = lettura + scrittura Sage  [R+W+E] = lettura + scrittura + email
```

### Foundation Layer — Componenti

| Componente | Funzione | Dettaglio |
|------------|----------|-----------|
| **Data Engine** | Replica + write-back verso Sage X3 | **Lettura**: ETL schedulato (ogni 15 min per dati transazionali, ogni ora per anagrafiche), replica su database analitico dedicato. **Scrittura**: write-back controllato verso Sage X3 tramite le API web della software house che gestisce l'installazione Sage del cliente, con validazione pre-scrittura e audit trail completo |
| **AI Engine** | Modelli di intelligenza artificiale | LLM per analisi documentale e assistente, modelli ML per previsioni (cash flow, domanda), embeddings per ricerca semantica su catalogo prodotti e fornitori |
| **Security Layer** | Sicurezza e conformità | Autenticazione SSO, ruoli per area funzionale, log di ogni accesso ai dati, cifratura dati sensibili, conformità GDPR. Per le operazioni di scrittura: doppia autorizzazione, log immutabile di ogni modifica |
| **Integration Bus** | Connettività con sistemi esterni | API REST per integrazioni con portali fornitori, SDI, remote banking. Webhook per notifiche real-time. Connessione bidirezionale verso Sage X3 |
| **Email Engine** | Invio e ricezione email | Connessione IMAP/SMTP al server di posta del cliente. Invio automatizzato di RDA a fornitori (SENTINELLA), disegni anonimizzati (FORGIA), notifiche e alert (tutti i moduli). Ricezione e parsing automatico di risposte fornitori e PDF allegati. Template personalizzabili per tipologia di comunicazione |
| **Sage X3 Write-Back** | Sincronizzazione piattaforma → ERP | Le azioni operative eseguite sulla piattaforma vengono scritte in Sage X3 per mantenere il gestionale come unica fonte di verità. La scrittura avviene tramite le API/web service di Sage X3 (non tramite INSERT diretti sul database), garantendo il rispetto delle regole di business, validazioni e trigger del gestionale |

---

## 3. I Moduli

---

### 3.1 BUSSOLA — Business Intelligence & Analytics

> *"Vedere chiaro dove oggi si naviga a vista"*

#### Pain Point Affrontati

| # | Pain Point | Fonte |
|---|-----------|-------|
| 6 | Assenza completa di BI — il vecchio file Excel collegato al software precedente non è più utilizzabile, nessuno strumento di analisi dati | Area Commerciale |
| 16 | Report e mastrini estratti da Sage illeggibili — i revisori e sindaci ricevono documentazione difficilmente interpretabile | Amministrazione |
| 15 | Discrepanze LIFO — il prospetto LIFO per il bilancio mostra numeri diversi rispetto alle schede magazzino, con recupero dati lungo e soggetto a errori | Magazzino/Fiscale |
| 9 | Tracciabilità DDT-Fattura gestita su Excel — file manuale per tenere traccia dei DDT tramutati in fattura | Amministrazione |

#### Funzionalità Principali

**Dashboard Vendite**
- Fatturato per cliente, prodotto, agente, area geografica e periodo
- Trend con confronto anno precedente e budget
- Analisi marginalità per riga d'ordine (prezzo vendita vs. costo acquisto)
- Conversione offerta-ordine: tasso di successo per commerciale e cliente
- Pipeline commerciale: offerte aperte, ordini in corso, consegne previste

**Dashboard Magazzino**
- Giacenze in tempo reale per articolo, lotto e ubicazione
- Rotazione scorte e indice di copertura
- Movimenti giornalieri (entrate, uscite, rettifiche) con drill-down al documento
- Alert su articoli sotto-scorta o sovra-scorta

**Verifica LIFO**
- Riconciliazione automatica tra snapshot mensili (XXI0IMXSH) e schede magazzino
- Evidenziazione discrepanze con drill-down al movimento che le genera
- Prospetto LIFO certificabile per bilancio con tracciabilità completa

**Tracciabilità DDT → Fattura**
- Stato automatico di ogni DDT: consegnato, fatturato, parzialmente fatturato
- Alert su DDT non fatturati oltre N giorni
- Eliminazione del file Excel di tracciamento manuale

**Report Leggibili**
- Mastrini formattati con descrizioni testuali (non solo codici numerici)
- Esportazione in PDF professionale per revisori e sindaci
- Situazioni infrannuali con piano dei conti personalizzato, già leggibili

#### Fonti Dati Sage X3

| Tabella | Righe | Utilizzo in BUSSOLA |
|---------|-------|---------------------|
| STAT | 246.179 | Statistiche vendita pre-aggregate — base per dashboard rapide senza query pesanti |
| SINVOICE / SINVOICED | 4.873 / 45.923 | Fatture vendita: analisi fatturato, marginalità, trend |
| SORDER / SORDERQ / SORDERP | 6.162 / 46.131 / 46.131 | Ordini: pipeline commerciale, backlog, pricing |
| SQUOTE / SQUOTED | 4.327 / 37.174 | Offerte: tasso di conversione, analisi perdite |
| SDELIVERY / SDELIVERYD | 5.098 / 42.925 | DDT: tracciabilità consegne, stati fatturazione |
| STOJOU | 687.966 | Movimenti magazzino: rotazione, flussi, audit |
| STOCK | 3.316 | Giacenze correnti: posizione inventario real-time |
| XXI0IMXSH | 765.684 | Snapshot LIFO mensili: riconciliazione fiscale |
| GACCENTRY / GACCENTRYD | 23.658 / 107.834 | Contabilità generale: mastrini, bilanci |
| ITMMASTER | 31.831 | Anagrafica articoli: dimensioni, categorie, classificazioni |
| BPCUSTOMER | 2.243 | Anagrafica clienti: segmentazione, condizioni pagamento |
| CPTANALIN | 682.020 | Contabilità analitica: analisi per centro di costo |

#### Capacità AI

- **Analisi anomalie**: rilevamento automatico di scostamenti significativi (vendite, margini, giacenze) rispetto ai pattern storici
- **Previsione domanda**: modelli di forecast basati su stagionalità e trend per i top 50 articoli
- **Natural Language Queries**: interrogazione dashboard in linguaggio naturale ("mostrami il fatturato del cliente X negli ultimi 6 mesi")

#### Impatto Stimato

| Metrica | Prima | Dopo |
|---------|-------|------|
| Tempo per produrre un report vendite | 2–4 ore (raccolta dati manuale) | 10 secondi (dashboard interattiva) |
| Verifica LIFO per bilancio | 3–5 giorni (confronto manuale) | 1 click (riconciliazione automatica) |
| Tracciabilità DDT non fatturati | File Excel aggiornato manualmente | Alert automatico in tempo reale |
| Qualità report per revisori | Mastrini numerici illeggibili | Report formattati con descrizioni |

---

### 3.2 CASSA FORTE — Financial Intelligence

> *"Il controllo finanziario che Sage X3 non riesce a dare"*

#### Pain Point Affrontati

| # | Pain Point | Fonte |
|---|-----------|-------|
| 11 | Esposizione cliente incompleta — l'analisi partite di Sage mostra solo fatture non pagate ma non le RIBA emesse non ancora scadute; impossibile avere visione complessiva per cliente | Amministrazione |
| 12 | Tesoreria gestita interamente su Excel — affidamenti, utilizzo fidi, entrate/uscite previste, movimenti bancari: tutto su fogli separati per banca | Amministrazione |
| 17 | Dichiarazioni d'intento — se l'ordine era partito in un modo mal cliente diventa esente IVA da una certa data, non è possibile modificare l'ordine; bisogna ricordarsi il trattamento corretto nel DDT e in fattura | Amministrazione |
| 8 | Fatturazione attiva laboriosa — con Sage molte restrizioni a livello di documento, ogni modifica deve passare per fattura, impossibile modificare direttamente il DDT | Amministrazione |

#### Funzionalità Principali

**Esposizione Cliente Completa**
- Vista unificata per cliente: fatture aperte + RIBA emesse non scadute ⁹ + ordini confermati non consegnati + DDT non fatturati
- Calcolo automatico dell'esposizione complessiva in tempo reale
- Confronto con fidi assicurativi (integrazione con il primario assicuratore crediti via tabelle YATR*)
- Storico pagamenti con indice di puntualità per cliente

> ⁹ **Nota**: le RIBA sono identificabili per scadenza ma non è possibile distinguere tra "generate e non ancora presentate in banca" e "presentate e in attesa di incasso" — Sage X3 non traccia questo stato in modo strutturato.
- Report esposizione "al 31/12" ricostruibile alla data per chiusura bilancio

**Tesoreria Intelligente**
- Dashboard unica per tutte le banche: saldi, affidamenti accordati, utilizzo fidi, disponibilità residua ¹
- Previsione di cassa a 30/60/90 giorni basata su scadenze note (RIBA, fatture passive) ²
- Importazione automatica movimenti bancari con riconciliazione proposta ³
- Monitoraggio lettere di credito e finanziamenti attivi ¹

> ¹ **Nota**: i dati su affidamenti, utilizzo fidi e disponibilità residua non sono presenti in Sage X3 — andranno inseriti manualmente o integrati tramite API bancarie.
> ² La previsione cassa è limitata a crediti/debiti commerciali (AR/AP). Scadenze F24, rate mutui e commissioni bancarie non sono tracciate in Sage e andrebbero inserite manualmente.
> ³ L'importazione con riconciliazione richiede operazioni di scrittura su Sage X3, soggette a disponibilità API della software house Sage.

**Gestione Dichiarazioni d'Intento** ⁴
- Registro centralizzato delle dichiarazioni d'intento per cliente
- Alert automatico quando un DDT o fattura coinvolge un cliente con dichiarazione attiva
- Verifica automatica coerenza IVA tra ordine, DDT e fattura
- Storico e scadenze delle dichiarazioni con promemoria anticipato

> ⁴ **Nota**: le dichiarazioni d'intento non sono attualmente tracciate in Sage X3. Il registro e gli alert verranno costruiti come funzionalità standalone della piattaforma, senza dati storici da migrare. I dati iniziali andranno inseriti manualmente.

**Supporto Fatturazione**
- Cruscotto stato fatturazione: DDT pronti per fattura, fatture da emettere, situazione per cliente
- Evidenziazione automatica di discrepanze tra ordine/DDT/fattura
- Suggerimenti automatici per raggruppamento DDT in fattura

#### Fonti Dati Sage X3

| Tabella | Righe | Utilizzo in CASSA FORTE |
|---------|-------|-------------------------|
| GACCDUDATE | 31.266 | Scadenzario AR/AP: backbone dell'esposizione cliente e previsione di cassa |
| PAYMENTH / PAYMENTD | 3.519 / 11.261 | Pagamenti emessi: riconciliazione bancaria, RIBA tracciate |
| SINVOICE / SINVOICEV | 4.873 / 4.870 | Fatture vendita: esposizione, scadenze, stato incasso |
| PINVOICE / PINVOICED | 3.037 / 13.052 | Fatture acquisto: scadenze passive, previsione uscite |
| BPCUSTOMER | 2.243 | Anagrafica clienti: condizioni pagamento, limiti fido, segmento |
| YATR / YATRCLI / YATRCLIN | Custom | Assicurazione crediti (primario assicuratore italiano): massimali, coperture per cliente |
| SORDER / SDELIVERY | 6.162 / 5.098 | Pipeline ordini/consegne: esposizione futura stimata |
| GACCENTRY / GACCENTRYD | 23.658 / 107.834 | Contabilità: partite, RIBA contabilizzate, movimenti bancari |

#### Capacità AI

- **Cash flow forecasting**: previsione flussi di cassa a 90 giorni con intervallo di confidenza, basata su pattern storici di pagamento per cliente
- **Early warning**: alert predittivo su clienti con peggioramento dell'indice di puntualità di pagamento
- **Anomaly detection**: segnalazione automatica di fatture con importi anomali rispetto allo storico del cliente

#### Impatto Stimato

| Metrica | Prima | Dopo |
|---------|-------|------|
| Verifica esposizione per singolo cliente | 20–30 min (più prospetti manuali) | Istantanea (vista unificata) |
| Gestione tesoreria | 1–2 ore/giorno (aggiornamento Excel per banca) | 15 min/giorno (dashboard automatizzata) |
| Rischio dichiarazioni d'intento dimenticate | Elevato (memoria individuale) | Zero (alert automatici) |
| Previsione di cassa | Approssimativa (stima manuale) | Accurata a 90 giorni con AI |

---

### 3.3 FORGIA — Document Automation

> *"Automatizzare ciò che oggi richiede ore di lavoro manuale"*

#### Pain Point Affrontati

| # | Pain Point | Fonte |
|---|-----------|-------|
| 5 | Anonimizzazione disegni — ogni disegno tecnico deve essere sanitizzato (rimozione nome cliente, telefono, email, indirizzo) prima dell'invio ai fornitori; operazione manuale con LibreOffice su PDF | Area Commerciale |
| 10 | Importazione XML fatture passive — XML scaricati dal cassetto fiscale richiedono 2–3 passaggi manuali per importazione in Sage, il PDF allegato si separa e va ricollegato manualmente | Amministrazione |
| 14 | Dichiarazione Intrastat — compilazione mensile sul sito Dogana con inserimento manuale delle fatture su foglio Excel | Amministrazione |
| 13 | Dichiarazione CONAI — ogni fattura viene registrata su foglio Excel per calcolo totale trimestrale | Amministrazione |
| 18 | Voci doganali — il campo voce doganale nell'anagrafica articolo non viene compilato dai commerciali; l'amministrazione deve collegare le voci manualmente per ogni fattura | Amministrazione |

#### Funzionalità Principali

**Anonimizzazione Automatica Disegni**
- Upload del PDF tecnico → rilevamento automatico di aree contenenti dati sensibili (nome, telefono, email, indirizzo) tramite OCR + NLP
- Mascheramento automatico con rettangolo bianco o sostituzione con dati del cliente
- Output: PDF anonimizzato scaricabile, pronto per invio al fornitore
- Batch processing: anonimizzazione multipla in un click

**Automazione Fatture Passive (XML → Sage)**
- Parsing automatico XML FatturaPA con estrazione strutturata di tutti i campi
- Pre-compilazione dei campi Sage X3 (codice IVA, conto, fornitore) con suggerimento basato su storico
- Ricollegamento automatico del PDF allegato alla fattura
- Validazione pre-importazione: confronto con ordine d'acquisto e DDT ricevuto

**Generazione Automatica Intrastat**
- Estrazione automatica delle fatture intra-UE dal periodo selezionato
- Pre-compilazione del file Intrastat con: dati fattura, voce doganale, massa netta, valore statistico, condizioni di consegna
- Formato compatibile con il portale dell'Agenzia delle Dogane
- Riconciliazione con il registro fatture per verificare completezza

**Automazione CONAI** ⁵
- Calcolo automatico dei contributi CONAI per fattura, basato su peso e tipologia di imballaggio
- Generazione del riepilogo trimestrale con dettaglio per codice materiale
- Export nel formato richiesto per la dichiarazione CONAI

> ⁵ **Nota**: Sage X3 non contiene dati su imballaggi, composizione materiali o codici contributo CONAI. L'intera struttura dati (tipologia imballaggio per articolo, aliquote contributo) andrà costruita da zero sulla piattaforma con inserimento manuale iniziale.

**Gestione Voci Doganali** ¹⁰
- Suggerimento automatico della voce doganale basato su descrizione articolo e classificazione merceologica (codici `73..` per acciaio)
- Compilazione massiva dell'anagrafica articoli con voci doganali mancanti ³
- Distinzione automatica tra voce doganale acquisto estero e vendita

> ¹⁰ **Nota**: ITMMASTER non dispone attualmente di un campo per la voce doganale. I codici CN esistono come dati di riferimento (XXI0ENINO, 9.425 codici) ma non sono collegati agli articoli. Il suggerimento AI è fattibile; la compilazione massiva richiede l'aggiunta di un campo custom su Sage X3 (tramite la software house Sage) e write access.

#### Fonti Dati Sage X3

| Tabella | Righe | Utilizzo in FORGIA |
|---------|-------|--------------------|
| XXI022XUQ / XXI022XUO | 4.986 / 30.441 | Fatture passive SDI: parsing XML, pre-compilazione |
| XXI020SDISOH / XXI020SDISOD | Custom | Fatture attive SDI: generazione Intrastat |
| PINVOICE / PINVOICED | 3.037 / 13.052 | Fatture acquisto: base per CONAI e Intrastat |
| SINVOICE / SINVOICED | 4.873 / 45.923 | Fatture vendita: Intrastat export |
| ITMMASTER | 31.831 | Anagrafica articoli: voci doganali, classificazioni, peso |
| XXI00ATEXTRW | 440.395 | Nomenclatura doganale: descrizioni voci tariffarie (codici `72..`, `73..`) |
| PORDER / PORDERQ | 3.326 / 6.315 | Ordini d'acquisto: riconciliazione con fatture passive |
| PRECEIPT / PRECEIPTD | Custom | Ricevimento merci: confronto DDT/fattura |

#### Capacità AI

- **OCR + NLP**: riconoscimento e mascheramento di dati personali nei disegni tecnici PDF con accuratezza >95%
- **Classificazione automatica**: suggerimento della voce doganale basato su modello addestrato sullo storico delle classificazioni storiche del cliente
- **Smart matching**: collegamento automatico fattura passiva ↔ ordine d'acquisto ↔ DDT basato su fuzzy matching di importi, date e riferimenti

#### Impatto Stimato

| Metrica | Prima | Dopo |
|---------|-------|------|
| Anonimizzazione un disegno | 5–10 min (manuale con LibreOffice) | 10 secondi (automatica) |
| Importazione fattura passiva XML | 15–20 min (3 passaggi manuali) | 2 min (pre-compilata, un click) |
| Preparazione Intrastat mensile | 1–2 giorni (compilazione manuale) | 30 min (generazione automatica + verifica) |
| Dichiarazione CONAI trimestrale | 1 giorno (raccolta dati da Excel) | 15 min (calcolo automatico) |

---

### 3.4 SENTINELLA — Supplier Intelligence

> *"Trasformare lo scouting da fatica quotidiana a vantaggio competitivo"*

#### Pain Point Affrontati

| # | Pain Point | Fonte |
|---|-----------|-------|
| 1 | Scouting fornitori completamente manuale — per ogni riga di richiesta si contattano 6–7 fornitori con copia-incolla della stessa richiesta via mail; circa 240 RDA da novembre, ciascuna con 6–7 righe | Area Commerciale |
| 2 | Conversione unità di misura — i fornitori rispondono in €/metro, ma la valutazione di marginalità richiede €/tonnellata; conversione manuale tramite Excel | Area Commerciale |
| 3 | Scansione PDF disponibilità fornitori — ogni mattina 3 fornitori inviano PDF con disponibilità; apertura e ricerca manuale per dimensione e qualità dell'acciaio (convenzione D/d per disponibilità) | Area Commerciale |

#### Funzionalità Principali

**Gestione Centralizzata RDA** ⁶
- Interfaccia unica per la creazione della richiesta d'acquisto con righe multiple
- Invio automatico personalizzato a ciascun fornitore (mail template con dati specifici) ⁷
- Raccolta risposte strutturata: ogni fornitore compila un modulo o risponde a un formato parsabile
- Dashboard comparativa: prezzi, disponibilità, tempi di consegna per ogni riga — tutto in un'unica vista

> ⁶ **Nota**: il cliente attualmente non utilizza le richieste d'acquisto (RDA) in Sage X3 — gli ordini vengono emessi direttamente (PORDER). SENTINELLA introdurrebbe un **workflow completamente nuovo**, non l'automazione di un processo esistente. Non esistono dati storici RDA da migrare.
> ⁷ L'invio email automatizzato richiede accesso IMAP/SMTP al server di posta del cliente, da concordare con l'IT.

**Conversione Automatica Unità di Misura**
- Conversione istantanea €/metro ↔ €/tonnellata basata sulle specifiche dell'articolo (peso lineare da anagrafica ITMMASTER)
- Normalizzazione prezzi per confronto omogeneo tra fornitori
- Calcolo marginalità integrato: prezzo acquisto normalizzato vs. prezzo vendita al cliente

**Parsing Automatico PDF Disponibilità**
- Importazione automatica dei PDF giornalieri dei fornitori
- Estrazione strutturata: dimensione, qualità acciaio, disponibilità (D/d), prezzo, lotto
- Indicizzazione e ricerca: "mostrami tutte le disponibilità per tubo 80×80×6mm oggi"
- Alert: notifica quando un articolo cercato diventa disponibile

**Analisi Storica Fornitori**
- Scorecard per fornitore: puntualità consegne, competitività prezzi, reattività ⁸
- Trend prezzi per articolo e fornitore su base storica
- Suggerimento automatico dei fornitori da contattare per ogni tipo di prodotto

> ⁸ **Nota**: lo scoring qualità non è supportato — il modulo Quality Management di Sage X3 non è utilizzato (tabelle QLY* vuote). La scorecard coprirà puntualità e prezzo ma non la qualità, che andrebbe valutata con criteri definiti ad hoc.

**Esplorazione Nuovi Fornitori**
- Database fornitori con classificazione per specializzazione, area geografica, tipologia di lavorazione
- Suggerimento di fornitori alternativi per lavorazioni che il cliente non riesce a coprire internamente

#### Fonti Dati Sage X3

| Tabella | Righe | Utilizzo in SENTINELLA |
|---------|-------|------------------------|
| BPSUPPLIER | 2.686 | Anagrafica fornitori: condizioni, certificazioni, scoring |
| PORDER / PORDERP / PORDERQ | 3.326 / 6.315 / 6.315 | Storico ordini: analisi prezzi, volumi, puntualità |
| PRECEIPT / PRECEIPTD | Custom | Ricevimenti: verifica puntualità consegne |
| ITMMASTER | 31.831 | Catalogo articoli: specifiche tecniche, peso lineare per conversione UoM |
| ITMBPS | Custom | Cross-reference articolo-fornitore: chi fornisce cosa |
| STOJOU | 687.966 | Movimenti: volumi storici per fornitore |
| PINVOICE / PINVOICED | 3.037 / 13.052 | Fatture: analisi spesa per fornitore e articolo |
| ITMCOST | 143.215 | Costi articolo: benchmark per valutazione offerte |

#### Capacità AI

- **PDF parsing intelligente**: estrazione tabellare da PDF non strutturati con riconoscimento delle convenzioni D/d e dei formati specifici di ciascun fornitore
- **Price prediction**: previsione prezzo per articolo basata su trend storico e condizioni di mercato
- **Supplier recommendation**: suggerimento automatico del fornitore ottimale per ogni riga della richiesta, basato su storico prezzi, puntualità e disponibilità

#### Impatto Stimato

| Metrica | Prima | Dopo |
|---------|-------|------|
| Tempo per inviare una RDA a 6 fornitori | 30–45 min (copia-incolla mail) | 2 min (invio automatizzato) |
| Confronto offerte (7 righe × 6 fornitori) | 1–2 ore (raccolta mail + Excel) | 5 min (dashboard comparativa) |
| Conversione €/m → €/ton | Manuale per ogni riga (Excel) | Automatica e istantanea |
| Ricerca disponibilità da PDF giornalieri | 15–20 min/mattina (apertura e ricerca manuale) | 1 min (ricerca indicizzata) |

---

### 3.5 BANCO — Material Optimization

> *"Ogni centimetro di barra conta — ogni taglio diventa intelligente"*

#### Pain Point Affrontati

| # | Pain Point | Fonte |
|---|-----------|-------|
| 4 | Ottimizzazione taglio barre — attualmente si usa un tool di cutting esterno (sito online, non pienamente affidabile) per calcolare quante barre servono e lo scarto stimato; l'obiettivo è automatizzare il calcolo della materia prima necessaria dalla distinta del cliente | Area Commerciale |
| 7 | Gestione semilavorati in Sage X3 — il sistema non legge il semilavorato come entità con fasi di lavorazione associate; per ogni fase occorre creare un nuovo prodotto | Area Commerciale |

#### Funzionalità Principali

**Ottimizzazione Tagli (Cutting Stock Problem)**
- Algoritmo di ottimizzazione 1D per il taglio di barre, profili e tubi
- Input: distinta cliente (numero pezzi × lunghezza richiesta) + lunghezze barre disponibili a magazzino
- Output: piano di taglio ottimale con scarto minimo, numero barre necessarie, lista d'acquisto residua
- Integrazione con giacenze reali: consultazione automatica di STOCK per verificare disponibilità barre in magazzino ¹¹
- Confronto scenari: simulazione con diverse lunghezze di barre standard per trovare la combinazione ottimale

> ¹¹ **Nota**: Sage X3 traccia le giacenze come "N barre, X KG" per lotto, ma non registra la lunghezza individuale di ciascuna barra. L'ottimizzazione assume lunghezze standard. Se il cliente gestisce spezzoni di lunghezze variabili, sarà necessario un sistema di tracking dedicato per integrarli nell'ottimizzazione.
- Storico tagli: analisi degli scarti storici per identificare lunghezze standard più efficienti

**Gestione Avanzata Semilavorati** ¹²
- Modello dati esteso per i semilavorati con fasi di lavorazione come attributi (non come prodotti separati)
- Vista unificata del semilavorato: materia prima → fase 1 → fase 2 → prodotto finito
- Tracciabilità completa: dal lotto materia prima al pezzo consegnato
- Calcolo costo per fase: accumulo costi (materiale + lavorazione interna + lavorazione esterna) lungo la catena produttiva

> ¹² **Nota**: l'architettura attuale di Sage X3 crea un nuovo codice articolo per ogni fase di lavorazione (es. MP001360 → PL007069 → PL007069_TRATT). La "vista unificata" richiede la costruzione di un modello overlay custom che colleghi più record MFGHEAD tra loro — fattibile ma architetturalmente più complesso di quanto appaia.

**Calcolo Automatico Materia Prima**
- Dalla distinta cliente: calcolo automatico della lista materie prime necessarie con quantità in KG
- Verifica disponibilità a magazzino prima dell'invio richiesta ad acquisti
- Stima dei tempi di approvvigionamento basata sullo storico fornitori

#### Fonti Dati Sage X3

| Tabella | Righe | Utilizzo in BANCO |
|---------|-------|-------------------|
| ITMMASTER | 31.831 | Catalogo articoli: dimensioni (lunghezza, larghezza, spessore), peso lineare, UoM |
| STOCK | 3.316 | Giacenze correnti: disponibilità barre per ottimizzazione tagli |
| STOJOU | 687.966 | Movimenti: analisi storica scarti e consumi |
| MFGHEAD / MFGITM / MFGMAT | 33K / Custom / Custom | Ordini di produzione: BOM, materie prime, output |
| MFGOPE / MFGOPETRK | 97.227 / Custom | Operazioni routing: fasi di lavorazione, tempi |
| YYTSQP / YYTSQH / YYTBOM | Custom | Sistema di quotazione cut-to-size: distinte già strutturate |
| YYTROU / YYTITM | Custom | Routing e articoli per quotazione: fasi di lavorazione previste |
| YENTDIVROTT | Custom | Scarti per operazione di routing: analisi efficienza tagli |
| WIPCOST / MFCWST | 306.470 / 222.057 | Costi WIP e per centro: analisi costo per fase |

#### Capacità AI

- **Ottimizzazione combinatoria**: algoritmo di bin packing 1D con euristica greedy + raffinamento (potenziale miglioramento rispetto a un tool di cutting esterno — da validare tramite benchmark)
- **Predictive waste**: previsione scarto medio per tipo di profilo e lunghezza, basata su storico YENTDIVROTT
- **Material requirement planning leggero**: suggerimento approvvigionamento basato su ordini confermati + storico domanda per articoli make-to-order

#### Impatto Stimato

| Metrica | Prima | Dopo |
|---------|-------|------|
| Calcolo materia prima da distinta | 15–30 min (manuale + un tool di cutting esterno) | 1 min (automatico) |
| Scarto medio taglio | ~8–12% (stima verbale, da validare) | Obiettivo: riduzione significativa (da confermare tramite benchmark su dati ordini reali del cliente) |
| Attesa ufficio tecnico per calcolo | Ore/giorni (collo di bottiglia) | Eliminata (self-service per commerciali) |
| Visibilità costo per fase semilavorato | Assente (prodotti separati) | Completa (vista unificata) |

---

### 3.6 MAESTRO — AI Assistant

> *"L'esperto del cliente che non va mai in ferie"*

Il modulo MAESTRO è l'assistente AI conversazionale che unifica l'accesso a tutti i dati e le funzionalità della piattaforma.

#### Funzionalità Cross-Cutting

**Interrogazione Dati in Linguaggio Naturale**
- "Qual è l'esposizione del cliente CLI-001?"
- "Mostrami le consegne in ritardo di questa settimana"
- "Quanto abbiamo comprato dal fornitore CLI-003 nel 2025?"
- Traduzione automatica della domanda in query sui dati, con risposta testuale e grafica

**Knowledge Base Aziendale**
- Raccolta e indicizzazione della documentazione operativa (procedure, listini, specifiche tecniche)
- Risposte contestuali: l'assistente conosce le procedure del cliente e le applica
- FAQ automatiche per le domande più frequenti (es. "come si fa una nota di credito?")

**Notifiche Proattive**
- Alert su situazioni che richiedono attenzione: clienti in ritardo, scadenze imminenti, giacenze critiche
- Riepilogo giornaliero personalizzato per ruolo (commerciale, amministrativo, acquisti)
- Escalation automatica per situazioni critiche

**Analisi Cross-Modulo**
- Correlazioni tra dati di moduli diversi: "il cliente X ha ordinato più del solito ma paga sempre più tardi"
- Suggerimenti operativi basati sull'analisi complessiva dei dati
- Report automatici periodici con evidenziazione delle variazioni significative

#### Fonti Dati

MAESTRO accede a **tutti i dati** della piattaforma attraverso il Foundation Layer. Non ha tabelle proprie ma interroga l'intero patrimonio informativo del cliente (circa 270 tabelle attive, oltre 16M righe) attraverso un'interfaccia conversazionale.

#### Capacità AI

- **RAG (Retrieval-Augmented Generation)**: il modello AI recupera i dati rilevanti dal database prima di rispondere, garantendo risposte accurate e fondate sui dati reali
- **Context-aware**: l'assistente tiene conto del ruolo dell'utente, della stagionalità e del contesto operativo
- **Multi-turn**: supporto a conversazioni complesse con follow-up e raffinamenti

#### Impatto Stimato

| Metrica | Prima | Dopo |
|---------|-------|------|
| Tempo per ottenere un dato specifico | 5–30 min (navigazione Sage + Excel) | 10 secondi (domanda in linguaggio naturale) |
| Formazione nuovi dipendenti su procedure | Settimane (affiancamento) | Giorni (assistente sempre disponibile) |
| Rilevamento situazioni critiche | Reattivo (quando si scopre il problema) | Proattivo (alert automatici) |

---

## 4. Roadmap di Implementazione

### Visione d'Insieme

```
Mese   1    2    3    4    5    6    7    8    9   10   11   12
       ├────┤                                                    Fase 0: Foundation
       │    ├─────────┤                                          Fase 1: BUSSOLA + CASSA FORTE core
       │              ├──────────────┤                           Fase 2: FORGIA + SENTINELLA core
       │                             ├──────────────┤            Fase 3: BANCO + funzionalità avanzate
       │                                            ├─────────┤  Fase 4: MAESTRO + automazione avanzata
```

---

### Fase 0 — Foundation (Mese 1–2)

**Obiettivo**: Infrastruttura tecnica operativa e primo flusso dati funzionante.

| Attività | Dettaglio |
|----------|-----------|
| Data Engine (lettura) | Connessione read-only a Sage X3 (SQL Server), replica incrementale su database analitico, schema di staging |
| Data Engine (scrittura) | Configurazione connettore write-back via API/web service Sage X3 (in collaborazione con la software house Sage), test su ambiente di staging |
| Email Engine | Configurazione accesso IMAP/SMTP al server di posta del cliente, template base per comunicazioni automatiche, test invio/ricezione |
| Security Layer | Autenticazione, ruoli base (admin, commerciale, amministrativo, magazzino), log accessi, policy di autorizzazione per operazioni di scrittura |
| Integration Bus | API framework, connettore Sage X3 bidirezionale, webhook engine |
| Ambiente | Infrastruttura cloud/on-premise, CI/CD, monitoring |
| Validazione | Verifica integrità dati replicati vs. sorgente; test round-trip scrittura su ambiente Sage X3 di test |

**Deliverable**: Foundation Layer operativa con replica dati verificata, canale di scrittura Sage X3 testato, email engine funzionante.

**Prerequisiti da concordare con il cliente** (bloccanti per Fase 1+):
- Accesso al server di posta (credenziali IMAP/SMTP o casella dedicata per la piattaforma) — necessario per SENTINELLA e MAESTRO
- Collaborazione con la software house Sage per attivazione API/web service Sage X3 per le operazioni di scrittura — necessario per CASSA FORTE, FORGIA, SENTINELLA, BANCO
- Ambiente Sage X3 di test per validare le operazioni di write-back prima del go-live

> **Nota**: la Fase 0 include come deliverable la **validazione tecnica** della disponibilità API della software house Sage. L'esito di questa validazione determinerà lo scope effettivo delle funzionalità di scrittura nelle fasi successive. I moduli a sola lettura (BUSSOLA, parte di CASSA FORTE e MAESTRO) non dipendono da questi prerequisiti.

---

### Fase 1 — BUSSOLA + CASSA FORTE Core (Mese 2–4)

**Obiettivo**: Quick win — dashboard operative e visibilità finanziaria immediata.

| Modulo | Funzionalità | Priorità |
|--------|--------------|----------|
| **BUSSOLA** | Dashboard vendite (fatturato, trend, pipeline) | Critica |
| **BUSSOLA** | Dashboard magazzino (giacenze, movimenti, rotazione) | Critica |
| **BUSSOLA** | Verifica LIFO automatizzata | Alta |
| **BUSSOLA** | Tracciabilità DDT → Fattura | Alta |
| **BUSSOLA** | Report leggibili per revisori | Media |
| **CASSA FORTE** | Esposizione cliente completa | Critica |
| **CASSA FORTE** | Tesoreria base (saldi, fidi, utilizzo) | Alta |

**Quick Win**: le dashboard vendite e l'esposizione cliente completa saranno i primi risultati visibili e misurabili — rispondono alle esigenze più sentite.

---

### Fase 2 — FORGIA + SENTINELLA Core (Mese 4–7)

**Obiettivo**: Automazione documentale e primo supporto intelligente agli acquisti.

| Modulo | Funzionalità | Priorità |
|--------|--------------|----------|
| **FORGIA** | Anonimizzazione automatica disegni | Critica |
| **FORGIA** | Parsing XML fatture passive | Alta |
| **FORGIA** | Generazione Intrastat | Alta |
| **FORGIA** | Automazione CONAI | Media |
| **FORGIA** | Gestione voci doganali | Media |
| **SENTINELLA** | Gestione centralizzata RDA | Alta |
| **SENTINELLA** | Parsing PDF disponibilità fornitori | Alta |
| **SENTINELLA** | Conversione automatica UoM | Alta |

---

### Fase 3 — BANCO + Funzionalità Avanzate (Mese 7–10)

**Obiettivo**: Ottimizzazione materiali e completamento delle funzionalità avanzate degli altri moduli.

| Modulo | Funzionalità | Priorità |
|--------|--------------|----------|
| **BANCO** | Ottimizzazione tagli (algoritmo bin packing) | Critica |
| **BANCO** | Calcolo automatico materia prima da distinta | Alta |
| **BANCO** | Gestione semilavorati con fasi | Media |
| **CASSA FORTE** | Cash flow forecasting AI | Alta |
| **CASSA FORTE** | Dichiarazioni d'intento | Alta |
| **SENTINELLA** | Scorecard fornitori e analisi storica | Media |
| **BUSSOLA** | Analisi anomalie e forecast AI | Media |

---

### Fase 4 — MAESTRO + Automazione Avanzata (Mese 10–12)

**Obiettivo**: Intelligenza artificiale conversazionale e funzionalità avanzate di tutti i moduli.

| Modulo | Funzionalità | Priorità |
|--------|--------------|----------|
| **MAESTRO** | Interrogazione dati in linguaggio naturale | Alta |
| **MAESTRO** | Knowledge base aziendale | Media |
| **MAESTRO** | Notifiche proattive e riepilogo giornaliero | Media |
| **SENTINELLA** | Supplier recommendation AI | Media |
| **BANCO** | Predictive waste analysis | Media |
| **FORGIA** | Smart matching fattura ↔ ordine ↔ DDT | Media |

---

## 5. Matrice di Copertura Pain Point

La tabella seguente dimostra la copertura completa di tutti i 18 pain point identificati durante l'analisi dei processi.

| # | Pain Point | Area | Modulo | Fase |
|---|-----------|------|--------|------|
| 1 | Scouting fornitori manuale (circa 240 RDA × 6–7 righe × 6–7 fornitori) | Commerciale | **SENTINELLA** | 2 |
| 2 | Conversione unità di misura (€/m → €/ton manuale via Excel) | Commerciale | **SENTINELLA** | 2 |
| 3 | Scansione PDF disponibilità fornitori (3 PDF/mattina, ricerca manuale) | Commerciale | **SENTINELLA** | 2 |
| 4 | Ottimizzazione taglio barre (un tool di cutting esterno inaffidabile, collo di bottiglia ufficio tecnico) | Commerciale | **BANCO** | 3 |
| 5 | Anonimizzazione disegni (manuale con LibreOffice, molto tempo) | Commerciale | **FORGIA** | 2 |
| 6 | Assenza BI (vecchio Excel non più utilizzabile) | Commerciale | **BUSSOLA** | 1 |
| 7 | Gestione semilavorati (nuovo prodotto per ogni fase di lavorazione) | Commerciale | **BANCO** | 3 |
| 8 | Fatturazione attiva laboriosa (restrizioni documento, modifiche solo da fattura) | Amministrazione | **CASSA FORTE** | 1 |
| 9 | Tracciabilità DDT su Excel (file manuale per DDT → fattura) | Amministrazione | **BUSSOLA** | 1 |
| 10 | Importazione XML fatture passive (2–3 passaggi manuali, PDF separato) | Amministrazione | **FORGIA** | 2 |
| 11 | Esposizione cliente incompleta (no RIBA emesse, no vista complessiva) | Amministrazione | **CASSA FORTE** | 1 |
| 12 | Tesoreria su Excel (affidamenti, fidi, movimenti per banca) | Amministrazione | **CASSA FORTE** | 1 |
| 13 | CONAI su Excel (registrazione manuale fatture per totale trimestrale) | Amministrazione | **FORGIA** | 2 |
| 14 | Intrastat manuale (inserimento fatture su sito Dogana) | Amministrazione | **FORGIA** | 2 |
| 15 | Discrepanze LIFO (numeri diversi tra prospetto e schede magazzino) | Magazzino/Fiscale | **BUSSOLA** | 1 |
| 16 | Report illeggibili (mastrini solo numeri, senza descrizioni) | Magazzino/Fiscale | **BUSSOLA** | 1 |
| 17 | Dichiarazioni d'intento (rischio di dimenticanza, impossibile modificare ordine) | Amministrazione | **CASSA FORTE** | 3 |
| 18 | Voci doganali non compilate (campo vuoto, collegamento manuale) | Amministrazione | **FORGIA** | 2 |

**Copertura: 18/18 pain point** — Nessuna criticità identificata rimane senza soluzione.

---

## 6. Principi Guida

### 1. Read-First, Write Controlled — Sage X3 Rimane Protetto

La piattaforma nasce come **strato di lettura** (BUSSOLA, MAESTRO non scrivono mai su Sage X3), ma i moduli operativi (CASSA FORTE, FORGIA, SENTINELLA, BANCO) necessitano di **scrivere su Sage X3** per evitare la doppia digitazione. Questa scrittura è:

- **Mai diretta sul database**: ogni operazione passa attraverso le API/web service di Sage X3 (gestite dalla software house Sage), che applicano le stesse validazioni, regole di business e trigger dell'interfaccia utente
- **Sempre validata**: ogni scrittura viene verificata prima dell'esecuzione e richiede conferma dell'operatore per operazioni critiche
- **Completamente tracciata**: audit trail immutabile di ogni operazione di scrittura (chi, cosa, quando, esito)
- **Fail-safe**: se la piattaforma ha un problema, Sage X3 continua a funzionare normalmente; gli utenti possono sempre operare direttamente sull'ERP

> **⚠️ Importante**: le operazioni di scrittura su Sage X3 sono **soggette alla disponibilità e allo scope delle API/web service messe a disposizione dalla software house Sage**. La fattibilità delle funzionalità di write-back (import fatture passive, creazione OdA, aggiornamento anagrafiche) sarà confermata in Fase 0 a seguito di validazione tecnica con la software house Sage. In assenza di API specifiche, i moduli operativi (CASSA FORTE, FORGIA, SENTINELLA, BANCO) funzioneranno come strumenti di analisi e suggerimento, con operatività manuale su Sage X3.

| Modulo | Lettura | Scrittura Sage X3 | Email |
|--------|---------|-------------------|-------|
| **BUSSOLA** | Tutti i dati analitici | — | — |
| **CASSA FORTE** | Scadenzario, partite, movimenti | Riconciliazioni, flag dichiarazioni d'intento | — |
| **FORGIA** | Fatture, anagrafiche, nomenclatura | Import fatture passive, aggiornamento voci doganali | Invio disegni anonimizzati |
| **SENTINELLA** | Storico acquisti, fornitori, costi | Creazione ordini d'acquisto da offerta selezionata | Invio RDA, ricezione risposte fornitori |
| **BANCO** | Giacenze, BOM, routing, costi | Fabbisogni materia prima, suggerimenti approvvigionamento | — |
| **MAESTRO** | Tutti i dati (cross-modulo) | — | Notifiche e digest giornaliero |

### 2. Incrementalità — Un Modulo alla Volta

Ogni modulo è indipendente e attivabile singolarmente. Non è necessario implementare l'intera piattaforma per ottenere valore. La Fase 1 (BUSSOLA + CASSA FORTE core) è già sufficiente per risolvere 7 dei 18 pain point più urgenti.

### 3. AI Responsabile — Trasparenza e Controllo

L'intelligenza artificiale è uno strumento di supporto, non di sostituzione. Ogni suggerimento AI (previsione, classificazione, raccomandazione) è accompagnato da:
- Grado di confidenza
- Dati su cui si basa
- Possibilità di override manuale

Nessuna decisione critica viene presa automaticamente dall'AI senza validazione umana.

### 4. Dati Locali — Sovranità e Sicurezza

I dati restano nel perimetro controllato dal cliente. L'architettura supporta sia deployment on-premise che cloud privato. Nessun dato transita verso servizi esterni non autorizzati. Conformità GDPR nativa.

### 5. Coesistenza — Sage X3 Rimane il Sistema di Record

Sage X3 resta il sistema gestionale di riferimento e la **fonte unica di verità**. La piattaforma si posiziona come strato di intelligenza che:
- **Legge** da Sage X3 per analizzare, visualizzare e predire
- **Scrive** su Sage X3 tramite API per sincronizzare le azioni degli utenti, evitando doppia digitazione
- **Non sostituisce** l'interfaccia Sage X3 per le operazioni standard — gli utenti possono sempre operare direttamente sull'ERP

Questa scelta preserva l'investimento fatto, le competenze degli utenti e la continuità operativa. Gli utenti non sono mai "obbligati" a usare la piattaforma: è un acceleratore, non un vincolo.

### 6. Misurabilità — ROI Verificabile

Ogni modulo ha metriche di impatto definite (tempi prima/dopo, errori evitati, automazioni realizzate). Il valore generato è misurabile e dimostrabile, modulo per modulo.

---

## 7. Costi Operativi della Piattaforma

Questa sezione dettaglia i **costi di esercizio** della piattaforma: infrastruttura cloud, servizi email e inferenza AI. Non include i costi di sviluppo né il lavoro umano di configurazione e personalizzazione — quelli sono oggetto di preventivo separato.

I range indicati riflettono la variabilità d'uso: il limite inferiore corrisponde a un utilizzo base (~5 utenti attivi, volumi moderati), il limite superiore a un utilizzo intensivo (~15–20 utenti, volumi elevati).

---

### 7.1 Infrastruttura — Foundation Layer

| Componente | Servizio di riferimento | Costo stimato | Note |
|------------|------------------------|---------------|------|
| **Database + Auth + Storage** | Supabase Pro / Team | €25–100/mese | Database PostgreSQL gestito, autenticazione SSO, storage documenti, edge functions per logica applicativa |
| **Compute applicativo** | AWS EC2 / equivalente | €100–200/mese | Server applicativo per ETL, scheduling, API. Necessario solo se i carichi superano i limiti Supabase |
| **Replica analitica** | Incluso nel database principale oppure istanza dedicata | €0–100/mese | Database analitico separato per query pesanti senza impattare l'operatività. In fase iniziale può condividere l'istanza principale |
| **Email transazionale** | SendGrid / Amazon SES | €20–50/mese | Volume stimato: 500–2.000 email/mese (RDA a fornitori, notifiche, alert, digest giornalieri) |
| **Monitoring e logging** | Incluso nei servizi cloud | €0–30/mese | Log applicativi, metriche di performance, alert operativi |

**Totale infrastruttura: €200–500/mese**

---

### 7.2 Inferenza AI — Costi per Modulo

I costi AI dipendono dal volume di utilizzo (query, documenti processati, cicli di analisi). Di seguito il dettaglio per modulo, con stima dei volumi tipici per un'azienda delle dimensioni del cliente.

| Modulo | Intensità AI | Tipo di consumo | Volume stimato | Costo stimato |
|--------|-------------|-----------------|----------------|---------------|
| **BUSSOLA** | Bassa | Embeddings per ricerca semantica + LLM per Natural Language Queries | 50–200 query NLQ/giorno | €30–150/mese |
| **CASSA FORTE** | Bassa–Media | Modelli ML per forecasting e anomaly detection (batch, eseguibili su CPU) | Elaborazione giornaliera batch | €20–50/mese |
| **FORGIA** | Media–Alta | OCR per PDF, NLP per classificazione documenti, LLM per smart matching fattura–ordine–DDT | 200–500 documenti/mese | €20–75/mese |
| **SENTINELLA** | Media | Parsing PDF fornitori, price prediction, supplier recommendation | 60–100 PDF/mese + cicli RDA | €30–80/mese |
| **BANCO** | Minima | Algoritmi di ottimizzazione combinatoria (eseguiti localmente, nessun LLM) | On-demand | €0–10/mese |
| **MAESTRO** | Alta | RAG (recupero + generazione) per ogni query conversazionale | 100–500 query/giorno | €100–500/mese |
| **Embeddings condivisi** | — | Manutenzione indice vettoriale per ricerca semantica su catalogo, fornitori, documenti | Aggiornamento continuo | €20–50/mese |

**Totale inferenza AI: €200–900/mese** (in funzione del numero di moduli attivi e dell'intensità d'uso)

---

### 7.3 Modello di Scalabilità dei Costi

I costi operativi crescono in modo **prevalentemente lineare** con i volumi di utilizzo:

- **Infrastruttura**: costi quasi fissi — crescono solo con l'aggiunta di capacità computazionale per picchi di carico
- **AI — query LLM** (BUSSOLA NLQ, MAESTRO): proporzionali al numero di domande/giorno
- **AI — documenti** (FORGIA, SENTINELLA): proporzionali al numero di PDF e fatture processati/mese
- **AI — batch ML** (CASSA FORTE forecasting): costo fisso, rielaborato giornalmente
- **Algoritmi locali** (BANCO): costo trascurabile, elaborazione su CPU del server applicativo

Non ci sono costi iniziali di licenza AI: si paga a consumo (pay-per-use) tramite le API dei modelli.

---

### 7.4 Costo Operativo per Fase

La tabella seguente mostra il costo mensile di esercizio **cumulativo** dopo il completamento di ciascuna fase.

| Fase | Moduli attivi | Costo infrastruttura | Costo AI | **Totale stimato** |
|------|--------------|---------------------|----------|-------------------|
| **Fase 0–1** | Foundation + BUSSOLA + CASSA FORTE core | €200–350/mese | €70–250/mese | **€300–600/mese** |
| **Fase 2** | + FORGIA + SENTINELLA | €250–400/mese | €200–550/mese | **€450–900/mese** |
| **Fase 3** | + BANCO + funzionalità avanzate | €250–450/mese | €250–600/mese | **€500–1.000/mese** |
| **Fase 4** | + MAESTRO (piattaforma completa) | €250–500/mese | €350–900/mese | **€600–1.400/mese** |

> **Nota**: i range riflettono l'incertezza sull'intensità d'uso effettiva. I costi reali si stabiliranno nei primi mesi di operatività e potranno essere ottimizzati (caching, batching, modelli più leggeri) in base ai pattern d'uso osservati.

---

*Documento preparato da Perspective AI per Primario Player Siderurgico — Marzo 2026*
