import { axiosInstance } from "../../../api/axios";
import type {
  CampaignPageResponse,
  CreateCampaignRequest,
  CreateCampaignResponse,
  AddRecipientRequest,
  CampaignSummary
} from "../types/campaign";

export const getCampaigns = async (page: number, size: number): Promise<CampaignPageResponse> => {
  const res = await axiosInstance.get("/campaign", {
    params: {
      page,
      size,
    },
  });

  return res.data;
};

export const getCampaign = async (campaignId: string): Promise<CampaignSummary> => {
  const res = await axiosInstance.get(`/campaign/${campaignId}`);
  return res.data;
} 

export const createCampaign = async (data: CreateCampaignRequest): Promise<CreateCampaignResponse> => {
  const res = await axiosInstance.post("/campaign", data);
  return res.data;
};

export const processCampaign = async (campaignId: string): Promise<void> => {
  await axiosInstance.put(`/campaign/${campaignId}/process`);
};

export const addRecipients = async(data: AddRecipientRequest): Promise<void> => {
    const {campaignId, recipient} = data
    const res = await axiosInstance.put(`/campaign/${campaignId}/add-recipient`,recipient);
    return res.data; 
}
