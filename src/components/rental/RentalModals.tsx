import React, { useState } from 'react';
import {
  X,
  Plus,
  CheckCircle2,
  Calendar,
  Building,
  DollarSign,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Wrench,
  Sparkles,
  Download,
  Send,
  FileCheck2,
  Receipt,
} from 'lucide-react';
import {
  RentalUnit,
  TenancyContract,
  RentInvoice,
  MaintenanceWorkOrder,
  SiteBooking,
  PropertyCategory,
  PaymentFrequency,
  MaintenanceUrgency,
  MaintenanceCategory,
} from '../../types/rentalTypes';

interface ModalsProps {
  // New Contract
  isNewContractOpen: boolean;
  onCloseNewContract: () => void;
  units: RentalUnit[];
  preselectedUnit?: RentalUnit | null;
  onSubmitNewContract: (data: any) => void;

  // New Unit
  isNewUnitOpen: boolean;
  onCloseNewUnit: () => void;
  onSubmitNewUnit: (data: any) => void;

  // New Maintenance
  isNewMaintenanceOpen: boolean;
  onCloseNewMaintenance: () => void;
  onSubmitNewMaintenance: (data: any) => void;

  // Record Payment
  isRecordPaymentOpen: boolean;
  onCloseRecordPayment: () => void;
  invoices: RentInvoice[];
  onSubmitRecordPayment: (data: any) => void;

  // Schedule Visit
  isScheduleVisitOpen: boolean;
  onCloseScheduleVisit: () => void;
  onSubmitScheduleVisit: (data: any) => void;

  // Detail Drawers
  selectedContract: TenancyContract | null;
  onCloseContractDrawer: () => void;

  selectedUnit: RentalUnit | null;
  onCloseUnitDrawer: () => void;

  selectedWorkOrder: MaintenanceWorkOrder | null;
  onCloseWorkOrderDrawer: () => void;

  onToast: (msg: string) => void;
}

export const RentalModals: React.FC<ModalsProps> = ({
  isNewContractOpen,
  onCloseNewContract,
  units,
  preselectedUnit,
  onSubmitNewContract,
  isNewUnitOpen,
  onCloseNewUnit,
  onSubmitNewUnit,
  isNewMaintenanceOpen,
  onCloseNewMaintenance,
  onSubmitNewMaintenance,
  isRecordPaymentOpen,
  onCloseRecordPayment,
  invoices,
  onSubmitRecordPayment,
  isScheduleVisitOpen,
  onCloseScheduleVisit,
  onSubmitScheduleVisit,
  selectedContract,
  onCloseContractDrawer,
  selectedUnit,
  onCloseUnitDrawer,
  selectedWorkOrder,
  onCloseWorkOrderDrawer,
  onToast,
}) => {
  // Local states for New Contract Form
  const [contractUnitId, setContractUnitId] = useState(preselectedUnit ? preselectedUnit.id : units[0]?.id || '');
  const [tenantName, setTenantName] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantPhone, setTenantPhone] = useState('+971 50 ');
  const [rentAmount, setRentAmount] = useState(preselectedUnit ? preselectedUnit.monthlyRent : 25000);
  const [frequency, setFrequency] = useState<PaymentFrequency>('Quarterly');
  const [deposit, setDeposit] = useState(25000);
  const [startDate, setStartDate] = useState('01 Oct 2026');
  const [durationMonths, setDurationMonths] = useState(12);

  // Local states for New Unit Form
  const [unitCode, setUnitCode] = useState('DXB-DOWNTOWN-');
  const [unitName, setUnitName] = useState('');
  const [unitCategory, setUnitCategory] = useState<PropertyCategory>('Apartment');
  const [district, setDistrict] = useState('Downtown Dubai');
  const [beds, setBeds] = useState(2);
  const [baths, setBaths] = useState(2);
  const [areaSqft, setAreaSqft] = useState(1500);
  const [monthlyRent, setMonthlyRent] = useState(18000);
  const [ownerName, setOwnerName] = useState('Sheikh Mansoor Al-Qasimi');

  // Local states for Maintenance Form
  const [mUnitCode, setMUnitCode] = useState(units[0]?.code || 'DXB-PALM-402');
  const [mCategory, setMCategory] = useState<MaintenanceCategory>('HVAC / AC');
  const [mUrgency, setMUrgency] = useState<MaintenanceUrgency>('High');
  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');

  // Local states for Payment Form
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(invoices[0]?.id || '');
  const [payMethod, setPayMethod] = useState('Bank Transfer');
  const [txnRef, setTxnRef] = useState('TXN-' + Math.floor(100000 + Math.random() * 900000));

  // Local states for Site Tour Form
  const [visitUnitCode, setVisitUnitCode] = useState(units[0]?.code || '');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+971 50 ');
  const [clientEmail, setClientEmail] = useState('');
  const [visitDate, setVisitDate] = useState('03 Sep 2026');
  const [visitTime, setVisitTime] = useState('16:00 PM');

  return (
    <>
      {/* 1. NEW TENANCY CONTRACT MODAL */}
      {isNewContractOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0e15] border border-slate-200 dark:border-amber-950/60 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-amber-100">
                    Draft New Tenancy Contract
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Odoo 19.0 Ejari & Lease Lifecycle Generator
                  </p>
                </div>
              </div>
              <button
                onClick={onCloseNewContract}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const selUnit = units.find((u) => u.id === contractUnitId) || units[0];
                onSubmitNewContract({
                  unitId: selUnit.id,
                  unitCode: selUnit.code,
                  propertyName: selUnit.name,
                  propertyCategory: selUnit.category,
                  tenantName: tenantName || 'Dr. Alistair Ross',
                  tenantEmail: tenantEmail || 'a.ross@medtech.com',
                  tenantPhone: tenantPhone || '+971 50 192 8841',
                  landlordName: selUnit.ownerName,
                  monthlyRent: Number(rentAmount),
                  annualRent: Number(rentAmount) * 12,
                  paymentFrequency: frequency,
                  securityDeposit: Number(deposit),
                  startDate,
                  durationMonths: Number(durationMonths),
                });
                onCloseNewContract();
              }}
              className="space-y-3.5 text-xs"
            >
              {/* Select Unit */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Available Property Unit
                </label>
                <select
                  value={contractUnitId}
                  onChange={(e) => {
                    setContractUnitId(e.target.value);
                    const u = units.find((un) => un.id === e.target.value);
                    if (u) {
                      setRentAmount(u.monthlyRent);
                      setDeposit(u.securityDeposit);
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.code} — {u.name} (AED {u.monthlyRent.toLocaleString()}/mo • {u.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tenant Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tenant Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="e.g. Dr. Alistair Ross"
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tenant Phone (UAE Mobile)
                  </label>
                  <input
                    type="text"
                    required
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tenant Email (for Ejari / Invoices)
                </label>
                <input
                  type="email"
                  required
                  value={tenantEmail}
                  onChange={(e) => setTenantEmail(e.target.value)}
                  placeholder="tenant@domain.com"
                  className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                />
              </div>

              {/* Financial Terms */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Rent (AED)
                  </label>
                  <input
                    type="number"
                    value={rentAmount}
                    onChange={(e) => setRentAmount(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Cycle
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as PaymentFrequency)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                  >
                    <option value="Monthly">Monthly (12 Cheques)</option>
                    <option value="Quarterly">Quarterly (4 Cheques)</option>
                    <option value="Bi-Annual">Bi-Annual (2 Cheques)</option>
                    <option value="Annual">Annual (1 Cheque)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deposit (AED)
                  </label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-amber-950/40 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onCloseNewContract}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Create & Dispatch Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ADD PROPERTY / UNIT MODAL */}
      {isNewUnitOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0e15] border border-slate-200 dark:border-amber-950/60 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/40 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-amber-100">
                Add New Property Unit
              </h3>
              <button onClick={onCloseNewUnit} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmitNewUnit({
                  code: unitCode,
                  name: unitName || `${district} Luxury ${unitCategory}`,
                  category: unitCategory,
                  district,
                  beds: Number(beds),
                  baths: Number(baths),
                  areaSqft: Number(areaSqft),
                  monthlyRent: Number(monthlyRent),
                  annualRent: Number(monthlyRent) * 12,
                  securityDeposit: Math.round(Number(monthlyRent) * 1.1),
                  ownerName,
                  ownerEmail: 'owner@dubaiholdings.ae',
                  ownerPhone: '+971 50 882 1990',
                  status: 'Available',
                  imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
                  floorPlanUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&q=80',
                  amenities: ['Pool', 'Gym', 'Covered Parking', 'Concierge'],
                  features: ['Panoramic View', 'Marble Floors', 'Smart Thermostat'],
                  floor: 7,
                  furnishingStatus: 'Furnished',
                  maintenanceCount: 0,
                });
                onCloseNewUnit();
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit Identifier Code
                  </label>
                  <input
                    type="text"
                    required
                    value={unitCode}
                    onChange={(e) => setUnitCode(e.target.value)}
                    placeholder="e.g. DXB-DOWNTOWN-101"
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={unitCategory}
                    onChange={(e) => setUnitCategory(e.target.value as PropertyCategory)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Villa">Villa</option>
                    <option value="Office">Commercial Office</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unit Name / Marketing Title
                </label>
                <input
                  type="text"
                  required
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  placeholder="e.g. Burj Crown Skyline 2BR Suite"
                  className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Beds</label>
                  <input
                    type="number"
                    value={beds}
                    onChange={(e) => setBeds(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Baths</label>
                  <input
                    type="number"
                    value={baths}
                    onChange={(e) => setBaths(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Area (sqft)</label>
                  <input
                    type="number"
                    value={areaSqft}
                    onChange={(e) => setAreaSqft(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Rent (AED)
                  </label>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Landlord / Owner
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-amber-950/40 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onCloseNewUnit}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Unit to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. LOG MAINTENANCE WORK ORDER MODAL */}
      {isNewMaintenanceOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0e15] border border-slate-200 dark:border-amber-950/60 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/40 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-amber-100">
                Log Maintenance Work Order
              </h3>
              <button onClick={onCloseNewMaintenance} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmitNewMaintenance({
                  unitCode: mUnitCode,
                  category: mCategory,
                  urgency: mUrgency,
                  title: mTitle || `${mCategory} repair at ${mUnitCode}`,
                  description: mDesc || 'Reported maintenance requirement for immediate inspection.',
                  status: 'New',
                  assignedTechnician: {
                    name: 'Farhan Zaidi',
                    phone: '+971 55 210 4492',
                    company: 'Daikin Certified MEP Services',
                  },
                  estimatedCost: 850,
                  actualCost: 0,
                  reportedDate: 'Today',
                  scheduledDate: 'Tomorrow, 10:00 AM',
                  photos: [],
                });
                onCloseNewMaintenance();
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Unit
                  </label>
                  <select
                    value={mUnitCode}
                    onChange={(e) => setMUnitCode(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100 font-mono"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.code}>
                        {u.code} ({u.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Urgency
                  </label>
                  <select
                    value={mUrgency}
                    onChange={(e) => setMUrgency(e.target.value as MaintenanceUrgency)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                  >
                    <option value="Emergency">Emergency (Immediate)</option>
                    <option value="High">High (&lt; 12 Hours)</option>
                    <option value="Normal">Normal (&lt; 48 Hours)</option>
                    <option value="Low">Low (Scheduled Routine)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={mCategory}
                  onChange={(e) => setMCategory(e.target.value as MaintenanceCategory)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                >
                  <option value="HVAC / AC">HVAC / Air Conditioning</option>
                  <option value="Plumbing">Plumbing & Water Flow</option>
                  <option value="Electrical">Electrical & Lighting</option>
                  <option value="Appliance">Kitchen & Laundry Appliances</option>
                  <option value="Smart Home">Smart Home / Crestron / Automation</option>
                  <option value="Painting">Painting & Carpentry</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Issue Title
                </label>
                <input
                  type="text"
                  required
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  placeholder="e.g. AC Thermostat Error 404 in Living Room"
                  className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Tenant Notes
                </label>
                <textarea
                  rows={3}
                  value={mDesc}
                  onChange={(e) => setMDesc(e.target.value)}
                  placeholder="Detail symptoms, access instructions..."
                  className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-amber-950/40 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onCloseNewMaintenance}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. RECORD RENT PAYMENT MODAL */}
      {isRecordPaymentOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0e15] border border-slate-200 dark:border-amber-950/60 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/40 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-amber-100">
                Record Rent Payment
              </h3>
              <button onClick={onCloseRecordPayment} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmitRecordPayment({
                  invoiceId: selectedInvoiceId,
                  paymentMethod: payMethod,
                  transactionRef: txnRef,
                });
                onCloseRecordPayment();
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Invoice to Settle
                </label>
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => setSelectedInvoiceId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100 font-mono"
                >
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} — {inv.unitCode} ({inv.tenantName}) — AED {inv.totalDue.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                >
                  <option value="Bank Transfer">Bank Wire Transfer</option>
                  <option value="Cheque">PDC Bank Cheque</option>
                  <option value="Credit Card">Credit Card (Stripe Gateway)</option>
                  <option value="Direct Debit">UAE Central Bank Direct Debit</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Transaction / Cheque Reference #
                </label>
                <input
                  type="text"
                  required
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-amber-950/40 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onCloseRecordPayment}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Confirm & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. SCHEDULE SITE TOUR MODAL */}
      {isScheduleVisitOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0e15] border border-slate-200 dark:border-amber-950/60 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/40 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-amber-100">
                Book Prospective Site Tour
              </h3>
              <button onClick={onCloseScheduleVisit} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmitScheduleVisit({
                  unitCode: visitUnitCode,
                  clientName,
                  clientPhone,
                  clientEmail,
                  visitDate,
                  visitTime,
                  assignedAgent: { name: 'Keyvan Akath', initials: 'K', avatarBg: 'bg-blue-100 text-blue-800' },
                  status: 'Scheduled',
                  notes: 'Client registered through web portal.',
                  interestedInLease: true,
                });
                onCloseScheduleVisit();
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Unit
                </label>
                <select
                  value={visitUnitCode}
                  onChange={(e) => setVisitUnitCode(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100 font-mono"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.code}>
                      {u.code} ({u.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Amira Al-Fayed"
                  className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="text"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Time</label>
                  <input
                    type="text"
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#121520] border border-slate-200 dark:border-amber-950/60 rounded-xl text-slate-900 dark:text-amber-100"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-amber-950/40 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onCloseScheduleVisit}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Confirm Site Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. CONTRACT DETAILS DRAWER (Odoo Contract Inspection) */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white dark:bg-[#0c0e15] border-l border-slate-200 dark:border-amber-950/60 h-full p-6 overflow-y-auto space-y-5 animate-in slide-in-from-right duration-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-amber-950/40 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300">
                  {selectedContract.contractNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-amber-100">
                  {selectedContract.propertyName}
                </h3>
              </div>
              <button
                onClick={onCloseContractDrawer}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-amber-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tenant Card */}
            <div className="p-4 bg-slate-50 dark:bg-[#121520] rounded-2xl border border-slate-100 dark:border-amber-950/40 flex items-center gap-3">
              <img
                src={selectedContract.tenantAvatar}
                alt={selectedContract.tenantName}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/30"
              />
              <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {selectedContract.tenantName}
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400">{selectedContract.tenantEmail}</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{selectedContract.tenantPhone}</div>
              </div>
            </div>

            {/* Rent & Financials */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-[#121520] rounded-xl border border-slate-100 dark:border-amber-950/40">
                <div className="text-slate-400 text-[10px]">Monthly Rent</div>
                <div className="font-mono font-bold text-slate-900 dark:text-amber-200 mt-1">
                  AED {selectedContract.monthlyRent.toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#121520] rounded-xl border border-slate-100 dark:border-amber-950/40">
                <div className="text-slate-400 text-[10px]">Security Deposit</div>
                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  AED {selectedContract.securityDeposit.toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#121520] rounded-xl border border-slate-100 dark:border-amber-950/40">
                <div className="text-slate-400 text-[10px]">Escalation</div>
                <div className="font-mono font-bold text-blue-600 dark:text-blue-400 mt-1">
                  +{selectedContract.escalationPercent}% / yr
                </div>
              </div>
            </div>

            {/* Installment Schedule */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-amber-100 uppercase tracking-wider">
                Installment Payment Ledger ({selectedContract.paymentSchedule.length} Installments)
              </h4>
              <div className="space-y-2">
                {selectedContract.paymentSchedule.map((inst) => (
                  <div
                    key={inst.id}
                    className="p-3 bg-slate-50 dark:bg-[#121520] rounded-xl border border-slate-100 dark:border-amber-950/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        Installment #{inst.installmentNo} • Due {inst.dueDate}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Invoice ID: {inst.invoiceId} {inst.paidDate ? `• Paid on ${inst.paidDate}` : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900 dark:text-amber-200">
                        AED {inst.amount.toLocaleString()}
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          inst.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {inst.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-amber-950/40 flex items-center gap-2">
              <button
                onClick={() => onToast(`Ejari Tenancy Certificate downloaded for ${selectedContract.contractNumber}`)}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-amber-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" />
                <span>Ejari PDF Contract</span>
              </button>
              <button
                onClick={() => onToast(`Drafted Renewal Agreement for ${selectedContract.tenantName}`)}
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Renew Contract (+5%)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
