import { ArrowLeft, Bell, CheckCircle2, PencilLine, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmailCampaignFlow from "../../components/dashboard/campaigns/email/index";
import { useCreateCampaignStore } from "../../features/campaigns/store/createCampaignStore";

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const { selectedCampaignType, resetCampaignFlow } = useCreateCampaignStore();

  const handleBack = () => {
    resetCampaignFlow();
    navigate("/dashboard/campaigns");
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between gap-4 border-b border-slate-200 bg-transparent pb-4">
          <div className="flex items-center gap-3 text-xl font-medium text-slate-700">
            <span className="text-slate-500">Email campaigns</span>
            <span className="text-slate-400">/</span>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-slate-900 transition hover:text-slate-600"
            >
              <ArrowLeft size={18} />
              <span className="font-semibold">Create an email campaign</span>
            </button>
          </div>

        
        </header>

        <main className="pt-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-10 text-center text-5xl font-semibold tracking-[-0.04em] text-slate-900">
              Create an email campaign
            </h1>

            <div className="mt-6">
              {selectedCampaignType ? <EmailCampaignFlow /> : <p className="text-slate-500">No campaign type selected.</p>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
