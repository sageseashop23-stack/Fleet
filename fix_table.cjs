const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDispatchView.tsx', 'utf8');

const target1 = `          {/* Operational High Density Grid Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-2.5 px-4">Request ID & Rider</th>`;

const repl1 = `          {/* Operational High Density Grid Table */}
          {selectedTripIds.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-blue-900">{selectedTripIds.size} Trip{selectedTripIds.size > 1 ? 's' : ''} Terpilih</span>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={bulkStatusOps}
                  onChange={(e) => setBulkStatusOps(e.target.value as OperationalStatus | '')}
                  className="bg-white border border-blue-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">-- Set Status --</option>
                  <option value="UNASSIGNED">Unassigned</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="EN_ROUTE">En Route</option>
                  <option value="ARRIVED">Arrived</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <button
                  onClick={async () => {
                    if (!bulkStatusOps) return;
                    for (const id of Array.from(selectedTripIds)) {
                      await onUpdateTrip(id, { statusOps: bulkStatusOps as OperationalStatus });
                    }
                    setSelectedTripIds(new Set());
                    setBulkStatusOps('');
                  }}
                  disabled={!bulkStatusOps}
                  className="bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                >
                  Kemas Kini Status Pukal
                </button>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-2.5 px-4 w-10">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={filteredTrips.length > 0 && selectedTripIds.size === filteredTrips.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTripIds(new Set(filteredTrips.map(t => t.id)));
                            } else {
                              setSelectedTripIds(new Set());
                            }
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                    </th>
                    <th className="py-2.5 px-4">Request ID & Rider</th>`;

const target2 = `                    return (
                      <tr key={trip.id} className="hover:bg-blue-50/60 transition-colors">
                        
                        {/* Request ID & Rider */}
                        <td className="py-2.5 px-4">`;

const repl2 = `                    return (
                      <tr key={trip.id} className="hover:bg-blue-50/60 transition-colors">
                        
                        {/* Bulk Select Checkbox */}
                        <td className="py-2.5 px-4">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedTripIds.has(trip.id)}
                              onChange={(e) => {
                                const newSet = new Set(selectedTripIds);
                                if (e.target.checked) newSet.add(trip.id);
                                else newSet.delete(trip.id);
                                setSelectedTripIds(newSet);
                              }}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </div>
                        </td>

                        {/* Request ID & Rider */}
                        <td className="py-2.5 px-4">`;

code = code.replace(target1, repl1);
code = code.replace(target2, repl2);

fs.writeFileSync('src/components/AdminDispatchView.tsx', code);
