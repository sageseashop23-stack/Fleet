import React from 'react';
import { OperationalStatus, AdministrativeStatus } from '../types';

interface StatusBadgeProps {
  statusOps?: OperationalStatus;
  statusAdmin?: AdministrativeStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ statusOps, statusAdmin, size = 'sm' }) => {
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider' 
    : 'px-2.5 py-1 text-xs font-bold uppercase tracking-wider';

  if (statusOps) {
    switch (statusOps) {
      case 'UNASSIGNED':
        return (
          <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            UNASSIGNED
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className={`inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            ASSIGNED
          </span>
        );
      case 'EN_ROUTE':
        return (
          <span className={`inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
            EN ROUTE
          </span>
        );
      case 'ARRIVED':
        return (
          <span className={`inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            ARRIVED
          </span>
        );
      case 'COMPLETED':
        return (
          <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            COMPLETED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            CANCELLED
          </span>
        );
      case 'DISPUTED':
        return (
          <span className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce"></span>
            DISPUTED
          </span>
        );
      default:
        return null;
    }
  }

  if (statusAdmin) {
    switch (statusAdmin) {
      case 'PENDING':
        return (
          <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}>
            PENDING
          </span>
        );
      case 'PAID':
        return (
          <span className={`inline-flex items-center rounded-full bg-teal-50 text-teal-700 border border-teal-200 ${sizeClasses}`}>
            PAID & SETTLED
          </span>
        );
      case 'DISPUTE_RESOLVED':
        return (
          <span className={`inline-flex items-center rounded-full bg-sky-50 text-sky-700 border border-sky-200 ${sizeClasses}`}>
            DISPUTE RESOLVED
          </span>
        );
      default:
        return null;
    }
  }

  return null;
};
