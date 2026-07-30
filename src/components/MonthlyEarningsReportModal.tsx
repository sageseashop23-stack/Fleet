import React, { useState } from 'react';
import { Driver, Trip } from '../types';
import { FileText, Printer, Download, Filter, X } from 'lucide-react';

interface MonthlyEarningsReportModalProps {
  isOpen: boolean;
  onTutup: () => void;
  drivers: Driver[];
  trips: Trip[];
}

export const MonthlyEarningsReportModal: React.FC<MonthlyEarningsReportModalProps> = ({
  isOpen,
  onTutup,
  drivers,
  trips
}) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'ON_DUTY' | 'SPECIFIC_DRIVER'>('ALL');
  const [selectedDriverId, setSelectedDriverId] = useState<string>(drivers[0]?.id || '');

  if (!isOpen) return null;

  // Current Month String
  const monthYearStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Filter Drivers
  const filteredDrivers = drivers.filter((d) => {
    if (filterMode === 'ON_DUTY') return d.isAvailable;
    if (filterMode === 'SPECIFIC_DRIVER') return d.id === selectedDriverId;
    return true;
  });

  const filteredDriverIds = new Set(filteredDrivers.map((d) => d.id));

  // Filter Trips for these drivers
  const relevantTrips = trips.filter(
    (t) => t.assignedDriverId && filteredDriverIds.has(t.assignedDriverId)
  );

  const completedTrips = relevantTrips.filter((t) => t.statusOps === 'COMPLETED' || t.statusOps === 'DISPUTED');
  const inFlightTrips = relevantTrips.filter((t) => ['ASSIGNED', 'EN_ROUTE', 'ARRIVED'].includes(t.statusOps));

  // Financial Summaries
  const totalGrossRevenue = completedTrips.reduce((acc, t) => acc + (t.paymentAmount || 0), 0);
  const totalDriverPayouts = completedTrips.reduce((acc, t) => acc + (t.paymentDriver || 0), 0);
  const totalCompanyMargin = completedTrips.reduce((acc, t) => acc + (t.grossProfit || 0), 0);

  // CSV Export Generator
  const handleExportCSV = () => {
    const headers = [
      'Trip Request ID',
      'Pickup Date',
      'Pickup Time',
      'Passenger Name',
      'Assigned Driver ID',
      'Assigned Driver Name',
      'Vehicle Type',
      'Distance (km)',
      'Operational Status',
      'Gross Fare ($)',
      'Driver Payout ($)',
      'Company Margin ($)'
    ];

    const rows = completedTrips.map((t) => [
      t.id,
      t.pickupDate,
      t.pickupTime,
      `"${t.passengerName.replace(/"/g, '""')}"`,
      t.assignedDriverId || 'N/A',
      `"${(t.assignedDriverName || 'Unassigned').replace(/"/g, '""')}"`,
      t.vehicleType,
      t.estimatedDistanceKm,
      t.statusOps,
      t.paymentAmount.toFixed(2),
      t.paymentDriver.toFixed(2),
      t.grossProfit.toFixed(2)
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `City_Dispatch_Monthly_Earnings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      
      {/* Printable Container styling */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-5xl w-full p-6 shadow-2xl space-y-6 my-auto print:border-none print:shadow-none print:p-0 print:max-w-none">
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 print:border-slate-300">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md print:hidden">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Monthly Driver Earnings & Revenue Statement
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                City Dispatch Logistics Inc. • Accounting Period: <span className="font-bold text-blue-600 dark:text-blue-400">{monthYearStr}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all border border-slate-200 dark:border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onTutup}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar (Hidden during printing) */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Filter className="w-4 h-4 text-blue-500" />
            <span>Driver Scope Filter:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'ALL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All Registered ({drivers.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('ON_DUTY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'ON_DUTY'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Active On-Duty Only ({drivers.filter((d) => d.isAvailable).length})
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('SPECIFIC_DRIVER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'SPECIFIC_DRIVER'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Specific Driver
            </button>

            {filterMode === 'SPECIFIC_DRIVER' && (
              <select
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1 text-xs text-slate-900 dark:text-white font-semibold"
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.id})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Gross Revenue</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">${totalGrossRevenue.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Total billed customer fares</span>
          </div>

          <div className="bg-emerald-50/60 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest block">Total Driver Payouts</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-300">${totalDriverPayouts.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block mt-1">75% net disbursement</span>
          </div>

          <div className="bg-blue-50/60 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <span className="text-[10px] font-bold text-blue-800 dark:text-blue-400 uppercase tracking-widest block">Company Margin</span>
            <span className="text-xl font-black text-blue-600 dark:text-blue-300">${totalCompanyMargin.toFixed(2)}</span>
            <span className="text-[10px] text-blue-700 dark:text-blue-400 block mt-1">25% gross profit margin</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Completed Trips</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{completedTrips.length}</span>
            <span className="text-[10px] text-slate-500 block mt-1">{inFlightTrips.length} currently in-flight</span>
          </div>

        </div>

        {/* Individual Driver Earnings Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Driver Accounting Ledger ({filteredDrivers.length} Drivers)
          </h3>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Driver ID & Name</th>
                  <th className="p-3">Phone & Duty Status</th>
                  <th className="p-3">Completed Trips</th>
                  <th className="p-3">Gross Fares ($)</th>
                  <th className="p-3 font-extrabold text-emerald-600 dark:text-emerald-400">Total Driver Payout ($)</th>
                  <th className="p-3 text-right">Company Margin ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDrivers.map((d) => {
                  const dTrips = completedTrips.filter((t) => t.assignedDriverId === d.id);
                  const dGross = dTrips.reduce((acc, t) => acc + (t.paymentAmount || 0), 0);
                  const dPayout = dTrips.reduce((acc, t) => acc + (t.paymentDriver || 0), 0);
                  const dMargin = dTrips.reduce((acc, t) => acc + (t.grossProfit || 0), 0);

                  return (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{d.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{d.id} • {d.vehicleModel}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-slate-700 dark:text-slate-300">{d.phone}</div>
                        <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          d.isAvailable ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {d.isAvailable ? 'ON-DUTY' : 'OFF-DUTY'}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {dTrips.length} Jobs
                      </td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        ${dGross.toFixed(2)}
                      </td>
                      <td className="p-3 font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        ${dPayout.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400">
                        ${dMargin.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Statement Disclaimer */}
        <div className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
          <span>Generated automatically by City Dispatch Logistics System</span>
          <span>Confidential Accounting Document</span>
        </div>

      </div>

    </div>
  );
};
