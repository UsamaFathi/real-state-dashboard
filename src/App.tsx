import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { NewRecordModal } from './components/NewRecordModal';
import { NotificationsPopover } from './components/NotificationsPopover';
import { SupportModal } from './components/SupportModal';
import { InviteMemberModal } from './components/InviteMemberModal';
import { Toast } from './components/Toast';

import { ShadcnBrowserMockupBar } from './components/shadcn/ShadcnBrowserMockupBar';
import { ShadcnRealEstateDashboardView } from './components/shadcn/ShadcnRealEstateDashboardView';
import { ShadcnRealEstateListingsView } from './components/shadcn/ShadcnRealEstateListingsView';
import { ShadcnRealEstateDetailView } from './components/shadcn/ShadcnRealEstateDetailView';
import { ShadcnRealEstateFilterView } from './components/shadcn/ShadcnRealEstateFilterView';
import { ShadcnUnlockModal } from './components/shadcn/ShadcnUnlockModal';

import { DealsPipelineView } from './components/views/DealsPipelineView';
import { CommandCenterView } from './components/views/CommandCenterView';
import { InventoryView } from './components/views/InventoryView';
import { OffersView } from './components/views/OffersView';
import { TransactionsView } from './components/views/TransactionsView';
import { PricingView } from './components/views/PricingView';
import { ReportingView } from './components/views/ReportingView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { PortfolioView } from './components/views/PortfolioView';
import { CRMLeadsView } from './components/views/CRMLeadsView';
import { TasksView } from './components/views/TasksView';
import { ContactsView } from './components/views/ContactsView';
import { MessagesView } from './components/views/MessagesView';
import { SalesAnalyticsView } from './components/views/SalesAnalyticsView';
import { IntegrationsView } from './components/views/IntegrationsView';
import { RentalManagementDashboardView } from './components/views/RentalManagementDashboardView';
import { SettingsView } from './components/views/SettingsView';

import {
  initialDeals,
  initialUnits,
  initialOffers,
  initialTransactions,
  initialPricingRules,
  initialAuditLogs,
  initialEntities,
  initialNotifications,
} from './data/mockData';
import {
  NavigationTab,
  DealItem,
  DealStage,
  UnitItem,
  OfferApproval,
  TransactionHold,
  PricingRule,
  AuditLogEntry,
  LegalEntity,
  NotificationItem,
} from './types';

export default function App() {
  // Theme state with smooth transition and persistence
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('uf_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('uf_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('uf_theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const next = !prev;
      showToast(next ? 'Dark Mode activated' : 'Light Mode activated');
      return next;
    });
  };

  // Navigation & Entity (Default to 'shadcn-dashboard' / 'overview')
  const [activeTab, setActiveTab] = useState<NavigationTab>('shadcn-dashboard');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

  // Core Real Estate Operating Data
  const [entities] = useState<LegalEntity[]>(initialEntities);
  const [selectedEntity, setSelectedEntity] = useState<LegalEntity>(initialEntities[0]);
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);
  const [units, setUnits] = useState<UnitItem[]>(initialUnits);
  const [selectedUnit, setSelectedUnit] = useState<UnitItem>(initialUnits[0]);
  const [offers, setOffers] = useState<OfferApproval[]>(initialOffers);
  const [selectedOffer, setSelectedOffer] = useState<OfferApproval>(initialOffers[0]);
  const [transactions, setTransactions] = useState<TransactionHold[]>(initialTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionHold>(
    initialTransactions[0]
  );
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(initialPricingRules);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Modals & Overlays
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper for triggering toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Keyboard Shortcuts: ⌘K for search, ⌘N for new record, ⌘D for dark mode toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setIsNewRecordModalOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update Deal Stage Handler
  const handleUpdateDealStage = (dealId: string, newStage: DealStage) => {
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id === dealId) {
          const updated = { ...deal, stage: newStage };
          const log: AuditLogEntry = {
            id: `aud-${Date.now()}`,
            timestamp: 'Just now',
            action: 'DEAL_STAGE_MOVED',
            target: deal.code,
            user: 'Toby Belhome',
            role: 'Real Estate Sales Manager',
            delta: `${deal.stage} → ${newStage}`,
            hash: `0x${Math.random().toString(16).substr(2, 8)}`,
            eventType: 'SYSTEM',
          };
          setAuditLogs((l) => [log, ...l]);
          return updated;
        }
        return deal;
      })
    );
    showToast(`Deal moved to ${newStage.replace(/_/g, ' ').toUpperCase()}`);
  };

  // Add new deal
  const handleAddNewDeal = (newDeal: Partial<DealItem>) => {
    const created: DealItem = {
      id: `deal-${Date.now()}`,
      code: `#DXB-${Math.floor(10000 + Math.random() * 90000)}`,
      title: newDeal.title || 'New Real Estate Acquisition',
      stage: newDeal.stage || 'new',
      priority: newDeal.priority || 'Medium',
      price: newDeal.price || 3500000,
      currency: newDeal.currency || selectedEntity.currencySymbol || 'EGP',
      dateLabel: 'Created',
      dateValue: 'Today',
      client: newDeal.client || 'Prospective Investor',
      source: 'Direct Portal',
      bedrooms: newDeal.bedrooms || 3,
      areaSqm: newDeal.areaSqm || 180,
      propertyType: newDeal.propertyType || 'Apartment',
      photoUrl:
        newDeal.photoUrl ||
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      floorPlanUrl:
        newDeal.floorPlanUrl ||
        'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&q=80',
      assignedAgents: [
        { name: 'Toby Belhome', initials: 'TB', avatarBg: 'bg-emerald-100 text-emerald-700' },
      ],
      commentsCount: 0,
      filesCount: 0,
      description: newDeal.description || 'Newly registered interest in prime real estate inventory.',
      commission: Math.round((newDeal.price || 3500000) * 0.02),
    };
    setDeals([created, ...deals]);
    showToast(`Created new deal ${created.code}`);
  };

  // Create new offer
  const handleCreateOffer = (offer: Partial<OfferApproval>) => {
    const created: OfferApproval = {
      id: `off-${Date.now()}`,
      offerCode: `OFF-2023-${Math.floor(1000 + Math.random() * 9000)}`,
      opportunityRef: offer.opportunityRef || `OPP-2023-${Math.floor(100 + Math.random() * 900)}`,
      customerName: offer.customerName || 'Qualified Investor Corp',
      customerInitials: (offer.customerName || 'QI').substring(0, 2).toUpperCase(),
      unitCode: offer.unitCode || 'AZ-T1-1204',
      unitTitle: offer.unitTitle || 'Palm Residence • Unit 1204',
      offerValidity: offer.offerValidity || '2023-12-31',
      paymentPlan: offer.paymentPlan || 'Standard 20/80',
      systemPrice: offer.systemPrice || 1100000,
      discountPercent: offer.discountPercent || 4.5,
      discountAmount: offer.discountAmount || 49500,
      finalOfferPrice: offer.finalOfferPrice || 1050500,
      revision: 1,
      status: offer.status || 'Approval Required',
      approvalRequestId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      requestedBy: 'Toby Belhome (Real Estate Sales Manager)',
      requestedDate: 'Today',
      triggerRule: 'Standard Commercial Rule',
      justification: offer.justification || 'Investor committing to expedited wire deposit',
      history: [
        {
          revision: 1,
          status: 'SUBMITTED',
          discountRequested: 4.5,
          date: 'Today - Just now',
        },
      ],
    };
    setOffers([created, ...offers]);
    showToast(`Submitted approval request for ${created.unitCode}`);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Clean company domain path in browser bar
  const getBrowserPath = () => {
    const cleanCompany = selectedEntity.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const baseDomain = `portal.${cleanCompany || 'palmdevelopments'}.com/real-estate`;

    switch (activeTab) {
      case 'shadcn-dashboard':
      case 'overview':
        return `${baseDomain}/overview`;
      case 'projects':
        return `${baseDomain}/properties/projects`;
      case 'phases':
        return `${baseDomain}/properties/phases`;
      case 'buildings':
        return `${baseDomain}/properties/buildings`;
      case 'units':
      case 'properties':
      case 'inventory':
        return `${baseDomain}/properties/units`;
      case 'unit-availability':
      case 'shadcn-listings':
        return `${baseDomain}/properties/availability`;
      case 'shadcn-detail':
        return `${baseDomain}/properties/units/A-1204`;
      case 'shadcn-filter':
        return `${baseDomain}/properties/filter`;
      case 'leads':
        return `${baseDomain}/sales/leads`;
      case 'viewings':
        return `${baseDomain}/sales/viewings`;
      case 'offers':
        return `${baseDomain}/sales/offers`;
      case 'holds':
      case 'transactions':
        return `${baseDomain}/sales/holds`;
      case 'reservations':
      case 'deals':
        return `${baseDomain}/sales/reservations`;
      case 'contracts':
      case 'contracts-kanban':
      case 'contract-portal':
        return `${baseDomain}/sales/contracts`;
      case 'pricing':
      case 'pricing-rules':
        return `${baseDomain}/pricing/rules`;
      case 'price-adjustments':
        return `${baseDomain}/pricing/adjustments`;
      case 'payment-plans':
        return `${baseDomain}/pricing/payment-plans`;
      case 'reports':
      case 'reporting':
        return `${baseDomain}/reports`;
      case 'documents':
      case 'esign-portal':
        return `${baseDomain}/documents`;
      case 'configuration':
      case 'settings':
      case 'property-types':
      case 'unit-types':
      case 'views-orientations':
      case 'approval-rules':
      case 'payment-plan-templates':
        return `${baseDomain}/configuration/${activeTab}`;
      default:
        return `${baseDomain}/${activeTab}`;
    }
  };

  return (
    <div
      className={`flex flex-col h-screen w-full bg-[#f4f5f8] dark:bg-[#07080c] text-gray-900 dark:text-[#f3f4f6] font-sans overflow-hidden antialiased select-none ${
        isDark ? 'dark' : ''
      }`}
    >
      {/* Top Simulated Enterprise Portal URL Bar */}
      <ShadcnBrowserMockupBar currentPath={getBrowserPath()} onToast={showToast} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Persistent Navigation Sidebar */}
        {isSidebarVisible && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedCompany={selectedEntity}
            onSelectCompany={setSelectedEntity}
            companies={entities}
            isDark={isDark}
            onToggleDark={toggleDarkMode}
            onOpenUnlockModal={() => setIsUnlockModalOpen(true)}
            onToast={showToast}
          />
        )}

        {/* Main App Workspace */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Top Header */}
          <Header
            isDark={isDark}
            onToggleDark={toggleDarkMode}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            unreadNotificationsCount={unreadNotificationsCount}
            onOpenUnlockModal={() => setIsUnlockModalOpen(true)}
            onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
            onToast={showToast}
            selectedCompany={selectedEntity}
          />

          {/* Scrollable Dynamic Views Canvas */}
          <main className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-[#07080c]">
            {/* 1. OVERVIEW / SHADCN REAL ESTATE DASHBOARD */}
            {(activeTab === 'shadcn-dashboard' || activeTab === 'overview') && (
              <ShadcnRealEstateDashboardView
                selectedCompany={selectedEntity}
                onNavigateTab={(tab) => setActiveTab(tab as NavigationTab)}
                onToast={showToast}
              />
            )}

            {/* 2. UNIT AVAILABILITY / SHADCN LISTINGS */}
            {(activeTab === 'unit-availability' || activeTab === 'shadcn-listings') && (
              <ShadcnRealEstateListingsView
                onNavigateTab={(tab) => setActiveTab(tab as NavigationTab)}
                onToast={showToast}
              />
            )}

            {/* 3. SHADCN DETAIL VIEW */}
            {activeTab === 'shadcn-detail' && (
              <ShadcnRealEstateDetailView
                onNavigateTab={(tab) => setActiveTab(tab as NavigationTab)}
                onToast={showToast}
              />
            )}

            {/* 4. SHADCN FILTER VIEW */}
            {activeTab === 'shadcn-filter' && (
              <ShadcnRealEstateFilterView
                onNavigateTab={(tab) => setActiveTab(tab as NavigationTab)}
                onToast={showToast}
              />
            )}

            {/* 5. UNITS / PROPERTIES / INVENTORY / PROJECTS / PHASES / BUILDINGS */}
            {(activeTab === 'units' ||
              activeTab === 'properties' ||
              activeTab === 'inventory' ||
              activeTab === 'projects' ||
              activeTab === 'phases' ||
              activeTab === 'buildings') && (
              <InventoryView
                units={units}
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                onNavigateTab={setActiveTab}
                onCreateOfferForUnit={(u) => {
                  handleCreateOffer({
                    unitCode: u.code,
                    unitTitle: `${u.project} - ${u.code}`,
                    systemPrice: u.basePrice,
                  });
                }}
                onToast={showToast}
              />
            )}

            {/* 6. OFFERS & APPROVALS */}
            {activeTab === 'offers' && (
              <OffersView
                offers={offers}
                selectedOffer={selectedOffer}
                setSelectedOffer={setSelectedOffer}
                onApproveOffer={(id) => {
                  setOffers(
                    offers.map((o) => (o.id === id ? { ...o, status: 'Approved' } : o))
                  );
                  showToast(`Offer ${id} approved by investment committee`);
                }}
                onRejectOffer={(id) => {
                  setOffers(
                    offers.map((o) => (o.id === id ? { ...o, status: 'Rejected' } : o))
                  );
                  showToast(`Offer ${id} rejected`);
                }}
                onUpdateOffer={(updated) => {
                  setOffers(offers.map((o) => (o.id === updated.id ? updated : o)));
                  setSelectedOffer(updated);
                }}
                onNavigateTab={setActiveTab}
                onToast={showToast}
              />
            )}

            {/* 7. HOLDS & TRANSACTIONS */}
            {(activeTab === 'holds' || activeTab === 'transactions') && (
              <TransactionsView
                transactions={transactions}
                selectedTransaction={selectedTransaction}
                setSelectedTransaction={setSelectedTransaction}
                onNavigateTab={setActiveTab}
                onToast={showToast}
              />
            )}

            {/* 8. RESERVATIONS & SALES DEALS */}
            {(activeTab === 'reservations' || activeTab === 'deals') && (
              <DealsPipelineView
                deals={deals}
                onUpdateDealStage={handleUpdateDealStage}
                onAddNewDeal={handleAddNewDeal}
                onOpenInviteModal={() => setIsInviteModalOpen(true)}
                onToast={showToast}
                onNavigateTab={setActiveTab}
              />
            )}

            {/* 9. CONTRACTS & DIGITAL DOCUMENTS */}
            {(activeTab === 'contracts' ||
              activeTab === 'contracts-kanban' ||
              activeTab === 'contract-portal' ||
              activeTab === 'documents' ||
              activeTab === 'esign-portal' ||
              activeTab === 'rental-management' ||
              activeTab === 'gis-map' ||
              activeTab === 'techkhedut-showcase') && (
              <RentalManagementDashboardView
                initialTab={
                  activeTab === 'contracts'
                    ? 'contracts-kanban'
                    : activeTab === 'documents'
                    ? 'esign-portal'
                    : (activeTab as any)
                }
                onToast={showToast}
              />
            )}

            {/* 10. PRICING RULES & PRICE ADJUSTMENTS & PAYMENT PLANS */}
            {(activeTab === 'pricing' ||
              activeTab === 'pricing-rules' ||
              activeTab === 'price-adjustments' ||
              activeTab === 'payment-plans') && (
              <PricingView
                pricingRules={pricingRules}
                onAddRule={(newRule) => {
                  const rule: PricingRule = {
                    id: `pr-${Date.now()}`,
                    name: newRule.name || 'New Pricing Rule',
                    scope: newRule.scope || 'All Active Inventory',
                    scopeLevel: newRule.scopeLevel || 'Project',
                    target: newRule.target || 'General Portfolio',
                    type: newRule.type || 'Percentage',
                    adjustment: newRule.adjustment || 5.0,
                    status: 'ACTIVE',
                    affectedUnitsCount: 30,
                    lastUpdated: 'Today',
                    history: [],
                  };
                  setPricingRules([rule, ...pricingRules]);
                  showToast(`Activated pricing rule "${rule.name}"`);
                }}
                onUpdateRule={(updated) => {
                  setPricingRules(pricingRules.map((r) => (r.id === updated.id ? updated : r)));
                }}
                onNavigateTab={setActiveTab}
                onToast={showToast}
              />
            )}

            {/* 11. REPORTS */}
            {(activeTab === 'reports' || activeTab === 'reporting') && (
              <ReportingView onNavigateTab={setActiveTab} onToast={showToast} />
            )}

            {/* 12. CRM LEADS & BUYER REQUIREMENTS */}
            {(activeTab === 'leads' || activeTab === 'viewings') && (
              <CRMLeadsView
                onToast={showToast}
                onConvertLead={(lead) => {
                  handleAddNewDeal({
                    title: `${lead.name} Acquisition`,
                    client: lead.name,
                    price: 2400000,
                  });
                  setActiveTab('reservations');
                }}
              />
            )}

            {/* 13. CONFIGURATION & SETTINGS */}
            {(activeTab === 'configuration' ||
              activeTab === 'settings' ||
              activeTab === 'property-types' ||
              activeTab === 'unit-types' ||
              activeTab === 'views-orientations' ||
              activeTab === 'approval-rules' ||
              activeTab === 'payment-plan-templates') && (
              <SettingsView onToast={showToast} />
            )}

            {/* 14. TASKS & ALERTS */}
            {activeTab === 'tasks' && <TasksView onToast={showToast} />}

            {/* 15. CONTACTS */}
            {activeTab === 'contacts' && <ContactsView onToast={showToast} />}

            {/* 16. MESSAGES */}
            {activeTab === 'messages' && <MessagesView onToast={showToast} />}

            {/* 17. SALES ANALYTICS */}
            {activeTab === 'sales-analytics' && <SalesAnalyticsView onToast={showToast} />}

            {/* 18. AUDIT LOGS */}
            {activeTab === 'audit-logs' && <AuditLogsView logs={auditLogs} onToast={showToast} />}

            {/* 19. PORTFOLIO VIEW */}
            {activeTab === 'portfolio' && (
              <PortfolioView
                entities={entities}
                units={units}
                deals={deals}
                onToast={showToast}
              />
            )}

            {/* 20. COMMAND CENTER FALLBACK */}
            {activeTab === 'command-center' && (
              <ShadcnRealEstateDashboardView
                selectedCompany={selectedEntity}
                onNavigateTab={(tab) => setActiveTab(tab as NavigationTab)}
                onToast={showToast}
              />
            )}
          </main>
        </div>
      </div>

      {/* Global Modals & Dialogs */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveTab}
        deals={deals}
        units={units}
      />

      <NewRecordModal
        isOpen={isNewRecordModalOpen}
        onClose={() => setIsNewRecordModalOpen(false)}
        onSubmitDeal={handleAddNewDeal}
        onToast={showToast}
      />

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onToast={showToast}
      />

      <NotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications(notifications.map((n) => ({ ...n, read: true })));
          showToast('Marked all notifications as read');
        }}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        onToast={showToast}
      />

      <ShadcnUnlockModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        onToast={showToast}
      />

      {/* Toast Notification HUD */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
