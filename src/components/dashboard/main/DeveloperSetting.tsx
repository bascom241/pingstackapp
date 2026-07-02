import React, { useState } from 'react';
import { History, Copy, Check, Eye, EyeOff, Key as KeyIcon, Link as LinkIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAllHistory } from '../../../features/wallet/hooks/useTransaction';

export default function DeveloperSettings() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedType, setCopiedType] = useState<'key' | 'url' | null>(null);

  // Track current page state (Spring Data JPA is 0-indexed)
  const [page, setPage] = useState(0);
  const pageSize = 3; // Adjust item count per page as needed

  // Pass pagination parameters if your custom hook supports it: useAllHistory(page, pageSize)
  const { data, isPending, error } = useAllHistory(page, pageSize);

  const apiKey = "TLXPUNKAKDhaHEElfqaBtKCVFKNJcdnsOYqwvvBjgBkFYUMDcPQpFfdOngqyV";
  const baseUrl = "https://v1.api.pingstack.com";

  const handleCopy = (text: string, type: 'key' | 'url') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Safely extract transaction array and pagination metadata
  const transactions = data?.content || [];
  const totalPages = data?.totalPages || 1;
  const isFirstPage = data?.first ?? true;
  const isLastPage = data?.last ?? true;

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 ">

      {/* 1. Transaction History Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-4 gap-2">
          <div className="flex items-center gap-2 text-gray-700 min-w-0">
            <History className="w-5 h-5 text-emerald-500 stroke-[1.5] shrink-0" />
            <span className="font-semibold text-gray-800 text-sm sm:text-[15px] truncate">Transaction History</span>
          </div>
          <span className="text-xs text-gray-400 font-medium bg-slate-50 px-2 py-0.5 rounded-md">
            Total: {data?.totalElements || 0}
          </span>
        </div>

        {/* Loading / Error / Content State Handling */}
        {isPending ? (
          <div className="py-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-slate-50/50 border border-dashed border-gray-100 rounded-xl py-10 sm:py-12 flex flex-col items-center justify-center px-4 text-center">
            <History className="w-10 h-10 text-gray-200/70 mb-2 stroke-[1]" />
            <p className="text-gray-400 text-sm sm:text-[15px]">No recent transaction recorded yet</p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-w-0">
            {/* Minimalist Table Layout */}
            <div className="overflow-x-auto -mx-4 sm:-mx-6">
              <div className="inline-block min-w-full align-middle px-4 sm:px-6">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="pb-2 font-medium">Reference ID</th>
                      <th className="pb-2 font-medium">Method</th>
                      <th className="pb-2 font-medium text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs sm:text-sm text-gray-600">
                    {transactions.map((tx: any) => {
                      // 1. Clean the prefix (PING_0f940732... -> 0f94073242cb442baafe2c470aadcece)
                      const cleanNumber = tx.transactionNumber?.replace("PING_", "PINGSTACK_") || "";
                      // 2. Slice out a short, clean, manageable identifier (e.g., "0f940732")
                      const displayId = cleanNumber.substring(0, 12);

                      return (
                        <tr key={tx.orderId} className="hover:bg-slate-50/50 transition-colors">
                          {/* Reference ID column displaying the cut transaction number */}
                          <td
                            className="py-2.5 font-mono text-gray-700 font-medium cursor-pointer hover:text-emerald-600 transition-colors"
                            onClick={() => {
                              // Copies the complete transaction number intact for convenience
                              navigator.clipboard.writeText(tx.transactionNumber);
                            }}
                            title="Click to copy full reference"
                          >
                            {displayId}
                          </td>

                          <td className="py-2.5 capitalize">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700">
                              {tx.paymentMethod}
                            </span>
                          </td>

                          <td className="py-2.5 text-right text-gray-400 text-[11px] sm:text-xs">
                            {new Date(tx.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-4">
                <span className="text-xs text-gray-400">
                  Page {page + 1} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(prev => Math.max(0, prev - 1))}
                    disabled={isFirstPage}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={isLastPage}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
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
                  <span className="text-emerald-600">Copied!</span> palm
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Copy code</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 sm:p-4 min-h-[56px] flex items-center select-all font-mono text-[11px] sm:text-xs md:text-sm text-gray-600 tracking-wide overflow-hidden [word-break:break-all]">
            <span className={showApiKey ? "w-full" : "blur-[4px] select-none pointer-events-none tracking-widest truncate w-full"}>
              {showApiKey ? apiKey : apiKey.substring(0, 35) + "..."}
            </span>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Base URL Sub-section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <LinkIcon className="text-blue-600 w-[18px] h-[18px] shrink-0" />
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

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 sm:p-4 flex items-center font-mono text-xs sm:text-sm text-gray-600 overflow-x-auto whitespace-nowrap scrollbar-none">
            {baseUrl}
          </div>
        </div>
      </div>
    </div>
  );
}