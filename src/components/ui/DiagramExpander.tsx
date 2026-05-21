import React, { useEffect, useState } from 'react';
import { Expand, X, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DiagramExpanderProps {
  src: string;
  title: string;
  caption: string;
  mvpIdea: string;
}

export function DiagramExpander({ src, title, caption, mvpIdea }: DiagramExpanderProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group w-full text-left bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] hover:border-[var(--color-accent)] rounded-xl overflow-hidden transition-colors"
      >
        <div className="bg-[var(--color-dark-bg)] p-4 flex items-center justify-center border-b border-[var(--color-dark-border)]">
          <img
            src={src}
            alt={title}
            className="max-h-64 w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
        </div>
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{title}</h4>
            <p className="text-xs text-gray-400 truncate">{caption}</p>
          </div>
          <div className="shrink-0 p-2 rounded-lg bg-[var(--color-dark-bg)] text-gray-400 border border-[var(--color-dark-border)] group-hover:text-[var(--color-accent)] group-hover:border-[var(--color-accent)] transition-colors">
            <Expand className="w-4 h-4" />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="relative w-full max-w-6xl max-h-[90vh] bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between gap-4 p-5 border-b border-[var(--color-dark-border)]">
                <div>
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <p className="text-sm text-gray-400">{caption}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Chiudi"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="p-6 bg-[var(--color-dark-bg)] flex items-center justify-center">
                  <img src={src} alt={title} className="max-w-full max-h-[60vh] object-contain" />
                </div>

                <div className="p-6 border-t border-[var(--color-dark-border)]">
                  <div className="flex items-start gap-3 bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 rounded-lg p-4">
                    <div className="p-2 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] shrink-0">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1 uppercase tracking-wider">L'idea</h4>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{mvpIdea}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
