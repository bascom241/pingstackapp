import { axiosInstance } from "../../../api/axios";


export const getBalance = async () => {
    const response = await axiosInstance.get("/wallets/balance");
    return response.data
}