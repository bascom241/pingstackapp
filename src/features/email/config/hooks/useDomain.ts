import { useMutation, useQuery } from "@tanstack/react-query";
import { createDomain, getAllDomains , getSingleDomain, makePrimary, deleteDomain} from "../api/domainMananagement";
import { useQueryClient } from "@tanstack/react-query";
import { EMAIL_CONFIG_QUERY } from "./useEmailConfig";
import type { BrevoDomainDto } from "../../../../types/email/EmailConfigDto";

export const DOMAIN_QUERY_KEY = ["domains"]

export const useCreateDomain = () => {
    return useMutation({
        mutationFn: createDomain
    })
}


export const useGetAllDomains = () => {
    return useQuery({
        queryKey: DOMAIN_QUERY_KEY,
        queryFn:getAllDomains
    })
}

export const useGetSingleDomain = (domainId:string | undefined  ) => {
    return useQuery({
        queryKey: [DOMAIN_QUERY_KEY, domainId], 
        queryFn: () =>  getSingleDomain(domainId), 
        enabled: !!domainId
    })
}


export const useMakeDomainPrimary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (domainId: string) => makePrimary(domainId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOMAIN_QUERY_KEY] });
      queryClient.invalidateQueries({queryKey: [EMAIL_CONFIG_QUERY]})
    },
  });
};





export const useDeleteDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (domainId: string) => deleteDomain(domainId),
    onMutate: async (deletedDomainId) => {
      await queryClient.cancelQueries({ queryKey: ["domains"] });
      const previousDomains = queryClient.getQueryData<BrevoDomainDto[]>(["domains"]);
      queryClient.setQueryData<BrevoDomainDto[]>(["domains"], (old = []) =>
        old.filter((domain) => domain.id !== deletedDomainId)
      );

      return { previousDomains };
    },
    onError: (err, deletedDomainId, context) => {
    
      if (context?.previousDomains) {
        queryClient.setQueryData(["domains"], context.previousDomains);
      }
    },
    onSettled: () => {

      queryClient.invalidateQueries({ queryKey: DOMAIN_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [EMAIL_CONFIG_QUERY] });
    },
  });
};