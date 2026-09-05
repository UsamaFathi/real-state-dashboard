export type RentalViewMode = 'dashboard' | 'kanban' | 'table' | 'calendar' | 'pivot';

export type RentalTab =
  | 'techkhedut-showcase'
  | 'contract-portal'
  | 'contracts-kanban'
  | 'gis-map'
  | 'esign-portal'
  | 'overview'
  | 'properties'
  | 'contracts'
  | 'invoices'
  | 'maintenance'
  | 'bookings'
  | 'landlords'
  | 'reminders'
  | 'reports';

export type UnitRentalStatus = 'Available' | 'Rented' | 'Reserved' | 'Under Maintenance';

export type PropertyCategory = 'Apartment' | 'Villa' | 'Penthouse' | 'Office' | 'Commercial' | 'Townhouse';

export interface RentalUnit {
  id: string;
  code: string;
  name: string;
  category: PropertyCategory;
  district: string;
  address: string;
  floor: number;
  tower?: string;
  beds: number;
  baths: number;
  areaSqft: number;
  monthlyRent: number;
  annualRent: number;
  securityDeposit: number;
  furnishingStatus: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  status: UnitRentalStatus;
  imageUrl: string;
  floorPlanUrl: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  currentTenant?: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    contractId: string;
    leaseEnd: string;
  };
  amenities: string[];
  features: string[];
  maintenanceCount: number;
  lastInspectionDate?: string;
}

export type ContractStatus = 'Active' | 'Pending Signature' | 'Expiring Soon' | 'Terminated' | 'Draft';
export type PaymentFrequency = 'Monthly' | 'Quarterly' | 'Bi-Annual' | 'Annual';

export interface RentInstallment {
  id: string;
  installmentNo: number;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  invoiceId: string;
  paidDate?: string;
  paymentMethod?: string;
}

export interface TenancyContract {
  id: string;
  contractNumber: string;
  unitId: string;
  unitCode: string;
  propertyName: string;
  propertyCategory: PropertyCategory;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  tenantAvatar: string;
  landlordName: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  monthlyRent: number;
  annualRent: number;
  paymentFrequency: PaymentFrequency;
  securityDeposit: number;
  commissionFee: number;
  status: ContractStatus;
  signatureStatus: 'Signed' | 'Pending' | 'Draft';
  signedDate?: string;
  autoRenewal: boolean;
  escalationPercent: number;
  utilityInclusive: boolean;
  terms: string;
  paymentSchedule: RentInstallment[];
}

export type InvoiceStatus = 'Paid' | 'Posted' | 'Overdue' | 'Draft' | 'Partial';

export interface RentInvoice {
  id: string;
  invoiceNumber: string;
  contractNumber: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  unitCode: string;
  propertyName: string;
  dueDate: string;
  issueDate: string;
  amount: number;
  lateFee: number;
  totalDue: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  transactionRef?: string;
  paidDate?: string;
  notes?: string;
}

export type MaintenanceUrgency = 'Emergency' | 'High' | 'Normal' | 'Low';
export type MaintenanceStatus = 'New' | 'Assigned' | 'In Progress' | 'Resolved' | 'Invoiced';
export type MaintenanceCategory =
  | 'Plumbing'
  | 'HVAC / AC'
  | 'Electrical'
  | 'Appliance'
  | 'Structural'
  | 'Carpentry'
  | 'Painting'
  | 'Smart Home';

export interface MaintenanceWorkOrder {
  id: string;
  ticketNumber: string;
  unitCode: string;
  propertyName: string;
  tenantName: string;
  tenantPhone: string;
  category: MaintenanceCategory;
  title: string;
  description: string;
  urgency: MaintenanceUrgency;
  status: MaintenanceStatus;
  assignedTechnician: {
    name: string;
    phone: string;
    company: string;
    avatar?: string;
  };
  estimatedCost: number;
  actualCost: number;
  reportedDate: string;
  scheduledDate: string;
  resolvedDate?: string;
  photos: string[];
}

export type BookingStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Lease Offered';

export interface SiteBooking {
  id: string;
  bookingNumber: string;
  unitCode: string;
  propertyName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  visitDate: string;
  visitTime: string;
  assignedAgent: {
    name: string;
    initials: string;
    avatarBg: string;
  };
  status: BookingStatus;
  notes: string;
  interestedInLease: boolean;
}

export interface LandlordOwner {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  avatar: string;
  propertiesCount: number;
  unitsList: string[];
  grossMonthlyRent: number;
  commissionPercent: number;
  netMonthlyPayout: number;
  payoutStatus: 'Processed' | 'Pending';
  lastPayoutDate: string;
  bankAccount: string;
}

export interface RentalKPIs {
  totalProperties: number;
  totalUnits: number;
  availableUnits: number;
  rentedUnits: number;
  maintenanceUnits: number;
  reservedUnits: number;
  occupancyRate: number;
  grossRentMTD: number;
  grossRentYTD: number;
  overdueRentAmount: number;
  securityDepositsHeld: number;
  collectionEfficiency: number;
  activeContractsCount: number;
  expiringContractsCount: number;
  openMaintenanceTickets: number;
  emergencyMaintenanceCount: number;
  scheduledVisitsCount: number;
  averageYieldPercent: number;
  pendingRemindersCount?: number;
}

export type ReminderCategory =
  | 'upcoming_rent'
  | 'late_payment'
  | 'lease_renewal'
  | 'maintenance_check'
  | 'pdc_presentation'
  | 'landlord_statement';

export type ReminderStatus = 'pending' | 'scheduled' | 'sent' | 'snoozed' | 'dismissed';
export type NotificationChannel = 'email' | 'whatsapp' | 'sms' | 'portal_push' | 'system_bell';

export interface ReminderTriggerSettings {
  // Upcoming Rent Due
  upcomingRentEnabled: boolean;
  upcomingRentDaysBefore: number[]; // e.g. [7, 3, 1]
  upcomingRentChannels: NotificationChannel[];
  upcomingRentAutoSend: boolean;
  upcomingRentTemplate: string;

  // Late Payment Overdue Alerts
  latePaymentEnabled: boolean;
  latePaymentGraceDays: number; // e.g. 1
  latePaymentFrequencyDays: number[]; // e.g. [1, 3, 7, 14]
  latePaymentChannels: NotificationChannel[];
  latePaymentAutoLateFee: boolean;
  latePaymentLateFeeAmount: number; // e.g. 500 AED
  latePaymentNotifyLandlord: boolean;
  latePaymentLandlordOverdueDays: number; // e.g. 5
  latePaymentTemplate: string;

  // Lease Expiration & RERA Renewals
  leaseRenewalEnabled: boolean;
  leaseRenewalDaysBefore: number[]; // e.g. [90, 60, 30]
  leaseRenewalChannels: NotificationChannel[];
  leaseRenewalTemplate: string;

  // PDC Cheque Presentation
  pdcAlertEnabled: boolean;
  pdcDaysBefore: number; // e.g. 3
  pdcChannels: NotificationChannel[];

  // Tenant Portal In-App Notification
  tenantPortalPushEnabled: boolean;
  adminEmailDigest: boolean;
}

export interface ReminderTask {
  id: string;
  category: ReminderCategory;
  title: string;
  description: string;
  recipientName: string;
  recipientContact: string;
  recipientType: 'Tenant' | 'Landlord' | 'Agent' | 'Finance';
  unitCode: string;
  propertyName: string;
  amount?: number;
  dueDate: string;
  daysDiff: number; // negative for upcoming (e.g. -3 for due in 3 days), positive for overdue (e.g. +4 for 4 days overdue)
  channels: NotificationChannel[];
  scheduledTime: string;
  status: ReminderStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  templatePreview: string;
  lastSentAt?: string;
  snoozedUntil?: string;
}
