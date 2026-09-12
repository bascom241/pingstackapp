import { useQuery } from "@tanstack/react-query";
import { getTemplates, getSingleTemplate } from "../api/templateService";



export const TEMPLATE_KEY = ["email-templates"]


export const useGetTemplateForUser = () => {
    return useQuery({
        queryKey: TEMPLATE_KEY, 
        queryFn:getTemplates
    })
}

export const useGetSingleTemplate = (id: string) => {
    return useQuery({
        queryKey: [TEMPLATE_KEY, id], 
        queryFn: () =>  getSingleTemplate(id)
    })
}