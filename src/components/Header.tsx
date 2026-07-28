import React from 'react';
import { Truck, Car, ShieldCheck, FileSpreadsheet, Bot, UserCheck } from 'lucide-react';
import { Driver, GasConfig } from '../types';

interface HeaderProps {
  activeTab: 'PASSENGER' | 'DRIVER' | 'ADMIN';
  setActiveTab: (tab: 'PASSENGER' | 'DRIVER' | 'ADMIN') => void;
  activeDriver: Driver | null;
  onLogoutDriver: () => void;
  gasConfig: GasConfig;
  onOpenGasModal: () => void;
  onOpenAiModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeDriver,
  onLogoutDriver,
  gasConfig,
  onOpenGasModal,
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'PASSENGER'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Passenger</span>
            </button>

            <button
              onClick={() => setActiveTab('DRIVER')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
                activeTab === 'DRIVER'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Driver Console</span>
              {activeDriver && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'ADMIN'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dispatch</span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiModal}
              title="AI Dispatch Optimization Assistant"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-300 border border-indigo-700/60 rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">AI Optimizer</span>
            </button>

            {/* Google Sheets Sync Indicator */}
            <button
              onClick={onOpenGasModal}
              title="Google Sheets Synchronization Setup"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                gasConfig.webAppUrl
                  ? gasConfig.syncStatus === 'ERROR'
                    ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">
                {gasConfig.webAppUrl ? (
                  gasConfig.syncStatus === 'SYNCING' ? 'Syncing...' : 'Sheets Synced'
                ) : (
                  'Google Sheets'
                )}
              </span>
            </button>

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
