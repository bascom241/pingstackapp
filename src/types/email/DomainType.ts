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

export interface DomainItem {
  id: string;
  domain_name: string;
  domain_provider: string;
  dns_records: DomainDnsRecords;
  authenticated: boolean;
  verified: boolean;
  isPrimary?: boolean;
}

export const INITIAL_DOMAINS: DomainItem[] = [
  {
    id: "6a709bc35f9913573e094bcc",
    domain_name: "usedulink.com",
    domain_provider: "Cloudflare",
    authenticated: true,
    verified: true,
    isPrimary: true,
    dns_records: {
      dkim1Record: {
        recordName: "dkim1Record",
        type: "CNAME",
        value: "b1.usedulink-com.dkim.brevo.com",
        host_name: "brevo1._domainkey",
        status: true,
      },
      dkim2Record: {
        recordName: "dkim2Record",
        type: "CNAME",
        value: "b2.usedulink-com.dkim.brevo.com",
        host_name: "brevo2._domainkey",
        status: true,
      },
      dmarc_record: {
        recordName: "dmarc_record",
        type: "TXT",
        value: "v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com",
        host_name: "_dmarc",
        status: true,
      },
      brevo_code: {
        recordName: "brevo_code",
        type: "TXT",
        value: "brevo-code:fff3ebe343fd52b5222a07b7bd63ed1d",
        host_name: "@",
        status: true,
      },
    },
  },
  {
    id: "7b810cd46a0024684f105cdd",
    domain_name: "pingstack.com",
    domain_provider: "GoDaddy",
    authenticated: false,
    verified: false,
    isPrimary: false,
    dns_records: {
      dkim1Record: {
        recordName: "dkim1Record",
        type: "CNAME",
        value: "b1.pingstack-com.dkim.brevo.com",
        host_name: "brevo1._domainkey",
        status: false,
      },
      dkim2Record: {
        recordName: "dkim2Record",
        type: "CNAME",
        value: "b2.pingstack-com.dkim.brevo.com",
        host_name: "brevo2._domainkey",
        status: false,
      },
      dmarc_record: {
        recordName: "dmarc_record",
        type: "TXT",
        value: "v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com",
        host_name: "_dmarc",
        status: true,
      },
      brevo_code: {
        recordName: "brevo_code",
        type: "TXT",
        value: "brevo-code:99a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4",
        host_name: "@",
        status: false,
      },
    },
  },
];