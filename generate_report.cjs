const fs = require('fs');
const content = `
import React, { useState, useMemo } from 'react';
import { X, CircleDollarSign, WalletCards, ChartNoAxesCombined, CircleCheckBig, Route, FileCheck2 } from 'lucide-react';

export const MonthlyEarningsReportModal = ({ isOpen, onTutup, drivers, trips }: any) => {
  const [activeScope, setActiveScope] = useState<'all' | 'duty'>('all');
  const [selectedDriverId, setSelectedDriverId] = useState('');

  const currency = new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2
  });

  const visibleDrivers = useMemo(() => {
    if (selectedDriverId) return drivers.filter((d: any) => d.id === selectedDriverId);
    if (activeScope === 'duty') return drivers.filter((d: any) => d.isAvailable);
    return drivers;
  }, [drivers, activeScope, selectedDriverId]);

  const summaries = useMemo(() => {
    return visibleDrivers.map((driver: any) => {
      // trips have assignedDriverName or driverId ? Let's use assignedDriverName or matching something
      const driverTrips = trips.filter((t: any) => t.assignedDriverName === driver.name || t.driverId === driver.id);
      const gross = driverTrips.reduce((sum: number, trip: any) => sum + (trip.paymentAmount || 0), 0);
      const payout = gross * 0.7; // Example payout calculation
      return {
        driver,
        tripsCount: driverTrips.length,
        gross,
        payout,
        margin: gross - payout,
        completed: driverTrips.filter((t: any) => t.statusOps === 'COMPLETED').length,
        inflight: driverTrips.filter((t: any) => t.statusOps !== 'COMPLETED').length
      };
    });
  }, [visibleDrivers, trips]);

  const totals = useMemo(() => {
    return summaries.reduce((acc: any, curr: any) => {
      acc.gross += curr.gross;
      acc.payout += curr.payout;
      acc.margin += curr.margin;
      acc.completed += curr.completed;
      acc.inflight += curr.inflight;
      acc.trips += curr.tripsCount;
      return acc;
    }, { gross: 0, payout: 0, margin: 0, completed: 0, inflight: 0, trips: 0 });
  }, [summaries]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex overflow-y-auto bg-black/40 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
      <div className="report-shell w-full max-w-[1440px] mx-auto rounded-[2rem] shadow-2xl relative text-[#232722] overflow-hidden flex flex-col">
        <main className="w-full h-full overflow-y-auto px-4 py-5 sm:px-7 sm:py-8 lg:px-12 lg:py-10">
          <header className="rounded-[1.75rem] border border-[#dce1da] bg-white/90 px-5 py-5 shadow-[0_18px_44px_rgba(49,58,48,.08)] backdrop-blur sm:px-7 sm:py-6">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#b8ccba] bg-[#e7f0e4] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#55725a]">
                    Financial close
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#637968]">
                    August 2026 · Monthly statement
                  </span>
                </div>
                <h1 className="display-font mt-4 max-w-3xl text-2xl font-bold tracking-[-0.045em] text-[#29302a] sm:text-3xl">
                  Monthly Earnings Report
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-sm font-bold text-[#29302a]">Lady Driver Dispatch</p>
                  <span className="h-1 w-1 rounded-full bg-[#aab2ab]"></span>
                  <p className="text-sm text-[#69716b]">Driver revenue, payouts and margin summary</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-[#d6ddd5] bg-[#f5f7f3] px-3.5 py-2.5 text-xs font-bold text-[#394139] hover:border-[#9eb4a1] hover:bg-[#ebf1e8] focus:outline-none focus:ring-2 focus:ring-[#6f8c73]">
                  Print / PDF
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl border border-[#55725a] bg-[#55725a] px-3.5 py-2.5 text-xs font-bold text-white hover:bg-[#46634b] focus:outline-none focus:ring-2 focus:ring-[#6f8c73]">
                  Export CSV
                </button>
                <button onClick={onTutup} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce1da] bg-white text-[#69716b] hover:border-[#d9abb4] hover:bg-[#fbeff1] hover:text-[#9a5362] focus:outline-none focus:ring-2 focus:ring-[#bf7180]">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <section className="mt-5">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#dce1da] bg-[#f7f8f5]/90 p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setActiveScope('all'); setSelectedDriverId(''); }}
                  className={\`rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#6f8c73] \${activeScope === 'all' && !selectedDriverId ? 'bg-[#55725a] text-white border border-[#55725a]' : 'border border-[#d5dcd4] bg-white text-[#58615a] hover:bg-[#eef3ed]'}\`}
                >
                  All drivers
                </button>
                <button
                  onClick={() => { setActiveScope('duty'); setSelectedDriverId(''); }}
                  className={\`rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#6f8c73] \${activeScope === 'duty' && !selectedDriverId ? 'bg-[#55725a] text-white border border-[#55725a]' : 'border border-[#d5dcd4] bg-white text-[#58615a] hover:bg-[#eef3ed]'}\`}
                >
                  On-duty only
                </button>
              </div>
              <div className="flex items-center gap-3">
                <label className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] text-[#717a72]">Specific driver</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => { setSelectedDriverId(e.target.value); setActiveScope('all'); }}
                  className="min-w-0 flex-1 rounded-xl border border-[#d5dcd4] bg-white px-3 py-2 text-xs font-bold text-[#394139] outline-none focus:border-[#6f8c73] focus:ring-2 focus:ring-[#cadbc9] sm:w-48"
                >
                  <option value="">All drivers</option>
                  {drivers.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name} · {d.id}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#637968]">Executive overview</p>
                <h2 className="display-font mt-1 font-bold tracking-[-0.03em] text-[#29302a] text-xl">At a glance</h2>
              </div>
              <p className="text-right text-[11px] font-medium text-[#717a72]">{visibleDrivers.length} drivers in scope</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <article className="report-card rounded-2xl border border-[#dfe4de] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#69716b]">Gross revenue</p>
                  <CircleDollarSign className="h-4 w-4 text-[#55725a]" />
                </div>
                <p className="metric-number mt-5 text-2xl font-bold tracking-[-0.04em] text-[#29302a]">
                  {currency.format(totals.gross)}
                </p>
                <p className="mt-1.5 text-[11px] text-[#7a837b]">Total fare value</p>
              </article>
              <article className="report-card rounded-2xl border border-[#dfe4de] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#69716b]">Driver payouts</p>
                  <WalletCards className="h-4 w-4 text-[#a55a68]" />
                </div>
                <p className="metric-number mt-5 text-2xl font-bold tracking-[-0.04em] text-[#29302a]">
                  {currency.format(totals.payout)}
                </p>
                <p className="mt-1.5 text-[11px] text-[#7a837b]">Settled and pending</p>
              </article>
              <article className="report-card rounded-2xl border border-[#c8d9c6] bg-[#f1f6ee] p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#55725a]">Company margin</p>
                  <ChartNoAxesCombined className="h-4 w-4 text-[#55725a]" />
                </div>
                <p className="metric-number mt-5 text-2xl font-bold tracking-[-0.04em] text-[#29302a]">
                  {currency.format(totals.margin)}
                </p>
                <p className="mt-1.5 text-[11px] text-[#637968]">
                  {totals.gross ? ((totals.margin / totals.gross) * 100).toFixed(1) : "0.0"}% margin retained
                </p>
              </article>
              <article className="report-card rounded-2xl border border-[#dfe4de] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#69716b]">Completed trips</p>
                  <CircleCheckBig className="h-4 w-4 text-[#748b77]" />
                </div>
                <p className="metric-number mt-5 text-2xl font-bold tracking-[-0.04em] text-[#29302a]">{totals.completed}</p>
                <p className="mt-1.5 text-[11px] text-[#7a837b]">Closed this month</p>
              </article>
              <article className="report-card rounded-2xl border border-[#dfe4de] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#69716b]">In-flight trips</p>
                  <Route className="h-4 w-4 text-[#ad8953]" />
                </div>
                <p className="metric-number mt-5 text-2xl font-bold tracking-[-0.04em] text-[#29302a]">{totals.inflight}</p>
                <p className="mt-1.5 text-[11px] text-[#7a837b]">Still in progress</p>
              </article>
            </div>
          </section>

          <section className="mt-6">
            <div className="overflow-hidden rounded-[1.5rem] border border-[#dce1da] bg-white shadow-[0_18px_44px_rgba(49,58,48,.07)]">
              <div className="flex flex-col gap-4 border-b border-[#e2e6e1] px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#637968]">Driver accounting</p>
                  <h2 className="display-font mt-1 font-bold tracking-[-0.035em] text-[#29302a] text-xl">Earnings ledger</h2>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#717a72]">{totals.trips} trips accounted</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left min-w-[760px]">
                  <thead className="border-b border-[#e2e6e1] bg-[#f4f6f3]">
                    <tr>
                      <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#717a72] sm:px-6">Driver</th>
                      <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#717a72]">Vehicle</th>
                      <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#717a72]">Trips</th>
                      <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#717a72]">Gross</th>
                      <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#717a72]">Payout</th>
                      <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#717a72]">Margin</th>
                      <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#717a72] sm:px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaries.map((summary: any) => (
                      <tr key={summary.driver.id} className="ledger-row border-b border-[#e7ebe6] last:border-0">
                        <td className="px-5 py-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f5e8eb] text-[10px] font-bold text-[#a55a68]">
                              {summary.driver.name.substring(0,2).toUpperCase()}
                            </span>
                            <div>
                              <p className="text-sm font-bold text-[#29302a]">{summary.driver.name}</p>
                              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[#7a837b]">{summary.driver.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-xs font-semibold text-[#58615a]">{summary.driver.vehicleModel || 'Standard'}</td>
                        <td className="px-3 py-4 text-right text-xs font-semibold text-[#29302a]">{summary.tripsCount}</td>
                        <td className="px-3 py-4 text-right text-xs font-bold text-[#29302a]">{currency.format(summary.gross)}</td>
                        <td className="px-3 py-4 text-right text-xs font-semibold text-[#a55a68]">{currency.format(summary.payout)}</td>
                        <td className="px-3 py-4 text-right text-xs font-bold text-[#55725a]">{currency.format(summary.margin)}</td>
                        <td className="px-5 py-4 text-right sm:px-6">
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.09em]" style={{ color: summary.driver.isAvailable ? '#55725a' : '#8a938b' }}>
                            <span className="status-dot h-1.5 w-1.5 rounded-full" style={{ background: summary.driver.isAvailable ? '#55725a' : '#8a938b' }}></span>
                            {summary.driver.isAvailable ? 'On duty' : 'Off duty'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-[#c9d9c7] bg-[#f1f6ee]">
                    <tr>
                      <td colSpan={2} className="px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#55725a] sm:px-6">Portfolio total</td>
                      <td className="px-3 py-4 text-right text-xs font-bold text-[#29302a]">{totals.trips}</td>
                      <td className="px-3 py-4 text-right text-xs font-bold text-[#29302a]">{currency.format(totals.gross)}</td>
                      <td className="px-3 py-4 text-right text-xs font-bold text-[#a55a68]">{currency.format(totals.payout)}</td>
                      <td className="px-3 py-4 text-right text-xs font-bold text-[#55725a]">{currency.format(totals.margin)}</td>
                      <td className="px-5 py-4 sm:px-6"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {summaries.length === 0 && (
                <p className="px-6 py-12 text-center text-sm text-[#69716b]">No driver records match this accounting scope.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
`;
fs.writeFileSync('src/components/MonthlyEarningsReportModal.tsx', content);
