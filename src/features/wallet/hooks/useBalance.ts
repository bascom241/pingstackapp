import { getBalance } from "../api/getBalance";
import { useQuery } from "@tanstack/react-query";


export const useBalance = () => {
    return useQuery({
        queryKey: ["balance"],
        queryFn:getBalance
    })
}