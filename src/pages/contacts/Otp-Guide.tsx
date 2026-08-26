import React, { useState } from "react";
import { Terminal, ShieldCheck, Copy, Check, Code2, Cpu, ArrowRight, Play, RefreshCw, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
type Language = "curl" | "node" | "python";

export default function OtpGuide() {
  const [activeLang, setActiveLang] = useState<Language>("curl");
  const [copied, setCopied] = useState(false);
  const [simulatedPhone, setSimulatedPhone] = useState("+234 803 111 2222");
  const [isLoadingTest, setIsLoadingTest] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);

  const codeSnippets: Record<Language, string> = {
    curl: `curl -X POST "https://v1.api.pingstack.com/v1/otp/send" \\
  -H "Authorization: Bearer TLXPUNKAKDhaHEE..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "${simulatedPhone}",
    "senderId": "Pingstack",
    "expiry": 300,
    "digits": 6
  }'`,
    node: `const axios = require('axios');

axios.post('https://v1.api.pingstack.com/v1/otp/send', {
  to: '${simulatedPhone}',
  senderId: 'Pingstack',
  expiry: 300,
  digits: 6
}, {
  headers: { 'Authorization': 'Bearer TLXPUNKAKDhaHEE...' }
})
.then(res => console.log(res.data));`,
    python: `import requests

payload = {
    "to": "${simulatedPhone}",
    "senderId": "Pingstack",
    "expiry": 300,
    "digits": 6
}
headers = {"Authorization": "Bearer TLXPUNKAKDhaHEE..."}

response = requests.post("https://v1.api.pingstack.com/v1/otp/send", json=payload, headers=headers)
print(response.json())`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerSandboxOtp = () => {
    setIsLoadingTest(true);
    setTimeout(() => {
      setTestResponse({
        status: "success",
        pinId: "pin_dev_89ab32c0f9",
        smsStatus: "DELIVERED",
        carrier: "MTN Nigeria",
        timestamp: new Date().toISOString()
      });
      setIsLoadingTest(false);
    }, 1100);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Page Context Meta */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">One-Time Password (OTP) Orchestration</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Integrate dynamic fallback mechanics, automated channel routing, and crypto-secure multi-factor tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* API Token Framework Docs (Left) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section A: Dynamic Workflow Flowchart Block */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-50">
              <div className="p-1.5 bg-blue-50 text-[#004aad] rounded-lg">
                <Cpu size={15} />
              </div>
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Infrastructure Pipeline Flow</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                { step: "01", name: "Token Request", desc: "Your backend hits our node endpoint with target payload constraints." },
                { step: "02", name: "Dynamic Delivery", desc: "Pingstack optimizes carrier pathways using automated retry loops." },
                { step: "03", name: "Validation Hook", desc: "Customer inputs code; verification resolves inside our hardware safely." }
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100/70 p-3.5 rounded-xl relative group">
                  <span className="text-[10px] font-black font-mono text-[#004aad]/30 absolute top-2 right-3">{item.step}</span>
                  <p className="text-xs font-bold text-gray-800">{item.name}</p>
                  <p className="text-[11px] text-gray-400 mt-1 leading-normal">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Polyglot Multi-language Code Block */}
          <div className="bg-[#0f172a] rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <Code2 size={13} className="text-blue-400" />
                <span className="text-[11px] font-mono font-bold text-slate-300">POST /v1/otp/send</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                  {(["curl", "node", "python"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold cursor-pointer transition-all ${
                        activeLang === lang ? "bg-[#004aad] text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {lang === "node" ? "Node.js" : lang === "python" ? "Python" : "cURL"}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={handleCopyCode}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer border border-slate-700"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            <div className="p-4 overflow-x-auto font-mono text-xs text-blue-300/90 leading-relaxed bg-slate-950/40">
              <pre><code>{codeSnippets[activeLang]}</code></pre>
            </div>
          </div>

        </div>

        {/* Live Playground Sandbox Right Panel */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-50">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <Terminal size={15} />
              </div>
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Interactive Sandbox</h2>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Target Test Sequence</label>
                <input 
                  type="text"
                  value={simulatedPhone}
                  onChange={(e) => setSimulatedPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-700 outline-none focus:ring-2 focus:ring-[#004aad]/10"
                />
              </div>

              <button
                type="button"
                onClick={triggerSandboxOtp}
                disabled={isLoadingTest}
                className="w-full bg-[#004aad] hover:bg-[#003985] disabled:opacity-50 text-white font-semibold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isLoadingTest ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
                <span>Fire Test Request</span>
              </button>
            </div>

            {/* Test Node Response Wrapper */}
            <AnimatePresence>
              {testResponse && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2 font-mono text-[10px]"
                >
                  <span className="text-emerald-400 font-bold block">HTTP/1.1 200 OK</span>
                  <pre className="text-slate-300 leading-normal overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(testResponse, null, 2)}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
}