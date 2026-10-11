export interface EmailTemplateSummary {
   templateId: string;
   name: string;
   slug: string;
   category: "TRANSACTIONAL" | "MARKETING" | "LIFECYCLE";
   description: string;
   status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
   currentVersion: number;
   createdAt: string;
   updatedAt: string;
   createdBy: string;
}

export interface EmailTemplateResponse {
   createdAt: string;
   designJson: string;
   htmlContent: string;
   subject: string;
   templateId: string;
   templateVersionId: string;
   version: number;
   name?: string;
   status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
   description?: string;
}