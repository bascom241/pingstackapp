import { useMutation } from "@tanstack/react-query";
import { uploadAudienceSubscribersCsv } from "../api/audience";



export const useUploadCsv = () => {
    return useMutation({
        mutationFn: uploadAudienceSubscribersCsv
    })
}