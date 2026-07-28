import React, { useState, useEffect } from 'react';
import { Driver, Trip, ActivityItem, GasConfig } from './types';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ActivityStream } from './components/ActivityStream';
import { PassengerBookingView } from './components/PassengerBookingView';
import { DriverConsoleView } from './components/DriverConsoleView';
import { AdminDispatchView } from './components/AdminDispatchView';
import { MonthlyEarningsReportModal } from './components/MonthlyEarningsReportModal';
import { AppsScriptModal } from './components/AppsScriptModal';
import { AiDispatchModal } from './components/AiDispatchModal';
import { INITIAL_DRIVERS, INITIAL_TRIPS, INITIAL_ACTIVITY_LOGS, INITIAL_GAS_CONFIG } from './data/seedData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'PASSENGER' | 'DRIVER' | 'ADMIN'>('ADMIN');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Core Datasets State
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITY_LOGS);
  const [gasConfig, setGasConfig] = useState<GasConfig>(INITIAL_GAS_CONFIG);

  // Active Authenticated Driver State
  const [activeDriver, setActiveDriver] = useState<Driver | null>(null);

  // Modals Visibility State
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Fetch initial data from Express backend
  const refreshData = async () => {
    try {
      const [tripsRes, driversRes, actRes, gasRes] = await Promise.all([
        fetch('/api/trips').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/drivers').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/activity').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/gas-config').then((r) => (r.ok ? r.json() : null))
      ]);

      if (tripsRes) setTrips(tripsRes);
      if (driversRes) setDrivers(driversRes);
      if (actRes) setActivities(actRes);
      if (gasRes) setGasConfig(gasRes);
    } catch (err) {
      console.warn('Backend API connection warning, using local state fallback:', err);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000); // 10s background sync
    return () => clearInterval(interval);
  }, []);

  // Sync active driver status if drivers list changes
  useEffect(() => {
    if (activeDriver) {
      const matched = drivers.find((d) => d.id === activeDriver.id);
      if (matched) {
        setActiveDriver(matched);
      }
    }
  }, [drivers]);

  // Count disputed trips for top badges
  const disputedTripsCount = trips.filter((t) => t.statusOps === 'DISPUTED').length;

  // Passenger Handlers
  const handleCreateTrip = async (tripData: any) => {
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });
      if (res.ok) {
        const created = await res.json();
        setTrips((prev) => [created, ...prev]);
      } else {
        throw new Error('Server returned ' + res.status);
      }
    } catch (err) {
      // Fallback local create
      const newTrip: Trip = {
        id: `TRP-2026-${Math.floor(8800 + Math.random() * 1000)}`,
        passengerName: tripData.passengerName,
        passengerPhone: tripData.passengerPhone,
        passengerCount: tripData.passengerCount,
        pickupAddress: tripData.pickupAddress,
        dropoffAddress: tripData.dropoffAddress,
        pickupDate: tripData.pickupDate,
        pickupTime: tripData.pickupTime,
        isRoundTrip: tripData.isRoundTrip,
        vehicleType: tripData.vehicleType,
        estimatedDistanceKm: tripData.estimatedDistanceKm || 15,
        paymentAmount: tripData.paymentAmount || 50,
        paymentDriver: tripData.paymentDriver || 37.5,
        grossProfit: tripData.grossProfit || 12.5,
        statusOps: 'UNASSIGNED',
        statusAdmin: 'PENDING',
        specialNotes: tripData.specialNotes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTrips((prev) => [newTrip, ...prev]);
    }
  };

  // Dispatch / Trip Update Handlers
  const handleUpdateTrip = async (tripId: string, updates: Partial<Trip>) => {
    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
        refreshData();
      } else {
        throw new Error('Server update failed');
      }
    } catch (err) {
      setTrips((prev) =>
        prev.map((t) => (t.id === tripId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
      );
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    try {
      await fetch(`/api/trips/${tripId}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
  };

  // Driver Authentication & Operations
  const handleLoginPin = async (pin: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/drivers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      if (res.ok) {
        const driver = await res.json();
        setActiveDriver(driver);
        return true;
      }
    } catch (err) {
      console.warn('API login fallback:', err);
    }

    // Local fallback check
    const matched = drivers.find((d) => d.pin === pin);
    if (matched) {
      setActiveDriver(matched);
      return true;
    }
    return false;
  };

  const handleLogoutDriver = () => {
    setActiveDriver(null);
  };

  const handleToggleDuty = async (driverId: string, isAvailable: boolean) => {
    try {
      const res = await fetch(`/api/drivers/${driverId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable })
      });
      if (res.ok) {
        const updated = await res.json();
        setDrivers((prev) => prev.map((d) => (d.id === driverId ? updated : d)));
      }
    } catch (err) {
      setDrivers((prev) => prev.map((d) => (d.id === driverId ? { ...d, isAvailable } : d)));
    }
  };

  const handleCreateDriver = async (driverData: any) => {
    try {
      const res = await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driverData)
      });
      if (res.ok) {
        const newDriver = await res.json();
        setDrivers((prev) => [...prev, newDriver]);
      }
    } catch (err) {
      const localDriver: Driver = {
        id: `DRV-${100 + drivers.length + 1}`,
        name: driverData.name,
        phone: driverData.phone || '',
        pin: driverData.pin || '1234',
        isAvailable: true,
        vehicleModel: driverData.vehicleModel || 'Standard Sedan',
        licensePlate: driverData.licensePlate || 'CPT-1000',
        adminRole: Boolean(driverData.adminRole),
        totalCompletedJobs: 0,
        rating: 5.0
      };
      setDrivers((prev) => [...prev, localDriver]);
    }
  };

  const handleUpdateDriver = async (driverId: string, updates: Partial<Driver>) => {
    try {
      const res = await fetch(`/api/drivers/${driverId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setDrivers((prev) => prev.map((d) => (d.id === driverId ? updated : d)));
      }
    } catch (err) {
      setDrivers((prev) => prev.map((d) => (d.id === driverId ? { ...d, ...updates } : d)));
    }
  };

  // Google Apps Script Handlers
  const handleSaveGasConfig = async (webAppUrl: string, autoSyncOnComplete: boolean) => {
    try {
      const res = await fetch('/api/gas-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webAppUrl, autoSyncOnComplete })
      });
      if (res.ok) {
        const updated = await res.json();
        setGasConfig(updated);
      }
    } catch (err) {
      setGasConfig((prev) => ({ ...prev, webAppUrl, autoSyncOnComplete }));
    }
  };

  const handleTriggerManualGasSync = async () => {
    try {
      const res = await fetch('/api/sync-gas', { method: 'POST' });
      const data = await res.json();
      if (data) {
        setGasConfig(data.gasConfig || data);
      }
    } catch (err) {
      console.error('Manual sync error:', err);
    }
  };

  const handleImportGasData = async () => {
    try {
      const res = await fetch('/api/import-gas', { method: 'POST' });
      const result = await res.json();
      if (res.ok) {
        if (result.trips) setTrips(result.trips);
        if (result.drivers) setDrivers(result.drivers);
        if (result.gasConfig) setGasConfig(result.gasConfig);
      } else {
        if (result.gasConfig) setGasConfig(result.gasConfig);
      }
    } catch (err) {
      console.error('Import error:', err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden antialiased">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        disputedTripsCount={disputedTripsCount}
        activeDriver={activeDriver}
        onLogoutDriver={handleLogoutDriver}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenGasModal={() => setIsGasModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Compact Top Header Bar */}
        <TopHeader
          activeTab={activeTab}
          disputedTripsCount={disputedTripsCount}
          onOpenNewDispatch={() => setActiveTab('PASSENGER')}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenGasModal={() => setIsGasModalOpen(true)}
          onOpenAiModal={() => setIsAiModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Real-time Activity Ticker Stream */}
        <ActivityStream activities={activities} />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'PASSENGER' && (
            <PassengerBookingView trips={trips} onCreateTrip={handleCreateTrip} />
          )}

          {activeTab === 'DRIVER' && (
            <DriverConsoleView
              drivers={drivers}
              activeDriver={activeDriver}
              onLoginPin={handleLoginPin}
              onLogoutDriver={handleLogoutDriver}
              onToggleDuty={handleToggleDuty}
              trips={trips}
              onUpdateTripStatus={(tripId, statusOps, extraData) =>
                handleUpdateTrip(tripId, { statusOps: statusOps as any, ...extraData })
              }
            />
          )}

          {activeTab === 'ADMIN' && (
            <AdminDispatchView
              trips={trips}
              drivers={drivers}
              onUpdateTrip={handleUpdateTrip}
              onDeleteTrip={handleDeleteTrip}
              onCreateDriver={handleCreateDriver}
              onUpdateDriver={handleUpdateDriver}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onOpenGasModal={() => setIsGasModalOpen(true)}
              onOpenAiModal={() => setIsAiModalOpen(true)}
            />
          )}
        </main>

      </div>

      {/* Modals */}
      <MonthlyEarningsReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        drivers={drivers}
        trips={trips}
      />

      <AppsScriptModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        gasConfig={gasConfig}
        onSaveConfig={handleSaveGasConfig}
        onTriggerManualSync={handleTriggerManualGasSync}
        onImportData={handleImportGasData}
      />

      <AiDispatchModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        trips={trips}
        drivers={drivers}
      />

    </div>
  );
}
