import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Plus,
  Search,
  CheckCircle2,
  Building,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SiteBooking, BookingStatus } from '../../types/rentalTypes';

interface RentalBookingsTabProps {
  bookings: SiteBooking[];
  onOpenScheduleVisit: () => void;
  onConvertBookingToContract: (booking: SiteBooking) => void;
  onToast: (msg: string) => void;
}

export const RentalBookingsTab: React.FC<RentalBookingsTabProps> = ({
  bookings,
  onOpenScheduleVisit,
  onConvertBookingToContract,
  onToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter((b) => {
    return (
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="bg-white dark:bg-[#0c0e15] rounded-2xl p-4 border border-slate-200/80 dark:border-amber-950/40 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search prospective tours by client, unit..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-xs text-slate-900 dark:text-amber-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <button
          onClick={onOpenScheduleVisit}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Site Tour</span>
        </button>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookings.map((b) => (
          <div
            key={b.id}
            className="bg-white dark:bg-[#0f121a] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-4 shadow-xs hover:border-purple-400 dark:hover:shadow-[0_4px_24px_rgba(168,85,247,0.1)] transition space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-purple-700 dark:text-purple-300">
                  {b.bookingNumber} • {b.unitCode}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {b.status}
                </span>
              </div>

              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
                {b.propertyName}
              </h4>

              <div className="p-2.5 bg-slate-50 dark:bg-[#151926] rounded-xl text-xs space-y-1">
                <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <span>{b.clientName}</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                    {b.visitTime}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>{b.clientPhone}</span>
                  <span>{b.visitDate}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {b.notes}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-amber-950/40 flex items-center justify-between gap-2">
              <div className="text-[10px] text-slate-400">
                Agent: <span className="font-semibold text-slate-700 dark:text-slate-300">{b.assignedAgent.name}</span>
              </div>

              <button
                onClick={() => onConvertBookingToContract(b)}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition"
              >
                <span>Convert to Lease</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
