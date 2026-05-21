import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  ScanText,
  ShieldAlert,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  RotateCcw,
  Flame
} from 'lucide-react';

type Step = 'idle' | 'ocr' | 'detect' | 'mask' | 'done';

const PROGRESS_LABELS: Record<Exclude<Step, 'idle' | 'done'>, string> = {
  ocr: 'OCR — riconoscimento testo',
  detect: 'PII detect — ricerca dati personali',
  mask: 'Mascheramento automatico',
};

const DETECTED = [
  { id: 'client-name', label: 'Nome cliente', value: 'Officine Meccaniche Alpha', icon: FileText },
  { id: 'phone', label: 'Telefono', value: '+39 030 123456', icon: Phone },
  { id: 'email', label: 'Email', value: 'ufficio@officine-alpha.it', icon: Mail },
  { id: 'address', label: 'Indirizzo', value: 'Via della Pieve 17, [città cliente]', icon: MapPin },
];

export function Solution3Demo() {
  const [step, setStep] = useState<Step>('idle');
  const [progress, setProgress] = useState(0);

  const runPipeline = () => {
    setProgress(0);
    setStep('ocr');
    setTimeout(() => {
      setStep('detect');
      setProgress(33);
    }, 800);
    setTimeout(() => {
      setStep('mask');
      setProgress(66);
    }, 1600);
    setTimeout(() => {
      setStep('done');
      setProgress(100);
    }, 2400);
  };

  const reset = () => {
    setStep('idle');
    setProgress(0);
  };

  return (
    <div className="flex flex-col min-h-[650px] bg-[var(--color-dark-bg)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden shadow-2xl">
      <div className="flex items-center gap-3 px-6 py-4 bg-[var(--color-dark-surface)] border-b border-[var(--color-dark-border)]">
        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">FORGIA — Anonimizzazione disegni</h3>
          <p className="text-xs text-gray-400">OCR + NLP rimuovono i dati cliente prima dell\'invio al fornitore</p>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {step === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-2 border-dashed border-[var(--color-dark-border)] hover:border-[var(--color-accent)]/60 rounded-xl p-10 text-center cursor-pointer transition-colors"
            onClick={runPipeline}
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-white font-medium mb-1">Carica disegno tecnico (PDF)</p>
            <p className="text-xs text-gray-500 mb-4">Trascina il file qui o clicca per sfogliare — supporta PDF scansionati</p>
            <button className="px-5 py-2 bg-[var(--color-accent)] text-black font-semibold rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors">
              Simula upload DIS-2847.pdf
            </button>
          </motion.div>
        )}

        {step !== 'idle' && (
          <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-semibold">Pipeline di elaborazione</h4>
              <span className="text-xs text-gray-500 font-mono">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-dark-bg)] rounded-full overflow-hidden mb-4">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-[var(--color-accent)]"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(['ocr', 'detect', 'mask'] as const).map((s) => {
                const active = step === s;
                const done = step === 'done' || (step === 'mask' && s !== 'mask') || (step === 'detect' && s === 'ocr');
                return (
                  <div
                    key={s}
                    className={`p-3 rounded-lg border flex items-center gap-2 text-xs ${
                      active ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)] text-[var(--color-accent)]' :
                      done ? 'bg-[var(--color-dark-bg)] border-[var(--color-dark-border)] text-gray-300' :
                      'bg-[var(--color-dark-bg)] border-[var(--color-dark-border)] text-gray-500'
                    }`}
                  >
                    {done && !active ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : active ? <ScanText className="w-4 h-4 shrink-0 animate-pulse" /> : <ScanText className="w-4 h-4 shrink-0" />}
                    <span>{PROGRESS_LABELS[s]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 'done' && (
          <AnimatePresence>
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--color-dark-surface)] border border-red-500/40 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-red-500/10 border-b border-red-500/30">
                    <span className="text-sm font-semibold text-red-400 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Originale — dati sensibili
                    </span>
                    <span className="text-xs text-red-300 font-mono">DIS-2847.pdf</span>
                  </div>
                  <div className="p-5 bg-[var(--color-dark-bg)] font-mono text-xs text-gray-300 space-y-1.5">
                    <div>DISEGNO TECNICO — DIS-2847</div>
                    <div className="bg-red-500/30 px-1 rounded text-red-200">Cliente: Officine Meccaniche Alpha</div>
                    <div className="bg-red-500/30 px-1 rounded text-red-200">Tel: +39 030 123456 — ufficio@officine-alpha.it</div>
                    <div className="bg-red-500/30 px-1 rounded text-red-200">Via della Pieve 17, [città cliente]</div>
                    <div className="mt-3 text-gray-500">— — — specifiche tecniche — — —</div>
                    <div>Tubo quadro 80×80×6 mm, L=6000</div>
                    <div>Qualità acciaio: S235JR</div>
                    <div>Quantità: 24 pezzi</div>
                  </div>
                </div>

                <div className="bg-[var(--color-dark-surface)] border border-[var(--color-accent)]/40 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-accent)]/10 border-b border-[var(--color-accent)]/30">
                    <span className="text-sm font-semibold text-[var(--color-accent)] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Anonimizzato — pronto per fornitore
                    </span>
                    <span className="text-xs text-[var(--color-accent)] font-mono">DIS-2847-anon.pdf</span>
                  </div>
                  <div className="p-5 bg-[var(--color-dark-bg)] font-mono text-xs text-gray-300 space-y-1.5">
                    <div>DISEGNO TECNICO — DIS-2847</div>
                    <div className="bg-gray-700/60 px-1 rounded text-gray-500">████████████████████</div>
                    <div className="bg-gray-700/60 px-1 rounded text-gray-500">████████ — █████████</div>
                    <div className="bg-gray-700/60 px-1 rounded text-gray-500">█████████████</div>
                    <div className="mt-3 text-gray-500">— — — specifiche tecniche — — —</div>
                    <div>Tubo quadro 80×80×6 mm, L=6000</div>
                    <div>Qualità acciaio: S235JR</div>
                    <div>Quantità: 24 pezzi</div>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded-xl p-5">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Dati rilevati e mascherati
                </h4>
                <div className="space-y-2">
                  {DETECTED.map(d => (
                    <div key={d.id} className="flex items-center gap-3 p-2 rounded bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)]">
                      <d.icon className="w-4 h-4 text-gray-500 shrink-0" />
                      <span className="text-xs text-gray-400 w-28 shrink-0">{d.label}</span>
                      <span className="text-xs text-gray-300 font-mono flex-1 truncate">{d.value}</span>
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-xs text-yellow-200">
                  <strong>Anomalia:</strong> email rilevata nel margine destro del disegno (posizione non standard) — mascherata automaticamente.
                </div>
              </div>

              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Elabora un altro disegno
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
