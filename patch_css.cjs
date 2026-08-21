const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const newCSS = `
:root { 
  --ink:#171717; 
  --paper:#f7f7f5; 
  --line:#e5e5df; 
  --rose:#d85173; 
  --lime:#c8f264; 
  --ink-admin: #171715; 
  --paper-admin: #f4f3ee;
  --line-admin: #dfded6;
  --rose-admin: #ca4568;
  --lime-admin: #d2f276;
  --ink-rep: #232722;
  --muted-rep: #69716b;
  --line-rep: #dde1db;
  --paper-rep: #fbfaf5;
  --surface-rep: #ffffff;
  --slate-rep: #f0f3f1;
  --green-rep: #55725a;
  --green-soft-rep: #e7f0e4;
  --rose-rep: #a55a68;
  --ink-dr: #253039;
  --muted-dr: #71808d;
  --paper-dr: #f8f7f3;
  --line-dr: #dce3e6;
  --blue-dr: #3e7294;
  --blue-soft-dr: #e9f3f7;
  --emerald-dr: #4e806d;
  --emerald-soft-dr: #e9f3ed;
  --rose-dr: #a55c68;
}

.display-font { font-family:"Fraunces",serif; }
.app-shell-passenger { min-height:calc(100 * min(var(--vh, 1vh), 1vh)); background:radial-gradient(circle at 92% 0%,rgba(200,242,100,.34),transparent 25rem),radial-gradient(circle at 2% 24%,rgba(216,81,115,.10),transparent 28rem),#f7f7f5; }
.app-shell-admin { min-height:calc(100 * min(var(--vh, 1vh), 1vh)); background:radial-gradient(circle at 96% 2%,rgba(210,242,118,.42),transparent 26rem),radial-gradient(circle at 4% 80%,rgba(202,69,104,.09),transparent 28rem),var(--paper-admin); }
.report-shell { background: radial-gradient(circle at 88% 2%, rgba(198, 213, 220, .58), transparent 25%), radial-gradient(circle at 4% 75%, rgba(234, 238, 217, .55), transparent 25%), #fbfaf5; }
.app-shell-driver { background: radial-gradient(circle at 96% 0%, rgba(203, 225, 235, .68), transparent 26rem), radial-gradient(circle at 0% 84%, rgba(233, 240, 219, .58), transparent 24rem), var(--paper-dr); }

.surface-passenger { background:rgba(255,255,255,.83); border:1px solid rgba(255,255,255,.98); box-shadow:0 18px 50px rgba(24,24,21,.08); backdrop-filter:blur(16px); }
.surface-admin { background:rgba(255,255,252,.83); border:1px solid rgba(255,255,255,.9); box-shadow:0 18px 55px rgba(26,25,21,.07); backdrop-filter:blur(14px); }

.field-passenger { width:100%; border:1px solid #deded8; background:#fff; border-radius:1rem; padding:.875rem 1rem; outline:none; transition:.2s; }
.field-passenger:focus { border-color:#d85173; box-shadow:0 0 0 4px rgba(216,81,115,.10); }

.field-admin { width:100%; border:1px solid #ddddd5; border-radius:.9rem; background:#fff; padding:.7rem .8rem; font-size:.82rem; outline:none; transition:.2s ease; }
.field-admin:focus { border-color:var(--rose-admin); box-shadow:0 0 0 4px rgba(202,69,104,.12); }

.report-card { box-shadow: 0 10px 28px rgba(49, 58, 48, .07); transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease; }
.report-card:hover { transform: translateY(-2px); border-color: rgba(85, 114, 90, .42); box-shadow: 0 16px 34px rgba(49, 58, 48, .11); }
.ledger-row { transition: background-color 160ms ease; }
.ledger-row:hover { background: #f7f8f5; }
.metric-value { font-variant-numeric: tabular-nums; }
.metric-number { font-variant-numeric: tabular-nums; }
.status-dot { box-shadow: 0 0 8px currentColor; }

.subtle-card { transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease; }
.subtle-card:hover { transform: translateY(-2px); border-color: #bed0d9; box-shadow: 0 14px 28px rgba(47, 70, 81, .07); }
.status-pulse { box-shadow: 0 0 0 4px rgba(78, 128, 109, .10); }
`;

if (!code.includes('.display-font')) {
  fs.writeFileSync('src/index.css', code + '\n' + newCSS);
}
