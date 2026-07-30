import React, { useState } from 'react';
import { Trip, Driver } from '../types';
import { Bot, Sparkles, Send, RefreshCw, X, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AiDispatchModalProps {
  isOpen: boolean;
  onTutup: () => void;
  trips: Trip[];
  drivers: Driver[];
}

export const AiDispatchModal: React.FC<AiDispatchModalProps> = ({
  isOpen,
  onTutup,
  trips,
  drivers
}) => {
  const [prompt, setPrompt] = useState('');
  const [contextType, setContextType] = useState<'ROUTE_DISPATCH' | 'RATE_DISPUTE' | 'FLEET_CAPACITY'>('ROUTE_DISPATCH');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAskAi = async (customPrompt?: string) => {
    const queryText = customPrompt || prompt;
    if (!queryText.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          contextType,
          tripData: trips.slice(0, 5),
          driversData: drivers
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate AI advice.');
      }
      setAiResponse(data.recommendation);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with Gemini AI Server.');
    } finally {
      setIsLoading(false);
    }
  };

  const presetQueries = [
    {
      label: 'Optimize Driver Assignments',
      prompt: 'Review current unassigned and active trips and recommend optimal driver assignments based on vehicle types, driver duty status, and distance efficiency.'
    },
    {
      label: 'Resolve Disputed Rates',
      prompt: 'Evaluate currently flagged DISPUTED trip dispatches. Compare driver calculations against standard distance pricing and suggest fair resolution amounts.'
    },
    {
      label: 'Peak Hour Fleet Readiness',
      prompt: 'Assess current on-duty driver capacity vs unassigned bookings for upcoming hours and suggest dispatch priority strategy.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  AI Dispatch & Route Optimizer
                </h2>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-300">
                  Gemini 3.1 Pro High Reasoning
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Automated driver route matching, dispute auditing, and fleet capacity optimization
              </p>
            </div>
          </div>
          <button onClick={onTutup} className="p-2 text-slate-400 hover:text-slate-600 font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Action Buttons */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Select Automated Reasoning Preset:
          </span>
          <div className="flex flex-wrap gap-2">
            {presetQueries.map((pq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(pq.prompt);
                  handleAskAi(pq.prompt);
                }}
                className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{pq.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Custom Dispatch Query / Scenario Analysis
            </label>
            <select
              value={contextType}
              onChange={(e: any) => setContextType(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-[11px] font-semibold"
            >
              <option value="ROUTE_DISPATCH">Route Dispatch</option>
              <option value="RATE_DISPUTE">Rate Dispute</option>
              <option value="FLEET_CAPACITY">Fleet Capacity</option>
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask AI to evaluate driver shifts, fare anomalies, or route allocations..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => handleAskAi()}
              disabled={isLoading || !prompt.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>{isLoading ? 'Analyzing...' : 'Execute'}</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* AI Output View */}
        {isLoading && (
          <div className="py-8 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Evaluating live dispatch logistics with Gemini 3.1 Pro (Thinking Mode HIGH)...
            </p>
          </div>
        )}

        {aiResponse && !isLoading && (
          <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs leading-relaxed text-slate-800 dark:text-slate-200 max-h-80 overflow-y-auto">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold border-b border-slate-200 dark:border-slate-700 pb-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Dispatch Recommendation Result:</span>
            </div>
            <div className="prose dark:prose-invert prose-xs max-w-none">
              <ReactMarkdown>{aiResponse}</ReactMarkdown>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
