import { axiosInstance } from "../../../api/axios";


export const getOrderChart = async () => {
    const response = await axiosInstance.get("/orders/charts");
    return response.data; 
}