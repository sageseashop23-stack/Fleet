const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The goal is to make sure it compiles. Let's just fix the end manually.
// Actually, I'll just use a clean known good state from a few steps ago if possible,
// or I'll just write a script to fix the brackets.

content = content.replace(/      <\/div>\n  \);\n\}\n      <\/div>\n      \)\}\n    <\/>\n  \);\n\}/g, '');
content += `
      {/* Modals */}
      <MonthlyEarningsReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        drivers={drivers}
        trips={trips}
      />

      <AppsScriptModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        gasConfig={gasConfig}
        onSaveConfig={handleSaveGasConfig}
        onTriggerManualSync={handleTriggerManualGasSync}
        onImportData={handleImportGasData}
      />

      <AiDispatchModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        trips={trips}
        drivers={drivers}
      />
      </div>
      )}
    </>
  );
}
`;
fs.writeFileSync('src/App.tsx', content);
