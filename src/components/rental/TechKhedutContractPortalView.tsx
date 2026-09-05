import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileCheck2,
  Phone,
  Mail,
  User,
  Building,
  Calendar,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  Wrench,
  Download,
  Share2,
  CheckCircle2,
  Search,
  ExternalLink,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { TenancyContract } from '../../types/rentalTypes';
import confetti from 'canvas-confetti';

interface TechKhedutContractPortalViewProps {
  contract?: TenancyContract;
  onNavigateTab?: (tab: string) => void;
  onOpenNewContract?: () => void;
  onToast: (msg: string) => void;
}

export const TechKhedutContractPortalView: React.FC<TechKhedutContractPortalViewProps> = ({
  contract,
  onNavigateTab,
  onOpenNewContract,
  onToast,
}) => {
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isInstallmentsModalOpen, setIsInstallmentsModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'bank' | 'cheque'>('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Default contract data matching the screenshot if not provided
  const activeContract = contract || {
    id: 'cnt-t00006',
    contractNumber: 'T/00006',
    unitCode: 'Skyline B-402',
    propertyName: 'Skyline B-402',
    propertyCategory: 'Apartment',
    tenantName: 'Karan Desai',
    tenantEmail: 'karan.desai@example.com',
    tenantPhone: '+1 555-555-5556',
    tenantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    landlordName: 'Rajesh Mehta',
    startDate: '07/01/2026',
    endDate: '05/31/2027',
    durationMonths: 11,
    monthlyRent: 250,
    annualRent: 2750,
    paymentFrequency: 'Monthly' as const,
    securityDeposit: 320,
    commissionFee: 150,
    status: 'Active' as const,
    signatureStatus: 'Signed' as const,
    signedDate: '07/01/2026',
    autoRenewal: true,
    escalationPercent: 5,
    utilityInclusive: false,
    terms: 'Residential tenancy contract reference T/00006 for Skyline B-402, Ahmedabad.',
    paymentSchedule: [],
  };

  const outstandingAmount = isPaid ? 0 : 670;
  const paidToDate = isPaid ? 1170 : 500;

  const handlePayOutstanding = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaid(true);
      setIsPayModalOpen(false);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d97706', '#2563eb', '#10b981', '#f59e0b'],
      });
      onToast(`Payment of $670.00 settled successfully for contract ${activeContract.contractNumber}!`);
    }, 900);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-slate-800 dark:text-slate-200">
      {/* 1. Header Bar matching screenshot */}
      <div className="bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 px-4 py-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Breadcrumbs + Status */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onNavigateTab && onNavigateTab('contracts')}
            className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-300 font-medium cursor-pointer"
          >
            Rent contracts
          </button>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono">
            {activeContract.contractNumber}
          </span>
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            {activeContract.unitCode}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Running
          </span>
        </div>

        {/* Center/Right controls: Arrow navigators, Action buttons, Search & Contact */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-amber-950/40 bg-slate-50 dark:bg-[#151926] p-0.5">
            <button
              onClick={() => onToast('Navigated to previous contract T/00005')}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToast('Navigated to next contract T/00007')}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsPayModalOpen(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pay outstanding</span>
          </button>

          <button
            onClick={() => onToast(`Downloading official e-signed tenancy certificate for ${activeContract.contractNumber}...`)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#161a25] dark:hover:bg-amber-950/50 text-slate-700 dark:text-amber-200 border border-slate-200 dark:border-amber-950/50 rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Certificate</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-amber-950/40 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-mono text-slate-700 dark:text-slate-300 hidden md:inline">
              +1 555-555-5556
            </span>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-[#151926] rounded-lg border border-slate-200 dark:border-amber-950/40">
              <span className="font-semibold text-slate-900 dark:text-white">Karan Desai</span>
              <span className="text-[10px] text-slate-400">▾</span>
            </div>
            <button
              onClick={() => onToast('Opening customer service support ticket...')}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Contract Banner Card + Right Sidebar (matching screenshot layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left / Center 8 Columns: Hero Contract Details & Timeline */}
        <div className="lg:col-span-8 space-y-4">
          {/* Hero Dark/Navy Gradient Card */}
          <div className="bg-gradient-to-br from-[#0c0e17] via-[#121624] to-[#0a0d14] text-white rounded-2xl border border-amber-950/50 p-5 shadow-lg relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top row: Contract ID & Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-950/40 pb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-extrabold tracking-tight font-mono text-white">
                  {activeContract.contractNumber}
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/50">
                    11 Months
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/50">
                    Monthly
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Running
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Signed & verified
                </span>
              </div>
            </div>

            {/* Middle row: Property Info + Radial Gauge */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-4 items-center">
              {/* Property Image & Details */}
              <div className="sm:col-span-8 flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80"
                  alt="Skyline B-402"
                  className="w-16 h-16 rounded-xl object-cover border border-amber-950/60 shadow-md shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {activeContract.propertyName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <span>📍 Ahmedabad</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-300 border border-amber-500/20">
                      Residential
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700/50">
                      Apartment
                    </span>
                  </div>
                </div>
              </div>

              {/* Radial Progress Gauge (matching screenshot 9% ELAPSED, 304 days remaining, Next Payment 08/01/2026) */}
              <div className="sm:col-span-4 flex items-center justify-end">
                <div className="flex items-center gap-3 bg-[#080a10]/80 border border-amber-950/40 rounded-xl p-2.5">
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-amber-500"
                        strokeDasharray="9, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-[11px] font-extrabold text-amber-400 font-mono">
                      9%
                    </div>
                  </div>
                  <div className="text-left leading-tight">
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      9% ELAPSED
                    </div>
                    <div className="text-[11px] font-semibold text-slate-300 mt-0.5">
                      304 days
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">
                      NEXT: 08/01/2026
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Field Columns Grid (matching screenshot: TENANT, LANDLORD, LEASE TERM, MONTHLY RENT, OUTSTANDING, SECURITY DEPOSIT, PAID TO DATE) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-amber-950/40 text-xs">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  TENANT
                </div>
                <div className="font-bold text-white mt-0.5 truncate">{activeContract.tenantName}</div>
                <div className="text-[11px] text-slate-400 truncate">{activeContract.tenantEmail}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  LANDLORD
                </div>
                <div className="font-bold text-white mt-0.5 truncate">{activeContract.landlordName}</div>
                <div className="text-[11px] text-slate-400">Owner / Lessor</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  LEASE TERM
                </div>
                <div className="font-bold text-white mt-0.5">07/01/2026 to 05/31/2027</div>
                <div className="text-[11px] text-slate-400">11 Months Duration</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  MONTHLY RENT
                </div>
                <div className="font-bold text-amber-400 font-mono text-sm mt-0.5">
                  $ 250.00
                </div>
                <div className="text-[11px] text-slate-400">Every 1st of month</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                  OUTSTANDING
                </div>
                <div className={`font-bold font-mono text-sm mt-0.5 ${isPaid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  $ {outstandingAmount.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400">{isPaid ? 'Fully Settled' : 'Unpaid invoiced amount'}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  SECURITY DEPOSIT
                </div>
                <div className="font-bold text-white font-mono text-sm mt-0.5">
                  $ 320.00
                </div>
                <div className="text-[11px] text-slate-400">Held in Escrow</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  PAID TO DATE
                </div>
                <div className="font-bold text-emerald-400 font-mono text-sm mt-0.5">
                  $ {paidToDate.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400">{isPaid ? '100% of invoiced' : '43% of invoiced'}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  DAYS REMAINING
                </div>
                <div className="font-bold text-amber-300 font-mono text-sm mt-0.5">
                  304 days
                </div>
                <div className="text-[11px] text-slate-400">Ends 05/31/2027</div>
              </div>
            </div>

            {/* Lease Progress Milestones Bar (matching screenshot: Created 01 Jul -> Approved -> Signed 01 Jul -> Active 01 Jul -> Completed 01 May 2027) */}
            <div className="pt-4 mt-4 border-t border-amber-950/40">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Lease Progress
                </span>
                <span className="text-[11px] font-mono font-bold text-amber-400">
                  9% · 31 of 335 days
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 relative">
                {[
                  { title: 'Created', date: '01 Jul', status: 'done' },
                  { title: 'Approved', date: '01 Jul', status: 'done' },
                  { title: 'Signed', date: '01 Jul', status: 'done' },
                  { title: 'Active', date: '01 Jul', status: 'active' },
                  { title: 'Completed', date: '01 May 2027', status: 'upcoming' },
                ].map((step, idx) => (
                  <div key={idx} className="text-center group cursor-default">
                    <div className="flex items-center justify-center mb-1">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          step.status === 'done' || step.status === 'active'
                            ? 'bg-amber-500 text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        ✓
                      </div>
                    </div>
                    <div
                      className={`text-[11px] font-bold ${
                        step.status === 'done' || step.status === 'active'
                          ? 'text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono">{step.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4 Stat Cards Row (matching screenshot: $ 250.00 Monthly rent, $ 670.00 Outstanding, $ 500.00 Paid to date, 304 days Remaining duration) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 shadow-xs space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Monthly rent</span>
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                $ 250.00
              </div>
              <div className="text-[10px] text-slate-400">Monthly billing frequency</div>
            </div>

            <div className="p-3.5 bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 shadow-xs space-y-1">
              <div className="flex items-center gap-1.5 text-rose-500">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase">Outstanding</span>
              </div>
              <div className={`text-base font-extrabold font-mono ${isPaid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                $ {outstandingAmount.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400">{isPaid ? 'Settled' : 'Unpaid invoiced amount'}</div>
            </div>

            <div className="p-3.5 bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 shadow-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-500">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Paid to date</span>
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                $ {paidToDate.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400">{isPaid ? '100% of invoiced' : '43% of invoiced'}</div>
            </div>

            <div className="p-3.5 bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 shadow-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase">Remaining duration</span>
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                304 <span className="text-xs font-normal text-slate-500">days</span>
              </div>
              <div className="text-[10px] text-slate-400">Ends 05/31/2027</div>
            </div>
          </div>

          {/* Quick Actions Grid (matching screenshot: View instalments, Make a payment, Raise a maintenance request, Message the landlord, Signed certificate) */}
          <div className="bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 p-4 shadow-xs space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Quick Actions
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Everything you can do on this lease agreement
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              <button
                onClick={() => setIsInstallmentsModalOpen(true)}
                className="p-3 rounded-xl border border-slate-200 dark:border-amber-950/40 bg-slate-50/70 dark:bg-[#121520] hover:bg-slate-100 dark:hover:bg-[#161a28] transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-xs">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>View instalments</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  12 scheduled payments & history
                </div>
              </button>

              <button
                onClick={() => setIsPayModalOpen(true)}
                className="p-3 rounded-xl border border-slate-200 dark:border-amber-950/40 bg-slate-50/70 dark:bg-[#121520] hover:bg-slate-100 dark:hover:bg-[#161a28] transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-xs">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <span>Make a payment</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Settle the outstanding balance
                </div>
              </button>

              <button
                onClick={() => setIsMaintenanceModalOpen(true)}
                className="p-3 rounded-xl border border-slate-200 dark:border-amber-950/40 bg-slate-50/70 dark:bg-[#121520] hover:bg-slate-100 dark:hover:bg-[#161a28] transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-xs">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  <span>Raise a maintenance request</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Report a repair for this property
                </div>
              </button>

              <button
                onClick={() => setIsMessageModalOpen(true)}
                className="p-3 rounded-xl border border-slate-200 dark:border-amber-950/40 bg-slate-50/70 dark:bg-[#121520] hover:bg-slate-100 dark:hover:bg-[#161a28] transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-xs">
                  <MessageSquare className="w-4 h-4 text-purple-500" />
                  <span>Message the landlord</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Contact {activeContract.landlordName}
                </div>
              </button>

              <button
                onClick={() => onToast(`Downloading signed digital certificate for ${activeContract.contractNumber}...`)}
                className="p-3 rounded-xl border border-slate-200 dark:border-amber-950/40 bg-slate-50/70 dark:bg-[#121520] hover:bg-slate-100 dark:hover:bg-[#161a28] transition text-left cursor-pointer group sm:col-span-2 md:col-span-2"
              >
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-xs">
                  <Download className="w-4 h-4 text-cyan-500" />
                  <span>Signed certificate</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Download the official cryptographic e-sign proof & PDF contract
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Outstanding Balance card, AT A GLANCE, WHO TO CONTACT */}
        <div className="lg:col-span-4 space-y-4">
          {/* Outstanding Balance Action Card */}
          <div className="bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Outstanding balance
              </span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>

            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              $ {outstandingAmount.toFixed(2)}
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Next invoice <span className="font-bold text-slate-700 dark:text-slate-300">08/01/2026</span>
            </div>

            <button
              onClick={() => setIsPayModalOpen(true)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isPaid ? 'View Payment Receipt' : 'Pay outstanding'}</span>
            </button>
          </div>

          {/* AT A GLANCE Widget */}
          <div className="bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-amber-950/40 pb-2">
              At a Glance
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Next due date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">08/01/2026</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Payment status</span>
                {isPaid ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Paid in full
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    Overdue
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Contract status</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Running
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Signature</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Signed
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Deposit held</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">$ 320.00</span>
              </div>
            </div>
          </div>

          {/* WHO TO CONTACT Widget */}
          <div className="bg-white dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-amber-950/40 pb-2">
              Who to Contact
            </h4>

            <div className="space-y-3">
              {/* Landlord Contact */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#151926] border border-slate-100 dark:border-amber-950/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    RM
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Rajesh Mehta
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Landlord</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsMessageModalOpen(true)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-amber-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                  title="Send message"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Broker Contact */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#151926] border border-slate-100 dark:border-amber-950/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                    AS
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Amit Shah
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Broker & Property Mgr</div>
                  </div>
                </div>
                <button
                  onClick={() => onToast('Calling broker Amit Shah (+91 98251 00214)...')}
                  className="p-1.5 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                  title="Call broker"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Outstanding Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0e17] w-full max-w-md rounded-2xl border border-slate-200 dark:border-amber-950/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/30 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Settle Rent Payment
                </h3>
                <p className="text-xs text-slate-500">Contract {activeContract.contractNumber} · {activeContract.unitCode}</p>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#151926] rounded-xl border border-slate-200/80 dark:border-amber-950/40 text-center space-y-1">
              <div className="text-xs text-slate-500">Amount Due</div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                $ 670.00
              </div>
              <div className="text-[11px] text-rose-500 font-semibold">Includes August rent & invoiced utilities</div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card', label: 'Credit Card', icon: CreditCard },
                  { id: 'bank', label: 'Bank Transfer', icon: Building },
                  { id: 'cheque', label: 'PDC Cheque', icon: FileCheck2 },
                ].map((m) => {
                  const Icon = m.icon;
                  const active = selectedPaymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                        active
                          ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300'
                          : 'bg-slate-50 dark:bg-[#121520] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedPaymentMethod === 'card' && (
              <form onSubmit={handlePayOutstanding} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    defaultValue="•••• •••• •••• 4242"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Expiry
                    </label>
                    <input
                      type="text"
                      defaultValue="08/28"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      CVC
                    </label>
                    <input
                      type="password"
                      defaultValue="888"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-amber-950/30">
                  <button
                    type="button"
                    onClick={() => setIsPayModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
                  >
                    {isProcessingPayment ? 'Authorizing...' : 'Authorize $ 670.00'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* View Installments Modal */}
      {isInstallmentsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0e17] w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-amber-950/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/30 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Schedule & Invoices
                </h3>
                <p className="text-xs text-slate-500">Contract {activeContract.contractNumber} · 11 Scheduled Installments</p>
              </div>
              <button
                onClick={() => setIsInstallmentsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#151926] text-slate-500 border-b border-slate-200 dark:border-amber-950/40">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-amber-950/30">
                  {[
                    { no: 1, date: '07/01/2026', amount: 250, status: 'Paid', method: 'Card' },
                    { no: 2, date: '08/01/2026', amount: 250, status: 'Paid', method: 'Card' },
                    { no: 3, date: '08/01/2026', amount: 670, status: isPaid ? 'Paid' : 'Overdue', method: isPaid ? 'Card' : '-' },
                    { no: 4, date: '10/01/2026', amount: 250, status: 'Pending', method: '-' },
                    { no: 5, date: '11/01/2026', amount: 250, status: 'Pending', method: '-' },
                    { no: 6, date: '12/01/2026', amount: 250, status: 'Pending', method: '-' },
                  ].map((inst) => (
                    <tr key={inst.no} className="hover:bg-slate-50 dark:hover:bg-[#151926]">
                      <td className="py-2.5 px-3 font-mono font-bold">{inst.no}</td>
                      <td className="py-2.5 px-3 font-mono">{inst.date}</td>
                      <td className="py-2.5 px-3 font-mono font-bold">$ {inst.amount.toFixed(2)}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inst.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : inst.status === 'Overdue'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {inst.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {inst.status === 'Overdue' ? (
                          <button
                            onClick={() => {
                              setIsInstallmentsModalOpen(false);
                              setIsPayModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-blue-600 text-white rounded text-[10px] font-bold"
                          >
                            Pay
                          </button>
                        ) : (
                          <button
                            onClick={() => onToast(`Downloaded receipt for installment #${inst.no}`)}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-amber-300 text-[11px] underline"
                          >
                            Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setIsInstallmentsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Request Modal */}
      {isMaintenanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0e17] w-full max-w-md rounded-2xl border border-slate-200 dark:border-amber-950/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/30 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Raise Maintenance Request
                </h3>
                <p className="text-xs text-slate-500">Skyline B-402 · Fast repair dispatch</p>
              </div>
              <button
                onClick={() => setIsMaintenanceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsMaintenanceModalOpen(false);
                onToast('Maintenance ticket raised and assigned to MEP emergency team!');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Issue Category
                </label>
                <select className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-slate-800 dark:text-slate-200">
                  <option>Air Conditioning / HVAC</option>
                  <option>Plumbing & Water Heater</option>
                  <option>Electrical & Appliances</option>
                  <option>Carpentry & Locks</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description of Defect
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue in detail..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsMaintenanceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Landlord Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0e17] w-full max-w-md rounded-2xl border border-slate-200 dark:border-amber-950/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/30 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Direct Message Landlord
                </h3>
                <p className="text-xs text-slate-500">Recipient: Rajesh Mehta (Landlord)</p>
              </div>
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsMessageModalOpen(false);
                onToast('Message dispatched to Rajesh Mehta via WhatsApp & email digest.');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  defaultValue="Lease query for Skyline B-402"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Type your message to the property owner..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-amber-950/50 rounded-lg text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
