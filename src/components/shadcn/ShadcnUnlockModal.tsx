import React from 'react';
import { Sparkles, Check, X, Zap, Shield, Layers, Code, Award } from 'lucide-react';

interface ShadcnUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast?: (msg: string) => void;
}

export const ShadcnUnlockModal: React.FC<ShadcnUnlockModalProps> = ({
  isOpen,
  onClose,
  onToast,
}) => {
  if (!isOpen) return null;

  const features = [
    'All 14+ Premium Dashboards (Real Estate, Hotel, CRM, E-commerce, etc.)',
    '350+ Production-Ready Shadcn UI Kit React Components',
    'Unlimited projects with lifetime updates and zero subscription lock-in',
    'Figma source files, vector token assets & Tailwind design system',
    'Full TypeScript type safety & accessible Radix UI primitives',
    'Priority Discord VIP support & architecture blueprints',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="unlock-pro-modal"
        className="relative w-full max-w-lg bg-white dark:bg-[#13151f] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 overflow-hidden"
      >
        {/* Decorative subtle background gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Shadcn UI Kit Pro
            </span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Unlock Everything
            </h3>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Get instant access to all premium dashboards, templates, and UI components. Pay once, use forever in unlimited personal & commercial projects.
        </p>

        {/* Value List */}
        <div className="space-y-2.5 mb-6">
          {features.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-200">
              <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">$149</span>
              <span className="text-xs text-gray-400 line-through">$299</span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 ml-1">50% OFF</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">One-time payment • Lifetime access</p>
          </div>

          <button
            onClick={() => {
              onToast?.('🎉 Pro Access Activated! Full suite unlocked.');
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-gray-950 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Get Full Access
          </button>
        </div>
      </div>
    </div>
  );
};
