import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Download,
  Calendar,
  DollarSign,
  User,
  ShieldCheck,
  ChevronRight,
  Send,
  Building,
  CreditCard,
  FileCheck2,
} from 'lucide-react';
import { TenancyContract, ContractStatus } from '../../types/rentalTypes';

interface RentalContractsTabProps {
  contracts: TenancyContract[];
  selectedContract: TenancyContract | null;
  setSelectedContract: (contract: TenancyContract | null) => void;
  onOpenNewContract: () => void;
  onToast: (msg: string) => void;
}

export const RentalContractsTab: React.FC<RentalContractsTabProps> = ({
  contracts,
  selectedContract,
  setSelectedContract,
  onOpenNewContract,
  onToast,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredContracts = contracts.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSearch =
      c.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50';
      case 'Expiring Soon':
        return 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700/50';
      case 'Pending Signature':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-700/50';
      case 'Terminated':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="bg-white dark:bg-[#0c0e15] rounded-2xl p-4 border border-slate-200/80 dark:border-amber-950/40 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search contracts by #, tenant, unit code..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-xs text-slate-900 dark:text-amber-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {['All', 'Active', 'Expiring Soon', 'Pending Signature'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-500/40'
                    : 'bg-slate-100 text-slate-600 dark:bg-[#121520] dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenNewContract}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-500 dark:text-slate-950 dark:font-bold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Tenancy Contract</span>
        </button>
      </div>

      {/* Contracts Table List (Odoo Tree View) */}
      <div className="bg-white dark:bg-[#0c0e15] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#121520] text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-amber-950/40 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Contract #</th>
                <th className="py-3 px-4">Property & Unit</th>
                <th className="py-3 px-4">Tenant</th>
                <th className="py-3 px-4">Lease Term</th>
                <th className="py-3 px-4">Payment Cycle</th>
                <th className="py-3 px-4">Rent Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-amber-950/30 text-slate-700 dark:text-slate-300">
              {filteredContracts.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedContract(c)}
                  className="hover:bg-slate-50/80 dark:hover:bg-[#151926] transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-700 dark:text-amber-300">
                    {c.contractNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {c.propertyName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {c.unitCode} • {c.propertyCategory}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={c.tenantAvatar}
                        alt={c.tenantName}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-amber-950"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{c.tenantName}</div>
                        <div className="text-[10px] text-slate-400">{c.tenantPhone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-900 dark:text-slate-200">
                      {c.startDate} → {c.endDate}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.durationMonths} Months Lease</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[11px] font-medium">
                      {c.paymentFrequency}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 dark:text-amber-200">
                      AED {c.monthlyRent.toLocaleString()}
                      <span className="text-[10px] font-normal text-slate-400">/mo</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      AED {c.annualRent.toLocaleString()}/yr
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToast(`Downloaded Ejari Tenancy Agreement PDF for ${c.contractNumber}`);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-amber-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContract(c);
                        }}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md text-xs font-semibold"
                      >
                        Installments ({c.paymentSchedule.length})
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
