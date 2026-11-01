import { ArrowRight, Mail, Loader2 } from "lucide-react";
import { useCreateCampaignStore } from "../../../../features/campaigns/store/createCampaignStore";
import { useNavigate } from "react-router-dom";
interface CampaignDetailsProps {
 
  isPending?: boolean;
}

const CampaignDetails = ({ isPending = false }: CampaignDetailsProps) => {
  const { formData, setFormData, goToNextStep } = useCreateCampaignStore();
  console.log(formData)
  const canContinue = Boolean(
    formData.name?.trim() 
  );

 

  const handleContinue = () => {
    if (!canContinue || isPending) return;
      goToNextStep()
  };

  return (
    <div className="w-full sm:mx-auto sm:max-w-xl sm:px-6 sm:py-4">

      {/* Main Form Box: full width/flat on mobile, rounded card on sm+ */}
      <div className="min-h-screen sm:min-h-0 w-full rounded-none border-0 bg-white p-5 sm:p-6 sm:rounded-2xl sm:border sm:border-slate-100 sm:shadow-sm space-y-5 flex flex-col justify-between sm:block">

        <div className="space-y-6">
          {/* Step Badge & Header */}
          <div className="space-y-2 text-left">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Campaign Details
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Provide an internal reference name and a compelling subject line for your subscribers.
            </p>
          </div>

          <div className="space-y-5">
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

        
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6 sm:mt-0">
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