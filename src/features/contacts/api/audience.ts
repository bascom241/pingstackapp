import { axiosInstance } from "../../../api/axios"
import type { AudienceResponseDto } from "../../../types/contacts/AudienceType";
import type{ CreateAudience } from "../../../types/contacts/AudienceType";
import type{ UploadFileRequest } from "../../../types/upload/uploadFileTypes";

export const createAudience = async (data: CreateAudience) => {
    const res = await axiosInstance.post("/audience", data); 
    return res.data;
}

export const getAllAudience = async (): Promise<AudienceResponseDto[]> => {
    const response = await axiosInstance.get("/audience");
    return response.data; 
}

export const uploadAudienceSubscribersCsv = async ( data: UploadFileRequest) => {
    const res = await axiosInstance.post ("/audience/upload", data);
    return res.data;
}