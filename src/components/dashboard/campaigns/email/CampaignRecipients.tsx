import { ArrowLeft, ArrowRight, Check, Mail, Plus, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useCreateCampaignStore } from "../../../../features/campaigns/store/createCampaignStore";

const emptyRecipient = { name: "", email: "" };

const CampaignRecipients = () => {
  const { formData, addRecipient, updateRecipient, removeRecipient, currentStep, setCurrentStep, goToPreviousStep } = useCreateCampaignStore();
  const [draft, setDraft] = useState(emptyRecipient);

  const recipientRequests = formData.recipientRequests ?? [];
  const canContinue = recipientRequests.length > 0;

  const handleAddRecipient = () => {
    const cleanedName = draft.name.trim();
    const cleanedEmail = draft.email.trim();

    if (!cleanedName || !cleanedEmail) return;

    const nextRecipient = { name: cleanedName, email: cleanedEmail };
    addRecipient(nextRecipient);
    setDraft(emptyRecipient);
  };

  const handleSubmit = () => {
    if (!canContinue) return;
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-4 sm:px-6">
      <div className="mb-6 space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#5b4dd7]/20 bg-[#5b4dd7]/5 px-3 py-1 text-xs font-semibold text-[#5b4dd7]">
          <Mail size={13} />
          <span>Step 3 of 3 · Recipients</span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Add your recipients
        </h1>

        <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
          Add each subscriber you want to receive this campaign.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-[#5b4dd7]/10 p-2 text-[#5b4dd7]">
                <UserPlus size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Add recipient</h2>
                <p className="text-xs text-slate-500">Create one row at a time.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="recipient-name" className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Recipient name
                </label>
                <input
                  id="recipient-name"
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Jane Smith"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#5b4dd7] focus:ring-4 focus:ring-[#5b4dd7]/10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="recipient-email" className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Email address
                </label>
                <input
                  id="recipient-email"
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="jane@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#5b4dd7] focus:ring-4 focus:ring-[#5b4dd7]/10"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddRecipient}
              disabled={!draft.name.trim() || !draft.email.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5b4dd7] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,77,215,0.2)] transition hover:bg-[#4b3fc8] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Plus size={16} />
              Add recipient
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Recipient list</h3>
              <span className="rounded-full bg-[#5b4dd7]/10 px-2 py-1 text-xs font-semibold text-[#5b4dd7]">
                {recipientRequests.length} added
              </span>
            </div>

            <div className="space-y-3">
              {recipientRequests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  No recipients yet. Add the first subscriber to continue.
                </div>
              ) : (
                recipientRequests.map((recipient, index) => (
                  <div key={`${recipient.email}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-800">{recipient.name}</div>
                      <div className="truncate text-xs text-slate-500">{recipient.email}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeRecipient(index)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      aria-label={`Remove ${recipient.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
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
            onClick={handleSubmit}
            disabled={!canContinue}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b4dd7] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,77,215,0.28)] transition hover:bg-[#4b3fc8] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            Review campaign
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignRecipients;