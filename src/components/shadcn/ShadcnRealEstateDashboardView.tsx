import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  Building2,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUp,
  ArrowDown,
  Clock,
  AlertCircle,
  FileCheck,
  Send,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  FileSignature,
  FileText,
  Calculator,
  Target,
  Calendar,
  Activity,
  BarChart3,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { LegalEntity } from '../../types';
import {
  DashboardDateRangeSelector,
  DEFAULT_DATE_RANGE,
  DateRangeState,
  DateRangePreset,
  PRESET_OPTIONS,
} from '../dashboard/DashboardDateRangeSelector';

interface ShadcnRealEstateDashboardViewProps {
  onNavigateTab?: (tab: string) => void;
  onToast?: (msg: string) => void;
  selectedCompany?: LegalEntity;
}

export const ShadcnRealEstateDashboardView: React.FC<ShadcnRealEstateDashboardViewProps> = ({
  onNavigateTab,
  onToast,
  selectedCompany = {
    id: 'ent-1',
    name: 'Palm Developments',
    shortCode: 'PD',
    jurisdiction: 'Cairo & New Capital',
    taxId: 'EG-8849102-PD',
    activeProperties: 450,
    aum: 'EGP 8.4 Billion',
    status: 'Active',
    currencySymbol: 'EGP',
    logoBg: 'bg-emerald-600',
  },
}) => {
  // Global Dashboard Date Range State
  const [dashboardDateRange, setDashboardDateRange] = useState<DateRangeState>(DEFAULT_DATE_RANGE);
  const [timePeriod, setTimePeriod] = useState<'30 Days' | 'Quarter' | 'YTD'>('30 Days');
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Monthly Revenue Trajectory Controls & State
  const [trajectoryPeriod, setTrajectoryPeriod] = useState<'ytd' | 'full-year' | 'trailing-6'>('ytd');
  const [showTargetLine, setShowTargetLine] = useState<boolean>(true);
  const [showPriorYearLine, setShowPriorYearLine] = useState<boolean>(true);
  const [showAvgBenchmark, setShowAvgBenchmark] = useState<boolean>(true);
  const [selectedTrajectoryMonth, setSelectedTrajectoryMonth] = useState<string>('Sep');

  const currency = selectedCompany.currencySymbol || 'EGP';

  // Monthly Revenue Trajectory Dataset (Jan to Dec 2026, cumulative matches 96.7M contracted value)
  interface MonthlyTrajectoryPoint {
    month: string;
    monthFullName: string;
    quarter: string;
    revenue: number; // in Millions
    target: number; // in Millions
    previousYear: number; // in Millions
    momGrowth: number; // % change vs previous month
    yoyGrowth: number; // % change vs same month last year
    contracts: number; // signed transactions count
    averageDealSize: number; // in Millions
    topProject: string;
    status: 'actual' | 'projected';
  }

  const allMonthlyTrajectoryData: MonthlyTrajectoryPoint[] = [
    {
      month: 'Jan',
      monthFullName: 'January 2026',
      quarter: 'Q1',
      revenue: 8.5,
      target: 8.0,
      previousYear: 7.1,
      momGrowth: 8.2,
      yoyGrowth: 19.7,
      contracts: 8,
      averageDealSize: 1.06,
      topProject: 'Palm Residence',
      status: 'actual',
    },
    {
      month: 'Feb',
      monthFullName: 'February 2026',
      quarter: 'Q1',
      revenue: 9.2,
      target: 8.8,
      previousYear: 7.7,
      momGrowth: 8.2,
      yoyGrowth: 19.5,
      contracts: 9,
      averageDealSize: 1.02,
      topProject: 'New Capital Villas',
      status: 'actual',
    },
    {
      month: 'Mar',
      monthFullName: 'March 2026',
      quarter: 'Q1',
      revenue: 10.8,
      target: 9.5,
      previousYear: 8.9,
      momGrowth: 17.4,
      yoyGrowth: 21.3,
      contracts: 11,
      averageDealSize: 0.98,
      topProject: 'Downtown Luxury Suites',
      status: 'actual',
    },
    {
      month: 'Apr',
      monthFullName: 'April 2026',
      quarter: 'Q2',
      revenue: 9.8,
      target: 10.0,
      previousYear: 8.3,
      momGrowth: -9.3,
      yoyGrowth: 18.1,
      contracts: 10,
      averageDealSize: 0.98,
      topProject: 'Palm Residence',
      status: 'actual',
    },
    {
      month: 'May',
      monthFullName: 'May 2026',
      quarter: 'Q2',
      revenue: 11.5,
      target: 10.8,
      previousYear: 9.4,
      momGrowth: 17.3,
      yoyGrowth: 22.3,
      contracts: 12,
      averageDealSize: 0.96,
      topProject: 'Cairo Bay Mansions',
      status: 'actual',
    },
    {
      month: 'Jun',
      monthFullName: 'June 2026',
      quarter: 'Q2',
      revenue: 12.8,
      target: 11.5,
      previousYear: 10.3,
      momGrowth: 11.3,
      yoyGrowth: 24.3,
      contracts: 14,
      averageDealSize: 0.91,
      topProject: 'Downtown Heights',
      status: 'actual',
    },
    {
      month: 'Jul',
      monthFullName: 'July 2026',
      quarter: 'Q3',
      revenue: 11.2,
      target: 11.4,
      previousYear: 9.9,
      momGrowth: -12.5,
      yoyGrowth: 13.1,
      contracts: 12,
      averageDealSize: 0.93,
      topProject: 'New Capital Villas',
      status: 'actual',
    },
    {
      month: 'Aug',
      monthFullName: 'August 2026',
      quarter: 'Q3',
      revenue: 10.7,
      target: 11.8,
      previousYear: 9.2,
      momGrowth: -4.5,
      yoyGrowth: 16.3,
      contracts: 15,
      averageDealSize: 0.71,
      topProject: 'Palm Residence',
      status: 'actual',
    },
    {
      month: 'Sep',
      monthFullName: 'September 2026 (Current)',
      quarter: 'Q3',
      revenue: 12.2,
      target: 11.2,
      previousYear: 9.5,
      momGrowth: 14.4, // Directly mirrors the +14.4% growth indicator on Contracted Value card
      yoyGrowth: 28.4,
      contracts: 18, // Matches 18 signed contracts in secondary operational strip
      averageDealSize: 0.68,
      topProject: 'Unit A-1204 & Penthouses',
      status: 'actual',
    },
    {
      month: 'Oct',
      monthFullName: 'October 2026 (Projected)',
      quarter: 'Q4',
      revenue: 13.5,
      target: 12.2,
      previousYear: 10.4,
      momGrowth: 10.7,
      yoyGrowth: 29.8,
      contracts: 19,
      averageDealSize: 0.71,
      topProject: 'Palm Residence Phase II',
      status: 'projected',
    },
    {
      month: 'Nov',
      monthFullName: 'November 2026 (Projected)',
      quarter: 'Q4',
      revenue: 14.8,
      target: 13.0,
      previousYear: 11.2,
      momGrowth: 9.6,
      yoyGrowth: 32.1,
      contracts: 21,
      averageDealSize: 0.70,
      topProject: 'New Capital Promenade',
      status: 'projected',
    },
    {
      month: 'Dec',
      monthFullName: 'December 2026 (Projected)',
      quarter: 'Q4',
      revenue: 16.4,
      target: 14.0,
      previousYear: 12.1,
      momGrowth: 10.8,
      yoyGrowth: 35.5,
      contracts: 24,
      averageDealSize: 0.68,
      topProject: 'Executive Penthouse Series',
      status: 'projected',
    },
  ];

  // Filtered trajectory dataset dynamically synchronized with dashboardDateRange
  const displayedTrajectoryData = React.useMemo(() => {
    const filtered = allMonthlyTrajectoryData.filter((_, idx) =>
      dashboardDateRange.monthIndices.includes(idx)
    );
    return filtered.length > 0 ? filtered : [allMonthlyTrajectoryData[8]];
  }, [dashboardDateRange.monthIndices, allMonthlyTrajectoryData]);

  // Calculations complementing existing growth indicators
  const displayedTotalRevenue = displayedTrajectoryData.reduce((acc, curr) => acc + curr.revenue, 0);
  const displayedTotalTarget = displayedTrajectoryData.reduce((acc, curr) => acc + curr.target, 0);
  const displayedAvgMonthly =
    displayedTrajectoryData.length > 0 ? displayedTotalRevenue / displayedTrajectoryData.length : 0;
  const totalContractsInPeriod = displayedTrajectoryData.reduce((acc, curr) => acc + curr.contracts, 0);
  const activeMonthData =
    displayedTrajectoryData.find((d) => d.month === selectedTrajectoryMonth) ||
    displayedTrajectoryData[displayedTrajectoryData.length - 1] ||
    allMonthlyTrajectoryData[8];

  // Dynamic period multipliers and metrics for operational stats
  const periodStats = React.useMemo(() => {
    switch (dashboardDateRange.preset) {
      case 'last-30-days':
        return {
          leads: 120,
          offers: 23,
          reservations: 42,
          contracts: 18,
          conversionRate: 34.8,
          growthMoM: '+14.4%',
          growthSubtitle: `vs. prior 30 days (+${currency} 1.5M)`,
          prevPeriodRev: 10.7,
          benchmarkTag: 'Benchmark: vs. Prior 30 Days',
        };
      case 'q3-2026':
        return {
          leads: 340,
          offers: 64,
          reservations: 88,
          contracts: 45,
          conversionRate: 36.2,
          growthMoM: '+18.2%',
          growthSubtitle: `vs. Q2 benchmark (+${currency} 5.6M)`,
          prevPeriodRev: 28.5,
          benchmarkTag: 'Benchmark: vs. Q2 2026',
        };
      case 'q2-2026':
        return {
          leads: 310,
          offers: 58,
          reservations: 76,
          contracts: 36,
          conversionRate: 32.5,
          growthMoM: '+19.6%',
          growthSubtitle: `vs. Q1 benchmark (+${currency} 5.6M)`,
          prevPeriodRev: 28.5,
          benchmarkTag: 'Benchmark: vs. Q1 2026',
        };
      case 'q1-2026':
        return {
          leads: 280,
          offers: 48,
          reservations: 62,
          contracts: 28,
          conversionRate: 30.1,
          growthMoM: '+22.4%',
          growthSubtitle: 'vs. Q4 2025 launch baseline',
          prevPeriodRev: 23.2,
          benchmarkTag: 'Benchmark: vs. Prior Quarter',
        };
      case 'trailing-6':
        return {
          leads: 650,
          offers: 122,
          reservations: 164,
          contracts: 81,
          conversionRate: 35.4,
          growthMoM: '+21.5%',
          growthSubtitle: 'vs. preceding 6-month period',
          prevPeriodRev: 56.1,
          benchmarkTag: 'Benchmark: vs. Prior 6 Months',
        };
      case 'full-year':
        return {
          leads: 1320,
          offers: 248,
          reservations: 330,
          contracts: 168,
          conversionRate: 35.8,
          growthMoM: '+24.8%',
          growthSubtitle: `vs. FY 2025 baseline (${currency} 113.2M)`,
          prevPeriodRev: 113.2,
          benchmarkTag: 'Benchmark: vs. FY 2025 Baseline',
        };
      case 'custom':
        return {
          leads: Math.round(displayedTotalRevenue * 9.6),
          offers: Math.round(displayedTotalRevenue * 1.75),
          reservations: Math.round(displayedTotalRevenue * 2.34),
          contracts: totalContractsInPeriod,
          conversionRate: 34.5,
          growthMoM: '+16.2%',
          growthSubtitle: 'computed for selected custom range',
          prevPeriodRev: Number((displayedTotalRevenue * 0.86).toFixed(1)),
          benchmarkTag: 'Benchmark: Period Comparison',
        };
      case 'ytd':
      default:
        return {
          leads: 930,
          offers: 170,
          reservations: 226,
          contracts: 104,
          conversionRate: 34.8,
          growthMoM: '+14.4%',
          growthSubtitle: `vs. previous month (+${currency} 12.2M)`,
          prevPeriodRev: 84.5,
          benchmarkTag: 'Benchmark: vs. Previous Month',
        };
    }
  }, [dashboardDateRange.preset, currency, displayedTotalRevenue, totalContractsInPeriod]);

  // Commercial performance chart data responding dynamically to the active date range
  const currentChartData = React.useMemo(() => {
    switch (dashboardDateRange.preset) {
      case 'last-30-days':
        return [
          { name: 'Day 1', contractedValue: 4.8, offers: 4, reservations: 3 },
          { name: 'Day 5', contractedValue: 5.2, offers: 7, reservations: 5 },
          { name: 'Day 10', contractedValue: 6.6, offers: 11, reservations: 8 },
          { name: 'Day 15', contractedValue: 8.4, offers: 14, reservations: 10 },
          { name: 'Day 20', contractedValue: 9.7, offers: 17, reservations: 13 },
          { name: 'Day 25', contractedValue: 10.9, offers: 22, reservations: 16 },
          { name: 'Day 30', contractedValue: 12.2, offers: 28, reservations: 22 },
        ];
      case 'q3-2026':
        return [
          { name: 'Jul 2026', contractedValue: 11.2, offers: 24, reservations: 18 },
          { name: 'Aug 2026', contractedValue: 21.9, offers: 48, reservations: 36 },
          { name: 'Sep 2026', contractedValue: 34.1, offers: 74, reservations: 58 },
        ];
      case 'q2-2026':
        return [
          { name: 'Apr 2026', contractedValue: 9.8, offers: 20, reservations: 15 },
          { name: 'May 2026', contractedValue: 21.3, offers: 42, reservations: 32 },
          { name: 'Jun 2026', contractedValue: 34.1, offers: 68, reservations: 52 },
        ];
      case 'q1-2026':
        return [
          { name: 'Jan 2026', contractedValue: 8.5, offers: 18, reservations: 12 },
          { name: 'Feb 2026', contractedValue: 17.7, offers: 38, reservations: 28 },
          { name: 'Mar 2026', contractedValue: 28.5, offers: 54, reservations: 42 },
        ];
      case 'trailing-6':
        return [
          { name: 'Apr', contractedValue: 9.8, offers: 20, reservations: 15 },
          { name: 'May', contractedValue: 21.3, offers: 42, reservations: 32 },
          { name: 'Jun', contractedValue: 34.1, offers: 68, reservations: 52 },
          { name: 'Jul', contractedValue: 45.3, offers: 92, reservations: 70 },
          { name: 'Aug', contractedValue: 56.0, offers: 116, reservations: 88 },
          { name: 'Sep', contractedValue: 68.2, offers: 144, reservations: 110 },
        ];
      case 'full-year':
        return [
          { name: 'Q1 (Jan–Mar)', contractedValue: 28.5, offers: 54, reservations: 42 },
          { name: 'Q2 (Apr–Jun)', contractedValue: 62.6, offers: 122, reservations: 94 },
          { name: 'Q3 (Jul–Sep)', contractedValue: 96.7, offers: 170, reservations: 148 },
          { name: 'Q4 (Projected)', contractedValue: 141.4, offers: 248, reservations: 226 },
        ];
      case 'ytd':
      default:
        if (dashboardDateRange.preset === 'custom') {
          return displayedTrajectoryData.map((d, i) => {
            let cumRev = 0;
            for (let k = 0; k <= i; k++) {
              cumRev += displayedTrajectoryData[k].revenue;
            }
            return {
              name: d.month,
              contractedValue: Number(cumRev.toFixed(1)),
              offers: Math.round(d.contracts * 2.2 + (i + 1) * 6),
              reservations: Math.round(d.contracts * 1.6 + (i + 1) * 4),
            };
          });
        }
        return [
          { name: 'Q1 (Jan–Mar)', contractedValue: 28.5, offers: 54, reservations: 42 },
          { name: 'Q2 (Apr–Jun)', contractedValue: 62.6, offers: 122, reservations: 94 },
          { name: 'Q3 (Jul–Sep)', contractedValue: 96.7, offers: 170, reservations: 148 },
        ];
    }
  }, [dashboardDateRange.preset, displayedTrajectoryData]);

  const maxContractedValue = Math.max(...currentChartData.map((d) => d.contractedValue), 10);
  const chartYMax = Math.ceil(maxContractedValue * 1.15);

  const leadsList = [
    {
      name: 'Marcus Vance',
      budget: `${currency} 8.2M - ${currency} 9.5M`,
      match: '98%',
      timing: 'Immediate',
      criteria: '3 Bed, Pool View, Cash',
    },
    {
      name: 'Sophia Sterling',
      budget: `${currency} 8.5M - ${currency} 10.0M`,
      match: '95%',
      timing: '30 Days',
      criteria: '170+ sqm, Palm Residence',
    },
    {
      name: 'David & Clara Kim',
      budget: `${currency} 8.0M - ${currency} 9.0M`,
      match: '92%',
      timing: 'Immediate',
      criteria: 'Family Suite, High Floor',
    },
    {
      name: 'Alexander Wright',
      budget: `${currency} 9.0M - ${currency} 12.0M`,
      match: '90%',
      timing: '60 Days',
      criteria: 'Investor Package, 30/70 Plan',
    },
  ];

  const tasksAndAlerts = [
    {
      id: 'task-1',
      title: 'Reservation expires tomorrow',
      unit: 'Unit B-302 • Palm Residence',
      client: 'Marcus Vance',
      type: 'urgent',
      time: 'Tomorrow, 17:00',
      icon: Clock,
      actionLabel: 'Extend / Review',
      tab: 'reservations',
    },
    {
      id: 'task-2',
      title: 'Hold expires in 2 hours',
      unit: 'Unit C-1104 • Sky Promenade',
      client: 'Sophia Sterling',
      type: 'warning',
      time: 'In 2 hours',
      icon: AlertCircle,
      actionLabel: 'Convert to Reservation',
      tab: 'holds',
    },
    {
      id: 'task-3',
      title: 'Discount approval pending',
      unit: 'Unit A-1204 (5.0% variance request)',
      client: 'Kestrel Holdings',
      type: 'info',
      time: 'Pending Committee',
      icon: FileCheck,
      actionLabel: 'Review Offer',
      tab: 'offers',
    },
    {
      id: 'task-4',
      title: 'Contract awaiting approval',
      unit: `Unit D-801 • ${currency} 12.4M`,
      client: 'Acme International Corp',
      type: 'success',
      time: 'Legal verified',
      icon: FileSignature,
      actionLabel: 'Open Contract',
      tab: 'contracts',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 font-sans antialiased text-gray-900 dark:text-gray-100">
      {/* 1. DYNAMIC COMPANY PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="flex items-center gap-3.5">
          {/* Company Emblem */}
          <div
            className={`w-11 h-11 rounded-2xl ${
              selectedCompany.logoBg || 'bg-emerald-700 dark:bg-emerald-600'
            } text-white flex items-center justify-center font-black text-base shadow-sm tracking-tight`}
          >
            {selectedCompany.shortCode || selectedCompany.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
              {selectedCompany.name}
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
              Portfolio & Sales Overview
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              onNavigateTab?.('units');
              onToast?.('Viewing all units in active inventory');
            }}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#13151f] hover:bg-gray-50 dark:hover:bg-[#181b28] border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-2xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-gray-500" />
            <span>Unit Availability</span>
          </button>

          <button
            onClick={() => {
              onNavigateTab?.('offers');
              onToast?.('Creating new purchase offer');
            }}
            className="px-3.5 py-2 rounded-xl bg-gray-950 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-950 text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Create Offer</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1.5 GLOBAL DATE RANGE SELECTOR (TOP OF DASHBOARD) */}
      <DashboardDateRangeSelector
        value={dashboardDateRange}
        onChange={(newRange) => {
          setDashboardDateRange(newRange);
          // Keep trajectoryPeriod in sync if matching preset
          if (newRange.preset === 'ytd' || newRange.preset === 'full-year' || newRange.preset === 'trailing-6') {
            setTrajectoryPeriod(newRange.preset);
          }
          // Ensure active month in trajectory inspection matches new range
          if (newRange.monthIndices.length > 0) {
            const lastIdx = newRange.monthIndices[newRange.monthIndices.length - 1];
            const mObj = allMonthlyTrajectoryData[lastIdx];
            if (mObj) {
              setSelectedTrajectoryMonth(mObj.month);
            }
          }
        }}
        onToast={onToast}
        currency={currency}
        totalFilteredRevenue={displayedTotalRevenue}
      />

      {/* 2. PRIMARY BUSINESS KPI CARDS (Real Estate OS metrics) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-950 dark:text-white">
              Executive Performance Metrics
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Key business indicators for {dashboardDateRange.label} ({dashboardDateRange.formattedSpan})
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 text-xs font-medium self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{periodStats.benchmarkTag}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Total Units */}
          <div
            id="card-total-units"
            onClick={() => {
              setSelectedKpi('Total Units');
              onNavigateTab?.('units');
              onToast?.('Filtering inventory by Total Units (450, +8.4% vs prev. month)');
            }}
            className={`bg-white dark:bg-[#11131c] rounded-2xl p-5 border ${
              selectedKpi === 'Total Units'
                ? 'border-emerald-500/60 ring-2 ring-emerald-500/20'
                : 'border-gray-200/90 dark:border-gray-800/80'
            } shadow-2xs hover:shadow-md transition cursor-pointer relative group flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Units
                </span>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                  450
                </span>
                {/* Trend indicator: Up arrow with percentage */}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60 shadow-2xs">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                  <span>+8.4%</span>
                </span>
              </div>

              <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
                Across 4 master developments
              </div>
            </div>

            {/* Growth against previous month comparison breakdown */}
            <div className="pt-2.5 mt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
              <span className="text-gray-500 dark:text-gray-400">vs. previous month</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                +35 units (415)
              </span>
            </div>
          </div>

          {/* Card 2: Available Units */}
          <div
            id="card-available-units"
            onClick={() => {
              setSelectedKpi('Available Units');
              onNavigateTab?.('unit-availability');
              onToast?.('Filtering by Available Units (120 units, -5.5% vs prev. month)');
            }}
            className={`bg-white dark:bg-[#11131c] rounded-2xl p-5 border ${
              selectedKpi === 'Available Units'
                ? 'border-emerald-500/60 ring-2 ring-emerald-500/20'
                : 'border-gray-200/90 dark:border-gray-800/80'
            } shadow-2xs hover:shadow-md transition cursor-pointer relative group flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Available Units
                </span>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition">
                  <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                  120
                </span>
                {/* Trend indicator: Down arrow with percentage (inventory absorption) */}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 shadow-2xs" title="Inventory reduced by 7 units due to active buyer absorption">
                  <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                  <span>-5.5%</span>
                </span>
              </div>

              <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
                26.7% inventory • Immediate booking
              </div>
            </div>

            {/* Growth / Absorption against previous month comparison breakdown */}
            <div className="pt-2.5 mt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
              <span className="text-gray-500 dark:text-gray-400">vs. previous month</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                -7 absorbed (127)
              </span>
            </div>
          </div>

          {/* Card 3: Reserved Units */}
          <div
            id="card-reserved-units"
            onClick={() => {
              setSelectedKpi('Reserved Units');
              onNavigateTab?.('reservations');
              onToast?.('Filtering by Reserved Units (42 units, +16.7% vs prev. month)');
            }}
            className={`bg-white dark:bg-[#11131c] rounded-2xl p-5 border ${
              selectedKpi === 'Reserved Units'
                ? 'border-emerald-500/60 ring-2 ring-emerald-500/20'
                : 'border-gray-200/90 dark:border-gray-800/80'
            } shadow-2xs hover:shadow-md transition cursor-pointer relative group flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reserved Units
                </span>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                  42
                </span>
                {/* Trend indicator: Up arrow with percentage */}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60 shadow-2xs">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                  <span>+16.7%</span>
                </span>
              </div>

              <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
                Active reservations in progress
              </div>
            </div>

            {/* Growth against previous month comparison breakdown */}
            <div className="pt-2.5 mt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
              <span className="text-gray-500 dark:text-gray-400">vs. previous month</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                +6 units (36)
              </span>
            </div>
          </div>

          {/* Card 4: Contracted Value */}
          <div
            id="card-contracted-value"
            onClick={() => {
              setSelectedKpi('Contracted Value');
              onNavigateTab?.('contracts');
              onToast?.(`Focusing Monthly Revenue Trajectory (${currency} ${displayedTotalRevenue.toFixed(1)}M ${dashboardDateRange.label}, ${periodStats.growthMoM})`);
              const el = document.getElementById('card-monthly-revenue-trajectory');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className={`bg-white dark:bg-[#11131c] rounded-2xl p-5 border ${
              selectedKpi === 'Contracted Value'
                ? 'border-emerald-500/60 ring-2 ring-emerald-500/20'
                : 'border-gray-200/90 dark:border-gray-800/80'
            } shadow-2xs hover:shadow-md transition cursor-pointer relative group flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contracted Value
                </span>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition">
                  <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                  {currency} {displayedTotalRevenue.toFixed(1)}M
                </span>
                {/* Trend indicator: Up arrow with percentage */}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60 shadow-2xs">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                  <span>{periodStats.growthMoM}</span>
                </span>
              </div>

              <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
                {dashboardDateRange.label} ({dashboardDateRange.formattedSpan})
              </div>
            </div>

            {/* Growth against previous benchmark breakdown */}
            <div className="pt-2.5 mt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
              <span className="text-gray-500 dark:text-gray-400">vs. benchmark</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                +{currency} {(Math.max(0, displayedTotalRevenue - periodStats.prevPeriodRev)).toFixed(1)}M ({periodStats.prevPeriodRev.toFixed(1)}M)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY OPERATIONAL STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-white dark:bg-[#11131c] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 text-xs shadow-2xs">
        <div
          onClick={() => onNavigateTab?.('leads')}
          className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#171926] cursor-pointer transition text-center"
        >
          <div className="text-gray-500 dark:text-gray-400 font-medium">Active Leads</div>
          <div className="text-base font-bold text-gray-950 dark:text-white mt-0.5">{periodStats.leads.toLocaleString()}</div>
          <div className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            <ArrowUp className="w-2.5 h-2.5 stroke-[2.5]" /> {periodStats.growthMoM} vs baseline
          </div>
        </div>
        <div
          onClick={() => onNavigateTab?.('offers')}
          className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#171926] cursor-pointer transition text-center"
        >
          <div className="text-gray-500 dark:text-gray-400 font-medium">Offers</div>
          <div className="text-base font-bold text-gray-950 dark:text-white mt-0.5">{periodStats.offers}</div>
          <div className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            <ArrowUp className="w-2.5 h-2.5 stroke-[2.5]" /> +9.5% conversion
          </div>
        </div>
        <div
          onClick={() => onNavigateTab?.('reservations')}
          className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#171926] cursor-pointer transition text-center"
        >
          <div className="text-gray-500 dark:text-gray-400 font-medium">Reservations</div>
          <div className="text-base font-bold text-gray-950 dark:text-white mt-0.5">{periodStats.reservations}</div>
          <div className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            <ArrowUp className="w-2.5 h-2.5 stroke-[2.5]" /> +16.7% vs prev.
          </div>
        </div>
        <div
          onClick={() => onNavigateTab?.('contracts')}
          className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#171926] cursor-pointer transition text-center"
        >
          <div className="text-gray-500 dark:text-gray-400 font-medium">Contracts</div>
          <div className="text-base font-bold text-gray-950 dark:text-white mt-0.5">{periodStats.contracts}</div>
          <div className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            <ArrowUp className="w-2.5 h-2.5 stroke-[2.5]" /> +20.0% executed
          </div>
        </div>
        <div
          onClick={() => onNavigateTab?.('reports')}
          className="col-span-2 sm:col-span-1 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#171926] cursor-pointer transition text-center"
        >
          <div className="text-gray-500 dark:text-gray-400 font-medium">Conversion Rate</div>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {periodStats.conversionRate}%
          </div>
          <div className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            <ArrowUp className="w-2.5 h-2.5 stroke-[2.5]" /> +2.3% vs target
          </div>
        </div>
      </div>

      {/* 2.5 MONTHLY REVENUE TRAJECTORY (RECHARTS LINE CHART) */}
      <div
        id="card-monthly-revenue-trajectory"
        className="bg-white dark:bg-[#11131c] rounded-2xl p-5 sm:p-6 border border-gray-200/90 dark:border-gray-800/80 shadow-2xs space-y-5"
      >
        {/* Top Header & Range Selection */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                <TrendingUp className="w-3 h-3" />
                <span>Revenue Velocity</span>
              </span>
              <span className="text-xs text-gray-400 font-medium">
                Pacing: {displayedTotalTarget > 0 ? ((displayedTotalRevenue / displayedTotalTarget) * 100).toFixed(1) : '100'}% of Budget
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white tracking-tight">
              Monthly Revenue Trajectory
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Contracted sales momentum, target milestones, and trajectory for {dashboardDateRange.label} ({dashboardDateRange.formattedSpan})
            </p>
          </div>

          {/* Time Range Filter & Toggles */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {dashboardDateRange.preset !== 'ytd' && dashboardDateRange.preset !== 'full-year' && dashboardDateRange.preset !== 'trailing-6' && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold text-xs border border-emerald-200/60 dark:border-emerald-800/60">
                {dashboardDateRange.label}
              </span>
            )}
            <div className="inline-flex items-center p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200/60 dark:border-gray-700/60 text-xs">
              <button
                onClick={() => {
                  setTrajectoryPeriod('ytd');
                  const mapped = PRESET_OPTIONS.find((p) => p.id === 'ytd');
                  if (mapped) {
                    setDashboardDateRange({
                      preset: mapped.id,
                      startDate: mapped.startDate,
                      endDate: mapped.endDate,
                      label: mapped.label,
                      formattedSpan: mapped.formattedSpan,
                      daysCount: mapped.daysCount,
                      monthIndices: mapped.monthIndices,
                    });
                  }
                  onToast?.('Showing YTD Revenue Trajectory (Jan – Sep 2026)');
                }}
                className={`px-3 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                  dashboardDateRange.preset === 'ytd'
                    ? 'bg-white dark:bg-[#1a1d28] text-gray-950 dark:text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                YTD (Jan–Sep)
              </button>
              <button
                onClick={() => {
                  setTrajectoryPeriod('full-year');
                  const mapped = PRESET_OPTIONS.find((p) => p.id === 'full-year');
                  if (mapped) {
                    setDashboardDateRange({
                      preset: mapped.id,
                      startDate: mapped.startDate,
                      endDate: mapped.endDate,
                      label: mapped.label,
                      formattedSpan: mapped.formattedSpan,
                      daysCount: mapped.daysCount,
                      monthIndices: mapped.monthIndices,
                    });
                  }
                  onToast?.('Showing Full Year Trajectory with Q4 Projections');
                }}
                className={`px-3 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                  dashboardDateRange.preset === 'full-year'
                    ? 'bg-white dark:bg-[#1a1d28] text-gray-950 dark:text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                Full Year + Forecast
              </button>
              <button
                onClick={() => {
                  setTrajectoryPeriod('trailing-6');
                  const mapped = PRESET_OPTIONS.find((p) => p.id === 'trailing-6');
                  if (mapped) {
                    setDashboardDateRange({
                      preset: mapped.id,
                      startDate: mapped.startDate,
                      endDate: mapped.endDate,
                      label: mapped.label,
                      formattedSpan: mapped.formattedSpan,
                      daysCount: mapped.daysCount,
                      monthIndices: mapped.monthIndices,
                    });
                  }
                  onToast?.('Showing Trailing 6 Months Momentum');
                }}
                className={`px-3 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                  dashboardDateRange.preset === 'trailing-6'
                    ? 'bg-white dark:bg-[#1a1d28] text-gray-950 dark:text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                Last 6 Mo
              </button>
            </div>
          </div>
        </div>

        {/* Growth Indicators Harmonization Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 bg-gray-50/80 dark:bg-[#161824] rounded-xl border border-gray-100 dark:border-gray-800/80">
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block">
              Run-Rate ({activeMonthData.month})
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-gray-950 dark:text-white font-mono">
                {currency} {activeMonthData.revenue.toFixed(1)}M
              </span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                +{activeMonthData.momGrowth}% MoM
              </span>
            </div>
            <span className="text-[10px] text-gray-400 block">
              Target: {currency} {activeMonthData.target.toFixed(1)}M ({activeMonthData.month})
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block">
              Target Milestone Pace
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-gray-950 dark:text-white font-mono">
                {displayedTotalTarget > 0 ? ((displayedTotalRevenue / displayedTotalTarget) * 100).toFixed(1) : '100'}%
              </span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Target className="w-3 h-3 mr-0.5" />
                +{currency} {(Math.max(0, displayedTotalRevenue - displayedTotalTarget)).toFixed(1)}M
              </span>
            </div>
            <span className="text-[10px] text-gray-400 block">
              Budget Target: {currency} {displayedTotalTarget.toFixed(1)}M
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block">
              Signed Contracts ({dashboardDateRange.label})
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-gray-950 dark:text-white font-mono">
                {totalContractsInPeriod} Units
              </span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                {periodStats.growthMoM}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 block">
              Avg Deal: {currency} {Math.round(activeMonthData.averageDealSize * 1000)}K / unit
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block">
              Cumulative Executed Value
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {currency} {displayedTotalRevenue.toFixed(1)}M
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                {dashboardDateRange.label} Realized
              </span>
            </div>
            <span className="text-[10px] text-gray-400 block">
              Benchmark: {currency} {periodStats.prevPeriodRev.toFixed(1)}M
            </span>
          </div>
        </div>

        {/* Legend & Display Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-gray-100 dark:border-gray-800/80 pb-3">
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-200 dark:ring-emerald-900/60" />
              <span className="text-gray-800 dark:text-gray-200 font-semibold">
                Actual Revenue ({currency} M)
              </span>
            </div>
            {showTargetLine && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-indigo-500 inline-block border-t-2 border-dashed border-indigo-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Target Trajectory
                </span>
              </div>
            )}
            {showPriorYearLine && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-slate-400 inline-block border-t-2 border-dotted border-slate-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  Prior Year Baseline
                </span>
              </div>
            )}
            {showAvgBenchmark && (
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-[11px]">
                <Activity className="w-3 h-3" />
                <span>Period Avg: {currency} {displayedAvgMonthly.toFixed(1)}M/mo</span>
              </div>
            )}
          </div>

          {/* Toggle Switches for Chart Layers */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowTargetLine(!showTargetLine)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                showTargetLine
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60'
                  : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700'
              }`}
            >
              Target Line
            </button>
            <button
              onClick={() => setShowPriorYearLine(!showPriorYearLine)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                showPriorYearLine
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700'
              }`}
            >
              Prior Year
            </button>
            <button
              onClick={() => setShowAvgBenchmark(!showAvgBenchmark)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                showAvgBenchmark
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700'
              }`}
            >
              Avg Line
            </button>
          </div>
        </div>

        {/* Recharts Line Chart Container */}
        <div className="h-[280px] sm:h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayedTrajectoryData}
              margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  const clickedMonth = e.activePayload[0].payload.month;
                  setSelectedTrajectoryMonth(clickedMonth);
                  onToast?.(`Inspecting ${clickedMonth} Revenue Trajectory`);
                }
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-gray-100 dark:text-gray-800/60"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                dy={8}
              />
              <YAxis
                domain={[0, 18]}
                ticks={[0, 4, 8, 12, 16]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                tickFormatter={(val) => `${currency} ${val}M`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data: MonthlyTrajectoryPoint = payload[0]?.payload;
                    if (!data) return null;
                    const isPositiveMoM = data.momGrowth >= 0;
                    const isAboveTarget = data.revenue >= data.target;

                    return (
                      <div className="bg-gray-900/95 dark:bg-black/95 text-white p-3.5 rounded-xl shadow-2xl border border-gray-700/80 text-xs space-y-2.5 min-w-[230px] backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                          <div>
                            <span className="font-bold text-sm text-white">{data.monthFullName}</span>
                            <span className="text-[10px] text-gray-400 ml-1.5 font-mono">({data.quarter})</span>
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              data.status === 'projected'
                                ? 'bg-purple-900/80 text-purple-300 border border-purple-700/80'
                                : 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/80'
                            }`}
                          >
                            {data.status === 'projected' ? 'Forecast' : 'Actual'}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-gray-300">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                              <span>Monthly Revenue:</span>
                            </span>
                            <span className="font-bold text-white font-mono text-xs">
                              {currency} {data.revenue.toFixed(1)}M
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-gray-400">
                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
                              <span>Target Milestone:</span>
                            </span>
                            <span className="font-semibold text-gray-200 font-mono">
                              {currency} {data.target.toFixed(1)}M
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-gray-400">
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                              <span>Prior Year Baseline:</span>
                            </span>
                            <span className="font-semibold text-gray-300 font-mono">
                              {currency} {data.previousYear.toFixed(1)}M
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-800 grid grid-cols-2 gap-2 text-[10px]">
                          <div>
                            <span className="text-gray-400 block">MoM Velocity:</span>
                            <span className={`font-bold inline-flex items-center gap-0.5 ${isPositiveMoM ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isPositiveMoM ? '+' : ''}{data.momGrowth}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">YoY Growth:</span>
                            <span className="font-bold text-emerald-400">
                              +{data.yoyGrowth}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Signed Deals:</span>
                            <span className="font-bold text-gray-200">{data.contracts} units</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Target Achieved:</span>
                            <span className={`font-bold ${isAboveTarget ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {((data.revenue / data.target) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        <div className="text-[10px] text-gray-400 pt-1 border-t border-gray-800/80">
                          Lead Project: <span className="text-gray-200 font-medium">{data.topProject}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Reference line for average revenue */}
              {showAvgBenchmark && (
                <ReferenceLine
                  y={displayedAvgMonthly}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeOpacity={0.7}
                  label={{
                    value: `Avg: ${currency} ${displayedAvgMonthly.toFixed(1)}M`,
                    position: 'insideTopRight',
                    fill: '#10b981',
                    fontSize: 10,
                  }}
                />
              )}

              {/* Prior Year Baseline Line */}
              {showPriorYearLine && (
                <Line
                  type="monotone"
                  dataKey="previousYear"
                  name="Prior Year Baseline"
                  stroke="#94a3b8"
                  strokeWidth={1.8}
                  strokeDasharray="3 3"
                  dot={false}
                  activeDot={{ r: 5, fill: '#94a3b8' }}
                />
              )}

              {/* Target Milestone Trajectory Line */}
              {showTargetLine && (
                <Line
                  type="monotone"
                  dataKey="target"
                  name={`Target Goal (${currency} M)`}
                  stroke="#818cf8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: '#818cf8', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#818cf8' }}
                />
              )}

              {/* Primary Actual Revenue Trajectory Line */}
              <Line
                type="monotone"
                dataKey="revenue"
                name={`Monthly Revenue (${currency} M)`}
                stroke="#059669"
                strokeWidth={3}
                dot={(dotProps: any) => {
                  const { cx, cy, payload } = dotProps;
                  const isSelected = selectedTrajectoryMonth === payload.month;
                  const isProjected = payload.status === 'projected';
                  return (
                    <circle
                      key={`dot-${payload.month}`}
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 4}
                      fill={isProjected ? '#a7f3d0' : '#059669'}
                      stroke={isSelected ? '#047857' : '#ffffff'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="cursor-pointer transition-all duration-150"
                      onClick={() => {
                        setSelectedTrajectoryMonth(payload.month);
                        onToast?.(`Inspecting ${payload.monthFullName}`);
                      }}
                    />
                  );
                }}
                activeDot={{ r: 8, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive Month Selection Strip & Detailed Breakdown */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Interactive Month Breakdown:
            </span>
            <span className="text-[11px] text-gray-400">
              Click a month chip or chart point to inspect trajectory
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {allMonthlyTrajectoryData.map((d) => {
              const isSelected = selectedTrajectoryMonth === d.month;
              return (
                <button
                  key={d.month}
                  onClick={() => {
                    setSelectedTrajectoryMonth(d.month);
                    onToast?.(`Selected ${d.monthFullName} (${currency} ${d.revenue}M)`);
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-gray-950 dark:bg-white text-white dark:text-gray-950 shadow-xs ring-1 ring-gray-900/20'
                      : d.status === 'projected'
                      ? 'bg-gray-50 dark:bg-gray-800/60 text-gray-500 hover:text-gray-900 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700'
                      : 'bg-gray-100 dark:bg-gray-800/80 text-gray-700 hover:text-gray-900 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60'
                  }`}
                >
                  <span>{d.month}</span>
                  {d.momGrowth >= 0 ? (
                    <ArrowUp className={`w-2.5 h-2.5 ${isSelected ? 'text-emerald-300 dark:text-emerald-700' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  ) : (
                    <ArrowDown className={`w-2.5 h-2.5 ${isSelected ? 'text-rose-300 dark:text-rose-700' : 'text-rose-500 dark:text-rose-400'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Deep-Dive Card for Selected Month */}
          {activeMonthData && (
            <div className="p-3.5 bg-gray-50/90 dark:bg-[#151722] rounded-xl border border-gray-200/80 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-950 dark:text-white text-sm">
                    {activeMonthData.monthFullName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      activeMonthData.status === 'projected'
                        ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {activeMonthData.status === 'projected' ? 'Q4 Forecast' : 'Executed Actual'}
                  </span>
                  <span className="text-gray-400 text-[11px]">
                    Quarter: {activeMonthData.quarter}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                  Leading development: <span className="font-semibold text-gray-700 dark:text-gray-300">{activeMonthData.topProject}</span> • {activeMonthData.contracts} signed deals averaging {currency} {activeMonthData.averageDealSize.toFixed(2)}M
                </p>
              </div>

              <div className="flex items-center gap-4 text-right flex-shrink-0">
                <div>
                  <div className="text-gray-400 text-[10px]">Monthly Revenue</div>
                  <div className="text-sm font-bold text-gray-950 dark:text-white font-mono">
                    {currency} {activeMonthData.revenue.toFixed(1)}M
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-[10px]">MoM Momentum</div>
                  <div className={`text-sm font-bold font-mono ${activeMonthData.momGrowth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {activeMonthData.momGrowth >= 0 ? '+' : ''}{activeMonthData.momGrowth}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-[10px]">YoY Benchmark</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    +{activeMonthData.yoyGrowth}%
                  </div>
                </div>
                <button
                  onClick={() => {
                    onNavigateTab?.('contracts');
                    onToast?.(`Opening executed contracts for ${activeMonthData.monthFullName}`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-xs hover:opacity-90 transition cursor-pointer flex items-center gap-1 ml-1"
                >
                  <span>Contracts</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. COMMERCIAL PERFORMANCE CHART */}
      <div
        id="card-commercial-performance"
        className="bg-white dark:bg-[#11131c] rounded-2xl p-5 sm:p-6 border border-gray-200/90 dark:border-gray-800/80 shadow-2xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Commercial Performance
            </h2>
            <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-900 dark:bg-white inline-block" />
                <span>Contracted Value ({currency} M)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-gray-500 inline-block" />
                <span>Offers & Reservations (Units)</span>
              </div>
            </div>
          </div>

          {/* Time range switcher: 30 Days, Quarter, YTD */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {dashboardDateRange.preset !== 'last-30-days' && dashboardDateRange.preset !== 'q3-2026' && dashboardDateRange.preset !== 'ytd' && (
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                Filtered: {dashboardDateRange.label}
              </span>
            )}
            <div className="inline-flex items-center p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
              {(['30 Days', 'Quarter', 'YTD'] as const).map((period) => {
                const isSelected =
                  (period === '30 Days' && dashboardDateRange.preset === 'last-30-days') ||
                  (period === 'Quarter' && dashboardDateRange.preset === 'q3-2026') ||
                  (period === 'YTD' && dashboardDateRange.preset === 'ytd') ||
                  timePeriod === period;

                return (
                  <button
                    key={period}
                    onClick={() => {
                      setTimePeriod(period);
                      const targetPreset = period === '30 Days' ? 'last-30-days' : period === 'Quarter' ? 'q3-2026' : 'ytd';
                      const mapped = PRESET_OPTIONS.find((p) => p.id === targetPreset);
                      if (mapped) {
                        setDashboardDateRange({
                          preset: mapped.id,
                          startDate: mapped.startDate,
                          endDate: mapped.endDate,
                          label: mapped.label,
                          formattedSpan: mapped.formattedSpan,
                          daysCount: mapped.daysCount,
                          monthIndices: mapped.monthIndices,
                        });
                      }
                      onToast?.(`Commercial Performance: ${period}`);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-[#1a1d28] text-gray-950 dark:text-white shadow-xs'
                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    }`}
                  >
                    {period}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recharts Area Chart Container */}
        <div className="h-[260px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorContracted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1f2937" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1f2937" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-gray-100 dark:text-gray-800/50"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-900 dark:bg-black text-white p-3 rounded-xl shadow-xl border border-gray-700 text-xs space-y-1.5">
                        <p className="font-semibold text-gray-300">{label}</p>
                        <div className="flex items-center justify-between gap-4 text-white">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-white" /> Contracted Value:
                          </span>
                          <span className="font-bold">
                            {currency} {payload[0]?.value}M
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-gray-300">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-gray-400" /> Offers:
                          </span>
                          <span className="font-bold">{payload[1]?.value} Units</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="contractedValue"
                stroke="#1f2937"
                strokeWidth={2.2}
                fillOpacity={1}
                fill="url(#colorContracted)"
              />
              <Area
                type="monotone"
                dataKey="offers"
                stroke="#9ca3af"
                strokeWidth={1.8}
                fillOpacity={1}
                fill="url(#colorOffers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. FEATURED OPPORTUNITY CARD (Unit A-1204 • Palm Residence) */}
      <div
        id="card-featured-opportunity"
        className="bg-white dark:bg-[#11131c] rounded-2xl p-5 sm:p-6 lg:p-7 border border-gray-200/90 dark:border-gray-800/80 shadow-2xs"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Title & Key Operational Stats */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 mb-2.5">
                <span>Featured Opportunity</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                Unit A-1204
              </h3>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-0.5">
                Palm Residence
              </p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                178 sqm • 3 Bedrooms • Pool View
              </p>
            </div>

            {/* 3 Operational Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div
                onClick={() => setIsLeadModalOpen(true)}
                className="bg-gray-50 dark:bg-[#161822] rounded-xl p-3.5 text-center border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition"
              >
                <div className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white">
                  14
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  Matching Leads
                </div>
              </div>

              <div
                onClick={() => {
                  onNavigateTab?.('offers');
                  onToast?.('Unit A-1204: 3 Active Offers in review');
                }}
                className="bg-gray-50 dark:bg-[#161822] rounded-xl p-3.5 text-center border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition"
              >
                <div className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white">
                  3
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  Active Offers
                </div>
              </div>

              <div
                onClick={() => onToast?.('Unit A-1204: 2,400+ portal views')}
                className="bg-gray-50 dark:bg-[#161822] rounded-xl p-3.5 text-center border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition"
              >
                <div className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white">
                  2.4K
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  Views
                </div>
              </div>
            </div>

            {/* Operational Actions */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => {
                  onNavigateTab?.('units');
                  onToast?.('Opening Unit A-1204 specifications');
                }}
                className="px-3.5 py-2 rounded-xl bg-gray-950 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Open Unit</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  onNavigateTab?.('offers');
                  onToast?.('Creating offer for Unit A-1204');
                }}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#161822] hover:bg-gray-50 dark:hover:bg-[#1e2230] text-gray-700 dark:text-gray-200 text-xs font-semibold border border-gray-200 dark:border-gray-700/60 shadow-2xs transition cursor-pointer flex items-center gap-1.5"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Create Offer</span>
              </button>

              <button
                onClick={() => {
                  onNavigateTab?.('payment-plans');
                  onToast?.('Opening Payment Plan Calculator for Unit A-1204');
                }}
                className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#1a1d28] dark:hover:bg-[#222634] text-gray-700 dark:text-gray-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Payment Plans</span>
              </button>

              <button
                onClick={() => setIsLeadModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#1a1d28] dark:hover:bg-[#222634] text-gray-700 dark:text-gray-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Matching Leads</span>
              </button>
            </div>
          </div>

          {/* Right Column: Architectural House Photo with Badge */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden shadow-md group border border-gray-100 dark:border-gray-800">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
                alt="Palm Residence Unit A-1204"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-102 transition duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Floating "Buyer Requirement Match" badge */}
              <div
                onClick={() => setIsLeadModalOpen(true)}
                className="absolute top-3.5 left-3.5 px-3 py-1.5 rounded-xl bg-gray-950/80 hover:bg-gray-950 text-white backdrop-blur-md shadow-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>92% Match • Based on buyer requirements</span>
              </div>

              {/* Price Tag pill on bottom right */}
              <div className="absolute bottom-3.5 right-3.5 px-3.5 py-1.5 rounded-xl bg-black/80 text-white backdrop-blur-md text-xs font-bold shadow-md">
                {currency === 'EGP' ? 'EGP 8,600,000' : '$8,600,000'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TASKS & ALERTS (ACTION CENTER) */}
      <div
        id="card-tasks-and-alerts"
        className="bg-white dark:bg-[#11131c] rounded-2xl p-5 sm:p-6 border border-gray-200/90 dark:border-gray-800/80 shadow-2xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Tasks & Alerts
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Operational events requiring team attention
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-400 font-medium">4 active items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {tasksAndAlerts.map((task) => {
            const Icon = task.icon;
            return (
              <div
                key={task.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-[#161822] border border-gray-100 dark:border-gray-800 text-xs hover:border-gray-200 dark:hover:border-gray-700 transition"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      task.type === 'urgent'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                        : task.type === 'warning'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                        : task.type === 'info'
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-950 dark:text-white truncate">
                      {task.title}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-[11px] truncate mt-0.5">
                      {task.unit}
                    </div>
                    <div className="text-gray-400 dark:text-gray-500 text-[10px] mt-0.5">
                      Client: {task.client} • {task.time}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onNavigateTab?.(task.tab);
                    onToast?.(`Opening ${task.title}`);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1e2230] hover:bg-gray-100 dark:hover:bg-[#252a3a] text-gray-900 dark:text-white font-semibold text-[11px] border border-gray-200 dark:border-gray-700/60 transition flex-shrink-0 ml-3 cursor-pointer"
                >
                  {task.actionLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. MODAL FOR "14 MATCHING LEADS" */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#13151f] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">
                    14 Matched Buyer Leads
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Buyer Requirement Match for Unit A-1204 ({currency === 'EGP' ? 'EGP 8.6M' : '$8.6M'})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLeadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-72 overflow-y-auto">
              {leadsList.map((lead, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#181a24] border border-gray-100 dark:border-gray-800 text-xs"
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {lead.name}
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                        {lead.match} Match
                      </span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">
                      Budget: {lead.budget} • Criteria: {lead.criteria}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onToast?.(`Sent Unit A-1204 details to ${lead.name}`);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-[11px] hover:opacity-90 flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-500">+10 other qualified investors</span>
              <button
                onClick={() => {
                  onToast?.('Dispatched Unit A-1204 specification sheet to all 14 qualified leads!');
                  setIsLeadModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer"
              >
                Send to All 14 Leads
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
