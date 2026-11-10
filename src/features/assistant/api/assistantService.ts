import { axiosInstance } from "../../../api/axios";
import type { ChatSession, ChatMessage } from "../types/assistant";
export const getAssistantStatus = async () => (await axiosInstance.get<{ configured: boolean }>("/assistant/status")).data;
export const getChatSessions = async () => (await axiosInstance.get<ChatSession[]>("/assistant/sessions")).data;
export const createChatSession = async () => (await axiosInstance.post<ChatSession>("/assistant/sessions")).data;
export const getChatMessages = async (id: string) => (await axiosInstance.get<ChatMessage[]>(`/assistant/sessions/${id}`)).data;
export const sendChatMessage = async (id: string, requestId: string, message: string) => (await axiosInstance.post<ChatMessage>(`/assistant/sessions/${id}/messages`, { requestId, message }, { timeout: 110000 })).data;
export const deleteChatSession = async (id: string) => { await axiosInstance.delete(`/assistant/sessions/${id}`); };
