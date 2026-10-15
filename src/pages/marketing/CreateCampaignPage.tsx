import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-[#f5f6f8] px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white sm:bg-transparent px-4 py-3 sm:px-0 sm:py-0 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-xl font-medium text-slate-700">
            <span className="hidden sm:inline text-slate-500">Email campaigns</span>
            <span className="hidden sm:inline text-slate-400">/</span>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-slate-900 transition hover:text-slate-600 cursor-pointer"
            >
              <ArrowLeft size={18} />
              <span className="font-semibold text-sm sm:text-lg">Create campaign</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="pt-0 sm:pt-8">
          <div className="mx-auto max-w-4xl">
            <div className="mt-0 sm:mt-6">
              {selectedCampaignType ? (
                <EmailCampaignFlow />
              ) : (
                <p className="p-4 text-center text-slate-500">No campaign type selected.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateCampaignPage;