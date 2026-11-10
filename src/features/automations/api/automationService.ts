import { axiosInstance } from "../../../api/axios";
import type { Automation, CreateAutomationRequest } from "../types/automation";

export const getAutomations = async (): Promise<Automation[]> =>
  (await axiosInstance.get<Automation[]>("/automations")).data;

export const createAutomation = async (request: CreateAutomationRequest): Promise<Automation> =>
  (await axiosInstance.post<Automation>("/automations", request)).data;

export const setAutomationEnabled = async (id: string, enabled: boolean): Promise<Automation> =>
  (await axiosInstance.post<Automation>(`/automations/${id}/${enabled ? "resume" : "pause"}`)).data;
