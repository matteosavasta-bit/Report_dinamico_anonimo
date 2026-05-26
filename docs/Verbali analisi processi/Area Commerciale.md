# Analisi strategica e piano introduzione AI – Incontro Area Commerciale
**Data:** 03/02/2026

> **To-do:** chiedere excel conversione, esempi quantità, excel per scambio feedback, mail cliente con allegati, disegni lavorazioni.

---

## Acquisti

### Gestionale: Sage X3
- Software house ERP: terza parte che gestisce l'installazione Sage – funziona come web app
- Non è un MRP né un ERP completo; ha subito varie personalizzazioni nel tempo
- L'unità di misura di riferimento è il **kg** (il magazzino è valorizzato in kg)
- Non è ancora a livello MRP: nessun suggerimento automatico su approvvigionamenti, nessun semaforo su quantità di materia prima

### Flusso degli acquisti
1. Il commerciale analizza la richiesta del cliente e verifica la disponibilità interna (non prenotata)
2. Dà input all'ufficio acquisti su cosa reperire sul mercato
3. Acquisti avvia la ricerca tra i fornitori e restituisce indicazioni su disponibilità, tempistiche e costi
4. Si effettua la contrattazione con il cliente
5. L'ordine viene inserito dall'ufficio acquisti

Il processo lavora al **70% sul venduto** (commessa-driven, nessuna scorta minima).

---

## Scouting Fornitori

### Tipologie di fornitori
- **~6–8 fornitori principali** per volumi e tipologie di acciaio trattate dal cliente
- Alcuni fornitori hanno **portale online** per interrogare il magazzino (non sempre 100% affidabile); la richiesta via mail rimane comunque necessaria
- Altri fornitori sono meno evoluti: tutto gestito via mail
- Alcuni **stockisti** vengono utilizzati per piccole quantità

### Flusso operativo scouting
- Per ogni riga di richiesta vengono contattati **6–7 fornitori** (copia-incolla della stessa richiesta)
- I fornitori rispondono con costi in **€/metro**, che vanno convertiti in **€/ton** tramite file Excel per consentire al commerciale di valutare la marginalità
- Ogni mattina **3 fornitori** inviano disponibilità via PDF (aperti e ricercati manualmente per dimensione e qualità dell'acciaio); altri **3** hanno accesso tramite portale
  - Convenzione nei PDF: `D` = disponibile in quantità, `d` = disponibile ma poco / non standard

### Volume operativo
- Da novembre: **236 richieste di offerta**, ciascuna con **6–7 righe** da inviare a **6–7 fornitori**
- Si cerca di accorpare più righe di richieste diverse nella stessa mail per ridurre il numero di invii
- Ogni offerta ha un **numero identificativo** a cui si fa riferimento in fase d'ordine
- Attualmente si utilizza un **file Excel** per raccogliere le informazioni lato commerciale e le risposte lato acquisti (in precedenza tutto via mail)

### Aree di sviluppo scouting
- Valutare esplorazione del mercato per **nuovi fornitori e competitor**
- Supporto nella ricerca di **fornitori di lavorazioni** (il cliente ha 2 macchine taglio laser ma non sempre riesce a coprire internamente tutte le lavorazioni)

---

## Gestione Richieste Cliente

### Canali di ricezione
- Corpo mail, PDF, Excel
- Tendenzialmente: **disegni + distinta in Excel** per le lavorazioni; **Excel o corpo mail** per materiale commerciale

### Tipologie di richiesta
| Tipo | Flusso |
|---|---|
| Materiale commerciale | Direttamente ad acquisti |
| Lavorazione | Commerciale → Ufficio tecnico → Acquisti (materia prima) |
| Lavorazioni esterne | Commerciale → Ufficio lavorazioni esterne → Fornitori → Commerciale (quotazione) |

> Nel **99% dei casi** la richiesta contiene una quantità e una lunghezza dei pezzi richiesti.

### Calcolo materiale necessario (ottimizzazione barre)
- Attualmente si usa **un tool di cutting esterno** (sito online): si inseriscono numero pezzi, larghezze disponibili e lunghezze richieste; il sistema calcola quante barre servono e lo scarto stimato (indicativo, non pienamente affidabile)
- **Engineering** usa **sistema di gestione job** per un calcolo più preciso (ma DB non accessibile)
- **Obiettivo:** automatizzare il calcolo della materia prima necessaria dalla distinta cliente per velocizzare la richiesta ad acquisti, eliminando l'attesa dell'ufficio tecnico

---

## Lavorazioni

### Flusso lavorazioni
1. La richiesta arriva dal cliente al commerciale
2. La parte **taglio laser** viene inoltrata all'ufficio tecnico
3. La parte **extra** (lavorazioni meccaniche, saldature) viene inoltrata all'ufficio lavorazioni esterne
4. L'ufficio lavorazioni esterne valuta i fornitori, riceve le quotazioni e le trasmette al commerciale

Tutto il flusso è gestito **via mail**, con archivio PDF.

### Criticità: sanitizzazione dei disegni
- Ogni disegno deve essere **anonimizzato** prima di essere inviato ai fornitori (rimozione di nome cliente, telefono, email, indirizzo)
- Operazione manuale eseguita con **LibreOffice** su file PDF → richiede molto tempo

---

## Gestione Semilavorati in Sage X3

- Attualmente Sage X3 **non legge il semilavorato** come entità con fasi di lavorazione associate
- Per ogni fase di lavorazione occorre creare un **nuovo prodotto** nel sistema
- Si sta lavorando per risolvere questo limite inserendo le fasi di lavorazione come sotto-livelli
- Ogni lavorazione interna richiede la creazione di un **ordine interno** dedicato

---

## Business Intelligence e Dati

- In passato esisteva un file Excel che recuperava dati dal vecchio software per produrre BI elementare → **non più utilizzabile**
- Tutto l'ERP è su **SQL Server**
- Il MES del magazzino è anch'esso su SQL Server
- **sistema di gestione job** è più complesso e non espone un DB direttamente interrogabile