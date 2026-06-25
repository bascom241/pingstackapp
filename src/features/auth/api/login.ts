import type{ LoginType, RegisterType } from "../../../types/auth/login";
import { axiosInstance } from "../../../api/axios";



export const login = async (data: LoginType) => {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data;
}

export const register = async (data: RegisterType)  => {
    const res = await axiosInstance.post("/auth/register", data);
    return res.data;
}   
