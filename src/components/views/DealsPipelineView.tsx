import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus,
  LayoutGrid,
  Grid,
  List,
  ArrowUpDown,
  Filter,
  Info,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Calendar,
  User,
  Globe,
  MessageSquare,
  Paperclip,
  GripVertical,
  ArrowUpRight,
  ArrowDownRight,
  ArrowDown,
  Move,
  Search,
  CheckCircle2,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Building,
  Building2,
  Home,
  DollarSign,
  Share2,
  Eye,
  Trash2,
  Edit3,
  RotateCcw,
  SlidersHorizontal,
  Layers,
  Sparkles,
  QrCode,
  FileDown,
  Loader2,
} from 'lucide-react';
import { DealQRCodeModal } from '../DealQRCodeModal';
import { downloadDealSummaryPdf } from '../../utils/dealPdfExport';
import { DealItem, DealStage, DealPriority, NavigationTab } from '../../types';

interface DealsPipelineViewProps {
  deals: DealItem[];
  onUpdateDealStage: (dealId: string, newStage: DealStage) => void;
  onAddNewDeal: (deal: Partial<DealItem>) => void;
  onOpenInviteModal: () => void;
  onToast: (msg: string) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const DealsPipelineView: React.FC<DealsPipelineViewProps> = ({
  deals,
  onUpdateDealStage,
  onAddNewDeal,
  onOpenInviteModal,
  onToast,
  onNavigateTab,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'grid' | 'table'>('kanban');
  const [selectedDeal, setSelectedDeal] = useState<DealItem | null>(null);
  const [qrModalDeal, setQrModalDeal] = useState<DealItem | null>(null);
  const [downloadingPdfDealId, setDownloadingPdfDealId] = useState<string | null>(null);

  const handleDownloadPdf = async (deal: DealItem) => {
    setDownloadingPdfDealId(deal.id);
    try {
      await downloadDealSummaryPdf(deal, onToast);
    } finally {
      setDownloadingPdfDealId(null);
    }
  };
  const [isNewDealModalOpen, setIsNewDealModalOpen] = useState(false);
  const [currency, setCurrency] = useState<'AED' | 'USD' | 'EUR' | 'GBP'>('AED');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('ALL');
  const [selectedPropertyTypeFilter, setSelectedPropertyTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'price_desc' | 'price_asc' | 'date' | 'priority'>('price_desc');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [filterActiveTab, setFilterActiveTab] = useState<'all' | 'priority' | 'propertyType'>('all');

  // Drag and drop state for Kanban pipeline
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragJustEndedRef = useRef<boolean>(false);
  const [activeMoveMenuDealId, setActiveMoveMenuDealId] = useState<string | null>(null);

  // Close quick stage menu on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveMoveMenuDealId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // New Deal Form State
  const [newCode, setNewCode] = useState(`#DXB-042${Math.floor(10 + Math.random() * 90)}`);
  const [newTitle, setNewTitle] = useState('2-bedrooms in UAE — Downtown Luxury Suite — 145 m²');
  const [newStage, setNewStage] = useState<DealStage>('new');
  const [newPriority, setNewPriority] = useState<DealPriority>('Medium');
  const [newPropertyType, setNewPropertyType] = useState<string>('Apartment');
  const [newPrice, setNewPrice] = useState(3100000);
  const [newClient, setNewClient] = useState('Alexander Wright');
  const [newSource, setNewSource] = useState('bronex.com');
  const [newDateValue, setNewDateValue] = useState('05 Dec 2025');

  // Currency multiplier for conversion
  const formatPrice = (val: number) => {
    if (currency === 'USD') return `$${(val / 3.67).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (currency === 'EUR') return `€${(val / 4.0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (currency === 'GBP') return `£${(val / 4.65).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    return `${val.toLocaleString()} AED`;
  };

  const columns: {
    id: DealStage;
    label: string;
    countSuffix: number;
    colorClass: string;
    borderAccent: string;
    dotClass: string;
    badgeClass: string;
  }[] = [
    {
      id: 'new',
      label: 'New',
      countSuffix: 14,
      colorClass: 'text-purple-600 dark:text-purple-400',
      borderAccent: 'border-t-4 border-t-purple-500',
      dotClass: 'bg-purple-500',
      badgeClass: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800',
    },
    {
      id: 'viewing_scheduled',
      label: 'Viewing Scheduled',
      countSuffix: 1,
      colorClass: 'text-amber-600 dark:text-amber-400',
      borderAccent: 'border-t-4 border-t-amber-500',
      dotClass: 'bg-amber-500',
      badgeClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800',
    },
    {
      id: 'negotiation',
      label: 'Negotiation',
      countSuffix: 6,
      colorClass: 'text-blue-600 dark:text-blue-400',
      borderAccent: 'border-t-4 border-t-blue-500',
      dotClass: 'bg-blue-500',
      badgeClass: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800',
    },
    {
      id: 'legal_documentation',
      label: 'Legal & Documentation',
      countSuffix: 1,
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      borderAccent: 'border-t-4 border-t-emerald-500',
      dotClass: 'bg-emerald-500',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800',
    },
    {
      id: 'closed_won',
      label: 'Closed / Won',
      countSuffix: 1,
      colorClass: 'text-teal-600 dark:text-teal-400',
      borderAccent: 'border-t-4 border-t-teal-500',
      dotClass: 'bg-teal-500',
      badgeClass: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200/80 dark:border-teal-800',
    },
  ];

  // Drag and Drop Handlers for Kanban cards
  const handleDragStart = (e: React.DragEvent, deal: DealItem) => {
    e.dataTransfer.setData('text/plain', deal.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedDealId(deal.id);
    setIsDragging(true);
    dragJustEndedRef.current = true;
  };

  const handleDragEnd = () => {
    setDraggedDealId(null);
    setDragOverStage(null);
    setIsDragging(false);
    setTimeout(() => {
      dragJustEndedRef.current = false;
    }, 150);
  };

  const handleDragOver = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stage: DealStage) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      if (dragOverStage === stage) {
        setDragOverStage(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (!dealId) return;

    const deal = deals.find((d) => d.id === dealId);
    if (deal) {
      if (deal.stage !== targetStage) {
        onUpdateDealStage(deal.id, targetStage);
        const targetCol = columns.find((c) => c.id === targetStage);
        onToast(`Moved ${deal.code} to ${targetCol?.label || targetStage}`);
      }
    }

    setDraggedDealId(null);
    setDragOverStage(null);
    setIsDragging(false);
    setTimeout(() => {
      dragJustEndedRef.current = false;
    }, 150);
  };

  const handleMoveDealStage = (dealId: string, newStage: DealStage) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;
    onUpdateDealStage(dealId, newStage);
    const targetCol = columns.find((c) => c.id === newStage);
    onToast(`Moved ${deal.code} to ${targetCol?.label || newStage}`);
    setActiveMoveMenuDealId(null);
  };

  // Distinct property types list
  const availablePropertyTypes = useMemo(() => {
    const typesSet = new Set<string>();
    // Pre-populate with core archetypes
    ['Apartment', 'Villa', 'Penthouse', 'Suite', 'Serviced Residence', 'Townhouse', 'Duplex'].forEach((t) =>
      typesSet.add(t)
    );
    deals.forEach((d) => {
      if (d.propertyType && d.propertyType.trim().length > 0) {
        typesSet.add(d.propertyType.trim());
      }
    });
    return Array.from(typesSet);
  }, [deals]);

  // Active filter count
  const activeFiltersCount =
    (selectedPriorityFilter !== 'ALL' ? 1 : 0) +
    (selectedPropertyTypeFilter !== 'ALL' ? 1 : 0);

  // Clear all filters handler
  const handleClearFilters = () => {
    setSelectedPriorityFilter('ALL');
    setSelectedPropertyTypeFilter('ALL');
    setSearchTerm('');
    onToast('All filters and search criteria reset.');
  };

  // Filtered & Sorted deals
  const filteredDeals = useMemo(() => {
    return deals
      .filter((d) => {
        // Priority filter
        if (selectedPriorityFilter !== 'ALL' && d.priority !== selectedPriorityFilter) {
          return false;
        }
        // Property type filter
        if (
          selectedPropertyTypeFilter !== 'ALL' &&
          d.propertyType.toLowerCase() !== selectedPropertyTypeFilter.toLowerCase()
        ) {
          return false;
        }
        // Search filter
        if (searchTerm) {
          const matchCode = d.code.toLowerCase().includes(searchTerm.toLowerCase());
          const matchClient = d.client.toLowerCase().includes(searchTerm.toLowerCase());
          const matchTitle = d.title.toLowerCase().includes(searchTerm.toLowerCase());
          const matchSource = d.source.toLowerCase().includes(searchTerm.toLowerCase());
          const matchType = d.propertyType.toLowerCase().includes(searchTerm.toLowerCase());
          if (!matchCode && !matchClient && !matchTitle && !matchSource && !matchType) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'priority') {
          const pOrder = { High: 3, Medium: 2, Low: 1 };
          return pOrder[b.priority] - pOrder[a.priority];
        }
        return b.id.localeCompare(a.id);
      });
  }, [deals, searchTerm, selectedPriorityFilter, selectedPropertyTypeFilter, sortBy]);

  const handleCreateDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNewDeal({
      code: newCode,
      title: newTitle,
      stage: newStage,
      priority: newPriority,
      price: Number(newPrice),
      currency: 'AED',
      dateLabel: 'Reservation',
      dateValue: newDateValue,
      client: newClient,
      source: newSource,
      bedrooms: 3,
      areaSqm: 145,
      propertyType: newPropertyType,
      floorPlanUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&q=80',
      photoUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      assignedAgents: [
        { name: 'Keyvan Akath', initials: 'K', avatarBg: 'bg-blue-100 text-blue-700' },
        { name: 'Bronex', initials: 'B', avatarBg: 'bg-purple-100 text-purple-700' },
      ],
      commentsCount: 1,
      filesCount: 2,
    });
    setIsNewDealModalOpen(false);
    onToast(`New deal ${newCode} created in ${newStage} pipeline.`);
  };

  const getPriorityBadge = (p: DealPriority) => {
    switch (p) {
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Low
          </span>
        );
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes('villa')) return <Home className="w-3.5 h-3.5 text-emerald-500" />;
    if (lower.includes('penthouse')) return <Sparkles className="w-3.5 h-3.5 text-purple-500" />;
    if (lower.includes('suite') || lower.includes('serviced')) return <Building2 className="w-3.5 h-3.5 text-amber-500" />;
    if (lower.includes('duplex') || lower.includes('townhouse')) return <Layers className="w-3.5 h-3.5 text-cyan-500" />;
    return <Building className="w-3.5 h-3.5 text-blue-500" />;
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Page Header: Title + Team Avatars + Invite Member */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-amber-100 tracking-tight">
            Deals pipeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active real estate transactions, viewing schedules, and client negotiation milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Luxury Currency Switcher */}
          <div className="flex items-center bg-white dark:bg-[#10131d] border border-slate-200 dark:border-amber-950/50 rounded-lg p-0.5 text-xs font-semibold shadow-2xs">
            {(['AED', 'USD', 'EUR', 'GBP'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => {
                  setCurrency(curr);
                  onToast(`Display currency changed to ${curr}`);
                }}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  currency === curr
                    ? 'bg-slate-900 text-white dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-500 dark:text-slate-950 dark:font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-200'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          {/* Team Members Avatar Stack */}
          <div className="flex items-center -space-x-2 overflow-hidden pl-1">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Keyvan"
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#08090e] object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
              alt="James"
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#08090e] object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
              alt="Amira"
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#08090e] object-cover"
            />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-[#141824] text-[11px] font-bold text-slate-700 dark:text-amber-300 ring-2 ring-white dark:ring-[#08090e] border border-transparent dark:border-amber-500/20">
              +2
            </div>
          </div>

          {/* + Invite Member Button */}
          <button
            onClick={onOpenInviteModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-[#11141e] hover:bg-slate-50 dark:hover:bg-[#181c28] text-slate-700 dark:text-amber-200 border border-slate-200 dark:border-amber-950/60 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-amber-400" />
            <span>Invite Member</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards Row with Luxury Obsidian & Gold Accents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Pipeline Value */}
        <div className="bg-white dark:bg-[#0d1017] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-2xs dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 dark:text-amber-200/90 tracking-wide uppercase">
              Pipeline Value
            </h2>
            <button
              onClick={() => onToast('Total active deal book valuation & estimated agent commission.')}
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-amber-300"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 block">
                Total Asset Volume
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-amber-300 tracking-tight mt-1 block">
                24.5M AED
              </span>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                <span>↑ 14%</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal">vs last month</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 block">
                Commission
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-amber-300 tracking-tight mt-1 block">
                490k AED
              </span>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                <span>↑ 5%</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Deal Activity */}
        <div className="bg-white dark:bg-[#0d1017] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-2xs dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 dark:text-amber-200/90 tracking-wide uppercase">
              Deal Activity
            </h2>
            <button
              onClick={() => onToast('Current booked site inspections, VIP viewings, and commercial offers.')}
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-amber-300"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 block">
                Viewings Booked
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-amber-300 tracking-tight mt-1 block">
                20
              </span>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                <span>↑ 12%</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal">vs last month</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 block">
                Offers Sent
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-amber-300 tracking-tight mt-1 block">
                5
              </span>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500 dark:text-amber-400 mt-1">
                <span>↓ 20%</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Conversion & Speed */}
        <div className="bg-white dark:bg-[#0d1017] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 p-5 shadow-2xs dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 dark:text-amber-200/90 tracking-wide uppercase">
              Conversion & Speed
            </h2>
            <button
              onClick={() => onToast('Average sales cycle duration and lead-to-close win rates.')}
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-amber-300"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 block">
                Avg. Days to Close
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-amber-300 tracking-tight mt-1 block">
                42
              </span>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                <span>↑ 5%</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal">vs last month</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 block">
                Win Rate
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-amber-300 tracking-tight mt-1 block">
                12%
              </span>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                <span>↑ 2%</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal">vs last month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Toolbar: + New Deals | View Mode Switchers | Search | Sort | Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Left Toolbar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewDealModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-gradient-to-r dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:brightness-110 rounded-xl text-xs font-bold shadow-xs dark:shadow-[0_0_18px_rgba(212,175,55,0.25)] transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ New Deals</span>
          </button>

          {/* View Switchers */}
          <div className="flex items-center bg-white dark:bg-[#10131d] border border-slate-200 dark:border-amber-950/50 rounded-xl p-1 shadow-2xs gap-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'kanban'
                  ? 'bg-slate-100 dark:bg-amber-950/60 text-slate-900 dark:text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-amber-200'
              }`}
              title="Kanban Board"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-slate-100 dark:bg-amber-950/60 text-slate-900 dark:text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-amber-200'
              }`}
              title="Card Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-slate-100 dark:bg-amber-950/60 text-slate-900 dark:text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-amber-200'
              }`}
              title="Table List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Toolbar: Quick Search, Sort & Filter */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 dark:text-amber-500/70" />
            <input
              type="text"
              placeholder="Search deals, clients, #ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white dark:bg-[#10131d] border border-slate-200 dark:border-amber-950/60 rounded-xl text-xs text-slate-900 dark:text-amber-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500/50 w-48 sm:w-60 shadow-2xs font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-amber-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSortDropdownOpen(!isSortDropdownOpen);
                setIsFilterDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#10131d] border border-slate-200 dark:border-amber-950/60 hover:bg-slate-50 dark:hover:bg-[#181c28] text-slate-700 dark:text-amber-200 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 dark:text-amber-400" />
              <span>Sort</span>
            </button>

            {isSortDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsSortDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-[#0f121c] border border-slate-200 dark:border-amber-950/80 rounded-xl shadow-xl p-1 z-40 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase text-slate-400 dark:text-amber-400/80">Sort Deals By</div>
                  <button
                    onClick={() => {
                      setSortBy('price_desc');
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                      sortBy === 'price_desc' ? 'bg-slate-100 dark:bg-amber-950/60 font-bold text-slate-900 dark:text-amber-200' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161a26]'
                    }`}
                  >
                    Price (Highest first)
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('price_asc');
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                      sortBy === 'price_asc' ? 'bg-slate-100 dark:bg-amber-950/60 font-bold text-slate-900 dark:text-amber-200' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161a26]'
                    }`}
                  >
                    Price (Lowest first)
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('priority');
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                      sortBy === 'priority' ? 'bg-slate-100 dark:bg-amber-950/60 font-bold text-slate-900 dark:text-amber-200' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161a26]'
                    }`}
                  >
                    Priority (High to Low)
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Filter Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsFilterDropdownOpen(!isFilterDropdownOpen);
                setIsSortDropdownOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer ${
                activeFiltersCount > 0
                  ? 'bg-blue-50/80 dark:bg-amber-950/50 border-blue-300 dark:border-amber-500/60 text-blue-700 dark:text-amber-300'
                  : 'bg-white dark:bg-[#10131d] border-slate-200 dark:border-amber-950/60 hover:bg-slate-50 dark:hover:bg-[#181c28] text-slate-700 dark:text-amber-200'
              }`}
            >
              <Filter className={`w-3.5 h-3.5 ${activeFiltersCount > 0 ? 'text-blue-600 dark:text-amber-400' : 'text-slate-500 dark:text-amber-400/80'}`} />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 text-[10px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className={`w-3 h-3 transition ${isFilterDropdownOpen ? 'rotate-180 text-blue-600 dark:text-amber-400' : 'text-slate-400 dark:text-amber-400/60'}`} />
            </button>

            {isFilterDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsFilterDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-80 bg-white dark:bg-[#0f121c] border border-slate-200 dark:border-amber-950/80 rounded-2xl shadow-2xl p-3 z-40 text-xs space-y-3.5 animate-in fade-in zoom-in-95">
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/60 pb-2 px-1">
                    <div className="flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                      <span className="font-bold text-slate-900 dark:text-amber-100 text-xs">Filter Pipeline Deals</span>
                      {activeFiltersCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-amber-950/80 text-blue-700 dark:text-amber-300 text-[10px] font-bold border border-amber-500/20">
                          {activeFiltersCount} Active
                        </span>
                      )}
                    </div>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={handleClearFilters}
                        className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                  {/* Section 1: Priority Segmentation */}
                  <div className="space-y-1.5 px-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <span>Priority</span>
                      {selectedPriorityFilter !== 'ALL' && (
                        <button
                          onClick={() => setSelectedPriorityFilter('ALL')}
                          className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline capitalize"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'ALL', label: 'All Priorities', dot: 'bg-slate-400' },
                        { id: 'High', label: 'High Priority', dot: 'bg-rose-500' },
                        { id: 'Medium', label: 'Medium Priority', dot: 'bg-amber-500' },
                        { id: 'Low', label: 'Low Priority', dot: 'bg-slate-400' },
                      ].map((item) => {
                        const count =
                          item.id === 'ALL'
                            ? deals.length
                            : deals.filter((d) => d.priority === item.id).length;
                        const isSelected = selectedPriorityFilter === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSelectedPriorityFilter(item.id);
                              onToast(
                                item.id === 'ALL'
                                  ? 'All priorities displayed'
                                  : `Segmented by ${item.id} Priority`
                              );
                            }}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer text-left ${
                              isSelected
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                              <span className="truncate">{item.label}</span>
                            </div>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                                isSelected
                                  ? 'bg-blue-200/80 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 2: Property Type Segmentation */}
                  <div className="space-y-1.5 px-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <span>Property Type</span>
                      {selectedPropertyTypeFilter !== 'ALL' && (
                        <button
                          onClick={() => setSelectedPropertyTypeFilter('ALL')}
                          className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline capitalize"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="max-h-44 overflow-y-auto pr-0.5 space-y-1">
                      <button
                        onClick={() => {
                          setSelectedPropertyTypeFilter('ALL');
                          onToast('All property types displayed');
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer ${
                          selectedPropertyTypeFilter === 'ALL'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>All Property Types</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                            {deals.length}
                          </span>
                          {selectedPropertyTypeFilter === 'ALL' && (
                            <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                      </button>

                      {availablePropertyTypes.map((type) => {
                        const count = deals.filter(
                          (d) => d.propertyType.toLowerCase() === type.toLowerCase()
                        ).length;
                        const isSelected =
                          selectedPropertyTypeFilter.toLowerCase() === type.toLowerCase();
                        return (
                          <button
                            key={type}
                            onClick={() => {
                              setSelectedPropertyTypeFilter(type);
                              onToast(`Segmented by property type: ${type}`);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {getPropertyTypeIcon(type)}
                              <span>{type}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                                  isSelected
                                    ? 'bg-blue-200/80 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {count}
                              </span>
                              {isSelected && (
                                <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dropdown Footer */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
                    <span>
                      Matching: <b className="text-slate-900 dark:text-white font-mono">{filteredDeals.length}</b> deals
                    </span>
                    <button
                      onClick={() => setIsFilterDropdownOpen(false)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-lg shadow-2xs transition cursor-pointer text-xs"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Chips Strip */}
      {(selectedPriorityFilter !== 'ALL' || selectedPropertyTypeFilter !== 'ALL' || searchTerm) && (
        <div className="flex flex-wrap items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs shadow-2xs animate-in fade-in">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Active Filters:
          </span>

          {selectedPriorityFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800/80">
              <span>Priority: {selectedPriorityFilter}</span>
              <button
                onClick={() => setSelectedPriorityFilter('ALL')}
                className="text-blue-500 hover:text-blue-800 dark:hover:text-white p-0.5 rounded-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedPropertyTypeFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/80">
              {getPropertyTypeIcon(selectedPropertyTypeFilter)}
              <span>Type: {selectedPropertyTypeFilter}</span>
              <button
                onClick={() => setSelectedPropertyTypeFilter('ALL')}
                className="text-emerald-500 hover:text-emerald-800 dark:hover:text-white p-0.5 rounded-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800/80">
              <span>Search: "{searchTerm}"</span>
              <button
                onClick={() => setSearchTerm('')}
                className="text-purple-500 hover:text-purple-800 dark:hover:text-white p-0.5 rounded-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono ml-auto">
            Showing {filteredDeals.length} of {deals.length} deals
          </span>

          <button
            onClick={handleClearFilters}
            className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* 4. Kanban Pipeline Board (Default Image Layout) */}
      {viewMode === 'kanban' && (
        <div className="space-y-3.5">
          {/* Helpful Drag-and-Drop Guidance & Real-time Pipeline Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-2.5 bg-white dark:bg-[#0c0e15] rounded-xl border border-slate-200/80 dark:border-amber-950/40 text-xs shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                  isDragging
                    ? 'bg-blue-600 text-white animate-pulse'
                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60'
                }`}
              >
                <Move className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {isDragging && draggedDealId ? (
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      Dragging #{deals.find((d) => d.id === draggedDealId)?.code}: Drop onto any column to change stage
                    </span>
                  ) : (
                    'Interactive Drag-and-Drop Pipeline'
                  )}
                </span>
                <span className="hidden md:inline text-slate-500 dark:text-slate-400 ml-2 text-[11px]">
                  {isDragging
                    ? 'Release mouse button over target stage column to confirm'
                    : 'Drag cards across columns to advance deal stages, or use the grip menu'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] self-end sm:self-auto">
              <span className="text-slate-500 dark:text-slate-400">
                Pipeline Value:{' '}
                <strong className="font-mono text-slate-900 dark:text-amber-300 text-xs font-bold">
                  {formatPrice(filteredDeals.reduce((sum, d) => sum + d.price, 0))}
                </strong>
              </span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span className="text-slate-500 dark:text-slate-400">
                <strong className="font-mono text-slate-800 dark:text-slate-200">{filteredDeals.length}</strong> active deals
              </span>
            </div>
          </div>

          {/* Kanban Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
            {columns.map((col) => {
              const colDeals = filteredDeals.filter((d) => d.stage === col.id);
              const stageTotalValue = colDeals.reduce((sum, d) => sum + d.price, 0);
              const isOverThisCol = isDragging && dragOverStage === col.id;
              const isSourceCol = isDragging && deals.find((d) => d.id === draggedDealId)?.stage === col.id;

              return (
                <div
                  key={col.id}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={(e) => handleDragLeave(e, col.id)}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={`rounded-2xl p-3 border transition-all duration-200 space-y-3 relative ${col.borderAccent} ${
                    isOverThisCol && !isSourceCol
                      ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-400 dark:border-blue-500 ring-2 ring-blue-500/40 shadow-md'
                      : 'bg-slate-100/70 dark:bg-[#0c0e15]/80 border-slate-200/70 dark:border-amber-950/40'
                  }`}
                >
                  {/* Column Header */}
                  <div className="px-1 pt-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-amber-100">
                        <span className={`w-2.5 h-2.5 rounded-full ${col.dotClass}`} />
                        <span className="truncate">{col.label}</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-amber-300 font-mono text-[10px] font-bold">
                          {colDeals.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                        <button
                          type="button"
                          onClick={() => {
                            setNewStage(col.id);
                            setIsNewDealModalOpen(true);
                          }}
                          className="p-1 hover:text-slate-700 dark:hover:text-amber-200 hover:bg-white dark:hover:bg-[#151926] rounded transition cursor-pointer"
                          title={`Add deal to ${col.label}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToast(`Viewing options for ${col.label} stage`)}
                          className="p-1 hover:text-slate-700 dark:hover:text-amber-200 hover:bg-white dark:hover:bg-[#151926] rounded transition cursor-pointer"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Column Stage Total Value Subtitle */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      <span>Volume</span>
                      <span className="font-semibold text-slate-600 dark:text-amber-400/80">
                        {formatPrice(stageTotalValue)}
                      </span>
                    </div>
                  </div>

                  {/* Column Cards Container & Drop Zone */}
                  <div className="space-y-3 min-h-[340px] relative">
                    {/* Active Drop Indicator slot when dragging over this column */}
                    {isOverThisCol && !isSourceCol && (
                      <div className="p-3 rounded-xl border-2 border-dashed border-blue-500 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2 text-xs font-bold shadow-inner animate-pulse">
                        <ArrowDown className="w-4 h-4 animate-bounce text-blue-600 dark:text-blue-400" />
                        <span>Drop here to move to {col.label}</span>
                      </div>
                    )}

                    {colDeals.map((deal) => {
                      const isThisCardDragged = draggedDealId === deal.id;

                      return (
                        <div
                          key={deal.id}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, deal)}
                          onDragEnd={handleDragEnd}
                          onClick={() => {
                            if (dragJustEndedRef.current) return;
                            setSelectedDeal(deal);
                          }}
                          className={`bg-white dark:bg-[#0f121a] rounded-2xl border p-3.5 shadow-2xs hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing space-y-3 group select-none ${
                            isThisCardDragged
                              ? 'opacity-35 scale-[0.98] ring-2 ring-blue-500 shadow-xl rotate-1 border-blue-400 dark:border-blue-500'
                              : 'border-slate-200/80 dark:border-amber-950/40 hover:border-slate-300 dark:hover:border-amber-500/40 dark:hover:shadow-[0_4px_24px_rgba(212,175,55,0.12)]'
                          }`}
                        >
                          {/* Card Header: Code + PDF Download + QR Code trigger + Priority + Drag Handle */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <span className="font-mono font-semibold text-slate-500 dark:text-amber-400/70 text-[11px]">
                                {deal.code}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadPdf(deal);
                                }}
                                disabled={downloadingPdfDealId === deal.id}
                                title="Download Deal Summary PDF"
                                className="p-1 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-blue-950/40 transition cursor-pointer"
                              >
                                {downloadingPdfDealId === deal.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                                ) : (
                                  <FileDown className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQrModalDeal(deal);
                                }}
                                title="Generate Listing QR Code"
                                className="p-1 rounded-md text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-amber-950/40 transition cursor-pointer"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5 relative">
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-slate-100 dark:bg-[#161a26] text-slate-600 dark:text-amber-200/90 border border-slate-200/60 dark:border-amber-950/50 flex items-center gap-1">
                                {getPropertyTypeIcon(deal.propertyType)}
                                <span>{deal.propertyType}</span>
                              </span>
                              {getPriorityBadge(deal.priority)}

                              {/* Interactive Drag Handle & Quick Stage Menu trigger */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMoveMenuDealId(activeMoveMenuDealId === deal.id ? null : deal.id);
                                  }}
                                  title="Drag card to move stage, or click to pick stage directly"
                                  className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-amber-300 transition cursor-pointer"
                                >
                                  <GripVertical className="w-3.5 h-3.5" />
                                </button>

                                {/* Quick Stage Changer Popover for Touch & 1-Click Access */}
                                {activeMoveMenuDealId === deal.id && (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#151926] rounded-xl shadow-xl border border-slate-200 dark:border-amber-950/60 p-1.5 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95"
                                  >
                                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                      Move Stage
                                    </div>
                                    {columns.map((c) => (
                                      <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => handleMoveDealStage(deal.id, c.id)}
                                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition cursor-pointer ${
                                          deal.stage === c.id
                                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 font-semibold'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c2233]'
                                        }`}
                                      >
                                        <span className="flex items-center gap-1.5">
                                          <span className={`w-2 h-2 rounded-full ${c.dotClass}`} />
                                          <span>{c.label}</span>
                                        </span>
                                        {deal.stage === c.id && <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Dual Image Preview: Left 2D Blueprint Floorplan + Right Exterior Render */}
                          <div className="grid grid-cols-2 gap-1.5 rounded-xl overflow-hidden bg-slate-50 dark:bg-[#090b10] border border-slate-100 dark:border-amber-950/40 h-28 relative pointer-events-none">
                            {/* Left: Floor Plan Blueprint */}
                            <div className="relative bg-white dark:bg-[#08090e] flex items-center justify-center p-1.5 overflow-hidden">
                              <img
                                src={deal.floorPlanUrl}
                                alt="Floor Plan"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-contain filter contrast-125 dark:invert dark:opacity-80 group-hover:scale-105 transition duration-300"
                              />
                              <div className="absolute bottom-1 left-1.5 flex items-center gap-1 px-1 py-0.5 bg-white/90 dark:bg-[#0f121a]/90 rounded text-[8px] font-bold text-slate-500 dark:text-amber-400 uppercase tracking-tighter border border-transparent dark:border-amber-500/20">
                                <span className="w-1.5 h-1.5 rounded-xs bg-slate-900 dark:bg-amber-400 inline-block" />
                                <span>Bronex</span>
                              </div>
                            </div>

                            {/* Right: Architectural Photo */}
                            <div className="relative overflow-hidden bg-slate-200 dark:bg-[#141824]">
                              <img
                                src={deal.photoUrl}
                                alt="Property Render"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                            </div>
                          </div>

                          {/* Title & Specifications */}
                          <div>
                            <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-amber-300 transition">
                              {deal.title}
                            </h3>
                            <div className="text-base font-bold font-mono text-slate-900 dark:text-amber-300 tracking-tight mt-1">
                              {formatPrice(deal.price)}
                            </div>
                          </div>

                          {/* Metadata Rows: Reservation / Client / Source */}
                          <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-amber-950/40">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400 dark:text-amber-500/60" />
                                <span>{deal.dateLabel}</span>
                              </span>
                              <span className="font-medium text-slate-700 dark:text-amber-200/80 font-mono">
                                {deal.dateValue}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-400 dark:text-amber-500/60" />
                                <span>Client</span>
                              </span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                                {deal.client}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3 text-slate-400 dark:text-amber-500/60" />
                                <span>Source</span>
                              </span>
                              <span className="text-slate-600 dark:text-amber-400/70 font-mono text-[10px]">
                                {deal.source}
                              </span>
                            </div>
                          </div>

                          {/* Footer Row: Agent Initials + Action Buttons + Counts */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-amber-950/40 text-[11px] text-slate-500 dark:text-slate-400">
                            {/* Agent Avatar Initials Chips */}
                            <div className="flex items-center gap-1">
                              {deal.assignedAgents.map((agent, i) => (
                                <span
                                  key={i}
                                  title={agent.name}
                                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${agent.avatarBg}`}
                                >
                                  {agent.initials}
                                </span>
                              ))}
                            </div>

                            {/* Action Buttons: PDF Download + QR Code */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadPdf(deal);
                                }}
                                disabled={downloadingPdfDealId === deal.id}
                                title="Download Deal Summary PDF"
                                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 transition cursor-pointer"
                              >
                                {downloadingPdfDealId === deal.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                                ) : (
                                  <FileDown className="w-3 h-3 text-blue-500" />
                                )}
                                <span>PDF</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQrModalDeal(deal);
                                }}
                                title="Generate QR code for this property listing"
                                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition cursor-pointer"
                              >
                                <QrCode className="w-3 h-3 text-amber-500" />
                                <span>QR Share</span>
                              </button>
                            </div>

                            {/* Comments and Files Counts */}
                            <div className="flex items-center gap-2 font-medium text-[10px]">
                              <span className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-amber-200">
                                <MessageSquare className="w-3 h-3 text-slate-400 dark:text-amber-500/60" />
                                <span>{deal.commentsCount}</span>
                              </span>
                              <span className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-amber-200">
                                <Paperclip className="w-3 h-3 text-slate-400 dark:text-amber-500/60" />
                                <span>{deal.filesCount}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Empty Stage Droppable Zone */}
                    {colDeals.length === 0 && (
                      <div
                        className={`p-6 text-center border-2 border-dashed rounded-xl space-y-2 transition flex flex-col items-center justify-center min-h-[180px] ${
                          isOverThisCol && !isSourceCol
                            ? 'border-blue-500 bg-blue-100/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/30'
                            : 'border-slate-200 dark:border-amber-950/50 text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {isOverThisCol && !isSourceCol ? (
                          <>
                            <ArrowDown className="w-5 h-5 text-blue-500 animate-bounce" />
                            <p className="text-xs font-bold text-blue-600 dark:text-blue-300">
                              Drop deal here to move to {col.label}
                            </p>
                          </>
                        ) : (
                          <>
                            <Layers className="w-5 h-5 text-slate-300 dark:text-slate-600 stroke-1" />
                            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                              No deals in this stage
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-600">
                              {isDragging ? `Drop card here to move to ${col.label}` : 'Drag cards here or click + to add'}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setNewStage(col.id);
                                setIsNewDealModalOpen(true);
                              }}
                              className="text-xs text-blue-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer pt-1"
                            >
                              + Create Deal
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Alternative View Mode: Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              onClick={() => setSelectedDeal(deal)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs hover:shadow-md transition cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-semibold text-slate-500 dark:text-amber-400/70">{deal.code}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPdf(deal);
                    }}
                    disabled={downloadingPdfDealId === deal.id}
                    title="Download Deal Summary & Property Details PDF"
                    className="p-1 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    {downloadingPdfDealId === deal.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                    ) : (
                      <FileDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQrModalDeal(deal);
                    }}
                    title="Generate QR code for this property listing"
                    className="p-1 rounded-md text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 flex items-center gap-1">
                    {getPropertyTypeIcon(deal.propertyType)}
                    <span>{deal.propertyType}</span>
                  </span>
                  {getPriorityBadge(deal.priority)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 h-32">
                <img
                  src={deal.floorPlanUrl}
                  alt="Floor Plan"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter contrast-125 dark:invert"
                />
                <img
                  src={deal.photoUrl}
                  alt="Photo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {deal.title}
                </h3>
                <div className="text-base font-bold font-mono text-slate-900 dark:text-white tracking-tight mt-1">
                  {formatPrice(deal.price)}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Client:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{deal.client}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stage:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase text-[10px]">
                    {deal.stage.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Grid Card Quick Actions: PDF & QR Code Generator */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPdf(deal);
                    }}
                    disabled={downloadingPdfDealId === deal.id}
                    title="Download Deal Summary & Property Details PDF"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 transition cursor-pointer"
                  >
                    {downloadingPdfDealId === deal.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                    ) : (
                      <FileDown className="w-3.5 h-3.5 text-blue-500" />
                    )}
                    <span>PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQrModalDeal(deal);
                    }}
                    title="Generate QR code for this property listing"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-500" />
                    <span>QR</span>
                  </button>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{deal.bedrooms} Beds • {deal.areaSqm}m²</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Alternative View Mode: Table List */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Property & Specs</th>
                <th className="p-3.5">Stage</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5 text-right">Price</th>
                <th className="p-3.5">Client & Contact</th>
                <th className="p-3.5">Source</th>
                <th className="p-3.5">Agents</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDeals.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() => setSelectedDeal(deal)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <td className="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {deal.code}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{deal.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {deal.bedrooms} Beds • {deal.areaSqm} m² • {deal.propertyType}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 uppercase">
                      {deal.stage.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5">{getPriorityBadge(deal.priority)}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatPrice(deal.price)}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white">{deal.client}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{deal.clientEmail || deal.clientPhone}</div>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">{deal.source}</td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1">
                      {deal.assignedAgents.map((ag, i) => (
                        <span
                          key={i}
                          className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${ag.avatarBg}`}
                        >
                          {ag.initials}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPdf(deal);
                        }}
                        disabled={downloadingPdfDealId === deal.id}
                        title="Download Deal Summary & Property Details PDF"
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        {downloadingPdfDealId === deal.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                        ) : (
                          <FileDown className="w-3.5 h-3.5 text-blue-500" />
                        )}
                        <span>PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQrModalDeal(deal);
                        }}
                        title="Generate QR code for this property listing"
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5 text-amber-500" />
                        <span>QR</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 7. Modal / Drawer: Deal 360 Detail View */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold font-mono text-blue-600 dark:text-blue-400">
                  {selectedDeal.code}
                </span>
                {getPriorityBadge(selectedDeal.priority)}
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded uppercase">
                  {selectedDeal.stage.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(selectedDeal)}
                  disabled={downloadingPdfDealId === selectedDeal.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition cursor-pointer shadow-xs"
                >
                  {downloadingPdfDealId === selectedDeal.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5" />
                  )}
                  <span>Download PDF Dossier</span>
                </button>

                <button
                  onClick={() => setSelectedDeal(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase mb-2">2D Floor Plan & Specs</span>
                <img
                  src={selectedDeal.floorPlanUrl}
                  alt="Floor Plan"
                  referrerPolicy="no-referrer"
                  className="max-h-56 object-contain filter contrast-125 dark:invert"
                />
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img
                  src={selectedDeal.photoUrl}
                  alt="Exterior"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover max-h-64"
                />
              </div>
            </div>

            {/* Title & Valuation */}
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedDeal.title}</h2>
              <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
                {formatPrice(selectedDeal.price)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{selectedDeal.description}</p>
            </div>

            {/* Move Stage Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Move Pipeline Stage:</span>
              <div className="flex flex-wrap gap-2">
                {columns.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      onUpdateDealStage(selectedDeal.id, col.id);
                      setSelectedDeal({ ...selectedDeal, stage: col.id });
                      onToast(`Deal moved to ${col.label}`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedDeal.stage === col.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Client</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedDeal.client}</span>
                <span className="text-[10px] text-slate-500 block font-mono">{selectedDeal.clientEmail}</span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Area & Bedrooms</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedDeal.bedrooms} Beds</span>
                <span className="text-[10px] text-slate-500 block font-mono">{selectedDeal.areaSqm} m² / {Math.round(selectedDeal.areaSqm * 10.764)} sqft</span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Source Portal</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedDeal.source}</span>
                <span className="text-[10px] text-emerald-600 block font-semibold">Direct Lead</span>
              </div>
            </div>

            {/* Property QR Code & Client Share Banner */}
            <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Property Listing QR Code Generator
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                      Unique Link
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Generate scannable codes, print flyers, copy direct URL, or dispatch via WhatsApp.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setQrModalDeal(selectedDeal)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-xs shrink-0"
              >
                <QrCode className="w-4 h-4" />
                <span>Open QR Generator</span>
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(selectedDeal)}
                  disabled={downloadingPdfDealId === selectedDeal.id}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  {downloadingPdfDealId === selectedDeal.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5" />
                  )}
                  <span>PDF Summary</span>
                </button>
                <button
                  onClick={() => {
                    onToast('Contract & Reservation agreements generated.');
                  }}
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold rounded-xl transition cursor-pointer"
                >
                  Generate Contract
                </button>
                <button
                  onClick={() => {
                    onToast('Email invitation sent to client.');
                  }}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Schedule Viewing
                </button>
                <button
                  type="button"
                  onClick={() => setQrModalDeal(selectedDeal)}
                  className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR Code</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedDeal(null)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modal: New Deal Creation */}
      {isNewDealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">+ Create New Deal</h2>
              <button
                onClick={() => setIsNewDealModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDealSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Deal Code / Ref</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Property Title & Specs</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Price (AED)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as DealPriority)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Property Type</label>
                  <select
                    value={newPropertyType}
                    onChange={(e) => setNewPropertyType(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Suite">Suite</option>
                    <option value="Serviced Residence">Serviced Residence</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Duplex">Duplex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pipeline Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as DealStage)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="new">New</option>
                    <option value="viewing_scheduled">Viewing Scheduled</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="legal_documentation">Legal & Documentation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Lead Source</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
                  <input
                    type="text"
                    value={newDateValue}
                    onChange={(e) => setNewDateValue(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewDealModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Property Listing QR Code Generator Modal */}
      <DealQRCodeModal
        isOpen={Boolean(qrModalDeal)}
        onClose={() => setQrModalDeal(null)}
        deal={qrModalDeal}
        onToast={onToast}
      />
    </div>
  );
};
