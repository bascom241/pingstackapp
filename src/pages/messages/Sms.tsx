import React, { useState, useRef } from "react";
import {
  Send,
  Upload,
  HelpCircle,
  Wifi,
  Battery,
  Signal,
  Radio,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  Mail,
  User,
  AtSign,
  FileText,
  Search,
  Check,
  X,
  Code,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetApprovedIds } from "../../features/senderId/hooks/useSenderIds";

type Template = {
  id: string;
  name: string;
  category: "Transactional" | "Marketing" | "Lifecycle";
  lastModified: string;
  usageMetric: string;
  subject?: string;
  body: string;
};

const DUMMY_TEMPLATES: Template[] = [
  {
    id: "t1",
    name: "Secure Magic Login Link",
    category: "Transactional",
    lastModified: "3 hrs ago",
    usageMetric: "42.8k hits",
    subject: "Your Secure Login Link for Pingstack",
    body: "Hello {{user.firstName}}, click here to log in securely: {{action.secureUrl}}. This link expires in 15 minutes."
  },
  {
    id: "t2",
    name: "Corporate Invoice Manifest",
    category: "Transactional",
    lastModified: "1 day ago",
    usageMetric: "129.1k hits",
    subject: "Invoice Generated - {{billing.amount}}",
    body: "Hi {{user.firstName}}, your latest invoice for {{billing.amount}} is ready. Download it here: {{action.secureUrl}}"
  },
  {
    id: "t3",
    name: "User Milestone Engagement",
    category: "Lifecycle",
    lastModified: "4 days ago",
    usageMetric: "8.9k hits",
    subject: "Congrats on reaching a new milestone!",
    body: "Great job {{user.firstName}}! You've achieved a new milestone on your account. Log in to claim your reward."
  },
  {
    id: "t4",
    name: "Q3 Premium Feature Rollout",
    category: "Marketing",
    lastModified: "1 week ago",
    usageMetric: "410.5k hits",
    subject: "Discover Our Newest Features!",
    body: "Hey {{user.firstName}}, check out our Q3 feature upgrades and power up your workflow today."
  },
];

const DYNAMIC_TOKENS = [
  { token: "{{user.firstName}}", desc: "First Name" },
  { token: "{{action.secureUrl}}", desc: "Target Link" },
  { token: "{{billing.amount}}", desc: "Currency Value" }
];

export default function Sms() {
  const [channel, setChannel] = useState<"sms" | "email">("sms");

  // Form States
  const [senderId, setSenderId] = useState("Pingstack");
  const [senderEmail, setSenderEmail] = useState("noreply@app.pingstack.com");
  const [subject, setSubject] = useState("");
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimatingTransmission, setIsAnimatingTransmission] = useState(false);

  // Template Modal States (Email Only)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategoryTab, setTemplateCategoryTab] = useState<"all" | "Transactional" | "Marketing" | "Lifecycle">("all");

  const messageTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Pagination for Approved Sender IDs (SMS)
  const [page, setPage] = useState(0);
  const size = 5;

  const { data, isError, isPending } = useGetApprovedIds(page, size);
  const approvedSenderIds = data?.content || [];
  const totalPages = data?.totalPages || 1;

  // Real-time Feeds for Previews
  const [smsPreviewFeed, setSmsPreviewFeed] = useState<string[]>([
    "Welcome to Pingstack! Your developer node is now active.",
  ]);

  const charCount = message.length;
  const smsPages = charCount <= 160 ? 1 : Math.ceil(charCount / 153);

  // Apply selected template (Email Channel)
  const handleSelectTemplate = (tpl: Template) => {
    setSelectedTemplate(tpl);
    setMessage(tpl.body);
    if (tpl.subject) setSubject(tpl.subject);
    setIsTemplateModalOpen(false);
  };

  // Inject token variable into email textarea
  const injectToken = (token: string) => {
    if (!messageTextareaRef.current) {
      setMessage((prev) => prev + token);
      return;
    }
    const input = messageTextareaRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const newText = message.substring(0, start) + token + message.substring(end);
    setMessage(newText);

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + token.length, start + token.length);
    }, 0);
  };

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (channel === "sms" && (!senderId || !recipients || !message)) return;
    if (channel === "email" && (!senderEmail || !subject || !recipients || !message)) return;

    setIsSubmitting(true);
    setIsAnimatingTransmission(true);

    setTimeout(() => {
      if (channel === "sms") {
        setSmsPreviewFeed((prev) => [...prev, message]);
      }
      setMessage("");
      if (channel === "email") setSubject("");
      setSelectedTemplate(null);
      setIsSubmitting(false);
      setIsAnimatingTransmission(false);
    }, 2800);
  };

  const filteredTemplates = DUMMY_TEMPLATES.filter((t) => {
    const matchCategory = templateCategoryTab === "all" || t.category === templateCategoryTab;
    const matchSearch = t.name.toLowerCase().includes(templateSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">

      {/* Main Dispatch Form */}
      <form onSubmit={handleLaunchCampaign} className="lg:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Dispatch Message
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Broadcast high-throughput SMS alerts to phones or dispatch email notifications globally.
            </p>
          </div>

          {/* Channel Selector Toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setChannel("sms")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                channel === "sms"
                  ? "bg-white text-[#004aad] shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <PhoneCall size={13} />
              <span>SMS Phone</span>
            </button>
            <button
              type="button"
              onClick={() => setChannel("email")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                channel === "email"
                  ? "bg-white text-[#004aad] shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Mail size={13} />
              <span>Email</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">

          {/* Template Bar Quick Trigger (EMAIL ONLY) */}
          {channel === "email" && (
            <div className="flex items-center justify-between bg-purple-50/60 border border-purple-100 rounded-xl p-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg shrink-0">
                  <FileText size={15} />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-gray-800 truncate">
                    {selectedTemplate ? selectedTemplate.name : "No template loaded"}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {selectedTemplate
                      ? `Category: ${selectedTemplate.category}`
                      : "Use a pre-designed blueprint template to autofill layout"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Sparkles size={12} />
                <span>{selectedTemplate ? "Change Template" : "Choose Template"}</span>
              </button>
            </div>
          )}

          {/* Sender Identity Selection */}
          {channel === "sms" ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                SMS Sender ID <HelpCircle size={12} className="text-gray-300" />
              </label>

              <select
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] transition-all"
                required
              >
                {isPending && <option>Loading Sender IDs...</option>}
                {isError && <option>Error loading Sender IDs</option>}
                {!isPending && approvedSenderIds.length === 0 && (
                  <option>No approved Sender IDs found</option>
                )}

                {approvedSenderIds.map((item: any, index: number) => {
                  const unique = `${item}-${item.id || index}`;
                  return (
                    <option key={unique} value={item.senderId}>
                      {item.senderId} ({item.companyName})
                    </option>
                  );
                })}
              </select>

              {/* Select Pagination Bar for SMS */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 mt-1 px-1">
                  <span className="text-[10px] text-gray-400">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page === 0}
                    onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                    className="p-1 text-gray-500 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="p-1 text-gray-500 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Sender Email Identity
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="noreply@yourdomain.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-gray-700 outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] transition-all"
                required
              />
            </div>
          )}

          {/* Email Subject Field (Email Channel Only) */}
          {channel === "email" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Email Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Important updates regarding your account..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] transition-all"
                required
              />
            </div>
          )}

          {/* Recipients Box */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {channel === "sms" ? "Recipients Phone Book" : "Recipient Email Addresses"}
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
              placeholder={
                channel === "sms"
                  ? "Enter mobile numbers comma-separated (+23480..., +23490...)"
                  : "Enter email addresses comma-separated (user1@domain.com, user2@domain.com)"
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-mono text-gray-600 h-24 placeholder:font-sans outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] transition-all resize-none"
              required
            />
          </div>

          {/* Dynamic Variables Injection Quick-Pills (EMAIL ONLY) */}
          {channel === "email" && (
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Code size={11} /> Quick Insert Variables
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DYNAMIC_TOKENS.map((tokenObj) => (
                  <button
                    type="button"
                    key={tokenObj.token}
                    onClick={() => injectToken(tokenObj.token)}
                    className="bg-gray-100 hover:bg-[#004aad]/10 hover:text-[#004aad] border border-gray-200 px-2 py-1 rounded-lg text-[10px] font-mono font-semibold text-gray-700 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>{tokenObj.token}</span>
                    <span className="text-[9px] text-gray-400 font-sans">({tokenObj.desc})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Payload Body */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {channel === "sms" ? "SMS Message Body" : "Email HTML / Text Body"}
              </label>
              {channel === "sms" && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${charCount > 160 ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'}`}>
                  {charCount} / {smsPages} SMS Unit{smsPages > 1 && 's'}
                </span>
              )}
            </div>
            <textarea
              ref={messageTextareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={channel === "sms" ? "Type your SMS content here..." : "Type your email message or choose a template..."}
              maxLength={channel === "sms" ? 1000 : 50000}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-gray-700 h-32 outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] transition-all resize-none"
              required
            />
          </div>
        </div>

        {/* Submit Execution Button */}
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
              <span>Broadcast {channel === "sms" ? "SMS Campaign" : "Email Campaign"}</span>
            </>
          )}
        </button>
      </form>

      {/* Real-Time Live Preview Display */}
      <div className="flex flex-col items-center gap-3 lg:mt-12 w-full">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 self-start lg:self-center">
          {channel === "sms" ? "Device Phone Render" : "Email Client Render"}
        </span>

        {channel === "sms" ? (
          /* Phone Hardware View for SMS */
          <div className="relative border-[6px] border-gray-800 rounded-[46px] bg-black p-2.5 shadow-2xl max-w-[290px] w-full aspect-[9/18] flex flex-col overflow-hidden ring-4 ring-gray-100 ring-offset-2 select-none">
            <div className="flex-1 bg-slate-100 rounded-[36px] p-3 flex flex-col justify-between relative overflow-hidden text-gray-900">

              <AnimatePresence>
                {isAnimatingTransmission && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/95 z-40 flex flex-col items-center justify-center px-4 text-center text-white"
                  >
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
                      Carrier Propagation
                    </p>
                    <p className="text-[9px] text-gray-400 font-mono truncate w-full max-w-[180px]">
                      Routing payload via Telco IP...
                    </p>
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

              {/* Status Bar */}
              <div className="w-full flex justify-between items-center px-4 pt-1 z-20 text-[10px] font-bold text-gray-700">
                <span>9:41</span>
                <div className="w-20 h-4 bg-black rounded-full absolute left-1/2 transform -translate-x-1/2 top-1" />
                <div className="flex items-center gap-1">
                  <Signal size={10} strokeWidth={2.5} />
                  <Wifi size={10} strokeWidth={2.5} />
                  <Battery size={12} strokeWidth={2.5} />
                </div>
              </div>

              {/* App Header */}
              <div className="w-full flex flex-col items-center gap-1 border-b border-gray-200/60 pb-2 mt-3 z-10">
                <div className="w-7 h-7 rounded-full bg-[#004aad]/10 flex items-center justify-center text-[10px] text-[#004aad] font-black tracking-tight border border-[#004aad]/20">
                  {senderId.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-[10px] font-black text-gray-800 tracking-tight">
                  {senderId || "Sender ID"}
                </span>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2.5 flex flex-col justify-end overflow-hidden scrollbar-none">
                <AnimatePresence initial={false}>
                  {smsPreviewFeed.map((msg, index) => (
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

              <div className="h-7 bg-white border border-gray-200/80 rounded-full w-full mb-1 flex items-center justify-between px-2.5 text-[9px] text-gray-400">
                <span>Text Message</span>
                <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  ↑
                </div>
              </div>
              <div className="w-20 h-1 bg-gray-400 rounded-full mx-auto mt-1 shrink-0" />
            </div>
          </div>
        ) : (
          /* Email Desktop Client View */
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl max-w-[320px] w-full overflow-hidden text-gray-900 select-none">
            {/* Email Header Bar */}
            <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-mono text-gray-400 ml-2 truncate">
                {senderEmail}
              </span>
            </div>

            {/* Email Metadata */}
            <div className="p-3 border-b border-gray-100 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1 text-gray-500">
                <User size={12} />
                <span className="font-semibold text-gray-800 truncate">From:</span>
                <span className="text-gray-600 truncate">{senderEmail}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <AtSign size={12} />
                <span className="font-semibold text-gray-800 truncate">To:</span>
                <span className="text-gray-600 truncate">{recipients || "recipient@domain.com"}</span>
              </div>
              <div className="pt-1 border-t border-gray-50 font-bold text-gray-900 text-xs truncate">
                {subject || "No Subject Line"}
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-4 bg-gray-50/50 min-h-[180px] text-xs text-gray-700 leading-relaxed font-sans whitespace-pre-wrap">
              {message || (
                <span className="text-gray-300 italic text-[11px]">
                  Your email preview content will render live here...
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Template Selection Modal (EMAIL ONLY) */}
      <AnimatePresence>
        {isTemplateModalOpen && channel === "email" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-2xl max-w-2xl w-full space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Select Template Blueprint</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Choose a preset payload format to automatically sync into your campaign dispatch workspace.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex bg-gray-100 p-0.5 rounded-xl w-full sm:w-auto">
                  {(["all", "Transactional", "Marketing", "Lifecycle"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setTemplateCategoryTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                        templateCategoryTab === tab
                          ? "bg-white text-[#004aad] shadow-sm"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#004aad]/10"
                  />
                </div>
              </div>

              {/* Template Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {filteredTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between gap-3 hover:border-[#004aad] hover:shadow-md ${
                      selectedTemplate?.id === tpl.id
                        ? "border-[#004aad] bg-blue-50/20"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded-md ${
                            tpl.category === "Transactional"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : tpl.category === "Marketing"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-purple-50 text-purple-700 border border-purple-100"
                          }`}
                        >
                          {tpl.category}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">{tpl.usageMetric}</span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 pt-1">{tpl.name}</h4>
                      <p className="text-[10px] text-gray-500 line-clamp-2">{tpl.body}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-[10px]">
                      <span className="text-gray-400">Updated {tpl.lastModified}</span>
                      <span className="text-[#004aad] font-bold flex items-center gap-0.5">
                        Apply Blueprint <Check size={12} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}