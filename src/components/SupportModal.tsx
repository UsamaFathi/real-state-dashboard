import React from 'react';
import { X, CheckCircle2, LifeBuoy, Server, Cpu, Moon, Sun } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
  onToggleDark?: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  isDark = false,
  onToggleDark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">UF Real Estate OS Support</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise Help, SLA & Diagnostics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Status block */}
          <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-emerald-900 dark:text-emerald-200">All Clusters Operational</div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                Pricing engine, transaction event bus, and audit ledger are running with 99.99% uptime.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                <span>Cluster Latency</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">18ms</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Regional Edge Node EU-WEST</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                <span>Rule Engine Load</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">14.2%</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Auto-scaling dynamic tier</div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Keyboard Shortcuts & Theme
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-600 dark:text-slate-300">Global Command Bar</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                  ⌘K
                </kbd>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-600 dark:text-slate-300">Toggle Dark Mode</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                  ⌘D
                </kbd>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-600 dark:text-slate-300">New Record Dialog</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                  ⌘N
                </kbd>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-600 dark:text-slate-300">Close Dialogs</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                  Esc
                </kbd>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-semibold text-blue-900 dark:text-blue-200">Dedicated Enterprise Concierge</div>
              <div className="text-[11px] text-blue-700 dark:text-blue-300">Priority 24/7 SLA escalation available</div>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs transition shadow-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
