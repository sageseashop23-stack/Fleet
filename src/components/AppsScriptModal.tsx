import React, { useState } from 'react';
import { GasConfig } from '../types';
import { FileSpreadsheet, Copy, Check, ExternalLink, RefreshCw, X, ShieldAlert } from 'lucide-react';

interface AppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  gasConfig: GasConfig;
  onSaveConfig: (webAppUrl: string, autoSyncOnComplete: boolean) => Promise<void>;
  onTriggerManualSync: () => Promise<void>;
  onImportData?: () => Promise<void>;
}

export const AppsScriptModal: React.FC<AppsScriptModalProps> = ({
  isOpen,
  onClose,
  gasConfig,
  onSaveConfig,
  onTriggerManualSync,
  onImportData
}) => {
  const [urlInput, setUrlInput] = useState(gasConfig.webAppUrl || '');
  const [autoSync, setAutoSync] = useState(gasConfig.autoSyncOnComplete ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveConfig(urlInput.trim(), autoSync);
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await onTriggerManualSync();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleImport = async () => {
    if (!onImportData) return;
    setIsImporting(true);
    try {
      await onImportData();
    } finally {
      setIsImporting(false);
    }
  };

  // Google Apps Script snippet to paste in Google Sheets Script Editor
  const appsScriptCode = `/**
 * CITY DISPATCH LOGISTICS SYSTEM - GOOGLE SHEETS SYNC BRIDGE
 * Target Sheets: "Admin_job", "driver name", "customer"
 * Paste this script into Google Sheets -> Extensions -> Apps Script
 * Deploy as Web App (Execute as: Me, Access: Anyone)
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Admin_job Sheet
    var jobSheet = ss.getSheetByName("Admin_job") || ss.createSheet("Admin_job");
    if (jobSheet.getLastRow() === 0) {
      jobSheet.appendRow([
        "Timestamp", "Job ID", "Key", "Customer_ID", "Email_Address",
        "Nama_Pelanggan", "Nombor_Telefon_Pelanggan", "Permintaan_Khas",
        "Lokasi_Jemput(Pick Up)", "Tarikh_Jemput Pilihan(Pick Up)", "Masa_Jemput_Pilihan(Pick Up)",
        "Lokasi _Hantar(Drop off)", "Tarikh_Hantar_Pilihan(Drop off)", "Masa_Hantar_Pilihan(Drop off)",
        "Jenis_Perkhidmatan", "Round Trip", "Bil_Penumpang", "Tujuan", "Request_ID",
        "Payment_Amount", "Payment_Driver", "Gross_Profit", "Status_Ops", "Status_Admin",
        "Customer_Type", "Admin_Notes", "Verified_By", "Verified_Date",
        "Date Email send_Driver", "Date Email send_Customer", "Job_Created"
      ]);
      jobSheet.getRange(1, 1, 1, 31).setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
    }
    
    if (data.trips && data.trips.length > 0) {
      if (jobSheet.getLastRow() > 1) {
        jobSheet.getRange(2, 1, jobSheet.getLastRow() - 1, 31).clearContent();
      }
      var tripRows = data.trips.map(function(t, idx) {
        return [
          new Date().toISOString(),
          t.id || ("TRP-" + (202600 + idx)),
          (t.id || ("TRP-" + idx)) + "-KEY",
          "CUST-" + (idx + 1),
          "",
          t.passengerName || "Guest",
          t.passengerPhone || "",
          t.specialNotes || "",
          t.pickupAddress || "",
          t.pickupDate || "",
          t.pickupTime || "",
          t.dropoffAddress || "",
          t.pickupDate || "",
          "",
          t.vehicleType || "STANDARD_SEDAN",
          t.isRoundTrip ? "Yes" : "No",
          t.passengerCount || 1,
          "Logistics Dispatch",
          t.id || "",
          Number(t.paymentAmount) || 0,
          Number(t.paymentDriver) || 0,
          Number(t.grossProfit) || 0,
          t.statusOps || "UNASSIGNED",
          t.statusAdmin || "PENDING",
          "Standard",
          "",
          "Dispatcher",
          new Date().toLocaleDateString(),
          "",
          "",
          t.createdAt || new Date().toISOString()
        ];
      });
      jobSheet.getRange(2, 1, tripRows.length, 31).setValues(tripRows);
    }
    
    // 2. driver name Sheet
    var driverSheet = ss.getSheetByName("driver name") || ss.createSheet("driver name");
    if (driverSheet.getLastRow() === 0) {
      driverSheet.appendRow([
        "Driver Name", "PIN", "Photo", "Email", "Phone Number",
        "Is_Available", "Last_Updated", "Admin Role"
      ]);
      driverSheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
    }
    
    if (data.drivers && data.drivers.length > 0) {
      if (driverSheet.getLastRow() > 1) {
        driverSheet.getRange(2, 1, driverSheet.getLastRow() - 1, 8).clearContent();
      }
      var driverRows = data.drivers.map(function(d) {
        return [
          d.name || "Driver",
          d.pin || "1234",
          "",
          "",
          d.phone || "",
          d.isAvailable ? "ON-DUTY" : "OFF",
          new Date().toISOString(),
          d.adminRole ? "TRUE" : "FALSE"
        ];
      });
      driverSheet.getRange(2, 1, driverRows.length, 8).setValues(driverRows);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "SUCCESS", timestamp: new Date().toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ERROR", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Sheet 1: Admin_job
    var jobSheet = ss.getSheetByName("Admin_job") || ss.getSheetByName("Dispatches") || ss.getSheets()[0];
    var trips = [];
    if (jobSheet && jobSheet.getLastRow() > 1) {
      var jobRange = jobSheet.getRange(1, 1, jobSheet.getLastRow(), jobSheet.getLastColumn()).getValues();
      var headers = jobRange[0].map(function(h) { return String(h).trim(); });
      
      function findCol(names) {
        for (var i = 0; i < headers.length; i++) {
          for (var j = 0; j < names.length; j++) {
            if (headers[i].toLowerCase() === names[j].toLowerCase()) return i;
          }
        }
        return -1;
      }

      var iJobId = findCol(["Job ID", "Job_ID", "Request_ID", "id"]);
      var iName = findCol(["Nama_Pelanggan", "Nama Pelanggan", "passengerName", "Customer_Name"]);
      var iPhone = findCol(["Nombor_Telefon_Pelanggan", "Phone", "passengerPhone"]);
      var iNotes = findCol(["Permintaan_Khas", "specialNotes", "Notes"]);
      var iPickup = findCol(["Lokasi_Jemput(Pick Up)", "Lokasi_Jemput", "pickupAddress", "Pick Up"]);
      var iPDate = findCol(["Tarikh_Jemput Pilihan(Pick Up)", "pickupDate", "Tarikh_Jemput"]);
      var iPTime = findCol(["Masa_Jemput_Pilihan(Pick Up)", "pickupTime", "Masa_Jemput"]);
      var iDropoff = findCol(["Lokasi _Hantar(Drop off)", "Lokasi_Hantar(Drop off)", "dropoffAddress", "Drop off"]);
      var iService = findCol(["Jenis_Perkhidmatan", "vehicleType", "Service"]);
      var iRound = findCol(["Round Trip", "isRoundTrip"]);
      var iPax = findCol(["Bil_Penumpang", "passengerCount", "Passengers"]);
      var iPayAmt = findCol(["Payment_Amount", "paymentAmount"]);
      var iPayDrv = findCol(["Payment_Driver", "paymentDriver"]);
      var iProfit = findCol(["Gross_Profit", "grossProfit"]);
      var iOps = findCol(["Status_Ops", "statusOps"]);
      var iAdmin = findCol(["Status_Admin", "statusAdmin"]);

      for (var r = 1; r < jobRange.length; r++) {
        var row = jobRange[r];
        if (!row[0] && !row[1] && !row[5] && !row[18]) continue; // skip blank row

        var valId = iJobId >= 0 ? String(row[iJobId]) : (row[18] ? String(row[18]) : ("TRP-" + (202600 + r)));
        var valName = iName >= 0 ? String(row[iName]) : (row[5] ? String(row[5]) : "Passenger");
        var valPhone = iPhone >= 0 ? String(row[iPhone]) : (row[6] ? String(row[6]) : "");
        var valNotes = iNotes >= 0 ? String(row[iNotes]) : (row[7] ? String(row[7]) : "");
        var valPickup = iPickup >= 0 ? String(row[iPickup]) : (row[8] ? String(row[8]) : "Pickup");
        var valPDate = iPDate >= 0 ? String(row[iPDate]) : (row[9] ? String(row[9]) : "2026-07-28");
        var valPTime = iPTime >= 0 ? String(row[iPTime]) : (row[10] ? String(row[10]) : "10:00");
        var valDropoff = iDropoff >= 0 ? String(row[iDropoff]) : (row[11] ? String(row[11]) : "Dropoff");
        var valService = iService >= 0 ? String(row[iService]) : (row[14] ? String(row[14]) : "STANDARD_SEDAN");
        var valRound = iRound >= 0 ? row[iRound] : row[15];
        var valPax = iPax >= 0 ? row[iPax] : row[16];
        var valAmt = iPayAmt >= 0 ? row[iPayAmt] : row[19];
        var valDrv = iPayDrv >= 0 ? row[iPayDrv] : row[20];
        var valProf = iProfit >= 0 ? row[iProfit] : row[21];
        var valOps = iOps >= 0 ? row[iOps] : row[22];
        var valAdm = iAdmin >= 0 ? row[iAdmin] : row[23];

        trips.push({
          id: valId || ("TRP-2026-" + r),
          passengerName: valName || "Passenger",
          passengerPhone: valPhone || "",
          specialNotes: valNotes || "",
          pickupAddress: valPickup || "Pickup Point",
          pickupDate: valPDate || "2026-07-28",
          pickupTime: valPTime || "10:00",
          dropoffAddress: valDropoff || "Dropoff Point",
          vehicleType: valService || "STANDARD_SEDAN",
          isRoundTrip: String(valRound).toLowerCase().indexOf("yes") >= 0 || valRound === true,
          passengerCount: Number(valPax) || 1,
          paymentAmount: Number(valAmt) || 0,
          paymentDriver: Number(valDrv) || 0,
          grossProfit: Number(valProf) || 0,
          statusOps: (String(valOps || "UNASSIGNED")).toUpperCase(),
          statusAdmin: (String(valAdm || "PENDING")).toUpperCase(),
          estimatedDistanceKm: 15,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    // Sheet 2: driver name
    var driverSheet = ss.getSheetByName("driver name") || ss.getSheetByName("Drivers") || ss.getSheetByName("Driver");
    var drivers = [];
    if (driverSheet && driverSheet.getLastRow() > 1) {
      var dRange = driverSheet.getRange(1, 1, driverSheet.getLastRow(), driverSheet.getLastColumn()).getValues();
      var dHeaders = dRange[0].map(function(h) { return String(h).trim(); });

      function findDCol(names) {
        for (var i = 0; i < dHeaders.length; i++) {
          for (var j = 0; j < names.length; j++) {
            if (dHeaders[i].toLowerCase() === names[j].toLowerCase()) return i;
          }
        }
        return -1;
      }

      var idxDName = findDCol(["Driver Name", "name", "Nama Driver"]);
      var idxDPin = findDCol(["PIN", "pin"]);
      var idxDPhone = findDCol(["Phone Number", "Phone", "phone"]);
      var idxDAvail = findDCol(["Is_Available", "isAvailable", "Available"]);
      var idxDAdmin = findDCol(["Admin Role", "adminRole", "Admin"]);

      for (var d = 1; d < dRange.length; d++) {
        var dRow = dRange[d];
        if (!dRow[0] && !dRow[1] && !dRow[4]) continue;

        var dName = idxDName >= 0 ? String(dRow[idxDName]) : String(dRow[0] || "Driver");
        var dPin = idxDPin >= 0 ? String(dRow[idxDPin]) : String(dRow[1] || "1234");
        var dPhone = idxDPhone >= 0 ? String(dRow[idxDPhone]) : String(dRow[4] || "");
        var dAvail = idxDAvail >= 0 ? dRow[idxDAvail] : dRow[5];
        var dAdmin = idxDAdmin >= 0 ? dRow[idxDAdmin] : dRow[7];

        var isAvail = String(dAvail).toUpperCase() === "ON-DUTY" || String(dAvail).toUpperCase() === "TRUE" || dAvail === true;
        var isAdmin = String(dAdmin).toUpperCase() === "TRUE" || dAdmin === true || String(dAdmin).toUpperCase() === "YES";

        drivers.push({
          id: "DRV-" + (100 + d),
          name: dName || "Driver " + d,
          pin: String(dPin).replace(/\\D/g, "") || "1234",
          phone: dPhone || "",
          isAvailable: isAvail,
          adminRole: isAdmin,
          vehicleModel: "Executive Sedan",
          licensePlate: "CPT-" + (1000 + d),
          totalCompletedJobs: 30,
          rating: 4.9
        });
      }
    }

    // Sheet 3: customer
    var customerSheet = ss.getSheetByName("customer") || ss.getSheetByName("Customer");
    var customers = [];
    if (customerSheet && customerSheet.getLastRow() > 1) {
      var cRange = customerSheet.getRange(2, 1, customerSheet.getLastRow() - 1, 3).getValues();
      for (var c = 0; c < cRange.length; c++) {
        var cRow = cRange[c];
        if (cRow[0]) {
          customers.push({
            name: String(cRow[0]),
            clientCode: String(cRow[1] || ""),
            phoneSuffix: String(cRow[2] || "")
          });
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "SUCCESS",
      trips: trips,
      drivers: drivers,
      customers: customers
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ERROR", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Google Sheets Synchronization (Google Apps Script)
              </h2>
              <p className="text-xs text-slate-500">
                Connect your City Dispatch system directly to a live Google Sheet
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Google Apps Script Web App URL
            </label>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300"
              />
              <span>Auto-sync dispatches to Google Sheet on trip state changes</span>
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleManualSync}
                disabled={!gasConfig.webAppUrl || isSyncing}
                title="Export / Push current app dispatches & drivers to Google Sheet"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Pushing...' : 'Push to Sheet'}</span>
              </button>

              {onImportData && (
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={!gasConfig.webAppUrl || isImporting}
                  title="Import / Pull dispatches & drivers directly from Google Sheet"
                  className="px-3 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-400 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isImporting ? 'animate-spin' : ''}`} />
                  <span>{isImporting ? 'Pulling...' : 'Pull from Sheet'}</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
              >
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>

          {gasConfig.lastSyncTimestamp && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              ✓ Last Successful Sync: {new Date(gasConfig.lastSyncTimestamp).toLocaleString()}
            </p>
          )}

          {gasConfig.lastErrorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-800 dark:text-rose-200 text-xs space-y-1.5">
              <div className="flex items-start gap-2 font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Google Sheet Connection Error</span>
              </div>
              <p className="pl-6 text-slate-700 dark:text-slate-300 font-medium">{gasConfig.lastErrorMessage}</p>
              <div className="pl-6 pt-1 text-[11px] text-slate-600 dark:text-slate-400 space-y-1 bg-white/50 dark:bg-black/20 p-2 rounded border border-rose-100 dark:border-rose-900/40">
                <p className="font-bold text-slate-800 dark:text-slate-200">How to fix this issue:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li><strong>URL check:</strong> Make sure the URL ends with <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">/exec</code> (not <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">docs.google.com</code> or <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">/edit</code>).</li>
                  <li><strong>Access setting:</strong> In Apps Script, click <strong>Deploy ➔ Manage deployments ➔ Edit</strong> (or <strong>New deployment</strong>).</li>
                  <li><strong>Who has access:</strong> Must be set to <strong>"Anyone"</strong> (not "Only myself").</li>
                  <li><strong>Execute as:</strong> Must be set to <strong>"Me"</strong>.</li>
                </ul>
              </div>
            </div>
          )}

        </form>

        {/* Instructions & Code Snippet */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Google Apps Script Code Snippet (.gs)
            </h3>
            <button
              type="button"
              onClick={copyScriptToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 transition-all"
            >
              {copiedScript ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Script Code'}</span>
            </button>
          </div>

          <div className="bg-slate-950 text-slate-200 font-mono text-[11px] p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-56">
            <pre>{appsScriptCode}</pre>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-300">Quick Deployment Steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open your target Google Sheet in browser.</li>
              <li>Click <strong>Extensions ➔ Apps Script</strong>.</li>
              <li>Paste the script above into `Code.gs` and click Save.</li>
              <li>Click <strong>Deploy ➔ New deployment</strong> ➔ Select type: <em>Web App</em>.</li>
              <li>Set <strong>Execute as:</strong> <em>Me</em> and <strong>Who has access:</strong> <em>Anyone</em>.</li>
              <li>Click <strong>Deploy</strong> and copy the generated Web App URL into the input field above.</li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
};
