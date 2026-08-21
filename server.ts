import express from 'express';
import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'local_db.json');

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

interface LocalDb {
  drivers: any[];
  trips: any[];
  activityLogs: any[];
  gasConfig: {
    webAppUrl: string;
    autoSyncOnComplete: boolean;
    lastSyncTimestamp?: string;
    syncStatus: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR';
    lastErrorMessage?: string;
  };
}


const pool = process.env.POSTGRES_URL ? new Pool({ connectionString: process.env.POSTGRES_URL.trim(), max: 20 }) : null;
console.log("DATABASE_URL length:", process.env.POSTGRES_URL ? process.env.POSTGRES_URL.length : 0);
if (pool) pool.on("error", (err) => console.error("Pool error:", err));


let ensureTablePromise: Promise<void> | null = null;
async function ensureTable() {
  if (!pool) return;
  if (!ensureTablePromise) {
    ensureTablePromise = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS app_state (
          id SERIAL PRIMARY KEY,
          data JSONB NOT NULL
        )
      `);
      const { rowCount } = await pool.query('SELECT id FROM app_state WHERE id = 1');
      if (rowCount === 0) {
        const initialData: LocalDb = {
          drivers: [],
          trips: [],
          activityLogs: [],
          gasConfig: { webAppUrl: '', autoSyncOnComplete: true, syncStatus: 'IDLE' }
        };
        let data = initialData;
        try {
          if (fs.existsSync(DB_FILE)) {
            data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
          }
        } catch (err) {}
        await pool.query('INSERT INTO app_state (id, data) VALUES (1, $1) ON CONFLICT (id) DO NOTHING', [JSON.stringify(data)]);
      }
    })();
  }
  return ensureTablePromise;
}

let isTableInitialized = false;

async function readDb(): Promise<LocalDb> {
console.log("readDb start, pool:", !!pool, "isTableInitialized:", isTableInitialized);
  if (pool) {
    if (!isTableInitialized) {
      await ensureTable();
      isTableInitialized = true;
    }
    const { rows } = await pool.query('SELECT data FROM app_state WHERE id = 1');
    return rows[0].data;
  }

  // Fallback to local_db.json
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading local_db.json:', err);
  }
  return {
    drivers: [],
    trips: [],
    activityLogs: [],
    gasConfig: { webAppUrl: '', autoSyncOnComplete: true, syncStatus: 'IDLE' }
  };
}

async function writeDb(data: LocalDb) {
  if (pool) {
    if (!isTableInitialized) {
      await ensureTable();
      isTableInitialized = true;
    }
    await pool.query('UPDATE app_state SET data = $1 WHERE id = 1', [JSON.stringify(data)]);
    return;
  }

  // Fallback to local_db.json
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to local_db.json:', err);
  }
}

// Trigger Google Apps Script Sync if configured
async function triggerGasSyncIfEnabled(db: LocalDb, triggerReason: string) {
  const { webAppUrl, autoSyncOnComplete } = db.gasConfig;
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    return;
  }
  if (!autoSyncOnComplete && triggerReason === 'AUTO') {
    return;
  }

  const url = webAppUrl.trim();
  if (url.includes('docs.google.com/spreadsheets') || url.includes('/edit')) {
    db.gasConfig.syncStatus = 'ERROR';
    db.gasConfig.lastErrorMessage = "URL Error: You entered a Google Sheet link. Please deploy your script (Deploy ➔ New deployment ➔ Web App) and paste the Web App URL ending in /exec.";
    await writeDb(db);
    return;
  }

  try {
    db.gasConfig.syncStatus = 'SYNCING';
    await writeDb(db);

    const payload = {
      action: 'SYNC_DISPATCH_DATA',
      timestamp: new Date().toISOString(),
      reason: triggerReason,
      trips: db.trips,
      drivers: db.drivers,
      activityLogs: db.activityLogs
    };

    console.log(`[GAS SYNC DEBUG] POSTing dispatch data to GAS URL: ${url} (Reason: ${triggerReason})`);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });

    const contentType = res.headers.get('content-type') || '';
    console.log(`[GAS SYNC DEBUG] HTTP Status: ${res.status} ${res.statusText}`);
    console.log(`[GAS SYNC DEBUG] Content-Type: ${contentType}`);

    const rawText = await res.text();
    console.log(`[GAS SYNC DEBUG] Response length: ${rawText.length} chars. Snippet: ${rawText.slice(0, 200).replace(/\s+/g, ' ')}`);

    const isJsonContentType = contentType.toLowerCase().includes('application/json');
    const isHtmlBody = rawText.trim().startsWith('<') || rawText.toLowerCase().includes('<!doctype html');

    if (!isJsonContentType || isHtmlBody) {
      console.error(`[GAS SYNC DEBUG ERROR] Received HTML/non-JSON response instead of JSON from Google Apps Script. Content-Type: '${contentType}'`);
      console.error(`[GAS SYNC DEBUG ERROR] HTML snippet: ${rawText.slice(0, 500)}`);
      db.gasConfig.syncStatus = 'ERROR';
      db.gasConfig.lastErrorMessage = "Apps Script returned HTML/non-JSON response instead of JSON. Ensure Deployment settings: 'Execute as: Me' and 'Who has access: Anyone'.";
    } else if (res.ok) {
      db.gasConfig.syncStatus = 'SUCCESS';
      db.gasConfig.lastSyncTimestamp = new Date().toISOString();
      db.gasConfig.lastErrorMessage = undefined;
    } else {
      console.error(`[GAS SYNC DEBUG ERROR] HTTP Error ${res.status}: ${res.statusText}`);
      db.gasConfig.syncStatus = 'ERROR';
      db.gasConfig.lastErrorMessage = `GAS HTTP error: ${res.status} ${res.statusText}`;
    }
  } catch (error: any) {
    console.error('Failed to sync to Google Apps Script:', error);
    db.gasConfig.syncStatus = 'ERROR';
    db.gasConfig.lastErrorMessage = error?.message || 'Network error connecting to Apps Script Web App';
  }
  await writeDb(db);
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/health', async (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Drivers Endpoints
  app.get('/api/drivers', async (_req, res) => {
    const db = await readDb();
    res.json(db.drivers);
  });

  app.post('/api/drivers', async (req, res) => {
    const db = await readDb();
    const { name, phone, pin, vehicleModel, licensePlate, adminRole } = req.body;
    
    if (!name || !pin) {
      res.status(400).json({ error: 'Name and 4-digit PIN are required' });
      return;
    }

    const newDriver = {
      id: `DRV-${100 + db.drivers.length + 1}`,
      name,
      phone: phone || '',
      pin: pin || '1234',
      isAvailable: true,
      vehicleModel: vehicleModel || 'Standard Executive Sedan',
      licensePlate: licensePlate || 'CPT-1000',
      adminRole: Boolean(adminRole),
      totalCompletedJobs: 0,
      rating: 5.0
    };

    db.drivers.push(newDriver);
    await writeDb(db);
    triggerGasSyncIfEnabled(db, 'AUTO');
    res.status(201).json(newDriver);
  });

  app.post('/api/drivers/login', async (req, res) => {
    const db = await readDb();
    const { pin } = req.body;
    const cleanPin = String(pin || '').trim();
    if (!cleanPin) {
      res.status(400).json({ error: 'PIN is required' });
      return;
    }
    const driver = db.drivers.find((d: any) => {
      const p1 = String(d.pin || '').trim();
      const p2 = String(d['PIN'] || '').trim();
      return p1 === cleanPin || p2 === cleanPin;
    });
    if (!driver) {
      res.status(401).json({ error: 'Invalid 4-digit PIN code' });
      return;
    }
    res.json(driver);
  });

  app.patch('/api/drivers/:id', async (req, res) => {
    const db = await readDb();
    const { id } = req.params;
    const driverIndex = db.drivers.findIndex((d: any) => d.id === id);
    if (driverIndex === -1) {
      res.status(404).json({ error: 'Driver not found' });
      return;
    }

    const updated = { ...db.drivers[driverIndex], ...req.body };
    db.drivers[driverIndex] = updated;
    await writeDb(db);
    triggerGasSyncIfEnabled(db, 'AUTO');
    res.json(updated);
  });

  // Trips Endpoints
  app.get('/api/trips', async (_req, res) => {
    try {
    const db = await readDb();
        res.json(db.trips);
  } catch (err) {
    console.error("trips error", err);
    res.status(500).json({ error: err ? String(err) : "Unknown error", stack: err && err.stack });
  }
});
/*
    const db = await readDb();
    res.json(db.trips);
  });

  */
app.post('/api/trips', async (req, res) => {
    const db = await readDb();
    const tripData = req.body;

    const tripId = `TRP-2026-${Math.floor(8800 + Math.random() * 1000)}`;
    const now = new Date().toISOString();

    const newTrip = {
      id: tripId,
      passengerName: tripData.passengerName || 'Guest Passenger',
      passengerPhone: tripData.passengerPhone || '',
      passengerCount: tripData.passengerCount || 1,
      pickupAddress: tripData.pickupAddress || 'Downtown Hub',
      dropoffAddress: tripData.dropoffAddress || 'City Airport',
      pickupDate: tripData.pickupDate || now.slice(0, 10),
      pickupTime: tripData.pickupTime || '12:00',
      isRoundTrip: Boolean(tripData.isRoundTrip),
      vehicleType: tripData.vehicleType || 'STANDARD_SEDAN',
      estimatedDistanceKm: Number(tripData.estimatedDistanceKm) || 15.0,
      paymentAmount: Number(tripData.paymentAmount) || 50.0,
      paymentDriver: Number(tripData.paymentDriver) || 37.5,
      grossProfit: Number(tripData.grossProfit) || 12.5,
      statusOps: 'UNASSIGNED',
      statusAdmin: 'PENDING',
      specialNotes: tripData.specialNotes || '',
      createdAt: now,
      updatedAt: now
    };

    db.trips.unshift(newTrip);
    await writeDb(db);
    triggerGasSyncIfEnabled(db, 'AUTO');
    res.status(201).json(newTrip);
  });

  app.patch('/api/trips/:id', async (req, res) => {
    const db = await readDb();
    const { id } = req.params;
    const tripIndex = db.trips.findIndex((t: any) => t.id === id);
    if (tripIndex === -1) {
      res.status(404).json({ error: 'Trip dispatch not found' });
      return;
    }

    const prevTrip = db.trips[tripIndex];
    const now = new Date().toISOString();
    const patchData = { ...req.body, updatedAt: now };

    // Handle completed transition
    if (req.body.statusOps === 'COMPLETED' && prevTrip.statusOps !== 'COMPLETED') {
      patchData.completedAt = now;

      // Add to activity logs
      const driverName = req.body.assignedDriverName || prevTrip.assignedDriverName || 'Driver';
      const routeStr = `${prevTrip.pickupAddress} → ${prevTrip.dropoffAddress}`;
      const newActivity = {
        id: `ACT-${Date.now().toString().slice(-4)}`,
        tripId: prevTrip.id,
        driverName,
        route: routeStr,
        payout: patchData.paymentDriver || prevTrip.paymentDriver,
        timestamp: now
      };
      db.activityLogs.unshift(newActivity);
      if (db.activityLogs.length > 20) {
        db.activityLogs = db.activityLogs.slice(0, 20);
      }

      // Increment driver completed jobs and apply rating
      const driverId = req.body.assignedDriverId || prevTrip.assignedDriverId;
      if (driverId) {
        const dIdx = db.drivers.findIndex((d: any) => d.id === driverId);
        if (dIdx !== -1) {
          const prevJobsCount = db.drivers[dIdx].totalCompletedJobs || 0;
          db.drivers[dIdx].totalCompletedJobs = prevJobsCount + 1;

          if (typeof patchData.passengerRating === 'number') {
            const currentRating = db.drivers[dIdx].rating || 5.0;
            // Simple running average using totalCompletedJobs
            const newAvg = ((currentRating * prevJobsCount) + patchData.passengerRating) / (prevJobsCount + 1);
            db.drivers[dIdx].rating = parseFloat(newAvg.toFixed(1));
          }
        }
      }
    }

    const updatedTrip = { ...prevTrip, ...patchData };
    db.trips[tripIndex] = updatedTrip;
    await writeDb(db);
    triggerGasSyncIfEnabled(db, 'AUTO');
    res.json(updatedTrip);
  });

  app.delete('/api/trips/:id', async (req, res) => {
    const db = await readDb();
    const { id } = req.params;
    db.trips = db.trips.filter((t: any) => t.id !== id);
    await writeDb(db);
    triggerGasSyncIfEnabled(db, 'AUTO');
    res.json({ success: true, message: 'Trip removed' });
  });

  // Activity Stream Endpoints
  app.get('/api/activity', async (_req, res) => {
    const db = await readDb();
    res.json(db.activityLogs.slice(0, 5));
  });

  // Google Apps Script Config & Manual Sync
  app.get('/api/gas-config', async (_req, res) => {
    const db = await readDb();
    res.json(db.gasConfig);
  });

  app.post('/api/gas-config', async (req, res) => {
    const db = await readDb();
    db.gasConfig = { ...db.gasConfig, ...req.body };
    await writeDb(db);
    res.json(db.gasConfig);
  });

  app.post('/api/sync-gas', async (_req, res) => {
    const db = await readDb();
    if (!db.gasConfig.webAppUrl) {
      res.status(400).json({ error: 'Google Apps Script Web App URL is not configured' });
      return;
    }
    await triggerGasSyncIfEnabled(db, 'MANUAL');
    res.json(db.gasConfig);
  });

  app.post('/api/import-gas', async (_req, res) => {
    const db = await readDb();
    if (!db.gasConfig.webAppUrl) {
      res.status(400).json({ error: 'Google Apps Script Web App URL is not configured' });
      return;
    }

    const url = db.gasConfig.webAppUrl.trim();
    if (url.includes('docs.google.com/spreadsheets') || url.includes('/edit')) {
      const msg = "URL Error: You entered a Google Sheet or Script Editor link instead of the Web App Exec URL. In Google Sheets, click Extensions ➔ Apps Script ➔ Deploy ➔ New deployment ➔ Web App, and paste the URL ending in /exec.";
      db.gasConfig.syncStatus = 'ERROR';
      db.gasConfig.lastErrorMessage = msg;
      await writeDb(db);
      res.status(400).json({ error: msg, gasConfig: db.gasConfig });
      return;
    }

    try {
      console.log(`[GAS IMPORT DEBUG] Fetching Google Apps Script URL: ${url}`);
      const response = await fetch(url, { method: 'GET', redirect: 'follow' });
      const contentType = response.headers.get('content-type') || '';
      console.log(`[GAS IMPORT DEBUG] HTTP Status: ${response.status} ${response.statusText}`);
      console.log(`[GAS IMPORT DEBUG] Content-Type Header: ${contentType}`);

      const rawText = await response.text();
      console.log(`[GAS IMPORT DEBUG] Raw Response Body Length: ${rawText.length} chars.`);
      console.log(`[GAS IMPORT DEBUG] Raw Response Snippet: ${rawText.slice(0, 500).replace(/\s+/g, ' ')}`);

      if (!response.ok) {
        console.error(`[GAS IMPORT DEBUG ERROR] HTTP ${response.status} ${response.statusText}. Response body snippet: ${rawText.slice(0, 300)}`);
        throw new Error(`Google Apps Script responded with status ${response.status} ${response.statusText}`);
      }

      const isJsonContentType = contentType.toLowerCase().includes('application/json');
      const isHtmlBody = rawText.trim().startsWith('<') || rawText.toLowerCase().includes('<!doctype html');

      if (!isJsonContentType || isHtmlBody) {
        console.error(`[GAS IMPORT DEBUG ERROR] HTML/Non-JSON response detected instead of expected JSON.`);
        console.error(`[GAS IMPORT DEBUG ERROR] Content-Type: '${contentType}'. Is HTML Body: ${isHtmlBody}`);
        console.error(`[GAS IMPORT DEBUG ERROR] Full Response snippet: ${rawText.slice(0, 500)}`);
        
        let subHint = "Please check Web App Deployment settings: 1) Go to Apps Script ➔ Deploy ➔ New deployment / Manage deployments. 2) Set 'Execute as: Me' and 'Who has access: Anyone'. 3) Copy the new Web App URL ending in /exec.";
        if (rawText.includes('Service Login') || rawText.includes('accounts.google.com')) {
          subHint = "Google Login Page Redirect Detected: The Apps Script Web App 'Who has access' setting is restricted to 'Only myself' instead of 'Anyone'.";
        } else if (response.status === 404 || rawText.includes('404')) {
          subHint = "404 Not Found: The Web App URL is invalid or deployment not found.";
        }
        throw new Error(`Apps Script returned non-JSON response (Content-Type: ${contentType || 'none'}). ${subHint}`);
      }

      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch (pErr) {
        console.error(`[GAS IMPORT DEBUG ERROR] Failed to parse JSON string. Content-Type: '${contentType}', Raw response snippet: ${rawText.slice(0, 300)}`);
        throw new Error("Failed to parse JSON response from Google Apps Script. Please verify your doGet script.");
      }

      if (data.status === 'SUCCESS') {
        if (Array.isArray(data.trips) && data.trips.length > 0) {
          db.trips = data.trips.map((raw: any, idx: number) => ({
            id: raw.id || raw['Job ID'] || raw['Request_ID'] || `TRP-2026-${8800 + idx}`,
            passengerName: raw.passengerName || raw['Nama_Pelanggan'] || 'Passenger',
            passengerPhone: raw.passengerPhone || raw['Nombor_Telefon_Pelanggan'] || '',
            passengerCount: Number(raw.passengerCount || raw['Bil_Penumpang']) || 1,
            pickupAddress: raw.pickupAddress || raw['Lokasi_Jemput(Pick Up)'] || 'Pickup Location',
            dropoffAddress: raw.dropoffAddress || raw['Lokasi _Hantar(Drop off)'] || raw['Lokasi_Hantar(Drop off)'] || 'Dropoff Location',
            pickupDate: raw.pickupDate || raw['Tarikh_Jemput Pilihan(Pick Up)'] || new Date().toISOString().slice(0, 10),
            pickupTime: raw.pickupTime || raw['Masa_Jemput_Pilihan(Pick Up)'] || '10:00',
            isRoundTrip: Boolean(raw.isRoundTrip || String(raw['Round Trip']).toLowerCase() === 'yes' || String(raw['Round Trip']).toLowerCase() === 'true'),
            vehicleType: raw.vehicleType || raw['Jenis_Perkhidmatan'] || 'STANDARD_SEDAN',
            estimatedDistanceKm: Number(raw.estimatedDistanceKm) || 15.0,
            paymentAmount: Number(raw.paymentAmount || raw['Payment_Amount']) || 0,
            paymentDriver: Number(raw.paymentDriver || raw['Payment_Driver']) || 0,
            grossProfit: Number(raw.grossProfit || raw['Gross_Profit']) || 0,
            statusOps: (raw.statusOps || raw['Status_Ops'] || 'UNASSIGNED').toUpperCase(),
            statusAdmin: (raw.statusAdmin || raw['Status_Admin'] || 'PENDING').toUpperCase(),
            assignedDriverId: raw.assignedDriverId || '',
            assignedDriverName: raw.assignedDriverName || '',
            specialNotes: raw.specialNotes || raw['Permintaan_Khas'] || '',
            createdAt: raw.createdAt || raw['Job_Created'] || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));
        }

        if (Array.isArray(data.drivers) && data.drivers.length > 0) {
          db.drivers = data.drivers.map((raw: any, idx: number) => {
            const rawPin = raw.pin ?? raw['PIN'] ?? raw['Pin'] ?? raw['pin_code'] ?? '1234';
            const cleanPin = String(rawPin).trim() || '1234';
            return {
              id: raw.id || `DRV-${101 + idx}`,
              name: raw.name || raw['Driver Name'] || `Driver ${idx + 1}`,
              'Driver Name': raw['Driver Name'] || raw.name || `Driver ${idx + 1}`,
              phone: raw.phone || raw['Phone Number'] || '',
              'Phone Number': raw['Phone Number'] || raw.phone || '',
              pin: cleanPin,
              PIN: cleanPin,
              isAvailable: raw.isAvailable !== undefined ? Boolean(raw.isAvailable) : (String(raw['Is_Available']).toUpperCase() === 'ON-DUTY' || String(raw['Is_Available']).toUpperCase() === 'TRUE'),
              vehicleModel: raw.vehicleModel || 'Executive Fleet Sedan',
              licensePlate: raw.licensePlate || `CPT-${1000 + idx}`,
              adminRole: raw.adminRole !== undefined ? Boolean(raw.adminRole) : (String(raw['Admin Role']).toUpperCase() === 'TRUE' || String(raw['Admin Role']).toUpperCase() === 'YES'),
              totalCompletedJobs: Number(raw.totalCompletedJobs) || 25,
              rating: Number(raw.rating) || 4.9
            };
          });
        }

        db.gasConfig.syncStatus = 'SUCCESS';
        db.gasConfig.lastSyncTimestamp = new Date().toISOString();
        db.gasConfig.lastErrorMessage = undefined;
        await writeDb(db);
        res.json({ success: true, trips: db.trips, drivers: db.drivers, gasConfig: db.gasConfig });
      } else {
        throw new Error(data.message || 'Failed to read from Google Sheet');
      }
    } catch (err: any) {
      db.gasConfig.syncStatus = 'ERROR';
      db.gasConfig.lastErrorMessage = err?.message || 'Error pulling data from Google Sheet';
      await writeDb(db);
      res.status(500).json({ error: db.gasConfig.lastErrorMessage, gasConfig: db.gasConfig });
    }
  });

  // AI Dispatch Optimizer (Gemini 3.1 Pro with ThinkingLevel.HIGH)
  app.post('/api/ai-optimize', async (req, res) => {
    try {
      if (!ai) {
        res.status(503).json({
          error: 'Gemini API Key is not configured in server environment.'
        });
        return;
      }

      const { prompt, contextType, tripData, driversData } = req.body;
      const systemInstruction = `You are Lady Driver Dispatch AI, an intelligent fleet operations and dispatch decision engine for Lady Driver Dispatch Logistics Inc.
Your goal is to evaluate driver availability, route distances, peak hours, fare disputes, and rate calculations.
Respond in clear, structured markdown with explicit actionable recommendations for dispatchers and fleet administrators.`;

      const userContent = `Context: ${contextType || 'GENERAL_DISPATCH'}
User Prompt: ${prompt}

Current Active Trip / Dispute Data:
${JSON.stringify(tripData || {}, null, 2)}

Fleet Drivers State:
${JSON.stringify(driversData || [], null, 2)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: userContent,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH
          }
        }
      });

      res.json({ recommendation: response.text });
    } catch (err: any) {
      console.error('Gemini AI Optimization Error:', err);
      res.status(500).json({ error: err?.message || 'Failed to generate AI dispatch recommendation' });
    }
  });

  // Determine which entry point to serve based on VITE_APP_MODE
  const appMode = process.env.VITE_APP_MODE?.toLowerCase();
  const defaultHtml = appMode && ['passenger', 'admin', 'driver'].includes(appMode) 
    ? `${appMode}.html` 
    : 'index.html';

  // Mount Vite Middleware in Development, or Static files in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);
    
    // Custom catch-all to serve the correct HTML
    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        if (url === '/' || !url.includes('.')) {
          let template = await fs.promises.readFile(path.resolve(process.cwd(), defaultHtml), 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } else {
          next();
        }
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', async (_req, res) => {
      res.sendFile(path.join(distPath, defaultHtml));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Lady Driver Dispatch Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
