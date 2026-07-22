import { axiosInstance } from "../../../api/axios";
import type { CreateSubscriber } from "../../../types/contacts/contactTypes";
import type { UploadFileRequest } from "../../../types/upload/uploadFileTypes";

export const createSubscriber = async (data: CreateSubscriber) => {
    const res = await axiosInstance.post("/audience/subscriber", data);
    return res.data;
}

export const getAllSubscribers = async (listId: string , query: string, page: number, size: number) => {
    const res = await axiosInstance.get("/audience/subscribers", {
        params: {
            listId, 
            query, 
            page , 
            size
        }
    });
    return res.data;
}


export const uploadSubscribers = async (data: UploadFileRequest) => {
    const res = await axiosInstance.post("/audience/upload", data); 
    return res.data;
}


