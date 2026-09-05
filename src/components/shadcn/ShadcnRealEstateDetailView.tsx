import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Heart,
  Sparkles,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  DollarSign,
  Users,
  Building,
  CheckCircle2,
  FileText,
  Phone,
  Mail,
  Send,
  Calculator,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface ShadcnRealEstateDetailViewProps {
  onNavigateTab?: (tab: string) => void;
  onToast?: (msg: string) => void;
}

export const ShadcnRealEstateDetailView: React.FC<ShadcnRealEstateDetailViewProps> = ({
  onNavigateTab,
  onToast,
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const gallery = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 font-sans text-gray-900 dark:text-gray-100">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigateTab?.('shadcn-dashboard')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#161822] border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1d28] transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsSaved(!isSaved);
              onToast?.(isSaved ? 'Removed from favorites' : 'Saved to favorites');
            }}
            className={`p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              isSaved
                ? 'bg-rose-50 dark:bg-rose-950 border-rose-200 text-rose-600'
                : 'bg-white dark:bg-[#161822] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            onClick={() => onToast?.('Property link copied to clipboard')}
            className="p-2 rounded-xl bg-white dark:bg-[#161822] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Title & Price */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
              Active Listing
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 font-semibold text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Recommended to 14 Leads
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950 dark:text-white">
            The Somerset House
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>742 Evergreen Terrace, Beverly Hills, CA 90210</span>
          </p>
        </div>

        <div className="text-left md:text-right">
          <div className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white">
            $4,850,000
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            $1,154 / sqft • Estimated Mortgage $24,200/mo
          </div>
        </div>
      </div>

      {/* Photo Showcase Gallery */}
      <div className="space-y-3">
        <div className="relative h-80 sm:h-[420px] rounded-3xl overflow-hidden shadow-lg border border-gray-200/90 dark:border-gray-800">
          <img
            src={gallery[selectedImageIdx]}
            alt="The Somerset View"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-xl bg-black/70 text-white backdrop-blur-md text-xs font-semibold">
            Photo {selectedImageIdx + 1} of {gallery.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-3">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImageIdx(i)}
              className={`h-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition cursor-pointer ${
                selectedImageIdx === i
                  ? 'border-gray-900 dark:border-white shadow-md'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      </div>

      {/* Key Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#11131c] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
          <Bed className="w-5 h-5 mx-auto text-purple-600 dark:text-purple-400 mb-1" />
          <div className="text-lg font-bold text-gray-950 dark:text-white">4 Bedrooms</div>
          <div className="text-xs text-gray-500">En-suite suites</div>
        </div>
        <div className="bg-white dark:bg-[#11131c] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
          <Bath className="w-5 h-5 mx-auto text-purple-600 dark:text-purple-400 mb-1" />
          <div className="text-lg font-bold text-gray-950 dark:text-white">3.5 Baths</div>
          <div className="text-xs text-gray-500">Custom marble finishes</div>
        </div>
        <div className="bg-white dark:bg-[#11131c] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
          <Maximize className="w-5 h-5 mx-auto text-purple-600 dark:text-purple-400 mb-1" />
          <div className="text-lg font-bold text-gray-950 dark:text-white">4,200 sqft</div>
          <div className="text-xs text-gray-500">Living space</div>
        </div>
        <div className="bg-white dark:bg-[#11131c] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
          <Building className="w-5 h-5 mx-auto text-purple-600 dark:text-purple-400 mb-1" />
          <div className="text-lg font-bold text-gray-950 dark:text-white">2024 Built</div>
          <div className="text-xs text-gray-500">Contemporary architecture</div>
        </div>
      </div>

      {/* Two Column Layout: Description & Broker Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Amenities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#11131c] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">
              About The Somerset
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Designed as a modern sanctuary, The Somerset boasts an open-concept flow framed by floor-to-ceiling glass, custom oak joinery, and an infinity-edge pool. Positioned in prestigious Beverly Hills, this residence offers resort-style outdoor living, dual chef kitchens, and smart home automation throughout.
            </p>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Key Amenities & Features
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-gray-700 dark:text-gray-300">
                {[
                  'Private Heated Pool',
                  'Outdoor Kitchen & BBQ',
                  'Wine Cellar (400 bottles)',
                  'Tesla EV Charger 80A',
                  'Sub-Zero & Wolf Appliances',
                  'Smart Control4 System',
                  'Security Guard Gate Access',
                  'Panoramic Canyon Views',
                  'High-Efficiency Solar Array',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Assigned Broker & Contact Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#11131c] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-5">
            <h3 className="text-base font-bold text-gray-950 dark:text-white">
              Listing Broker
            </h3>

            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Toby Belhome"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500"
              />
              <div>
                <h4 className="text-sm font-bold text-gray-950 dark:text-white">
                  Toby Belhome
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Senior Vice President • Luxury Division
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => onToast?.('Calling Toby Belhome...')}
                className="w-full py-2.5 rounded-xl bg-gray-950 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Schedule Private Viewing</span>
              </button>

              <button
                onClick={() => onToast?.('Inquiry email template opened')}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#1a1d28] dark:hover:bg-[#242838] text-gray-700 dark:text-gray-200 font-semibold transition flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700/60 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Direct Inquiry</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
