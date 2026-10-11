export interface EmailRecipientRequest {
  email: string;
  name: string;
}

export interface CreateCampaignRequest {
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