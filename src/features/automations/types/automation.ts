export type AutomationStep = {
  channel: "EMAIL" | "SMS";
  provider: "BREVO" | "GMAIL";
  recipient: string;
  sender: string;
  subject: string;
  body: string;
  delaySeconds: number;
  transactional: boolean;
  condition: string;
};

export type Automation = {
  id: string;
  name: string;
  enabled: boolean;
  eventName?: string;
  nextRunAt?: string;
  repeatSeconds?: number;
  steps: AutomationStep[];
};

export type CreateAutomationRequest = {
  name: string;
  eventName?: string;
  nextRunAt?: string;
  repeatSeconds?: number;
  steps: Array<Omit<AutomationStep, "sender" | "provider"> & {
    sender?: string;
    provider?: AutomationStep["provider"];
  }>;
};
