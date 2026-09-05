import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  DollarSign,
  Activity,
  Filter,
  RotateCw,
  Clock,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  FileCheck2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { UnitItem, OfferApproval, TransactionHold, NavigationTab } from '../../types';

interface CommandCenterViewProps {
  units: UnitItem[];
  offers: OfferApproval[];
  transactions: TransactionHold[];
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectUnit: (unit: UnitItem) => void;
  onSelectOffer: (offer: OfferApproval) => void;
  onSelectTransaction: (tx: TransactionHold) => void;
  onToast: (msg: string) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  units,
  offers,
  transactions,
  onNavigateTab,
  onSelectUnit,
  onSelectOffer,
  onSelectTransaction,
  onToast,
}) => {
  const [selectedCompany, setSelectedCompany] = useState('All Companies');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedPeriod, setSelectedPeriod] = useState('This Quarter');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFunnelStage, setActiveFunnelStage] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onToast('Real-time pipeline metrics re-indexed.');
    }, 600);
  };

  const funnelStages = [
    { label: 'Leads', count: '1,200', width: '100%', bg: 'bg-[#93c5fd] dark:bg-blue-900/60', text: 'text-slate-900 dark:text-blue-100' },
    { label: 'Offers', count: '850', width: '85%', bg: 'bg-[#60a5fa] dark:bg-blue-800/70', text: 'text-slate-900 dark:text-blue-100' },
    { label: 'Approved', count: '620', width: '72%', bg: 'bg-[#3b82f6] dark:bg-blue-700/80', text: 'text-white' },
    { label: 'Holds', count: '410', width: '60%', bg: 'bg-[#2563eb] dark:bg-blue-600', text: 'text-white' },
    { label: 'Reservations', count: '290', width: '48%', bg: 'bg-[#1d4ed8] dark:bg-blue-500', text: 'text-white' },
    { label: 'Contracts', count: '150', width: '36%', bg: 'bg-[#1e3a8a] dark:bg-blue-400', text: 'text-white dark:text-slate-950' },
  ];

  // Recent contracts data
  const recentContracts = [
    { unitId: 'Z-405', project: 'The Zenith', client: 'Acme Corp', value: '$1,250,000', status: 'CONTRACTED' },
    { unitId: 'MB-112', project: 'Marina Bays', client: 'Sarah Jenkins', value: '$850,000', status: 'AVAILABLE' },
    { unitId: 'Z-802', project: 'The Zenith', client: 'Tech Innovations Ltd', value: '$2,100,000', status: 'CONTRACTED' },
    { unitId: 'MB-304', project: 'Marina Bays', client: 'David Chen', value: '$920,000', status: 'ON HOLD' },
  ];

  const urgentActions = [
    {
      id: 'ua-1',
      title: 'Expiring Hold: Unit A-402',
      badge: '2 hrs left',
      badgeClass: 'bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 font-semibold',
      detail: 'Client: John Doe - The Zenith',
      onClick: () => {
        const tx = transactions.find((t) => t.unitCode === 'Unit A-402') || transactions[0];
        onSelectTransaction(tx);
        onNavigateTab('transactions');
      },
    },
    {
      id: 'ua-2',
      title: 'Commercial Approval Required',
      badge: 'Today',
      badgeClass: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-semibold',
      detail: 'Offer #4928 - 5% Discount Request',
      onClick: () => {
        onNavigateTab('offers');
      },
    },
    {
      id: 'ua-3',
      title: 'Contract Signature Overdue',
      badge: '-1 Day',
      badgeClass: 'bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 font-semibold',
      detail: 'Unit B-105 - Marina Bays Portfolio',
      onClick: () => {
        onNavigateTab('transactions');
      },
    },
  ];

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-5 animate-in fade-in duration-150">
      {/* Top Title & Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Real Estate Command Center
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Data · Last updated: Today, 08:42 AM</span>
          </div>
        </div>

        {/* Global Filter Bar Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 font-medium hover:border-slate-300 dark:hover:border-slate-700 focus:outline-hidden"
          >
            <option>All Companies</option>
            <option>Global Holdings LLC</option>
            <option>Acme Holdings LLC</option>
            <option>UF Properties LLC</option>
          </select>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 font-medium hover:border-slate-300 dark:hover:border-slate-700 focus:outline-hidden"
          >
            <option>All Projects</option>
            <option>The Zenith</option>
            <option>Azure Heights</option>
            <option>Marina Bays</option>
            <option>Horizon Tower</option>
          </select>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 font-medium hover:border-slate-300 dark:hover:border-slate-700 focus:outline-hidden"
          >
            <option>This Quarter</option>
            <option>Q3 2023</option>
            <option>Year to Date</option>
            <option>Trailing 12M</option>
          </select>

          <button
            onClick={() => onToast('Applied custom pipeline filter set')}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition cursor-pointer"
            title="Advanced Filters"
          >
            <Filter className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRefresh}
            className={`p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition cursor-pointer ${
              isRefreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : ''
            }`}
            title="Refresh Metrics"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Units */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Units
            </span>
            <Layers className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2.5 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">2,450</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              12%
            </span>
          </div>
        </div>

        {/* Available */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Available
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">17.1%</span>
          </div>
          <div className="flex items-baseline gap-2.5 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">420</span>
            <span className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" />
              4%
            </span>
          </div>
        </div>

        {/* Total Inv. Value */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Inv. Value
            </span>
            <DollarSign className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2.5 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">$1.2B</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              8%
            </span>
          </div>
        </div>

        {/* Active Pipeline */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Pipeline
            </span>
            <Activity className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2.5 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">$340M</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              15%
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart and Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Bar Chart Card: Revenue & Contracted Value Trend */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Revenue & Contracted Value Trend
            </h2>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-blue-600 rounded-xs" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-blue-300 dark:bg-blue-400 rounded-xs" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">Contracted</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-4 pt-6 px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            {/* Bar 1 */}
            <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full max-w-[48px] bg-blue-600/90 hover:bg-blue-600 transition rounded-t-sm h-[38%] relative cursor-pointer">
                <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[10px] py-1 px-1.5 rounded whitespace-nowrap z-10 border border-slate-700">
                  $45M Rev
                </div>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">May</span>
            </div>

            {/* Bar 2 */}
            <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full max-w-[48px] bg-blue-600/90 hover:bg-blue-600 transition rounded-t-sm h-[52%] relative cursor-pointer">
                <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[10px] py-1 px-1.5 rounded whitespace-nowrap z-10 border border-slate-700">
                  $68M Rev
                </div>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Jun</span>
            </div>

            {/* Bar 3 */}
            <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full max-w-[48px] bg-blue-600/90 hover:bg-blue-600 transition rounded-t-sm h-[60%] relative cursor-pointer">
                <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[10px] py-1 px-1.5 rounded whitespace-nowrap z-10 border border-slate-700">
                  $82M Rev
                </div>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Jul</span>
            </div>

            {/* Bar 4 */}
            <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full max-w-[48px] bg-blue-600/90 hover:bg-blue-600 transition rounded-t-sm h-[42%] relative cursor-pointer">
                <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[10px] py-1 px-1.5 rounded whitespace-nowrap z-10 border border-slate-700">
                  $54M Rev
                </div>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Aug</span>
            </div>

            {/* Bar 5 */}
            <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full max-w-[48px] bg-blue-600/90 hover:bg-blue-600 transition rounded-t-sm h-[75%] relative cursor-pointer">
                <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[10px] py-1 px-1.5 rounded whitespace-nowrap z-10 border border-slate-700">
                  $110M Rev
                </div>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Sep</span>
            </div>

            {/* Bar 6 - Peak */}
            <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full max-w-[48px] bg-blue-600 hover:bg-blue-700 transition rounded-t-sm h-[94%] relative cursor-pointer shadow-sm">
                <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[10px] py-1 px-1.5 rounded whitespace-nowrap z-10 border border-slate-700">
                  $148M Peak
                </div>
              </div>
              <span className="text-[11px] text-slate-900 dark:text-white font-bold font-mono">Oct</span>
            </div>
          </div>
        </div>

        {/* Right Funnel Card: Sales Pipeline Funnel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Sales Pipeline Funnel</h2>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Q3 Active Conversion</span>
          </div>

          {/* Funnel Stack */}
          <div className="space-y-2 my-auto py-2">
            {funnelStages.map((stage) => {
              const isSelected = activeFunnelStage === stage.label;
              return (
                <div
                  key={stage.label}
                  onClick={() => {
                    setActiveFunnelStage(isSelected ? null : stage.label);
                    onToast(`Filtered pipeline view by: ${stage.label}`);
                  }}
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                >
                  <div
                    style={{ width: stage.width }}
                    className={`mx-auto py-2 px-3 rounded-md ${stage.bg} ${stage.text} flex items-center justify-between text-xs font-semibold shadow-2xs transition`}
                  >
                    <span>{stage.label}</span>
                    <span className="font-mono">{stage.count}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1">
            <span>Overall qualification-to-contract velocity:</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">12.5%</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Urgent Actions & Recent Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Urgent Actions Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Urgent Actions</h2>
            </div>
            <span className="text-[11px] bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 font-semibold px-2 py-0.5 rounded-full">
              5 Pending
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {urgentActions.map((action) => (
              <div
                key={action.id}
                onClick={action.onClick}
                className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 px-2 rounded-lg cursor-pointer transition group"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition flex items-center gap-1.5">
                    <span>{action.title}</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{action.detail}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] ${action.badgeClass}`}>
                    {action.badge}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contracts Table Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Contracts</h2>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                  <th className="pb-2">Unit ID</th>
                  <th className="pb-2">Project</th>
                  <th className="pb-2">Client</th>
                  <th className="pb-2">Value</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentContracts.map((c, i) => (
                  <tr
                    key={i}
                    onClick={() => {
                      const match = units.find((u) => u.code.includes(c.unitId)) || units[0];
                      onSelectUnit(match);
                      onNavigateTab('inventory');
                    }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition"
                  >
                    <td className="py-2.5 font-bold text-blue-600 dark:text-blue-400 font-mono">{c.unitId}</td>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300">{c.project}</td>
                    <td className="py-2.5 text-slate-900 dark:text-slate-100 font-medium">{c.client}</td>
                    <td className="py-2.5 font-mono font-semibold text-slate-900 dark:text-slate-100">{c.value}</td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                          c.status === 'CONTRACTED'
                            ? 'bg-[#102A43] dark:bg-blue-950 text-white dark:text-blue-200 border border-transparent dark:border-blue-800'
                            : c.status === 'AVAILABLE'
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
