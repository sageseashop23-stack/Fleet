const fs = require('fs');

let adminHtml = fs.readFileSync('admin.html', 'utf-8');
const reportHtml = fs.readFileSync('report.html', 'utf-8');

// 1. Add Navigation Button
const navButtonStr = `
            <button
              data-view="report"
              class="nav-button canva-button flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-bold text-[#5c5b59] transition hover:bg-[#efefed] focus:outline-none focus:ring-4 focus:ring-[#e2e8e8]"
              style="
                color: rgb(92, 91, 89);
                font-weight: 700;
                font-style: normal;
                font-size: 14px;
              "
            >
              <i data-lucide="bar-chart-3" class="h-4 w-4" aria-hidden="true"></i
              >Monthly Report
            </button>
          </div>
`;
adminHtml = adminHtml.replace('</button>\n          </div>', '</button>\n' + navButtonStr);

// 2. Extract report section and template
const reportViewStart = reportHtml.indexOf('<section id="report-view">');
let reportViewEnd = reportHtml.indexOf('</section>\n        <section\n          id="dismissed-view"');
if (reportViewEnd === -1) {
    reportViewEnd = reportHtml.indexOf('</section>\n        <section id="dismissed-view"');
}
if (reportViewEnd === -1) { // Let's use regex
    const m = reportHtml.match(/<section id="report-view">([\s\S]*?)<\/section>\s*<section[^>]*id="dismissed-view"/);
    if (m) {
        reportViewEnd = reportHtml.indexOf(m[0]) + m[0].indexOf('</section>');
    }
}

let reportSectionContent = '';
if (reportViewStart !== -1 && reportViewEnd !== -1) {
    reportSectionContent = reportHtml.substring(reportViewStart, reportViewEnd + 10);
}

// Modify report section id and classes
reportSectionContent = reportSectionContent.replace('<section id="report-view">', '<div id="view-report" class="view-section hidden flex-1 min-w-0 overflow-y-auto bg-[#fbfaef]"><main class="w-full max-w-[1440px] mx-auto px-4 py-5 sm:px-7 sm:py-8 lg:px-12 lg:py-10">');
reportSectionContent = reportSectionContent.replace('</section>', '</main></div>');

// Remove close button
reportSectionContent = reportSectionContent.replace(/<button[^>]*id="close-button"[^>]*>[\s\S]*?<\/button>/, '');


// 3. Extract template
const templateStart = reportHtml.indexOf('<template id="ledger-row-template">');
const templateEnd = reportHtml.indexOf('</template>', templateStart);
const templateContent = reportHtml.substring(templateStart, templateEnd + 11);

// 4. Extract script
const scriptStart = reportHtml.lastIndexOf('<script>');
const scriptEnd = reportHtml.lastIndexOf('</script>');
let scriptContent = reportHtml.substring(scriptStart + 8, scriptEnd);
scriptContent = scriptContent.replace(/document\.addEventListener\("DOMContentLoaded", \(\) => \{/, '');
scriptContent = scriptContent.replace(/\}\);\s*$/, '');
scriptContent = scriptContent.replace(/document\.getElementById\("close-button"\)\.addEventListener[^;]+;/, '');
scriptContent = scriptContent.replace(/document\.getElementById\("reopen-button"\)\.addEventListener[^;]+;/, '');
scriptContent = `
// --- Report Script ---
(function() {
${scriptContent}
})();
`;

// 5. Inject into adminHtml
const viewsEndIdx = adminHtml.indexOf('</main>');
adminHtml = adminHtml.substring(0, viewsEndIdx) + '\n' + reportSectionContent + '\n' + adminHtml.substring(viewsEndIdx);

adminHtml = adminHtml.replace('</body>', templateContent + '\n</body>');

adminHtml = adminHtml.replace('lucide.createIcons();\n    });', scriptContent + '\n      lucide.createIcons();\n    });');

fs.writeFileSync('admin.html', adminHtml);
console.log('Merge complete.');
