import { Check } from "../../../../ui/icons";
import "../../../messaging/messaging.css";
import CampaignDetails from "./CampaignDetails";
import CampaignTemplate from "./CampaignTemplate";
import CampaignRecipients from "./CampaignRecipients";
import { useCreateCampaignStore } from "../../../../features/campaigns/store/createCampaignStore";
import { useCreateCampaign } from "../../../../features/campaigns/hooks/useEmailCampaign";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getApiErrorMessage } from "../../../../utils/apiError";
import FinalCampaignDetail from "./FinalCampaignDetail";
const Index = () => {
  const { currentStep, formData, resetCampaignFlow } = useCreateCampaignStore();
  const { mutate, isPending } = useCreateCampaign();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  if (currentStep <= 0) return null;

  const createCampaignDetail = () => {
    mutate(formData, {
      onSuccess: (data) => {
        enqueueSnackbar(data?.message?.trim() || "Campaign created successfully.", {
          variant: "success",
        });
        resetCampaignFlow();
        navigate("/dashboard/campaigns");
      },
      onError: (error: unknown) => {
        const errorMessage = getApiErrorMessage(error, "Failed to create campaign.");
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
      },
    });
  };

  return (
    <>
      <ol className="messaging-steps" aria-label="Campaign progress">
        {["Details", "Template", "Recipients", "Review"].map((label, index) => (
          <li key={label} className={`messaging-step ${currentStep > index + 1 ? 'is-complete' : ''}`} aria-current={currentStep === index + 1 ? 'step' : undefined}>
            <span className="messaging-step-number">{currentStep > index + 1 ? <Check size={16} /> : index + 1}</span>
            <span>{label}</span>
          </li>
        ))}
      </ol>
      {currentStep === 1 && (
        <CampaignDetails
          isPending={isPending}
        />
      )}
      {currentStep === 2 && <CampaignTemplate />}
      {currentStep === 3 && <CampaignRecipients />}
      {currentStep === 4 && <FinalCampaignDetail
        onSubmit={createCampaignDetail}
        isPending={isPending}
      />}
    </>
  );
};

export default Index;