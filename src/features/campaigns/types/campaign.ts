export interface EmailRecipientRequest {
  email: string;
  name: string;
}


export interface AddRecipientRequest {
  campaignId: string, 
  recipient: EmailRecipientRequest[]
}

export interface CreateCampaignRequest {
  htmlContent?: string;
  designJson?: string;
  name: string;
  templateId?: string;
  subject: string;
  recipientRequests?: EmailRecipientRequest[];
}

export interface CreateCampaignResponse {
  id?: string;
  campaignId?: string;
  status?: string;
  message?: string;
}

export interface CampaignSummary {
  campaignId: string;
  name: string;
  subject: string;
  templateId: string;
  templateVersionId: string;
  totalRecipients: number;
  processedRecipients: number;
  failedRecipients: number;
  status: string;
  createdAt: string;
  startedAt: string | null;
}

export interface CampaignPageResponse {
  content: CampaignSummary[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}