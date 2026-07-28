export type OperationalStatus = 
  | 'UNASSIGNED'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export type AdministrativeStatus = 
  | 'PENDING'
  | 'PAID'
  | 'DISPUTE_RESOLVED';

export type VehicleServiceType = 
  | 'STANDARD_SEDAN'
  | 'EXECUTIVE_SUV'
  | 'LUXURY_VAN'
  | 'ELECTRIC_FLEET';

export interface AdminJobGSheetRow {
  Timestamp?: string;
  'Job ID'?: string;
  Key?: string;
  Customer_ID?: string;
  Email_Address?: string;
  Nama_Pelanggan?: string;
  Nombor_Telefon_Pelanggan?: string;
  Permintaan_Khas?: string;
  'Lokasi_Jemput(Pick Up)'?: string;
  'Tarikh_Jemput Pilihan(Pick Up)'?: string;
  'Masa_Jemput_Pilihan(Pick Up)'?: string;
  'Lokasi _Hantar(Drop off)'?: string;
  'Tarikh_Hantar_Pilihan(Drop off)'?: string;
  'Masa_Hantar_Pilihan(Drop off)'?: string;
  Jenis_Perkhidmatan?: string;
  'Round Trip'?: string | boolean;
  Bil_Penumpang?: number | string;
  Tujuan?: string;
  Request_ID?: string;
  Payment_Amount?: number | string;
  Payment_Driver?: number | string;
  Gross_Profit?: number | string;
  Status_Ops?: string;
  Status_Admin?: string;
  Customer_Type?: string;
  Admin_Notes?: string;
  Verified_By?: string;
  Verified_Date?: string;
  'Date Email send_Driver'?: string;
  'Date Email send_Customer'?: string;
  Job_Created?: string;
}

export interface DriverNameGSheetRow {
  'Driver Name'?: string;
  PIN?: string;
  Photo?: string;
  Email?: string;
  'Phone Number'?: string;
  Is_Available?: boolean | string;
  Last_Updated?: string;
  'Admin Role'?: boolean | string;
}

export interface CustomerGSheetRow {
  Name?: string;
  'Client Code'?: string;
  '*4 last digit of their phone number'?: string;
}

export interface Driver extends DriverNameGSheetRow {
  id: string;
  name: string;
  phone: string;
  pin: string; // 4-digit code
  isAvailable: boolean;
  vehicleModel: string;
  licensePlate: string;
  adminRole: boolean;
  totalCompletedJobs: number;
  rating: number;
}

export interface Trip extends AdminJobGSheetRow {
  id: string; // e.g. "TRP-2026-8801"
  passengerName: string;
  passengerPhone: string;
  passengerCount: number;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDate: string; // YYYY-MM-DD
  pickupTime: string; // HH:mm
  isRoundTrip: boolean;
  vehicleType: VehicleServiceType;
  estimatedDistanceKm: number;
  paymentAmount: number; // Gross fare ($)
  paymentDriver: number; // Driver payout ($)
  grossProfit: number; // Company profit ($)
  statusOps: OperationalStatus;
  statusAdmin: AdministrativeStatus;
  assignedDriverId?: string;
  assignedDriverName?: string;
  specialNotes?: string;
  driverCalculatedAmount?: number;
  driverDisputeReason?: string;
  disputeResolvedAmount?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface ActivityItem {
  id: string;
  tripId: string;
  driverName: string;
  route: string;
  payout: number;
  timestamp: string;
}

export interface GasConfig {
  webAppUrl: string;
  autoSyncOnComplete: boolean;
  lastSyncTimestamp?: string;
  syncStatus: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR';
  lastErrorMessage?: string;
}

export interface FinancialSummary {
  monthYear: string;
  totalRevenue: number;
  totalDriverPayouts: number;
  totalCompanyMargin: number;
  completedTripsCount: number;
  pendingTripsCount: number;
  disputedTripsCount: number;
  cancelledTripsCount: number;
}

export interface VehicleServiceDetails {
  type: VehicleServiceType;
  label: string;
  baseFare: number;
  perKmRate: number;
  maxPassengers: number;
  description: string;
  iconName: string;
}
