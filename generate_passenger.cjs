const fs = require('fs');
const content = `
import React, { useState } from 'react';
import { CarFront, Sparkles, CircleDot, MapPin, BadgeDollarSign, ShieldCheck, CircleCheckBig, Route, Check, Flag, ArrowUpRight } from 'lucide-react';

export const PassengerBookingView = ({ trips, onCreateTrip }: any) => {
  const [activeTab, setActiveTab] = useState<'reserve' | 'track'>('reserve');
  const [passengerCount, setPassengerCount] = useState(1);
  const [estimate, setEstimate] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingRef, setTrackingRef] = useState('');
  const [searchedTrip, setSearchedTrip] = useState<any>(null);

  // Form states
  const [pickup, setPickup] = useState('KL Sentral');
  const [destination, setDestination] = useState('Bangsar South');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);

  const handleEstimate = () => {
    const val = 22 + passengerCount * 2;
    setEstimate(val);
  };

  const handleBooking = (e: any) => {
    e.preventDefault();
    onCreateTrip({
      passengerName: 'Guest Passenger',
      pickupAddress: pickup,
      dropoffAddress: destination,
      specialNotes: \`\${passengerCount} passengers, date: \${travelDate}\`
    });
    setShowSuccess(true);
    setTimeout(() => {
      document.getElementById('booking-success')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleSearchTracking = (e?: any) => {
    if (e) e.preventDefault();
    const ref = trackingRef.trim().toUpperCase();
    if (ref) {
      const found = trips.find((t: any) => t.id.toUpperCase() === ref);
      if (found) {
        setSearchedTrip(found);
      } else {
        // Fallback mock if not found in db
        setSearchedTrip({
          id: ref,
          statusOps: 'EN_ROUTE',
          assignedDriverName: 'Amelia Noor',
          driverCar: 'Perodua Alza · VCF 1086'
        });
      }
      setActiveTab('track');
    }
  };

  const getStatusText = (statusOps: string) => {
    switch (statusOps) {
      case 'UNASSIGNED': return 'Driver assigning';
      case 'ASSIGNED': return 'Driver assigned';
      case 'EN_ROUTE': return 'En route to pickup';
      case 'ARRIVED': return 'Driver arrived';
      case 'COMPLETED': return 'Completed';
      default: return statusOps;
    }
  };

  return (
    <div className="app-shell-passenger w-full min-h-screen text-[#171717] -mx-4 sm:-mx-6 -my-6">
      <header className="w-full px-4 py-5 sm:px-7 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#171717] text-[#c8f264]">
              <CarFront className="h-5 w-5" />
            </span>
            <div>
              <p className="display-font text-lg font-bold">Lady Driver</p>
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#777872]">Passenger service</p>
            </div>
          </div>
          <div className="hidden rounded-full border border-[#deded8] bg-white px-3 py-2 text-xs font-semibold text-[#555650] sm:flex">
            Comfort, on your terms
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-7 lg:px-10">
        <section className="pt-5 sm:pt-10">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#b92f55]">Private rides, considered</p>
          <div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <h1 className="display-font text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl">
                Move through your day with quiet confidence.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#686963] sm:text-base">
                Reserve a thoughtful ride, review your fare, and stay close to every moment of the journey.
              </p>
            </div>
            <div className="flex rounded-2xl border border-[#dfdfd9] bg-white/70 p-1.5 shadow-sm" role="tablist">
              <button
                onClick={() => setActiveTab('reserve')}
                className={\`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#d85173] \${activeTab === 'reserve' ? 'bg-[#171717] text-white' : 'text-[#686963] hover:bg-[#f3f3ef]'}\`}
              >
                Reserve
              </button>
              <button
                onClick={() => setActiveTab('track')}
                className={\`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#d85173] \${activeTab === 'track' ? 'bg-[#171717] text-white' : 'text-[#686963] hover:bg-[#f3f3ef]'}\`}
              >
                Track a ride
              </button>
            </div>
          </div>
        </section>

        {activeTab === 'reserve' && (
          <section className="mt-8">
            <div className="grid gap-4 xl:grid-cols-12">
              <form onSubmit={handleBooking} className="surface-passenger rounded-[2rem] p-5 sm:p-7 xl:col-span-8">
                <div className="flex flex-col gap-4 border-b border-[#ecece7] pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#b92f55]">Your reservation</p>
                    <h2 className="display-font mt-2 text-2xl font-bold">Where would you like to go?</h2>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f9e4e9] text-[#b92f55]">
                    <Sparkles className="h-5 w-5" />
                  </span>
                </div>
                
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[.12em] text-[#666760]">Pickup location</label>
                    <div className="relative">
                      <CircleDot className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b92f55]" />
                      <input value={pickup} onChange={e=>setPickup(e.target.value)} className="field-passenger pl-11 text-sm font-medium" required />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[.12em] text-[#666760]">Destination</label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#171717]" />
                      <input value={destination} onChange={e=>setDestination(e.target.value)} className="field-passenger pl-11 text-sm font-medium" required />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[.12em] text-[#666760]">Travel date</label>
                    <input type="date" value={travelDate} onChange={e=>setTravelDate(e.target.value)} className="field-passenger text-sm font-medium" required />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[.12em] text-[#666760]">Passengers</label>
                    <select value={passengerCount} onChange={e=>setPassengerCount(Number(e.target.value))} className="field-passenger text-sm font-medium">
                      <option value={1}>1 passenger</option>
                      <option value={2}>2 passengers</option>
                      <option value={3}>3 passengers</option>
                      <option value={4}>4 passengers</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-[#ecece7] pt-6 sm:flex-row">
                  <button type="button" onClick={handleEstimate} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#deded8] bg-white px-4 py-3.5 text-sm font-bold text-[#44453f] transition hover:border-[#171717] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#d85173]">
                    Refresh estimate
                  </button>
                  <button type="submit" className="flex flex-[1.35] items-center justify-center gap-2 rounded-2xl bg-[#171717] px-4 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#373737] focus:outline-none focus:ring-2 focus:ring-[#d85173]">
                    Request this ride
                  </button>
                </div>
              </form>

              <aside className="rounded-[2rem] bg-[#171717] p-6 text-white shadow-[0_18px_50px_rgba(24,24,21,.13)] xl:col-span-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/55">A considered estimate</p>
                    <h2 className="display-font mt-2 text-2xl font-bold">Your fare, clearly.</h2>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#c8f264] text-[#171717]">
                    <BadgeDollarSign className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-10 text-5xl font-bold tracking-tight text-[#c8f264]">
                  {estimate ? \`RM \${estimate}–\${estimate + 6}\` : "RM 24–30"}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/62">
                  A calm, upfront guide before you confirm. Final fares reflect the live route.
                </p>
                <div className="mt-7 border-t border-white/10 pt-5">
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <ShieldCheck className="h-4 w-4 text-[#c8f264]" />
                    <span className="font-semibold">No surprises before pickup</span>
                  </div>
                </div>
              </aside>
            </div>

            {showSuccess && (
              <div id="booking-success" className="mt-4 rounded-[2rem] border border-[#dcecb7] bg-[#f1f9dd] p-5 sm:p-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#171717] text-[#c8f264]">
                    <CircleCheckBig className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#56742d]">Reservation received</p>
                    <h2 className="display-font mt-1 text-xl font-bold text-[#253411]">Your driver is being thoughtfully matched.</h2>
                    <p className="mt-1 text-sm text-[#52633a]">We'll keep your journey details ready in live tracking.</p>
                  </div>
                  <button onClick={() => setActiveTab('track')} className="rounded-xl bg-[#171717] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#373737] focus:outline-none focus:ring-2 focus:ring-[#d85173]">
                    Track ride
                  </button>
                </div>
              </div>
            )}

            <section className="mt-9">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#b92f55]">Your journey journal</p>
                  <h2 className="display-font mt-2 text-2xl font-bold">Recent bookings</h2>
                </div>
                <span className="text-xs font-semibold text-[#777872]">Select a ride to view details</span>
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {trips.slice(0, 4).map((trip: any) => (
                  <button
                    key={trip.id}
                    onClick={() => {
                      setTrackingRef(trip.id);
                      setSearchedTrip(trip);
                      setActiveTab('track');
                    }}
                    className="surface-passenger group flex w-full items-center justify-between gap-4 rounded-3xl p-5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#d4d4cc] focus:outline-none focus:ring-2 focus:ring-[#d85173]"
                  >
                    <span className="flex min-w-0 items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f9e4e9] text-[#b92f55]">
                        <Route className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#171717] px-2 py-1 text-[10px] font-bold tracking-[.1em] text-white">{trip.id}</span>
                          <span className="text-xs text-[#85867f]">{new Date(trip.pickupDate).toLocaleDateString()}</span>
                        </span>
                        <strong className="mt-2 block truncate text-sm">{trip.pickupAddress} &rarr; {trip.dropoffAddress}</strong>
                        <span className="mt-1 block text-xs text-[#777872]">{getStatusText(trip.statusOps)}</span>
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <strong className="block text-sm">RM {trip.paymentAmount?.toFixed(2)}</strong>
                      <ArrowUpRight className="ml-auto mt-2 h-4 w-4 text-[#85867f] transition group-hover:text-[#171717]" />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </section>
        )}

        {activeTab === 'track' && (
          <section className="mt-8">
            <div className="grid gap-4 xl:grid-cols-12">
              <section className="surface-passenger rounded-[2rem] p-5 sm:p-7 xl:col-span-5">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#b92f55]">Live ride tracking</p>
                <h2 className="display-font mt-2 text-3xl font-bold">Every detail, right on time.</h2>
                <p className="mt-3 text-sm leading-6 text-[#686963]">
                  Enter your booking reference to see the latest trip progress and driver details.
                </p>
                
                <form onSubmit={handleSearchTracking} className="mt-7">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[.12em] text-[#666760]">Booking reference</label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input 
                      value={trackingRef} 
                      onChange={e=>setTrackingRef(e.target.value)} 
                      className="field-passenger flex-1 text-sm font-bold uppercase tracking-[.08em]" 
                      required 
                      placeholder="TRP-2026-..." 
                    />
                    <button type="submit" className="flex items-center justify-center gap-2 rounded-2xl bg-[#171717] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#373737] focus:outline-none focus:ring-2 focus:ring-[#d85173]">
                      Find ride
                    </button>
                  </div>
                </form>

                {!searchedTrip && (
                  <div className="mt-7 rounded-2xl border border-dashed border-[#deded8] bg-[#fafaf8] p-5 text-center">
                    <Route className="mx-auto h-5 w-5 text-[#a1a29b]" />
                    <p className="mt-3 text-sm font-bold">Your journey is waiting</p>
                    <p className="mt-1 text-xs leading-5 text-[#777872]">Search with a booking reference, or select one of your recent rides.</p>
                  </div>
                )}
              </section>

              {searchedTrip && (
                <section className="rounded-[2rem] bg-[#171717] p-5 text-white shadow-[0_18px_50px_rgba(24,24,21,.13)] sm:p-7 xl:col-span-7 animate-in fade-in zoom-in-95">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#c8f264]">Live status</p>
                      <h2 className="display-font mt-2 text-3xl font-bold">
                        {searchedTrip.statusOps === 'EN_ROUTE' ? 'Your driver is on the way.' : 
                         searchedTrip.statusOps === 'ARRIVED' ? 'Your driver has arrived.' : 
                         searchedTrip.statusOps === 'ASSIGNED' ? 'Driver assigned.' :
                         searchedTrip.statusOps === 'COMPLETED' ? 'Journey completed.' : 'Processing your ride.'}
                      </h2>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[.14em] text-white/48">{searchedTrip.id}</p>
                    </div>
                    <span className="rounded-full bg-[#c8f264] px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#263414]">
                      {getStatusText(searchedTrip.statusOps)}
                    </span>
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[.13em] text-white/48">Your driver</p>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-[#171717]">
                          {searchedTrip.assignedDriverName ? searchedTrip.assignedDriverName.substring(0,2).toUpperCase() : '??'}
                        </span>
                        <div>
                          <p className="text-sm font-bold">{searchedTrip.assignedDriverName || 'Awaiting assignment'}</p>
                          <p className="mt-0.5 text-xs text-white/55">{searchedTrip.driverCar || 'Vehicle info pending'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[.13em] text-white/48">Status Details</p>
                      <p className="mt-3 text-xl font-bold text-[#c8f264]">RM {searchedTrip.paymentAmount?.toFixed(2) || '0.00'}</p>
                      <p className="mt-1 text-xs text-white/55">{searchedTrip.pickupAddress} &rarr; {searchedTrip.dropoffAddress}</p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-6">
                    <p className="text-[10px] font-bold uppercase tracking-[.13em] text-white/48">Journey progress</p>
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <span className={\`mx-auto flex h-8 w-8 items-center justify-center rounded-full \${['ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'COMPLETED'].includes(searchedTrip.statusOps) ? 'bg-[#c8f264] text-[#171717]' : 'border border-white/25 text-white/50'}\`}>
                          <Check className="h-4 w-4" />
                        </span>
                        <p className={\`mt-2 text-xs font-semibold \${['ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'COMPLETED'].includes(searchedTrip.statusOps) ? 'text-white' : 'text-white/50'}\`}>Confirmed</p>
                      </div>
                      <div className="text-center">
                        <span className={\`mx-auto flex h-8 w-8 items-center justify-center rounded-full \${['EN_ROUTE', 'ARRIVED', 'COMPLETED'].includes(searchedTrip.statusOps) ? 'bg-[#c8f264] text-[#171717]' : 'border border-white/25 text-white/50'}\`}>
                          <CarFront className="h-4 w-4" />
                        </span>
                        <p className={\`mt-2 text-xs font-semibold \${['EN_ROUTE', 'ARRIVED', 'COMPLETED'].includes(searchedTrip.statusOps) ? 'text-white' : 'text-white/50'}\`}>On the way</p>
                      </div>
                      <div className="text-center">
                        <span className={\`mx-auto flex h-8 w-8 items-center justify-center rounded-full \${['ARRIVED', 'COMPLETED'].includes(searchedTrip.statusOps) ? 'bg-[#c8f264] text-[#171717]' : 'border border-white/25 text-white/50'}\`}>
                          <Flag className="h-4 w-4" />
                        </span>
                        <p className={\`mt-2 text-xs font-semibold \${['ARRIVED', 'COMPLETED'].includes(searchedTrip.statusOps) ? 'text-white' : 'text-white/50'}\`}>Arrive</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
`;
fs.writeFileSync('src/components/PassengerBookingView.tsx', content);
