import { ArrowRight, Loader2 } from "../../../../ui/icons";
import { useCreateCampaignStore } from "../../../../features/campaigns/store/createCampaignStore";
interface CampaignDetailsProps {
 
  isPending?: boolean;
}

const CampaignDetails = ({ isPending = false }: CampaignDetailsProps) => {
  const { formData, setFormData, goToNextStep } = useCreateCampaignStore();
  const canContinue = Boolean(
    formData.name?.trim() && formData.subject?.trim()
  );

 

  const handleContinue = () => {
    if (!canContinue || isPending) return;
      goToNextStep()
  };

  return (
    <div className="w-full mx-auto max-w-3xl">

      {/* Main Form Box: full width/flat on mobile, rounded card on sm+ */}
      <div className="min-h-0 w-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-7 flex flex-col justify-between sm:block">

        <div className="space-y-6">
          {/* Step Badge & Header */}
          <div className="space-y-2 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Campaign Details
            </h1>

            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Provide an internal reference name and a compelling subject line for your subscribers.
            </p>
          </div>

          <div className="space-y-7">
            {/* Campaign Name Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="campaign-name"
                  className="block text-sm font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Campaign Name <span className="text-rose-500">*</span>
                </label>
                <span className="text-sm font-mono text-slate-500">
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3.5 text-base text-slate-800 placeholder:text-slate-500 outline-none transition-all duration-200 focus:bg-white focus:border-[#004aad] focus:ring-3 focus:ring-[#004aad]/10"
              />

              <p className="text-sm text-slate-500">
                Internal use only — subscribers won't see this name.
              </p>
            </div>

            {/* Email Subject Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="campaign-subject"
                  className="block text-sm font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Email Subject <span className="text-rose-500">*</span>
                </label>
                <span className="text-sm font-mono text-slate-500">
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3.5 text-base text-slate-800 placeholder:text-slate-500 outline-none transition-all duration-200 focus:bg-white focus:border-[#004aad] focus:ring-3 focus:ring-[#004aad]/10"
              />

              <p className="text-sm text-slate-500">
                Keep it clear and enticing. This is displayed directly in their inbox.
              </p>
            </div>

        
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6 sm:mt-0">
          <span className="text-sm text-slate-500">
            Step 1 of 4
          </span>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue || isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#004aad] px-5 py-3.5 text-sm font-semibold text-white transition-all shadow-sm shadow-blue-900/10 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
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