import { axiosInstance } from "../../../api/axios";
import type{ WalletTopUpRequest } from "../../../types/wallet/walletType";

export const topUpWallet = async (data: WalletTopUpRequest) => {
    const response = await axiosInstance.post("/payments/initialize",data);
    return response.data
}