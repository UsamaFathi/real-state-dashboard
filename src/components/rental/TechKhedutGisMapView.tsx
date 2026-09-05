import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Layers,
  Search,
  Building,
  TrendingUp,
  DollarSign,
  PieChart as PieChartIcon,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Navigation,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface TechKhedutGisMapViewProps {
  onToast: (msg: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const TechKhedutGisMapView: React.FC<TechKhedutGisMapViewProps> = ({
  onToast,
  onNavigateTab,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<string>('Skyline A-101');
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite' | 'dark'>('street');
  const [zoomLevel, setZoomLevel] = useState<number>(14);

  // Regional Distribution Bar Chart Data
  const regionalData = [
    { name: 'West Zone', properties: 18, value: 34.2 },
    { name: 'East Zone', properties: 12, value: 18.5 },
    { name: 'North Zone', properties: 8, value: 12.0 },
    { name: 'South Zone', properties: 6, value: 10.07 },
  ];

  // City Distribution Donut Data
  const cityData = [
    { name: 'Ahmedabad', value: 45, color: '#f59e0b' },
    { name: 'Dubai', value: 30, color: '#2563eb' },
    { name: 'Mumbai', value: 15, color: '#10b981' },
    { name: 'London', value: 10, color: '#8b5cf6' },
  ];

  const mapPins = [
    {
      id: 'pin-1',
      name: 'Skyline A-101',
      price: '$ 22.0k',
      type: 'Residential · 3 BHK',
      location: 'SG Highway, Bodakdev, Ahmedabad',
      status: 'Occupied',
      x: '48%',
      y: '42%',
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'pin-2',
      name: 'Skyline B-402',
      price: '$ 250/mo',
      type: 'Residential · 2 BHK',
      location: 'SG Highway, Bodakdev, Ahmedabad',
      status: 'Occupied',
      x: '56%',
      y: '36%',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'pin-3',
      name: 'Metro Retail Shop G-03',
      price: '$ 345/mo',
      type: 'Commercial Retail',
      location: 'Drive-In Road, Memnagar',
      status: 'Reserved',
      x: '38%',
      y: '60%',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'pin-4',
      name: 'Horizon Heights Penthouse',
      price: '$ 48.0k',
      type: 'Luxury Suite',
      location: 'Sindhu Bhavan Road',
      status: 'Available',
      x: '64%',
      y: '55%',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=300&q=80',
    },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-slate-800 dark:text-slate-200">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            GIS GEOSPATIAL INTELLIGENCE
          </div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Interactive Property GIS & Real-time Portfolio Analytics
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-amber-950/40 bg-slate-50 dark:bg-[#151926] p-0.5 text-xs">
            <button
              onClick={() => setMapLayer('street')}
              className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                mapLayer === 'street'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-amber-300 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Roadmap
            </button>
            <button
              onClick={() => setMapLayer('satellite')}
              className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                mapLayer === 'satellite'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-amber-300 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: Left 8 Cols Map View + Right 4 Cols Metrics & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 8 Cols: Interactive Map Canvas */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 overflow-hidden shadow-xs relative min-h-[460px] flex flex-col">
          {/* Map Controls */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-white/90 dark:bg-[#0c0e17]/90 backdrop-blur-xs p-1 rounded-xl border border-slate-200 dark:border-amber-950/50 shadow-md">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToast('Recenter map to portfolio core cluster...')}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              title="Locate center"
            >
              <Navigation className="w-4 h-4 text-amber-500" />
            </button>
          </div>

          {/* Interactive Styled Map View Background Canvas */}
          <div className="relative flex-1 bg-[#e5e7eb] dark:bg-[#0f1422] overflow-hidden min-h-[380px]">
            {/* Grid Lines Pattern */}
            <div
              className="absolute inset-0 opacity-20 dark:opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Vector Roads and Geography */}
            <svg className="absolute inset-0 w-full h-full stroke-slate-300 dark:stroke-slate-800/80 fill-none" strokeWidth="3">
              <path d="M-50,150 Q300,180 800,120" />
              <path d="M200,-50 Q240,300 350,600" />
              <path d="M-20,400 Q400,320 850,450" />
              <path d="M600,-20 Q550,250 680,600" />
            </svg>

            {/* Interactive Property Map Pins */}
            {mapPins.map((pin) => {
              const isSelected = selectedProperty === pin.name;

              return (
                <div
                  key={pin.id}
                  style={{ left: pin.x, top: pin.y }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => {
                      setSelectedProperty(pin.name);
                      onToast(`Selected property: ${pin.name} (${pin.price})`);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg transition transform hover:scale-110 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30'
                        : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-amber-950'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{pin.price}</span>
                  </button>

                  {/* Popover Preview for Selected Property (matching screenshot Skyline A-101 $22.0k) */}
                  {isSelected && (
                    <div className="absolute left-1/2 top-full mt-2 transform -translate-x-1/2 w-60 bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200 dark:border-amber-950/60 shadow-xl p-3 z-30 animate-in fade-in zoom-in-95 space-y-2">
                      <div className="relative rounded-lg overflow-hidden h-24">
                        <img
                          src={pin.image}
                          alt={pin.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-emerald-500 text-white rounded text-[9px] font-bold">
                          {pin.status}
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">
                          {pin.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {pin.location}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-amber-950/30">
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-300">
                          {pin.price}
                        </span>
                        <button
                          onClick={() => {
                            if (onNavigateTab) onNavigateTab('contract-portal');
                            onToast(`Opened contract for ${pin.name}`);
                          }}
                          className="px-2 py-0.5 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 rounded text-[10px] font-bold"
                        >
                          View Lease →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Map Footer Bar */}
          <div className="p-3 bg-white dark:bg-[#0c0e17] border-t border-slate-200/80 dark:border-amber-950/40 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div>
              Active Viewport: <strong className="text-slate-800 dark:text-slate-200">Ahmedabad Metropolitan & Suburbs</strong>
            </div>
            <div className="flex items-center gap-3">
              <span>● 44 Portfolio Units</span>
              <span>● 98.4% Occupancy</span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Portfolio Metrics & Distribution Charts */}
        <div className="lg:col-span-4 space-y-4">
          {/* 3 Top KPIs matching screenshot ($74.77 Million, 4 mo, $319.2K) */}
          <div className="bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 p-4 shadow-xs space-y-3">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400">
                Portfolio Gross Value
              </div>
              <div className="text-xl font-extrabold text-amber-950 dark:text-amber-200 font-mono">
                $ 74.77 Million
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#151926] border border-slate-100 dark:border-amber-950/30">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  Avg Lease Cycle
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  4 mo
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#151926] border border-slate-100 dark:border-amber-950/30">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  Revenue Collected
                </div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                  $ 319.2K
                </div>
              </div>
            </div>
          </div>

          {/* Regional Distribution Horizontal Bar Chart */}
          <div className="bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 p-4 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Regional Distribution
            </h4>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={70} />
                  <Tooltip
                    formatter={(value: any) => [`$${value}M Value`, 'Valuation']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', fontSize: '11px', border: 'none', color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="#d97706" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* City Distribution Donut Chart */}
          <div className="bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200/80 dark:border-amber-950/40 p-4 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              City Distribution
            </h4>
            <div className="h-32 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {cityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val}% of Portfolio`, name]}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', fontSize: '11px', border: 'none', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
              {cityData.map((c) => (
                <div key={c.name} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name} ({c.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
