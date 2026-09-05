import React, { useState } from 'react';
import {
  Banknote,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Download,
  Send,
  CreditCard,
  Building,
  Receipt,
  Mail,
  Printer,
} from 'lucide-react';
import { RentInvoice, InvoiceStatus } from '../../types/rentalTypes';

interface RentalInvoicesTabProps {
  invoices: RentInvoice[];
  onOpenRecordPayment: () => void;
  onPayInvoice: (inv: RentInvoice) => void;
  onToast: (msg: string) => void;
}

export const RentalInvoicesTab: React.FC<RentalInvoicesTabProps> = ({
  invoices,
  onOpenRecordPayment,
  onPayInvoice,
  onToast,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.contractNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50';
      case 'Overdue':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-700/50';
      case 'Posted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-700/50';
      case 'Draft':
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
              placeholder="Search invoices by #, tenant, unit code..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-xs text-slate-900 dark:text-amber-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {['All', 'Paid', 'Posted', 'Overdue'].map((st) => (
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast('Generated bulk recurring invoices for upcoming billing cycle')}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            + Generate Invoices
          </button>
          <button
            onClick={onOpenRecordPayment}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Invoice Ledger Table */}
      <div className="bg-white dark:bg-[#0c0e15] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#121520] text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-amber-950/40 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Contract & Unit</th>
                <th className="py-3 px-4">Tenant</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-amber-950/30 text-slate-700 dark:text-slate-300">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-[#151926] transition"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-700 dark:text-amber-300">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {inv.unitCode}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{inv.contractNumber}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{inv.tenantName}</div>
                    <div className="text-[10px] text-slate-400">{inv.tenantEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className={inv.status === 'Overdue' ? 'text-rose-600 font-bold' : ''}>
                      {inv.dueDate}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 dark:text-amber-200">
                      AED {inv.totalDue.toLocaleString()}
                    </div>
                    {inv.lateFee > 0 && (
                      <div className="text-[10px] text-rose-500 font-medium">
                        +AED {inv.lateFee} Late Fee
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                        inv.status
                      )}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    {inv.paymentMethod ? (
                      <span className="font-medium text-slate-900 dark:text-slate-200">
                        {inv.paymentMethod} {inv.transactionRef ? `(${inv.transactionRef})` : ''}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Pending Collection</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {inv.status !== 'Paid' ? (
                        <>
                          <button
                            onClick={() => onPayInvoice(inv)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[11px] font-semibold transition"
                          >
                            Mark Paid
                          </button>
                          <button
                            onClick={() => onToast(`Rent reminder sent via WhatsApp to ${inv.tenantName}`)}
                            className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Send WhatsApp Reminder"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onToast(`Printing Official Tax Invoice Receipt ${inv.invoiceNumber}`)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-md text-[11px] font-semibold"
                        >
                          <Receipt className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      )}
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
