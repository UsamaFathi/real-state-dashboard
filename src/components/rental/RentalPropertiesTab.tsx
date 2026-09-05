import React, { useState } from 'react';
import {
  Building2,
  BedDouble,
  Bath,
  Maximize2,
  Calendar,
  User,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Wrench,
  Sparkles,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { RentalUnit, UnitRentalStatus, PropertyCategory } from '../../types/rentalTypes';

interface RentalPropertiesTabProps {
  units: RentalUnit[];
  selectedUnit: RentalUnit | null;
  setSelectedUnit: (unit: RentalUnit | null) => void;
  onOpenNewUnit: () => void;
  onCreateContractForUnit: (unit: RentalUnit) => void;
  onOpenMaintenanceForUnit: (unit: RentalUnit) => void;
  onToast: (msg: string) => void;
}

export const RentalPropertiesTab: React.FC<RentalPropertiesTabProps> = ({
  units,
  selectedUnit,
  setSelectedUnit,
  onOpenNewUnit,
  onCreateContractForUnit,
  onOpenMaintenanceForUnit,
  onToast,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredUnits = units.filter((u) => {
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || u.category === categoryFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.currentTenant && u.currentTenant.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: UnitRentalStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50';
      case 'Rented':
        return 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700/50';
      case 'Under Maintenance':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-700/50';
      case 'Reserved':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-700/50';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-[#0c0e15] rounded-2xl p-4 border border-slate-200/80 dark:border-amber-950/40 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search units by code, title, district, or tenant..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-xs text-slate-900 dark:text-amber-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Status Quick Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {['All', 'Available', 'Rented', 'Under Maintenance'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-500/40'
                    : 'bg-slate-100 text-slate-600 dark:bg-[#121520] dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenNewUnit}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-500 dark:text-slate-950 dark:font-bold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Property Unit</span>
        </button>
      </div>

      {/* Grid of Rental Properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredUnits.map((unit) => (
          <div
            key={unit.id}
            onClick={() => setSelectedUnit(unit)}
            className="bg-white dark:bg-[#0f121a] rounded-2xl border border-slate-200/80 dark:border-amber-950/40 overflow-hidden shadow-xs hover:shadow-lg hover:border-amber-500/40 dark:hover:shadow-[0_4px_24px_rgba(212,175,55,0.12)] transition duration-200 cursor-pointer flex flex-col justify-between group"
          >
            {/* Top Image + Dual Blueprint Preview */}
            <div className="relative h-44 bg-slate-100 dark:bg-[#07080c] overflow-hidden">
              <img
                src={unit.imageUrl}
                alt={unit.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${getStatusBadge(
                    unit.status
                  )}`}
                >
                  {unit.status}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
                  {unit.category}
                </span>
              </div>

              {/* Floor Plan Blueprint Watermark Stamp */}
              <div className="absolute bottom-2 left-2.5 flex items-center gap-1 px-1.5 py-0.5 bg-black/70 rounded text-[9px] font-mono text-amber-300 backdrop-blur-md">
                <span>{unit.code}</span>
              </div>

              {/* Monthly Rent Floating Badge */}
              <div className="absolute bottom-2 right-2.5 text-right">
                <div className="text-sm font-bold font-mono text-white text-shadow">
                  AED {unit.monthlyRent.toLocaleString()}
                  <span className="text-[10px] font-normal text-slate-300 font-sans">/mo</span>
                </div>
              </div>
            </div>

            {/* Details Body */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition line-clamp-1">
                  {unit.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {unit.district} • Floor {unit.floor} {unit.tower ? `• ${unit.tower}` : ''}
                </p>
              </div>

              {/* Specs: Beds / Baths / Sqft */}
              <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 bg-slate-50 dark:bg-[#151926] rounded-xl text-[11px] text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-amber-950/30">
                <div className="flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-slate-400 dark:text-amber-400/70" />
                  <span>{unit.beds > 0 ? `${unit.beds} Bed` : 'Studio'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-slate-400 dark:text-amber-400/70" />
                  <span>{unit.baths} Bath</span>
                </div>
                <div className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400 dark:text-amber-400/70" />
                  <span>{unit.areaSqft} sqft</span>
                </div>
              </div>

              {/* Current Tenant or Owner Information */}
              <div className="pt-2 border-t border-slate-100 dark:border-amber-950/40 text-[11px] space-y-1">
                {unit.currentTenant ? (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate max-w-[130px]">
                      <User className="w-3 h-3 text-emerald-500" />
                      <span>{unit.currentTenant.name}</span>
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-mono text-[10px]">
                      Lease: {unit.currentTenant.leaseEnd}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Owner: {unit.ownerName.split(' ')[0]}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Ready to Lease</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-2.5 flex items-center gap-2">
                {unit.status === 'Available' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateContractForUnit(unit);
                    }}
                    className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                  >
                    + Create Lease
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToast(`Opened lease details for ${unit.code}`);
                    }}
                    className="flex-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-200 rounded-lg text-xs font-medium transition"
                  >
                    View Tenancy
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenMaintenanceForUnit(unit);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Log Maintenance"
                >
                  <Wrench className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
