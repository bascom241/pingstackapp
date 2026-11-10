export type AutomationStep = {
  channel: "EMAIL" | "SMS";
  recipient: string;
  sender: string;
  subject: string;
  body: string;
  designJson?: string;
  delaySeconds: number;
  transactional: boolean;
  condition: string;
};

export type Automation = {
  id: string;
  name: string;
  enabled: boolean;
  lastError?: string;
  lastRunAt?: string;
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
  steps: Array<Omit<AutomationStep, "sender"> & {
    sender?: string;
  }>;
};
