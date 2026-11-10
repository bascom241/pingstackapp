import { axiosInstance } from "../../../../api/axios";

export const getGmailStatus = async () =>
  (await axiosInstance.get<{ connected: boolean; email?: string }>("/integrations/gmail")).data;
export const connectGmail = async () =>
  (await axiosInstance.post<{ authorizationUrl: string }>("/integrations/gmail/connect")).data;
export const disconnectGmail = async () => axiosInstance.delete("/integrations/gmail");

