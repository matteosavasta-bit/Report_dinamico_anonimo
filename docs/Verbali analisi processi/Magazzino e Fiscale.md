# Primario Player Siderurgico – Amministrazione
**Incontro con il team Amministrazione – 3 febbraio 2026**

---

## Fatturazione Attiva

- Mappatura siti con schermate.
- I documenti arrivano da altre aree; la fatturazione è l'attività principale.
- Con il nuovo ERP (Sage) la fatturazione attiva è diventata più laboriosa: molte restrizioni a livello di documento — si può agire solo dalla fattura, qualunque modifica deve passare per fattura (non è possibile modificare direttamente il DDT).
- Se si modificano dati sulla fattura, il sistema non corregge retroattivamente i documenti collegati.
- Gli ordini partono con un pagamento; se ci sono accordi di modifica scadenza, bisogna sempre arrivare alla fattura.
- Si usa un **file Excel** per tenere traccia dei DDT tramutati in fattura.
- Per servizi ad altre società del gruppo, DDT interni o note di credito, non serve il DDT di origination.
- Sage recupera già tutti i dati del DDT per la fattura.
- Arrivano richieste via mail per spostamento date di pagamento, modifiche prezzi, ecc.
- **Gestione dichiarazioni d'intento**: se l'ordine era partito in un modo ma da una certa data è esente IVA, non è possibile modificare l'ordine — bisogna ricordarsi cosa fare nel DDT ed eventualmente in fattura.

---

## Fatturazione Passiva

- Utilizzo di un **sistema di conservazione digitale** per le fatture passive.
- **Sito Dogana**: dichiarazioni Intrastat mensili con inserimento manuale delle fatture.
- File Excel per controllo scadenze acquisti e DDT da ricevere (non è possibile fare interrogazioni sull'ERP per fatture da ricevere).
- Scadenziario pagamenti gestito su Excel.
- Controllo incrociato tra DDT caricato e fattura effettiva.
- **Voci doganali**: l'anagrafica articolo ha il campo voce doganale, ma non viene compilato dai colleghi commerciali — l'amministrazione deve prendere la lista, collegare le voci e inserirle in fattura. Primario Player Siderurgico usa codici dal `73..`; la voce doganale può differire tra acquisto estero e vendita.
- **Fatture di acquisto**: si parte da XML scaricati automaticamente dal cassetto fiscale, importati in Sage tramite 2–3 passaggi manuali per spostare i dati nelle schermate corrette e compilare codice IVA, conto, ecc. La visualizzazione è molto più complessa rispetto al sistema precedente.
- I mastri mostrano solo numeri, senza descrizione.
- Nell'importazione XML il PDF allegato alla fattura si separa e deve essere ricollegato manualmente.
- **Dichiarazione CONAI**: ogni fattura viene registrata su foglio Excel per avere il totale trimestrale.
- **Dichiarazione Intra**: compilata su foglio Excel con dati cliente e dati fattura.

---

## Anagrafiche

- Un nuovo cliente compila una scheda in formato Word, inviata dai colleghi commerciali con i dati principali (utilizzatore, agente, ecc.).
- L'inserimento di una nuova anagrafica in ERP comporta la compilazione di diversi folder.

---

## Banche e Tesoreria

- I file RH da remote banking (movimenti giornalieri) vengono salvati in cartella e importati in Sage (modulo banca dedicato); è necessario un intervento manuale limitato perché le banche non sempre forniscono la descrizione del movimento.
- In parallelo rimane un **file Excel** suddiviso per banca con tutti i movimenti (bonifici, F24, entrate/uscite), necessario perché al download dell'RH viene scaricato anche un PDF usato per compilare il foglio.
- Il pagamento non può essere inserito direttamente in ERP, quindi il foglio Excel è indispensabile per monitorare giacenza e utilizzo fidi.
- Il primo foglio Excel (Tesoreria) riporta in alto tutti gli affidamenti accordati; tramite formule sulle altre tab mostra quanto è utilizzato e quanto è disponibile.
- Apertura di lettere di credito e finanziamenti hanno caselle dedicate nel foglio tesoreria.
- Un'altra sezione è dedicata alle entrate e uscite previste.
- **Problema esposizione cliente**: interrogando la parte cliente su Sage non è possibile avere la situazione complessiva del cliente. L'analisi partite mostra solo le fatture non pagate, ma non le ricevute bancarie già emesse (che risultano già pagate anche se la scadenza non è scaduta).
- Necessità di un **report per cliente** con esposizione completa.
- Al 31 dicembre il problema si aggrava: non è possibile fare interrogazioni dei partitari alla data; occorre produrre più prospetti (partite chiuse + RIBA presentate ma non scadute).

---

## Magazzino e Fiscale

- Le stampe fiscali di magazzino non producono ancora numeri facilmente consultabili e sicuri.
- Il prospetto LIFO per il bilancio 2024 mostra numeri diversi rispetto alle schede magazzino.
- Il recupero ed elaborazione dei dati è molto lungo e soggetto a errori.
- Problemi nelle interrogazioni di quantità entrate/uscite per singolo articolo.
- In Sage sono presenti alcune consultazioni personalizzate realizzate ad hoc dai programmatori Sage.

---

## Personale

- È stato introdotto **Rileva Fullweb**, nuovo software per la gestione delle presenze e per l'elaborazione dei dati da inviare al consulente del lavoro per le buste paga.

---

## Contabilità Generale e Reporting

- Elaborazione trimestrale di situazioni infrannuali: il piano dei conti è stato parametrizzato, consentendo l'estrazione diretta da Sage su piano dei conti personalizzato.
- Molte informazioni vengono veicolate tramite mail (richieste varie, comunicazioni interne).
- I rapporti con revisori e sindaci richiedono la preparazione di documentazione; i mastrini estratti da Sage sono spesso illeggibili.