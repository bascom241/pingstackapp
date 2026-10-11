import { ArrowLeft, ArrowRight, Check, LayoutTemplate, Sparkles } from "lucide-react";
import { useCreateCampaignStore } from "../../../../features/campaigns/store/createCampaignStore";
import { useGetTemplateForUser } from "../../../../features/templates/hooks/useTemplate";

const templateOptions = [
  {
    id: "welcome-series",
    name: "Welcome series",
    description: "Perfect for onboarding and warm intros.",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    id: "launch-update",
    name: "Launch update",
    description: "A polished announcement for product drops.",
    accent: "from-fuchsia-500 to-violet-500",
  },
  {
    id: "retention-nudge",
    name: "Retention nudge",
    description: "Motivating follow-ups to re-engage customers.",
    accent: "from-sky-500 to-cyan-500",
  },
];

const CampaignTemplate = () => {
  const { formData, setTemplateId, currentStep, setCurrentStep, goToPreviousStep } = useCreateCampaignStore();
  const { data: templates = [] } = useGetTemplateForUser();

  const selectedTemplate = templates.find((template) => template.templateId === formData.templateId);
  const hasTemplate = Boolean(formData.templateId || selectedTemplate);

  const handleContinue = () => {
    if (!hasTemplate) return;
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-4 sm:px-6">
      <div className="mb-6 space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#5b4dd7]/20 bg-[#5b4dd7]/5 px-3 py-1 text-xs font-semibold text-[#5b4dd7]">
          <Sparkles size={13} />
          <span>Step 2 of 3 · Template</span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Choose a campaign template
        </h1>

        <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
          Select the design that best fits your message and brand style.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {templateOptions.map((template) => {
            const isSelected = formData.templateId === template.id || selectedTemplate?.templateId === template.id;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setTemplateId(template.id)}
                className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-[#5b4dd7] bg-[#f5f3ff] shadow-[0_14px_30px_rgba(91,77,215,0.12)]"
                    : "border-slate-200 bg-slate-50 hover:border-[#c7c2ff] hover:bg-white"
                }`}
              >
                <div className={`mb-4 h-28 rounded-xl bg-linear-to-br ${template.accent}`} />
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-white p-2 text-[#5b4dd7] shadow-sm">
                      <LayoutTemplate size={16} />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{template.name}</span>
                  </div>
                  {isSelected && <Check size={16} className="text-[#5b4dd7]" />}
                </div>
                <p className="text-sm leading-relaxed text-slate-500">{template.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!hasTemplate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b4dd7] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,77,215,0.28)] transition hover:bg-[#4b3fc8] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
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