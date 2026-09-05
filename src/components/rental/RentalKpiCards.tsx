import React from 'react';
import {
  Building2,
  FileCheck2,
  Banknote,
  Wrench,
  CalendarCheck2,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { RentalKPIs, RentalTab } from '../../types/rentalTypes';

interface RentalKpiCardsProps {
  kpis: RentalKPIs;
  onNavigateTab: (tab: RentalTab) => void;
  onToast: (msg: string) => void;
}

export const RentalKpiCards: React.FC<RentalKpiCardsProps> = ({
  kpis,
  onNavigateTab,
  onToast,
}) => {
  const formatAED = (num: number) => {
    return `AED ${num.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Property Portfolio & Occupancy Card */}
      <div
        onClick={() => onNavigateTab('properties')}
        className="bg-white dark:bg-[#0c0e15] rounded-2xl p-4 border border-slate-200/80 dark:border-amber-950/40 shadow-xs hover:border-amber-500/50 dark:hover:shadow-[0_4px_20px_rgba(212,175,55,0.08)] transition cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-300 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>{kpis.occupancyRate}% Occupied</span>
          </span>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-amber-100">
            {kpis.totalUnits}{' '}
            <span className="text-xs font-normal text-slate-400 font-sans">Units</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Portfolio Inventory
          </div>
        </div>

        {/* Occupancy Mini Breakdown */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-amber-950/30 flex items-center justify-between text-[11px]">
          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
            ● {kpis.rentedUnits} Rented
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            ● {kpis.availableUnits} Available
          </span>
          <span className="text-amber-600 dark:text-amber-400 font-medium">
            ● {kpis.maintenanceUnits} Mnt
          </span>
        </div>
      </div>

      {/* 2. Active Leases & Tenancy Contracts */}
      <div
        onClick={() => onNavigateTab('contracts')}
        className="bg-white dark:bg-[#0c0e15] rounded-2xl p-4 border border-slate-200/80 dark:border-amber-950/40 shadow-xs hover:border-amber-500/50 dark:hover:shadow-[0_4px_20px_rgba(212,175,55,0.08)] transition cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
            {kpis.expiringContractsCount} Expiring Soon
          </span>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-amber-100">
            {kpis.activeContractsCount}{' '}
            <span className="text-xs font-normal text-slate-400 font-sans">Active</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tenancy Contracts
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-amber-950/30 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Ejari Registered: 100%</span>
          <span className="font-semibold text-slate-700 dark:text-amber-200/80">30-Day Alert</span>
        </div>
      </div>

      {/* 3. Monthly Rent Collection */}
      <div
        onClick={() => onNavigateTab('invoices')}
        className="bg-white dark:bg-[#0c0e15] rounded-2xl p-4 border border-slate-200/80 dark:border-amber-950/40 shadow-xs hover:border-amber-500/50 dark:hover:shadow-[0_4px_20px_rgba(212,175,55,0.08)] transition cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Banknote className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
            {kpis.collectionEfficiency}% Collected
          </span>
        </div>

        <div className="mt-3">
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-amber-200 truncate">
            {formatAED(kpis.grossRentMTD)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gross Rent (MTD)
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-amber-950/30 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 dark:text-slate-400">Overdue Invoices:</span>
          <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
            {formatAED(kpis.overdueRentAmount)}
          </span>
        </div>
      </div>

      {/* 4. Maintenance & Work Orders */}
      <div
        onClick={() => onNavigateTab('maintenance')}
        className="bg-white dark:bg-[#0c0e15] rounded-2xl p-4 border border-slate-200/80 dark:border-amber-950/40 shadow-xs hover:border-amber-500/50 dark:hover:shadow-[0_4px_20px_rgba(212,175,55,0.08)] transition cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 dark:bg-rose-400/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Wrench className="w-4 h-4" />
          </div>
          {kpis.emergencyMaintenanceCount > 0 ? (
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-500 animate-bounce" />
              <span>{kpis.emergencyMaintenanceCount} Urgent</span>
            </span>
          ) : (
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              Normal
            </span>
          )}
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-amber-100">
            {kpis.openMaintenanceTickets}{' '}
            <span className="text-xs font-normal text-slate-400 font-sans">Open</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Maintenance Requests
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-amber-950/30 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Avg Dispatch: 2.4 hrs</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">MEP Active</span>
        </div>
      </div>

      {/* 5. Bookings & Yield Rate */}
      <div
        onClick={() => onNavigateTab('bookings')}
        className="bg-white dark:bg-[#0c0e15] rounded-2xl p-4 border border-slate-200/80 dark:border-amber-950/40 shadow-xs hover:border-amber-500/50 dark:hover:shadow-[0_4px_20px_rgba(212,175,55,0.08)] transition cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <CalendarCheck2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-md">
            {kpis.averageYieldPercent}% Yield
          </span>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-amber-100">
            {kpis.scheduledVisitsCount}{' '}
            <span className="text-xs font-normal text-slate-400 font-sans">Visits</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Scheduled Site Tours
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-amber-950/30 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>3 Leads Ready to Sign</span>
          <span className="text-purple-600 dark:text-purple-400 font-medium">92% Tour Rating</span>
        </div>
      </div>
    </div>
  );
};
