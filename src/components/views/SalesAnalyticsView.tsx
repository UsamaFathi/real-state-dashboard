import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Award, Target, ArrowUpRight } from 'lucide-react';

interface SalesAnalyticsViewProps {
  onToast: (msg: string) => void;
}

export const SalesAnalyticsView: React.FC<SalesAnalyticsViewProps> = ({ onToast }) => {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Sales & Broker Analytics</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Q4 revenue velocity, conversion milestones, and agent commission attribution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Book Volume</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">AED 48.2M</div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% YoY
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs text-slate-400 font-medium">Gross Commission Pool</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">AED 964,000</div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12.1% YoY
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs text-slate-400 font-medium">Avg. Sales Cycle</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">38 Days</div>
          <span className="text-xs text-blue-600 font-semibold">Down from 44 days</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs text-slate-400 font-medium">Top Performer</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white">Keyvan Akath</div>
          <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">AED 21.4M closed</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Broker Leaderboard & Quota Attainment</h2>
        <div className="space-y-3 text-xs">
          {[
            { name: 'Keyvan Akath', deals: 8, volume: '21.4M AED', quota: '142%' },
            { name: 'Elena Rostova (Broker Rep)', deals: 5, volume: '14.8M AED', quota: '110%' },
            { name: 'Jamal Al-Hassan', deals: 4, volume: '9.2M AED', quota: '95%' },
            { name: 'Rami Mansoor', deals: 2, volume: '2.8M AED', quota: '70%' },
          ].map((b, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-400 w-4">#{i + 1}</span>
                <span className="font-bold text-slate-900 dark:text-white">{b.name}</span>
              </div>
              <div className="flex items-center gap-6 font-mono">
                <span className="text-slate-500">{b.deals} Deals</span>
                <span className="font-bold text-slate-900 dark:text-white">{b.volume}</span>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded font-bold">{b.quota}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
