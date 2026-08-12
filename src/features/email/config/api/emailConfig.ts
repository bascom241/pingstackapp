import { axiosInstance } from "../../../../api/axios";
import type { ApiKeyGeneratedResponse, EmailConfigResponse, UpdatePreferenceDto } from "../../../../types/email/EmailConfigDto";

export const createOrGetEmailConfig = async (): Promise<EmailConfigResponse> => {
    const res = await axiosInstance.get("/email-config"); 
    return res.data;
}

export const generateApiKey = async (): Promise<ApiKeyGeneratedResponse> => {
    const res = await axiosInstance.post("/email-config");
    return res.data; 
}

export const updateTrackPrefrence = async (data: UpdatePreferenceDto): Promise<UpdatePreferenceDto> => {
    const res = await axiosInstance.put("/email-config/preference", data);
    return res.data;
} 