import { axiosInstance } from "../../../api/axios";
import type{ EmailTemplateResponse } from "../../../types/templates/EmailTemplateResponse";

export const getTemplates = async (): Promise<EmailTemplateResponse[]> => {
    const res = await axiosInstance.get("/email-template");
    return res.data;
}

export const getSingleTemplate = async (id: string): Promise<EmailTemplateResponse>=> {
    const res = await axiosInstance.get(`/email-template/${id}`); 
    return res.data;
}