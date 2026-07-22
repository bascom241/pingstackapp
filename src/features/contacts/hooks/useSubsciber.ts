import { createSubscriber, getAllSubscribers , uploadSubscribers} from "../api/subscriber";
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




