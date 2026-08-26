import { axiosInstance } from "../../../api/axios";
import type{ CreateSenderIdRequest } from "../../../types/senderId/senderType";

export const createSenderId = async (data: CreateSenderIdRequest) => {
    const res = await axiosInstance.post("/senderId", data);
    return res.data;
}


