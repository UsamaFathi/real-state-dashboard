import React, { useState } from 'react';
import {
  Filter,
  Search,
  RotateCcw,
  Sparkles,
  MapPin,
  Building2,
  DollarSign,
  Bed,
  Bath,
  Sliders,
  Check,
} from 'lucide-react';

interface ShadcnRealEstateFilterViewProps {
  onNavigateTab?: (tab: string) => void;
  onToast?: (msg: string) => void;
}

export const ShadcnRealEstateFilterView: React.FC<ShadcnRealEstateFilterViewProps> = ({
  onNavigateTab,
  onToast,
}) => {
  const [propertyType, setPropertyType] = useState<string[]>(['House', 'Villa']);
  const [minPrice, setMinPrice] = useState(1000000);
  const [maxPrice, setMaxPrice] = useState(8000000);
  const [bedrooms, setBedrooms] = useState('4+');
  const [bathrooms, setBathrooms] = useState('3+');
  const [amenities, setAmenities] = useState<string[]>([
    'Swimming Pool',
    'Ocean View',
    'Smart Home',
  ]);

  const toggleType = (t: string) => {
    if (propertyType.includes(t)) {
      setPropertyType(propertyType.filter((x) => x !== t));
    } else {
      setPropertyType([...propertyType, t]);
    }
  };

  const toggleAmenity = (a: string) => {
    if (amenities.includes(a)) {
      setAmenities(amenities.filter((x) => x !== a));
    } else {
      setAmenities([...amenities, a]);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6 font-sans text-gray-900 dark:text-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
            Filter Real Estate Portfolio
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Refine property matching criteria across leads and active inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPropertyType(['House', 'Villa']);
              setMinPrice(1000000);
              setMaxPrice(8000000);
              setBedrooms('4+');
              setBathrooms('3+');
              setAmenities(['Swimming Pool', 'Ocean View']);
              onToast?.('Filters reset to default');
            }}
            className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#161822] text-xs font-semibold text-gray-700 dark:text-gray-300 transition cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
          <button
            onClick={() => {
              onToast?.('Filtered 23 active properties matching criteria');
              onNavigateTab?.('shadcn-listings');
            }}
            className="px-4 py-2 rounded-xl bg-gray-950 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply (23 Matches)</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#11131c] rounded-2xl p-6 border border-gray-200/90 dark:border-gray-800/80 shadow-2xs space-y-6">
        {/* 1. Property Type */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Property Category
          </label>
          <div className="flex flex-wrap gap-2">
            {['House', 'Villa', 'Penthouse', 'Apartment', 'Estate', 'Commercial'].map((t) => {
              const active = propertyType.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow-xs'
                      : 'bg-gray-50 dark:bg-[#161822] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700/60 hover:border-gray-400'
                  }`}
                >
                  {active && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{t}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Price Range Slider */}
        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Price Range
            </label>
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              ${(minPrice / 1000000).toFixed(1)}M – ${(maxPrice / 1000000).toFixed(1)}M
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-gray-500">Min Price</span>
              <input
                type="range"
                min="500000"
                max="5000000"
                step="250000"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full accent-gray-900 dark:accent-white"
              />
            </div>
            <div>
              <span className="text-[11px] text-gray-500">Max Price</span>
              <input
                type="range"
                min="5000000"
                max="25000000"
                step="500000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gray-900 dark:accent-white"
              />
            </div>
          </div>
        </div>

        {/* 3. Rooms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Bedrooms
            </label>
            <div className="flex gap-2">
              {['Any', '1+', '2+', '3+', '4+', '5+'].map((b) => (
                <button
                  key={b}
                  onClick={() => setBedrooms(b)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    bedrooms === b
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xs'
                      : 'bg-gray-100 dark:bg-[#161822] text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Bathrooms
            </label>
            <div className="flex gap-2">
              {['Any', '1+', '2+', '3+', '4+'].map((b) => (
                <button
                  key={b}
                  onClick={() => setBathrooms(b)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    bathrooms === b
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xs'
                      : 'bg-gray-100 dark:bg-[#161822] text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Amenities Checklist */}
        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Amenities & Features
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              'Swimming Pool',
              'Ocean View',
              'Smart Home',
              'Wine Cellar',
              'Security Gate',
              'EV Fast Charger',
              'Private Gym',
              'Spa & Sauna',
              'Solar System',
            ].map((a) => {
              const checked = amenities.includes(a);
              return (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`p-2.5 rounded-xl border text-xs text-left font-medium transition cursor-pointer flex items-center justify-between ${
                    checked
                      ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200'
                      : 'bg-gray-50 dark:bg-[#161822] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <span>{a}</span>
                  {checked && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
