import React from 'react';
import { Truck, Car, ShieldCheck, FileText, AlertTriangle, Bot, FileSpreadsheet, Power } from 'lucide-react';
import { Driver, Trip } from '../types';

interface SidebarProps {
  activeTab: 'PASSENGER' | 'DRIVER' | 'ADMIN';
  setActiveTab: (tab: 'PASSENGER' | 'DRIVER' | 'ADMIN') => void;
  disputedTripsCount: number;
  activeDriver: Driver | null;
  onLogoutDriver: () => void;
  onOpenReportModal: () => void;
  onOpenGasModal: () => void;
  onOpenAiModal: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  disputedTripsCount,
  activeDriver,
  onLogoutDriver,
  onOpenReportModal,
  onOpenGasModal,
  onOpenAiModal,
  isMobileOpen,
  setIsMobileOpen
}) => {
  return (
    <aside className={`w-56 bg-slate-900 flex flex-col border-r border-slate-800 text-slate-300 shrink-0 select-none ${
      isMobileOpen ? 'fixed inset-y-0 left-0 z-50 flex' : 'hidden md:flex'
    }`}>
      
      {/* Brand & Logo Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <div className="w-4 h-4 border-2 border-white transform rotate-45"></div>
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tight text-base leading-tight">CITY DISPATCH</h1>
            <span className="text-[10px] text-slate-500 font-medium">Logistics Console</span>
          </div>
        </div>
        
        {setIsMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto text-xs">
        
        <div>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-2 mb-2">
            Dispatch Console
          </div>
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('ADMIN');
                setIsMobileOpen?.(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'ADMIN'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
              <span>Fleet Operations</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('DRIVER');
                setIsMobileOpen?.(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'DRIVER'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>Driver Console</span>
              {activeDriver && (
                <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('PASSENGER');
                setIsMobileOpen?.(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'PASSENGER'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Passenger Portal</span>
            </button>
          </div>
        </div>

        <div>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-2 mb-2">
            Financials & Tools
          </div>
          <div className="space-y-1">
            <button
              onClick={() => {
                onOpenReportModal();
                setIsMobileOpen?.(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md font-medium transition-colors"
            >
              <FileText className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Earnings Reports</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('ADMIN');
                setIsMobileOpen?.(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md font-medium transition-colors"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Dispute Center</span>
              {disputedTripsCount > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {disputedTripsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                onOpenGasModal();
                setIsMobileOpen?.(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md font-medium transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 shrink-0 text-teal-400" />
              <span>Google Sheets Sync</span>
            </button>

            <button
              onClick={() => {
                onOpenAiModal();
                setIsMobileOpen?.(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md font-medium transition-colors"
            >
              <Bot className="w-4 h-4 shrink-0 text-purple-400" />
              <span>AI Route Optimizer</span>
            </button>
          </div>
        </div>

      </nav>

      {/* Sidebar Footer User / System Badge */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        {activeDriver ? (
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs text-white font-medium truncate">{activeDriver.name}</p>
              <p className="text-[10px] text-emerald-400 font-mono">PIN: {activeDriver.pin} • ON-DUTY</p>
            </div>
            <button
              onClick={onLogoutDriver}
              title="Sign Out Driver"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
            >
              <Power className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-blue-400">
              CD
            </div>
            <div>
              <p className="text-xs text-white font-medium">Admin Dispatch</p>
              <p className="text-[10px] text-slate-500 font-mono">v2.6.0-STABLE</p>
            </div>
          </div>
        )}
      </div>

    </aside>
  );
};
