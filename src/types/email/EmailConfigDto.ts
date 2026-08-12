export interface EmailConfigResponse {
  apiKeyHash: string;
  apiKeyPrefix: string;
  customDomain: string;
  trackOpens: boolean;
  trackClicks: boolean;
  bounceAlerts: boolean;
  emailsSentThisMonth: number;
  monthlyLimit: number;
}

export interface ApiKeyGeneratedResponse {
  rawApiKey: string;
  apiKeyPrefix: string;
  message: string;
}


export interface UpdatePreferenceDto {
  trackOpens:boolean;
  trackClicks:boolean;
  bounceAlerts:boolean;
}


export interface UpdateDomainRequest {
    customDomain: string
}


export interface DnsRecordDetails {
  recordName: string;
  type: string;
  value: string;
  host_name: string;
  status: boolean;
}

export interface DomainDnsRecords {
  dkim1Record: DnsRecordDetails;
  dkim2Record: DnsRecordDetails;
  dmarc_record: DnsRecordDetails;
  brevo_code: DnsRecordDetails;
}



export interface BrevoDomainDto {
    id: string
    domain_name: string
    domain_provider: string
    message: string
    dns_records: DomainDnsRecords[]
    authenticated: boolean;
    verified: boolean;
    primary: boolean
}


