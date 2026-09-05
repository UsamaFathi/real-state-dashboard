import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Copy,
  Check,
  Download,
  ExternalLink,
  Share2,
  Smartphone,
  Sparkles,
  Globe,
  Send,
  Mail,
  X,
  Palette,
  Eye,
  Building,
  Bed,
  Maximize,
  FileText,
  Printer,
  ShieldCheck,
  RefreshCw,
  FileDown,
  Loader2,
} from 'lucide-react';
import QRCode from 'qrcode';
import { DealItem } from '../types';
import { downloadDealSummaryPdf } from '../utils/dealPdfExport';

interface DealQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: DealItem | null;
  onToast?: (msg: string) => void;
}

type QRColorTheme = 'slate' | 'gold' | 'emerald' | 'blue';
type LinkDestination = 'listing' | 'brochure' | 'virtual_tour' | 'reservation';

export const DealQRCodeModal: React.FC<DealQRCodeModalProps> = ({
  isOpen,
  onClose,
  deal,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'client_preview'>('qr');
  const [qrTheme, setQrTheme] = useState<QRColorTheme>('gold');
  const [linkDestination, setLinkDestination] = useState<LinkDestination>('listing');
  const [includeUtm, setIncludeUtm] = useState<boolean>(true);
  const [includeCenterLogo, setIncludeCenterLogo] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen || !deal) return null;

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadDealSummaryPdf(deal, onToast);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Clean code identifier
  const cleanCode = deal.code.replace(/[^a-zA-Z0-9_-]/g, '') || deal.id;
  const baseUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://portal.palmdevelopments.com';

  // Compute unique listing URL based on destination & tracking
  const getListingUrl = (): string => {
    let path = `/real-estate/properties/listings/${cleanCode}`;
    if (linkDestination === 'brochure') {
      path = `/showcase/brochure/${cleanCode}`;
    } else if (linkDestination === 'virtual_tour') {
      path = `/virtual-tour/360/${cleanCode}`;
    } else if (linkDestination === 'reservation') {
      path = `/reservations/portal/${cleanCode}`;
    }

    const utm = includeUtm
      ? `?utm_source=qr_deal_card&utm_medium=offline_brochure&utm_campaign=${cleanCode.toLowerCase()}`
      : '';

    return `${baseUrl}${path}${utm}`;
  };

  const currentUrl = getListingUrl();

  // Color mappings
  const themeColors: Record<
    QRColorTheme,
    { dark: string; light: string; name: string; accentBg: string; border: string }
  > = {
    gold: {
      dark: '#b45309',
      light: '#ffffff',
      name: 'Luxury Amber',
      accentBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      border: 'border-amber-500',
    },
    slate: {
      dark: '#0f172a',
      light: '#ffffff',
      name: 'Executive Dark',
      accentBg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30',
      border: 'border-slate-800',
    },
    emerald: {
      dark: '#047857',
      light: '#ffffff',
      name: 'Modern Emerald',
      accentBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      border: 'border-emerald-600',
    },
    blue: {
      dark: '#1d4ed8',
      light: '#ffffff',
      name: 'Sapphire Blue',
      accentBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
      border: 'border-blue-600',
    },
  };

  // Generate QR Code via canvas and data URL
  useEffect(() => {
    let isSubscribed = true;
    setIsGenerating(true);

    const activeColors = themeColors[qrTheme];
    const options: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'H', // High error correction (30% fault tolerance allows center logo)
      margin: 2,
      width: 420,
      color: {
        dark: activeColors.dark,
        light: activeColors.light,
      },
    };

    QRCode.toDataURL(currentUrl, options)
      .then((url) => {
        if (isSubscribed) {
          setQrDataUrl(url);
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err);
        if (isSubscribed) setIsGenerating(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [currentUrl, qrTheme]);

  // Copy unique listing link to clipboard
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = currentUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      if (onToast) onToast(`Unique listing link copied: ${cleanCode}`);
      setTimeout(() => setCopiedLink(false), 2400);
    } catch {
      if (onToast) onToast('Failed to copy link to clipboard');
    }
  };

  // Download QR Code as PNG
  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `property-listing-qr-${cleanCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (onToast) onToast(`Downloaded PNG QR Code for ${deal.code}`);
  };

  // Download QR Code as print-ready SVG
  const handleDownloadSvg = async () => {
    try {
      const activeColors = themeColors[qrTheme];
      const svgString = await QRCode.toString(currentUrl, {
        type: 'svg',
        errorCorrectionLevel: 'H',
        margin: 2,
        color: {
          dark: activeColors.dark,
          light: activeColors.light,
        },
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `property-listing-qr-${cleanCode}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (onToast) onToast(`Downloaded high-res SVG for ${deal.code}`);
    } catch {
      if (onToast) onToast('Failed to generate SVG QR code');
    }
  };

  // Download complete branded flyer card (Property photo + Specs + QR Code)
  const handleDownloadFlyer = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1600);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 1600);

    // Decorative Gold Top Bar
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 0, 1200, 12);

    // Header Branding
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('EXCLUSIVE REAL ESTATE LISTING', 80, 80);

    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(deal.code, 80, 120);

    // Property Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px sans-serif';
    ctx.fillText(deal.title.slice(0, 32), 80, 200);

    // Price
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 44px monospace';
    ctx.fillText(`${deal.price.toLocaleString()} ${deal.currency || 'EGP'}`, 80, 270);

    // Specs pills
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(80, 310, 220, 50);
    ctx.fillRect(320, 310, 260, 50);
    ctx.fillRect(600, 310, 260, 50);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`${deal.bedrooms} Bedrooms`, 110, 344);
    ctx.fillText(`${deal.areaSqm} m² / ${Math.round(deal.areaSqm * 10.764)} sqft`, 340, 344);
    ctx.fillText(deal.propertyType, 640, 344);

    // Draw QR code image in card
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.onload = () => {
      // White container for QR
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(320, 420, 560, 560, 32);
      ctx.fill();

      ctx.drawImage(qrImg, 350, 450, 500, 500);

      // Call to Action
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 38px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN WITH SMARTPHONE CAMERA', 600, 1050);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px sans-serif';
      ctx.fillText('Instant Access to 3D Floorplans, VR Tour & Booking', 600, 1100);

      // Listing Link text
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(currentUrl.slice(0, 60), 600, 1150);

      // Footer divider
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 1220);
      ctx.lineTo(1120, 1220);
      ctx.stroke();

      // Agent Info
      ctx.textAlign = 'left';
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '24px sans-serif';
      ctx.fillText('Listed by Commercial Investment Advisory', 80, 1280);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(deal.assignedAgents[0]?.name || 'Toby Belhome', 80, 1320);

      // Export canvas to image
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `property-flyer-${cleanCode}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (onToast) onToast(`Exported digital flyer for ${deal.code}`);
    };
    qrImg.src = qrDataUrl;
  };

  // Share via WhatsApp
  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `🏛️ *Exclusive Real Estate Listing: ${deal.title}*\n` +
        `🔖 Reference: ${deal.code}\n` +
        `💰 Price: ${deal.price.toLocaleString()} ${deal.currency || 'EGP'}\n` +
        `📐 Specs: ${deal.bedrooms} Beds • ${deal.areaSqm} m² • ${deal.propertyType}\n\n` +
        `📲 Scan or click the unique property link to view interactive floor plans & specs:\n${currentUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
    if (onToast) onToast('Opened WhatsApp Share');
  };

  // Share via Email
  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Exclusive Property Listing: ${deal.title} (${deal.code})`);
    const body = encodeURIComponent(
      `Hello,\n\nPlease find the unique listing link and details for ${deal.title} (${deal.code}):\n\n` +
        `• Property: ${deal.title}\n` +
        `• Reference Code: ${deal.code}\n` +
        `• Valuation / Price: ${deal.price.toLocaleString()} ${deal.currency || 'EGP'}\n` +
        `• Specifications: ${deal.bedrooms} Beds, ${deal.areaSqm} m² (${Math.round(
          deal.areaSqm * 10.764
        )} sqft), ${deal.propertyType}\n\n` +
        `Access the verified listing portal & floorplans directly here:\n${currentUrl}\n\n` +
        `Best regards,\nReal Estate Investment Advisory`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    if (onToast) onToast('Opened Email Composer');
  };

  // Native Web Share
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Property Listing: ${deal.title}`,
          text: `Check out this listing ${deal.code} - ${deal.price.toLocaleString()} ${
            deal.currency || 'EGP'
          }`,
          url: currentUrl,
        });
        if (onToast) onToast('Shared listing successfully');
      } catch (e) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#0c0f17] rounded-3xl border border-slate-200 dark:border-amber-900/40 shadow-2xl max-w-2xl w-full p-6 md:p-7 space-y-6 text-slate-800 dark:text-slate-100 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-[#161a26] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pr-8 border-b border-slate-100 dark:border-amber-950/40 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <QrCode className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Property QR Code Generator
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-[#161a26] text-slate-600 dark:text-amber-200/90 border border-slate-200/60 dark:border-amber-950/50">
                {deal.code}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {deal.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Unique scannable link for buyer brochures, WhatsApp dispatch, and offline marketing
              signage.
            </p>
          </div>
        </div>

        {/* Tab Switcher: QR Code Suite vs Mobile Preview */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/40 pb-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#141824] p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-white dark:bg-amber-500/20 text-slate-900 dark:text-amber-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-amber-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code Generator</span>
            </button>
            <button
              onClick={() => setActiveTab('client_preview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'client_preview'
                  ? 'bg-white dark:bg-amber-500/20 text-slate-900 dark:text-amber-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-amber-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Client Mobile Preview</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
            <span>
              {deal.price.toLocaleString()} {deal.currency || 'EGP'}
            </span>
          </div>
        </div>

        {/* TAB 1: QR CODE GENERATOR & SHARING */}
        {activeTab === 'qr' && (
          <div className="space-y-6">
            {/* Top Grid: Left QR Display + Right Controls & Options */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: QR Code Display Card */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="relative p-5 rounded-2xl bg-white dark:bg-[#06080e] border-2 border-slate-200 dark:border-amber-950/60 shadow-lg group hover:border-amber-500/50 transition">
                  {/* Decorative Corner Guides */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-500/80 rounded-tl-xs" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-500/80 rounded-tr-xs" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-500/80 rounded-bl-xs" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-500/80 rounded-br-xs" />

                  {/* QR Image */}
                  <div className="w-52 h-52 relative flex items-center justify-center bg-white rounded-xl p-2 shadow-inner">
                    {isGenerating ? (
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                        <span className="text-[10px] font-mono">Generating QR...</span>
                      </div>
                    ) : (
                      <>
                        <img
                          src={qrDataUrl}
                          alt={`QR Code for ${deal.code}`}
                          className="w-full h-full object-contain"
                        />

                        {/* Center Monogram / Brand Badge */}
                        {includeCenterLogo && (
                          <div className="absolute inset-0 m-auto w-10 h-10 rounded-lg bg-white dark:bg-[#0f121a] shadow-md border-2 border-amber-500/80 flex items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black tracking-tighter text-slate-900 dark:text-amber-400 font-mono">
                              DXB
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* QR Card Footer Label */}
                  <div className="mt-3 text-center">
                    <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-amber-300 block">
                      {deal.code}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      Scan with iPhone / Android camera
                    </span>
                  </div>
                </div>

                {/* Quick Style Switcher */}
                <div className="flex items-center gap-1.5 mt-3">
                  {(Object.keys(themeColors) as QRColorTheme[]).map((themeKey) => (
                    <button
                      key={themeKey}
                      onClick={() => setQrTheme(themeKey)}
                      title={themeColors[themeKey].name}
                      className={`w-6 h-6 rounded-full border-2 transition cursor-pointer flex items-center justify-center ${
                        themeColors[themeKey].border
                      } ${
                        qrTheme === themeKey
                          ? 'ring-2 ring-offset-2 ring-amber-500 scale-110'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: themeColors[themeKey].dark }}
                    >
                      {qrTheme === themeKey && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                  <button
                    onClick={() => setIncludeCenterLogo(!includeCenterLogo)}
                    title="Toggle Center Logo"
                    className={`ml-2 px-2 py-0.5 rounded text-[10px] font-semibold border transition cursor-pointer ${
                      includeCenterLogo
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Logo
                  </button>
                </div>
              </div>

              {/* Right Column: Destination Link & Quick Sharing */}
              <div className="md:col-span-7 space-y-4">
                {/* Destination Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Listing Experience
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLinkDestination('listing')}
                      className={`p-2 rounded-xl text-left border text-xs transition cursor-pointer ${
                        linkDestination === 'listing'
                          ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-500/60 text-slate-900 dark:text-amber-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#141824] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-amber-500" />
                        <span>Property Portal</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Interactive specs & 2D plans
                      </span>
                    </button>

                    <button
                      onClick={() => setLinkDestination('brochure')}
                      className={`p-2 rounded-xl text-left border text-xs transition cursor-pointer ${
                        linkDestination === 'brochure'
                          ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-500/60 text-slate-900 dark:text-amber-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#141824] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <span>Digital Brochure</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        High-res visual PDF format
                      </span>
                    </button>

                    <button
                      onClick={() => setLinkDestination('virtual_tour')}
                      className={`p-2 rounded-xl text-left border text-xs transition cursor-pointer ${
                        linkDestination === 'virtual_tour'
                          ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-500/60 text-slate-900 dark:text-amber-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#141824] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                        <span>360° VR Tour</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Immersive 3D walkthrough
                      </span>
                    </button>

                    <button
                      onClick={() => setLinkDestination('reservation')}
                      className={`p-2 rounded-xl text-left border text-xs transition cursor-pointer ${
                        linkDestination === 'reservation'
                          ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-500/60 text-slate-900 dark:text-amber-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#141824] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                        <span>Reservation Gate</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Direct deposit hold lock
                      </span>
                    </button>
                  </div>
                </div>

                {/* Unique Link Input Box with 1-Click Copy */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Unique Shareable Listing Link
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeUtm}
                        onChange={(e) => setIncludeUtm(e.target.checked)}
                        className="rounded accent-amber-500 w-3 h-3"
                      />
                      <span>UTM Tracking</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 dark:bg-[#07090e] rounded-xl border border-slate-200 dark:border-amber-950/60 font-mono text-xs">
                    <div className="flex-1 truncate px-2 text-slate-600 dark:text-amber-300/90 text-[11px]">
                      {currentUrl}
                    </div>

                    <button
                      onClick={handleCopyLink}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        copiedLink
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 hover:bg-amber-600 text-slate-950 dark:text-slate-900 shadow-xs'
                      }`}
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={currentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-amber-300 hover:bg-slate-200 dark:hover:bg-[#161a26] transition"
                      title="Open Listing in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Direct Share Options: WhatsApp / Email / Native */}
                <div>
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Direct Client Dispatch
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleShareWhatsApp}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={handleShareEmail}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Client</span>
                    </button>

                    <button
                      onClick={handleNativeShare}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#161a26] dark:hover:bg-[#1e2436] text-slate-700 dark:text-amber-200 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-200 dark:border-amber-950/60"
                      title="Device Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Export Bar: PNG / SVG / Full Branded Flyer Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-amber-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Export & Marketing Assets
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ready-to-use vector SVG for site signage or high-res PNG flyer cards.
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
                >
                  {isGeneratingPdf ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5" />
                  )}
                  <span>PDF Summary</span>
                </button>

                <button
                  onClick={handleDownloadPng}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-[#141824] hover:bg-slate-100 dark:hover:bg-[#1e2436] text-slate-700 dark:text-amber-200 border border-slate-200 dark:border-amber-950/60 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>

                <button
                  onClick={handleDownloadSvg}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-[#141824] hover:bg-slate-100 dark:hover:bg-[#1e2436] text-slate-700 dark:text-amber-200 border border-slate-200 dark:border-amber-950/60 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Vector SVG</span>
                </button>

                <button
                  onClick={handleDownloadFlyer}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Flyer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLIENT MOBILE PREVIEW (SIMULATED PHONE) */}
        {activeTab === 'client_preview' && (
          <div className="flex flex-col items-center justify-center py-2 space-y-4">
            <p className="text-xs text-slate-500 text-center max-w-md">
              Live simulation of what prospective investors see instantly upon scanning the deal card QR code:
            </p>

            {/* Simulated Smartphone Shell */}
            <div className="w-[310px] h-[520px] rounded-[36px] bg-slate-950 border-[6px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative text-slate-100">
              {/* Phone Speaker & Camera Notch */}
              <div className="absolute top-2 inset-x-0 mx-auto w-24 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
                <div className="w-10 h-1 rounded-full bg-slate-800" />
              </div>

              {/* Mobile Browser Address Bar */}
              <div className="pt-7 px-3 pb-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[9px] font-mono text-slate-400">
                <div className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span className="truncate max-w-[190px]">portal.palmdevelopments.com</span>
                </div>
                <span className="text-[8px] bg-slate-800 px-1 py-0.5 rounded text-amber-300">
                  {deal.code}
                </span>
              </div>

              {/* Mobile Content Scroll Area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-950 text-xs">
                {/* Hero Photo with Floorplan Toggle */}
                <div className="relative rounded-xl overflow-hidden h-36 border border-slate-800">
                  <img
                    src={deal.photoUrl}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-bold text-amber-300 backdrop-blur-xs">
                    {deal.propertyType}
                  </div>
                </div>

                {/* Title & Valuation */}
                <div>
                  <h4 className="font-bold text-slate-100 text-xs leading-snug">{deal.title}</h4>
                  <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                    {deal.price.toLocaleString()} {deal.currency || 'EGP'}
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                  <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[8px]">Bedrooms</span>
                    <span className="font-bold text-slate-200">{deal.bedrooms} Beds</span>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[8px]">Total Area</span>
                    <span className="font-bold text-slate-200">{deal.areaSqm} m²</span>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[8px]">Stage</span>
                    <span className="font-bold text-emerald-400">Available</span>
                  </div>
                </div>

                {/* Floor Plan Snapshot */}
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                    Verified Architectural Blueprint
                  </div>
                  <img
                    src={deal.floorPlanUrl}
                    alt="Floorplan"
                    className="h-20 w-full object-contain filter invert opacity-80"
                  />
                </div>

                {/* Instant Action CTA */}
                <button
                  onClick={() => {
                    if (onToast) onToast('Client Inquiry simulation recorded!');
                  }}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-[11px] transition cursor-pointer shadow-xs"
                >
                  Schedule Private Viewing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
