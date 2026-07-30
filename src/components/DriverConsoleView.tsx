import React, { useState } from 'react';
import { Driver, Trip } from '../types';
import { StatusBadge } from './StatusBadge';
import { KeyRound, Power, CheckCircle, Navigation, AlertTriangle, DollarSign, Calendar, MapPin, Truck, RefreshCw, Database, Star, PauseCircle, PlayCircle } from 'lucide-react';

interface DriverConsoleViewProps {
  drivers: Driver[];
  activeDriver: Driver | null;
  onLoginPin: (pin: string) => Promise<boolean>;
  onLogoutDriver: () => void;
  onToggleDuty: (driverId: string, isAvailable: boolean) => Promise<void>;
  trips: Trip[];
  onUpdateTripStatus: (tripId: string, statusOps: string, extraData?: any) => Promise<void>;
  onImportGasData?: () => Promise<void>;
  onOpenGasModal?: () => void;
  isAutoRefreshEnabled?: boolean;
  onToggleAutoRefresh?: () => void;
}

export const DriverConsoleView: React.FC<DriverConsoleViewProps> = ({
  drivers,
  activeDriver,
  onLoginPin,
  onLogoutDriver,
  onToggleDuty,
  trips,
  onUpdateTripStatus,
  onImportGasData,
  onOpenGasModal,
  isAutoRefreshEnabled = true,
  onToggleAutoRefresh
}) => {
  const [inputPin, setInputPin] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Dispute Modal State
  const [disputeTrip, setDisputeTrip] = useState<Trip | null>(null);
  const [driverCalculatedAmount, setDriverCalculatedAmount] = useState<number>(0);
  const [driverDisputeReason, setDriverDisputeReason] = useState<string>('');
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  // Completion Rating Modal State
  const [ratingTrip, setRatingTrip] = useState<Trip | null>(null);
  const [passengerRating, setPassengerRating] = useState<number>(5);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const handleConfirmCompletion = async () => {
    if (!ratingTrip) return;
    setIsSubmittingRating(true);
    try {
      await onUpdateTripStatus(ratingTrip.id, 'COMPLETED', {
        passengerRating
      });
      setRatingTrip(null);
    } catch (err: any) {
      alert('Error completing trip: ' + err.message);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const clean = inputPin.trim();
    if (!clean || clean.length < 4) {
      setLoginError('Enter a valid 4-digit security PIN.');
      return;
    }

    const ok = await onLoginPin(clean);
    if (!ok) {
      setLoginError('Invalid 4-digit PIN code. Check registered PINs below or click "Sync Drivers from Google Sheet".');
    } else {
      setInputPin('');
    }
  };

  const handleSyncGSheet = async () => {
    if (!onImportGasData) return;
    setIsSyncing(true);
    setSyncMessage(null);
    setLoginError(null);
    try {
      await onImportGasData();
      setSyncMessage('Successfully imported drivers & trips from Google Sheet!');
    } catch (err: any) {
      setLoginError('Failed to import from Google Sheet: ' + (err.message || 'Check Web App URL'));
    } finally {
      setIsSyncing(false);
    }
  };

  // If driver is NOT logged in, render PIN Authentication Console
  if (!activeDriver) {
    return (
      <div className="max-w-md mx-auto py-8 px-4 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md text-center space-y-6">
          
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
            <KeyRound className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Driver Operations Console</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your assigned 4-digit security PIN to access active job queue
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="• • • •"
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))}
                className="w-48 text-center text-3xl font-mono tracking-widest bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 focus:border-blue-500 rounded-xl py-3 text-slate-900 dark:text-white"
              />
            </div>

            {loginError && (
              <div className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 p-3 rounded-lg border border-rose-200 dark:border-rose-800 text-left space-y-2">
                <p>{loginError}</p>
                {onImportGasData && (
                  <button
                    type="button"
                    onClick={handleSyncGSheet}
                    disabled={isSyncing}
                    className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold py-1.5 px-3 rounded text-[11px] transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Sync Drivers from Google Sheet Now</span>
                  </button>
                )}
              </div>
            )}

            {syncMessage && (
              <p className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                {syncMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Authenticate & Open Console
            </button>
          </form>

          {/* Sync Button & Registered Drivers Preview */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">Registered Drivers ({drivers.length}):</span>
              {onImportGasData && (
                <button
                  type="button"
                  onClick={handleSyncGSheet}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Pull from Google Sheet</span>
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {drivers.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setInputPin(d.pin)}
                  className="w-full flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg text-xs transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-left"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{d.name}</span>
                    <span className="text-[10px] text-slate-400">{d.vehicleModel || 'Fleet Driver'}</span>
                  </div>
                  <span className="font-mono font-bold bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    PIN: {d.pin}
                  </span>
                </button>
              ))}
            </div>

            {onOpenGasModal && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onOpenGasModal}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Configure Google Sheet Sync Settings</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // Driver Jobs assigned to this active driver
  const myTrips = trips.filter((t) => t.assignedDriverId === activeDriver.id);
  const activeJobs = myTrips.filter((t) => ['ASSIGNED', 'EN_ROUTE', 'ARRIVED'].includes(t.statusOps));
  const completedTrips = myTrips.filter((t) => t.statusOps === 'COMPLETED' || t.statusOps === 'DISPUTED');

  // Month Earnings calculation for active driver
  const totalCompletedEarnings = completedTrips.reduce((acc, t) => acc + (t.paymentDriver || 0), 0);
  const pendingActiveEarnings = activeJobs.reduce((acc, t) => acc + (t.paymentDriver || 0), 0);

  const handleOpenDisputeModal = (trip: Trip) => {
    setDisputeTrip(trip);
    setDriverCalculatedAmount(trip.paymentDriver || 0);
    setDriverDisputeReason('');
  };

  const handleConfirmDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeTrip) return;
    setIsSubmittingDispute(true);
    try {
      await onUpdateTripStatus(disputeTrip.id, 'DISPUTED', {
        driverCalculatedAmount,
        driverDisputeReason
      });
      setDisputeTrip(null);
    } catch (err: any) {
      alert('Error submitting dispute: ' + err.message);
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Driver Operational Status Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{activeDriver.name}</h2>
                {activeDriver.adminRole && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 rounded text-[10px] font-bold border border-purple-300">
                    DISPATCH ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeDriver.vehicleModel} • {activeDriver.licensePlate} • Rating: {activeDriver.rating}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Battery Save Toggle */}
            {onToggleAutoRefresh && (
              <button
                type="button"
                onClick={onToggleAutoRefresh}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isAutoRefreshEnabled
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                }`}
                title={isAutoRefreshEnabled ? 'Pause auto-refresh to save battery' : 'Resume auto-refresh'}
              >
                {isAutoRefreshEnabled ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                <span className="hidden sm:inline">{isAutoRefreshEnabled ? 'Pause Sync' : 'Sync Paused'}</span>
              </button>
            )}

            {/* Duty Status Toggle */}
            <button
              type="button"
              onClick={() => onToggleDuty(activeDriver.id, !activeDriver.isAvailable)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                activeDriver.isAvailable
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>DUTY STATUS: {activeDriver.isAvailable ? 'AVAILABLE (ON-DUTY)' : 'OFF DUTY'}</span>
            </button>

            <button
              onClick={onLogoutDriver}
              className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700"
            >
              Sign Out
            </button>
          </div>

        </div>
      </div>

      {/* Driver Earnings & Dispatch Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed Payouts</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${totalCompletedEarnings.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">In-Flight Queue</span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{activeJobs.length} Jobs</span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
            <Navigation className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending Active Payouts</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">${pendingActiveEarnings.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Active Jobs Execution Workflow Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Dispatch Execution</h3>
            <p className="text-xs text-slate-500">Advance assigned trips through operational milestones</p>
          </div>
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold rounded-full">
            {activeJobs.length} Active
          </span>
        </div>

        {activeJobs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs space-y-2">
            <CheckCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No active jobs assigned to you right now. Stand by for dispatcher assignment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeJobs.map((trip) => (
              <div
                key={trip.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{trip.id}</span>
                    <span className="text-xs text-slate-500 block">{trip.passengerName} ({trip.passengerCount} Passengers)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      Payout: ${trip.paymentDriver.toFixed(2)}
                    </span>
                    <StatusBadge statusOps={trip.statusOps} />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-400 text-[10px] uppercase block">Pickup</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{trip.pickupAddress}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-400 text-[10px] uppercase block">Dropoff</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{trip.dropoffAddress}</span>
                    </div>
                  </div>
                  {trip.specialNotes && (
                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 italic">
                      Notes: {trip.specialNotes}
                    </div>
                  )}
                </div>

                {/* Workflow Advancement Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {trip.statusOps === 'ASSIGNED' && (
                    <button
                      type="button"
                      onClick={() => onUpdateTripStatus(trip.id, 'EN_ROUTE')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Start EN ROUTE</span>
                    </button>
                  )}

                  {trip.statusOps === 'EN_ROUTE' && (
                    <button
                      type="button"
                      onClick={() => onUpdateTripStatus(trip.id, 'ARRIVED')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Mark ARRIVED at Pickup</span>
                    </button>
                  )}

                  {trip.statusOps === 'ARRIVED' && (
                    <button
                      type="button"
                      onClick={() => { setRatingTrip(trip); setPassengerRating(5); }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete Trip Dispatch</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenDisputeModal(trip)}
                    className="px-3 py-2 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-xs font-bold rounded-lg transition-all ml-auto flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Flag Rate Dispute</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Completed Jobs History & Dispute Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Completed Job History</h3>
        
        {completedTrips.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No completed dispatches recorded for this driver yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 rounded-l-lg">Request ID</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Driver Payout</th>
                  <th className="p-3 text-right rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {completedTrips.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{t.id}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                      {t.pickupAddress} → {t.dropoffAddress}
                    </td>
                    <td className="p-3">
                      <StatusBadge statusOps={t.statusOps} size="sm" />
                    </td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                      ${t.paymentDriver.toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      {t.statusOps !== 'DISPUTED' ? (
                        <button
                          onClick={() => handleOpenDisputeModal(t)}
                          className="px-2.5 py-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded border border-rose-200 dark:border-rose-800"
                        >
                          Dispute Rate
                        </button>
                      ) : (
                        <span className="text-[11px] text-rose-500 font-bold italic">Dispute Flagged</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Flag Payment Dispute Modal */}
      {disputeTrip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Flag Payment Dispute</h3>
              </div>
              <button
                onClick={() => setDisputeTrip(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Trip <span className="font-mono font-bold text-slate-900 dark:text-white">{disputeTrip.id}</span> • Standard System Payout: <span className="font-bold text-emerald-600">${disputeTrip.paymentDriver.toFixed(2)}</span>
            </p>

            <form onSubmit={handleConfirmDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Driver Calculated Payout Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={driverCalculatedAmount}
                  onChange={(e) => setDriverCalculatedAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Rate Calculation Dispute *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Unscheduled waiting time at airport VIP dock, heavy luggage loading, or extra toll fees incurred"
                  value={driverDisputeReason}
                  onChange={(e) => setDriverDisputeReason(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDisputeTrip(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDispute}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  {isSubmittingDispute ? 'Submitting...' : 'Submit Rate Dispute'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Trip Completion & Passenger Rating Modal */}
      {ratingTrip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-xl text-center space-y-6">
            
            <div>
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-black text-xl text-slate-900 dark:text-white">Trip Completed!</h3>
              <p className="text-xs text-slate-500 mt-2">
                Please hand the device to <span className="font-bold text-slate-800 dark:text-slate-200">{ratingTrip.passengerName}</span> for a quick rating.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block">How was your ride?</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setPassengerRating(star)}
                    className="p-1 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star 
                      className={`w-10 h-10 ${
                        passengerRating >= star 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'fill-transparent text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-medium text-amber-600 dark:text-amber-500">
                {passengerRating} {passengerRating === 1 ? 'Star' : 'Stars'}
              </p>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRatingTrip(null)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCompletion}
                disabled={isSubmittingRating}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                {isSubmittingRating ? 'Saving...' : 'Submit & Complete'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
