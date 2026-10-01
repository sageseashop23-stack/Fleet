const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add useState
code = code.replace("import React from 'react';", "import React, { useState } from 'react';");

// 2. Add HelpCircle, X, Mail, Phone to lucide-react import
code = code.replace("import { LogIn, LogOut, Car, LayoutDashboard, Route } from 'lucide-react';", "import { LogIn, LogOut, Car, LayoutDashboard, Route, HelpCircle, X, Mail, Phone } from 'lucide-react';");

// 3. Add state to App component
code = code.replace("const { user, loading, login, logout } = useAuth();", "const { user, loading, login, logout } = useAuth();\n  const [isSupportOpen, setIsSupportOpen] = useState(false);");

// 4. Add footer and modal
const footerAndModal = `        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <button 
          onClick={() => setIsSupportOpen(true)}
          className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-[#7a837b] hover:text-[#2a2928] transition-colors"
        >
          <HelpCircle className="w-4 h-4" /> Help & Support
        </button>
      </footer>

      {/* Support Modal */}
      {isSupportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsSupportOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#edf4f4] text-[#3d7a78] mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-serif text-[#29302a] mb-2">How can we help?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Our support team is available 24/7. Reach out to us via email or call our hotline for immediate assistance.
            </p>
            <div className="flex flex-col gap-3">
              <a href="mailto:support@ladydriver.com" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[#3d7a78] hover:bg-[#edf4f4] transition-colors text-sm font-semibold text-gray-800">
                <Mail className="w-4 h-4 text-[#3d7a78]" />
                support@ladydriver.com
              </a>
              <a href="tel:+60123456789" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[#b92f55] hover:bg-[#f9e4e9] transition-colors text-sm font-semibold text-gray-800">
                <Phone className="w-4 h-4 text-[#b92f55]" />
                +60 12-345 6789
              </a>
            </div>
          </div>
        </div>
      )}
    </div>`;

code = code.replace(/        <\/div>\s*<\/main>\s*<\/div>/, footerAndModal);

fs.writeFileSync('src/App.tsx', code);
