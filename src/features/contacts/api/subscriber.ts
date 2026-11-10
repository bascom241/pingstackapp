import { axiosInstance } from "../../../api/axios";
import type { CreateSubscriber, UpdateSubscriber } from "../../../types/contacts/contactTypes";
import type { UploadFileRequest } from "../../../types/upload/uploadFileTypes";

export type AudienceSubscriber = {
    name?: string;
    destinationNumber?: string;
    transactionNumber?: string;
};

export const getEntireAudience = async (listId: string, signal?: AbortSignal): Promise<AudienceSubscriber[]> => {
    const subscribers: AudienceSubscriber[] = [];
    let page = 0;
    let totalPages = 1;
    do {
        const { data } = await axiosInstance.get("/audience/subscribers", {
            params: { listId, query: "", page, size: 100 }, signal,
        });
        if (!Array.isArray(data?.content) || !Number.isInteger(data.totalPages) || data.totalPages < 0) {
            throw new Error("Invalid audience pagination response");
        }
        totalPages = data.totalPages;
        if (data.content.length === 0 && page < totalPages - 1) {
            throw new Error("Audience could not be loaded completely. Please try again.");
        }
        subscribers.push(...data.content);
        page += 1;
    } while (page < totalPages);
    return subscribers;
};

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


export const updateSubscriber = async (data: UpdateSubscriber) => {
    const res = await axiosInstance.put("/audience/subscriber", data); 
    return res.data; 
}

export const getSingleSubscriber = async (subscriberId : string ) => {
    const res = await axiosInstance.get(`/audience/subscriber/${subscriberId}`);
    return res.data; 
}

export const deleteSubscriber = async (subscriberId: string, audienceId: string) => {
    await axiosInstance.delete('/audience/subscriber', {
        params: {
            subscriberId, 
            audienceId
        }
    });
}
