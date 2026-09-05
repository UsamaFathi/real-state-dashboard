import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  AlertTriangle,
  Clock,
  Send,
  Wrench,
  CheckCircle2,
  FileText,
  DollarSign,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Calendar,
  Building,
  ArrowRight,
  PhoneCall,
  Mail,
  Zap,
} from 'lucide-react';
import {
  RentalUnit,
  TenancyContract,
  RentInvoice,
  MaintenanceWorkOrder,
  SiteBooking,
  RentalTab,
} from '../../types/rentalTypes';
import {
  rentalRevenueTrends,
  occupancyByTypeData,
  leaseExpirationCalendar,
} from '../../data/rentalData';

interface RentalOverviewTabProps {
  units: RentalUnit[];
  contracts: TenancyContract[];
  invoices: RentInvoice[];
  workOrders: MaintenanceWorkOrder[];
  bookings: SiteBooking[];
  onNavigateTab: (tab: RentalTab) => void;
  onOpenNewContract: () => void;
  onOpenNewUnit: () => void;
  onOpenNewMaintenance: () => void;
  onOpenRecordPayment: () => void;
  onSelectContract: (contract: TenancyContract) => void;
  onSelectWorkOrder: (order: MaintenanceWorkOrder) => void;
  onToast: (msg: string) => void;
}

export const RentalOverviewTab: React.FC<RentalOverviewTabProps> = ({
  units,
  contracts,
  invoices,
  workOrders,
  bookings,
  onNavigateTab,
  onOpenNewContract,
  onOpenNewUnit,
  onOpenNewMaintenance,
  onOpenRecordPayment,
  onSelectContract,
  onSelectWorkOrder,
  onToast,
}) => {
  const overdueInvoices = invoices.filter((i) => i.status === 'Overdue');
  const emergencyWorkOrders = workOrders.filter((w) => w.urgency === 'Emergency' || w.status === 'In Progress');
  const expiringContracts = contracts.filter((c) => c.status === 'Expiring Soon');

  const formatAED = (val: number) => `AED ${(val / 1000).toFixed(0)}k`;

  return (
    <div className="space-y-6">
      {/* 1. Urgent Attention Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Overdue Rent Callouts */}
        <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <h3 className="font-bold text-xs text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                Overdue Rent Invoices ({overdueInvoices.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('invoices')}
              className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 hover:underline flex items-center gap-0.5"
            >
              <span>View Invoices</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {overdueInvoices.length > 0 ? (
            overdueInvoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white dark:bg-[#12080a] border border-rose-100 dark:border-rose-950/60 rounded-xl p-3 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-rose-700 dark:text-rose-300">
                    {inv.unitCode} • {inv.invoiceNumber}
                  </span>
                  <span className="font-bold font-mono text-slate-900 dark:text-rose-200">
                    AED {inv.totalDue.toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>{inv.tenantName}</span>
                  <span className="text-rose-600 dark:text-rose-400 font-medium">Due {inv.dueDate}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-rose-50 dark:border-rose-950/40">
                  <button
                    onClick={() => onToast(`Sent WhatsApp & Email rent reminder to ${inv.tenantName}`)}
                    className="flex-1 py-1 px-2 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-[10px] font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Reminder</span>
                  </button>
                  <button
                    onClick={onOpenRecordPayment}
                    className="py-1 px-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-md text-[10px] font-semibold transition"
                  >
                    Record Payment
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-rose-700 dark:text-rose-300">
              No overdue rent invoices pending!
            </div>
          )}
        </div>

        {/* Emergency & Active Maintenance */}
        <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="font-bold text-xs text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                Emergency Work Orders ({emergencyWorkOrders.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('maintenance')}
              className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-0.5"
            >
              <span>Field Service</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {emergencyWorkOrders.slice(0, 1).map((order) => (
            <div
              key={order.id}
              onClick={() => onSelectWorkOrder(order)}
              className="bg-white dark:bg-[#120f09] border border-amber-100 dark:border-amber-950/60 rounded-xl p-3 shadow-2xs space-y-2 cursor-pointer hover:border-amber-400 transition"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
                  {order.ticketNumber} • {order.unitCode}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 uppercase">
                  {order.urgency}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-amber-100 line-clamp-1">
                {order.title}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-amber-50 dark:border-amber-950/40">
                <span>Tech: {order.assignedTechnician.name}</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">{order.scheduledDate}</span>
              </div>
            </div>
          ))}

          <button
            onClick={onOpenNewMaintenance}
            className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Dispatch MEP Technician</span>
          </button>
        </div>

        {/* Leases Expiring in 30 Days */}
        <div className="bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-xs text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                Leases Expiring Soon ({expiringContracts.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('contracts')}
              className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 hover:underline flex items-center gap-0.5"
            >
              <span>Renewals</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {expiringContracts.slice(0, 1).map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectContract(c)}
              className="bg-white dark:bg-[#0a0f16] border border-blue-100 dark:border-blue-950/60 rounded-xl p-3 shadow-2xs space-y-2 cursor-pointer hover:border-blue-400 transition"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
                  {c.unitCode} • {c.contractNumber}
                </span>
                <span className="text-[11px] font-bold font-mono text-slate-900 dark:text-blue-100">
                  AED {c.monthlyRent.toLocaleString()}/mo
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                <span>Tenant: {c.tenantName}</span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">Ends {c.endDate}</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-blue-50 dark:border-blue-950/40">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToast(`Generated +5% Escalation Renewal Contract for ${c.tenantName}`);
                  }}
                  className="flex-1 py-1 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[10px] font-semibold transition"
                >
                  Draft 1-Yr Renewal
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToast(`Notice of Vacate transmitted for ${c.unitCode}`);
                  }}
                  className="py-1 px-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-medium"
                >
                  List Available
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Rent Collection vs Target Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0c0e15] rounded-2xl p-5 border border-slate-200/80 dark:border-amber-950/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-amber-100">
                Monthly Rent Collection & Operating Expenses
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time collection vs monthly benchmark in AED (YTD Performance)
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Collected Rent</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 inline-block" />
                <span>Target</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rentalRevenueTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={formatAED}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0e15',
                    borderColor: '#78350f',
                    borderRadius: '12px',
                    color: '#fef3c7',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`AED ${Number(value).toLocaleString()}`, '']}
                />
                <Bar dataKey="collected" fill="#d4af37" radius={[6, 6, 0, 0]} barSize={24} name="Collected Rent" />
                <Bar dataKey="target" fill="#334155" radius={[6, 6, 0, 0]} barSize={16} name="Target Rent" opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Occupancy by Category Donut Chart (1 col) */}
        <div className="bg-white dark:bg-[#0c0e15] rounded-2xl p-5 border border-slate-200/80 dark:border-amber-950/40 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-amber-100">
              Occupancy by Property Class
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Unit allocation across luxury asset classes
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {occupancyByTypeData.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-amber-200">
                    {item.occupied}/{item.total} ({item.value}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-amber-950/40 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Total Portfolio:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              88.5% Occupancy Rate
            </span>
          </div>
        </div>
      </div>

      {/* 3. Upcoming Renewal Schedule & Quick Booking Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Renewal Forecasting Timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0c0e15] rounded-2xl p-5 border border-slate-200/80 dark:border-amber-950/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-amber-100">
                Lease Expiration & Renewal Schedule
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Anticipated expiries and cash flow roll-over
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('contracts')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Contracts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {leaseExpirationCalendar.map((item) => (
              <div
                key={item.month}
                className="p-3 bg-slate-50 dark:bg-[#10131d] rounded-xl border border-slate-200/60 dark:border-amber-950/30 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-amber-200">
                  <span>{item.month}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono">
                    {item.count} Leases
                  </span>
                </div>
                <div className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {item.value}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Units: {item.units.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Site Visit Inspections */}
        <div className="bg-white dark:bg-[#0c0e15] rounded-2xl p-5 border border-slate-200/80 dark:border-amber-950/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-amber-100">
                Scheduled Site Tours
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Prospective tenant viewings
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              All Tours
            </button>
          </div>

          <div className="space-y-2.5">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#10131d] border border-slate-200/60 dark:border-amber-950/30 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 dark:text-amber-100 truncate max-w-[140px]">
                    {b.clientName}
                  </span>
                  <span className="font-mono text-[11px] text-amber-600 dark:text-amber-300 font-semibold">
                    {b.visitTime}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span className="font-mono">{b.unitCode}</span>
                  <span className="text-slate-400">{b.visitDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
