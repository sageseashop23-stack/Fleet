const fs = require('fs');
let code = fs.readFileSync('src/components/TopHeader.tsx', 'utf8');
code = `import React from 'react';
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
` + code;
fs.writeFileSync('src/components/TopHeader.tsx', code);
