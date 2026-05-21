# Ufficio Tecnico — Note di Riunione
**Data:** 3 febbraio 2026

---

## Flusso di Lavoro: Dal Preventivo all'Ordine

### 1. Ricezione della Richiesta
- L'ufficio tecnico riceve input dall'**ufficio commerciale** via **mail** (con disegno 3D, distinta e specifica).
- La richiesta include: fattibilità del pezzo, materia prima necessaria, tempi per pezzo e tempi di consegna (considerando il carico di lavoro attuale).
- Se disponibili disegni 3D, 2D e distinte complete, il preventivo viene elaborato rapidamente.

### 2. Elaborazione del Preventivo
- Strumenti utilizzati:
  - **Sistema MES per job** — gestione dei job di lavorazione
  - **CAD 3D dedicato** — disegno 3D pezzi per macchine di taglio
  - **SolidWorks** — creazione disegni 3D da PDF
- Il primo preventivo viene redatto con **tempistiche standard** sulla totalità del progetto (poi affinato se accettato).
- Il preventivo viene restituito al commerciale in **formato Excel via mail**.

### 3. Conferma dell'Ordine
- Se il preventivo viene accettato, arriva una nuova mail che converte il preventivo in **ordine**, richiedendo dati precisi.
- Potrebbero esserci modifiche o aggiunte rispetto al preventivo iniziale.
- I file STEP vengono lavorati per generare file 3D corretti, da cui si creano i **job di lavorazione**.
- Dal job si estrae una **distinta** che il commerciale usa per definire: tempistiche, numero di barre necessarie, scarto previsto e prezzo finale al cliente.

---

## Flusso Produttivo

### 4. Pianificazione della Produzione
- Quando l'ordine ha una **data di consegna**, si avvia la verifica del materiale a magazzino.
- Vengono stampati i job da inviare alle macchine.
- Viene creata una **distinta di prelievo** (attualmente in Excel, compilata manualmente) consegnata al magazziniere con: materiale richiesto per ogni job e ubicazione in magazzino.

### 5. Esecuzione in Produzione — MES di stabilimento
- Il **MES di stabilimento** è il sistema per la produzione; riceve dati da **Sage** per la lavorazione e l'etichettatura del materiale.
- Il caricamento di un job genera automaticamente un **ordine di produzione** visibile in MES di stabilimento.
- I tecnici di macchina:
  1. Richiamano il numero del job e gli ordini di produzione.
  2. Verificano l'etichetta sul tubo per confermare che il fascio corrisponda al lavoro.
  3. Etichettano i pezzi completati e chiudono il job di lavorazione.

### 6. Controllo e Chiusura
- Il job torna in ufficio per un **controllo manuale giornaliero**: si verifica che i movimenti di MES di stabilimento corrispondano al prelevato (chili, pezzi, ecc.).
- Una volta confermato, i dati passano da MES di stabilimento a **Sage**, rendendoli disponibili per fasi successive (consegna, spedizione, ecc.).
- Finché l'errore è in MES di stabilimento è correggibile; una volta passato a Sage, le modifiche diventano molto difficili.
- Il controllo serve anche a recuperare dati di **tempistica e marginalità**.

---

## Criticità e Pain Point Identificati

### Tracciabilità delle Istruzioni Operative
- Le istruzioni di dettaglio per gli operatori macchina (laser, ecc.) sono scritte **a mano sul job di lavorazione**.
- Manca uno strumento per raccogliere e rendere disponibili in modo strutturato tutte le informazioni specifiche per cliente e per ordine.
- Alcune informazioni valgono sempre per un cliente, altre sono specifiche dell'ordine.
- **Gap:** manca un sistema di alert per il riconoscimento di istruzioni particolari su un ordine.

### Carico sull'Ufficio Tecnico
- L'ufficio tecnico è spesso occupato su lavori di dettaglio e conferma, senza tempo per i **preventivi di massima**.
- I preventivi grezzi richiedono mediamente **24 ore** — uno strumento dedicato potrebbe accelerare di un giorno la presentazione dell'offerta.
- Molto tempo viene perso nel passaggio **da 2D a 3D**.

### Gestione dei Preventivi Ripetuti
- Se un pezzo è già stato realizzato, non si fa un nuovo preventivo ma si procede direttamente con l'ordine.
- Tuttavia, viene sempre generato un **nuovo codice** anche per pezzi identici.
- Il **codice disegno** è collegato a un solo prodotto (PL); esistono circa **27.000 disegni** in archivio su sistema di gestione job e Sage.
- **Opportunità:** uno strumento che analizzi la distinta, estragga il codice disegno e lo confronti con l'archivio permetterebbe di rispondere commercialmente senza passare dall'ufficio tecnico — inclusa la valutazione per analogia di pezzi simili non ancora codificati.

### Distinta di Prelievo
- Attualmente creata **manualmente in Excel**, stampata e consegnata al magazziniere.
- Richiede il recupero manuale di informazioni da sistema di gestione job (job) e da Sage (materia prima e ubicazione).
- **Gap:** manca un controllo strutturato sul flusso di recupero materiale.

### Integrazione con le Macchine
- Una macchina è collegata direttamente a sistema di gestione job (carica il job e lavora in autonomia).
- Un'altra macchina **non è integrata**: i tecnici cercano manualmente i codici prodotto nel sistema e devono attendere il giorno successivo per verificare se un singolo PL è pronto.

---

## Strumenti Utilizzati

| Strumento | Funzione |
|-----------|----------|
| Sistema gestione job (tool dedicato) | Job di lavorazione, distinte, archivio disegni |
| CAD 3D dedicato | Disegno 3D macchina (part program) da file STEP |
| **SolidWorks** | Creazione disegni 3D da PDF |
| MES di stabilimento | Gestione ordini di produzione, etichettatura |
| **Sage** | ERP — gestione dati aziendali, materie prime, spedizioni |
| **Excel** | Preventivi, distinte di prelievo (processo manuale) |