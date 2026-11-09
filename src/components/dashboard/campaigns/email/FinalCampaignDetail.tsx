
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    FileText,
    Loader2,
    Mail,
    Send,
    Users,
} from "../../../../ui/icons";

import { useCreateCampaignStore } from "../../../../features/campaigns/store/createCampaignStore";

interface FinalCampaignProps {
    onSubmit: () => void
    isPending: boolean
}

const FinalCampaignDetail = ({onSubmit, isPending}: FinalCampaignProps) => {
    const { formData, goToPreviousStep } = useCreateCampaignStore();

    const campaignName = formData.name ?? "Not found";
    const subject = formData.subject ?? "Not found";
    const templateId = formData.templateId ?? "Not found";
    const recipients = formData.recipientRequests ?? [];


    const handleSuccess = () => {
        onSubmit();
    }

    return (
        <main className="bg-transparent py-4">

            <div className="mx-auto max-w-4xl">

                {/* Back navigation */}
                <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="mb-8 flex items-center gap-2 text-base font-semibold text-gray-500 hover:text-[#004aad] transition-colors"
                >
                    <ArrowLeft size={17} />
                    Back to campaign setup
                </button>

                {/* Page heading */}
                <div className="mb-9">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-[#004aad]">
                            FINAL STEP
                        </span>
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                        Review your campaign
                    </h1>

                    <p className="mt-3 max-w-xl text-base leading-6 text-gray-500">
                        Take a moment to review your campaign details and
                        recipients before submitting. Make sure everything
                        looks correct.
                    </p>
                </div>

                {/* Campaign status */}
                <div className="mb-7 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                    <CheckCircle2 className="shrink-0 text-[#004aad]" size={22} />

                    <div>
                        <p className="text-base font-bold text-gray-900">
                            Your campaign is ready for review
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            Review the information below before proceeding.
                        </p>
                    </div>
                </div>

                {/* Campaign information */}
                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#004aad]">
                                <FileText size={20} />
                            </div>

                            <div>
                                <h2 className="font-bold text-gray-900">
                                    Campaign information
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Basic details about your campaign
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 px-6 py-7 sm:grid-cols-2 sm:px-8">

                        <div>
                            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                                Campaign name
                            </p>
                            <p className="text-base font-bold text-gray-900">
                                {campaignName}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                                Email subject
                            </p>
                            <p className="break-all text-base font-semibold text-gray-800">
                                {subject}
                            </p>
                        </div>

                        <div className="sm:col-span-2">
                            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                                Template ID
                            </p>
                            <div className="rounded-lg bg-gray-50 px-4 py-3">
                                <p className="break-all font-mono text-sm text-gray-600">
                                    {templateId}
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Recipients */}
                <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-5 sm:px-8">

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#004aad]">
                                <Users size={20} />
                            </div>

                            <div>
                                <h2 className="font-bold text-gray-900">
                                    Campaign recipients
                                </h2>
                                <p className="text-sm text-gray-500">
                                    People who will receive this campaign
                                </p>
                            </div>
                        </div>

                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-[#004aad]">
                            {recipients.length} {recipients.length === 1 ? "Recipient" : "Recipients"}
                        </span>

                    </div>

                    <div className="px-6 py-5 sm:px-8">

                        {recipients.length > 0 ? (
                            <div className="flex flex-col gap-3">

                                {recipients.map((recipient, index) => (
                                    <div
                                        key={`${recipient.email}-${index}`}
                                        className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 transition-colors hover:border-blue-100 hover:bg-blue-50/30"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-base font-bold uppercase text-[#004aad]">
                                            {recipient.name?.charAt(0) || "R"}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-base font-bold text-gray-900">
                                                {recipient.name || "Unnamed recipient"}
                                            </p>

                                            <div className="mt-1 flex items-center gap-2">
                                                <Mail size={13} className="shrink-0 text-gray-500" />
                                                <p className="truncate text-sm text-gray-500">
                                                    {recipient.email}
                                                </p>
                                            </div>
                                        </div>

                                        <CheckCircle2
                                            size={18}
                                            className="shrink-0 text-green-500"
                                        />
                                    </div>
                                ))}

                            </div>
                        ) : (
                            <div className="py-10 text-center">
                                <Users size={30} className="mx-auto mb-3 text-gray-300" />
                                <p className="text-base font-semibold text-gray-700">
                                    No recipients added
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Go back and add recipients to your campaign.
                                </p>
                            </div>
                        )}

                    </div>
                </section>

                {/* Final action */}
                <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                    <div className="mb-6">
                        <h3 className="font-bold text-gray-900">
                            Ready to create your campaign?
                        </h3>

                        <p className="mt-2 text-base leading-6 text-gray-500">
                            Once submitted, your campaign details will be
                            processed. Make sure you have reviewed all
                            the information above.
                        </p>
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            onClick={goToPreviousStep}
                            className="rounded-xl border border-gray-200 px-6 py-3 text-base font-bold text-gray-600 transition-colors hover:bg-gray-50"
                        >
                            Go back and edit
                        </button>

                        <button
                            type="button"
                            disabled={recipients.length === 0 || isPending}
                            onClick={handleSuccess}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#004aad] px-7 py-3 text-base font-bold text-white shadow-sm shadow-blue-900/10 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {
                                isPending ? <><Loader2 className="animate-spin" /> Submitting campaign...</> : <><Send size={16} /> <span>Submit campaign</span> <ArrowRight size={16} /></>
                            }
                          
                        </button>

                    </div>

                </div>

            </div>
        </main>
    );
};

export default FinalCampaignDetail;
