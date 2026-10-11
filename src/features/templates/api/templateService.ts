import { axiosInstance } from "../../../api/axios";
import type {
    EmailTemplateResponse,
    EmailTemplateSummary,
} from "../../../types/templates/EmailTemplateResponse";

export interface CreateEmailTemplateRequest {
    name: string;
    slug: string;
    category: "TRANSACTIONAL" | "MARKETING" | "LIFECYCLE";
    description: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    version: {
        subject: string;
        htmlContent: string;
        designJson: string;
    };
}

export interface EmailTemplateVersionRequest {
    designJson: string;
    subject: string;
    htmlContent: string;
}

export const getTemplates = async (): Promise<EmailTemplateSummary[]> => {
    const res = await axiosInstance.get("/email-template");
    return res.data;
};

export const getSingleTemplate = async (id: string): Promise<EmailTemplateResponse> => {
    const response = await axiosInstance.get(`/email-template/${id}`);
    return response.data;
};

export const createTemplate = async (
    data: CreateEmailTemplateRequest
) => {
    const res = await axiosInstance.post("/email-template", data);
    return res.data;
};

export const updateTemplate = async (
    templateId: string,
    data: EmailTemplateVersionRequest
) => {
    const res = await axiosInstance.put(
        `/email-template/${templateId}`,
        data
    );

    return res.data;
};