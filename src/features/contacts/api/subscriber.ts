import { axiosInstance } from "../../../api/axios";
import type { CreateSubscriber } from "../../../types/contacts/contactTypes";

export const createSubscriber = async (data: CreateSubscriber) => {
    const res = await axiosInstance.post("/audience/subcriber", data);
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

