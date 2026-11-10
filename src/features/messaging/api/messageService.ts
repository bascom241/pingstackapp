import { axiosInstance } from "../../../api/axios";
import type { MessageJob, DispatchRequest } from "../types/message";

export const sendMessages = async (request: DispatchRequest, key: string) =>
  (await axiosInstance.post<MessageJob[]>("/messages", request, { headers: { "Idempotency-Key": key } })).data;
export const getMessages = async (page = 0, search = "", status = "") =>
  (await axiosInstance.get<{ content: MessageJob[]; totalPages: number }>("/messages", { params: { page, size: 20, search, status } })).data;
export const messageAction = async (id: string, action: "pause" | "resume" | "cancel" | "retry") =>
  (await axiosInstance.post<MessageJob>(`/messages/${id}/${action}`)).data;
