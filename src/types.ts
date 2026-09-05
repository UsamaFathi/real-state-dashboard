export type NavigationTab =
  // Main Navigation Structure
  | 'overview'
  | 'shadcn-dashboard'
  | 'projects'
  | 'phases'
  | 'buildings'
  | 'units'
  | 'unit-availability'
  | 'properties'
  | 'inventory'
  | 'leads'
  | 'viewings'
  | 'offers'
  | 'holds'
  | 'reservations'
  | 'contracts'
  | 'deals'
  | 'pricing'
  | 'pricing-rules'
  | 'price-adjustments'
  | 'payment-plans'
  | 'reports'
  | 'reporting'
  | 'documents'
  | 'configuration'
  | 'property-types'
  | 'unit-types'
  | 'views-orientations'
  | 'approval-rules'
  | 'payment-plan-templates'
  | 'settings'
  | 'tasks'
  | 'contacts'
  | 'messages'
  | 'sales-analytics'
  | 'portfolio'
  | 'audit-logs'
  | 'finance'
  | 'shadcn-listings'
  | 'shadcn-detail'
  | 'shadcn-filter'
  | 'techkhedut-showcase'
  | 'contract-portal'
  | 'contracts-kanban'
  | 'gis-map'
  | 'esign-portal'
  | 'rental-management'
  | 'command-center';

export * from './types/rentalTypes';

export type DealStage =
  | 'new'
  | 'viewing_scheduled'
  | 'negotiation'
  | 'legal_documentation'
  | 'closed_won'
  | 'closed_lost';

export type DealPriority = 'Low' | 'Medium' | 'High';

export interface DealItem {
  id: string;
  code: string;
  title: string;
  stage: DealStage;
  priority: DealPriority;
  price: number;
  currency: string;
  dateLabel: string;
  dateValue: string;
  client: string;
  clientEmail?: string;
  clientPhone?: string;
  source: string;
  bedrooms: number;
  areaSqm: number;
  propertyType: string;
  floorPlanUrl: string;
  photoUrl: string;
  assignedAgents: {
    name: string;
    initials: string;
    avatarBg: string;
  }[];
  commentsCount: number;
  filesCount: number;
  description?: string;
  commission?: number;
  listingUrl?: string;
}

export type TopNavTab = 'portfolio' | 'entities' | 'global-log';

export type UnitStatus =
  | 'Available'
  | 'Reserved'
  | 'Sold'
  | 'Contracted'
  | 'On Hold'
  | 'Under Maintenance';

export interface UnitItem {
  id: string;
  code: string;
  project: string;
  location: string;
  floor: number;
  tower: string;
  district: string;
  type: string;
  beds: number;
  baths: number;
  internalArea: number; // sqft
  balconyArea: number; // sqft
  orientation: string;
  basePrice: number;
  floorPremiumPercent: number;
  viewPremium: number;
  seasonalDiscount: number;
  status: UnitStatus;
  leadCount: number;
  description: string;
  imageUrl: string;
  floorPlanUrl: string;
  features: string[];
  priceHistory: {
    date: string;
    event: string;
    baseValue: number;
    adjustments: number;
    finalPrice: number;
  }[];
  specifications: { label: string; value: string }[];
}

export interface PricingRule {
  id: string;
  name: string;
  scope: string;
  scopeLevel: 'Project' | 'Unit Type' | 'Floor Range' | 'View Tag';
  target: string;
  type: 'Percentage' | 'Fixed' | 'Per Sqm';
  adjustment: number;
  status: 'ACTIVE' | 'SCHEDULED' | 'DRAFT';
  affectedUnitsCount: number;
  lastUpdated?: string;
  history: {
    title: string;
    author: string;
    date: string;
    note?: string;
  }[];
}

export interface OfferApproval {
  id: string;
  offerCode: string;
  opportunityRef: string;
  customerName: string;
  customerInitials: string;
  unitCode: string;
  unitTitle: string;
  offerValidity: string;
  paymentPlan: string;
  systemPrice: number;
  discountPercent: number;
  discountAmount: number;
  finalOfferPrice: number;
  revision: number;
  status: 'Approval Required' | 'Approved' | 'Rejected' | 'Draft';
  approvalRequestId: string;
  requestedBy: string;
  requestedDate: string;
  triggerRule: string;
  justification: string;
  history: {
    revision: number;
    status: 'SUPERSEDED' | 'REJECTED' | 'APPROVED' | 'SUBMITTED' | 'PENDING';
    discountRequested: number;
    date: string;
    note?: string;
  }[];
}

export interface TransactionHold {
  id: string;
  unitCode: string;
  tower: string;
  project: string;
  status: 'HOLD' | 'RESERVATION' | 'CONTRACTED';
  clientName: string;
  salesAgent: string;
  totalValue: number;
  expiresAt: string; // ISO date string
  holdDetails: {
    status: 'COMPLETED' | 'ACTIVE' | 'EXPIRED';
    dateRange: string;
    initialDate: string;
    expiryDate: string;
    extensions: string;
  };
  reservationDetails: {
    status: 'ACTIVE' | 'PENDING' | 'COMPLETED';
    feePaid: number;
    isPaid: boolean;
    paymentPlan: string;
    expiryDate: string;
    daysRemaining: number;
  };
  timeline: {
    id: string;
    title: string;
    timestamp: string;
    detail: string;
    active?: boolean;
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  target: string;
  user: string;
  role: string;
  delta: string;
  hash: string;
  eventType: 'PRICE_UPDATE' | 'OFFER_APPROVAL' | 'RESERVATION_EXTENDED' | 'RULE_MODIFIED' | 'SYSTEM';
}

export interface MetricCardData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  note?: string;
  statusDot?: boolean;
}

export interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  budget: string;
  interestedIn: string;
  stage: 'Lead' | 'Offer' | 'Approved' | 'Hold' | 'Reservation' | 'Contract';
  agent: string;
  lastContact: string;
}

export interface LegalEntity {
  id: string;
  name: string;
  shortCode?: string;
  jurisdiction: string;
  taxId: string;
  activeProperties: number;
  aum: string;
  status: 'Active' | 'Under Review';
  currencySymbol?: string;
  logoBg?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  read: boolean;
  type: 'urgent' | 'info' | 'success';
  targetId?: string;
}

export type AppNotification = NotificationItem;
