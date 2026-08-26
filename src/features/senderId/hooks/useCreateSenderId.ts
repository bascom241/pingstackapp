import { createSenderId } from "../api/createSenderId";
import { useMutation } from "@tanstack/react-query";


export const useCreateSenderId = () => {
    return useMutation({
        mutationFn: createSenderId
    })
}