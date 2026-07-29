const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

let fixedContent = content.substring(0, content.lastIndexOf('      {/* Modals */}'));
fixedContent += `
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
fs.writeFileSync('src/App.tsx', fixedContent);
