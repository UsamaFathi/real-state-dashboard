import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Table as TableIcon,
  LayoutGrid,
  Filter,
  Download,
  Plus,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Calculator,
  FileSignature,
  Maximize2,
  TrendingUp,
  User,
  Sliders,
  FileText,
  X,
  ArrowRight,
  Search,
  RotateCcw,
  ChevronDown,
  Check,
} from 'lucide-react';
import { UnitItem, NavigationTab } from '../../types';

interface InventoryViewProps {
  units: UnitItem[];
  selectedUnit: UnitItem;
  setSelectedUnit: (unit: UnitItem) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onCreateOfferForUnit: (unit: UnitItem) => void;
  onToast: (msg: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  units,
  selectedUnit,
  setSelectedUnit,
  onNavigateTab,
  onCreateOfferForUnit,
  onToast,
}) => {
  const [layoutMode, setLayoutMode] = useState<'table' | 'cards'>('table');
  const [viewMode, setViewMode] = useState<'table' | 'detail'>('table');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [filterProject, setFilterProject] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTabDetail, setActiveTabDetail] = useState<
    'price-history' | 'leads' | 'offers' | 'specs' | 'documents'
  >('price-history');
  const [isFloorPlanModalOpen, setIsFloorPlanModalOpen] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Close status dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: '/' focuses search input, 'Escape' clears search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        if (isStatusDropdownOpen) {
          setIsStatusDropdownOpen(false);
        } else if (document.activeElement === searchInputRef.current) {
          setSearchQuery('');
          searchInputRef.current?.blur();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStatusDropdownOpen]);

  // Distinct property types in portfolio for quick chips
  const propertyTypes = useMemo(() => {
    const types = new Set<string>();
    units.forEach((u) => {
      if (u.type) types.add(u.type);
    });
    return Array.from(types);
  }, [units]);

  // Status dropdown options definition
  const statusOptions = useMemo(
    () => [
      {
        id: 'all',
        label: 'All Statuses',
        color: 'bg-slate-400 dark:bg-slate-500',
        description: 'Entire active inventory',
      },
      {
        id: 'Available',
        label: 'Available',
        color: 'bg-emerald-500',
        description: 'Ready for offer or contract',
      },
      {
        id: 'Reserved',
        label: 'Reserved',
        color: 'bg-purple-500',
        description: 'Deposit placed / pending contract',
      },
      {
        id: 'Sold',
        label: 'Sold',
        color: 'bg-[#102A43] dark:bg-blue-500',
        description: 'Contract finalized & closed',
      },
      {
        id: 'Under Maintenance',
        label: 'Under Maintenance',
        color: 'bg-rose-500',
        description: 'Under inspection or repair',
      },
      {
        id: 'On Hold',
        label: 'On Hold',
        color: 'bg-amber-500',
        description: 'Temporarily withheld from market',
      },
    ],
    []
  );

  // Status distribution counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: units.length,
      Available: 0,
      Reserved: 0,
      Sold: 0,
      'Under Maintenance': 0,
      'On Hold': 0,
    };
    units.forEach((u) => {
      if (u.status === 'Available') counts.Available = (counts.Available || 0) + 1;
      else if (u.status === 'Reserved') counts.Reserved = (counts.Reserved || 0) + 1;
      else if (u.status === 'Sold' || u.status === 'Contracted') counts.Sold = (counts.Sold || 0) + 1;
      else if (u.status === 'Under Maintenance') counts['Under Maintenance'] = (counts['Under Maintenance'] || 0) + 1;
      else if (u.status === 'On Hold') counts['On Hold'] = (counts['On Hold'] || 0) + 1;
    });
    return counts;
  }, [units]);

  const activeStatusOption = useMemo(() => {
    return statusOptions.find((s) => s.id === selectedStatus) || statusOptions[0];
  }, [selectedStatus, statusOptions]);

  // Status badge styling helper for table & detail views
  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300';
      case 'Reserved':
        return 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300';
      case 'Sold':
      case 'Contracted':
        return 'bg-[#102A43] dark:bg-blue-950 text-white dark:text-blue-200 border border-transparent dark:border-blue-800';
      case 'Under Maintenance':
        return 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300';
      case 'On Hold':
        return 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300';
      default:
        return 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300';
    }
  };

  // Status badge styling helper for card view
  const getStatusCardClasses = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500 text-white';
      case 'Reserved':
        return 'bg-purple-600 text-white';
      case 'Sold':
      case 'Contracted':
        return 'bg-[#102A43] dark:bg-blue-950 text-white';
      case 'Under Maintenance':
        return 'bg-rose-600 text-white';
      case 'On Hold':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  // Real-time filtering by unit code OR type, plus status & project
  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      // Inline Search query match (by Unit Code or Type)
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesCode = unit.code.toLowerCase().includes(q);
        const matchesType = unit.type.toLowerCase().includes(q);
        const matchesProject = unit.project.toLowerCase().includes(q);
        if (!matchesCode && !matchesType && !matchesProject) {
          return false;
        }
      }

      // Quick type chip filter (if selected)
      if (selectedTypeFilter !== 'all' && unit.type.toLowerCase() !== selectedTypeFilter.toLowerCase()) {
        return false;
      }

      // Status dropdown filter
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'Sold') {
          if (unit.status !== 'Sold' && unit.status !== 'Contracted') {
            return false;
          }
        } else if (unit.status.toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }
      }

      // Project filter (if active)
      if (filterProject && !unit.project.toLowerCase().includes(filterProject.toLowerCase())) {
        return false;
      }

      // Legacy facet status filter (if active)
      if (filterStatus) {
        const statuses = filterStatus.split(',').map((s) => s.trim().toLowerCase());
        const matchesStatus = statuses.some((st) => unit.status.toLowerCase().includes(st));
        if (!matchesStatus) {
          return false;
        }
      }

      return true;
    });
  }, [units, searchQuery, selectedTypeFilter, selectedStatus, filterProject, filterStatus]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedTypeFilter('all');
    setSelectedStatus('all');
    setFilterProject(null);
    setFilterStatus(null);
    setCurrentPage(1);
    searchInputRef.current?.focus();
  };

  // Helper to visually highlight search query matches in code or type
  const highlightMatch = (text: string, query: string) => {
    if (!query || !query.trim()) return text;
    const q = query.trim().toLowerCase();
    const lowerText = text.toLowerCase();
    const index = lowerText.indexOf(q);
    if (index === -1) return text;
    const before = text.substring(0, index);
    const match = text.substring(index, index + q.length);
    const after = text.substring(index + q.length);
    return (
      <>
        {before}
        <mark className="bg-amber-200 dark:bg-amber-900/70 text-slate-900 dark:text-amber-100 px-1 py-0.5 rounded font-semibold">
          {match}
        </mark>
        {after}
      </>
    );
  };

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredUnits.length / pageSize));
  const currentPageIndex = Math.min(Math.max(1, currentPage), totalPages);
  const pagedUnits = filteredUnits.slice(
    (currentPageIndex - 1) * pageSize,
    currentPageIndex * pageSize
  );

  const handleRecalculatePrice = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      onToast('Automated pricing model updated with current floor & view indexes.');
    }, 450);
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredUnits.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredUnits.map((u) => u.id));
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter((rowId) => rowId !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  // Calculate pricing breakdown for selectedUnit
  const floorPremiumAmt = (selectedUnit.basePrice * selectedUnit.floorPremiumPercent) / 100;
  const commercialPrice =
    selectedUnit.basePrice + floorPremiumAmt + selectedUnit.viewPremium + selectedUnit.seasonalDiscount;
  const pricePerSqft = Math.round(commercialPrice / selectedUnit.internalArea);

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-4 animate-in fade-in duration-150">
      {/* If viewMode is TABLE */}
      {viewMode === 'table' ? (
        <div className="space-y-4">
          {/* Breadcrumbs & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
                <span
                  onClick={() => onNavigateTab('shadcn-dashboard')}
                  className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Overview
                </span>
                <span>›</span>
                <span>Properties</span>
                <span>›</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">Units</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Units</h1>
            </div>

            {/* View Mode & Export Actions */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 shadow-2xs">
                <button
                  onClick={() => setLayoutMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                    layoutMode === 'table'
                      ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
                <button
                  onClick={() => setLayoutMode('cards')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                    layoutMode === 'cards'
                      ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
              </div>

              <button
                onClick={() => onToast('Exporting Property Inventory to CSV...')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Inline Search Bar & Filter Matrix */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
              {/* Search & Status Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-3xl">
                {/* Inline Real-time Search Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Filter by unit code (e.g. UN-4205, AZ-T1, Z-802) or type..."
                    className="w-full pl-10 pr-32 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition shadow-inner"
                  />
                  {searchQuery ? (
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                        {filteredUnits.length} {filteredUnits.length === 1 ? 'match' : 'matches'}
                      </span>
                      <button
                        onClick={handleClearSearch}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition cursor-pointer"
                        title="Clear search (Esc)"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded font-mono">
                        Press / to search
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Dropdown Filter */}
                <div className="relative shrink-0" ref={statusDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    aria-label="Filter properties by status"
                    aria-expanded={isStatusDropdownOpen}
                    className={`w-full sm:w-auto flex items-center justify-between gap-2 px-3 py-2.5 text-xs sm:text-sm font-medium rounded-lg border transition cursor-pointer ${
                      selectedStatus !== 'all'
                        ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${activeStatusOption.color} shrink-0`} />
                      <span className="text-slate-500 dark:text-slate-400 font-normal">Status:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {activeStatusOption.label}
                      </span>
                      {selectedStatus !== 'all' && (
                        <span className="text-[11px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold font-mono">
                          {statusCounts[selectedStatus] ?? 0}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-1 text-slate-400">
                      {selectedStatus !== 'all' && (
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStatus('all');
                            setCurrentPage(1);
                          }}
                          className="hover:text-slate-600 dark:hover:text-slate-200 p-0.5 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded transition cursor-pointer"
                          title="Clear status filter"
                        >
                          <X className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isStatusDropdownOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Status Dropdown Menu Popover */}
                  {isStatusDropdownOpen && (
                    <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 w-72 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span>Filter by Status</span>
                        <span className="text-slate-400 font-normal lowercase">{units.length} total</span>
                      </div>

                      <div className="py-1 max-h-72 overflow-y-auto">
                        {statusOptions.map((opt) => {
                          const isSelected = selectedStatus === opt.id;
                          const count = statusCounts[opt.id] ?? 0;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setSelectedStatus(opt.id);
                                setIsStatusDropdownOpen(false);
                                setCurrentPage(1);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition cursor-pointer text-left ${
                                isSelected
                                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100 font-semibold'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-2.5 h-2.5 rounded-full ${opt.color} shrink-0`} />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span>{opt.label}</span>
                                    {isSelected && (
                                      <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                                    {opt.description}
                                  </div>
                                </div>
                              </div>
                              <span
                                className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-medium ${
                                  isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {selectedStatus !== 'all' && (
                        <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800 px-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStatus('all');
                              setIsStatusDropdownOpen(false);
                              setCurrentPage(1);
                            }}
                            className="w-full py-1.5 text-center text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                          >
                            Reset to All Statuses
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Portfolio Stats & Save View */}
              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-900 dark:text-white">{filteredUnits.length}</span>
                  <span>of {units.length} properties</span>
                  {(searchQuery || selectedTypeFilter !== 'all' || selectedStatus !== 'all') && (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      (filtered)
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onToast('Current view & filter preset saved.')}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save View</span>
                </button>
              </div>
            </div>

            {/* Quick Type Filter Chips Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase mr-1">
                  Type:
                </span>
                <button
                  onClick={() => {
                    setSelectedTypeFilter('all');
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedTypeFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  All ({units.length})
                </button>
                {propertyTypes.map((type) => {
                  const count = units.filter((u) => u.type === type).length;
                  const isSelected = selectedTypeFilter.toLowerCase() === type.toLowerCase();
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedTypeFilter(isSelected ? 'all' : type);
                        setCurrentPage(1);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {type} <span className="opacity-70 text-[10px]">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Secondary Facet Controls & Clear Filters */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToast('Advanced filter matrix configured')}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  <Filter className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  <span>Advanced</span>
                </button>

                {selectedStatus !== 'all' && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-medium">
                    <span className={`w-2 h-2 rounded-full ${activeStatusOption.color}`} />
                    <span>Status: {activeStatusOption.label}</span>
                    <button
                      onClick={() => {
                        setSelectedStatus('all');
                        setCurrentPage(1);
                      }}
                      className="hover:text-blue-900 dark:hover:text-blue-100 cursor-pointer"
                      title="Clear status filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {filterProject && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-medium">
                    <span>{filterProject}</span>
                    <button
                      onClick={() => setFilterProject(null)}
                      className="hover:text-blue-900 dark:hover:text-blue-100 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {filterStatus && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-medium">
                    <span>{filterStatus}</span>
                    <button
                      onClick={() => setFilterStatus(null)}
                      className="hover:text-blue-900 dark:hover:text-blue-100 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {(searchQuery || selectedTypeFilter !== 'all' || selectedStatus !== 'all' || filterProject || filterStatus) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTypeFilter('all');
                      setSelectedStatus('all');
                      setFilterProject(null);
                      setFilterStatus(null);
                      setCurrentPage(1);
                      onToast('Filters reset to default view.');
                    }}
                    className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Content */}
          {layoutMode === 'table' ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                      <th className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedRowIds.length === filteredUnits.length &&
                            filteredUnits.length > 0
                          }
                          onChange={toggleSelectAll}
                          className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="p-3">Unit Code</th>
                      <th className="p-3">Project & Location</th>
                      <th className="p-3">Type</th>
                      <th className="p-3 text-right">Area (SQFT)</th>
                      <th className="p-3 text-right">Base Price</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUnits.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center">
                          <div className="max-w-md mx-auto space-y-3">
                            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                              <Search className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                              No matching properties found
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              No units match {searchQuery ? <span>search query <strong className="font-mono text-slate-800 dark:text-slate-200">"{searchQuery}"</strong></span> : ''}
                              {selectedTypeFilter !== 'all' ? <span> with type <strong>"{selectedTypeFilter}"</strong></span> : ''}.
                              Try refining your search by unit code or type.
                            </p>
                            <div className="pt-1">
                              <button
                                onClick={handleClearSearch}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer inline-flex items-center gap-1.5"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset Search & Filters</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      pagedUnits.map((unit) => {
                        const isSelected = selectedRowIds.includes(unit.id);
                        return (
                          <tr
                            key={unit.id}
                            onClick={() => {
                              setSelectedUnit(unit);
                              setViewMode('detail');
                            }}
                            className={`hover:bg-blue-50/50 dark:hover:bg-blue-950/40 cursor-pointer transition ${
                              isSelected ? 'bg-blue-50/70 dark:bg-blue-950/60' : ''
                            }`}
                          >
                            <td className="p-3 text-center" onClick={(e) => toggleSelectRow(unit.id, e)}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>
                            <td className="p-3 font-bold text-blue-600 dark:text-blue-400 font-mono hover:underline">
                              {highlightMatch(unit.code, searchQuery)}
                            </td>
                            <td className="p-3">
                              <div className="font-medium text-slate-900 dark:text-white">{unit.project}</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">{unit.location}</div>
                            </td>
                            <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                                {highlightMatch(unit.type, searchQuery)}
                              </span>
                            </td>
                            <td className="p-3 text-right font-mono text-slate-800 dark:text-slate-200">
                              {unit.internalArea.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-3 text-right font-mono font-semibold text-slate-900 dark:text-white">
                              ${unit.basePrice.toLocaleString()}
                            </td>
                            <td className="p-3 text-right">
                              <span
                                className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded ${getStatusBadgeClasses(
                                  unit.status
                                )}`}
                              >
                                {unit.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/40 gap-3">
                <div>
                  Showing {filteredUnits.length === 0 ? 0 : (currentPageIndex - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPageIndex * pageSize, filteredUnits.length)} of {filteredUnits.length} units
                  {units.length !== filteredUnits.length && (
                    <span className="ml-1 text-slate-400 dark:text-slate-500">
                      (filtered from {units.length} total)
                    </span>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1 font-medium self-end sm:self-auto">
                    <button
                      disabled={currentPageIndex <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
                          pageNum === currentPageIndex
                            ? 'border border-blue-600 bg-blue-600 text-white'
                            : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button
                      disabled={currentPageIndex >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUnits.length === 0 ? (
                <div className="col-span-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-2xs">
                  <div className="max-w-md mx-auto space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      No matching properties found
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      No units match {searchQuery ? <span>search query <strong className="font-mono text-slate-800 dark:text-slate-200">"{searchQuery}"</strong></span> : ''}
                      {selectedTypeFilter !== 'all' ? <span> with type <strong>"{selectedTypeFilter}"</strong></span> : ''}.
                    </p>
                    <div className="pt-1">
                      <button
                        onClick={handleClearSearch}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Search & Filters</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                pagedUnits.map((unit) => (
                  <div
                    key={unit.id}
                    onClick={() => {
                      setSelectedUnit(unit);
                      setViewMode('detail');
                    }}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={unit.imageUrl}
                        alt={unit.code}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span
                        className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-0.5 rounded shadow-sm ${getStatusCardClasses(
                          unit.status
                        )}`}
                      >
                        {unit.status}
                      </span>
                      <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                        {highlightMatch(unit.code, searchQuery)}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">{unit.project}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{unit.location}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase block font-semibold">Type</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {highlightMatch(unit.type, searchQuery)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase block font-semibold">Area</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{unit.internalArea} SQFT</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block font-semibold">Base Price</span>
                          <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                            ${unit.basePrice.toLocaleString()}
                          </span>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition">
                          <span>Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        /* Unit Detail 360 View (Matching Image 2) */
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Breadcrumb navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
                <span
                  onClick={() => setViewMode('table')}
                  className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Inventory
                </span>
                <span>›</span>
                <span>{selectedUnit.district || 'Downtown Harbor District'}</span>
                <span>›</span>
                <span>{selectedUnit.project}</span>
                <span>›</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedUnit.code}</span>
              </div>

              {/* Title & Badge */}
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {selectedUnit.code}
                </h1>
                <span
                  className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded ${getStatusBadgeClasses(
                    selectedUnit.status
                  )}`}
                >
                  ● {selectedUnit.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Premium Corner Suite • UID: {selectedUnit.code} • Last updated 2h ago
              </p>
            </div>

            {/* Action Buttons Top Right */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRecalculatePrice}
                disabled={isRecalculating}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition active:scale-[0.98] cursor-pointer"
              >
                <Calculator className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
                <span>Recalculate Price</span>
              </button>

              <button
                onClick={() => {
                  onCreateOfferForUnit(selectedUnit);
                  onNavigateTab('offers');
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-[0.98] cursor-pointer"
              >
                <FileSignature className="w-3.5 h-3.5" />
                <span>Create Offer</span>
              </button>
            </div>
          </div>

          {/* Main 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Photo Viewer & Lower Tabs */}
            <div className="lg:col-span-8 space-y-4">
              {/* Unit Detail 360 Viewer Card */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
                {/* Header label in viewer */}
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">UNIT DETAIL 360</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToast('Full 360 degree virtual tour loaded in viewport')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Big Image Viewer with Floorplan Inset */}
                <div className="relative h-[340px] sm:h-[400px] bg-slate-900 group">
                  <img
                    src={selectedUnit.imageUrl}
                    alt={selectedUnit.code}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* Floorplan Inset Thumbnail */}
                  <div
                    onClick={() => setIsFloorPlanModalOpen(true)}
                    className="absolute bottom-4 right-4 w-36 h-28 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs rounded-lg p-1.5 shadow-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:scale-105 transition"
                    title="Click to expand 2D/3D Floor Plan"
                  >
                    <div className="text-[9px] font-semibold text-slate-600 dark:text-slate-300 uppercase mb-0.5">Floor Plan</div>
                    <img
                      src={selectedUnit.floorPlanUrl}
                      alt="Floor plan"
                      referrerPolicy="no-referrer"
                      className="w-full h-20 object-contain rounded bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                {/* Ribbon Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 p-3 text-center text-xs">
                  <div>
                    <div className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500">TYPE</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedUnit.type}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500">INTERNAL AREA</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedUnit.internalArea} SQFT</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500">BALCONY AREA</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedUnit.balconyArea} SQFT</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500">ORIENTATION</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedUnit.orientation}</div>
                  </div>
                </div>
              </div>

              {/* Lower Section Tabs: Price History, Related Leads, Offers, Specs, Documents */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex items-center border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-semibold">
                  <button
                    onClick={() => setActiveTabDetail('price-history')}
                    className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition cursor-pointer ${
                      activeTabDetail === 'price-history'
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/30'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Price History</span>
                  </button>

                  <button
                    onClick={() => setActiveTabDetail('leads')}
                    className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition cursor-pointer ${
                      activeTabDetail === 'leads'
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/30'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Related Leads ({selectedUnit.leadCount})</span>
                  </button>

                  <button
                    onClick={() => setActiveTabDetail('offers')}
                    className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition cursor-pointer ${
                      activeTabDetail === 'offers'
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/30'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileSignature className="w-3.5 h-3.5" />
                    <span>Offers (0)</span>
                  </button>

                  <button
                    onClick={() => setActiveTabDetail('specs')}
                    className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition cursor-pointer ${
                      activeTabDetail === 'specs'
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/30'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Specs & Amenities</span>
                  </button>

                  <button
                    onClick={() => setActiveTabDetail('documents')}
                    className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition cursor-pointer ${
                      activeTabDetail === 'documents'
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/30'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Documents</span>
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                  {activeTabDetail === 'price-history' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">Valuation Timeline</span>
                        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                            <span>Base Price</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-300 dark:bg-blue-400" />
                            <span>Final Commercial</span>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                              <th className="pb-2">Date</th>
                              <th className="pb-2">Event</th>
                              <th className="pb-2 text-right">Base Value</th>
                              <th className="pb-2 text-right">Adjustments</th>
                              <th className="pb-2 text-right">Final Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {selectedUnit.priceHistory.map((ph, i) => (
                              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                                <td className="py-2.5 font-mono text-slate-600 dark:text-slate-400">{ph.date}</td>
                                <td className="py-2.5 text-slate-800 dark:text-slate-200 font-medium">{ph.event}</td>
                                <td className="py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">
                                  ${ph.baseValue.toLocaleString()}
                                </td>
                                <td
                                  className={`py-2.5 text-right font-mono font-medium ${
                                    ph.adjustments >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                                  }`}
                                >
                                  {ph.adjustments >= 0 ? `+$${ph.adjustments.toLocaleString()}` : `-$${Math.abs(ph.adjustments).toLocaleString()}`}
                                </td>
                                <td className="py-2.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                                  ${ph.finalPrice.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTabDetail === 'leads' && (
                    <div className="space-y-2 text-xs">
                      <div className="font-semibold text-slate-900 dark:text-white mb-2">Active Prospective Buyers</div>
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">Apex Corp Ltd.</div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">Budget: $1.8M - $2.0M • Assigned to Sarah Jenkins</div>
                        </div>
                        <span className="bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 font-semibold px-2 py-0.5 rounded text-[11px]">
                          Offer Phase
                        </span>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">David Sterling Private Trust</div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">Budget: $1.9M • Assigned to Marcus Wong</div>
                        </div>
                        <span className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-2 py-0.5 rounded text-[11px]">
                          Viewing Scheduled
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTabDetail === 'specs' && (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {selectedUnit.specifications?.map((spec, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-semibold block">
                            {spec.label}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTabDetail === 'documents' && (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium text-slate-900 dark:text-white">Deed_and_Title_UN4205.pdf</span>
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">2.4 MB</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium text-slate-900 dark:text-white">Engineering_Specs_Finishes_Matrix.pdf</span>
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">5.8 MB</span>
                      </div>
                    </div>
                  )}

                  {activeTabDetail === 'offers' && (
                    <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
                      <FileSignature className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-1.5" />
                      <p className="font-medium">No open commercial offers pending for this unit.</p>
                      <button
                        onClick={() => {
                          onCreateOfferForUnit(selectedUnit);
                          onNavigateTab('offers');
                        }}
                        className="mt-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                      >
                        + Create First Offer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Pricing Overview & Allocation Status (Matching Image 2) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Pricing Overview Card */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Pricing Overview</h2>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold tracking-widest cursor-pointer">
                    •••
                  </button>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Commercial Price
                  </div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono tracking-tight mt-0.5">
                    ${commercialPrice.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">USD</span>
                  </div>
                </div>

                {/* Line Item Breakdown */}
                <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span>Base Price</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-white">
                      ${selectedUnit.basePrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span>Floor Premium (+{selectedUnit.floorPremiumPercent}%)</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-white">
                      +${floorPremiumAmt.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span>View Premium (Corner)</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-white">
                      +${selectedUnit.viewPremium.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-red-600 dark:text-red-400 font-medium">
                    <span>Seasonal Discount</span>
                    <span className="font-mono">
                      -${Math.abs(selectedUnit.seasonalDiscount).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white">
                  <span>Price per SQFT</span>
                  <span className="font-mono">${pricePerSqft.toLocaleString()}</span>
                </div>
              </div>

              {/* Allocation Status Card */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Allocation Status</h2>
                </div>

                <div className="p-3 bg-blue-50/70 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/60 rounded-lg flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    EB
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">Global Sales Channel</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Allocated • No active holds</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Interest Level</span>
                    <span className="text-red-600 dark:text-red-400 font-bold text-xs">
                      High ({selectedUnit.leadCount} Leads)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full w-[85%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal for Fullscreen Floor Plan */}
          {isFloorPlanModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
              <div
                className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {selectedUnit.code} — Architectural CAD Floor Plan
                  </h3>
                  <button
                    onClick={() => setIsFloorPlanModalOpen(false)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedUnit.floorPlanUrl}
                    alt="Expanded Floor Plan"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-2">
                  <span>Gross Internal Area: {selectedUnit.internalArea} SQFT</span>
                  <button
                    onClick={() => {
                      onToast('Exporting high-resolution vector CAD blueprint...');
                      setIsFloorPlanModalOpen(false);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg cursor-pointer"
                  >
                    Download CAD (DWG / PDF)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
