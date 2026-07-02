import React, { useState } from "react";
import { Server, Globe, Key, ShieldCheck, Copy, Check, Save, Plus, Trash2, ToggleLeft, ToggleRight, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DnsRecord = {
  type: "TXT" | "MX" | "CNAME";
  host: string;
  value: string;
  status: "Verified" | "Pending";
};

export default function EmailConfig() {
  const [smtpServer, setSmtpServer] = useState("smtp.pingstack.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [encryption, setEncryption] = useState("TLS");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Track system status toggles
  const [tracking, setTracking] = useState({ clicks: true, opens: true, bounces: true });

  const dnsRecords: DnsRecord[] = [
    { type: "TXT", host: "@", value: "v=spf1 include:relay.pingstack.com ~all", status: "Verified" },
    { type: "TXT", host: "pstack._domainkey", value: "k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0...", status: "Pending" },
    { type: "MX", host: "@", value: "10 inbound-smtp.pingstack.com", status: "Verified" },
  ];

  const triggerCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Header Context Banner */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Email Server Provisioning</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure high-throughput SMTP relays, authenticate vanity domains, and synchronize global DNS records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Main Infrastructure Controls (Left/2-Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: SMTP Relay Parameters */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-50">
              <div className="p-1.5 bg-blue-50 text-[#004aad] rounded-lg">
                <Server size={15} />
              </div>
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Outbound SMTP Relay Settings</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400">SMTP Server Host</label>
                <input 
                  type="text" 
                  value={smtpServer} 
                  onChange={(e) => setSmtpServer(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-700 outline-none focus:ring-2 focus:ring-[#004aad]/10 focus:border-[#004aad]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400">Port</label>
                <input 
                  type="text" 
                  value={smtpPort} 
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-700 outline-none focus:ring-2 focus:ring-[#004aad]/10 focus:border-[#004aad]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400">Transport Layer Encryption</label>
                <div className="flex gap-2">
                  {["TLS", "SSL", "None"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEncryption(type)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        encryption === type 
                          ? "bg-[#004aad]/5 border-[#004aad] text-[#004aad]" 
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400">SMTP Username</label>
                <input 
                  type="text" 
                  disabled
                  value="node_usr_prod_09a"
                  className="w-full bg-gray-100/80 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-400 outline-none select-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Domain Provisioning Map */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                  <Globe size={15} />
                </div>
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Domain Validation Mesh (DNS)</h2>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded">
                pingstack.com
              </span>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed">
              Inject these cryptographic references into your authoritative domain registrar (Cloudflare, AWS Route53, GoDaddy) to clear SPF and DKIM transport rules.
            </p>

            <div className="space-y-2.5 pt-1">
              {dnsRecords.map((record, idx) => {
                const uniqueId = `dns-${idx}`;
                return (
                  <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px]">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="bg-gray-200 text-gray-700 font-bold px-1.5 py-0.5 rounded text-[9px] w-12 text-center">
                        {record.type}
                      </span>
                      <span className="text-gray-800 font-semibold max-w-[100px] truncate">{record.host}</span>
                    </div>

                    <div className="flex-1 bg-white border border-gray-200/60 rounded-lg px-2.5 py-1 text-gray-500 truncate max-w-xs sm:max-w-md select-all">
                      {record.value}
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 font-sans">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        record.status === "Verified" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700 animate-pulse"
                      }`}>
                        {record.status}
                      </span>
                      <button 
                        type="button"
                        onClick={() => triggerCopy(record.value, uniqueId)}
                        className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-200/50 cursor-pointer"
                      >
                        {copiedText === uniqueId ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Configurations Sidepanel Deck (Right/1-Column) */}
        <div className="space-y-6">
          
          {/* Tracking Hook Switches */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-50">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <ShieldCheck size={15} />
              </div>
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Telemetry Tracking</h2>
            </div>

            <div className="space-y-3 pt-1">
              {[
                { key: "opens", title: "Open Rate Diagnostics", desc: "Embed stealth telemetry hooks inside HTML payloads." },
                { key: "clicks", title: "Clickthrough Tracking", desc: "Rewrite anchors via secure pingstack vanity proxies." },
                { key: "bounces", title: "Hard Bounce Suppression", desc: "Intercept ISP failure blocks to isolate addresses automatically." }
              ].map((item) => {
                const isChecked = tracking[item.key as keyof typeof tracking];
                return (
                  <div key={item.key} className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-gray-700">{item.title}</span>
                      <span className="text-[10px] text-gray-400 leading-normal max-w-[180px]">{item.desc}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTracking(prev => ({ ...prev, [item.key]: !isChecked }))}
                      className={`cursor-pointer transition-colors ${isChecked ? "text-[#004aad]" : "text-gray-300"}`}
                    >
                      {isChecked ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Commit Panel CTA */}
          <button 
            type="button" 
            className="w-full bg-[#004aad] hover:bg-[#003985] text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save size={14} />
            <span>Apply Node Topology</span>
          </button>

        </div>

      </div>

    </div>
  );
}