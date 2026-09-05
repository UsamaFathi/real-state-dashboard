import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Sparkles } from 'lucide-react';

interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  variant?: 'pill' | 'button' | 'compact';
  className?: string;
  showLabel?: boolean;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  isDark,
  onToggle,
  variant = 'pill',
  className = '',
  showLabel = true,
}) => {
  if (variant === 'button') {
    return (
      <motion.button
        id="dark-mode-toggle-button"
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        title={isDark ? 'Switch to Light Mode (⌘D)' : 'Switch to Dark Mode (⌘D)'}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={`relative p-2 rounded-lg transition-colors border flex items-center justify-center overflow-hidden group ${
          isDark
            ? 'bg-slate-800/90 text-amber-300 border-slate-700 hover:bg-slate-700 hover:text-amber-200 shadow-sm'
            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80 hover:text-slate-900 shadow-2xs'
        } ${className}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon-icon"
              initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="flex items-center justify-center"
            >
              <Moon className="w-4 h-4 text-amber-300 fill-amber-300/20 drop-shadow-[0_0_8px_rgba(252,211,77,0.3)]" />
            </motion.div>
          ) : (
            <motion.div
              key="sun-icon"
              initial={{ rotate: 90, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="flex items-center justify-center"
            >
              <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  // Segmented Pill with fluid animated thumb & morphing icons
  return (
    <div
      className={`inline-flex items-center gap-1.5 p-1 rounded-full border transition-colors select-none ${
        isDark
          ? 'bg-slate-900/90 border-slate-700/80 shadow-inner'
          : 'bg-slate-100/90 border-slate-200/90 shadow-inner'
      } ${className}`}
    >
      {/* Light Option Button */}
      <button
        type="button"
        id="theme-toggle-light"
        onClick={() => {
          if (isDark) onToggle();
        }}
        aria-pressed={!isDark}
        className={`relative px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer z-10 ${
          !isDark ? 'text-slate-900 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {!isDark && (
          <motion.div
            layoutId="theme-active-pill"
            className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/80"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1">
          <motion.span
            animate={{ rotate: !isDark ? [0, 15, -15, 0] : 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500' : 'text-slate-400'}`} />
          </motion.span>
          {showLabel && <span>Light</span>}
        </span>
      </button>

      {/* Dark Option Button */}
      <button
        type="button"
        id="theme-toggle-dark"
        onClick={() => {
          if (!isDark) onToggle();
        }}
        aria-pressed={isDark}
        className={`relative px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer z-10 ${
          isDark ? 'text-white font-semibold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {isDark && (
          <motion.div
            layoutId="theme-active-pill"
            className="absolute inset-0 bg-slate-800 rounded-full shadow-sm border border-slate-600/70"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1">
          <motion.span
            animate={{ scale: isDark ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-amber-300 fill-amber-300/20' : 'text-slate-400'}`} />
          </motion.span>
          {showLabel && <span>Dark</span>}
        </span>
      </button>
    </div>
  );
};
