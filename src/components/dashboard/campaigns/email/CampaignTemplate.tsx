import { DataSkeleton } from "../../../../ui/Skeleton";
import { ArrowLeft, ArrowRight, Check } from "../../../../ui/icons";
import { useCreateCampaignStore } from "../../../../features/campaigns/store/createCampaignStore";
import { useGetTemplateForUser } from "../../../../features/templates/hooks/useTemplate";

const CampaignTemplate = () => {
  const { formData, setTemplateId, currentStep, setCurrentStep, goToPreviousStep } = useCreateCampaignStore();
  const { data: templates = [], isPending, isError, refetch } = useGetTemplateForUser();

  const selectedTemplate = templates.find((template) => template.templateId === formData.templateId);
  const hasTemplate = Boolean(formData.templateId || selectedTemplate);

  const handleContinue = () => {
    if (!hasTemplate) return;
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-4 sm:px-6">
      <div className="mb-6 space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#004aad]/20 bg-[#004aad]/5 px-3 py-1 text-sm font-semibold text-[#004aad]">
        
          <span>Step 2 of 4 · Template</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Choose a campaign template
        </h1>

        <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
          Select the design that best fits your message and brand style.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
        {isPending ? <DataSkeleton layout="cards" rows={3} label="Loading campaign templates" /> : isError ? <div role="alert" className="dashboard-empty"><strong>Templates could not be loaded.</strong><button type="button" className="dashboard-button" onClick={() => void refetch()}>Try again</button></div> : templates.length === 0 ? <p className="text-sm text-slate-500">No email templates yet. Create a template before continuing.</p> : <div className="grid gap-4 md:grid-cols-3">
          {templates.map((template) => {
            const isSelected = formData.templateId === template.templateId || selectedTemplate?.templateId === template.templateId;

            return (
              <button
                key={template.templateId}
                type="button"
                onClick={() => setTemplateId(template.templateId)}
                className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-[#004aad] bg-[#eff6ff] shadow-[0_14px_30px_rgba(0,74,173,0.08)]"
                    : "border-slate-200 bg-slate-50 hover:border-[#93c5fd] hover:bg-white"
                }`}
              >
              
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                   
                    <span className="text-xl sm:text-2xl font-semibold text-slate-800">{template.name}</span>
                  </div>
                  {isSelected && <Check size={16} className="text-[#004aad]" />}
                </div>
                <p className="text-base leading-relaxed text-slate-500">{template.description}</p>
              </button>
            );
          })}
        </div>}

        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!hasTemplate || isPending || isError}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#004aad] px-5 py-3.5 text-base font-semibold text-white shadow-[0_12px_30px_rgba(0,74,173,0.08)] transition hover:bg-[#003985] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignTemplate;