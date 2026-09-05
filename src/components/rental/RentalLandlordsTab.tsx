import React, { useState } from 'react';
import {
  User,
  Building,
  DollarSign,
  CheckCircle2,
  Clock,
  Send,
  Download,
  CreditCard,
  Percent,
  Search,
} from 'lucide-react';
import { LandlordOwner } from '../../types/rentalTypes';

interface RentalLandlordsTabProps {
  landlords: LandlordOwner[];
  onProcessPayout: (id: string) => void;
  onToast: (msg: string) => void;
}

export const RentalLandlordsTab: React.FC<RentalLandlordsTabProps> = ({
  landlords,
  onProcessPayout,
  onToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLandlords = landlords.filter((l) => {
    return (
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(searchTerm.toLowerCase()))
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
            placeholder="Search landlord accounts, trust entities..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-xs text-slate-900 dark:text-amber-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <button
          onClick={() => onToast('Generated Landlord Monthly Statement Pack (PDF/Zip)')}
          className="px-3.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition"
        >
          Download All Payout Statements
        </button>
      </div>

      {/* Landlords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLandlords.map((owner) => (
          <div
            key={owner.id}
            className="bg-white dark:bg-[#0f121a] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-xs hover:border-amber-500/40 transition space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={owner.avatar}
                  alt={owner.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-500/30"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-amber-100">
                    {owner.name}
                  </h4>
                  {owner.company && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">{owner.company}</div>
                  )}
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{owner.phone}</div>
                </div>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  owner.payoutStatus === 'Processed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {owner.payoutStatus}
              </span>
            </div>

            {/* Financial Breakdown Block */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-[#151926] rounded-xl border border-slate-100 dark:border-amber-950/30 text-xs">
              <div>
                <div className="text-[10px] text-slate-400">Gross Rent (Mo)</div>
                <div className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  AED {owner.grossMonthlyRent.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Mgmt Fee ({owner.commissionPercent}%)</div>
                <div className="font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  -AED {((owner.grossMonthlyRent * owner.commissionPercent) / 100).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Net Monthly Payout</div>
                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  AED {owner.netMonthlyPayout.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>Managed Units: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{owner.unitsList.join(', ')}</span></span>
              <span>Last Disbursed: {owner.lastPayoutDate}</span>
            </div>

            {/* Card Footer Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-amber-950/40 flex items-center justify-between gap-2">
              <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                {owner.bankAccount}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToast(`Generated P&L Tax statement for ${owner.name}`)}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition"
                >
                  Statement
                </button>
                {owner.payoutStatus !== 'Processed' && (
                  <button
                    onClick={() => {
                      onProcessPayout(owner.id);
                      onToast(`Disbursed AED ${owner.netMonthlyPayout.toLocaleString()} to ${owner.name}`);
                    }}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Disburse Payout
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
