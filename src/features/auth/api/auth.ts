import type{ LoginType, RegisterType, ForgotPassword, ResetPassword} from "../../../types/auth/auth";
import { axiosInstance } from "../../../api/axios";



export const login = async (data: LoginType) => {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data;
}

export const register = async (data: RegisterType)  => {
    const res = await axiosInstance.post("/auth/register", data);
    return res.data;
}   

export const forgotPasword = async(data:ForgotPassword) => {
    const res = await axiosInstance.post("/auth/forgot-password", data); 
    return res.data;
}


export const resetPassword = async (data: ResetPassword) => {
    const res = await axiosInstance.post("/auth/reset-password", data);
    return res.data;
}
