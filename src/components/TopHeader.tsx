import React from 'react';
import { Menu, Plus, Bot, PauseCircle, PlayCircle, Activity } from 'lucide-react';

interface TopHeaderProps {
  activeTab: 'PASSENGER' | 'DRIVER' | 'ADMIN';
  disputedTripsCount: number;
  onOpenNewDispatch: () => void;
  onOpenReportModal: () => void;
  onOpenAiModal: () => void;
  onOpenDiagnosticsModal: () => void;
  onToggleMobileSidebar: () => void;
  isAutoRefreshEnabled?: boolean;
  onToggleAutoRefresh?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onOpenNewDispatch,
  onOpenAiModal,
  onOpenDiagnosticsModal,
  onToggleMobileSidebar,
  isAutoRefreshEnabled = true,
  onToggleAutoRefresh
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'ADMIN':
        return 'Pusat Kawalan Operasi Armada';
      case 'DRIVER':
        return 'Konsol Pemandu & Tugas Aktif';
      case 'PASSENGER':
        return 'Tempahan Penumpang & Penjejakan';
    }
  };

  return (
    <header className="h-14 bg-secondary border-b border-primary/20 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 select-none">
      
      {/* Left Title & Status Badges */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 -ml-2 text-primary/70 hover:text-primary hover:bg-black/5 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-sm tracking-wide text-primary">
          {getTabTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {onToggleAutoRefresh && (
          <button
            onClick={onToggleAutoRefresh}
            title={isAutoRefreshEnabled ? 'Jeda Auto-Refresh' : 'Sambung Auto-Refresh'}
            className={`p-1.5 rounded-2xl text-xs font-medium border transition-colors hidden sm:flex items-center gap-1 ${
              isAutoRefreshEnabled 
                ? 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' 
                : 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {isAutoRefreshEnabled ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
            <span className="hidden xl:inline">{isAutoRefreshEnabled ? 'Jeda' : 'Disambung'}</span>
          </button>
        )}

        <button
          onClick={onOpenAiModal}
          title="Pengoptimum Laluan AI"
          className="p-1.5 text-primary/70 hover:text-primary hover:bg-black/5 rounded-2xl text-xs font-medium border border-primary/20 transition-colors hidden lg:flex items-center gap-1"
        >
          <Bot className="w-3.5 h-3.5 " />
          <span className="hidden xl:inline">AI Optimizer</span>
        </button>
        
        <button
          onClick={onOpenDiagnosticsModal}
          title="Diagnostik API"
          className="p-1.5 text-primary/70 hover:text-primary hover:bg-black/5 rounded-2xl text-xs font-medium border border-primary/20 transition-colors hidden lg:flex items-center gap-1"
        >
          <Activity className="w-3.5 h-3.5 " />
          <span className="hidden xl:inline">Diagnostics</span>
        </button>
        
        {activeTab !== 'PASSENGER' && (
          <button
            onClick={onOpenNewDispatch}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-2xl text-xs font-bold transition-all shadow-sm shadow-blue-600/20 active:scale-95 ml-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tugas Baru</span>
            <span className="sm:hidden">Baru</span>
          </button>
        )}
      </div>
    </header>
  );
};
