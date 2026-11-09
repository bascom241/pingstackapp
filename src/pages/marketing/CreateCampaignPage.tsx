import MessagingHeader from '../../components/messaging/MessagingHeader';
import { ArrowLeft } from "../../ui/icons";
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
    <div className="messaging-page py-2 sm:py-4">
      <div className="mx-auto max-w-6xl">
        <button type="button" onClick={handleBack} className="mb-6 inline-flex items-center gap-2 rounded text-sm font-semibold text-slate-500 hover:text-[#004aad]"><ArrowLeft size={18} /> Back to campaigns</button>
        <MessagingHeader eyebrow="Email campaigns" title="Create your next connection" description="From your first idea to the final review. Put together an email your audience will want to open." />

        {/* Main Content Area */}
        <main className="pt-0">
          <div className="mx-auto max-w-4xl">
            <div className="mt-0">
              {selectedCampaignType ? (
                <EmailCampaignFlow />
              ) : (
                <div className="messaging-panel text-center"><h2 className="text-xl font-semibold">Start with a campaign</h2><p className="mt-3 text-base text-slate-500">Choose a campaign type to begin building your message.</p><button type="button" onClick={handleBack} className="messaging-primary mt-6">Choose campaign type</button></div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateCampaignPage;