import React from 'react';
import { Truck, Car, ShieldCheck, FileSpreadsheet, Bot, UserCheck } from 'lucide-react';
import { Driver, GasConfig } from '../types';

interface HeaderProps {
  activeTab: 'PASSENGER' | 'DRIVER' | 'ADMIN';
  setActiveTab: (tab: 'PASSENGER' | 'DRIVER' | 'ADMIN') => void;
  activeDriver: Driver | null;
  onLogoutDriver: () => void;
  gasConfig: GasConfig;
  
  onOpenAiModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeDriver,
  onLogoutDriver,
  gasConfig,
  
  onOpenAiModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-inner font-bold text-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">CITY DISPATCH</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full">
                  v2.6 SYSTEM
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Fleet Dispatch & Monthly Financial Accounting</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('PASSENGER')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${activeTab === 'PASSENGER' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-inner shadow-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 border border-transparent'}`}
            >
              Passenger Mode
            </button>
            <button
              onClick={() => setActiveTab('DRIVER')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${activeTab === 'DRIVER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-inner shadow-emerald-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 border border-transparent'}`}
            >
              <Car className="w-4 h-4 hidden sm:block" />
              Driver Console
            </button>
            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${activeTab === 'ADMIN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-inner shadow-amber-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 border border-transparent'}`}
            >
              <ShieldCheck className="w-4 h-4 hidden sm:block" />
              Admin Dispatch
            </button>
          </nav>

          <div className="flex items-center gap-2">
            {/* Active Driver Profile indicator */}
            {activeDriver && (
              <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-700">
                <div className="text-right text-xs">
                  <div className="font-semibold text-white flex items-center justify-end gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {activeDriver.name}
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    {activeDriver.isAvailable ? 'ON DUTY' : 'OFF DUTY'} • PIN:{activeDriver.pin}
                  </div>
                </div>
                <button
                  onClick={onLogoutDriver}
                  className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                >
                  Exit
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
