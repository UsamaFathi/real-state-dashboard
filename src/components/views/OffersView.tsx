import React, { useState } from 'react';
import {
  FileSignature,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Calendar,
  DollarSign,
  AlertCircle,
  RotateCcw,
  Save,
  Send,
  User,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OfferApproval, NavigationTab } from '../../types';

interface OffersViewProps {
  offers: OfferApproval[];
  selectedOffer: OfferApproval;
  setSelectedOffer: (offer: OfferApproval) => void;
  onApproveOffer?: (offerId: string) => void;
  onRejectOffer?: (offerId: string) => void;
  onUpdateOffer?: (offer: OfferApproval) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onToast: (msg: string) => void;
}

export const OffersView: React.FC<OffersViewProps> = ({
  offers,
  selectedOffer,
  setSelectedOffer,
  onApproveOffer,
  onRejectOffer,
  onUpdateOffer,
  onNavigateTab,
  onToast,
}) => {
  const [customerName, setCustomerName] = useState(selectedOffer.customerName);
  const [oppRef, setOppRef] = useState(selectedOffer.opportunityRef);
  const [unitTitle, setUnitTitle] = useState(selectedOffer.unitTitle);
  const [offerValidity, setOfferValidity] = useState(selectedOffer.expiresIn || '2026-11-30');
  const [paymentPlan, setPaymentPlan] = useState(selectedOffer.paymentTerms || 'Custom 30/70 (Extended)');
  const [discountPercent, setDiscountPercent] = useState<number>(selectedOffer.discountPercent);

  // Rejection Dialog State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Calculations
  const systemPrice = selectedOffer.systemPrice;
  const discountAmount = (systemPrice * discountPercent) / 100;
  const finalOfferPrice = systemPrice - discountAmount;

  const handleApprove = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }

    if (onApproveOffer) {
      onApproveOffer(selectedOffer.id);
    }
  };

  const handleReject = () => {
    if (!rejectReason) {
      onToast('Please specify a rejection reason');
      return;
    }
    if (onRejectOffer) {
      onRejectOffer(selectedOffer.id);
    }
    setIsRejectModalOpen(false);
  };

  const handleSaveDraft = () => {
    onToast('Draft parameters saved successfully.');
  };

  const handleSubmitNewRevision = () => {
    const updated: OfferApproval = {
      ...selectedOffer,
      customerName,
      opportunityRef: oppRef,
      unitTitle,
      paymentTerms: paymentPlan,
      discountPercent,
      discountAmount,
      finalOfferPrice,
      status: discountPercent > 5 ? 'Approval Required' : 'Approved',
      auditHistory: [
        {
          timestamp: 'Just now',
          action: 'New Revision Submitted',
          actor: 'Current User',
          note: `Requested discount: ${discountPercent}%`,
        },
        ...selectedOffer.auditHistory,
      ],
    };
    if (onUpdateOffer) {
      onUpdateOffer(updated);
    }
    setSelectedOffer(updated);
    onToast(`New revision for ${selectedOffer.offerCode} submitted for approval review.`);
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-4 animate-in fade-in duration-150 pb-20">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
            <span
              onClick={() => onNavigateTab('command-center')}
              className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Offers
            </span>
            <span>›</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedOffer.offerCode}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Offer & Approval Workflow
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                selectedOffer.status === 'Approved'
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                  : selectedOffer.status === 'Rejected'
                  ? 'bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-300'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedOffer.status === 'Approved'
                    ? 'bg-emerald-500'
                    : selectedOffer.status === 'Rejected'
                    ? 'bg-red-500'
                    : 'bg-red-500 animate-pulse'
                }`}
              />
              {selectedOffer.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage commercial terms and approval lifecycle for {selectedOffer.unitTitle}.
          </p>
        </div>

        {/* Offer Selector if multiple */}
        {offers.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Switch Offer:</span>
            <select
              value={selectedOffer.id}
              onChange={(e) => {
                const off = offers.find((o) => o.id === e.target.value);
                if (off) {
                  setSelectedOffer(off);
                  setCustomerName(off.customerName);
                  setOppRef(off.opportunityRef);
                  setUnitTitle(off.unitTitle);
                  setPaymentPlan(off.paymentTerms);
                  setDiscountPercent(off.discountPercent);
                }
              }}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {offers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.offerCode} — {o.customerName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Commercial Offer Details & Financial Summary */}
        <div className="lg:col-span-8 space-y-4">
          {/* Commercial Offer Details Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Commercial Offer Details</h2>
              </div>
              <span className="text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                Ref #{selectedOffer.offerCode}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Customer */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Customer
                </label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="w-6 h-6 rounded bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {selectedOffer.customerInitials || 'AC'}
                  </div>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="flex-1 bg-transparent font-medium text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Opportunity Reference */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Opportunity Reference
                </label>
                <input
                  type="text"
                  value={oppRef}
                  onChange={(e) => setOppRef(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              {/* Offer Validity */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Offer Validity
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={offerValidity}
                    onChange={(e) => setOfferValidity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Payment Plan */}
            <div className="text-xs pt-2">
              <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Payment Plan
              </label>
              <select
                value={paymentPlan}
                onChange={(e) => setPaymentPlan(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
              >
                <option>Custom 30/70 (Extended)</option>
                <option>Standard 40/60 (On Handover)</option>
                <option>Bullet 10/90 Institutional</option>
                <option>Equal Quarterly 20/80</option>
              </select>
            </div>
          </div>

          {/* Financial Summary Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Financial Summary</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* System Price */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 block">
                  System Price
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1 block">
                  ${systemPrice.toLocaleString()}
                </span>
              </div>

              {/* Requested Discount with dynamic slider/input */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 block">
                  Requested Discount
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-bold text-red-600 dark:text-red-400 font-mono">
                    {discountPercent.toFixed(1)}%
                  </span>
                  <span className="text-xs font-mono text-red-500 dark:text-red-400">
                    -${Math.round(discountAmount).toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value))}
                  className="w-full mt-2 accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Final Offer Price (Highlighted Blue Box) */}
              <div className="p-4 rounded-xl bg-blue-600 dark:bg-blue-700 text-white shadow-md shadow-blue-500/20">
                <span className="text-[11px] font-semibold uppercase text-blue-100 block">
                  Final Offer Price
                </span>
                <span className="text-2xl font-bold font-mono tracking-tight mt-1 block">
                  ${Math.round(finalOfferPrice).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Approval Request & Approval History */}
        <div className="lg:col-span-4 space-y-4">
          {/* Approval Request Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Approval Request</h2>
              </div>
              <span className="text-[11px] bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-semibold px-2 py-0.5 rounded">
                Pending Approval
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Offer Code:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {selectedOffer.offerCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Requested By:</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedOffer.requestedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Expires In:</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedOffer.expiresIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Margin Yield:</span>
                <span className="font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded">
                  {selectedOffer.marginYieldImpact}
                </span>
              </div>
            </div>

            {/* Justification Quote */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase block mb-1">
                Justification:
              </span>
              <p className="text-slate-700 dark:text-slate-300 italic">&ldquo;{selectedOffer.justification}&rdquo;</p>
            </div>

            {/* Action Buttons: Reject vs Approve */}
            {selectedOffer.status === 'Approval Required' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="btn-reject-offer"
                  onClick={() => setIsRejectModalOpen(true)}
                  className="py-2 px-3 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 font-semibold text-xs rounded-lg transition active:scale-[0.98] cursor-pointer"
                >
                  Reject
                </button>
                <button
                  id="btn-approve-offer"
                  onClick={handleApprove}
                  className="py-2 px-3 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs rounded-lg shadow-xs transition active:scale-[0.98] cursor-pointer"
                >
                  Approve
                </button>
              </div>
            )}
          </div>

          {/* Approval History Timeline Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Audit History</h2>

            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 pl-6 text-xs">
              {selectedOffer.auditHistory?.map((h, i) => (
                <div key={i} className="relative">
                  <div
                    className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ring-2 bg-blue-500 ring-blue-200 dark:ring-blue-900"
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{h.action}</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                    Actor: {h.actor}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">{h.timestamp}</div>
                  {h.note && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">&ldquo;{h.note}&rdquo;</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-[260px] right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between z-20 shadow-lg transition-colors duration-300">
        <span className="text-xs text-slate-400 dark:text-slate-500">Commercial approval governance active</span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Save Draft
          </button>
          <button
            onClick={handleSubmitNewRevision}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            Submit New Revision
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Reject Offer Revision</h3>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Provide feedback for the sales director regarding why this commercial discount was
              declined.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Too steep for this asset class. Max margin threshold is 4.5% for commercial units."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs focus:outline-hidden focus:border-red-600"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
