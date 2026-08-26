import { axiosInstance } from "../../../api/axios";


export const getAllSenderIds = async (page:number, size:number) => {
    const response = await axiosInstance.get("/senderId", {
        params: {
            page,
            size
        }
    });
    return response.data;
}

export const getApprovedSenderIds = async (page: number, size: number) => {
    const response = await axiosInstance.get("/senderId/approved", {
        params: {
            page, 
            size
        }
    });

    return response.data;
}