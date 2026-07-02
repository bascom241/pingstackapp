import React, { useState } from "react";
import { Radio, ShieldAlert, Key, Check, Copy, ToggleRight, ToggleLeft, Activity, ArrowUpRight } from "lucide-react";

export default function WebhooksConfig() {
  const [webhookUrl, setWebhookUrl] = useState("https://api.yourdomain.com/v1/pingstack-receiver");
  const [secretKey] = useState("whsec_908fba23c0192e8a716bc239ab7cf8e1");
  const [copied, setCopied] = useState(false);
  
  const [events, setEvents] = useState({
    "sms.delivered": true,
    "sms.failed": true,
    "otp.verified": true,
    "email.bounced": false,
  });

  const triggerCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Streaming Webhook Topologies</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Stream programmatic real-time transport event frames (bounces, receipt latencies) straight into your remote infrastructure cluster.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Parameters Block */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-50">
              <div className="p-1.5 bg-blue-50 text-[#004aad]/90 rounded-lg">
                <Radio size={15} />
              </div>
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Destination Callback Node</h2>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-400">Endpoint Receiver URL</label>
              <input 
                type="url" 
                value={webhookUrl} 
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.yourbackend.com/webhooks"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-mono text-gray-700 outline-none focus:ring-2 focus:ring-[#004aad]/10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-400">Cryptographic Signing Secret</label>
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-mono text-xs">
                <span className="text-gray-500 truncate select-all">{secretKey}</span>
                <button onClick={() => triggerCopy(secretKey)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                  {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 leading-normal">
                Verifies payload authenticity via `x-pingstack-signature` SHA256 HMAC headers.
              </p>
            </div>
          </div>

          {/* Event Filters Section */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide pb-1 border-b border-gray-50">Subscribed Propagation Topics</h3>
            <div className="divide-y divide-gray-50">
              {Object.entries(events).map(([evt, enabled]) => (
                <div key={evt} className="flex items-center justify-between py-3.5 first:pt-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-mono font-bold text-gray-800">{evt}</span>
                    <span className="text-[10px] text-gray-400">Triggered whenever state mutates cleanly to this vector.</span>
                  </div>
                  <button
                    onClick={() => setEvents(p => ({ ...p, [evt]: !enabled }))}
                    className={`cursor-pointer transition-colors ${enabled ? "text-[#004aad]" : "text-gray-300"}`}
                  >
                    {enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Monitoring Metrics Side Panel */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-50">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <Activity size={15} />
              </div>
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Trunk Diagnostics</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/60">
                <span className="text-gray-400 font-sans text-[10px] block font-bold uppercase">Success Rate</span>
                <span className="text-base font-bold text-emerald-600 block mt-1">99.94%</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/60">
                <span className="text-gray-400 font-sans text-[10px] block font-bold uppercase">Mean Latency</span>
                <span className="text-base font-bold text-gray-800 block mt-1">142ms</span>
              </div>
            </div>

            <button className="w-full bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors">
              <span>View Logs Cache</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}