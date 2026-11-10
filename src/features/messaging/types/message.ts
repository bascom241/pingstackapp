export type MessageJob = {
  id: string; channel: "SMS" | "EMAIL"; provider: string; recipient: string;
  subject?: string; status: string; attempts: number; maxAttempts: number;
  scheduledAt: string; createdAt: string; lastError?: string; providerMessageId?: string;
};
export type DispatchRequest = {
  channel: "SMS" | "EMAIL"; provider?: "BREVO" | "GMAIL"; recipients: string[];
  recipientName?: string; sender?: string; subject?: string; body: string;
  transactional: boolean; scheduledAt?: string;
};
