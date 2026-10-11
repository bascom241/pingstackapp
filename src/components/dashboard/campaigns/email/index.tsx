import CampaignDetails from "./CampaignDetails";
import CampaignTemplate from "./CampaignTemplate";
import CampaignRecipients from "./CampaignRecipients";
import { useCreateCampaignStore } from "../../../../features/campaigns/store/createCampaignStore";
import { useCreateCampaign } from "../../../../features/campaigns/hooks/useEmailCampaign";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getApiErrorMessage } from "../../../../utils/apiError";

const Index = () => {
  // Extract setCurrentStep from the store to handle step transitions
  const { currentStep, setCurrentStep, formData } = useCreateCampaignStore();
  const { mutate, isPending } = useCreateCampaign();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  if (currentStep <= 0) return null;
  console.log(formData)
  const createCampaignDetail = () => {


    const detail = {
      name: formData.name,
      subject: formData.subject
    }
    mutate(detail, {

     
      onSuccess: (data) => {
        enqueueSnackbar(data?.message || "Campaign details saved successfully!", {
          variant: "success",
        });
        
        // Advance to Step 2 (CampaignTemplate) on success
        setCurrentStep(2);
      },
      onError: (error: unknown) => {
        const errorMessage = getApiErrorMessage(error, "Failed to save campaign details");
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
      },
    });
  };

  return (
    <>
      {/* Pass createCampaignDetail and isPending as props to Step 1 if submitting happens there */}
      {currentStep === 1 && (
        <CampaignDetails
          onSubmit={createCampaignDetail}
          isPending={isPending}
        />
      )}
      {currentStep === 2 && <CampaignTemplate />}
      {currentStep === 3 && <CampaignRecipients />}
    </>
  );
};

export default Index;