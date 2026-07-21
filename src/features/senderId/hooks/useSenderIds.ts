import { useQuery } from "@tanstack/react-query";
import { getAllSenderIds, getApprovedSenderIds } from "../api/getSenderIds";


export const useGetAllSenderIds = (page:number, size: number) => {
    return useQuery({
        queryKey:["sender-id", page,size],
        queryFn:() => getAllSenderIds(page,size),
        placeholderData: (previousData) => previousData, 
    })
}

export const useGetApprovedIds = (page: number, size: number) => {
    return useQuery({
        queryKey: ["sender-id", page, size], 
        queryFn: () => getApprovedSenderIds(page, size), 
        placeholderData: (previousData) => previousData
    })
}

