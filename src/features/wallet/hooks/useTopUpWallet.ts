import { useMutation } from "@tanstack/react-query"
import { topUpWallet } from "../api/topUpWallet"


export const useTopUpWallet = () => {
    return useMutation({
        mutationFn: topUpWallet
    });
}