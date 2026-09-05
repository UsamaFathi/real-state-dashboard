import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  User,
  Phone,
  Building,
  DollarSign,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { MaintenanceWorkOrder, MaintenanceStatus, MaintenanceUrgency } from '../../types/rentalTypes';

interface RentalMaintenanceTabProps {
  workOrders: MaintenanceWorkOrder[];
  selectedWorkOrder: MaintenanceWorkOrder | null;
  setSelectedWorkOrder: (order: MaintenanceWorkOrder | null) => void;
  onOpenNewMaintenance: () => void;
  onUpdateStatus: (id: string, newStatus: MaintenanceStatus) => void;
  onToast: (msg: string) => void;
}

export const RentalMaintenanceTab: React.FC<RentalMaintenanceTabProps> = ({
  workOrders,
  selectedWorkOrder,
  setSelectedWorkOrder,
  onOpenNewMaintenance,
  onUpdateStatus,
  onToast,
}) => {
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredOrders = workOrders.filter((w) => {
    const matchesUrgency = urgencyFilter === 'All' || w.urgency === urgencyFilter;
    const matchesSearch =
      w.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.assignedTechnician.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUrgency && matchesSearch;
  });

  const getUrgencyBadge = (urgency: MaintenanceUrgency) => {
    switch (urgency) {
      case 'Emergency':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/90 dark:text-rose-300 border-rose-300 dark:border-rose-700';
      case 'High':
        return 'bg-amber-100 text-amber-900 dark:bg-amber-950/90 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'Normal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/90 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'Low':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getStatusBadge = (status: MaintenanceStatus) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'New':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
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
              placeholder="Search work orders by ticket #, unit, issue, technician..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-xs text-slate-900 dark:text-amber-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {['All', 'Emergency', 'High', 'Normal', 'Low'].map((urg) => (
              <button
                key={urg}
                onClick={() => setUrgencyFilter(urg)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  urgencyFilter === urg
                    ? 'bg-slate-900 text-white dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-500/40'
                    : 'bg-slate-100 text-slate-600 dark:bg-[#121520] dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200'
                }`}
              >
                {urg}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenNewMaintenance}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Work Order</span>
        </button>
      </div>

      {/* Work Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedWorkOrder(order)}
            className="bg-white dark:bg-[#0f121a] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-4 shadow-xs hover:border-amber-500/40 dark:hover:shadow-[0_4px_24px_rgba(212,175,55,0.08)] transition cursor-pointer space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-amber-700 dark:text-amber-300">
                  {order.ticketNumber} • {order.unitCode}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getUrgencyBadge(
                    order.urgency
                  )}`}
                >
                  {order.urgency}
                </span>
              </div>

              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
                {order.title}
              </h4>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {order.description}
              </p>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-medium text-slate-700 dark:text-slate-300">
                  {order.category}
                </span>
                <span>• Reported {order.reportedDate}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-amber-950/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                    {order.assignedTechnician.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-[11px]">
                      {order.assignedTechnician.name}
                    </div>
                    <div className="text-[9px] text-slate-400">{order.assignedTechnician.company}</div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {order.status !== 'Resolved' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(order.id, 'Resolved');
                      onToast(`Work order ${order.ticketNumber} marked as Resolved!`);
                    }}
                    className="flex-1 py-1 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-semibold transition"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Inspection Completed</span>
                  </span>
                )}

                <span className="font-mono text-xs font-bold text-slate-900 dark:text-amber-200">
                  AED {order.actualCost > 0 ? order.actualCost : order.estimatedCost}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
