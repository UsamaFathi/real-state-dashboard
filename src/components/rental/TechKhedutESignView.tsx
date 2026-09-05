import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  DollarSign,
  User,
  Building,
  Check,
  Clock,
  PenTool,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TechKhedutESignViewProps {
  onToast: (msg: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const TechKhedutESignView: React.FC<TechKhedutESignViewProps> = ({
  onToast,
  onNavigateTab,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [agreedRentContract, setAgreedRentContract] = useState(true);
  const [agreedTermsConditions, setAgreedTermsConditions] = useState(true);
  const [isSignPadOpen, setIsSignPadOpen] = useState(false);
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('type');
  const [typedSignature, setTypedSignature] = useState('Karan Desai');
  const [isSigned, setIsSigned] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleEndDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleAdoptAndSign = () => {
    if (!agreedRentContract || !agreedTermsConditions) {
      onToast('Please check both agreement confirmation boxes to proceed.');
      return;
    }

    setIsSigned(true);
    setCurrentStep(3);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d97706', '#2563eb', '#10b981', '#f59e0b'],
    });
    onToast('Tenancy contract T/00007 successfully signed and cryptographically sealed!');
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-slate-800 dark:text-slate-200">
      {/* 1. Stepper Header matching screenshot: 1 Review -> 2 Sign -> 3 Done & Secure signing */}
      <div className="bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Title */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            TK
          </div>
          <span className="font-bold text-xs text-slate-900 dark:text-white">
            TechKhedut Inc.
          </span>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${currentStep >= 1 ? 'text-blue-600 dark:text-amber-400 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white dark:bg-amber-500 dark:text-slate-950 flex items-center justify-center text-[10px] font-mono">
              1
            </span>
            <span>Review</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">—</span>
          <div className={`flex items-center gap-1.5 ${currentStep >= 2 ? 'text-blue-600 dark:text-amber-400 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-mono">
              2
            </span>
            <span>Sign</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">—</span>
          <div className={`flex items-center gap-1.5 ${currentStep === 3 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-mono">
              3
            </span>
            <span>Done</span>
          </div>
        </div>

        {/* Secure signing badge */}
        <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <Lock className="w-3.5 h-3.5" />
          <span>Secure signing</span>
        </div>
      </div>

      {/* 2. Awaiting Signature Header Banner */}
      <div className="bg-slate-50 dark:bg-[#121522] rounded-xl border border-slate-200/80 dark:border-amber-950/40 p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            AWAITING YOUR SIGNATURE
          </div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
            Review & sign your Rent Contract
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reference <span className="font-mono font-bold text-slate-700 dark:text-amber-300">T/00007</span> · prepared for <span className="font-bold text-slate-800 dark:text-slate-200">Karan Desai</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/50 rounded-lg text-xs text-amber-900 dark:text-amber-300 font-medium">
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Valid until 08/07/2026</span>
        </div>
      </div>

      {/* 3. Document Layout (Left 8 Cols: Legal Document, Right 4 Cols: Agreement Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 8 Cols: Complete Formatted Legal Tenancy Agreement */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 p-6 shadow-xs space-y-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          <div className="text-center space-y-1 border-b border-slate-100 dark:border-amber-950/40 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              RESIDENTIAL TENANCY AGREEMENT
            </h3>
            <p className="text-[11px] text-slate-500">
              Reference: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">T/00007</span> · Jurisdiction of Tenancy Law
            </p>
          </div>

          {/* Preamble */}
          <p className="text-justify">
            This Tenancy Agreement (reference <strong className="text-slate-900 dark:text-white font-mono">T/00007</strong>) is made between{' '}
            <strong className="text-slate-900 dark:text-white">Horizon Estates LLP</strong> ("the Landlord") and{' '}
            <strong className="text-slate-900 dark:text-white">Karan Desai</strong> ("the Tenant") for the property known as{' '}
            <strong className="text-slate-900 dark:text-white">Metro Retail Shop G-03</strong> ("the Property").
          </p>

          {/* Clauses matching exact text in screenshot */}
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                1. Term
              </h4>
              <p className="text-justify">
                The tenancy begins on <strong className="text-slate-900 dark:text-white">2026-07-01</strong> and ends on{' '}
                <strong className="text-slate-900 dark:text-white">2027-05-31</strong>, unless renewed or terminated in accordance with this Agreement.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                2. Rent
              </h4>
              <p className="text-justify">
                The Tenant shall pay rent of <strong className="text-slate-900 dark:text-white font-mono">345.0</strong> per the agreed billing cycle, in advance, by the due date of each installment. Late payment may attract a penalty as configured for this contract.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                3. Security Deposit
              </h4>
              <p className="text-justify">
                The Tenant has paid a security deposit of <strong className="text-slate-900 dark:text-white font-mono">79.0</strong>, refundable at the end of the tenancy less any lawful deductions for damage, cleaning or unpaid amounts.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                4. Use of the Property
              </h4>
              <p className="text-justify">
                The Tenant shall use the Property solely for lawful residential/commercial purposes, keep it in good condition, and not sublet or assign it without the Landlord's written consent.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                5. Maintenance
              </h4>
              <p className="text-justify">
                The Tenant shall promptly report defects. The Landlord shall keep the structure and installations in good working order, save for damage caused by the Tenant's misuse.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                6. Termination
              </h4>
              <p className="text-justify">
                Either party may terminate this Agreement by giving the notice required by law or by this contract. On termination the Tenant shall return the Property and all keys.
              </p>
            </div>
          </div>

          {/* Signature Verification Stamp Container */}
          {isSigned && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Digitally Signed by Karan Desai
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                    SHA-256: 8f4a2b91c3d8e5f2 · Timestamp: {new Date().toISOString()}
                  </div>
                </div>
              </div>
              <div className="font-serif italic text-lg text-slate-800 dark:text-amber-200 font-bold px-3 py-1 bg-white/70 dark:bg-slate-900/70 rounded-lg border">
                {typedSignature}
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Agreement Summary & Signing Action Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/30 pb-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                AGREEMENT SUMMARY
              </h4>
              <button
                onClick={() => onToast('Displaying full tenancy schedule and clause parameters...')}
                className="text-[10px] font-semibold text-blue-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            {/* Summary Metadata List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Contract</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">T/00007</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Property</span>
                <span className="font-bold text-slate-900 dark:text-white">Metro Retail Shop G-03</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Tenant</span>
                <span className="font-semibold text-slate-900 dark:text-white">Karan Desai</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Rent</span>
                <span className="font-bold text-slate-900 dark:text-amber-300 font-mono">$ 345.00 / Month</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Start Date</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">2026-07-01</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">End Date</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">2027-05-31</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Security Deposit</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">$ 79.00</span>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-amber-950/30" />

            {/* Checkbox agreements */}
            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedRentContract}
                  onChange={(e) => setAgreedRentContract(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 dark:text-slate-300 text-[11px] leading-tight">
                  I have read and agree to this Rent Contract.
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedTermsConditions}
                  onChange={(e) => setAgreedTermsConditions(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 dark:text-slate-300 text-[11px] leading-tight">
                  I accept the <span className="font-semibold text-blue-600 dark:text-amber-400 underline">Terms & Conditions</span>.
                </span>
              </label>
            </div>

            {/* Signature Preview & Pad Option */}
            <div className="p-3 bg-slate-50 dark:bg-[#151926] rounded-xl border border-slate-200/80 dark:border-amber-950/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                  Signature Style
                </span>
                <button
                  type="button"
                  onClick={() => setIsSignPadOpen(!isSignPadOpen)}
                  className="text-[10px] text-blue-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <PenTool className="w-3 h-3" />
                  <span>{isSignPadOpen ? 'Use Typed' : 'Draw Custom'}</span>
                </button>
              </div>

              {isSignPadOpen ? (
                <div className="space-y-1.5">
                  <div className="border border-slate-300 dark:border-slate-700 rounded-lg bg-white overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={280}
                      height={70}
                      onMouseDown={handleStartDraw}
                      onMouseMove={handleDraw}
                      onMouseUp={handleEndDraw}
                      onMouseLeave={handleEndDraw}
                      className="w-full h-[70px] bg-white cursor-crosshair"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Draw with mouse or stylus</span>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                    >
                      <RotateCcw className="w-3 h-3" /> Clear
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 bg-white dark:bg-[#0c0e17] rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="font-serif italic text-lg text-blue-900 dark:text-amber-300 font-bold">
                    {typedSignature}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleAdoptAndSign}
                disabled={isSigned}
                className={`w-full py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                  isSigned
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-[#1e293b] hover:bg-[#0f172a] text-white dark:bg-amber-600 dark:hover:bg-amber-500'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSigned ? 'Contract Signed & Verified ✓' : 'Adopt & Sign'}</span>
              </button>

              <button
                onClick={() => onToast('Generating and downloading official PDF tenancy agreement...')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              <div className="text-center pt-1">
                <button
                  onClick={() => {
                    setIsDeclined(true);
                    onToast('Signing request declined. Notification sent to horizon estates.');
                  }}
                  className="text-[11px] text-slate-400 hover:text-rose-500 underline cursor-pointer"
                >
                  Decline to sign
                </button>
              </div>
            </div>

            {/* Trust and Compliance Badges (matching screenshot) */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-amber-950/30 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>256-bit encrypted</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-500 shrink-0" />
                <span>Legally binding</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3 text-amber-500 shrink-0" />
                <span>Location verified</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-purple-500 shrink-0" />
                <span>Audit trail kept</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
