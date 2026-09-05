import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Clock,
  CheckCircle2,
  Calendar,
  DollarSign,
  User,
  ShieldCheck,
  FileCheck2,
  AlertOctagon,
  FileText,
  ChevronLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TransactionHold, NavigationTab } from '../../types';

interface TransactionsViewProps {
  transactions: TransactionHold[];
  selectedTransaction: TransactionHold;
  setSelectedTransaction: (tx: TransactionHold) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onToast: (msg: string) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  selectedTransaction,
  setSelectedTransaction,
  onNavigateTab,
  onToast,
}) => {
  // Countdown simulation (47:12:05)
  const [secondsLeft, setSecondsLeft] = useState(47 * 3600 + 12 * 60 + 5);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateContract = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
    onToast(`Sales & Purchase Agreement (SPA) compiled for ${selectedTransaction.clientName}! Sent to DocuSign.`);
  };

  const handleExtendReservation = () => {
    setSecondsLeft((prev) => prev + 48 * 3600);
    onToast(`Reservation hold extended by +48 hours upon Director approval.`);
    setIsExtensionModalOpen(false);
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-5 animate-in fade-in duration-150">
      {/* Top Banner Card (Matching Image 6 Header) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-blue-600 text-white shadow-xs">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {selectedTransaction.unitCode} · {selectedTransaction.tower}
              </h1>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded">
                {selectedTransaction.status}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-1 flex-wrap">
              <span className="flex items-center gap-1 font-medium text-slate-900 dark:text-slate-200">
                <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                {selectedTransaction.clientName}
              </span>
              <span>•</span>
              <span className="text-slate-500 dark:text-slate-400">{selectedTransaction.salesAgent}</span>
              <span>•</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                ${selectedTransaction.totalValue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Expiry Countdown Box */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-right shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1">
            <Clock className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
            <span>Expiry Countdown</span>
          </div>
          <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400 tracking-tight mt-0.5">
            {formatCountdown(secondsLeft)}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Expires in 47h active window</div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Hold card & Reservation Card */}
        <div className="lg:col-span-8 space-y-4">
          {/* Hold Card (Status: COMPLETED) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Hold</h2>
                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                  {selectedTransaction.holdDetails.status}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {selectedTransaction.holdDetails.dateRange}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">
                  INITIAL HOLD DATE
                </label>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white">
                  {selectedTransaction.holdDetails.initialDate}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">
                  EXTENSIONS (MANAGER CONTROLLED)
                </label>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white">
                  {selectedTransaction.holdDetails.extensions}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">
                  HOLD EXPIRY
                </label>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white">
                  {selectedTransaction.holdDetails.expiryDate}
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setIsExtensionModalOpen(true)}
                  className="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition cursor-pointer"
                >
                  Request Extension
                </button>
              </div>
            </div>
          </div>

          {/* Reservation Card (Status: ACTIVE) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-blue-600/30 dark:border-blue-500/40 shadow-2xs p-5 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Reservation</h2>
                <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                  {selectedTransaction.reservationDetails.status}
                </span>
              </div>
            </div>

            {/* Metric boxes inside Reservation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">
                  RESERVATION FEE
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
                  ${selectedTransaction.reservationDetails.feePaid.toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> Paid
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">
                  PAYMENT PLAN
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
                  {selectedTransaction.reservationDetails.paymentPlan}
                </span>
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold mt-1 block cursor-pointer"
                >
                  View Schedule
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">
                  RESERVATION EXPIRY
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
                  {selectedTransaction.reservationDetails.expiryDate}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 block">
                  In {selectedTransaction.reservationDetails.daysRemaining} days
                </span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={handleCreateContract}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-xs transition active:scale-[0.98] cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Create Contract</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExtensionModalOpen(true)}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition cursor-pointer"
                >
                  Extend
                </button>
                <button
                  onClick={() => onToast('Reservation cancellation modal prompted with manager PIN.')}
                  className="px-4 py-2 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold rounded-lg transition cursor-pointer"
                >
                  Cancel Reservation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lifecycle Timeline */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Lifecycle Timeline</h2>
          </div>

          <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 pl-6 text-xs">
            {selectedTransaction.timeline.map((step) => (
              <div key={step.id} className="relative">
                <div
                  className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ring-2 ${
                    step.active ? 'bg-blue-600 ring-blue-200 dark:ring-blue-900' : 'bg-slate-400 ring-slate-200 dark:ring-slate-700'
                  }`}
                />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{step.title}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{step.timestamp}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">{step.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Payment Schedule — Standard 30/70
              </h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex justify-between">
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">1. Reservation Deposit (Paid)</span>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Wire transfer received</div>
                </div>
                <span className="font-mono font-bold text-emerald-900 dark:text-emerald-200">$25,000</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">2. Contract Signing (10%)</span>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Due upon SPA execution</div>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">$100,000</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">3. Construction Milestone (20%)</span>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Upon 50% structural completion</div>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">$250,000</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">4. Handover Balance (70%)</span>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Upon issuance of completion notice</div>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">$875,000</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extension Request Modal */}
      {isExtensionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Manager Hold Extension</h3>
              <button
                onClick={() => setIsExtensionModalOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Extend client validity by an additional +48 hours. This will update the reservation
              countdown and log an audit record.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsExtensionModalOpen(false)}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExtendReservation}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg cursor-pointer"
              >
                Grant Extension (+48h)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
