import React from 'react';
import { Truck, Car, ShieldCheck, FileText, AlertTriangle, Bot, Activity, X } from 'lucide-react';
import { Driver } from '../types';

interface SidebarProps {
  activeTab: 'PASSENGER' | 'DRIVER' | 'ADMIN';
  setActiveTab: (tab: 'PASSENGER' | 'DRIVER' | 'ADMIN') => void;
  disputedTripsCount: number;
  activeDriver: Driver | null;
  onLogoutDriver: () => void;
  onOpenReportModal: () => void;
  onOpenAiModal: () => void;
  onOpenDiagnosticsModal: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  disputedTripsCount,
  activeDriver,
  onOpenReportModal,
  onOpenAiModal,
  onOpenDiagnosticsModal,
  isMobileOpen,
  setIsMobileOpen
}) => {
  return (
    <aside className={`w-56 bg-primary flex flex-col border-r border-primary/20 text-white/70 shrink-0 select-none ${
      isMobileOpen ? 'fixed inset-y-0 left-0 z-50 flex' : 'hidden md:flex'
    }`}>
      
      {/* Brand & Logo Header */}
      <div className="p-5 flex items-center justify-between border-b border-primary/20">
        <div className="flex items-center gap-3 w-full">
          <label className="w-8 h-8 shrink-0 rounded-2xl flex items-center justify-center shadow-md overflow-hidden cursor-pointer relative group transition-colors border border-white/20 bg-rose-200">
            <input type="file" accept="image/*" className="hidden" />
            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop" alt="Logo" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
              <span className="text-[8px] font-bold text-white uppercase text-center leading-tight">Edit</span>
            </div>
          </label>
          <div className="flex flex-col min-w-0 flex-1">
            <input 
              type="text" 
              defaultValue="LADY DRIVER DISPATCH"
              className="text-white font-bold tracking-tight text-base leading-tight bg-transparent border-none outline-none focus:ring-1 focus:ring-white/30 rounded px-1 -ml-1 w-full truncate"
            />
            <input 
              type="text"
              defaultValue="SAFEST & AFFORDABLE LOGISTIC"
              className="text-[10px] text-white/70 font-medium bg-transparent border-none outline-none focus:ring-1 focus:ring-white/30 rounded px-1 -ml-1 w-full truncate"
            />
          </div>
        </div>
        
        {setIsMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden absolute top-4 right-4 p-1 rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-6 scrollbar-hide">
        {/* Core Dispatch Views */}
        <div>
          <span className="px-3 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Pusat Kawalan</span>
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('ADMIN');
                setIsMobileOpen?.(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl font-medium transition-all ${
                activeTab === 'ADMIN' 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 shrink-0 ${activeTab === 'ADMIN' ? 'text-blue-400' : ''}`} />
              <span>Admin Operasi</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('DRIVER');
                setIsMobileOpen?.(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl font-medium transition-all ${
                activeTab === 'DRIVER' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Car className={`w-4 h-4 shrink-0 ${activeTab === 'DRIVER' ? 'text-emerald-400' : ''}`} />
              <span>Konsol Pemandu</span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('PASSENGER');
                setIsMobileOpen?.(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl font-medium transition-all ${
                activeTab === 'PASSENGER' 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Truck className={`w-4 h-4 shrink-0 ${activeTab === 'PASSENGER' ? 'text-rose-400' : ''}`} />
              <span>Borang Penumpang</span>
            </button>
          </div>
        </div>

        {/* Action Center */}
        <div>
          <span className="px-3 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
            Pusat Tindakan
            {disputedTripsCount > 0 && (
              <span className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                {disputedTripsCount}
              </span>
            )}
          </span>
          <div className="space-y-1">
            <button
              onClick={() => {
                onOpenReportModal();
                setIsMobileOpen?.(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white rounded-2xl font-medium transition-colors"
            >
              <FileText className="w-4 h-4 shrink-0 " />
              <span>Laporan Kewangan</span>
              {disputedTripsCount > 0 && (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 ml-auto shrink-0" />
              )}
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
            <button
              onClick={() => {
                onOpenDiagnosticsModal();
                setIsMobileOpen?.(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white rounded-2xl font-medium transition-colors"
            >
              <Activity className="w-4 h-4 shrink-0 " />
              <span>Diagnostik API</span>
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
