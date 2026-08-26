import { getOrderChart } from "../api/getOrderChart";
import { useQuery } from "@tanstack/react-query";


export const useOrderChat = () => {
    return useQuery({
        queryKey:["order-chat"], 
        queryFn: getOrderChart
    })
}