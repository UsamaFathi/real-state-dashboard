import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Calendar,
  BarChart2,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ChevronRight,
  Filter,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { TenancyContract } from '../../types/rentalTypes';

interface TechKhedutKanbanContractsViewProps {
  contracts: TenancyContract[];
  onSelectContract: (contract: TenancyContract) => void;
  onOpenNewContract: () => void;
  onToast: (msg: string) => void;
}

export const TechKhedutKanbanContractsView: React.FC<TechKhedutKanbanContractsViewProps> = ({
  contracts,
  onSelectContract,
  onOpenNewContract,
  onToast,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Running');
  const [selectedTermsFilter, setSelectedTermsFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Exact dataset items from the screenshot
  const kanbanItems = [
    {
      id: 'cnt-t00001',
      contractNumber: 'T/00001',
      tenantName: 'Neha Kulkarni',
      avatarBg: 'bg-emerald-600',
      initials: 'N',
      propertySubtitle: 'Residential · Skyline A-102',
      status: 'Running',
      rent: '$ 32,000.00 / Month',
      nextInvoice: 'Aug 1',
      outstanding: '$ 32,000.00',
      deposit: '$ 96,000.00',
      depositStatus: 'Held',
      elapsedPercent: 36,
      endsDate: 'ends Feb 28, 2027',
      isSigned: true,
      isApproved: true,
      paymentTerm: 'Monthly',
    },
    {
      id: 'cnt-t00002',
      contractNumber: 'T/00002',
      tenantName: 'Vikram Rao',
      avatarBg: 'bg-indigo-600',
      initials: 'V',
      propertySubtitle: 'Residential · Skyline A-205',
      status: 'Running',
      rent: '$ 20,500.00 / Month',
      nextInvoice: 'Aug 1',
      outstanding: '$ 21,927.80',
      deposit: '$ 61,500.00',
      depositStatus: 'Held',
      elapsedPercent: 75,
      endsDate: 'ends Oct 31',
      isSigned: true,
      isApproved: true,
      paymentTerm: 'Monthly',
    },
    {
      id: 'cnt-t00003',
      contractNumber: 'T/00003',
      tenantName: 'Karan Desai',
      avatarBg: 'bg-purple-600',
      initials: 'K',
      propertySubtitle: 'Residential · Skyline B-402',
      status: 'Running',
      rent: '$ 24,624.00 / Month',
      nextInvoice: 'Oct',
      outstanding: '$ 41,040.00',
      deposit: '$ 73,872.00',
      depositStatus: 'Held',
      elapsedPercent: 25,
      endsDate: 'ends Jan 31, 2027',
      isSigned: true,
      isApproved: true,
      paymentTerm: 'Quarterly',
    },
    {
      id: 'cnt-t00006',
      contractNumber: 'T/00006',
      tenantName: 'Karan Desai',
      avatarBg: 'bg-purple-600',
      initials: 'K',
      propertySubtitle: 'Residential · Skyline B-402',
      status: 'Running',
      rent: '$ 250.00 / Month',
      nextInvoice: 'Aug 1',
      outstanding: '$ 670.00',
      deposit: '$ 320.00',
      depositStatus: 'Held',
      elapsedPercent: 9,
      endsDate: 'ends May 31, 2027',
      isSigned: true,
      isApproved: true,
      paymentTerm: 'Monthly',
    },
  ];

  const filteredItems = kanbanItems.filter((item) => {
    const matchesSearch =
      item.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.propertySubtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTerms =
      selectedTermsFilter === 'All' || item.paymentTerm === selectedTermsFilter;
    return matchesSearch && matchesTerms;
  });

  return (
    <div className="space-y-3 max-w-7xl mx-auto text-slate-800 dark:text-slate-200">
      {/* Top Odoo 19 Navigation Ribbon matching screenshot */}
      <div className="bg-[#1e293b] text-slate-200 text-xs px-3 py-1.5 rounded-t-xl overflow-x-auto flex items-center gap-4 border-b border-slate-700 whitespace-nowrap shadow-xs">
        {[
          'Properties',
          'Dashboard',
          'Projects',
          'Leads',
          'Renting',
          'Selling',
          'Customers',
          'Vendors',
          'Costs',
          'Utilities',
          'Maintenances',
          'Employees',
          'Reports',
          'Configurations',
        ].map((menu, idx) => (
          <button
            key={idx}
            onClick={() => onToast(`Navigating to ${menu} module...`)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
              menu === 'Renting'
                ? 'bg-amber-600 text-white font-bold'
                : 'hover:bg-slate-700 hover:text-white'
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Control Bar: Breadcrumb + Search + View Switcher */}
      <div className="bg-white dark:bg-[#0c0e17] rounded-b-xl border border-slate-200/80 dark:border-amber-950/40 p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Contracts
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenNewContract}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Contract</span>
            </button>
          </div>
        </div>

        {/* Center Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contracts..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/40 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#151926] p-1 rounded-lg border border-slate-200 dark:border-amber-950/40">
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1 rounded text-xs cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-amber-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Kanban View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1 rounded text-xs cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-amber-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Filter Facets Panel + Right Kanban Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Filter Sidebar (matching screenshot STATUS and PAYMENT TERMS) */}
        <div className="md:col-span-3 space-y-4">
          <div className="bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 p-4 shadow-xs space-y-4 text-xs">
            {/* STATUS Section */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <span>STATUS</span>
                <Filter className="w-3 h-3" />
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'Close', count: 1 },
                  { label: 'Draft', count: 1 },
                  { label: 'Running', count: 4 },
                ].map((st) => (
                  <button
                    key={st.label}
                    onClick={() => {
                      setSelectedStatusFilter(st.label);
                      onToast(`Filtered contracts by status: ${st.label}`);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                      selectedStatusFilter === st.label
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold border border-amber-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#151926]'
                    }`}
                  >
                    <span>{st.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                      {st.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-slate-100 dark:border-amber-950/30" />

            {/* PAYMENT TERMS Section */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <span>PAYMENT TERMS</span>
                <Layers className="w-3 h-3" />
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'All', count: 6 },
                  { label: 'Monthly', count: 5 },
                  { label: 'Quarterly', count: 1 },
                ].map((term) => (
                  <button
                    key={term.label}
                    onClick={() => {
                      setSelectedTermsFilter(term.label);
                      onToast(`Filtered payment terms: ${term.label}`);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                      selectedTermsFilter === term.label
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-bold border border-blue-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#151926]'
                    }`}
                  >
                    <span>{term.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                      {term.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Kanban Cards Grid (matching screenshot) */}
        <div className="md:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filteredItems.map((item) => {
              const matchedContract = contracts.find(
                (c) => c.contractNumber === item.contractNumber
              ) || contracts[0];

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectContract(matchedContract)}
                  className="bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 p-4 shadow-xs hover:shadow-md hover:border-amber-500/50 transition cursor-pointer space-y-3 group"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/30 pb-2">
                    <span className="font-mono font-bold text-xs text-amber-700 dark:text-amber-300">
                      {item.contractNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                      {item.status}
                    </span>
                  </div>

                  {/* Tenant & Property Info */}
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 ${item.avatarBg}`}
                    >
                      {item.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.tenantName}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {item.propertySubtitle}
                      </div>
                    </div>
                  </div>

                  {/* Badges row: Approved & Signed */}
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded font-semibold flex items-center gap-1">
                      ✓ Approved
                    </span>
                    <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded font-semibold flex items-center gap-1">
                      ✓ Signed
                    </span>
                  </div>

                  {/* Financial Fields */}
                  <div className="space-y-1.5 text-[11px] bg-slate-50/70 dark:bg-[#151926] p-2.5 rounded-lg border border-slate-100 dark:border-amber-950/20">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Rent</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {item.rent}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Next Invoice</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.nextInvoice}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Outstanding</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                        {item.outstanding}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Deposit</span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                          {item.deposit}
                        </span>
                        <span className="text-[9px] px-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                          {item.depositStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Elapsed Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {item.elapsedPercent}% elapsed
                      </span>
                      <span>{item.endsDate}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${item.elapsedPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
