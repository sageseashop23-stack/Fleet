import React from 'react';
import { Menu, Plus, FileSpreadsheet, Bot, FileText } from 'lucide-react';

interface TopHeaderProps {
  activeTab: 'PASSENGER' | 'DRIVER' | 'ADMIN';
  disputedTripsCount: number;
  onOpenNewDispatch: () => void;
  onOpenReportModal: () => void;
  onOpenGasModal: () => void;
  onOpenAiModal: () => void;
  onToggleMobileSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  disputedTripsCount,
  onOpenNewDispatch,
  onOpenReportModal,
  onOpenGasModal,
  onOpenAiModal,
  onToggleMobileSidebar
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'ADMIN':
        return 'Fleet Operations Command Center';
      case 'DRIVER':
        return 'Chauffeur Console & Active Duty';
      case 'PASSENGER':
        return 'Passenger Reservation & Order Tracking';
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 select-none">
      
      {/* Left Title & Status Badges */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 truncate">
          <span>{getTabTitle()}</span>
        </h2>

        {/* Live Status Chips */}
        <div className="hidden sm:flex items-center gap-2 ml-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM: ONLINE
          </span>

          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            GAS SYNC: ACTIVE
          </span>

          {disputedTripsCount > 0 && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              {disputedTripsCount} DISPUTED
            </span>
          )}
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenNewDispatch}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Dispatch</span>
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1 hidden md:block"></div>

        <button
          onClick={onOpenGasModal}
          title="Google Apps Script Sync Settings"
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium border border-slate-200 transition-colors hidden lg:flex items-center gap-1"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden xl:inline">Google Sheets</span>
        </button>

        <button
          onClick={onOpenAiModal}
          title="AI Dispatch Route Optimizer"
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium border border-slate-200 transition-colors hidden lg:flex items-center gap-1"
        >
          <Bot className="w-3.5 h-3.5 text-purple-600" />
          <span className="hidden xl:inline">AI Optimizer</span>
        </button>

        <button
          onClick={onOpenReportModal}
          title="Monthly Financial Report"
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium border border-slate-200 transition-colors hidden sm:flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden xl:inline">Earnings Report</span>
        </button>
      </div>

    </header>
  );
};
