import React, { useState } from "react";
import { KeyRound, ShieldCheck, Eye, EyeOff, RefreshCw, Layers, Plus, Terminal } from "lucide-react";

export default function ApiKeysPlayground() {
  const [revealKey, setRevealKey] = useState(false);
  const secretToken = "pk_live_01f9b34a8c901e827b36a1102fd834cba1029e";

  const requestHistory = [
    { method: "POST", path: "/v1/sms/send", status: 200, time: "Just now", duration: "84ms" },
    { method: "GET", path: "/v1/lists/l1/subscribers", status: 200, time: "3 mins ago", duration: "112ms" },
    { method: "POST", path: "/v1/otp/verify", status: 422, time: "14 mins ago", duration: "45ms" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">API Management & Sandbox Access</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Provision secure development environments and track real-time network request execution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Token Management Core Box */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-50 text-[#004aad] rounded-lg">
                  <KeyRound size={15} />
                </div>
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Developer Security Access Tokens</h2>
              </div>
              <button className="text-[10px] font-bold text-[#004aad] flex items-center gap-1 hover:underline cursor-pointer">
                <Plus size={12} /> Roll Token
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-400">Secret Token Key</label>
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-mono text-xs">
                <span className="text-gray-700 truncate select-all max-w-xs sm:max-w-md">
                  {revealKey ? secretToken : "••••••••••••••••••••••••••••••••••••••••••••••••"}
                </span>
                <button onClick={() => setRevealKey(!revealKey)} className="text-gray-400 hover:text-gray-700 cursor-pointer p-0.5">
                  {revealKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Request Stream Shell */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 pb-1 border-b border-gray-50">
              <div className="p-1.5 bg-slate-50 text-gray-500 rounded-lg">
                <Terminal size={14} />
              </div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Live Developer Node Stream</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-50 font-mono text-[11px]">
                <thead>
                  <tr className="text-left text-[10px] font-sans font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-2">Route Signature</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Latency</th>
                    <th className="pb-2 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-600 font-medium">
                  {requestHistory.map((req, i) => (
                    <tr key={i} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-2.5">
                        <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] mr-2 ${req.method === "POST" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                          {req.method}
                        </span>
                        <span className="text-gray-800 font-semibold">{req.path}</span>
                      </td>
                      <td className="py-2.5">
                        <span className={`font-bold ${req.status === 200 ? "text-emerald-600" : "text-rose-600"}`}>{req.status}</span>
                      </td>
                      <td className="py-2.5 text-gray-400">{req.duration}</td>
                      <td className="py-2.5 text-right font-sans text-gray-400 text-[10px]">{req.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sandbox Metrics Right Panel */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-50">
              <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                <Layers size={14} />
              </div>
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Environment Context</h2>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Toggle network configurations contextually. Sandbox modes run simulation queries without hitting telco delivery infrastructure.
            </p>
            <div className="bg-amber-50 border border-amber-200/50 p-3 rounded-xl text-[11px] text-amber-800 leading-normal font-medium">
              Production access token is active. Always isolate keys away from public front-end repositories.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}