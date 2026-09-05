import React from 'react';
import {
  Search,
  Filter,
  Plus,
  LayoutDashboard,
  Kanban,
  Table as TableIcon,
  Calendar,
  Grid,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { RentalTab, RentalViewMode } from '../../types/rentalTypes';

interface RentalHeaderRibbonProps {
  activeRentalTab: RentalTab;
  setActiveRentalTab: (tab: RentalTab) => void;
  viewMode: RentalViewMode;
  setViewMode: (mode: RentalViewMode) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedFilter: string;
  setSelectedFilter: (f: string) => void;
  onOpenNewContract: () => void;
  onOpenNewUnit: () => void;
  onOpenNewMaintenance: () => void;
  onOpenRecordPayment: () => void;
  onOpenScheduleVisit: () => void;
  onToast: (msg: string) => void;
}

export const RentalHeaderRibbon: React.FC<RentalHeaderRibbonProps> = ({
  activeRentalTab,
  setActiveRentalTab,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  onOpenNewContract,
  onOpenNewUnit,
  onOpenNewMaintenance,
  onOpenRecordPayment,
  onOpenScheduleVisit,
  onToast,
}) => {
  const tabs: { id: RentalTab; label: string; badge?: string; isSpecial?: boolean }[] = [
    { id: 'techkhedut-showcase', label: '✦ Showcase Poster (RealEstate-2)', badge: 'Master Design', isSpecial: true },
    { id: 'contract-portal', label: 'Contract Portal (T/00006)', badge: 'Running' },
    { id: 'contracts-kanban', label: 'Contracts Pipeline', badge: 'Kanban' },
    { id: 'esign-portal', label: 'Digital E-Sign', badge: 'T/00007' },
    { id: 'gis-map', label: 'GIS Map & Analytics' },
    { id: 'overview', label: 'Overview & Analytics' },
    { id: 'properties', label: 'Properties & Units', badge: '61' },
    { id: 'contracts', label: 'Tenancy Contracts', badge: '51' },
    { id: 'invoices', label: 'Rent Invoices', badge: '1 Overdue' },
    { id: 'reminders', label: 'Reminders & Triggers', badge: '2 Pending' },
    { id: 'maintenance', label: 'Maintenance & Repairs', badge: '1 Alert' },
    { id: 'bookings', label: 'Site Visits & Tours', badge: '3' },
    { id: 'landlords', label: 'Landlords & Payouts' },
  ];

  return (
    <div className="bg-white dark:bg-[#090b10] border-b border-slate-200/80 dark:border-amber-950/40 sticky top-0 z-20 transition-colors duration-300">
      {/* Top Odoo App Title & Breadcrumbs Bar */}
      <div className="px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-amber-950/30">
        <div className="flex items-center gap-3">
          {/* Odoo Style App Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 rounded-lg text-amber-700 dark:text-amber-300 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Odoo 19.0 Rental Suite</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-amber-200/90">Rental Management</span>
            <span>/</span>
            <span className="font-bold text-slate-900 dark:text-amber-100 capitalize">
              {activeRentalTab.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewContract}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-500 dark:text-slate-950 dark:font-bold dark:hover:from-amber-400 dark:hover:to-yellow-400"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Tenancy Contract</span>
          </button>

          <button
            onClick={onOpenNewUnit}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-[#151926] dark:hover:bg-[#1d2233] dark:text-amber-200 dark:border dark:border-amber-950/60 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Property Unit</span>
          </button>

          <button
            onClick={onOpenNewMaintenance}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 dark:text-rose-300 dark:border dark:border-rose-800/40 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <span>Log Maintenance</span>
          </button>

          <button
            onClick={() => onToast('Exporting Odoo Rental Ledger to Excel/PDF...')}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Export Excel/PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Row + View Switcher */}
      <div className="px-5 py-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 overflow-x-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {tabs.map((tab) => {
            const isActive = activeRentalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveRentalTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-amber-950/70 dark:text-amber-300 dark:border dark:border-amber-500/40 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200 hover:bg-slate-100 dark:hover:bg-[#12151f]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      tab.badge.includes('Alert') || tab.badge.includes('Overdue')
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : isActive
                        ? 'bg-white/20 text-white dark:bg-amber-400/20 dark:text-amber-200'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* View Switchers (Odoo standard: Dashboard, Kanban, Table, Calendar, Pivot) */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#10131d] p-1 rounded-lg border border-slate-200/80 dark:border-amber-950/40 shrink-0">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`p-1.5 rounded-md text-xs transition cursor-pointer ${
              viewMode === 'dashboard'
                ? 'bg-white dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shadow-xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-amber-200'
            }`}
            title="Dashboard Overview"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-md text-xs transition cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shadow-xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-amber-200'
            }`}
            title="Kanban Cards"
          >
            <Kanban className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs transition cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shadow-xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-amber-200'
            }`}
            title="Table / Tree View"
          >
            <TableIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`p-1.5 rounded-md text-xs transition cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shadow-xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-amber-200'
            }`}
            title="Schedule Calendar"
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
