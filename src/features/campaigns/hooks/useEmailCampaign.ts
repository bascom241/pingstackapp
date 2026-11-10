import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addRecipients, createCampaign, getCampaign, getCampaigns, processCampaign } from "../api/emailCampaignService";
import type { AddRecipientRequest, CreateCampaignRequest } from "../types/campaign";

export const TEMPLATE_KEY = ["email-campaign"];

export const useCampaign = (page: number, size: number, enabled = true) => {
  return useQuery({
    queryKey: [...TEMPLATE_KEY, page, size],
    queryFn: () => getCampaigns(page, size),
    enabled,
  });
};

export const useSingleCampaign  = (campaign: string) => {
  return useQuery({
    queryKey: [... TEMPLATE_KEY, campaign], 
    queryFn: () => getCampaign(campaign),
    refetchInterval: 5000,
  })
}

export const useProcessCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: processCampaign, onSuccess: () => queryClient.invalidateQueries({ queryKey: TEMPLATE_KEY }) });
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

export const useAddRecipient = () => {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: (data: AddRecipientRequest) => addRecipients(data), 
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: TEMPLATE_KEY})
    } 
  })
}
