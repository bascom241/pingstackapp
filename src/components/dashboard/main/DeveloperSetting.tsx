import React, { useState } from 'react';
// Lucide Icons
import { History, Copy, Check, Eye, EyeOff, Key as KeyIcon, Link as LinkIcon } from 'lucide-react';

export default function DeveloperSettings() {
  // State for handling masking/unmasking the API Key
  const [showApiKey, setShowApiKey] = useState(false);
  
  // State for handling copy feedback alerts
  const [copiedType, setCopiedType] = useState(null); // 'key' | 'url' | null

  const apiKey = "TLXPUNKAKDhaHEElfqaBtKCVFKNJcdnsOYqwvvBjgBkFYUMDcPQpFfdOngqyV";
  const baseUrl = "https://v1.api.pingstack.com";

  // Clipboard copy function
  const handleCopy = (text:any, type: any ) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000); // Reset after 2 seconds
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 font-sans">
      
      {/* 1. Transaction History Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 gap-2">
          <div className="flex items-center gap-2 text-gray-700 min-w-0">
            <History className="w-5 h-5 text-emerald-500 stroke-[1.5] shrink-0" />
            <span className="font-medium text-sm sm:text-[15px] truncate">Transaction History</span>
          </div>
          <button className="text-gray-500 hover:text-gray-800 text-xs sm:text-sm font-medium transition-colors shrink-0">
            View transactions
          </button>
        </div>
        
        {/* Empty State */}
        <div className="bg-slate-50/50 border border-dashed border-gray-100 rounded-xl py-10 sm:py-12 flex flex-col items-center justify-center px-4 text-center">
          {/* Subtle ghost history icon background */}
          <History className="w-10 h-10 text-gray-200/70 mb-2 stroke-[1]" />
          <p className="text-gray-400 text-sm sm:text-[15px]">No recent transaction recorded yet</p>
        </div>
      </div>

      {/* 2. Credentials Section (API Key & Base URL) */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
        
        {/* API Key Sub-section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <KeyIcon className="text-emerald-600 w-[18px] h-[18px] transform rotate-[-45deg] shrink-0" />
              <span className="font-semibold text-gray-800 text-sm sm:text-[15px]">API Key</span>
              <button 
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors shrink-0"
                title={showApiKey ? "Hide Key" : "Show Key"}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <button 
              onClick={() => handleCopy(apiKey, 'key')}
              className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 text-xs sm:text-sm font-medium transition-colors shrink-0"
            >
              {copiedType === 'key' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Copy code</span>
                </>
              )}
            </button>
          </div>

          {/* Value Display Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 sm:p-4 min-h-[56px] flex items-center select-all font-mono text-[11px] sm:text-xs md:text-sm text-gray-600 tracking-wide overflow-hidden [word-break:break-all]">
            <span className={showApiKey ? "w-full" : "blur-[4px] select-none pointer-events-none tracking-widest truncate w-full"}>
              {showApiKey ? apiKey : apiKey.substring(0, 35) + "..."}
            </span>
          </div>
        </div>

        {/* Separator Line */}
        <hr className="border-gray-100" />

        {/* Base URL Sub-section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <LinkIcon className="text-red-500 w-[18px] h-[18px] shrink-0" />
              <span className="font-semibold text-gray-800 text-sm sm:text-[15px]">Base URL</span>
            </div>
            
            <button 
              onClick={() => handleCopy(baseUrl, 'url')}
              className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 text-xs sm:text-sm font-medium transition-colors shrink-0"
            >
              {copiedType === 'url' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Copy url</span>
                </>
              )}
            </button>
          </div>

          {/* Value Display Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 sm:p-4 flex items-center font-mono text-xs sm:text-sm text-gray-600 overflow-x-auto whitespace-nowrap scrollbar-none">
            {baseUrl}
          </div>
        </div>

      </div>

    </div>
  );
}