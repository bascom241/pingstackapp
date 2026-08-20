import { useMutation, useQuery } from "@tanstack/react-query"
import { createOrGetEmailConfig , generateApiKey, updateTrackPrefrence} from "../api/emailConfig"
import { verifyDomain } from "../api/domainMananagement"


export const EMAIL_CONFIG_QUERY = ["email_config"]


export const useGetEmailConfig = () => {
    return useQuery({
        queryKey: EMAIL_CONFIG_QUERY,
        queryFn: createOrGetEmailConfig,
    })
}

export const useGenerateApiKey = () => {
    return useMutation({
        mutationFn: generateApiKey
    })
}

export const useUpdatePreference = () => {
    return useMutation({
        mutationFn: updateTrackPrefrence
    })
} 

export const useVerifyDomain = () => {
    return useMutation({
        mutationFn: verifyDomain
    })
}