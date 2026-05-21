# Primario Player Siderurgico – Logistica
*Note del 3 febbraio 2026*

---

## Ricevimento merci (entrata)

- Registrazione del camion in entrata con pesatura.
- Predisposizione del ricevimento su **Sage**: flaggando il nome del fornitore si aprono tutti gli ordini e si ricrea il documento del fornitore.
- Vengono create le **righe di magazzino** e si verifica la corrispondenza con il documento del fornitore.

---

## Spedizione merci (uscita)

- All'arrivo del camion cliente, i ragazzi hanno già preparato i carichi tramite **schede di carico**.
- La preparazione avviene con le **pistole** (scanner), passando dallo stato "preparazione" a "carico".
- Il responsabile richiama le bolle di carico e il **DDT viene generato in automatico**.
- Dall'elenco di consegna (con vari filtri) è possibile generare i **certificati di materiale** (analisi chimica, ecc.) da inviare al cliente.
- A seconda che si tratti di materia prima o di lavorato, il sistema risale al **fascio di origine** per creare la documentazione da allegare al cliente.

---

## Organizzazione camion in uscita

- Si utilizza un foglio **Access** (collegato parzialmente a un DB SQL) per verificare i dati del materiale da spedire.
- Il flusso coinvolge più funzioni:
  - **Acquisti**: verificano la disponibilità della materia prima.
  - **Produzione/magazzino**: preparano le schede di preparazione.
  - **Logistica**: abbina cliente, materiale e trasportatore per organizzare il carico.

> Questa è l'attività che occupa **più tempo** (coordinamento materiale, carico e trasportatori).

---

## Criticità e problemi aperti

### Foglio Access non integrato con Sage
- Il foglio Access **non è collegato a Sage** in tempo reale.
- Se una materia prima viene consumata per un altro ordine, la logistica non ne ha immediata notifica.
- L'aggiornamento avviene solo all'apertura del file (carica gli ordini e i loro aggiornamenti).

### Flussi di produzione e logistica non ottimizzati
- La mancata ottimizzazione genera **alti costi di trasporto**.
- Mancano informazioni che arrivino tempestivamente alla logistica.
- Su Sage il dato è aggiornato, ma il **recupero rapido è difficoltoso** a causa dell'aggiornamento manuale del foglio.

### Sincronizzazione Netpro ↔ Sage
- Da verificare la **rapidità di aggiornamento** tra Netpro e Sage durante la lavorazione e la sua durata.
- Da chiarire se il materiale movimentato verso la macchina risulti in stato **"bordo macchina"**.

### Conto lavoro (lavorazioni esterne) non tracciato
- Le lavorazioni esterne non transitano su Netpro, quindi devono essere **inserite manualmente** su Sage.
- Lo stesso vale per l'**insufflaggio**: ordini di lavorazione e generazione di stock vanno gestiti manualmente su Sage.

---

## Coordinamento commerciale / logistica

- Commerciale e ufficio tecnico concordano la data da confermare al cliente.
- La logistica deve **garantire il trasporto** entro la data concordata.