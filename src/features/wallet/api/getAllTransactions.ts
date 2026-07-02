import { axiosInstance } from "../../../api/axios";

// Destructure the parameters directly into the function
export const getTransactions = async (page: number, size: number) => {
  const response = await axiosInstance.get(`/orders`, {
    params: {
      page,
      size,
    },
  });
  return response.data;
};