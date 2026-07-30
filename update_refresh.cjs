const fs = require('fs');

const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `  const refreshData = async () => {
    try {
      const [tripsRes, driversRes, actRes, gasRes] = await Promise.all([
        fetch(\`\${apiBase}/api/trips\`).then((r) => (r.ok ? r.json() : null)),
        fetch(\`\${apiBase}/api/drivers\`).then((r) => (r.ok ? r.json() : null)),
        fetch(\`\${apiBase}/api/activity\`).then((r) => (r.ok ? r.json() : null)),
        fetch(\`\${apiBase}/api/gas-config\`).then((r) => (r.ok ? r.json() : null))
      ]);

      if (tripsRes) setTrips(tripsRes);
      if (driversRes) setDrivers(driversRes);
      if (actRes) setActivities(actRes);
      if (gasRes) setGasConfig(gasRes);
    } catch (err) {
      if (!(window as any).__apiWarningLogged) { console.warn('Amaran sambungan API Backend, menggunakan keadaan setempat (akan disenyapkan untuk cubaan seterusnya):', err); (window as any).__apiWarningLogged = true; }
    }
  };`;

const replacement = `  const refreshData = async () => {
    try {
      const fetchWithLog = async (url: string) => {
        try {
          const r = await fetch(url);
          if (!r.ok) {
            console.error(\`API Response Error for \${url}: \${r.status} \${r.statusText}\`);
            return null;
          }
          return await r.json();
        } catch (e: any) {
          throw new Error(\`Network error fetching \${url}: \${e.message}\`);
        }
      };

      const [tripsRes, driversRes, actRes, gasRes] = await Promise.all([
        fetchWithLog(\`\${apiBase}/api/trips\`),
        fetchWithLog(\`\${apiBase}/api/drivers\`),
        fetchWithLog(\`\${apiBase}/api/activity\`),
        fetchWithLog(\`\${apiBase}/api/gas-config\`)
      ]);

      if (tripsRes) setTrips(tripsRes);
      if (driversRes) setDrivers(driversRes);
      if (actRes) setActivities(actRes);
      if (gasRes) setGasConfig(gasRes);
    } catch (err: any) {
      if (!(window as any).__apiWarningLogged) { 
        console.error('API Fetch Failed Completely:', err);
        console.error('Target API Base URL:', apiBase);
        console.error('Please verify if VITE_API_BASE_URL is reachable and configured correctly (e.g. CORS, network policies).');
        (window as any).__apiWarningLogged = true; 
      }
    }
  };`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync(file, code);
  console.log('Replaced successfully');
} else {
  console.log('Target not found');
}
