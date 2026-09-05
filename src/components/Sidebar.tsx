import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Building,
  Layers,
  Home,
  MapPin,
  TrendingUp,
  Users,
  Eye,
  FileCheck,
  Clock,
  BookmarkCheck,
  FileSignature,
  DollarSign,
  Sliders,
  Calculator,
  BarChart3,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  MoreVertical,
  Check,
  Wallet,
  Compass,
} from 'lucide-react';
import { NavigationTab, LegalEntity } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedCompany?: LegalEntity;
  onSelectCompany?: (company: LegalEntity) => void;
  companies?: LegalEntity[];
  isDark?: boolean;
  onToggleDark?: () => void;
  onOpenUnlockModal?: () => void;
  onToast?: (msg: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedCompany = {
    id: 'ent-1',
    name: 'Palm Developments',
    shortCode: 'PD',
    jurisdiction: 'Cairo & New Capital',
    taxId: 'EG-8849102-PD',
    activeProperties: 450,
    aum: 'EGP 8.4 Billion',
    status: 'Active',
    currencySymbol: 'EGP',
    logoBg: 'bg-emerald-600',
  },
  onSelectCompany,
  companies = [],
  isDark = false,
  onToggleDark,
  onOpenUnlockModal,
  onToast,
}) => {
  // Navigation sections expanded states
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  const [isSalesOpen, setIsSalesOpen] = useState(true);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isCompanySwitcherOpen, setIsCompanySwitcherOpen] = useState(false);

  const fallbackCompanies: LegalEntity[] =
    companies.length > 0
      ? companies
      : [
          {
            id: 'ent-1',
            name: 'Palm Developments',
            shortCode: 'PD',
            jurisdiction: 'Cairo & New Capital',
            taxId: 'EG-8849102-PD',
            activeProperties: 450,
            aum: 'EGP 8.4 Billion',
            status: 'Active',
            currencySymbol: 'EGP',
            logoBg: 'bg-emerald-600',
          },
          {
            id: 'ent-2',
            name: 'Mountain View',
            shortCode: 'MV',
            jurisdiction: 'East & West Cairo',
            taxId: 'EG-992144-MV',
            activeProperties: 320,
            aum: 'EGP 6.8 Billion',
            status: 'Active',
            currencySymbol: 'EGP',
            logoBg: 'bg-blue-600',
          },
          {
            id: 'ent-3',
            name: 'SODIC Properties',
            shortCode: 'SD',
            jurisdiction: 'Sheikh Zayed & 6th October',
            taxId: 'EG-30918-SD',
            activeProperties: 280,
            aum: 'EGP 9.5 Billion',
            status: 'Active',
            currencySymbol: 'EGP',
            logoBg: 'bg-amber-600',
          },
          {
            id: 'ent-4',
            name: 'Emaar Properties',
            shortCode: 'EM',
            jurisdiction: 'Uptown & Marassi',
            taxId: 'AE-2023-881',
            activeProperties: 510,
            aum: '$2.4 Billion',
            status: 'Active',
            currencySymbol: '$',
            logoBg: 'bg-indigo-600',
          },
        ];

  return (
    <aside
      id="main-sidebar"
      className="w-[260px] min-w-[260px] h-screen bg-[#fafbfc] dark:bg-[#0b0d13] text-gray-700 dark:text-gray-300 flex flex-col justify-between select-none border-r border-gray-200/80 dark:border-gray-800/80 z-30 relative font-sans"
    >
      {/* 1. TOP DYNAMIC COMPANY BRAND SWITCHER */}
      <div className="p-3.5 border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="relative">
          <button
            onClick={() => setIsCompanySwitcherOpen(!isCompanySwitcherOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#13151f] hover:bg-gray-50 dark:hover:bg-[#181b28] border border-gray-200/80 dark:border-gray-800 transition cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Dynamic Company Logo / Emblem */}
              <div
                className={`w-7 h-7 rounded-lg ${
                  selectedCompany.logoBg || 'bg-emerald-700 dark:bg-emerald-600'
                } text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0 tracking-tight`}
              >
                {selectedCompany.shortCode || selectedCompany.name.substring(0, 2).toUpperCase()}
              </div>

              <div className="text-left truncate">
                <div className="text-xs font-bold text-gray-950 dark:text-white tracking-tight truncate">
                  {selectedCompany.name}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                  {selectedCompany.jurisdiction || 'Real Estate'}
                </div>
              </div>
            </div>

            <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 flex-shrink-0 ml-1" />
          </button>

          {/* Company Switcher Menu */}
          {isCompanySwitcherOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsCompanySwitcherOpen(false)}
              />
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-[#13151f] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in duration-100 text-xs">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                  Active Company
                </div>
                {fallbackCompanies.map((comp) => {
                  const isSelected = selectedCompany.id === comp.id;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => {
                        onSelectCompany?.(comp);
                        setIsCompanySwitcherOpen(false);
                        onToast?.(`Switched company to ${comp.name}`);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg font-semibold flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-950 dark:text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#181b28]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-5 h-5 rounded-md ${
                            comp.logoBg || 'bg-gray-900'
                          } text-white text-[10px] font-bold flex items-center justify-center`}
                        >
                          {comp.shortCode || comp.name.substring(0, 2)}
                        </span>
                        <span className="truncate">{comp.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. SCROLLABLE MAIN NAVIGATION MENU */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5 text-xs font-medium">
        <div>
          <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-1.5">
            Real Estate
          </div>

          <div className="space-y-0.5">
            {/* OVERVIEW */}
            <button
              onClick={() => {
                setActiveTab('shadcn-dashboard');
                onToast?.('Opened Overview (Portfolio & Sales Overview)');
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'shadcn-dashboard' || activeTab === 'overview'
                  ? 'bg-gray-200/90 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold shadow-2xs'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-[#141622] hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span>Overview</span>
            </button>

            {/* PROPERTIES GROUP */}
            <div className="pt-0.5">
              <button
                onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-[#141622] text-gray-700 dark:text-gray-300 font-semibold transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>Properties</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${
                    isPropertiesOpen ? '' : '-rotate-90'
                  }`}
                />
              </button>

              {isPropertiesOpen && (
                <div className="ml-5 pl-3 border-l border-gray-200 dark:border-gray-800 mt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveTab('projects');
                      onToast?.('Viewing Projects');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'projects'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Projects
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('phases');
                      onToast?.('Viewing Phases');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'phases'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Phases
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('buildings');
                      onToast?.('Viewing Buildings');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'buildings'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Buildings
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('units');
                      onToast?.('Viewing Units');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'units' || activeTab === 'properties' || activeTab === 'inventory'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Units
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('unit-availability');
                      onToast?.('Viewing Unit Availability');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'unit-availability' || activeTab === 'shadcn-listings'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Unit Availability
                  </button>
                </div>
              )}
            </div>

            {/* SALES GROUP */}
            <div className="pt-0.5">
              <button
                onClick={() => setIsSalesOpen(!isSalesOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-[#141622] text-gray-700 dark:text-gray-300 font-semibold transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>Sales</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${
                    isSalesOpen ? '' : '-rotate-90'
                  }`}
                />
              </button>

              {isSalesOpen && (
                <div className="ml-5 pl-3 border-l border-gray-200 dark:border-gray-800 mt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveTab('leads');
                      onToast?.('Viewing Buyer Leads');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'leads'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Leads
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('viewings');
                      onToast?.('Viewing Scheduled Viewings');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'viewings'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Viewings
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('offers');
                      onToast?.('Viewing Offers & Approvals');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'offers'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Offers
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('holds');
                      onToast?.('Viewing Active Holds');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'holds'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Holds
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('reservations');
                      onToast?.('Viewing Unit Reservations');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'reservations' || activeTab === 'deals'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Reservations
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('contracts');
                      onToast?.('Viewing Executed Contracts');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'contracts' || activeTab === 'contracts-kanban'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Contracts
                  </button>
                </div>
              )}
            </div>

            {/* PRICING GROUP */}
            <div className="pt-0.5">
              <button
                onClick={() => setIsPricingOpen(!isPricingOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-[#141622] text-gray-700 dark:text-gray-300 font-semibold transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>Pricing</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${
                    isPricingOpen ? '' : '-rotate-90'
                  }`}
                />
              </button>

              {isPricingOpen && (
                <div className="ml-5 pl-3 border-l border-gray-200 dark:border-gray-800 mt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveTab('pricing-rules');
                      onToast?.('Viewing Pricing Rules');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'pricing-rules' || activeTab === 'pricing'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Pricing Rules
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('price-adjustments');
                      onToast?.('Viewing Price Adjustments');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'price-adjustments'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Price Adjustments
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('payment-plans');
                      onToast?.('Opening Payment Plan Calculator');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'payment-plans'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Payment Plans
                  </button>
                </div>
              )}
            </div>

            {/* REPORTS */}
            <button
              onClick={() => {
                setActiveTab('reports');
                onToast?.('Viewing Reports');
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'reports' || activeTab === 'reporting'
                  ? 'bg-gray-200/90 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-[#141622] hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span>Reports</span>
            </button>

            {/* DOCUMENTS */}
            <button
              onClick={() => {
                setActiveTab('documents');
                onToast?.('Viewing Property & Contract Documents');
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'documents'
                  ? 'bg-gray-200/90 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-[#141622] hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span>Documents</span>
            </button>

            {/* CONFIGURATION GROUP */}
            <div className="pt-0.5">
              <button
                onClick={() => setIsConfigurationOpen(!isConfigurationOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-[#141622] text-gray-700 dark:text-gray-300 font-semibold transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>Configuration</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${
                    isConfigurationOpen ? '' : '-rotate-90'
                  }`}
                />
              </button>

              {isConfigurationOpen && (
                <div className="ml-5 pl-3 border-l border-gray-200 dark:border-gray-800 mt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveTab('property-types');
                      onToast?.('Configuration: Property Types');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'property-types'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Property Types
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('unit-types');
                      onToast?.('Configuration: Unit Types');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'unit-types'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Unit Types
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('views-orientations');
                      onToast?.('Configuration: Views & Orientations');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'views-orientations'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Views & Orientations
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('approval-rules');
                      onToast?.('Configuration: Approval Rules');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'approval-rules'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Approval Rules
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('payment-plan-templates');
                      onToast?.('Configuration: Payment Plan Templates');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'payment-plan-templates'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Payment Plan Templates
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      onToast?.('Configuration: Settings');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-gray-200/80 dark:bg-[#181a26] text-gray-950 dark:text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#141622]'
                    }`}
                  >
                    Settings
                  </button>
                </div>
              )}
            </div>

            {/* FUTURE FINANCE RESERVATION SECTION */}
            <div className="pt-2 border-t border-gray-200/50 dark:border-gray-800/50 mt-2">
              <button
                onClick={() => setIsFinanceOpen(!isFinanceOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-[#141622] text-gray-500 dark:text-gray-400 transition cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Wallet className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  <span>Finance</span>
                </div>
                <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-semibold px-1.5 py-0.5 rounded">
                  Upcoming
                </span>
              </button>

              {isFinanceOpen && (
                <div className="ml-5 pl-3 border-l border-gray-200 dark:border-gray-800 mt-1 space-y-0.5">
                  {['Installments', 'Collections', 'Receipts', 'Outstanding', 'Aging'].map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() =>
                          onToast?.(`Finance module: ${item} (Available in upcoming financial release)`)
                        }
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer"
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. USER PROFILE FOOTER: TOBY BELHOME (REAL ESTATE SALES MANAGER) */}
      <div className="p-3 border-t border-gray-200/60 dark:border-gray-800/60">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
              alt="Toby Belhome"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 flex-shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="truncate text-left">
              <div className="text-xs font-bold text-gray-950 dark:text-white truncate">
                Toby Belhome
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                Real Estate Sales Manager
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab('settings');
              onToast?.('User Settings & Preferences');
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            title="Account Settings"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
