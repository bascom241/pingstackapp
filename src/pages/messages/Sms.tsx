import React, { useState } from "react";
import { Send, Upload, HelpCircle, Wifi, Battery, Signal, Radio, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sms() {
  const [senderId, setSenderId] = useState("Pingstack");
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimatingTransmission, setIsAnimatingTransmission] = useState(false);
  
  const [previewFeed, setPreviewFeed] = useState<string[]>([
    "Welcome to Pingstack! Your developer node is now active.",
  ]);

  const approvedSenderIds = ["Pingstack", "PingAlert", "AuthOTP"];

  const charCount = message.length;
  const smsPages = charCount <= 160 ? 1 : Math.ceil(charCount / 153);

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderId || !recipients || !message) return;
    
    setIsSubmitting(true);
    setIsAnimatingTransmission(true);
    
    // Simulate pipeline propagation processing time
    setTimeout(() => {
      // Commit message to feed after flight animation completes
      setPreviewFeed((prev) => [...prev, message]);
      setMessage("");
      setIsSubmitting(false);
      setIsAnimatingTransmission(false);
    }, 2800); // Extended slightly to appreciate the premium flight visualizer
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* Left/Main Form Box */}
      <form onSubmit={handleLaunchCampaign} className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dispatch Message</h1>
          <p className="text-xs text-gray-500 mt-1">
            Broadcast high-throughput transactional or promotional SMS alerts globally via optimal carrier trunks.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          {/* Sender ID Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              Sender ID <HelpCircle size={12} className="text-gray-300" />
            </label>
            <select
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] transition-all"
              required
            >
              {approvedSenderIds.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>

          {/* Destinations Mapping */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Recipients Phone Book
              </label>
              <button 
                type="button"
                className="text-[10px] font-bold text-[#004aad] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Upload size={12} /> Import CSV list
              </button>
            </div>
            <textarea
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="Enter mobile sequences comma-separated (+23480..., +23490...)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-mono text-gray-600 h-24 placeholder:font-sans outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] transition-all resize-none"
              required
            />
          </div>

          {/* Message Blueprint Payload */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Message Body
              </label>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${charCount > 160 ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'}`}>
                {charCount} / {smsPages} SMS Unit{smsPages > 1 && 's'}
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Formulate payload contents here..."
              maxLength={1000}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-gray-700 h-32 outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] transition-all resize-none"
              required
            />
          </div>
        </div>

        {/* Form CTA Execution Bar */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#004aad] hover:bg-[#003985] disabled:opacity-50 text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004aad]/40"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send size={14} />
              <span>Broadcast Campaign</span>
            </>
          )}
        </button>
      </form>

      {/* Real-Time Immersive Device Render Container */}
      <div className="flex flex-col items-center gap-3 lg:mt-12 w-full">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 self-start lg:self-center">
          Device Render View
        </span>
        
        {/* Realistic Hardware Outer Shell */}
        <div className="relative border-[6px] border-gray-800 rounded-[46px] bg-black p-2.5 shadow-2xl max-w-[290px] w-full aspect-[9/18] flex flex-col overflow-hidden ring-4 ring-gray-100 ring-offset-2 select-none">
          
          {/* Internal Display Frame */}
          <div className="flex-1 bg-slate-100 rounded-[36px] p-3 flex flex-col justify-between relative overflow-hidden text-gray-900">
            
            {/* Immersive Transmission Transmission Overlay */}
            <AnimatePresence>
              {isAnimatingTransmission && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-900/95 z-40 flex flex-col items-center justify-center px-4 text-center text-white"
                >
                  {/* Glowing Node Architecture */}
                  <div className="relative mb-6">
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1] }} 
                      transition={{ repeat: Infinity, duration: 2 }} 
                      className="absolute inset-0 bg-[#004aad]/40 rounded-full blur-md"
                    />
                    <div className="w-12 h-12 bg-[#004aad] rounded-full flex items-center justify-center border border-blue-400/30 shadow-lg relative z-10">
                      <Radio size={20} className="text-white animate-pulse" />
                    </div>
                  </div>

                  <p className="text-[11px] font-bold tracking-wider uppercase text-blue-400 mb-1">
                    Trunk Propagation
                  </p>
                  <p className="text-[9px] text-gray-400 font-mono truncate w-full max-w-[180px]">
                    Routing payload via Telco IP...
                  </p>

                  {/* Flight Track Track Line */}
                  <div className="w-[1px] h-20 bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 relative my-4 flex items-center justify-center">
                    <motion.div
                      initial={{ y: 40, opacity: 0, scale: 0.8 }}
                      animate={{ y: -40, opacity: [0, 1, 1, 0], scale: 1.1 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute p-1 bg-white text-[#004aad] rounded-full shadow-md shadow-blue-500/50"
                    >
                      <ArrowUp size={10} strokeWidth={3} />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Top Hardware Overlay: Dynamic Island / StatusBar */}
            <div className="w-full flex justify-between items-center px-4 pt-1 z-20 text-[10px] font-bold text-gray-700">
              <span>9:41</span>
              <div className="w-20 h-4 bg-black rounded-full absolute left-1/2 transform -translate-x-1/2 top-1" />
              <div className="flex items-center gap-1">
                <Signal size={10} strokeWidth={2.5} />
                <Wifi size={10} strokeWidth={2.5} />
                <Battery size={12} strokeWidth={2.5} />
              </div>
            </div>

            {/* Simulated App Header Bar */}
            <div className="w-full flex flex-col items-center gap-1 border-b border-gray-200/60 pb-2 mt-3 z-10">
              <div className="w-7 h-7 rounded-full bg-[#004aad]/10 flex items-center justify-center text-[10px] text-[#004aad] font-black tracking-tight border border-[#004aad]/20">
                {senderId.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-[10px] font-black text-gray-800 tracking-tight">
                {senderId || "Sender ID"}
              </span>
            </div>

            {/* Chat Canvas Area with Continuous Animated Stream */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 flex flex-col justify-end overflow-hidden scrollbar-none">
              <div className="space-y-2.5 flex flex-col justify-end">
                <AnimatePresence initial={false}>
                  {previewFeed.map((msg, index) => (
                    <motion.div
                      key={`feed-${index}`}
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="bg-white border border-gray-200/50 rounded-2xl p-2.5 max-w-[85%] text-[10px] leading-relaxed text-gray-800 shadow-sm [word-break:break-all]"
                    >
                      {msg}
                    </motion.div>
                  ))}
                  
                  {/* Dynamic Typing / Intermediary Buffer Bubble */}
                  {message && !isAnimatingTransmission && (
                    <motion.div
                      key="live-buffer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-[#004aad]/5 border border-[#004aad]/10 rounded-2xl p-2.5 max-w-[85%] text-[10px] leading-relaxed text-[#004aad] shadow-sm font-medium [word-break:break-all]"
                    >
                      {message}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Simulated Keyboard / Input Dock Tray */}
            <div className="h-7 bg-white border border-gray-200/80 rounded-full w-full mb-1 flex items-center justify-between px-2.5 text-[9px] text-gray-400">
              <span>Text Message</span>
              <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                ↑
              </div>
            </div>
            
            {/* iOS Bottom Indicator Bar */}
            <div className="w-20 h-1 bg-gray-400 rounded-full mx-auto mt-1 shrink-0" />
            
          </div>
        </div>
      </div>

    </div>
  );
}