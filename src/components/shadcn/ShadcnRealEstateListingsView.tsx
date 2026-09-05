import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Search,
  Filter,
  Eye,
  Heart,
  Share2,
  Sparkles,
  ArrowUpRight,
  Plus,
  Grid,
  List,
} from 'lucide-react';

interface ShadcnRealEstateListingsViewProps {
  onNavigateTab?: (tab: string) => void;
  onToast?: (msg: string) => void;
}

export const ShadcnRealEstateListingsView: React.FC<ShadcnRealEstateListingsViewProps> = ({
  onNavigateTab,
  onToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const properties = [
    {
      id: 'prop-1',
      title: 'The Somerset',
      type: 'House',
      price: '$4,850,000',
      address: '742 Evergreen Terrace, Beverly Hills, CA',
      beds: 4,
      baths: 3.5,
      sqft: '4,200',
      sold: 175,
      rented: 125,
      views: '2.4K',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      recommendedLeads: 14,
      status: 'Active',
    },
    {
      id: 'prop-2',
      title: 'The Grandview Penthouse',
      type: 'Penthouse',
      price: '$8,200,000',
      address: '100 Ocean Drive, Miami Beach, FL',
      beds: 5,
      baths: 6.0,
      sqft: '6,100',
      sold: 42,
      rented: 30,
      views: '4.1K',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      recommendedLeads: 21,
      status: 'Active',
    },
    {
      id: 'prop-3',
      title: 'Azure Coast Villa',
      type: 'Villa',
      price: '$6,400,000',
      address: '22 Marina Blvd, Newport Beach, CA',
      beds: 4,
      baths: 4.5,
      sqft: '5,300',
      sold: 88,
      rented: 64,
      views: '3.2K',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      recommendedLeads: 18,
      status: 'Active',
    },
    {
      id: 'prop-4',
      title: 'Skyline Terrace Loft',
      type: 'Apartment',
      price: '$2,150,000',
      address: '450 Lexington Ave, New York, NY',
      beds: 2,
      baths: 2.0,
      sqft: '1,850',
      sold: 310,
      rented: 240,
      views: '5.8K',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      recommendedLeads: 32,
      status: 'Under Contract',
    },
    {
      id: 'prop-5',
      title: 'Pinecrest Modern Manor',
      type: 'House',
      price: '$5,750,000',
      address: '88 Whispering Pines Rd, Aspen, CO',
      beds: 6,
      baths: 7.0,
      sqft: '7,400',
      sold: 60,
      rented: 45,
      views: '1.9K',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      recommendedLeads: 9,
      status: 'Active',
    },
    {
      id: 'prop-6',
      title: 'Bel Air Glass Pavilion',
      type: 'Villa',
      price: '$12,900,000',
      address: '1400 Bel Air Rd, Los Angeles, CA',
      beds: 7,
      baths: 9.0,
      sqft: '9,800',
      sold: 14,
      rented: 10,
      views: '8.4K',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      recommendedLeads: 28,
      status: 'Active',
    },
  ];

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || p.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 font-sans text-gray-900 dark:text-gray-100">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
            Real Estate Listings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage active portfolio properties, lead matching, and status
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab?.('shadcn-filter')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#161822] border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1d28] transition cursor-pointer flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Advanced Filter</span>
          </button>
          <button
            onClick={() => onToast?.('New Property Creation Dialog Opened')}
            className="px-4 py-2 rounded-xl bg-gray-950 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Ribbon */}
      <div className="bg-white dark:bg-[#11131c] rounded-2xl p-4 border border-gray-200/90 dark:border-gray-800/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, address, or neighborhood..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-[#161822] border border-gray-200 dark:border-gray-700/60 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['All', 'House', 'Villa', 'Penthouse', 'Apartment'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedType === type
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-2xs'
                  : 'bg-gray-100 dark:bg-[#181a24] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#202330]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700/50 self-end md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs transition cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-[#161822] text-gray-900 dark:text-white shadow-2xs'
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs transition cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-[#161822] text-gray-900 dark:text-white shadow-2xs'
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Properties */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#11131c] rounded-2xl overflow-hidden border border-gray-200/90 dark:border-gray-800/80 shadow-2xs hover:shadow-md transition group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-sky-500/85 text-white backdrop-blur-md text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    <span>Rec. to {item.recommendedLeads} Leads</span>
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 text-white backdrop-blur-md text-[11px] font-semibold">
                    {item.type}
                  </div>
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/80 text-white backdrop-blur-md text-sm font-bold">
                    {item.price}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-gray-950 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{item.address}</span>
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-4 py-2 border-y border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.beds} Beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.baths} Baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.sqft} sqft</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-1">
                    <div className="bg-gray-50 dark:bg-[#161822] p-2 rounded-lg">
                      <div className="font-bold text-gray-900 dark:text-white">{item.sold}</div>
                      <div className="text-[10px] text-gray-500">Sold</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#161822] p-2 rounded-lg">
                      <div className="font-bold text-gray-900 dark:text-white">{item.rented}</div>
                      <div className="text-[10px] text-gray-500">Rented</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#161822] p-2 rounded-lg">
                      <div className="font-bold text-gray-900 dark:text-white">{item.views}</div>
                      <div className="text-[10px] text-gray-500">Views</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between gap-2">
                <button
                  onClick={() => onNavigateTab?.('shadcn-detail')}
                  className="flex-1 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold transition cursor-pointer text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => onToast?.(`Brochure sent for ${item.title}`)}
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#161822] transition cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-[#11131c] rounded-2xl border border-gray-200/90 dark:border-gray-800/80 shadow-2xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-[#161822] text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price</th>
                <th className="p-4">Specs</th>
                <th className="p-4">Performance</th>
                <th className="p-4">Leads Match</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 dark:hover:bg-[#161822]/60 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{item.title}</div>
                        <div className="text-[11px] text-gray-500 truncate max-w-xs">{item.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{item.type}</td>
                  <td className="p-4 font-bold text-gray-900 dark:text-white">{item.price}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {item.beds}b • {item.baths}ba • {item.sqft} sqft
                  </td>
                  <td className="p-4">
                    <span className="text-gray-900 dark:text-white font-medium">{item.sold} sold</span> •{' '}
                    <span className="text-gray-500">{item.views} views</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 font-semibold text-[11px]">
                      <Sparkles className="w-3 h-3" /> {item.recommendedLeads} Leads
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onNavigateTab?.('shadcn-detail')}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold transition cursor-pointer"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
