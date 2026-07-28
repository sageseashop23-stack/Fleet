import React, { useState } from 'react';
import { VehicleServiceType } from '../types';
import { VEHICLE_SERVICE_CONFIG, calculateFare } from '../data/seedData';
import { Calculator, Car, Shield, Users, Zap, Check, ArrowRight } from 'lucide-react';

interface FareEstimatorCardProps {
  onApplyEstimate?: (estimate: {
    vehicleType: VehicleServiceType;
    distanceKm: number;
    isRoundTrip: boolean;
    passengerCount: number;
    grossFare: number;
    driverPayout: number;
    companyProfit: number;
  }) => void;
}

export const FareEstimatorCard: React.FC<FareEstimatorCardProps> = ({ onApplyEstimate }) => {
  const [vehicleType, setVehicleType] = useState<VehicleServiceType>('STANDARD_SEDAN');
  const [distanceKm, setDistanceKm] = useState<number>(20);
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
  const [passengerCount, setPassengerCount] = useState<number>(2);

  const fareResult = calculateFare(vehicleType, distanceKm, isRoundTrip, passengerCount);

  const handleApply = () => {
    if (onApplyEstimate) {
      onApplyEstimate({
        vehicleType,
        distanceKm,
        isRoundTrip,
        passengerCount, ...fareResult
      });
    }
  };

  const getVehicleIcon = (type: VehicleServiceType) => {
    switch (type) {
      case 'STANDARD_SEDAN':
        return <Car className="w-5 h-5 text-blue-500" />;
      case 'EXECUTIVE_SUV':
        return <Shield className="w-5 h-5 text-indigo-500" />;
      case 'LUXURY_VAN':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'ELECTRIC_FLEET':
        return <Zap className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5">
      
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-lg text-blue-600 dark:text-blue-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Instant Price Estimator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Calculate fare rates & driver revenue allocations</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
          2026 Fleet Matrix
        </span>
      </div>

      {/* Service Tier Selector Grid */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          1. Select Vehicle Tier
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(VEHICLE_SERVICE_CONFIG) as VehicleServiceType[]).map((type) => {
            const config = VEHICLE_SERVICE_CONFIG[type];
            const isSelected = vehicleType === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setVehicleType(type);
                  if (passengerCount > config.maxPassengers) {
                    setPassengerCount(config.maxPassengers);
                  }
                }}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 dark:border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm shrink-0 border border-slate-100 dark:border-slate-700">
                  {getVehicleIcon(type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">{config.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{config.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    <span>Base: ${config.baseFare.toFixed(2)}</span>
                    <span>•</span>
                    <span>${config.perKmRate.toFixed(2)}/km</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Distance Slider & Passenger Volume Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
        
        {/* Distance Range */}
        <div className="space-y-1.5 md:col-span-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              2. Trip Distance (km)
            </span>
            <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{distanceKm} km</span>
          </div>
          <input
            type="range"
            min="3"
            max="150"
            step="1"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>3 km (Local)</span>
            <span>75 km (Suburban)</span>
            <span>150 km (Inter-city)</span>
          </div>
        </div>

        {/* Passenger Count & Round trip */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              3. Passengers
            </label>
            <select
              value={passengerCount}
              onChange={(e) => setPassengerCount(Number(e.target.value))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: VEHICLE_SERVICE_CONFIG[vehicleType].maxPassengers }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Passenger' : 'Passengers'}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              checked={isRoundTrip}
              onChange={(e) => setIsRoundTrip(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
            />
            <span>Round Trip (15% Discount)</span>
          </label>
        </div>

      </div>

      {/* Fare Allocation Breakdown Result */}
      <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Gross Fare</span>
          <span className="text-2xl font-extrabold text-emerald-400">${fareResult.grossFare.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">Driver Earnings (75%)</span>
            <span className="font-bold text-white text-base">${fareResult.driverPayout.toFixed(2)}</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">Company Profit (25%)</span>
            <span className="font-bold text-blue-300 text-base">${fareResult.companyProfit.toFixed(2)}</span>
          </div>
        </div>

        {onApplyEstimate && (
          <button
            type="button"
            onClick={handleApply}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm"
          >
            <span>Apply to Booking Reservation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
