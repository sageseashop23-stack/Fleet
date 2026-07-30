import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, RefreshCw, X } from 'lucide-react';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBase: string;
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({
  isOpen,
  onClose,
  apiBase
}) => {
  const [status, setStatus] = useState<'IDLE' | 'CHECKING' | 'ONLINE' | 'OFFLINE'>('IDLE');
  const [latency, setLatency] = useState<number | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');

  const checkConnectivity = async () => {
    setStatus('CHECKING');
    setLatency(null);
    setErrorDetails('');
    const startTime = Date.now();

    try {
      // Use no-cache to ensure we hit the network
      const res = await fetch(`${apiBase}/api/health`, { cache: 'no-store' });
      const endTime = Date.now();
      
      if (res.ok) {
        setStatus('ONLINE');
        setLatency(endTime - startTime);
      } else {
        setStatus('OFFLINE');
        setErrorDetails(`HTTP Error: ${res.status} ${res.statusText}`);
      }
    } catch (err: any) {
      setStatus('OFFLINE');
      setErrorDetails(err.message || 'Network request failed (possible CORS or offline issue)');
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkConnectivity();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-sm tracking-wide">API Diagnostics</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase">Target Endpoint</p>
            <div className="font-mono text-xs text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 break-all">
              {apiBase || window.location.origin}/api/health
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
              <div className="flex items-center gap-2 mt-1">
                {status === 'CHECKING' && <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />}
                {status === 'ONLINE' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                {status === 'OFFLINE' && <XCircle className="w-4 h-4 text-rose-500" />}
                
                <span className={`font-bold text-sm ${
                  status === 'ONLINE' ? 'text-emerald-600' :
                  status === 'OFFLINE' ? 'text-rose-600' :
                  'text-slate-600'
                }`}>
                  {status === 'IDLE' ? 'Ready' :
                   status === 'CHECKING' ? 'Checking...' :
                   status === 'ONLINE' ? 'Online & Reachable' :
                   'Connection Failed'}
                </span>
              </div>
            </div>

            {status === 'ONLINE' && latency !== null && (
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-slate-500 uppercase">Latency</span>
                <span className="font-mono text-sm font-bold text-emerald-600">{latency}ms</span>
              </div>
            )}
          </div>

          {status === 'OFFLINE' && (
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
              <p className="text-xs font-bold text-rose-800 mb-1">Error Details</p>
              <p className="text-xs text-rose-600 font-mono">{errorDetails}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={checkConnectivity}
            disabled={status === 'CHECKING'}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${status === 'CHECKING' ? 'animate-spin' : ''}`} />
            Run Test Again
          </button>
        </div>
      </div>
    </div>
  );
};
