import React, { useState } from 'react';
import {
  RentalTab,
  RentalViewMode,
  RentalUnit,
  TenancyContract,
  RentInvoice,
  MaintenanceWorkOrder,
  SiteBooking,
  LandlordOwner,
  RentalKPIs,
  MaintenanceStatus,
  ReminderTask,
  ReminderTriggerSettings,
} from '../../types/rentalTypes';
import {
  initialRentalUnits,
  initialTenancyContracts,
  initialRentInvoices,
  initialMaintenanceWorkOrders,
  initialSiteBookings,
  initialLandlords,
  defaultRentalKPIs,
  initialReminderTasks,
  defaultReminderTriggerSettings,
} from '../../data/rentalData';
import { RentalHeaderRibbon } from '../rental/RentalHeaderRibbon';
import { RentalKpiCards } from '../rental/RentalKpiCards';
import { RentalOverviewTab } from '../rental/RentalOverviewTab';
import { RentalPropertiesTab } from '../rental/RentalPropertiesTab';
import { RentalContractsTab } from '../rental/RentalContractsTab';
import { RentalInvoicesTab } from '../rental/RentalInvoicesTab';
import { RentalMaintenanceTab } from '../rental/RentalMaintenanceTab';
import { RentalBookingsTab } from '../rental/RentalBookingsTab';
import { RentalLandlordsTab } from '../rental/RentalLandlordsTab';
import { RentalRemindersTab } from '../rental/RentalRemindersTab';
import { RentalModals } from '../rental/RentalModals';
import { TechKhedutShowcasePoster } from '../showcase/TechKhedutShowcasePoster';
import { TechKhedutContractPortalView } from '../rental/TechKhedutContractPortalView';
import { TechKhedutKanbanContractsView } from '../rental/TechKhedutKanbanContractsView';
import { TechKhedutESignView } from '../rental/TechKhedutESignView';
import { TechKhedutGisMapView } from '../rental/TechKhedutGisMapView';

interface RentalManagementDashboardViewProps {
  initialTab?: RentalTab;
  onToast?: (msg: string) => void;
}

export const RentalManagementDashboardView: React.FC<RentalManagementDashboardViewProps> = ({
  initialTab,
  onToast: parentToast,
}) => {
  // Navigation & View States
  const [activeRentalTab, setActiveRentalTab] = useState<RentalTab>(initialTab || 'overview');
  const [viewMode, setViewMode] = useState<RentalViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Core Data Collections
  const [units, setUnits] = useState<RentalUnit[]>(initialRentalUnits);
  const [contracts, setContracts] = useState<TenancyContract[]>(initialTenancyContracts);
  const [invoices, setInvoices] = useState<RentInvoice[]>(initialRentInvoices);
  const [workOrders, setWorkOrders] = useState<MaintenanceWorkOrder[]>(initialMaintenanceWorkOrders);
  const [bookings, setBookings] = useState<SiteBooking[]>(initialSiteBookings);
  const [landlords, setLandlords] = useState<LandlordOwner[]>(initialLandlords);
  const [kpis, setKpis] = useState<RentalKPIs>(defaultRentalKPIs);
  const [reminders, setReminders] = useState<ReminderTask[]>(initialReminderTasks);
  const [triggerSettings, setTriggerSettings] = useState<ReminderTriggerSettings>(
    defaultReminderTriggerSettings
  );

  // Modal Open States
  const [isNewContractOpen, setIsNewContractOpen] = useState(false);
  const [isNewUnitOpen, setIsNewUnitOpen] = useState(false);
  const [isNewMaintenanceOpen, setIsNewMaintenanceOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isScheduleVisitOpen, setIsScheduleVisitOpen] = useState(false);

  // Selection Drawers
  const [selectedUnit, setSelectedUnit] = useState<RentalUnit | null>(null);
  const [selectedContract, setSelectedContract] = useState<TenancyContract | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<MaintenanceWorkOrder | null>(null);

  // Local Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (parentToast) parentToast(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // HANDLERS: Create Contract
  const handleCreateNewContract = (contractData: any) => {
    const newContractNumber = `CNT-2024-00${contracts.length + 11}`;
    const newContract: TenancyContract = {
      id: `cnt-${Date.now()}`,
      contractNumber: newContractNumber,
      unitId: contractData.unitId,
      unitCode: contractData.unitCode,
      propertyName: contractData.propertyName,
      propertyCategory: contractData.propertyCategory,
      tenantName: contractData.tenantName,
      tenantEmail: contractData.tenantEmail,
      tenantPhone: contractData.tenantPhone,
      tenantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      landlordName: contractData.landlordName,
      startDate: contractData.startDate,
      endDate: '30 Sep 2027',
      durationMonths: contractData.durationMonths,
      monthlyRent: contractData.monthlyRent,
      annualRent: contractData.annualRent,
      paymentFrequency: contractData.paymentFrequency,
      securityDeposit: contractData.securityDeposit,
      commissionFee: Math.round(contractData.annualRent * 0.05),
      status: 'Active',
      signatureStatus: 'Signed',
      signedDate: 'Today',
      autoRenewal: true,
      escalationPercent: 5,
      utilityInclusive: false,
      terms: 'Standard residential lease agreement registered under Dubai Land Department Ejari.',
      paymentSchedule: [
        { id: `inst-${Date.now()}-1`, installmentNo: 1, dueDate: contractData.startDate, amount: Math.round(contractData.annualRent / 4), status: 'Pending', invoiceId: `INV-${Date.now().toString().slice(-4)}` },
        { id: `inst-${Date.now()}-2`, installmentNo: 2, dueDate: '01 Jan 2027', amount: Math.round(contractData.annualRent / 4), status: 'Pending', invoiceId: `INV-${(Date.now() + 1).toString().slice(-4)}` },
      ],
    };

    setContracts([newContract, ...contracts]);
    // Update Unit status to Rented
    setUnits((prev) =>
      prev.map((u) =>
        u.id === contractData.unitId
          ? {
              ...u,
              status: 'Rented',
              currentTenant: {
                name: contractData.tenantName,
                email: contractData.tenantEmail,
                phone: contractData.tenantPhone,
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                contractId: newContractNumber,
                leaseEnd: '30 Sep 2027',
              },
            }
          : u
      )
    );

    // Update KPIs
    setKpis((prev) => ({
      ...prev,
      rentedUnits: prev.rentedUnits + 1,
      availableUnits: Math.max(0, prev.availableUnits - 1),
      activeContractsCount: prev.activeContractsCount + 1,
      occupancyRate: Math.min(100, Number(((prev.rentedUnits + 1) / prev.totalUnits * 100).toFixed(1))),
    }));

    showToast(`Tenancy Contract ${newContractNumber} created for ${contractData.tenantName}!`);
  };

  // HANDLERS: Create Unit
  const handleCreateNewUnit = (unitData: any) => {
    const newUnit: RentalUnit = {
      id: `unit-${Date.now()}`,
      ...unitData,
    };
    setUnits([newUnit, ...units]);
    setKpis((prev) => ({
      ...prev,
      totalUnits: prev.totalUnits + 1,
      availableUnits: prev.availableUnits + 1,
    }));
    showToast(`Added ${newUnit.code} to rental inventory!`);
  };

  // HANDLERS: Create Maintenance
  const handleCreateNewMaintenance = (maintData: any) => {
    const newOrder: MaintenanceWorkOrder = {
      id: `mnt-${Date.now()}`,
      ticketNumber: `MNT-2024-00${workOrders.length + 45}`,
      propertyName: units.find((u) => u.code === maintData.unitCode)?.name || 'Luxury Residence',
      tenantName: 'Resident Renter',
      tenantPhone: '+971 50 192 8841',
      ...maintData,
    };
    setWorkOrders([newOrder, ...workOrders]);
    setKpis((prev) => ({
      ...prev,
      openMaintenanceTickets: prev.openMaintenanceTickets + 1,
      emergencyMaintenanceCount:
        maintData.urgency === 'Emergency' ? prev.emergencyMaintenanceCount + 1 : prev.emergencyMaintenanceCount,
    }));
    showToast(`Work Order ${newOrder.ticketNumber} logged and dispatched!`);
  };

  // HANDLERS: Record Payment
  const handleRecordPayment = (payData: any) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === payData.invoiceId
          ? {
              ...inv,
              status: 'Paid',
              paymentMethod: payData.paymentMethod,
              transactionRef: payData.transactionRef,
              paidDate: 'Today',
            }
          : inv
      )
    );
    showToast(`Payment successfully registered with receipt for invoice!`);
  };

  // HANDLERS: Schedule Tour
  const handleScheduleVisit = (visitData: any) => {
    const newBooking: SiteBooking = {
      id: `bk-${Date.now()}`,
      bookingNumber: `VISIT-2024-1${bookings.length + 10}`,
      propertyName: units.find((u) => u.code === visitData.unitCode)?.name || 'Exclusive Suite',
      ...visitData,
    };
    setBookings([newBooking, ...bookings]);
    setKpis((prev) => ({
      ...prev,
      scheduledVisitsCount: prev.scheduledVisitsCount + 1,
    }));
    showToast(`Site tour confirmed for ${visitData.clientName}!`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#07080c] text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col font-sans pb-16">
      {/* 1. Odoo Header Ribbon */}
      <RentalHeaderRibbon
        activeRentalTab={activeRentalTab}
        setActiveRentalTab={setActiveRentalTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        onOpenNewContract={() => setIsNewContractOpen(true)}
        onOpenNewUnit={() => setIsNewUnitOpen(true)}
        onOpenNewMaintenance={() => setIsNewMaintenanceOpen(true)}
        onOpenRecordPayment={() => setIsRecordPaymentOpen(true)}
        onOpenScheduleVisit={() => setIsScheduleVisitOpen(true)}
        onToast={showToast}
      />

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 flex-1">
        {/* 2. Top Executive KPI Cards */}
        <RentalKpiCards
          kpis={kpis}
          onNavigateTab={(tab) => setActiveRentalTab(tab)}
          onToast={showToast}
        />

        {/* 3. Sub-Tab Dynamic Contents */}
        {activeRentalTab === 'techkhedut-showcase' && (
          <TechKhedutShowcasePoster
            contracts={contracts}
            onSelectContract={(c) => {
              setSelectedContract(c);
              setActiveRentalTab('contract-portal');
            }}
            onNavigateTab={(tab) => setActiveRentalTab(tab as RentalTab)}
            onOpenNewContract={() => setIsNewContractOpen(true)}
            onToast={showToast}
          />
        )}

        {activeRentalTab === 'contract-portal' && (
          <TechKhedutContractPortalView
            contract={selectedContract || contracts.find(c => c.contractNumber === 'T/00006') || contracts[0]}
            onNavigateTab={(tab) => setActiveRentalTab(tab as RentalTab)}
            onOpenNewContract={() => setIsNewContractOpen(true)}
            onToast={showToast}
          />
        )}

        {activeRentalTab === 'contracts-kanban' && (
          <TechKhedutKanbanContractsView
            contracts={contracts}
            onSelectContract={(c) => {
              setSelectedContract(c);
              setActiveRentalTab('contract-portal');
            }}
            onOpenNewContract={() => setIsNewContractOpen(true)}
            onToast={showToast}
          />
        )}

        {activeRentalTab === 'esign-portal' && (
          <TechKhedutESignView
            onNavigateTab={(tab) => setActiveRentalTab(tab as RentalTab)}
            onToast={showToast}
          />
        )}

        {activeRentalTab === 'gis-map' && (
          <TechKhedutGisMapView
            onNavigateTab={(tab) => setActiveRentalTab(tab as RentalTab)}
            onToast={showToast}
          />
        )}

        {activeRentalTab === 'overview' && (
          <RentalOverviewTab
            units={units}
            contracts={contracts}
            invoices={invoices}
            workOrders={workOrders}
            bookings={bookings}
            onNavigateTab={(tab) => setActiveRentalTab(tab)}
            onOpenNewContract={() => setIsNewContractOpen(true)}
            onOpenNewUnit={() => setIsNewUnitOpen(true)}
            onOpenNewMaintenance={() => setIsNewMaintenanceOpen(true)}
            onOpenRecordPayment={() => setIsRecordPaymentOpen(true)}
            onSelectContract={(c) => setSelectedContract(c)}
            onSelectWorkOrder={(w) => setSelectedWorkOrder(w)}
            onToast={showToast}
          />
        )}

        {activeRentalTab === 'properties' && (
          <RentalPropertiesTab
            units={units}
            selectedUnit={selectedUnit}
            setSelectedUnit={setSelectedUnit}
            onOpenNewUnit={() => setIsNewUnitOpen(true)}
            onCreateContractForUnit={(u) => {
              setSelectedUnit(u);
              setIsNewContractOpen(true);
            }}
            onOpenMaintenanceForUnit={(u) => {
              setSelectedUnit(u);
              setIsNewMaintenanceOpen(true);
            }}
            onToast={showToast}
          />
        )}

        {activeRentalTab === 'contracts' && (
          <RentalContractsTab
            contracts={contracts}
            selectedContract={selectedContract}
            setSelectedContract={setSelectedContract}
            onOpenNewContract={() => setIsNewContractOpen(true)}
            onToast={showToast}
          />
        )}

        {activeRentalTab === 'invoices' && (
          <RentalInvoicesTab
            invoices={invoices}
            onOpenRecordPayment={() => setIsRecordPaymentOpen(true)}
            onPayInvoice={(inv) => {
              setInvoices((prev) =>
                prev.map((i) => (i.id === inv.id ? { ...i, status: 'Paid', paidDate: 'Today' } : i))
              );
              showToast(`Invoice ${inv.invoiceNumber} marked as Paid!`);
            }}
            onToast={showToast}
          />
        )}

        {activeRentalTab === 'maintenance' && (
          <RentalMaintenanceTab
            workOrders={workOrders}
            selectedWorkOrder={selectedWorkOrder}
            setSelectedWorkOrder={setSelectedWorkOrder}
            onOpenNewMaintenance={() => setIsNewMaintenanceOpen(true)}
            onUpdateStatus={(id, status) => {
              setWorkOrders((prev) =>
                prev.map((w) => (w.id === id ? { ...w, status, resolvedDate: status === 'Resolved' ? 'Today' : undefined } : w))
              );
            }}
            onToast={showToast}
          />
        )}

        {activeRentalTab === 'bookings' && (
          <RentalBookingsTab
            bookings={bookings}
            onOpenScheduleVisit={() => setIsScheduleVisitOpen(true)}
            onConvertBookingToContract={(bk) => {
              setIsNewContractOpen(true);
              showToast(`Converting tour for ${bk.clientName} into Tenancy Contract...`);
            }}
            onToast={showToast}
          />
        )}

        {activeRentalTab === 'reminders' && (
          <RentalRemindersTab
            reminders={reminders}
            onUpdateReminder={(updated) => {
              setReminders((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
            }}
            onAddReminder={(newTask) => {
              setReminders((prev) => [newTask, ...prev]);
            }}
            onDeleteReminder={(id) => {
              setReminders((prev) => prev.filter((r) => r.id !== id));
            }}
            triggerSettings={triggerSettings}
            onUpdateTriggerSettings={(newSettings) => {
              setTriggerSettings(newSettings);
            }}
            onToast={showToast}
          />
        )}

        {activeRentalTab === 'landlords' && (
          <RentalLandlordsTab
            landlords={landlords}
            onProcessPayout={(id) => {
              setLandlords((prev) =>
                prev.map((l) => (l.id === id ? { ...l, payoutStatus: 'Processed', lastPayoutDate: 'Today' } : l))
              );
            }}
            onToast={showToast}
          />
        )}
      </div>

      {/* 4. Interactive Modals and Detail Drawers */}
      <RentalModals
        isNewContractOpen={isNewContractOpen}
        onCloseNewContract={() => setIsNewContractOpen(false)}
        units={units}
        preselectedUnit={selectedUnit}
        onSubmitNewContract={handleCreateNewContract}
        isNewUnitOpen={isNewUnitOpen}
        onCloseNewUnit={() => setIsNewUnitOpen(false)}
        onSubmitNewUnit={handleCreateNewUnit}
        isNewMaintenanceOpen={isNewMaintenanceOpen}
        onCloseNewMaintenance={() => setIsNewMaintenanceOpen(false)}
        onSubmitNewMaintenance={handleCreateNewMaintenance}
        isRecordPaymentOpen={isRecordPaymentOpen}
        onCloseRecordPayment={() => setIsRecordPaymentOpen(false)}
        invoices={invoices}
        onSubmitRecordPayment={handleRecordPayment}
        isScheduleVisitOpen={isScheduleVisitOpen}
        onCloseScheduleVisit={() => setIsScheduleVisitOpen(false)}
        onSubmitScheduleVisit={handleScheduleVisit}
        selectedContract={selectedContract}
        onCloseContractDrawer={() => setSelectedContract(null)}
        selectedUnit={selectedUnit}
        onCloseUnitDrawer={() => setSelectedUnit(null)}
        selectedWorkOrder={selectedWorkOrder}
        onCloseWorkOrderDrawer={() => setSelectedWorkOrder(null)}
        onToast={showToast}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-amber-950/90 text-white dark:text-amber-100 border border-slate-700 dark:border-amber-500/40 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
