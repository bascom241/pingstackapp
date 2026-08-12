import { createSubscriber, getAllSubscribers , getSingleSubscriber, updateSubscriber, uploadSubscribers, deleteSubscriber} from "../api/subscriber";
import { useMutation, useQuery } from "@tanstack/react-query";

export const SUBSCIBERS_QUERY_KEY = ["subscibers"]


export const useCreateSubcriber = () => {
    return useMutation({
        mutationFn: createSubscriber
    })
}

export const useGetAllSubscibers = (listId: string , query: string, page: number, size: number) => {
    return useQuery({
        queryKey:[...SUBSCIBERS_QUERY_KEY, listId,query, page,size ] , 
        queryFn: () => getAllSubscribers(listId, query,page, size), 
        placeholderData: (previousData) => previousData,
        enabled: Boolean(listId)
    })
}


export const uploadCSVSubscibers = () => {
    return useMutation({
        mutationFn: uploadSubscribers
    })
}


export const useUpdateSubscriber = () => {
    return useMutation({
        mutationFn: updateSubscriber
    })
}


export const useGetSingSubscriber = (id: string) => {
    return useQuery({
        queryKey: [...SUBSCIBERS_QUERY_KEY, id], 
        queryFn:() =>  getSingleSubscriber(id), 
        placeholderData: (previousData) => previousData,
        enabled: Boolean(id)
    })
}


export const useDeleteSubscriber = (subscriberId: string, audienceId: string) => {
    return useMutation({
        mutationFn:() =>  deleteSubscriber(subscriberId, audienceId)
    })
}



