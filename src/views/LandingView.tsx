/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export function LandingView({ onContinue }: { onContinue: () => void } & any) {
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onContinue();
    }
  };

  return (
    <motion.button
      type="button"
      onClick={onContinue}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen w-full flex items-center justify-center bg-[var(--color-dark-bg)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] cursor-pointer overflow-hidden"
      aria-label="Inizia il report dinamico Primario Player"
    >
      <div className="flex flex-col items-center text-center px-6 space-y-8 md:space-y-10">
        <motion.img
          src="/logo-mark.svg"
          alt=""
          aria-hidden="true"
          className="h-10 w-10 object-contain"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        />

        <div className="flex flex-col items-center space-y-5">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            Primario Player
          </motion.h1>

          <motion.div
            className="w-16 h-0.5 bg-[var(--color-accent)] origin-center"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          />

          <motion.p
            className="text-xl md:text-2xl uppercase tracking-[0.3em] text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            Report Dinamico
          </motion.p>
        </div>

        <motion.p
          className="text-sm uppercase tracking-wider text-[var(--color-accent)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
        >
          Aprile 2026
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="uppercase tracking-wider">Powered by</span>
          <img src="/logo-pai.svg" alt="Perspective AI" className="h-6 object-contain" />
        </div>

        <div className="flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs uppercase tracking-widest">Clicca per iniziare</span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </motion.div>
    </motion.button>
  );
}
