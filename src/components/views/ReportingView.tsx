import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Plus,
  Filter,
  TrendingUp,
  Building,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  X,
  PieChart,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface ReportingViewProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onToast: (msg: string) => void;
}

export const ReportingView: React.FC<ReportingViewProps> = ({ onNavigateTab, onToast }) => {
  const [selectedEntity, setSelectedEntity] = useState('All Global Entities');
  const [dateRange, setDateRange] = useState('Q3 2023');
  const [assetClass, setAssetClass] = useState<string | null>('Commercial');

  const propertyReports = [
    { property: 'The Azure Tower A', occupancy: '98.5%', revenue: '$148.2M', growth: '+14.2%', yieldRate: '7.8%' },
    { property: 'Azure Heights Block 1', occupancy: '92.0%', revenue: '$94.6M', growth: '+9.1%', yieldRate: '8.2%' },
    { property: 'The Zenith Financial', occupancy: '96.2%', revenue: '$120.5M', growth: '+11.8%', yieldRate: '7.4%' },
    { property: 'Marina Bays Waterfront', occupancy: '89.4%', revenue: '$65.2M', growth: '+6.4%', yieldRate: '8.9%' },
  ];

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-4 animate-in fade-in duration-150">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Reports</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational and executive reports on commercial velocity and portfolio performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast('Generating full global consolidation PDF & Excel ledger...')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export Global Report</span>
          </button>
          <button
            onClick={() => onToast('Custom SQL / OLAP report builder opened')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Custom Report</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (Matching Image 8) */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Entity Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3" /> Entity:
            </span>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden cursor-pointer"
            >
              <option>All Global Entities</option>
              <option>Global Holdings LLC</option>
              <option>Acme Holdings LLC</option>
              <option>UF Properties LLC</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Date Range:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden cursor-pointer"
            >
              <option>Q3 2023</option>
              <option>Q2 2023</option>
              <option>Q1 2023</option>
              <option>Full Year 2023</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Asset Class Chip */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Asset Class:</span>
            {assetClass ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium text-xs">
                <span>{assetClass}</span>
                <button onClick={() => setAssetClass(null)} className="hover:text-blue-200 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : null}
            <button
              onClick={() => {
                setAssetClass('Commercial');
                onToast('Filtered to Commercial Asset Class');
              }}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-[11px] font-semibold cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards (Matching Image 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Contract Value */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Total Contract Value
          </span>
          <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight mt-1 block">
            $428.5M
          </span>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.4% vs prev. quarter</span>
          </div>
        </div>

        {/* Portfolio Occupancy */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Portfolio Occupancy
          </span>
          <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight mt-1 block">
            94.2%
          </span>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+1.8% vs prev. quarter</span>
          </div>
        </div>

        {/* Active Offers */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Active Offers
          </span>
          <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight mt-1 block">
            1,248
          </span>
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-xs font-semibold mt-2">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-3.2% vs prev. quarter</span>
          </div>
        </div>

        {/* Upcoming Expiries */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Upcoming Expiries (90d)
          </span>
          <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight mt-1 block">
            312
          </span>
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-2">
            Requires immediate action
          </div>
        </div>
      </div>

      {/* Detailed Property Performance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Property Asset Performance & Capital Yield
            </h2>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">Audited Q3 Financial Consolidation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider bg-slate-50/50 dark:bg-slate-800/40">
                <th className="p-3">Development / Asset</th>
                <th className="p-3 text-right">Occupancy Rate</th>
                <th className="p-3 text-right">Q3 Contracted Revenue</th>
                <th className="p-3 text-right">QoQ Growth</th>
                <th className="p-3 text-right">Net Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {propertyReports.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{p.property}</span>
                  </td>
                  <td className="p-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">{p.occupancy}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">{p.revenue}</td>
                  <td className="p-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">{p.growth}</td>
                  <td className="p-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">{p.yieldRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
