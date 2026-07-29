import React from 'react';
import { Truck, Car, ShieldCheck, FileText, AlertTriangle, Bot, FileSpreadsheet } from 'lucide-react';
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
    <aside className={`w-56 bg-primary flex flex-col border-r border-primary/20 text-white/70 shrink-0 select-none ${
      isMobileOpen ? 'fixed inset-y-0 left-0 z-50 flex' : 'hidden md:flex'
    }`}>
      
      {/* Brand & Logo Header */}
      <div className="p-5 flex items-center justify-between border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md">
            <div className="w-4 h-4 border-2 border-white transform rotate-45"></div>
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tight text-base leading-tight">CITY DISPATCH</h1>
            <span className="text-[10px] text-white/70 font-medium">Konsol Logistik</span>
          </div>
        </div>
        
        {setIsMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-white/50 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto text-xs">
        
        <div>
          <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest px-2 mb-2">
            Pusat Kawalan
          </div>
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('ADMIN');
                setIsMobileOpen?.(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl font-medium transition-colors ${
                activeTab === 'ADMIN'
                  ? 'bg-secondary text-primary font-bold shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 shrink-0 `} />
              <span>Operasi Armada</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('DRIVER');
                setIsMobileOpen?.(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl font-medium transition-colors ${
                activeTab === 'DRIVER'
                  ? 'bg-secondary text-primary font-bold shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Truck className={`w-4 h-4 shrink-0 `} />
              <span>Konsol Pemandu</span>
              {activeDriver && (
                <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('PASSENGER');
                setIsMobileOpen?.(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl font-medium transition-colors ${
                activeTab === 'PASSENGER'
                  ? 'bg-secondary text-primary font-bold shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Car className={`w-4 h-4 shrink-0 `} />
              <span>Portal Penumpang</span>
            </button>
          </div>
        </div>

        <div>
          <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest px-2 mb-2">
            Kewangan & Alatan
          </div>
          <div className="space-y-1">
            <button
              onClick={() => {
                onOpenReportModal();
                setIsMobileOpen?.(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white rounded-2xl font-medium transition-colors"
            >
              <FileText className="w-4 h-4 shrink-0 " />
              <span>Laporan Pendapatan</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('ADMIN');
                setIsMobileOpen?.(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white rounded-2xl font-medium transition-colors"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 " />
              <span>Pusat Pertikaian</span>
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
              className="w-full flex items-center gap-2.5 px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white rounded-2xl font-medium transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 shrink-0 " />
              <span>Penyegerakan Google Sheets</span>
            </button>

            <button
              onClick={() => {
                onOpenAiModal();
                setIsMobileOpen?.(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white rounded-2xl font-medium transition-colors"
            >
              <Bot className="w-4 h-4 shrink-0 " />
              <span>Pengoptimum Laluan AI</span>
            </button>
          </div>
        </div>

      </nav>

      {/* Sidebar Footer User / System Badge */}
      <div className="p-4 border-t border-primary/20 bg-black/10">
        {activeDriver ? (
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs text-white font-medium truncate">{activeDriver.name}</p>
              <p className="text-[10px] text-emerald-400 font-mono">PIN: {activeDriver.pin} • ON-DUTY</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-blue-400">
              CD
            </div>
            <div>
              <p className="text-xs text-white font-medium">Admin Dispatch</p>
              <p className="text-[10px] text-white/50 font-mono">v2.6.0-STABLE</p>
            </div>
          </div>
        )}
      </div>

    </aside>
  );
};
