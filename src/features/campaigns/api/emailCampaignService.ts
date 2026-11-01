import { axiosInstance } from "../../../api/axios";
import type {
  CampaignPageResponse,
  CreateCampaignRequest,
  CreateCampaignResponse,
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

export const createCampaign = async (data: CreateCampaignRequest): Promise<CreateCampaignResponse> => {
  const res = await axiosInstance.post("/campaign", data);
  return res.data;
};
