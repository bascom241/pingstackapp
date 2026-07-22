import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllAudience, getSingleAudience} from "../api/audience";
import { createAudience } from "../api/audience";
export const AUDIENCE_QUERY_KEY = ['audience'];


export const useCreateAudience = () => {
    return useMutation({
        mutationFn: createAudience
    })
}
export const useGetAllAudience =  () => {
    return useQuery({
        queryKey: AUDIENCE_QUERY_KEY, 
        queryFn: getAllAudience, 
        placeholderData: (previousData) => previousData 
    })
} 

export const useGetSingleAudience = (listId: string ) => {
    return useQuery({
        queryKey: [...AUDIENCE_QUERY_KEY, listId], 
        queryFn: () => getSingleAudience(listId),
        placeholderData: (previousData) => previousData,
        enabled: Boolean(listId)
    })
}

