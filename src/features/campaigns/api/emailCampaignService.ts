import { axiosInstance } from "../../../api/axios";
import type { CreateCampaignRequest, CreateCampaignResponse } from "../types/campaign";

export const getCampaigns = async (page: number, size: number) => {
  const res = await axiosInstance.get("/campaign", {
    params: {
      page,
      size,
    },
  });

  return res.data;
};

export const createCampaign = async (data: CreateCampaignRequest): Promise<CreateCampaignResponse> => {
console.log(data)
  const res = await axiosInstance.post("/campaign", data);
  return res.data;
};
