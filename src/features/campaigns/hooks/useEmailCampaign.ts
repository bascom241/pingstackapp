import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCampaign, getCampaigns } from "../api/emailCampaignService";
import type { CreateCampaignRequest } from "../types/campaign";

export const TEMPLATE_KEY = ["email-campaign"];

export const useCampaign = (page: number, size: number, enabled = true) => {
  return useQuery({
    queryKey: [...TEMPLATE_KEY, page, size],
    queryFn: () => getCampaigns(page, size),
    enabled,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCampaignRequest) => createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATE_KEY });
    },
  });
};