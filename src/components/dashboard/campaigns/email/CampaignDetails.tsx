import { ArrowRight, Mail, Loader2 } from "lucide-react";
import { useCreateCampaignStore } from "../../../../features/campaigns/store/createCampaignStore";

interface CampaignDetailsProps {
  onSubmit?: () => void;
  isPending?: boolean;
}

const CampaignDetails = ({ onSubmit, isPending = false }: CampaignDetailsProps) => {
  const { formData, setFormData } = useCreateCampaignStore();

  const canContinue = Boolean(
    formData.name?.trim() && formData.subject?.trim()
  );

  const handleContinue = () => {
    if (!canContinue || isPending) return;
    
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-4 sm:px-6">
      
      {/* Step Badge & Header */}
      <div className="mb-6 space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#004aad]/20 bg-[#004aad]/5 px-3 py-1 text-xs font-semibold text-[#004aad]">
          <span>Step 1 of 3 · Setup</span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Campaign Details
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Provide an internal reference name and a compelling subject line for your subscribers.
        </p>
      </div>

      {/* Main Form Box */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm space-y-5">
        
        {/* Campaign Name Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="campaign-name"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
            >
              Campaign Name <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {formData.name?.length || 0}/128
            </span>
          </div>

          <input
            id="campaign-name"
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ name: e.target.value })}
            placeholder="e.g. October Product Announcement"
            maxLength={128}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-[#004aad] focus:ring-3 focus:ring-[#004aad]/10"
          />

          <p className="text-[11px] text-slate-400">
            Internal use only — subscribers won't see this name.
          </p>
        </div>

        {/* Email Subject Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="campaign-subject"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
            >
              Email Subject <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {formData.subject?.length || 0}/150
            </span>
          </div>

          <input
            id="campaign-subject"
            type="text"
            value={formData.subject || ""}
            onChange={(e) => setFormData({ subject: e.target.value })}
            placeholder="e.g. Something special is coming your way..."
            maxLength={150}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-[#004aad] focus:ring-3 focus:ring-[#004aad]/10"
          />

          <p className="text-[11px] text-slate-400">
            Keep it clear and enticing. This is displayed directly in their inbox.
          </p>
        </div>

        {/* Live Subject Line Inbox Preview Box */}
        {formData.subject?.trim() && (
          <div className="mt-3 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/60 to-sky-50/40 p-3.5">
            <div className="flex items-center gap-2 mb-1">
              <Mail size={14} className="text-[#004aad]" />
              <span className="text-[10px] font-bold text-[#004aad] uppercase tracking-wider">
                Inbox Preview
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 break-words leading-snug">
              {formData.subject}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            Step 1 of 3
          </span>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue || isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#004aad] px-5 py-2.5 text-xs font-semibold text-white transition-all shadow-sm shadow-blue-900/10 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CampaignDetails;