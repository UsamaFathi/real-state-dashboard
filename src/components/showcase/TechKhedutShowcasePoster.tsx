import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  X,
  ExternalLink,
  Maximize2,
  Mail,
  Globe,
  Sparkles,
  ArrowUpRight,
  Layers,
  FileCheck2,
  MapPin,
  Calendar,
  CreditCard,
  Building,
  User,
  Clock,
  AlertCircle,
  Download,
} from 'lucide-react';
import { TenancyContract } from '../../types/rentalTypes';
import { TechKhedutContractPortalView } from '../rental/TechKhedutContractPortalView';
import { TechKhedutKanbanContractsView } from '../rental/TechKhedutKanbanContractsView';
import { TechKhedutESignView } from '../rental/TechKhedutESignView';
import { TechKhedutGisMapView } from '../rental/TechKhedutGisMapView';

interface TechKhedutShowcasePosterProps {
  contracts: TenancyContract[];
  onSelectContract: (c: TenancyContract) => void;
  onNavigateTab: (tab: string) => void;
  onOpenNewContract: () => void;
  onToast: (msg: string) => void;
}

export const TechKhedutShowcasePoster: React.FC<TechKhedutShowcasePosterProps> = ({
  contracts,
  onSelectContract,
  onNavigateTab,
  onOpenNewContract,
  onToast,
}) => {
  const [activeZoomModal, setActiveZoomModal] = useState<
    'portal' | 'kanban' | 'esign' | 'map' | null
  >(null);

  const t00006Contract =
    contracts.find((c) => c.contractNumber === 'T/00006') || contracts[0];

  return (
    <div className="bg-[#05060a] text-slate-100 min-h-screen pb-16 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* 1. Master Top TechKhedut Header Bar */}
      <div className="border-b border-amber-950/40 bg-[#080a12]/90 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* TechKhedut Logo & Tagline */}
        <div className="flex items-center gap-3">
          {/* Cyan Geometric Logo Symbol */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-8 h-8 text-cyan-400 fill-current filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="none" stroke="currentColor" strokeWidth="8" />
              <path d="M30 40 L50 25 L70 40 L50 55 Z" fill="#38bdf8" />
              <path d="M30 60 L50 45 L70 60 L50 75 Z" fill="#0284c7" />
            </svg>
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>TechKhedut</span>
            </div>
            <div className="text-[8px] font-mono tracking-widest text-cyan-400 uppercase">
              NEW ERA OF TECHNOLOGY
            </div>
          </div>
        </div>

        {/* Top Badges (Community, Enterprise, Odoo.sh, Odoo Online) */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold shadow-xs">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Community</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold shadow-xs">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enterprise</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold shadow-xs">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Odoo.sh</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 font-semibold shadow-xs">
            <X className="w-3.5 h-3.5 text-rose-400" />
            <span>Odoo Online</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Presentation Banner matching Poster */}
      <div className="relative overflow-hidden py-12 px-6 text-center space-y-4 max-w-5xl mx-auto">
        {/* Background radial gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* 3D Gold Shield "VERSION 19" Badge */}
        <div className="flex justify-center">
          <div className="relative group cursor-pointer" onClick={() => onToast('Odoo 19.0 Real Estate ERP Suite Active')}>
            <div className="w-24 h-28 bg-gradient-to-b from-amber-200 via-amber-500 to-amber-800 p-0.5 rounded-2xl shadow-[0_0_35px_rgba(245,158,11,0.4)] flex flex-col items-center justify-center">
              <div className="w-full h-full bg-[#0a0d14] rounded-[14px] flex flex-col items-center justify-center p-2 border border-amber-400/30">
                {/* House roof icon */}
                <Building className="w-6 h-6 text-amber-400 mb-1" />
                <div className="text-[9px] uppercase font-bold tracking-widest text-amber-300 font-mono">
                  VERSION
                </div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-300 to-amber-500 font-serif">
                  19
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Headline: REAL ESTATE PROPERTY MANAGEMENT */}
        <div className="space-y-1">
          <h1 className="text-4xl md:text-6xl font-black tracking-wider uppercase font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 filter drop-shadow-[0_2px_12px_rgba(245,158,11,0.3)]">
            REAL ESTATE
          </h1>
          <h2 className="text-lg md:text-2xl font-bold tracking-[0.25em] text-slate-200 uppercase font-sans">
            PROPERTY MANAGEMENT
          </h2>
        </div>

        {/* Subtitle Paragraph matching exact image wording */}
        <p className="text-xs md:text-sm text-slate-300/90 max-w-3xl mx-auto leading-relaxed font-sans">
          Built on <strong className="text-amber-400 font-bold">4+ years</strong> of real estate expertise, our Odoo ERP is shaped by customer feedback—not competitor shortcuts. Trusted across <strong className="text-amber-400 font-bold">35+ countries</strong> and enhanced with <strong className="text-amber-400 font-bold">40+ real-world updates</strong>, it’s the go-to choice for serious property professionals who value quality, innovation, and support.
        </p>

        {/* Quick View Jumper Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <button
            onClick={() => setActiveZoomModal('portal')}
            className="px-3.5 py-1.5 rounded-xl bg-[#121624] hover:bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>1. Tenancy Contract & Portal (T/00006)</span>
          </button>

          <button
            onClick={() => setActiveZoomModal('kanban')}
            className="px-3.5 py-1.5 rounded-xl bg-[#121624] hover:bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Contracts Kanban & Filter Pipeline</span>
          </button>

          <button
            onClick={() => setActiveZoomModal('esign')}
            className="px-3.5 py-1.5 rounded-xl bg-[#121624] hover:bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Digital E-Sign Review (T/00007)</span>
          </button>

          <button
            onClick={() => setActiveZoomModal('map')}
            className="px-3.5 py-1.5 rounded-xl bg-[#121624] hover:bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>4. GIS Map & Analytics</span>
          </button>
        </div>
      </div>

      {/* 3. The 4 Live Showcase Views Layout (matching poster arrangement) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* ROW 1: Screen 1 (Top Left) & Screen 2 (Top Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Screen 1: Dedicated Tenancy Contract Detail & Portal View (Top Left in poster) */}
          <div className="xl:col-span-6 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Tenancy Contract & Tenant Payment Portal
                </h3>
              </div>
              <button
                onClick={() => setActiveZoomModal('portal')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full View</span>
              </button>
            </div>

            {/* Live Interactive Container */}
            <div className="rounded-2xl border-2 border-amber-950/60 bg-[#0c0e17] p-2 shadow-2xl hover:border-amber-500/40 transition">
              <TechKhedutContractPortalView
                contract={t00006Contract}
                onNavigateTab={onNavigateTab}
                onOpenNewContract={onOpenNewContract}
                onToast={onToast}
              />
            </div>
          </div>

          {/* Screen 2: Contracts Kanban & Filter Pipeline (Top Right in poster) */}
          <div className="xl:col-span-6 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Odoo 19 Contracts Pipeline & Facet Filter Grid
                </h3>
              </div>
              <button
                onClick={() => setActiveZoomModal('kanban')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full View</span>
              </button>
            </div>

            {/* Live Interactive Container */}
            <div className="rounded-2xl border-2 border-amber-950/60 bg-[#0c0e17] p-2 shadow-2xl hover:border-amber-500/40 transition">
              <TechKhedutKanbanContractsView
                contracts={contracts}
                onSelectContract={onSelectContract}
                onOpenNewContract={onOpenNewContract}
                onToast={onToast}
              />
            </div>
          </div>
        </div>

        {/* ROW 2: Screen 4 (Bottom Left) & Screen 3 (Bottom Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Screen 4: Interactive GIS Map & Property Analytics (Bottom Left in poster) */}
          <div className="xl:col-span-6 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Geospatial Property GIS & Revenue Analytics
                </h3>
              </div>
              <button
                onClick={() => setActiveZoomModal('map')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full View</span>
              </button>
            </div>

            {/* Live Interactive Container */}
            <div className="rounded-2xl border-2 border-amber-950/60 bg-[#0c0e17] p-2 shadow-2xl hover:border-amber-500/40 transition">
              <TechKhedutGisMapView
                onToast={onToast}
                onNavigateTab={onNavigateTab}
              />
            </div>
          </div>

          {/* Screen 3: Digital E-Signing & Contract Review (Bottom Right in poster) */}
          <div className="xl:col-span-6 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Review & Sign Rent Contract (Digital E-Signature)
                </h3>
              </div>
              <button
                onClick={() => setActiveZoomModal('esign')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full View</span>
              </button>
            </div>

            {/* Live Interactive Container */}
            <div className="rounded-2xl border-2 border-amber-950/60 bg-[#0c0e17] p-2 shadow-2xl hover:border-amber-500/40 transition">
              <TechKhedutESignView
                onToast={onToast}
                onNavigateTab={onNavigateTab}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Footer Contact Bar matching poster */}
      <div className="mt-16 border-t border-amber-950/40 pt-6 px-6 max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-6">
          <a
            href="mailto:info@techkhedut.com"
            onClick={(e) => {
              e.preventDefault();
              onToast('Contact email: info@techkhedut.com');
            }}
            className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span className="font-mono">info@techkhedut.com</span>
          </a>

          <a
            href="https://techkhedut.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition"
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span className="font-mono">https://techkhedut.com</span>
          </a>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          TechKhedut Real Estate Property Management • Version 19.0 Enterprise
        </div>
      </div>

      {/* Zoom Fullscreen Modal for any selected screen */}
      {activeZoomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#0c0e17] w-full max-w-6xl rounded-2xl border border-amber-950/60 shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-amber-950/40 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>
                  {activeZoomModal === 'portal' && 'Tenancy Contract & Payment Portal (T/00006)'}
                  {activeZoomModal === 'kanban' && 'Contracts Kanban Pipeline & Filters'}
                  {activeZoomModal === 'esign' && 'Digital E-Signature Tenancy Document (T/00007)'}
                  {activeZoomModal === 'map' && 'Property Geospatial GIS & Revenue Analytics'}
                </span>
              </h3>
              <button
                onClick={() => setActiveZoomModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕ Close Fullscreen
              </button>
            </div>

            {activeZoomModal === 'portal' && (
              <TechKhedutContractPortalView
                contract={t00006Contract}
                onNavigateTab={onNavigateTab}
                onOpenNewContract={onOpenNewContract}
                onToast={onToast}
              />
            )}

            {activeZoomModal === 'kanban' && (
              <TechKhedutKanbanContractsView
                contracts={contracts}
                onSelectContract={onSelectContract}
                onOpenNewContract={onOpenNewContract}
                onToast={onToast}
              />
            )}

            {activeZoomModal === 'esign' && (
              <TechKhedutESignView
                onToast={onToast}
                onNavigateTab={onNavigateTab}
              />
            )}

            {activeZoomModal === 'map' && (
              <TechKhedutGisMapView
                onToast={onToast}
                onNavigateTab={onNavigateTab}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
