import React from 'react';
import { Menu, Plus, FileSpreadsheet, Bot, FileText, PauseCircle, PlayCircle } from 'lucide-react';

interface TopHeaderProps {
  activeTab: 'PASSENGER' | 'DRIVER' | 'ADMIN';
  disputedTripsCount: number;
  onOpenNewDispatch: () => void;
  onOpenReportModal: () => void;
  onOpenGasModal: () => void;
  onOpenAiModal: () => void;
  onToggleMobileSidebar: () => void;
  isAutoRefreshEnabled?: boolean;
  onToggleAutoRefresh?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  disputedTripsCount,
  onOpenNewDispatch,
  onOpenReportModal,
  onOpenGasModal,
  onOpenAiModal,
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
          className="md:hidden p-1.5 text-primary/70 hover:text-primary rounded-2xl hover:bg-black/5"
          aria-label="Togol Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-sm sm:text-base font-bold text-primary tracking-tight flex items-center gap-2 truncate">
          <span>{getTabTitle()}</span>
        </h2>

      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenNewDispatch}
          className="bg-primary hover:bg-primary/90 text-secondary font-bold px-3 py-1.5 rounded-2xl text-xs transition-all shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tugasan Baru</span>
        </button>

        <div className="h-4 w-px bg-primary/20 mx-1 hidden md:block"></div>

        {onToggleAutoRefresh && (
          <button
            onClick={onToggleAutoRefresh}
            title={isAutoRefreshEnabled ? "Jeda Automatik (Jimat Bateri)" : "Sambung Automatik"}
            className={`p-1.5 rounded-2xl text-xs font-medium border transition-colors flex items-center gap-1 ${
              isAutoRefreshEnabled 
                ? 'text-primary/70 border-primary/30 hover:text-primary hover:bg-black/5' 
                : ' border-amber-300 bg-amber-100 hover:bg-amber-200'
            }`}
          >
            {isAutoRefreshEnabled ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
            <span className="hidden xl:inline">{isAutoRefreshEnabled ? 'Jeda' : 'Disambung'}</span>
          </button>
        )}

        <button
          onClick={onOpenGasModal}
          title="Tetapan Google Sheets"
          className="p-1.5 text-primary/70 hover:text-primary hover:bg-black/5 rounded-2xl text-xs font-medium border border-primary/20 transition-colors hidden lg:flex items-center gap-1"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 " />
          <span className="hidden xl:inline">Google Sheets</span>
        </button>

        <button
          onClick={onOpenAiModal}
          title="Pengoptimum Laluan AI"
          className="p-1.5 text-primary/70 hover:text-primary hover:bg-black/5 rounded-2xl text-xs font-medium border border-primary/20 transition-colors hidden lg:flex items-center gap-1"
        >
          <Bot className="w-3.5 h-3.5 " />
          <span className="hidden xl:inline">AI Optimizer</span>
        </button>


      </div>

    </header>
  );
};
