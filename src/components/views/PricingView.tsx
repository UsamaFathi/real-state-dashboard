import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Tag,
  Download,
  Plus,
  Filter,
  CheckCircle2,
  Sparkles,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Percent,
  DollarSign,
} from 'lucide-react';
import { PricingRule, NavigationTab } from '../../types';

interface PricingViewProps {
  pricingRules: PricingRule[];
  onAddRule: (rule: Partial<PricingRule>) => void;
  onUpdateRule: (rule: PricingRule) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onToast: (msg: string) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  pricingRules,
  onAddRule,
  onUpdateRule,
  onNavigateTab,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'scheduled' | 'drafts'>('active');
  const [selectedRule, setSelectedRule] = useState<PricingRule>(pricingRules[1] || pricingRules[0]);

  // Form edit states
  const [ruleName, setRuleName] = useState(selectedRule?.name || 'Corner Unit Premium');
  const [scopeLevel, setScopeLevel] = useState<'Project' | 'Unit Type' | 'Floor Range' | 'View Tag'>(
    selectedRule?.scopeLevel || 'Unit Type'
  );
  const [targetVal, setTargetVal] = useState(selectedRule?.target || '2BHK-Corner');
  const [calcType, setCalcType] = useState<'Fixed' | 'Percentage' | 'Per Sqm'>(
    selectedRule?.type || 'Fixed'
  );
  const [adjustmentVal, setAdjustmentVal] = useState(selectedRule?.adjustment || 15000);
  const [isApplying, setIsApplying] = useState(false);

  // Sync selected rule to form
  const handleSelectRule = (rule: PricingRule) => {
    setSelectedRule(rule);
    setRuleName(rule.name);
    setScopeLevel(rule.scopeLevel);
    setTargetVal(rule.target);
    setCalcType(rule.type);
    setAdjustmentVal(rule.adjustment);
  };

  const handleApplyRule = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      const updated: PricingRule = {
        ...selectedRule,
        name: ruleName,
        scopeLevel,
        target: targetVal,
        type: calcType,
        adjustment: Number(adjustmentVal),
        history: [
          {
            title: `Applied to ${selectedRule.affectedUnitsCount} Matching Units`,
            author: 'Pricing Engine Live',
            date: 'Today - Just now',
          },
          ...selectedRule.history,
        ],
      };
      onUpdateRule(updated);
      setSelectedRule(updated);
      onToast(`Applied rule "${ruleName}" to matching portfolio units. Inventory yields refreshed.`);
    }, 600);
  };

  // Preview calculations
  const basePriceAvg = 450000;
  const targetAdjustment =
    calcType === 'Percentage'
      ? (basePriceAvg * adjustmentVal) / 100
      : calcType === 'Per Sqm'
      ? adjustmentVal * 115
      : Number(adjustmentVal);
  const targetUnitTotal = basePriceAvg + targetAdjustment;

  const filteredRules = pricingRules.filter((r) => {
    if (activeTab === 'active') return r.status === 'ACTIVE';
    if (activeTab === 'scheduled') return r.status === 'SCHEDULED';
    return r.status === 'DRAFT';
  });

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-4 animate-in fade-in duration-150">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Pricing Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Define and apply dynamic pricing rules across portfolios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast('Exporting pricing yield matrix CSV...')}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs shadow-2xs transition cursor-pointer"
          >
            Export CSV
          </button>
          <button
            onClick={() => {
              const newRule: Partial<PricingRule> = {
                name: 'High Demand Surge Factor',
                scope: 'Project: The Zenith',
                scopeLevel: 'Project',
                target: 'The Zenith',
                type: 'Percentage',
                adjustment: 4.5,
                status: 'ACTIVE',
                affectedUnitsCount: 52,
              };
              onAddRule(newRule);
              onToast('New pricing rule initialized in active tier');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Rule</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Rules Table & Generated Adjustments status */}
        <div className="lg:col-span-8 space-y-4">
          {/* Rules Table Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
            {/* Filter Tabs Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-1 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === 'active'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Active Rules ({pricingRules.filter((r) => r.status === 'ACTIVE').length})
                </button>
                <button
                  onClick={() => setActiveTab('scheduled')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === 'scheduled'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Scheduled ({pricingRules.filter((r) => r.status === 'SCHEDULED').length})
                </button>
                <button
                  onClick={() => setActiveTab('drafts')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === 'drafts'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Drafts (1)
                </button>
              </div>

              <button
                onClick={() => onToast('Filter panel opened')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg cursor-pointer"
              >
                <Filter className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span>Filter</span>
              </button>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider bg-slate-50/30 dark:bg-slate-800/20">
                    <th className="p-3">Rule Name</th>
                    <th className="p-3">Scope</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-right">Adjustment</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRules.map((rule) => {
                    const isSelected = selectedRule?.id === rule.id;
                    return (
                      <tr
                        key={rule.id}
                        onClick={() => handleSelectRule(rule)}
                        className={`hover:bg-blue-50/50 dark:hover:bg-slate-800/60 cursor-pointer transition ${
                          isSelected ? 'bg-blue-50/80 dark:bg-slate-800 font-medium' : ''
                        }`}
                      >
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{rule.name}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{rule.scope}</td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">{rule.type}</td>
                        <td
                          className={`p-3 text-right font-mono font-semibold ${
                            rule.adjustment >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {rule.type === 'Percentage'
                            ? `${rule.adjustment >= 0 ? '+' : ''}${rule.adjustment.toFixed(2)}%`
                            : rule.type === 'Fixed'
                            ? `${rule.adjustment >= 0 ? '+' : '-'}$${Math.abs(rule.adjustment).toLocaleString()}`
                            : `${rule.adjustment >= 0 ? '+' : '-'}$${Math.abs(rule.adjustment)}/sqm`}
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                              rule.status === 'ACTIVE'
                                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                                : rule.status === 'SCHEDULED'
                                ? 'bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {rule.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Generated Adjustments Status Card (Matching Image 7 Bottom) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs">Generated Adjustments</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Read-only view of automatic pricing results based on active rules engine.
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Last run: 2 hours ago</span>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Units Updated</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  1,402
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Avg Variance</span>
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  +3.2%
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Exceptions</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Rule Configuration Form, Breakdown & History */}
        <div className="lg:col-span-4 space-y-4">
          {/* Rule Configuration Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Rule Configuration
            </h2>

            <div className="space-y-3 text-xs">
              {/* Rule Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Rule Name
                </label>
                <input
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Scope Level & Target */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Scope Level
                  </label>
                  <select
                    value={scopeLevel}
                    onChange={(e) => setScopeLevel(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="Unit Type">Unit Type</option>
                    <option value="Project">Project</option>
                    <option value="Floor Range">Floor Range</option>
                    <option value="View Tag">View Tag</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Target
                  </label>
                  <input
                    type="text"
                    value={targetVal}
                    onChange={(e) => setTargetVal(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Calculation Type Radios */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Calculation Type
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="calcType"
                      checked={calcType === 'Fixed'}
                      onChange={() => setCalcType('Fixed')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Fixed Amount</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="calcType"
                      checked={calcType === 'Percentage'}
                      onChange={() => setCalcType('Percentage')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Percentage</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="calcType"
                      checked={calcType === 'Per Sqm'}
                      onChange={() => setCalcType('Per Sqm')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Per Sqm</span>
                  </label>
                </div>
              </div>

              {/* Adjustment Value */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Adjustment Value
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={adjustmentVal}
                    onChange={(e) => setAdjustmentVal(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 pl-7 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                  />
                  <span className="absolute left-2.5 top-2 text-slate-400 dark:text-slate-500 font-mono">$</span>
                </div>
              </div>

              {/* Apply to Matching Units Button */}
              <button
                onClick={handleApplyRule}
                disabled={isApplying}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-xs transition active:scale-[0.98] mt-2 cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isApplying ? 'animate-spin' : ''}`} />
                <span>Apply to Matching Units</span>
              </button>
            </div>
          </div>

          {/* Price Component Breakdown Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Price Component Breakdown
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-200 dark:bg-blue-600 rounded-xs" />
                  Base Price (Avg)
                </span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  ${basePriceAvg.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" />
                  {ruleName || 'Adjustment'}
                </span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  +${targetAdjustment.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                <span>Target Unit Total</span>
                <span className="font-mono text-sm">${targetUnitTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Visual ratio bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden flex mt-2">
              <div className="bg-blue-300 dark:bg-blue-500 h-full w-[94%]" />
              <div className="bg-emerald-500 h-full w-[6%]" />
            </div>
          </div>

          {/* Rule History Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Rule History
            </h3>

            <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 pl-6 text-xs">
              {selectedRule?.history?.map((h, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 ring-2 ring-emerald-200 dark:ring-emerald-900" />
                  <div className="font-bold text-slate-900 dark:text-white">{h.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">By {h.author}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">{h.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
