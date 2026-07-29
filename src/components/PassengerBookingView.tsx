import React, { useState } from 'react';
import { Trip, VehicleServiceType } from '../types';
import { FareEstimatorCard } from './FareEstimatorCard';
import { StatusBadge } from './StatusBadge';
import { Calendar, Clock, MapPin, Phone, User, Car, Search, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface PassengerBookingViewProps {
  trips: Trip[];
  onCreateTrip: (tripData: any) => Promise<void>;
}

export const PassengerBookingView: React.FC<PassengerBookingViewProps> = ({ trips, onCreateTrip }) => {
  const [activeSubTab, setActiveSubTab] = useState<'RESERVATION' | 'TRACKING'>('RESERVATION');

  // Form State
  const [passengerName, setPenumpangName] = useState('');
  const [passengerPhone, setPenumpangPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupDate, setPickupDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [pickupTime, setPickupTime] = useState('14:30');
  const [passengerCount, setPenumpangCount] = useState(2);
  const [vehicleType, setVehicleType] = useState<VehicleServiceType>('STANDARD_SEDAN');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [estimatedDistanceKm, setEstimatedDistanceKm] = useState(18);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  // Tracking State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedTrip, setSearchedTrip] = useState<Trip | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleApplyEstimate = (est: any) => {
    setVehicleType(est.vehicleType);
    setEstimatedDistanceKm(est.distanceKm);
    setIsRoundTrip(est.isRoundTrip);
    setPenumpangCount(est.passengerCount);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerName || !passengerPhone || !pickupAddress || !dropoffAddress) {
      alert('Please fill in all mandatory passenger and address fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateTrip({
        passengerName,
        passengerPhone,
        pickupAddress,
        dropoffAddress,
        pickupDate,
        pickupTime,
        passengerCount,
        vehicleType,
        isRoundTrip,
        estimatedDistanceKm,
        specialNotes
      });
      setBookingSuccessId('TRP-2026-SUBMITTED');
      // Reset fields
      setPenumpangName('');
      setPenumpangPhone('');
      setPickupAddress('');
      setDropoffAddress('');
      setSpecialNotes('');
    } catch (err: any) {
      alert('Failed to submit reservation: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setSearchedTrip(null);

    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const found = trips.find(
      (t) =>
        t.id.toLowerCase() === q ||
        t.passengerPhone.toLowerCase().includes(q) ||
        t.passengerName.toLowerCase().includes(q)
    );

    if (found) {
      setSearchedTrip(found);
    } else {
      setSearchError(`No dispatch order found matching Request ID or Phone "${searchQuery}".`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* View Banner / Sub-tab Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Penumpang Booking & Live Dispatch
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Book luxury point-to-point transfers and track real-time trip execution
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveSubTab('RESERVATION')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'RESERVATION'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              New Reservation
            </button>
            <button
              onClick={() => setActiveSubTab('TRACKING')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'TRACKING'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Live Order Tracking
            </button>
          </div>
        </div>
      </div>

      {/* Reservation Subtab Content */}
      {activeSubTab === 'RESERVATION' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Booking Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {bookingSuccessId && (
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 p-4 rounded-xl flex items-start gap-3 text-emerald-800 dark:text-emerald-200 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Trip Reservation Received!</h4>
                  <p className="mt-1">
                    Your trip dispatch has been logged in the system and is pending driver assignment. You can track your dispatch status anytime using your phone number in the Live Order Tracking tab.
                  </p>
                  <button
                    onClick={() => setBookingSuccessId(null)}
                    className="mt-2 text-emerald-700 dark:text-emerald-300 font-bold underline"
                  >
                    Book Another Trip
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
              
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Penumpang Details</h3>
                <p className="text-xs text-slate-500">Provide rider name and mobile contact for driver notifications</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Penuh Penumpang *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jonathan Sterling"
                      value={passengerName}
                      onChange={(e) => setPenumpangName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 (555) 234-5678"
                      value={passengerPhone}
                      onChange={(e) => setPenumpangPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pb-3 border-b border-slate-100 dark:border-slate-800 pt-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Laluan & Schedule</h3>
                <p className="text-xs text-slate-500">Pickup, destination, date and timing</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pickup Location *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-blue-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Airport Terminal, Hotel, or Street Address"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Destinasi Menurunkan Penumpang *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-indigo-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Destination Address or Landmark"
                      value={dropoffAddress}
                      onChange={(e) => setDropoffAddress(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Pickup Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Waktu Pengambilan
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Special Instructions / Notes for Driver
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <textarea
                      rows={2}
                      placeholder="Flight number, baggage requirements, or gate preferences"
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Car className="w-5 h-5" />
                  <span>{isSubmitting ? 'Confirming Dispatch...' : 'Confirm Ride Dispatch Reservation'}</span>
                </button>
              </div>

            </form>

          </div>

          {/* Interactive Fare Calculator Side Panel */}
          <div className="lg:col-span-5 space-y-6">
            <FareEstimatorCard onApplyEstimate={handleApplyEstimate} />
          </div>

        </div>
      )}

      {/* Live Order Tracking Subtab */}
      {activeSubTab === 'TRACKING' && (
        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Jejaki Status Penghantaran Tugas</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Masukkan ID Permintaan Anda (e.g. TRP-2026-8801) or registered passenger phone number
            </p>

            <form onSubmit={handleSearchTracking} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Request ID or Phone Number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Cari Pesanan
              </button>
            </form>
          </div>

          {searchError && (
            <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 p-4 rounded-xl flex items-center gap-3 text-rose-800 dark:text-rose-200 text-xs">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {searchedTrip && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
              
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">ID Permintaan Tugas</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{searchedTrip.id}</h3>
                </div>
                <StatusBadge statusOps={searchedTrip.statusOps} />
              </div>

              {/* Progress Bar Visualizer */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                  <span>BELUM DITETAPKAN</span>
                  <span>DITETAPKAN</span>
                  <span>DALAM PERJALANAN</span>
                  <span>TIBA</span>
                  <span>SELESAI</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-600 transition-all duration-500 rounded-full"
                    style={{
                      width:
                        searchedTrip.statusOps === 'BELUM DITETAPKAN'
                          ? '15%'
                          : searchedTrip.statusOps === 'DITETAPKAN'
                          ? '40%'
                          : searchedTrip.statusOps === 'EN_ROUTE'
                          ? '65%'
                          : searchedTrip.statusOps === 'TIBA'
                          ? '85%'
                          : searchedTrip.statusOps === 'SELESAI'
                          ? '100%'
                          : '10%'
                    }}
                  ></div>
                </div>
              </div>

              {/* Dispatch Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 block font-semibold">Penumpang</span>
                    <span className="text-slate-900 dark:text-white font-bold text-sm">{searchedTrip.passengerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Laluan</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {searchedTrip.pickupAddress} <span className="text-blue-500 font-bold">→</span> {searchedTrip.dropoffAddress}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Tarikh Jadual & Time</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {searchedTrip.pickupDate} at {searchedTrip.pickupTime}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 block font-semibold">Pemandu Bertugas</span>
                    <span className="text-slate-900 dark:text-white font-bold text-sm">
                      {searchedTrip.assignedDriverName || 'Awaiting Driver Allocation'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Sebutharga Tambang</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">
                      ${searchedTrip.paymentAmount.toFixed(2)}
                    </span>
                  </div>
                  {searchedTrip.specialNotes && (
                    <div>
                      <span className="text-slate-400 block font-semibold">Special Instructions</span>
                      <span className="text-slate-600 dark:text-slate-300 italic">{searchedTrip.specialNotes}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Recent Penumpang Bookings List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Tugasan Sistem Terkini</h3>
            <div className="space-y-3">
              {trips.slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setSearchedTrip(t);
                    setSearchError(null);
                  }}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-all border border-slate-200/60 dark:border-slate-700/60"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{t.id}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">• {t.passengerName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md mt-0.5">
                      {t.pickupAddress} → {t.dropoffAddress}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">${t.paymentAmount.toFixed(2)}</span>
                    <StatusBadge statusOps={t.statusOps} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
