import React, { useState } from 'react';
import { Driver, Trip, OperationalStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { ShieldCheck, AlertTriangle, UserPlus, Search, Edit3, Trash2, Check, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

interface AdminDispatchViewProps {
  trips: Trip[];
  drivers: Driver[];
  onUpdateTrip: (tripId: string, updates: Partial<Trip>) => Promise<void>;
  onPadamTrip: (tripId: string) => Promise<void>;
  onCreateDriver: (driverData: any) => Promise<void>;
  onUpdateDriver: (driverId: string, updates: Partial<Driver>) => Promise<void>;
  onOpenReportModal: () => void;
  
  onOpenAiModal: () => void;
}

export const AdminDispatchView: React.FC<AdminDispatchViewProps> = ({
  trips,
  drivers,
  onUpdateTrip,
  onPadamTrip,
  onCreateDriver,
  onUpdateDriver,
}) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'DISPATCH_BOARD' | 'DISPUTES' | 'REGISTRY'>('DISPATCH_BOARD');
  
  // Tugasan Board Filter State
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [driverFilter, setDriverFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Suntinging Trip Rate State
  const [editingTripId, setSuntingingTripId] = useState<string | null>(null);
  const [editPaymentAmount, setSuntingPaymentAmount] = useState<number>(0);
  const [editPaymentDriver, setSuntingPaymentDriver] = useState<number>(0);

  // Dispute Resolution Modal State
  const [resolvingTrip, setResolvingTrip] = useState<Trip | null>(null);
  const [resolvedPayoutAmount, setResolvedPayoutAmount] = useState<number>(0);

  // Baru Driver Form State
  const [newDriverName, setBaruDriverName] = useState('');
  const [newDriverPhone, setBaruDriverPhone] = useState('');
  const [newDriverPin, setBaruDriverPin] = useState('1234');
  const [newDriverVehicle, setBaruDriverVehicle] = useState('Executive Sedan');
  const [newDriverPlate, setBaruDriverPlate] = useState('CPT-0000');
  const [newDriverAdmin] = useState(false);
  const [isCreatingDriver, setIsCreatingDriver] = useState(false);

  // Bulk Actions State
  const [selectedTripIds, setSelectedTripIds] = useState<Set<string>>(new Set());
  const [bulkStatusOps, setBulkStatusOps] = useState<OperationalStatus | ''>('');

  // Calculate High Density KPI Metrics
  const activeTugasanesCount = trips.filter((t) => t.statusOps !== 'COMPLETED' && t.statusOps !== 'CANCELLED').length;
  const onDutyDriversCount = drivers.filter((d) => d.isAvailable).length;
  const disputedTrips = trips.filter((t) => t.statusOps === 'DISPUTED');
  const totalGrossRevenue = trips
    .filter((t) => t.statusOps === 'COMPLETED')
    .reduce((sum, t) => sum + t.paymentAmount, 0);

  // Filtered Trips List
  const filteredTrips = trips.filter((t) => {
    if (statusFilter !== 'ALL' && t.statusOps !== statusFilter) return false;
    if (driverFilter !== 'ALL' && t.assignedDriverId !== driverFilter) return false;
    if (dateFilter && t.pickupDate !== dateFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchPass = t.passengerName.toLowerCase().includes(q);
      const matchRoute = `${t.pickupAddress} ${t.dropoffAddress}`.toLowerCase().includes(q);
      if (!matchId && !matchPass && !matchRoute) return false;
    }
    return true;
  });

  const handleStartSuntingRates = (trip: Trip) => {
    setSuntingingTripId(trip.id);
    setSuntingPaymentAmount(trip.paymentAmount);
    setSuntingPaymentDriver(trip.paymentDriver);
  };

  const handleSimpanSuntingedRates = async (tripId: string) => {
    const grossFare = editPaymentAmount;
    const driverPayout = editPaymentDriver;
    const companyProfit = Math.round((grossFare - driverPayout) * 100) / 100;

    await onUpdateTrip(tripId, {
      paymentAmount: grossFare,
      paymentDriver: driverPayout,
      grossProfit: companyProfit
    });
    setSuntingingTripId(null);
  };

  const handleResolveDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingTrip) return;

    const grossFare = resolvingTrip.paymentAmount;
    const finalDriverPayout = resolvedPayoutAmount;
    const companyProfit = Math.round((grossFare - finalDriverPayout) * 100) / 100;

    await onUpdateTrip(resolvingTrip.id, {
      statusOps: 'COMPLETED',
      statusAdmin: 'DISPUTE_RESOLVED',
      paymentDriver: finalDriverPayout,
      grossProfit: companyProfit,
      disputeResolvedAmount: finalDriverPayout
    });
    setResolvingTrip(null);
  };

  const handleCreateBaruDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName || !newDriverPin) return;
    setIsCreatingDriver(true);
    try {
      await onCreateDriver({
        name: newDriverName,
        phone: newDriverPhone,
        pin: newDriverPin,
        vehicleModel: newDriverVehicle,
        licensePlate: newDriverPlate,
        adminRole: newDriverAdmin
      });
      setBaruDriverName('');
      setBaruDriverPhone('');
      setBaruDriverPin('1234');
    } finally {
      setIsCreatingDriver(false);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* High Density Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Active Tugasanes */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Active Tugasanes</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{activeTugasanesCount}</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">↑ Live</span>
          </div>
        </div>

        {/* Card 2: Drivers On-Duty */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Drivers On-Duty</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{onDutyDriversCount} <span className="text-xs font-normal text-slate-400">/ {drivers.length}</span></span>
            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
              {drivers.length > 0 ? Math.round((onDutyDriversCount / drivers.length) * 100) : 0}% Active
            </span>
          </div>
        </div>

        {/* Card 3: Pending Disputes */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Rate Disputes</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-2xl font-bold ${disputedTrips.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {disputedTrips.length < 10 ? `0${disputedTrips.length}` : disputedTrips.length}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${disputedTrips.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
              {disputedTrips.length > 0 ? 'Action Needed' : 'Settled'}
            </span>
          </div>
        </div>

        {/* Card 4: Settled Gross Revenue */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Settled Gross</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono">${totalGrossRevenue.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
        </div>

      </div>

      {/* Admin Navigation Subtabs & Section Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Operations Command Panel</h3>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveAdminSubTab('DISPATCH_BOARD')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeAdminSubTab === 'DISPATCH_BOARD'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tugasan Board ({trips.length})
            </button>

            <button
              onClick={() => setActiveAdminSubTab('DISPUTES')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all relative ${
                activeAdminSubTab === 'DISPUTES'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Disputes</span>
              {disputedTrips.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                  {disputedTrips.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveAdminSubTab('REGISTRY')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeAdminSubTab === 'REGISTRY'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Drivers ({drivers.length})
            </button>
          </div>

        </div>
      </div>

      {/* DISPATCH BOARD SUBTAB */}
      {activeAdminSubTab === 'DISPATCH_BOARD' && (
        <div className="space-y-3">
          
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search dispatch ID, passenger, route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500 text-[10px] uppercase">Tarikh:</span>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-semibold"
                />
                {dateFilter && (
                  <button onClick={() => setDateFilter('')} className="text-slate-400 hover:text-rose-500 font-bold ml-1">✕</button>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500 text-[10px] uppercase">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-semibold"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="UNASSIGNED">Unassigned</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="EN_ROUTE">En Route</option>
                  <option value="ARRIVED">Arrived</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="DISPUTED">Disputed</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500 text-[10px] uppercase">Driver:</span>
                <select
                  value={driverFilter}
                  onChange={(e) => setDriverFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-semibold"
                >
                  <option value="ALL">Semua Pemandu</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

          </div>

          {/* Operational High Density Grid Table */}
          {selectedTripIds.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-blue-900">{selectedTripIds.size} Trip{selectedTripIds.size > 1 ? 's' : ''} Terpilih</span>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={bulkStatusOps}
                  onChange={(e) => setBulkStatusOps(e.target.value as OperationalStatus | '')}
                  className="bg-white border border-blue-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">-- Set Status --</option>
                  <option value="UNASSIGNED">Unassigned</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="EN_ROUTE">En Route</option>
                  <option value="ARRIVED">Arrived</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <button
                  onClick={async () => {
                    if (!bulkStatusOps) return;
                    for (const id of Array.from(selectedTripIds)) {
                      await onUpdateTrip(id, { statusOps: bulkStatusOps as OperationalStatus });
                    }
                    setSelectedTripIds(new Set());
                    setBulkStatusOps('');
                  }}
                  disabled={!bulkStatusOps}
                  className="bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                >
                  Kemas Kini Status Pukal
                </button>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-2.5 px-4 w-10">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={filteredTrips.length > 0 && selectedTripIds.size === filteredTrips.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTripIds(new Set(filteredTrips.map(t => t.id)));
                            } else {
                              setSelectedTripIds(new Set());
                            }
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                    </th>
                    <th className="py-2.5 px-4">Request ID & Rider</th>
                    <th className="py-2.5 px-4">Pickup / Destination</th>
                    <th className="py-2.5 px-4">Driver Allocation</th>
                    <th className="py-2.5 px-4">Status Override</th>
                    <th className="py-2.5 px-4">Gross Fare</th>
                    <th className="py-2.5 px-4">Driver Payout</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredTrips.map((trip) => {
                    const isSuntinging = editingTripId === trip.id;

                    return (
                      <tr key={trip.id} className="hover:bg-blue-50/60 transition-colors">
                        
                        {/* Bulk Select Checkbox */}
                        <td className="py-2.5 px-4">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedTripIds.has(trip.id)}
                              onChange={(e) => {
                                const newSet = new Set(selectedTripIds);
                                if (e.target.checked) newSet.add(trip.id);
                                else newSet.delete(trip.id);
                                setSelectedTripIds(newSet);
                              }}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </div>
                        </td>

                        {/* Request ID & Rider */}
                        <td className="py-2.5 px-4">
                          <div className="font-mono font-bold text-slate-900">{trip.id}</div>
                          <div className="text-slate-800 font-medium">{trip.passengerName}</div>
                          <div className="text-[10px] text-slate-400">{trip.passengerPhone}</div>
                        </td>

                        {/* Route */}
                        <td className="py-2.5 px-4 max-w-xs">
                          <div className="text-slate-800 font-medium truncate">{trip.pickupAddress}</div>
                          <div className="text-slate-400 text-[10px] font-bold">➔ {trip.dropoffAddress}</div>
                        </td>

                        {/* Driver Re-assignment */}
                        <td className="py-2.5 px-4">
                          <select
                            value={trip.assignedDriverId || ''}
                            onChange={(e) => {
                              const newDriverId = e.target.value;
                              const matched = drivers.find((d) => d.id === newDriverId);
                              onUpdateTrip(trip.id, {
                                assignedDriverId: newDriverId || undefined,
                                assignedDriverName: matched ? matched.name : undefined,
                                statusOps: newDriverId && trip.statusOps === 'UNASSIGNED' ? 'ASSIGNED' : trip.statusOps
                              });
                            }}
                            className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-900 font-medium"
                          >
                            <option value="">-- Unassigned --</option>
                            {drivers.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name} {d.isAvailable ? '(On)' : '(Off)'}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Operational Status Override */}
                        <td className="py-2.5 px-4">
                          <StatusBadge statusOps={trip.statusOps} size="sm" />
                        </td>

                        {/* Gross Fare */}
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                          {isSuntinging ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editPaymentAmount}
                              onChange={(e) => setSuntingPaymentAmount(Number(e.target.value))}
                              className="w-16 bg-white border border-blue-500 rounded p-0.5 text-xs font-bold"
                            />
                          ) : (
                            `$${trip.paymentAmount.toFixed(2)}`
                          )}
                        </td>

                        {/* Driver Payout */}
                        <td className="py-2.5 px-4 font-mono font-bold text-emerald-600">
                          {isSuntinging ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editPaymentDriver}
                              onChange={(e) => setSuntingPaymentDriver(Number(e.target.value))}
                              className="w-16 bg-white border border-blue-500 rounded p-0.5 text-xs font-bold"
                            />
                          ) : (
                            `$${trip.paymentDriver.toFixed(2)}`
                          )}
                        </td>

                        {/* Manage Actions */}
                        <td className="py-2.5 px-4 text-right space-x-1">
                          {isSuntinging ? (
                            <button
                              onClick={() => handleSimpanSuntingedRates(trip.id)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded font-bold text-[10px]"
                            >
                              Simpan
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartSuntingRates(trip)}
                              title="Sunting Fare Rates"
                              className="p-1 text-slate-400 hover:text-blue-600 rounded"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => onPadamTrip(trip.id)}
                            title="Padam Tugasan"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* DISPUTES PORTAL SUBTAB */}
      {activeAdminSubTab === 'DISPUTES' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Driver Payment Disputes Portal</h3>
            <p className="text-xs text-slate-500">Review driver rate discrepancy claims and authorize adjusted payouts</p>
          </div>

          {disputedTrips.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <Check className="w-8 h-8 text-emerald-500 mx-auto" />
              <p>No active rate disputes flagged right now. All driver payouts are settled!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {disputedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-sm">{trip.id}</span>
                      <span className="text-xs text-slate-600 block font-semibold">
                        Driver: {trip.assignedDriverName} ({trip.assignedDriverId})
                      </span>
                    </div>
                    <StatusBadge statusOps="DISPUTED" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-400 block font-semibold">Route</span>
                      <span className="text-slate-800 font-medium">{trip.pickupAddress} → {trip.dropoffAddress}</span>
                      <span className="text-slate-400 block font-semibold mt-2">Standard System Payout</span>
                      <span className="font-bold text-slate-800">${trip.paymentDriver.toFixed(2)}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold">Driver Calculated Claim</span>
                      <span className="font-extrabold text-rose-600 text-sm">
                        ${(trip.driverCalculatedAmount || 0).toFixed(2)}
                      </span>
                      <span className="text-slate-400 block font-semibold mt-2">Driver Explanation</span>
                      <p className="text-slate-700 italic">{trip.driverDisputeReason || 'No details provided.'}</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        setResolvingTrip(trip);
                        setResolvedPayoutAmount(trip.driverCalculatedAmount || trip.paymentDriver);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
                    >
                      Resolve Dispute & Adjust Payout
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* DRIVER REGISTRY SUBTAB */}
      {activeAdminSubTab === 'REGISTRY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Driver List */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Consolidated Driver Registry</h3>

            <div className="space-y-2">
              {drivers.map((d) => (
                <div
                  key={d.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{d.name}</span>
                      {d.adminRole && (
                        <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-[10px] mt-0.5">
                      {d.id} • {d.phone} • {d.vehicleModel} ({d.licensePlate})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-blue-700 font-bold text-[10px]">
                      PIN: {d.pin}
                    </span>

                    <button
                      type="button"
                      onClick={() => onUpdateDriver(d.id, { isAvailable: !d.isAvailable })}
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        d.isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {d.isAvailable ? 'ON-DUTY' : 'OFF'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Baru Driver Form */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-500" />
                Register Baru Chauffeur
              </h3>
            </div>

            <form onSubmit={handleCreateBaruDriver} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Driver Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Victor Lawson"
                  value={newDriverName}
                  onChange={(e) => setBaruDriverName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-1122"
                    value={newDriverPhone}
                    onChange={(e) => setBaruDriverPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">PIN *</label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    value={newDriverPin}
                    onChange={(e) => setBaruDriverPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-900 text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle</label>
                  <input
                    type="text"
                    placeholder="Executive Sedan"
                    value={newDriverVehicle}
                    onChange={(e) => setBaruDriverVehicle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plate</label>
                  <input
                    type="text"
                    placeholder="CPT-8800"
                    value={newDriverPlate}
                    onChange={(e) => setBaruDriverPlate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingDriver}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg uppercase tracking-wider text-xs transition-all shadow-sm"
              >
                {isCreatingDriver ? 'Adding...' : 'Register Driver'}
              </button>
            </form>

          </div>

        </div>
      )}

      {/* Resolve Dispute Modal */}
      {resolvingTrip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            
            <h3 className="font-extrabold text-base text-slate-900">
              Authorize Dispute Resolution Payout
            </h3>

            <p className="text-xs text-slate-500">
              Trip <span className="font-mono font-bold text-slate-900">{resolvingTrip.id}</span> • Standard: ${resolvingTrip.paymentDriver.toFixed(2)} • Driver Claim: ${resolvingTrip.driverCalculatedAmount?.toFixed(2)}
            </p>

            <form onSubmit={handleResolveDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Final Authorized Driver Payout ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={resolvedPayoutAmount}
                  onChange={(e) => setResolvedPayoutAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setResolvingTrip(null)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Settle Dispute
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
