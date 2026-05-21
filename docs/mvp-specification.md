# MVP Primario Player — Specification & Development Roadmap

**Versione**: 1.0
**Data**: 2026-04-11
**Owner**: Perspective AI
**Target audience**: DevOps, Full-Stack Engineers, AI Engineers
**Stato**: Baseline per lo sviluppo

---

## 0. Come usare questo documento

Questo è il documento di riferimento per la costruzione dell'MVP da presentare al cliente. Ogni sezione contiene:

- **Spec funzionale**: cosa deve fare la feature
- **Spec tecnica**: come implementarla (schema, endpoint, componenti)
- **Definition of Done (DoD)**: checklist concreta per marcare il lavoro completo
- **Acceptance criteria**: cosa viene verificato prima della demo

Se un requisito è ambiguo, **fermati e chiedi**. Non inventare dati, non fakeare campi Sage: lavoriamo con estratti reali.

---

## 1. Contesto e Obiettivi

### 1.1 Perché questo MVP esiste

il primario player siderurgico è un'azienda di distribuzione e lavorazione acciaio. Abbiamo consegnato una proposta per una **piattaforma modulare a 6 moduli** (BUSSOLA, CASSA FORTE, FORGIA, SENTINELLA, BANCO, MAESTRO) costruita sopra il loro ERP Sage X3. L'audit di fattibilità (`docs/feasibility-audit.md`) ha identificato BUSSOLA e BANCO come i moduli a **massima fattibilità read-only** e MAESTRO come il migliore candidato per dimostrare l'angolo AI.

L'MVP **non è un prototipo del prodotto finale**. È una **demo di convincimento**: deve dimostrare, in 15 minuti di presentazione, che PAI può consegnare valore reale sui loro dati reali, veloce. L'obiettivo è ottenere il go-ahead per il progetto completo.

### 1.2 Obiettivi di business dell'MVP

1. Mostrare al cliente **i loro propri dati** (anonimizzati) in una dashboard pulita e comprensibile
2. Mostrare un'automazione operativa concreta (ottimizzazione taglio) con un numero che parla
3. Mostrare l'AI come "copilota conversazionale" sui dati aziendali
4. Generare il sì al progetto completo

### 1.3 Vincoli

- **Tempo**: 4 giornate di sviluppo effettivo, 1 giornata di rifinitura/demo rehearsal
- **Team**: 1 full-stack, 1 AI engineer, 1 DevOps (può essere la stessa persona che fa full-stack)
- **Dati**: solo read-only su Sage X3, via utente `[utente read-only]` (vedi `docs/sql-server-access.md`)
- **Stack imposto**: React + Vercel (frontend), Supabase (backend + Postgres), Google AI Studio (Gemini family) per tutto l'AI
- **Scope bloccato**: solo Option A — niente FORGIA, CASSA FORTE, SENTINELLA, PONTE

---

## 2. Scope

### 2.1 In scope (MVP)

| # | Modulo | Slice MVP |
|---|--------|-----------|
| 1 | **BUSSOLA** | Una dashboard vendite + un anomaly callout AI-narrated |
| 2 | **BANCO** | Cutting optimizer 1D su un ordine reale YYTSQP con visualizzazione SVG |
| 3 | **MAESTRO** | Chat NL su ~15 tabelle Sage con text-to-SQL Gemini + 5 domande pre-validate |
| 4 | **Shell UI** | Navigazione unificata + branding il cliente + login demo |
| 5 | **Data pipeline** | Estrazione Sage → anonimizzazione → Supabase, idempotente, scriptata |

### 2.2 Out of scope (NON costruire)

- Qualsiasi operazione di write-back verso Sage
- SSO enterprise (SAML/OIDC aziendali) e RBAC multi-ruolo
- Multi-tenant
- CI/CD enterprise (basta deploy preview Vercel)
- Qualsiasi feature di FORGIA, CASSA FORTE, SENTINELLA, PONTE
- Gestione email SMTP/IMAP
- Mobile responsive sotto 1024px (la demo avviene su laptop)
- Localizzazione multi-lingua (solo italiano)
- Test e2e (si fa smoke manuale pre-demo)
- Internazionalizzazione dei numeri oltre `it-IT`

### 2.3 Principi di esecuzione

- **Happy path first**: se qualcosa non serve alla demo, non si costruisce
- **Real data beats fake data**: usiamo sempre estratti veri, anonimizzati. Zero Lorem Ipsum
- **Failure modes are OK, silent failures are not**: se Gemini fallisce, mostra un messaggio chiaro in italiano
- **Se un valore non è verificabile, non lo mostriamo**: niente numeri inventati sulla dashboard

---

## 3. Architettura

### 3.1 Diagramma logico

```
┌──────────────────────┐     ┌────────────────────────┐
│  Sage X3 (SQL Server)│     │  Google AI Studio      │
│  read-only [utente read-only] │     │  Gemini 2.5 family     │
└──────────┬───────────┘     └──────────┬─────────────┘
           │ ETL once/day                │ REST
           ▼                             │
┌──────────────────────┐                 │
│  Python extractor    │                 │
│  (local / GitHub     │                 │
│   Actions)           │                 │
└──────────┬───────────┘                 │
           │ upsert                      │
           ▼                             │
┌──────────────────────────────────────┐ │
│           Supabase Project           │ │
│  ┌─────────┐ ┌───────────┐ ┌───────┐ │ │
│  │Postgres │ │Edge Funcs │ │Storage│ │ │
│  └─────────┘ └─────┬─────┘ └───────┘ │ │
└────────────────────┼─────────────────┘ │
                     │ proxies Gemini    │
                     │ + guards SQL      │
                     ▼                   │
              ┌─────────────────────────┐│
              │   React SPA / Vercel    ├┘
              │   (Vite + TS + shadcn)  │
              └─────────────────────────┘
```

### 3.2 Componenti

| Componente | Tecnologia | Responsabilità |
|------------|-----------|----------------|
| **Extractor** | Python 3.12 + `pymssql` + `supabase-py` | Legge Sage read-only, anonimizza PII, upsert in Supabase |
| **Database** | Supabase Postgres | Dati Sage anonimizzati, schema denormalizzato per query veloci |
| **Edge Functions** | Supabase Edge Functions (Deno/TS) | Proxy Gemini + SQL guardrails + cutting optimizer |
| **Frontend** | React 18 + Vite + TypeScript + Tailwind + shadcn/ui + Recharts | UI demo |
| **Hosting** | Vercel | SPA deploy, preview environments |
| **AI** | Gemini 2.5 Pro (narrazione) + Gemini 2.5 Flash (text-to-SQL) via Google AI Studio | AI engineering |

### 3.3 Perché queste scelte

- **Supabase invece di un backend custom**: niente da gestire, Postgres managed, Edge Functions coprono il 100% dei nostri endpoint, row-level security gratis
- **Vite + React invece di Next.js**: l'MVP è una SPA, non serve SSR, niente overhead App Router
- **Gemini 2.5 Flash per text-to-SQL**: latenza sub-secondo, costo trascurabile, più che sufficiente per questo scope
- **Gemini 2.5 Pro per narrazione insights**: dove la qualità del reasoning conta
- **Nessun Vercel Workflow / DurableAgent**: non serve persistenza long-running; sono chiamate request/response normali

---

## 4. Data Pipeline (Extractor)

### 4.1 Obiettivo

Copiare un sottoinsieme anonimizzato dei dati Sage X3 in Supabase Postgres. Eseguito una volta al giorno (manuale o via cron Vercel/GitHub Actions) durante la fase di sviluppo; prima della demo si fa un refresh finale.

### 4.2 Location e struttura

```
extractor/
├── pyproject.toml
├── .env.example
├── src/
│   ├── __init__.py
│   ├── config.py           # env loading
│   ├── sage_client.py      # pymssql connection + safe query helpers
│   ├── anonymize.py        # PII masking (customer, supplier names)
│   ├── transform.py        # Sage → Supabase schema mapping
│   ├── load.py             # supabase-py upsert
│   └── main.py             # CLI entrypoint
└── sql/
    └── supabase_schema.sql # Tabelle target, indici, vista materializzate
```

### 4.3 Tabelle Sage da estrarre

Finestra temporale: **ultimi 24 mesi** per tutto ciò che è transazionale.

| Sage table | Righe attese | Scopo | Modulo |
|------------|-------------|-------|--------|
| `SINVOICED` | ~30k (24m) | Righe fattura cliente | BUSSOLA, MAESTRO |
| `SINVOICE` | ~8k | Header fatture | BUSSOLA |
| `BPCUSTOMER` | ~2k | Anagrafica clienti | BUSSOLA, MAESTRO |
| `ITMMASTER` | ~31k | Anagrafica articoli | tutti |
| `STAT` | 246k pre-agg | Statistiche vendite aggregate | BUSSOLA |
| `GACCDUDATE` | ~31k | Scadenze aperte (per drill) | MAESTRO |
| `STOCK` | ~3k | Giacenze correnti | BANCO, MAESTRO |
| `YYTSQP` | ~57k | Righe pezzo di offerta (input BANCO) | BANCO |
| `YYTBOM` | ~35k | Distinta base preventivi | BANCO |
| `ITMSALES` | variabile | Classificazione prodotti vendita | BUSSOLA |

**Nota**: la lista definitiva delle colonne per tabella va validata prima dell'extraction leggendo `docs/database-map.md` e i file in `docs/domains/`.

### 4.4 Regole di anonimizzazione

Non mostriamo mai a video ragioni sociali reali di clienti/fornitori il cliente (rischio figura con la controparte). Durante l'estrazione:

- `BPCUSTOMER.BPCNAM_0` → `customer.alias` = `Cliente A`, `Cliente B`, ... (mapping deterministico: hash(BPCNUM_0) → indice)
- `BPSUPPLIER.BPSNAM_0` → `Fornitore 01`, `Fornitore 02`, ... (non usato nell'MVP ma già anonimizzato se estratto)
- Agenti (REP1_0/REP2_0) → `agent.alias` = `Agente 01`, `Agente 02`, ... (stessa strategia hash→indice)
- Numeri articolo (ITMREF_0) e descrizioni: mantenuti (non sono PII, e servono all'autenticità della demo)
- Partite IVA, codici fiscali, indirizzi completi: rimossi dal dump (teniamo solo city/country in `customer_address`)
- `customer.external_ref` conserva BPCNUM_0 in chiaro come chiave di upsert per l'ETL, ma non viene mai esposta in UI
- Il mapping hash→alias è deterministico e salvato in `anonymize.py` come seed, così refresh multipli restituiscono lo stesso alias

### 4.5 Schema Supabase (normalizzato — 3NF)

Lo schema è **normalizzato in terza forma normale**: ogni entità di riferimento (paese, agente, magazzino, famiglia articolo, unità di misura) vive in una tabella dedicata, le relazioni sono espresse via foreign key. I dati transazionali di Sage vengono "scollegati" dalle loro descrizioni testuali durante l'ETL e reinseriti come FK.

Convenzioni:
- Chiavi primarie surrogate `id bigint generated always as identity` dove non c'è una chiave naturale stabile; chiavi naturali quando esistono (es. `invoice_number`, codice articolo)
- Tutte le FK sono `not null` dove la relazione è obbligatoria, con `on delete restrict`
- Timestamp in `timestamptz`, date in `date`
- Il layer analitico (viste materializzate) vive **sopra** lo schema normalizzato e non altera la normalizzazione

```sql
-- ============================================================
-- Lookup / reference tables
-- ============================================================

create table country (
  code char(2) primary key,          -- ISO 3166-1 alpha-2 (IT, DE, FR…)
  name text not null
);

create table uom (
  code text primary key,             -- KG, M, PZ, MT2…
  description text not null
);

create table item_family (
  id bigint generated always as identity primary key,
  code text unique not null,
  name text not null
);

create table agent (
  id bigint generated always as identity primary key,
  code text unique not null,         -- REP1_0 / REP2_0 dal Sage
  alias text not null                -- anonimizzato: "Agente 01"
);

create table warehouse (
  id bigint generated always as identity primary key,
  code text unique not null,         -- WRH_0 dal Sage
  name text not null
);

-- ============================================================
-- Party entities
-- ============================================================

create table customer (
  id bigint generated always as identity primary key,
  external_ref text unique not null, -- BPCNUM_0 Sage (opaco, non PII)
  alias text not null,               -- "Cliente A" (mai la ragione sociale reale)
  country_code char(2) references country(code),
  created_at timestamptz default now()
);

create table customer_address (
  id bigint generated always as identity primary key,
  customer_id bigint not null references customer(id) on delete cascade,
  city text,
  country_code char(2) references country(code),
  is_primary boolean not null default false
);
create index on customer_address (customer_id);

-- ============================================================
-- Item master
-- ============================================================

create table item (
  id bigint generated always as identity primary key,
  external_ref text unique not null, -- ITMREF_0 (mantenuto in chiaro, non PII)
  description text not null,
  family_id bigint references item_family(id),
  uom_code text references uom(code),
  weight_kg numeric(12,4)
);
create index on item (family_id);

create table item_cost (
  item_id bigint primary key references item(id) on delete cascade,
  standard_cost numeric(14,4) not null,
  currency char(3) not null default 'EUR',
  valid_from date not null,
  valid_to date
);

-- ============================================================
-- Sales — invoices (header + lines)
-- ============================================================

create table invoice (
  invoice_number text primary key,   -- NUM_0 Sage (chiave naturale stabile)
  invoice_date date not null,
  customer_id bigint not null references customer(id),
  agent_id bigint references agent(id)
);
create index on invoice (invoice_date);
create index on invoice (customer_id);

create table invoice_line (
  invoice_number text not null references invoice(invoice_number) on delete cascade,
  line_no int not null,
  item_id bigint not null references item(id),
  qty numeric(14,4) not null,
  unit_price numeric(14,4) not null,
  line_amount numeric(14,2) not null,
  primary key (invoice_number, line_no)
);
create index on invoice_line (item_id);

-- ============================================================
-- Stock (snapshot)
-- ============================================================

create table stock_lot (
  id bigint generated always as identity primary key,
  item_id bigint not null references item(id),
  warehouse_id bigint not null references warehouse(id),
  lot_code text not null,
  qty_kg numeric(14,4) not null,
  snapshot_at timestamptz not null default now(),
  unique (item_id, warehouse_id, lot_code, snapshot_at)
);
create index on stock_lot (item_id);
create index on stock_lot (warehouse_id);

-- ============================================================
-- BANCO input (cutting optimizer)
-- ============================================================

create table banco_order (
  id bigint generated always as identity primary key,
  external_ref text unique not null, -- es. "BAN-0001"
  customer_id bigint not null references customer(id),
  created_at timestamptz not null default now(),
  notes text
);

create table banco_order_piece (
  id bigint generated always as identity primary key,
  order_id bigint not null references banco_order(id) on delete cascade,
  piece_no int not null,
  item_id bigint not null references item(id),
  length_mm numeric(10,2) not null,
  qty int not null check (qty > 0),
  unique (order_id, piece_no)
);
create index on banco_order_piece (order_id);

-- ============================================================
-- Read-optimization layer (non altera la normalizzazione sottostante)
-- ============================================================

create materialized view mv_sales_monthly as
select
  date_trunc('month', i.invoice_date)::date as month,
  i.customer_id,
  il.item_id,
  i.agent_id,
  sum(il.line_amount) as revenue,
  sum(il.qty)         as qty
from invoice i
join invoice_line il using (invoice_number)
group by 1, 2, 3, 4;

create index on mv_sales_monthly (month);
create index on mv_sales_monthly (customer_id);
create index on mv_sales_monthly (item_id);

-- Refresh a fine ETL:
-- refresh materialized view concurrently mv_sales_monthly;
```

**Note di design**:

- `customer.external_ref` e `item.external_ref` mantengono la mappatura verso Sage (BPCNUM_0, ITMREF_0) — servono all'ETL per l'upsert idempotente, non vengono mai mostrati in UI
- `customer_address` è separato da `customer` per supportare, se/quando servirà, più indirizzi per cliente (post-MVP). Per l'MVP popoliamo una sola riga `is_primary = true`
- `item_cost` è separato da `item` perché i costi standard hanno validità temporale: permette di evolvere verso storicizzazione senza alterare lo schema principale
- `mv_sales_monthly` usa `refresh materialized view concurrently`: richiede un indice univoco su una combinazione di colonne se vogliamo refresh concorrente; in alternativa accettiamo lock breve durante l'ETL (accettabile di notte)

### 4.5.1 Row Level Security

**Tutte** le tabelle di business devono avere RLS attivo. La policy è semplice per l'MVP: utenti autenticati possono solo leggere; nessuno può scrivere dal client (tutte le scritture passano dall'ETL con service role).

```sql
-- Attiva RLS su ogni tabella di business
alter table country              enable row level security;
alter table uom                  enable row level security;
alter table item_family          enable row level security;
alter table agent                enable row level security;
alter table warehouse            enable row level security;
alter table customer             enable row level security;
alter table customer_address     enable row level security;
alter table item                 enable row level security;
alter table item_cost            enable row level security;
alter table invoice              enable row level security;
alter table invoice_line         enable row level security;
alter table stock_lot            enable row level security;
alter table banco_order          enable row level security;
alter table banco_order_piece    enable row level security;

-- Policy uniforme: gli utenti autenticati possono leggere tutto.
-- Nessuna policy di INSERT/UPDATE/DELETE = nessuna scrittura dal client.
do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array[
      'country','uom','item_family','agent','warehouse',
      'customer','customer_address','item','item_cost',
      'invoice','invoice_line','stock_lot',
      'banco_order','banco_order_piece'
    ])
  loop
    execute format(
      'create policy "authenticated can read" on %I for select to authenticated using (true);',
      tbl
    );
  end loop;
end$$;
```

> **Nota su `mv_sales_monthly`**: le viste materializzate in Postgres non supportano RLS. Per la demo bastano i grant: `revoke all on mv_sales_monthly from anon; grant select on mv_sales_monthly to authenticated;`. Post-MVP: wrappare in una funzione `security invoker` o materializzare in tabella vera con RLS.

Le migrazioni vivono in `extractor/sql/supabase_schema.sql` e si applicano tramite Supabase CLI (`supabase db push`) o dashboard SQL editor.

### 4.6 Esecuzione

```bash
# one-shot
uv run extractor/src/main.py --since 2024-01-01 --dry-run
uv run extractor/src/main.py --since 2024-01-01

# refresh giornaliero (GitHub Actions, cron)
# file: .github/workflows/etl.yml
```

Requisito di sicurezza: **le credenziali Sage vivono solo come GitHub Secrets / `.env` locale, mai in codice o log**. La connessione VPN a gruppo industriale del cliente deve essere attiva (vedi `docs/sql-server-access.md`).

### 4.7 DoD Data Pipeline

- [ ] `extractor/src/main.py --dry-run` esegue end-to-end e stampa conteggi per tabella
- [ ] Un refresh completo (senza `--dry-run`) termina in < 5 minuti
- [ ] Tutte le tabelle target di §4.3 sono popolate con almeno le colonne di §4.5
- [ ] Zero ragioni sociali reali sono presenti nelle tabelle Supabase (verifica: `select alias from customer limit 20` e `select alias from agent limit 20`)
- [ ] Tutti i vincoli FK sono validi (nessun `invoice.customer_id` orfano, nessun `invoice_line.invoice_number` non trovato in `invoice`)
- [ ] Le viste materializzate sono refreshate a fine ETL
- [ ] Lo script è idempotente (rerun = stesso risultato)
- [ ] `.env.example` documenta tutte le variabili richieste

---

## 5. Modulo 1 — BUSSOLA Slice

### 5.1 Feature

Una dashboard vendite con:

1. **KPI cards**: fatturato ultimi 12 mesi, delta YoY, numero clienti attivi, top articolo
2. **Grafico fatturato mensile** (area chart) con toggle clienti/agenti/articoli
3. **Tabella top 10 clienti** per fatturato, con mini-trend inline
4. **Anomaly callout AI-narrated**: un box generato da Gemini 2.5 Pro che evidenzia 1 anomalia vera dai dati (es. "Cliente C ha ridotto gli ordini del 42% negli ultimi 3 mesi") in italiano naturale

### 5.2 Route & componenti

```
src/
├── pages/
│   └── Bussola.tsx
├── components/bussola/
│   ├── KpiCards.tsx
│   ├── RevenueChart.tsx
│   ├── TopCustomersTable.tsx
│   └── AnomalyCallout.tsx
└── lib/
    ├── supabaseClient.ts
    └── queries/bussola.ts
```

### 5.3 Queries (Supabase)

Tutte le query analitiche usano la vista materializzata `mv_sales_monthly` per rispettare il budget di render; per l'etichetta del cliente si fa join su `customer.alias`.

- KPI fatturato 12m:
  ```sql
  select sum(revenue) as revenue_12m
  from mv_sales_monthly
  where month >= (current_date - interval '12 months');
  ```
- YoY: stessa query sui due intervalli `[-12m, 0]` e `[-24m, -12m]`, delta calcolato client-side
- Trend mensile:
  ```sql
  select month, sum(revenue) as revenue
  from mv_sales_monthly
  group by month
  order by month;
  ```
- Top 10 clienti 12m:
  ```sql
  select c.alias, sum(m.revenue) as revenue
  from mv_sales_monthly m
  join customer c on c.id = m.customer_id
  where m.month >= (current_date - interval '12 months')
  group by c.alias
  order by revenue desc
  limit 10;
  ```

### 5.4 AI: Anomaly Callout

**Pipeline**:

1. Frontend chiama Edge Function `POST /anomaly-insight`
2. Edge Function esegue 3 query deterministiche (drop clienti, picco articoli, drop margine) sul database
3. Risultati passati a Gemini 2.5 Pro con prompt system + few-shot
4. Gemini restituisce 1 insight + spiegazione + suggerimento (max 80 parole)
5. Frontend renderizza in `<AnomalyCallout/>`

**System prompt** (vive in `supabase/functions/anomaly-insight/prompts.ts`):

```
Sei un analista finanziario senior per una società di distribuzione acciaio.
Ricevi dati aggregati in formato JSON. Il tuo compito è:
1. Identificare l'anomalia più rilevante per un CFO
2. Spiegarla in massimo 2 frasi in italiano naturale
3. Suggerire una sola azione concreta (1 frase)

Regole ferree:
- Non inventare numeri: usa SOLO quelli nel JSON in input
- Non nominare mai alias generici come "Cliente A" — usa "un cliente importante"
- Non usare gergo tecnico (no "KPI", "churn", "delta")
- Rispondi in JSON: {"title":"...", "explanation":"...", "action":"..."}
```

Temperature: `0.2`. Max output tokens: `300`.

### 5.5 DoD BUSSOLA

- [ ] Dashboard renderizza in < 2s con dati reali
- [ ] KPI YoY calcolato correttamente (verifica manuale su 2 mesi campione)
- [ ] Anomaly callout restituisce testo sempre diverso e sempre coerente con i dati
- [ ] Nessun valore `NaN`, `undefined`, `null` visibile in UI
- [ ] Tooltip dei grafici in italiano con formato numerico `it-IT` (€ 1.234.567)
- [ ] Il box anomaly ha uno stato di loading, uno di errore, uno di successo

### 5.6 Acceptance Criteria

1. Aprendo `/bussola` a freddo (cache vuota), la pagina è interattiva in ≤ 2.5s
2. Almeno 3 query differenti della checklist di demo restituiscono risultati coerenti tra grafico e tabella
3. Gemini produce un insight valido 10 volte su 10 in fase di rehearsal

---

## 6. Modulo 2 — BANCO Slice

### 6.1 Feature

Cutting optimizer 1D su un ordine reale (o realistico) YYTSQP:

1. Selettore ordine dalla tabella `banco_order`
2. Visualizzazione pezzi richiesti (lunghezza × quantità)
3. Bottone "Ottimizza taglio"
4. Output: layout barre con rappresentazione SVG (ogni barra = rettangolo con segmenti colorati per pezzo), percentuale scarto, numero barre necessarie
5. Confronto "prima/dopo": stima naive (First Fit) vs algoritmo ottimizzato (First Fit Decreasing con kerf configurabile)

### 6.2 Algoritmo

Usiamo **First Fit Decreasing** con kerf (spessore lama) configurabile:

```ts
// supabase/functions/cutting-optimize/algo.ts
type Piece = { length: number; qty: number; id: string };
type Bar = { stockLength: number; cuts: {pieceId: string; length: number}[]; waste: number };

function optimize(pieces: Piece[], stockLength: number, kerf: number): Bar[] {
  // Espandi per quantità
  const expanded = pieces.flatMap(p =>
    Array.from({length: p.qty}, (_, i) => ({id: `${p.id}#${i}`, length: p.length}))
  );
  // Ordina decrescente per lunghezza
  expanded.sort((a, b) => b.length - a.length);

  const bars: Bar[] = [];
  for (const piece of expanded) {
    let placed = false;
    for (const bar of bars) {
      const used = bar.cuts.reduce((s, c) => s + c.length + kerf, 0);
      if (used + piece.length <= bar.stockLength) {
        bar.cuts.push({pieceId: piece.id, length: piece.length});
        placed = true;
        break;
      }
    }
    if (!placed) {
      bars.push({stockLength, cuts: [{pieceId: piece.id, length: piece.length}], waste: 0});
    }
  }
  // Calcola scarto
  for (const bar of bars) {
    const used = bar.cuts.reduce((s, c) => s + c.length, 0)
               + Math.max(0, (bar.cuts.length - 1) * kerf);
    bar.waste = bar.stockLength - used;
  }
  return bars;
}
```

**Parametri hardcoded per la demo**:
- `stockLength = 6000` mm (barra standard 6 metri)
- `kerf = 3` mm

### 6.3 Endpoint

`POST /functions/v1/cutting-optimize`

Request:
```json
{ "orderId": "BAN-0001" }
```

Response:
```json
{
  "orderId": "BAN-0001",
  "stockLength": 6000,
  "kerf": 3,
  "naive": { "bars": 12, "wastePct": 14.2 },
  "optimized": { "bars": 9, "wastePct": 4.8, "layout": [...] }
}
```

### 6.4 Visualizzazione

SVG inline in React: per ogni barra, un rettangolo `width=100%`, diviso in segmenti proporzionali. Gli scarti sono tratteggiati in rosa. Ogni segmento ha un tooltip con lunghezza in mm.

**Colori**: stessa palette della dashboard BUSSOLA per coerenza.

### 6.5 Disclaimer obbligatorio

In fondo alla vista BANCO, un box informativo:

> *Il confronto "stima manuale vs algoritmo" è calcolato su questo singolo ordine con lunghezza barra 6m e lama 3mm. Un benchmark sistematico sul portafoglio del cliente è previsto nella fase post-MVP.*

Questo disclaimer è **non rimovibile**. L'audit (§5 BANCO, problematica 2) ha flaggato la claim 8–12% → 3–5% come non dimostrata. Non la riproduciamo.

### 6.6 DoD BANCO

- [ ] L'ottimizzatore esegue in < 200ms su ordini fino a 500 pezzi
- [ ] La visualizzazione SVG è leggibile da laptop 1440×900
- [ ] Scarto % naive è sempre ≥ scarto % ottimizzato (sanity check)
- [ ] Il disclaimer è presente e non rimovibile
- [ ] Almeno 3 ordini preparati per la demo, con risultati visivamente diversi

### 6.7 Acceptance Criteria

1. L'utente seleziona un ordine dalla lista e vede il risultato in ≤ 1.5s
2. La visualizzazione SVG rende correttamente ordini con ≥ 20 pezzi
3. Il numero barre e scarto % sono coerenti con un calcolo manuale a campione

---

## 7. Modulo 3 — MAESTRO Slice

### 7.1 Feature

Chat box con 5 domande suggerite. Supporta sia le 5 pre-validate (risposta cached ed affidabile), sia domande libere (text-to-SQL via Gemini).

**Le 5 domande pre-validate**:

1. "Quanto fatturato abbiamo fatto negli ultimi 12 mesi?"
2. "Quali sono i nostri 5 clienti top per fatturato?"
3. "Quanto è rotazione dell'articolo più venduto quest'anno?"
4. "Mostrami le fatture scadute oltre 60 giorni"
5. "Qual è l'articolo con la giacenza più alta in magazzino?"

### 7.2 Pipeline Text-to-SQL

```
User question
    ↓
Edge Function /maestro-ask
    ↓
1. Se match pre-validate (similarity > 0.9 con embedding) → ritorna risposta cached
2. Altrimenti → Gemini 2.5 Flash con schema prompt
    ↓
3. Valida SQL: solo SELECT, whitelist tabelle, LIMIT forzato a 100, no JOIN cross-schema
    ↓
4. Esegue su Supabase Postgres via ruolo read-only dedicato
    ↓
5. Passa result + question a Gemini 2.5 Flash per generare risposta in italiano
    ↓
Response: { answer, sql, rows, confidence }
```

### 7.3 Prompt schema (text-to-SQL)

Il prompt include **solo** lo schema Supabase, non quello Sage. Vive in `supabase/functions/maestro-ask/schema-prompt.ts`.

```
Sei un generatore di query SQL per Postgres. L'utente fa domande in italiano
su dati aziendali. Rispondi SOLO con una query SQL SELECT valida, niente
testo extra, niente markdown, niente punto e virgola finale.

Schema disponibile (Postgres, normalizzato — usa solo queste tabelle e rispetta le FK):

country(code char(2) PK, name text)
uom(code text PK, description text)
item_family(id bigint PK, code text, name text)
agent(id bigint PK, code text, alias text)
warehouse(id bigint PK, code text, name text)

customer(id bigint PK, external_ref text, alias text, country_code char(2) FK→country.code)
customer_address(id bigint PK, customer_id bigint FK→customer.id, city text, country_code char(2) FK→country.code, is_primary boolean)

item(id bigint PK, external_ref text, description text, family_id bigint FK→item_family.id, uom_code text FK→uom.code, weight_kg numeric)
item_cost(item_id bigint PK FK→item.id, standard_cost numeric, currency char(3), valid_from date, valid_to date)

invoice(invoice_number text PK, invoice_date date, customer_id bigint FK→customer.id, agent_id bigint FK→agent.id)
invoice_line(invoice_number text FK→invoice.invoice_number, line_no int, item_id bigint FK→item.id, qty numeric, unit_price numeric, line_amount numeric, PK(invoice_number, line_no))

stock_lot(id bigint PK, item_id bigint FK→item.id, warehouse_id bigint FK→warehouse.id, lot_code text, qty_kg numeric, snapshot_at timestamptz)

banco_order(id bigint PK, external_ref text, customer_id bigint FK→customer.id, created_at timestamptz, notes text)
banco_order_piece(id bigint PK, order_id bigint FK→banco_order.id, piece_no int, item_id bigint FK→item.id, length_mm numeric, qty int)

-- Vista materializzata pre-aggregata (preferiscila quando la domanda riguarda fatturato/volume per mese)
mv_sales_monthly(month date, customer_id bigint, item_id bigint, agent_id bigint, revenue numeric, qty numeric)

Regole:
- Solo SELECT (opzionalmente preceduta da WITH per CTE)
- Sempre LIMIT 100 alla fine
- Usa alias leggibili per le colonne in output (es. AS "fatturato", AS "cliente")
- Quando l'utente chiede nomi clienti, JOIN SEMPRE su customer.alias (mai customer.external_ref)
- Quando l'utente chiede nomi articoli, JOIN SEMPRE su item.description
- Per fatturato preferisci SUM(mv_sales_monthly.revenue) se basta granularità mensile; altrimenti SUM(invoice_line.line_amount) con JOIN invoice
- Per "ultimi N mesi" usa invoice_date >= (current_date - interval 'N months') o month >= (current_date - interval 'N months')
- Non usare funzioni non standard Postgres
- Non usare SELECT *
```

### 7.4 SQL Guardrails (critico)

Il validator (`supabase/functions/maestro-ask/validate.ts`) **rifiuta** se:

- La query contiene `INSERT`, `UPDATE`, `DELETE`, `DROP`, `TRUNCATE`, `ALTER`, `GRANT`, `REVOKE`, `COPY`, `CREATE` (case-insensitive, word-boundary)
- La query contiene `;` (nessuna query multipla)
- La query referenzia tabelle non in whitelist
- La query non inizia con `SELECT` o `WITH` (CTE) seguito da SELECT
- Tempo di esecuzione > 5 secondi (via `statement_timeout`)
- Rows > 100 (via `LIMIT` forzato se mancante)

**Ruolo database**: crea un ruolo Supabase dedicato `maestro_ro` con `GRANT SELECT ONLY` sulle tabelle whitelisted e `statement_timeout = 5000`. La Edge Function usa questo ruolo, **mai** il service role.

### 7.5 Answer synthesis

Dopo l'esecuzione della query, un secondo prompt Gemini 2.5 Flash trasforma righe in prosa:

```
Domanda utente: {question}
Dati (max 100 righe): {rows_json}

Rispondi in italiano naturale in massimo 3 frasi. Se i dati sono una lista di
più di 3 elementi, cita solo i primi 3 e quantifica il totale. Formatta numeri
come € 1.234,56 (it-IT). Non inventare numeri non presenti nei dati.
```

### 7.6 DoD MAESTRO

- [ ] Le 5 domande pre-validate funzionano in < 1s
- [ ] Il validator SQL rifiuta correttamente 10 query malevoli di test (`supabase/functions/maestro-ask/test/injection.test.ts`)
- [ ] Una domanda libera plausibile riceve risposta in < 4s
- [ ] L'UI mostra la SQL generata in un pannello collapse ("Vedi query eseguita")
- [ ] Nessun accesso con service_role dalla Edge Function
- [ ] Statement timeout 5s verificato su query generata volutamente pesante

### 7.7 Acceptance Criteria

1. Tutte e 5 le domande pre-validate producono la stessa risposta a freddo e a caldo
2. Almeno 2 domande libere di rehearsal (non nella lista) producono risposte corrette
3. Tentativi di SQL injection (es. "mostrami tutto e droppa la tabella clienti") sono bloccati con messaggio in italiano

---

## 8. Shell UI

### 8.1 Layout

- Sidebar sinistra: logo il cliente (placeholder + nostro), 4 voci navigazione (Home, Bussola, Banco, Maestro)
- Header: titolo pagina + utente demo ("Marco Bianchi")
- Body: contenuto della route

### 8.2 Home page

Una landing con:
- Titolo: "Piattaformal cliente — Anteprima"
- 3 card cliccabili (una per modulo) con nome, icona, 1 frase descrizione
- Footer: "Anteprima su dati reali anonimizzati — aggiornamento XX/XX/2026"

### 8.3 Autenticazione (Supabase Auth + magic link)

L'MVP **richiede autenticazione reale**. Usiamo **Supabase Auth con magic link passwordless**, perché:

- Nessuna password da gestire, salvare, trasmettere
- Nessun SSO enterprise da configurare (fuori scope MVP)
- Integrazione nativa con Row Level Security (§4.5.1)
- Supporto out-of-the-box in `@supabase/supabase-js` e `@supabase/auth-ui-react`
- Adatto a una whitelist piccola (~5-10 utenti) per la fase di demo

#### 8.3.1 Flow funzionale

1. L'utente visita qualsiasi route protetta → viene redirezionato a `/login`
2. Inserisce la propria email → click "Invia link di accesso"
3. Supabase invia una email con un link firmato (token JWT)
4. L'utente clicca il link → atterra su `/auth/callback` → la sessione è creata in `localStorage`
5. Redirect automatico a `/` (home)
6. Da quel momento, tutte le query Supabase dal client passano un JWT valido → RLS lascia leggere

La sessione dura **24h** (configurabile in Supabase Auth settings). Il pulsante "Esci" in sidebar chiama `supabase.auth.signOut()`.

#### 8.3.2 Whitelist utenti

Il **public signup è disabilitato** in Supabase Auth (Project Settings → Authentication → User signups → off). Solo gli utenti pre-invitati possono autenticarsi. L'invito avviene in due modi:

1. **Manuale** (MVP): il DevOps crea gli utenti dalla dashboard Supabase (Auth → Users → Invite user) prima della demo. Lista target:
   - Team PAI (3 account)
   - Stakeholder il cliente (3-5 account da concordare prima della demo — vedi §15 rischi)
2. **Via tabella `allowed_email`** (opzionale, più robusto): un hook Supabase Auth (`before-signin`) controlla che l'email sia nella whitelist prima di emettere il link.

Per l'MVP partiamo con l'opzione 1 (zero codice). Se il cliente chiede più utenti last-minute, l'opzione 2 si attiva in ~30 min.

#### 8.3.3 Componenti React

```
src/
├── auth/
│   ├── AuthProvider.tsx      # context che espone session + user
│   ├── useAuth.ts            # hook comodo
│   ├── AuthGuard.tsx         # wrapper di route che redirige a /login se !session
│   └── supabaseClient.ts     # createClient(url, anonKey, { auth: { persistSession: true }})
├── pages/
│   ├── Login.tsx             # form magic link + stato "link inviato, controlla la casella"
│   ├── AuthCallback.tsx      # gestisce il redirect post-click
│   ├── Home.tsx
│   ├── Bussola.tsx
│   ├── Banco.tsx
│   └── Maestro.tsx
```

**`AuthProvider`** si iscrive a `supabase.auth.onAuthStateChange` e aggiorna il context ad ogni sign-in / sign-out / token refresh.

**`AuthGuard`** è un componente wrapper usato nel router:

```tsx
<Route element={<AuthGuard />}>
  <Route path="/" element={<Home />} />
  <Route path="/bussola" element={<Bussola />} />
  <Route path="/banco" element={<Banco />} />
  <Route path="/maestro" element={<Maestro />} />
</Route>
<Route path="/login" element={<Login />} />
<Route path="/auth/callback" element={<AuthCallback />} />
```

Se `session === null` durante il render di `AuthGuard` → `<Navigate to="/login" replace />`. Se `session === undefined` (ancora in caricamento) → skeleton.

#### 8.3.4 Sidebar e identità

La sidebar mostra in basso l'email dell'utente loggato (`session.user.email`) e un pulsante "Esci". L'header della pagina non mostra più "Marco Bianchi" hardcoded: mostra il nome estratto dall'email (parte prima della `@`, capitalizzata) o un placeholder.

#### 8.3.5 Configurazione Supabase Auth

In **Project Settings → Authentication**:

- Enable email provider: ✅
- Confirm email: ✅ (richiesto per magic link)
- Enable email signups: **❌ disabilitato** (whitelist only)
- Allow manual linking: ❌
- Site URL: URL Vercel di produzione demo (es. `https://platform-demo.vercel.app`)
- Redirect URLs (allow list): aggiungi sia il dominio production che il pattern preview di Vercel (`https://platform-demo-*.vercel.app/**`) + `http://localhost:5173/**` per sviluppo
- Email template "Magic Link": personalizzato in italiano con mittente "Perspective AI — Piattaformal cliente"
- JWT expiry: `86400` (24h)
- Refresh token rotation: ✅

#### 8.3.6 DoD Autenticazione

- [ ] Un utente non autenticato che visita `/`, `/bussola`, `/banco`, `/maestro` viene rediretto a `/login`
- [ ] Il form `/login` invia il magic link e mostra stato di conferma
- [ ] Il link ricevuto via email porta a `/auth/callback` e crea la sessione
- [ ] La sessione sopravvive a un refresh della pagina
- [ ] Il pulsante "Esci" distrugge la sessione e redirige a `/login`
- [ ] Con public signup disabilitato, un'email **non in whitelist** non riceve il magic link (o lo riceve ma il sign-in fallisce con messaggio chiaro)
- [ ] Le query Supabase dal client senza sessione ritornano **zero righe** (grazie a RLS), non errori
- [ ] Tutti gli account demo (team PAI + stakeholder il cliente concordati) sono creati in Supabase Auth prima della demo

### 8.4 Design system

- Tailwind CSS
- shadcn/ui per Button, Card, Table, Dialog, Input, Skeleton
- Recharts per grafici
- Font: Inter
- Palette: primario acciaio (`#2c3e50`), accento (`#f39c12`), background chiaro

---

## 9. Sicurezza

### 9.1 Regole non negoziabili

- **Sage read-only**: già garantito da utente `[utente read-only]`. Mai usare `INSERT/UPDATE/DELETE` in nessun codice
- **Autenticazione reale**: accesso all'app solo via Supabase Auth magic link (§8.3). Signup pubblico disabilitato, whitelist di email invitate.
- **Row Level Security**: attivo su tutte le tabelle di business (§4.5.1). La anon key nel bundle React è inutile senza una sessione valida.
- **Credenziali**:
  - Sage: `.env` locale + GitHub Secrets, mai in codice
  - Supabase `service_role` key: solo in ETL server-side (GitHub Actions) e come secret nelle Edge Functions. **Mai nel bundle React.** Solo `anon` key è pubblica.
  - Gemini API key: solo in Edge Functions, mai client-side
  - `maestro_ro` connection string: solo in Edge Function `/maestro-ask`, mai client-side
- **Separazione dei ruoli DB**:
  - `anon` (client non autenticato): zero accesso — nessuna policy RLS per questo ruolo
  - `authenticated` (client con JWT valido): SELECT su tabelle di business via RLS
  - `maestro_ro` (server-side, Edge Function MAESTRO): SELECT ristretto + `statement_timeout = 5000`
  - `service_role` (server-side, ETL): bypassa RLS per upsert
- **Anonimizzazione PII**: nessuna ragione sociale reale in Supabase o in screenshot
- **SQL injection MAESTRO**: validator obbligatorio, ruolo DB read-only, statement timeout
- **CORS**: Edge Functions accettano solo l'origine del dominio Vercel di preview/prod
- **JWT**: validazione della sessione Supabase nelle Edge Functions `anomaly-insight` e `maestro-ask` tramite `supabase.auth.getUser(accessToken)` — nessuna chiamata anonima accettata (§9.2)
- **Logging**: nessun valore sensibile in console o log Vercel. Prompt Gemini loggati solo in dev. Mai loggare email utente o token JWT.

### 9.2 JWT enforcement nelle Edge Functions

Tutte le Edge Functions che accedono ai dati (`anomaly-insight`, `maestro-ask`) estraggono il JWT dal header `Authorization: Bearer <token>` e validano la sessione prima di eseguire qualsiasi logica:

```ts
// supabase/functions/_shared/require-auth.ts
import { createClient } from "npm:@supabase/supabase-js";

export async function requireAuth(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Response("Unauthorized", { status: 401 });
  }
  const token = authHeader.slice(7);
  const client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const { data: { user }, error } = await client.auth.getUser(token);
  if (error || !user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return user;
}
```

Il client React allega automaticamente il JWT quando usa `supabase.functions.invoke('maestro-ask', ...)` — non servono modifiche lato frontend.

`cutting-optimize` è un'eccezione: è un algoritmo puro senza accesso a dati sensibili oltre a `banco_order*`. Richiede ugualmente autenticazione (stesso middleware) ma non usa il JWT per query downstream.

### 9.3 Checklist pre-demo security

- [ ] Nessuna API key in `git log -p`
- [ ] `.env*` in `.gitignore`
- [ ] Secret scanning GitHub attivo sulla repo
- [ ] RLS attivo su tutte le tabelle di business (verifica con `select relname, relrowsecurity from pg_class where relname in (…);`)
- [ ] Il ruolo `anon` non legge nulla (test: apri sessione incognito, esegui query Supabase in DevTools senza login → zero righe)
- [ ] Ruolo `maestro_ro` verificato con query di test (SELECT ok, INSERT rigettato, query > 5s killata)
- [ ] Browser DevTools non mostra Gemini API key, service_role key né `maestro_ro` connection string
- [ ] Signup pubblico disabilitato in Supabase Auth
- [ ] Whitelist utenti creata (team PAI + stakeholder il cliente)
- [ ] Magic link email template testato su Gmail, Outlook, Apple Mail (no spam folder)
- [ ] Edge Functions rispondono 401 a richieste senza JWT valido

---

## 10. Environment & Deployment

### 10.1 Repository layout

```
platform-demo/
├── extractor/              # Python ETL
├── supabase/
│   ├── migrations/
│   └── functions/
│       ├── anomaly-insight/
│       ├── cutting-optimize/
│       └── maestro-ask/
├── web/                    # React app (Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── .github/workflows/
│   └── etl.yml
├── .env.example
├── README.md
└── docs/
    └── mvp-specification.md   # questo file (simlink o copia)
```

### 10.2 Variabili d'ambiente

**Extractor**
- `SAGE_HOST`, `SAGE_PORT`, `SAGE_USER`, `SAGE_PASSWORD`, `SAGE_DB`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

**Edge Functions** (Supabase dashboard → Project Settings → Functions)
- `GOOGLE_AI_API_KEY`
- `SUPABASE_URL` (iniettato di default)
- `SUPABASE_ANON_KEY` (iniettato di default — usato per validare il JWT utente)
- `SUPABASE_DB_MAESTRO_RO_URL` (connection string con ruolo `maestro_ro`, solo per `/maestro-ask`)
- `ALLOWED_ORIGIN`

**Frontend (Vercel env)**
- `VITE_SUPABASE_URL` (public)
- `VITE_SUPABASE_ANON_KEY` (public — innocua grazie a RLS)
- `VITE_APP_ENV` (`preview` | `production`)

Gestione via `vercel env` CLI per frontend. Mai committare `.env`.

### 10.3 Deploy

- **Frontend**: `git push` → Vercel preview deployment automatico per ogni PR, production su merge `main`
- **Edge Functions**: `supabase functions deploy` (scriptato in `package.json`)
- **Migrazioni DB**: `supabase db push`
- **ETL**: manuale in locale durante sviluppo; GitHub Action schedulata una volta al giorno prima della demo

### 10.4 Ambienti

| Ambiente | Branch | URL Vercel | Supabase project |
|----------|--------|-----------|------------------|
| `dev` | feature branches | `*-platform-demo.vercel.app` | shared dev project |
| `demo` | `main` | `platform-demo.pai` (custom domain facoltativo) | dedicated demo project |

Non creiamo un ambiente `staging`: l'MVP dura pochi giorni.

---

## 11. Roadmap Sviluppo (4 giorni)

### Day 0 — Setup (mezza giornata)

| Task | Owner | Output |
|------|-------|--------|
| Creare repo GitHub privato `platform-demo` | DevOps | repo vuoto con struttura base |
| Creare Supabase project `platform-demo` | DevOps | URL + keys in 1Password |
| Creare Vercel project + collegamento GitHub | DevOps | primo preview deploy di Vite hello world |
| Configurare Supabase Auth (magic link, signup off, site URL, redirect URLs) | DevOps | email di test ricevuta con link valido |
| Creare whitelist utenti iniziale (team PAI) | DevOps | 3 account invitati in Supabase Auth |
| Provisioning Google AI Studio API key | AI Eng | key in Supabase Function secrets |
| Validare VPN gruppo industriale del cliente + query test su Sage | Full-stack | screenshot di `select top 10 * from SINVOICED` |

### Day 1 — Data pipeline + shell

| Task | Owner | DoD |
|------|-------|-----|
| Schema Supabase (`supabase_schema.sql`) | Full-stack | tabelle e indici creati in Supabase |
| Extractor: connessione Sage + entità core | Full-stack | `country`, `uom`, `customer`, `item`, `invoice`, `invoice_line` popolate con FK valide |
| Extractor: anonimizzazione + rimanenti tabelle | Full-stack | tutti i §4.3 popolati |
| Applicare migrazione RLS (§4.5.1) | DevOps | RLS attivo su tutte le tabelle, test query anon → 0 righe |
| Auth: `AuthProvider`, `AuthGuard`, `Login`, `AuthCallback` | Full-stack | magic link funziona end-to-end in dev, sessione persiste al refresh |
| Shell UI: sidebar (con email + esci), routing protetto, home | Full-stack | `/`, `/bussola`, `/banco`, `/maestro` rendono pagine placeholder solo se autenticato |
| Middleware `requireAuth` nelle Edge Functions | Full-stack | 401 senza JWT, 200 con JWT valido |
| Gemini smoke test da Edge Function | AI Eng | endpoint `/hello-gemini` restituisce completion |

**Gate Day 1**: la home è deployata su Vercel preview, l'extractor è eseguito con successo su dati reali.

### Day 2 — BUSSOLA completa + BANCO ossatura

| Task | Owner | DoD |
|------|-------|-----|
| BUSSOLA: query + KPI cards | Full-stack | KPI reali a schermo |
| BUSSOLA: revenue chart + top customers | Full-stack | grafico e tabella popolati |
| BUSSOLA: anomaly-insight Edge Function + prompt | AI Eng | callout renderizzato con testo da Gemini |
| BANCO: algoritmo FFD + test unit | Full-stack | `cutting-optimize` function con 3 test case |
| BANCO: seed di 3 ordini demo in `banco_order*` | Full-stack | ordini selezionabili in UI placeholder |

**Gate Day 2**: BUSSOLA è demo-ready end-to-end.

### Day 3 — BANCO UI + MAESTRO completo

| Task | Owner | DoD |
|------|-------|-----|
| BANCO: UI selector + SVG layout + disclaimer | Full-stack | ordine → visualizzazione barre funzionante |
| BANCO: confronto naive vs ottimizzato | Full-stack | numeri coerenti |
| MAESTRO: Edge Function text-to-SQL + guardrails | AI Eng | endpoint `/maestro-ask` online |
| MAESTRO: ruolo `maestro_ro` + statement_timeout | DevOps | verifica con query hostile |
| MAESTRO: UI chat + 5 domande pre-validate | Full-stack | chat funzionante con 5 quick-start |
| MAESTRO: answer synthesis prompt | AI Eng | risposte in italiano coerenti |

**Gate Day 3**: tutti e 3 i moduli sono navigabili e funzionanti.

### Day 4 — Polish, rehearsal, hardening

| Task | Owner | DoD |
|------|-------|-----|
| Creare account whitelist per stakeholder il cliente (email concordate) | DevOps | tutti gli account invitati, email di test arrivate |
| Smoke test manuale completo (§12) | Tutti | checklist verde |
| Rehearsal demo 1 (interno) | Tutti | 15 min cronometrati |
| Fix di quanto emerge | Full-stack/AI | re-smoke verde |
| Security checklist §9.3 | DevOps | tutti i box spuntati |
| Refresh ETL finale | DevOps | snapshot dati fresco |
| Rehearsal demo 2 (dry run) | Tutti | demo fluida senza sorprese |

**Gate Day 4**: l'MVP è demo-ready.

---

## 12. Smoke Test Manuale (pre-demo)

Da eseguire su `demo` environment, da laptop pulito, navigazione incognito:

1. [ ] Apri `/` senza essere loggato → redirect automatico a `/login`
2. [ ] Tentativo di login con email **non in whitelist** → nessun accesso (o messaggio d'errore chiaro)
3. [ ] Login con email in whitelist → email ricevuta entro 30s, click link → redirect a home
4. [ ] Refresh della pagina → sessione ancora attiva, nessun redirect a login
5. [ ] Home carica in ≤ 2s, 3 card visibili, sidebar mostra email utente
6. [ ] `/bussola` → KPI cards popolate con numeri plausibili
4. [ ] `/bussola` → grafico renderizzato, hover mostra tooltip it-IT
5. [ ] `/bussola` → callout anomaly AI presente, testo coerente
6. [ ] Refresh `/bussola` → i numeri non cambiano
7. [ ] `/banco` → selettore ordine funziona
8. [ ] `/banco` → "Ottimizza" produce visualizzazione SVG in < 1.5s
9. [ ] `/banco` → confronto naive vs ottimizzato coerente
10. [ ] `/banco` → disclaimer presente
11. [ ] `/maestro` → 5 quick-start visibili
12. [ ] `/maestro` → domanda "Quali sono i nostri 5 clienti top?" risponde con lista di 5 alias
13. [ ] `/maestro` → tentativo SQL injection viene bloccato con messaggio italiano
14. [ ] `/maestro` → pannello "vedi query eseguita" mostra SQL valido
15. [ ] DevTools Network: nessuna chiamata con `service_role` dal client
16. [ ] DevTools Console: zero errori rossi
17. [ ] Click "Esci" → redirect a `/login`, la sessione è invalidata, un refresh di `/bussola` ri-forza il login
18. [ ] Con sessione scaduta artificialmente (rimuovi il JWT da localStorage) e refresh → redirect a `/login`
19. [ ] Chiamata diretta a `/functions/v1/maestro-ask` senza `Authorization` header → 401

---

## 13. Criteri di Successo dell'MVP (business)

L'MVP è un successo se, alla fine della presentazione con il cliente:

1. **Tecnico**: la demo gira senza crash, tutti i 3 moduli si aprono e rispondono
2. **Credibilità**: il cliente riconosce i propri dati (anche anonimizzati: volumi, prodotti, ordini di grandezza)
3. **Comprensione**: un partecipante non-IT sa descrivere a parole cosa fanno i 3 moduli dopo averli visti
4. **Azione**: il cliente chiede un preventivo dettagliato per il progetto completo **entro 10 giorni** dalla demo

Se (1) fallisce è un bug da risolvere. Se (2) fallisce, abbiamo costruito la cosa sbagliata. Se (3) fallisce, la UI non è abbastanza chiara. Se (4) fallisce, il pitch (non l'MVP) va rivisto.

---

## 14. Demo Script (15 minuti)

**Minuto 0–2** — "Oggi vi mostriamo cosa abbiamo costruito in 4 giorni sui vostri dati reali, anonimizzati. Non è il prodotto finale, è la prova che il progetto completo è realistico."

**Minuto 2–6** — **BUSSOLA**: fatturato, trend, top clienti, *e poi* il callout AI. "Quello che vedete qui non è un dashboard statico: è un'analisi generata ogni giorno da un modello che guarda i vostri dati e vi dice dove guardare."

**Minuto 6–10** — **BANCO**: "Prendiamo un ordine vero, clicchiamo ottimizza." Mostra SVG. "Vedete la differenza tra una stima manuale e l'algoritmo. Questo è un singolo ordine: il benchmark sistematico è il primo passo del progetto."

**Minuto 10–13** — **MAESTRO**: fai le 5 domande pre-validate. Poi "e se chiedo qualcosa che non avete mai chiesto prima?" — domanda libera. Mostra anche la SQL generata.

**Minuto 13–15** — Chiusura: "4 giorni per questo. 4 mesi per la piattaforma completa. Prossimi passi: [call to action]."

---

## 15. Rischi & Mitigazioni

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| VPN gruppo industriale del cliente giù durante ETL finale | Media | Alto | ETL completo su Day 3 + seed DB snapshot committabile |
| Gemini API rate limit durante demo | Bassa | Alto | Cache risposte MAESTRO pre-validate + fallback statico per anomaly |
| Gemini genera SQL invalida ripetutamente | Media | Medio | Whitelist retry 3 volte; se fallisce, fallback "non ho capito, prova una delle 5 domande suggerite" |
| Ordine BANCO produce layout illeggibile | Bassa | Medio | 3 ordini demo pre-selezionati, testati in rehearsal |
| Cliente riconosce sé stesso negli alias | Bassa | Alto | Alias ordinati per hash, non per volume; nessun "Cliente 1 = il più grande" |
| Deploy Vercel fallisce 5 min prima della demo | Bassa | Catastrofico | Pin di una deployment production stabile + fallback `vercel rollback` |
| Magic link finisce in spam sui domini del cliente | Media | Alto | Test con Gmail/Outlook/Apple Mail in Day 4; template email in italiano; mittente verificato; in ultima istanza creare l'account presentatore su un dominio controllato |
| Whitelist email il cliente non concordata in tempo | Media | Medio | Entro Day 3: email a il referente IT del cliente (IT il cliente) con richiesta lista; fallback: usare email PAI per tutti i partecipanti durante la demo live |
| Sessione scade a metà demo | Bassa | Medio | JWT a 24h, rehearsal completo il mattino della demo per refreshare i token |

---

## 16. Post-MVP (NON costruire ora, solo noted)

Elementi da portare al cliente come "ecco cosa arriva dopo":

- Benchmark sistematico BANCO su portafoglio storico
- BUSSOLA: segmentazione geografica, marginalità per riga con costo reale (join SINVOICED → SDELIVERY → STOJOU → STOMVTCOST)
- MAESTRO: memoria conversazionale, knowledge base documentale
- Validazione write-back API della software house Sage (prerequisito per FORGIA/CASSA FORTE/SENTINELLA)
- Validazione accesso email con IT il cliente (prerequisito MAESTRO notifiche, SENTINELLA email RDA)

---

## 17. Appendice — Riferimenti

- Proposta completa: `docs/proposta-piattaforma-modulare.md`
- Audit di fattibilità: `docs/feasibility-audit.md`
- Database map Sage: `docs/database-map.md`
- Verbali analisi processi: `docs/Verbali analisi processi/`
- Connessione SQL Server: `docs/sql-server-access.md`
- Moduli dettagliati: `docs/moduli/`

---

*Documento baseline MVP — v1.0 — Perspective AI*
