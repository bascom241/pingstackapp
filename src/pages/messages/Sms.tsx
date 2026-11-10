import { DataSkeleton, InlineSkeleton } from "../../ui/Skeleton";
import MessagingHeader from '../../components/messaging/MessagingHeader';
import React, { useEffect, useState, useRef } from "react";
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
  Sparkles,
  Maximize2,
} from "../../ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useGetApprovedIds } from "../../features/senderId/hooks/useSenderIds";
import {
  useGetSingleTemplate,
  useGetTemplateForUser,
} from "../../features/templates/hooks/useTemplate";
import { useGetAllDomains } from "../../features/email/config/hooks/useDomain";
import { useGetEmailConfig } from "../../features/email/config/hooks/useEmailConfig";
import { useGetAllAudience } from "../../features/contacts/hooks/useAudience";
import { useEntireAudience } from "../../features/contacts/hooks/useSubsciber";
import { calculateSmsSegments } from "../../utils/smsSegments";
import UploadCsv from "../../ui/modals/Upload";

import { sendMessages } from "../../features/messaging/api/messageService";
import { getGmailStatus, connectGmail } from "../../features/email/gmail/api/gmailService";
import { getApiErrorMessage } from "../../utils/apiError";
import { Link } from "react-router-dom";

type Template = {
  templateId: string;
  name: string;
  category: "Transactional" | "Marketing" | "Lifecycle";
  description?: string;
  updatedAt?: string;
  subject?: string;
  htmlContent?: string;
};

type TemplateApiItem = {
  templateId: string;
  name: string;
  category: "TRANSACTIONAL" | "MARKETING" | "LIFECYCLE";
  description?: string;
  updatedAt?: string;
};

type TemplateDetails = {
  subject: string;
  htmlContent: string;
};

const categoryLabels: Record<TemplateApiItem["category"], Template["category"]> = {
  TRANSACTIONAL: "Transactional",
  MARKETING: "Marketing",
  LIFECYCLE: "Lifecycle",
};

const formatTemplateDate = (date?: string) => {
  if (!date) return "Not recently updated";

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Not recently updated"
    : `Updated ${parsedDate.toLocaleDateString()}`;
};

export default function Sms() {
  const [channel, setChannel] = useState<"sms" | "email">("sms");

  // Form States
  const [senderId, setSenderId] = useState("");
  const [provider, setProvider] = useState<"BREVO" | "GMAIL">("BREVO");
  const [scheduledAt, setScheduledAt] = useState("");
  const [transactional, setTransactional] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [gmail, setGmail] = useState<{ connected: boolean; email?: string }>({ connected: false });
  const requestRef = useRef<{ fingerprint: string; key: string } | null>(null);
  const submittingRef = useRef(false);
  useEffect(() => { getGmailStatus().then(setGmail).catch(() => {}); }, []);
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimatingTransmission, setIsAnimatingTransmission] = useState(false);

  // Template Modal States (Email Only)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [isContactUploadOpen, setIsContactUploadOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategoryTab, setTemplateCategoryTab] = useState<"all" | "Transactional" | "Marketing" | "Lifecycle">("all");
  const [selectedAudienceId, setSelectedAudienceId] = useState("");

  // Pagination for Approved Sender IDs (SMS)
  const [page, setPage] = useState(0);
  const size = 5;

  const { data, isError, isPending } = useGetApprovedIds(page, size);
  const approvedSenderIds = data?.content || [];
  const totalPages = data?.totalPages || 1;
  useEffect(() => {
    if (!senderId && approvedSenderIds.length) setSenderId(approvedSenderIds[0].senderId);
  }, [approvedSenderIds, senderId]);

  const { data: templateData, isPending: isTemplatesPending, isError: isTemplatesError } =
    useGetTemplateForUser();
  const { data: selectedTemplateDetails, isPending: isTemplateDetailsPending } =
    useGetSingleTemplate(selectedTemplate?.templateId ?? "");
  const { data: emailConfig, isPending: isEmailConfigPending } = useGetEmailConfig();
  const { data: domains = [], isPending: isDomainsPending } = useGetAllDomains();
  const { data: audiences = [], isPending: isAudiencesPending } = useGetAllAudience();
  const {
    data: subscriberData,
    isFetching: isSubscribersPending,
    isError: isSubscribersError,
  } = useEntireAudience(
    selectedAudienceId,
    channel === "sms",
  );

  const subscribers = subscriberData ?? [];
  const selectedAudience = audiences.find((audience) => audience.id === selectedAudienceId);

  const templates: Template[] = ((templateData as TemplateApiItem[] | undefined) ?? []).map(
    (template) => ({
      templateId: template.templateId,
      name: template.name,
      category: categoryLabels[template.category],
      description: template.description,
      updatedAt: template.updatedAt,
    }),
  );

  useEffect(() => {
    if (senderEmail) return;

    const primaryDomain = domains.find((domain) => domain.primary && domain.verified);
    const configuredDomain = emailConfig?.customDomain || primaryDomain?.domain_name;

    if (configuredDomain) {
      setSenderEmail(`noreply@${configuredDomain}`);
    }
  }, [domains, emailConfig?.customDomain, senderEmail]);

  useEffect(() => {
    const details = selectedTemplateDetails as TemplateDetails | undefined;

    if (!details) return;

    setMessage(details.htmlContent ?? "");
    setSubject(details.subject ?? "");
  }, [selectedTemplateDetails]);

  useEffect(() => {
    if (!selectedAudienceId && audiences.length > 0) {
      setSelectedAudienceId(audiences[0].id);
    }
  }, [audiences, selectedAudienceId]);

  // Real-time Feeds for Previews
  const [smsPreviewFeed, setSmsPreviewFeed] = useState<string[]>([
    "Welcome to Pingstack! Your workspace is ready.",
  ]);

  const sms = calculateSmsSegments(message);

  // Apply selected template (Email Channel)
  const handleSelectTemplate = (tpl: Template) => {
    setSelectedTemplate(tpl);
    setIsTemplateModalOpen(false);
  };

  const handleUseAudience = () => {
    if (isSubscribersPending || isSubscribersError) return;
    const phoneNumbers = [...new Set(subscribers
      .map((subscriber) => (subscriber.destinationNumber ?? subscriber.transactionNumber)?.trim())
      .filter((phoneNumber): phoneNumber is string => Boolean(phoneNumber)))];

    setRecipients(phoneNumbers.join(", "));
  };

  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    const recipientList = [...new Set(recipients.split(/[,;\n]+/).map(value => value.trim()).filter(Boolean))];
    if (!recipientList.length || !message.trim()) { setFeedback("Add recipients and a message."); return; }
    if (channel === "sms" && !approvedSenderIds.some((item: { senderId: string }) => item.senderId === senderId)) { setFeedback("Choose an approved sender ID."); return; }
    if (channel === "email" && provider === "GMAIL" && !gmail.connected) { setFeedback("Connect your Gmail account first."); return; }
    if (scheduledAt && new Date(scheduledAt).getTime() <= Date.now()) { setFeedback("Choose a future sending time."); return; }
    const request = {
      channel: channel === "sms" ? "SMS" as const : "EMAIL" as const,
      provider: channel === "email" ? provider : undefined,
      recipients: recipientList,
      sender: channel === "sms" ? senderId : provider === "GMAIL" ? gmail.email : senderEmail,
      subject: channel === "email" ? subject : undefined,
      body: message, transactional,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
    };
    const fingerprint = JSON.stringify(request);
    if (requestRef.current?.fingerprint !== fingerprint) requestRef.current = { fingerprint, key: crypto.randomUUID() };
    submittingRef.current = true;
    setIsSubmitting(true); setIsAnimatingTransmission(true); setFeedback("");
    try {
      const jobs = await sendMessages(request, requestRef.current.key);
      const queued = jobs.filter(job => job.status === "QUEUED").length;
      const suppressed = jobs.filter(job => job.status === "SUPPRESSED").length;
      setFeedback(`${queued} message${queued === 1 ? "" : "s"} queued${suppressed ? `; ${suppressed} suppressed` : ""}. Track delivery in Message activity.`);
      if (channel === "sms") setSmsPreviewFeed(previous => [...previous, message]);
    } catch (error) { setFeedback(getApiErrorMessage(error, "Could not queue messages.")); }
    finally { submittingRef.current = false; setIsSubmitting(false); setIsAnimatingTransmission(false); }
  };

  const filteredTemplates = templates.filter((t) => {
    const matchCategory = templateCategoryTab === "all" || t.category === templateCategoryTab;
    const matchSearch = t.name.toLowerCase().includes(templateSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="messaging-page">
      <MessagingHeader
        title="Send a message"
        description="A quick update or an important announcement. Connect with your audience by SMS or email."
        action={
          <div className="messaging-channels" aria-label="Message channel">
            <button type="button" aria-pressed={channel === "sms"} onClick={() => setChannel("sms")}><PhoneCall size={19} /> SMS</button>
            <button type="button" aria-pressed={channel === "email"} onClick={() => setChannel("email")}><Mail size={19} /> Email</button>
          </div>
        }
      />
      <div className="messaging-composer-grid">
      <form onSubmit={handleLaunchCampaign} className="min-w-0 space-y-6">
        <div className="messaging-panel space-y-4">
          <Link to="/dashboard/message-activity" className="text-blue-700 underline">Message activity and Gmail connection</Link>
          <label className="block text-sm font-semibold">Send at (optional, your local time)
            <input type="datetime-local" value={scheduledAt} onChange={event => setScheduledAt(event.target.value)} className="block w-full rounded-xl border border-gray-200 p-3 mt-2" />
          </label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={transactional} onChange={event => setTransactional(event.target.checked)} />Transactional message</label>
          {channel === "email" && <div className="space-y-3">
            <label className="block text-sm font-semibold">Email provider<select value={provider} onChange={event => setProvider(event.target.value as "BREVO" | "GMAIL")} className="block w-full rounded-xl border border-gray-200 p-3 mt-2"><option value="BREVO">Brevo ? verified sending domain</option><option value="GMAIL">Connected Gmail account</option></select></label>
            {provider === "GMAIL" && (gmail.connected ? <p className="text-sm">Sending through {gmail.email}</p> : <button type="button" className="messaging-primary" onClick={async () => { try { const result = await connectGmail(); window.location.assign(result.authorizationUrl); } catch (error) { setFeedback(getApiErrorMessage(error)); } }}>Connect Gmail</button>)}
          </div>}
        </div>
        <div className="messaging-panel space-y-7">
          <div className="messaging-panel-heading">
            <h2>{channel === "sms" ? "Compose your SMS" : "Compose your email"}</h2>
            <p>Choose your sender, add recipients, and make your message count.</p>
          </div>

          {/* Template Bar Quick Trigger (EMAIL ONLY) */}
          {channel === "email" && (
            <div className="flex items-center justify-between bg-blue-50/60 border border-blue-100 rounded-xl p-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 bg-blue-100 text-[#004aad] rounded-lg shrink-0">
                  <FileText size={15} />
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {selectedTemplate ? selectedTemplate.name : "No template loaded"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {selectedTemplate
                      ? isTemplateDetailsPending
                        ? <InlineSkeleton width={170} height={12} label="Loading template details" />
                        : `Category: ${selectedTemplate.category}`
                      : "Start with a saved design for your email"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(true)}
                className="bg-[#004aad] hover:bg-[#003985] text-white font-bold text-sm px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Sparkles size={12} />
                <span>{selectedTemplate ? "Change Template" : "Choose Template"}</span>
              </button>
            </div>
          )}

          {/* Sender Identity Selection */}
          {channel === "sms" ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="message-sender-id" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                SMS Sender ID <HelpCircle size={12} className="text-gray-300" />
              </label>

              {isPending ? <InlineSkeleton width="100%" height={52} label="Loading sender IDs" /> : <select
                id="message-sender-id"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3.5 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] transition-all"
                required
              >
                {isError && <option>Error loading Sender IDs</option>}
                {!isPending && approvedSenderIds.length === 0 && (
                  <option value="">No approved Sender IDs found</option>
                )}

                {approvedSenderIds.map((item: any, index: number) => {
                  const unique = `${item}-${item.id || index}`;
                  return (
                    <option key={unique} value={item.senderId}>
                      {item.senderId} ({item.companyName})
                    </option>
                  );
                })}
              </select>}

              {/* Select Pagination Bar for SMS */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 mt-1 px-1">
                  <span className="text-xs text-gray-500">
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
            <div className="flex flex-col gap-2">
              <label htmlFor="message-sender-email" className="text-sm font-semibold text-slate-700">
                Sender email
              </label>
              {!senderEmail && (isEmailConfigPending || isDomainsPending) ? <InlineSkeleton width="100%" height={52} label="Loading sender email" /> : <input
                type="email"
                id="message-sender-email"
                value={provider === "GMAIL" ? gmail.email ?? "" : senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                disabled={provider === "GMAIL"}
                placeholder="noreply@yourdomain.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3.5 text-sm font-mono text-gray-700 outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] transition-all"
                required
              />}
            </div>
          )}

          {/* Email Subject Field (Email Channel Only) */}
          {channel === "email" && (
            <div className="flex flex-col gap-2">
              <label htmlFor="message-subject" className="text-sm font-semibold text-slate-700">
                Subject line
              </label>
              <input
                type="text"
                id="message-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Important updates regarding your account..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3.5 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] transition-all"
                required
              />
            </div>
          )}

          {/* Recipients Box */}
          <div className="flex flex-col gap-2">
            {channel === "sms" && (
              <div className="flex flex-col gap-2 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-slate-700">
                    Contact Audience
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsContactUploadOpen(true)}
                    disabled={!selectedAudienceId}
                    className="text-xs font-bold text-[#004aad] hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Import CSV
                  </button>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {isAudiencesPending ? <InlineSkeleton width="100%" height={48} label="Loading audiences" /> : <select
                    value={selectedAudienceId}
                    onChange={(event) => setSelectedAudienceId(event.target.value)}
                    disabled={isAudiencesPending || audiences.length === 0}
                    className="min-w-0 flex-1 rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20"
                  >
                    {!isAudiencesPending && audiences.length === 0 && (
                      <option>No contact audiences found</option>
                    )}
                    {audiences.map((audience) => (
                      <option key={audience.id} value={audience.id}>
                        {audience.name} ({audience.totalCount.toLocaleString()})
                      </option>
                    ))}
                  </select>}
                  <button
                    type="button"
                    onClick={handleUseAudience}
                    disabled={!selectedAudienceId || isSubscribersPending || isSubscribersError || subscribers.length === 0}
                    className="rounded-lg bg-[#004aad] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#003985] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSubscribersPending ? <InlineSkeleton width={85} height={16} label="Loading audience subscribers" /> : "Use audience"}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  {isSubscribersError
                    ? "Unable to load subscribers for this audience."
                    : selectedAudience
                    ? `${subscribers.length} subscriber${subscribers.length === 1 ? "" : "s"} loaded from ${selectedAudience.name}.`
                    : "Select an audience to load subscribers."}
                </p>
              </div>
            )}

            <div className="flex justify-between items-end">
              <label htmlFor="message-recipients" className="text-sm font-semibold text-slate-700">
                {channel === "sms" ? "Phone numbers" : "Email addresses"}
              </label>
              {channel === "sms" && <button
                type="button"
                disabled={!selectedAudienceId}
                onClick={() => setIsContactUploadOpen(true)}
                className="text-xs font-bold text-[#004aad] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Upload size={16} /> Import CSV
              </button>}
            </div>
            <textarea
              id="message-recipients"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder={
                channel === "sms"
                  ? "Enter mobile numbers comma-separated (+23480..., +23490...)"
                  : "Enter email addresses comma-separated (user1@domain.com, user2@domain.com)"
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-base text-gray-600 h-28 placeholder:font-sans outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] transition-all resize-none"
              required
            />
          </div>

          {/* Email content is authored in Unlayer. */}
          {channel === "email" && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-3.5 text-sm text-[#004aad]">
              Choose a saved email template, then check the preview before continuing.
            </div>
          )}

          {/* Message Payload Body */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label htmlFor={channel === "sms" ? "message-body" : undefined} className="text-sm font-semibold text-slate-700">
                {channel === "sms" ? "Message" : "Email content"}
              </label>
              {channel === "sms" && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${sms.segments > 1 ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-500'}`}>
                  {sms.characters} characters · {sms.encoding} · {sms.segments} SMS Unit{sms.segments !== 1 && 's'}
                </span>
              )}
            </div>
            {channel === "sms" ? (
              <textarea
                id="message-body"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your SMS content here..."
                maxLength={1000}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-base leading-7 text-gray-700 h-48 outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] transition-all resize-none"
                required
              />
            ) : (
              <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 text-center text-sm text-gray-500">
                {selectedTemplate
                  ? "Rendered template content is available in the Email preview preview."
                  : "Choose an email template to continue."}
              </div>
            )}
          </div>
        </div>

        {/* Submit Execution Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#004aad] hover:bg-[#003985] disabled:opacity-50 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004aad]/40"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send size={14} />
              <span>{scheduledAt ? "Schedule" : "Send"} {channel === "sms" ? "SMS" : "email"} message</span>
            </>
          )}
        </button>
        <p role="status" className="text-center text-sm leading-6 text-slate-600">{feedback || "Messages are queued for delivery when you submit."}</p>
      </form>

      {/* Real-Time Live Preview Display */}
      <div className="messaging-preview flex w-full flex-col items-center gap-6">
        <div className="flex w-full items-center justify-between lg:justify-center gap-3">
          <span className="text-sm font-semibold text-slate-700">
            {channel === "sms" ? "SMS preview" : "Email preview"}
          </span>
          {channel === "email" && message && (
            <button
              type="button"
              onClick={() => setIsEmailPreviewOpen(true)}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-[#004aad] hover:underline"
            >
              <Maximize2 size={11} />
              Preview
            </button>
          )}
        </div>

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
            <div className="bg-gray-50/50 min-h-[180px] text-xs text-gray-700 leading-relaxed font-sans">
              {selectedTemplate && isTemplateDetailsPending ? <div className="p-4"><DataSkeleton layout="form" rows={3} label="Loading email preview" /></div> : message ? (
                <iframe
                  title="Email template preview"
                  srcDoc={message}
                  sandbox=""
                  className="block h-[260px] w-full border-0 bg-white"
                />
              ) : (
                <span className="text-gray-300 italic text-[11px]">
                  Your email preview content will render live here...
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      </div>

      {/* Template Selection Modal (EMAIL ONLY) */}
      <AnimatePresence>
        {isTemplateModalOpen && channel === "email" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-2xl max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Choose an email template</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Find a saved design that fits your message.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  aria-label="Close template selector"
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
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
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold capitalize transition-all cursor-pointer ${
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
                  <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-sm text-gray-700 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#004aad]/10"
                  />
                </div>
              </div>

              {/* Template Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {isTemplatesPending && (
                  <div className="sm:col-span-2"><DataSkeleton layout="cards" rows={4} label="Loading email templates" /></div>
                )}

                {isTemplatesError && (
                  <p className="sm:col-span-2 py-8 text-center text-sm text-red-500">
                    Unable to load email templates. Please try again.
                  </p>
                )}

                {!isTemplatesPending && !isTemplatesError && filteredTemplates.length === 0 && (
                  <p className="sm:col-span-2 py-8 text-center text-sm text-gray-500">
                    No email templates match your filters.
                  </p>
                )}

                {filteredTemplates.map((tpl) => (
                  <button
                    type="button"
                    aria-pressed={selectedTemplate?.templateId === tpl.templateId}
                    key={tpl.templateId}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`border rounded-xl p-5 text-left cursor-pointer transition-all flex flex-col justify-between gap-3 hover:border-[#004aad] hover:shadow-md ${
                      selectedTemplate?.templateId === tpl.templateId
                        ? "border-[#004aad] bg-blue-50/20"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-black tracking-wide uppercase px-2 py-0.5 rounded-md ${
                            tpl.category === "Transactional"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : tpl.category === "Marketing"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-purple-50 text-[#004aad] border border-blue-100"
                          }`}
                        >
                          {tpl.category}
                        </span>
                        <span className="text-xs font-mono text-gray-500">
                          {tpl.updatedAt ? formatTemplateDate(tpl.updatedAt) : "Email template"}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 pt-1">{tpl.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {tpl.description || "Use this design for your email."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs">
                      <span className="text-gray-500">{formatTemplateDate(tpl.updatedAt)}</span>
                      <span className="text-[#004aad] font-bold flex items-center gap-0.5">
                        Use template <Check size={12} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEmailPreviewOpen && channel === "email" && message && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {selectedTemplate?.name || "Email preview"}
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-500">
                    This is the rendered content from the selected Unlayer template.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEmailPreviewOpen(false)}
                  className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close email preview"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-auto bg-gray-100 p-4 sm:p-8">
                <iframe
                  title="Full email template preview"
                  srcDoc={message}
                  sandbox=""
                  className="mx-auto min-h-[520px] w-full max-w-[680px] border-0 bg-white shadow-sm"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isContactUploadOpen && channel === "sms" && selectedAudienceId && (
          <UploadCsv
            setIsUploadModaOpen={setIsContactUploadOpen}
            selectedId={selectedAudienceId}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
