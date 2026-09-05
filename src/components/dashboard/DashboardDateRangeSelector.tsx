import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  Filter,
} from 'lucide-react';

export type DateRangePreset =
  | 'ytd'
  | 'last-30-days'
  | 'q3-2026'
  | 'q2-2026'
  | 'q1-2026'
  | 'trailing-6'
  | 'full-year'
  | 'custom';

export interface DateRangeState {
  preset: DateRangePreset;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  label: string;
  formattedSpan: string;
  daysCount: number;
  monthIndices: number[]; // 0-based month indices (0=Jan ... 11=Dec)
}

export interface PresetOption {
  id: DateRangePreset;
  label: string;
  badge: string;
  description: string;
  startDate: string;
  endDate: string;
  monthIndices: number[];
  daysCount: number;
  formattedSpan: string;
}

export const PRESET_OPTIONS: PresetOption[] = [
  {
    id: 'ytd',
    label: 'Year to Date',
    badge: 'Jan – Sep',
    description: 'Current fiscal year through present day',
    startDate: '2026-01-01',
    endDate: '2026-09-05',
    monthIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    daysCount: 248,
    formattedSpan: 'Jan 1, 2026 – Sep 5, 2026',
  },
  {
    id: 'last-30-days',
    label: 'Last 30 Days',
    badge: 'Trailing 30D',
    description: 'Recent momentum (Aug 6 – Sep 5)',
    startDate: '2026-08-06',
    endDate: '2026-09-05',
    monthIndices: [7, 8],
    daysCount: 30,
    formattedSpan: 'Aug 6, 2026 – Sep 5, 2026',
  },
  {
    id: 'q3-2026',
    label: 'Q3 2026',
    badge: 'Jul – Sep',
    description: 'Current active commercial quarter',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    monthIndices: [6, 7, 8],
    daysCount: 92,
    formattedSpan: 'Jul 1, 2026 – Sep 30, 2026',
  },
  {
    id: 'q2-2026',
    label: 'Q2 2026',
    badge: 'Apr – Jun',
    description: 'Prior completed spring quarter',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    monthIndices: [3, 4, 5],
    daysCount: 91,
    formattedSpan: 'Apr 1, 2026 – Jun 30, 2026',
  },
  {
    id: 'q1-2026',
    label: 'Q1 2026',
    badge: 'Jan – Mar',
    description: 'First quarter launch results',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    monthIndices: [0, 1, 2],
    daysCount: 90,
    formattedSpan: 'Jan 1, 2026 – Mar 31, 2026',
  },
  {
    id: 'trailing-6',
    label: 'Last 6 Months',
    badge: 'Apr – Sep',
    description: 'Semi-annual sales velocity (6 months)',
    startDate: '2026-04-01',
    endDate: '2026-09-30',
    monthIndices: [3, 4, 5, 6, 7, 8],
    daysCount: 183,
    formattedSpan: 'Apr 1, 2026 – Sep 30, 2026',
  },
  {
    id: 'full-year',
    label: 'Full Year 2026',
    badge: '12 Months',
    description: 'Jan – Dec 2026 (including Q4 projections)',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    monthIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    daysCount: 365,
    formattedSpan: 'Jan 1, 2026 – Dec 31, 2026',
  },
];

export const DEFAULT_DATE_RANGE: DateRangeState = {
  preset: 'ytd',
  startDate: '2026-01-01',
  endDate: '2026-09-05',
  label: 'Year to Date',
  formattedSpan: 'Jan 1, 2026 – Sep 5, 2026',
  daysCount: 248,
  monthIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8],
};

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

interface DashboardDateRangeSelectorProps {
  value: DateRangeState;
  onChange: (newRange: DateRangeState) => void;
  onToast?: (msg: string) => void;
  currency?: string;
  totalFilteredRevenue?: number;
}

export const DashboardDateRangeSelector: React.FC<DashboardDateRangeSelectorProps> = ({
  value,
  onChange,
  onToast,
  currency = 'EGP',
  totalFilteredRevenue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState<string>(value.startDate);
  const [customEnd, setCustomEnd] = useState<string>(value.endDate);
  const [customError, setCustomError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPreset = (presetId: DateRangePreset) => {
    const preset = PRESET_OPTIONS.find((p) => p.id === presetId);
    if (!preset) return;

    const nextState: DateRangeState = {
      preset: preset.id,
      startDate: preset.startDate,
      endDate: preset.endDate,
      label: preset.label,
      formattedSpan: preset.formattedSpan,
      daysCount: preset.daysCount,
      monthIndices: preset.monthIndices,
    };

    setCustomStart(preset.startDate);
    setCustomEnd(preset.endDate);
    onChange(nextState);
    setIsOpen(false);
    onToast?.(`Filtered dashboard to ${preset.label} (${preset.formattedSpan})`);
  };

  const handleApplyCustomRange = () => {
    if (!customStart || !customEnd) {
      setCustomError('Please select both start and end dates');
      return;
    }

    if (customStart > customEnd) {
      setCustomError('Start date cannot be after end date');
      return;
    }

    setCustomError(null);

    // Calculate month indices overlapping [customStart, customEnd]
    const sDate = new Date(customStart);
    const eDate = new Date(customEnd);

    const sMonth = sDate.getFullYear() === 2026 ? sDate.getMonth() : 0;
    const eMonth = eDate.getFullYear() === 2026 ? eDate.getMonth() : 11;

    const indices: number[] = [];
    for (let i = Math.max(0, sMonth); i <= Math.min(11, eMonth); i++) {
      indices.push(i);
    }

    if (indices.length === 0) {
      indices.push(8); // Default fallback to September
    }

    const diffTime = Math.abs(eDate.getTime() - sDate.getTime());
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const formatShort = (d: Date) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const formattedSpan = `${formatShort(sDate)} – ${formatShort(eDate)}`;

    const customState: DateRangeState = {
      preset: 'custom',
      startDate: customStart,
      endDate: customEnd,
      label: 'Custom Range',
      formattedSpan,
      daysCount,
      monthIndices: indices,
    };

    onChange(customState);
    setIsOpen(false);
    onToast?.(`Filtered dashboard to custom range: ${formattedSpan}`);
  };

  const handleReset = () => {
    handleSelectPreset('ytd');
  };

  // Quick sequential stepper (e.g. step between quarters or 30 days)
  const handleStepPeriod = (direction: 'prev' | 'next') => {
    const sequence: DateRangePreset[] = ['q1-2026', 'q2-2026', 'q3-2026', 'ytd', 'full-year'];
    const currentIndex = sequence.indexOf(value.preset);

    if (currentIndex === -1) {
      // If currently in last-30-days or custom, step into Q3
      handleSelectPreset('q3-2026');
      return;
    }

    const nextIndex =
      direction === 'prev'
        ? Math.max(0, currentIndex - 1)
        : Math.min(sequence.length - 1, currentIndex + 1);

    if (nextIndex !== currentIndex) {
      handleSelectPreset(sequence[nextIndex]);
    }
  };

  const isCustom = value.preset === 'custom';
  const isDefault = value.preset === 'ytd';

  return (
    <div
      ref={containerRef}
      className="relative bg-white dark:bg-[#11131c] rounded-2xl p-3 sm:p-4 border border-gray-200/90 dark:border-gray-800/80 shadow-2xs space-y-3"
    >
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3.5">
        {/* Left: Main Trigger & Active Range Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Main Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border shadow-2xs ${
                isOpen
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500/60 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                  : 'bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-600/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2 text-left">
                <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                  Date Range:
                </span>
                <span className="font-bold text-gray-950 dark:text-white">{value.label}</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                }`}
              />
            </button>
          </div>

          {/* Quick Period Steppers */}
          <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800/80 rounded-xl p-0.5 border border-gray-200/60 dark:border-gray-700/60 text-xs">
            <button
              type="button"
              onClick={() => handleStepPeriod('prev')}
              title="Previous period (e.g. Q1 / Q2)"
              className="p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-gray-700 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 px-2 font-mono">
              {value.formattedSpan}
            </span>
            <button
              type="button"
              onClick={() => handleStepPeriod('next')}
              title="Next period (e.g. Q3 / YTD)"
              className="p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-gray-700 transition cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Duration Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">{value.daysCount} Days</span>
            <span className="text-emerald-600/70 dark:text-emerald-400/70">•</span>
            <span>
              {value.monthIndices.length}{' '}
              {value.monthIndices.length === 1 ? 'Month' : 'Months'} Active
            </span>
          </div>

          {/* Synchronized Revenue Pill */}
          {totalFilteredRevenue !== undefined && (
            <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-medium">
              <span className="text-gray-400">Period Contracted Revenue:</span>
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {currency} {totalFilteredRevenue.toFixed(1)}M
              </span>
            </div>
          )}
        </div>

        {/* Right: Quick Preset Switcher Strip */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Preset Buttons for One-Click Switching */}
          <div className="inline-flex items-center p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200/60 dark:border-gray-700/60 text-xs">
            <button
              type="button"
              onClick={() => handleSelectPreset('last-30-days')}
              className={`px-2.5 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                value.preset === 'last-30-days'
                  ? 'bg-white dark:bg-[#1a1d28] text-gray-950 dark:text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              30D
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('q3-2026')}
              className={`px-2.5 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                value.preset === 'q3-2026'
                  ? 'bg-white dark:bg-[#1a1d28] text-gray-950 dark:text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Q3
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('q2-2026')}
              className={`px-2.5 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                value.preset === 'q2-2026'
                  ? 'bg-white dark:bg-[#1a1d28] text-gray-950 dark:text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Q2
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('trailing-6')}
              className={`px-2.5 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                value.preset === 'trailing-6'
                  ? 'bg-white dark:bg-[#1a1d28] text-gray-950 dark:text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Last 6M
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('ytd')}
              className={`px-2.5 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                value.preset === 'ytd'
                  ? 'bg-white dark:bg-[#1a1d28] text-gray-950 dark:text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              YTD
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('full-year')}
              className={`px-2.5 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                value.preset === 'full-year'
                  ? 'bg-white dark:bg-[#1a1d28] text-gray-950 dark:text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Full Year
            </button>
          </div>

          {/* Reset button if filtered differently from default */}
          {!isDefault && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer font-medium"
              title="Reset date filter to Year to Date"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Popover Dropdown Menu for Extended Presets & Custom Calendar Input */}
      {isOpen && (
        <div className="absolute left-2 sm:left-4 top-full mt-2 w-[calc(100%-16px)] sm:w-[480px] bg-white dark:bg-[#151824] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-4 sm:p-5 z-50 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                Filter Performance & Revenue Data
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Standard Presets Grid */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block">
              Standard Fiscal Periods
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_OPTIONS.map((opt) => {
                const isSelected = value.preset === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectPreset(opt.id)}
                    className={`flex items-start justify-between p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-100'
                        : 'bg-gray-50/70 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200/80 dark:border-gray-700/80 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">{opt.label}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 block">
                        {opt.badge}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500">
                      {opt.daysCount}d
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Date Range Picker Block */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block">
              Custom Date Range Selection
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  min="2026-01-01"
                  max="2026-12-31"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  min="2026-01-01"
                  max="2026-12-31"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            {customError && (
              <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {customError}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-400">
                Data calibrated for fiscal year 2026
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCustomRange}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition cursor-pointer"
                >
                  Apply Custom Range
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
