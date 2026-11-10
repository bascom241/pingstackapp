# Pingstack feature and API integration review

Reviewed: November 10, 2026

## Scope and conclusion

This review covers the frontend in this `client` workspace. **API connected** means the UI calls an endpoint; backend behavior, payment settlement, and actual message delivery were not verified.

The app has a substantial dashboard and several API integrations, but **the core SMS sending flow is still simulated**. Email configuration and campaign management are further along than SMS.

The production build passes (`npm.cmd run build`), with a warning about a large JavaScript bundle.

## Feature inventory

| Area | Features present | Current status |
| --- | --- | --- |
| Authentication | Registration, login, forgot/reset password, protected routes, logout | API connected through `/auth/*`. Token refresh code exists but has defects described below. |
| Dashboard | Wallet balance, transaction chart, transaction history, quick actions, developer links | Financial data is API connected. The chart shows wallet transactions, not SMS delivery or API usage. |
| SMS composer | Approved sender selection, manual recipients, audience selection, CSV import, message preview, character/segment counter | Supporting data comes from APIs. Sending does not call an API. |
| Quick email composer | Sender email, subject, saved templates, HTML preview, manual recipients | Configuration and templates come from APIs. Sending is simulated. |
| Contacts | Create audiences, list subscribers, search, pagination, individual add/edit/delete, CSV upload | API connected through `/audience/*`. Some controls and implementation details need finishing. |
| SMS sender IDs | Request sender IDs, view approval status, paginate, select approved IDs | API connected through `/senderId` and `/senderId/approved`. Approval administration is outside this frontend. |
| Email domains | Register/list domains, DNS details, verify, make primary, delete | API connected through `/email-config/*`. |
| Email configuration | View configuration, generate email API credentials, update tracking preferences | API connected. These credentials are specifically for email. |
| Email templates | Create/list/view templates, visual editor, save updated subject/design/HTML, version information | API connected through `/email-template`. No separate version-history retrieval or rollback API is present. |
| Email campaigns | Campaign listing, details, creation wizard, template selection, recipients, processing/failure counts | API connected through `/campaign`. Actual dispatch behavior depends on the backend. |
| SMS/WhatsApp campaigns | Channel choices appear in campaign selection | Disabled; only email campaigns are available. |
| Wallet | Balance, payment initialization, redirect to Paystack | API connected. Complete payment confirmation cannot be established from this frontend. |
| KYC | Business details, document selection, file validation, application review | Local state only; no upload/submission integration. |
| Developer sandbox | Example request body, JSON validation, copyable cURL | Local only; does not execute requests. |
| OTP guide | cURL/Node/Python examples, simulated send and verification | Local simulation using demo code `123456`. |
| Webhooks | Endpoint draft, event selection, sample payloads | Browser storage only; no registration or delivery. |
| Settings | Profile draft, interface preferences, workspace links, email tracking settings, password reset, logout | Mixed: profile/interface preferences are browser-only; tracking and password reset use APIs. |

## Dummy data and incomplete connections

### SMS and quick email sending

Source: `src/pages/messages/Sms.tsx`, `handleLaunchCampaign`.

The send action uses a 2.8-second timeout and updates the preview. It never submits the message, charges the wallet, or records delivery. Sender IDs, contacts, domains, and templates are fetched from APIs, so this is a partially connected screen with a simulated final action.

### Campaign recipient imports

Source: `src/pages/marketing/CampaignDetailPage.tsx`.

Individual recipient submission calls the API, but CSV imports are staged locally. Some page text incorrectly describes all recipient changes as local. Campaign creation itself submits its collected recipients through the creation API.

### Webhooks

Source: `src/pages/webhook/Webhook.tsx`.

Endpoint settings persist in `localStorage`. Payloads are examples, signing secrets are unavailable, and delivery activity is unconnected. Saving a draft does not register an endpoint.

### OTP

Source: `src/pages/contacts/Otp-Guide.tsx`.

There are no real send or verify API calls. Examples use `api.example.com`; the local simulation accepts demo code `123456`.

### KYC

Source: `src/pages/kyc/KycUpload.tsx`.

Documents remain in memory until refresh/navigation. There is no server submission or submitted, pending, approved, or rejected workflow.

### Wallet extras

Source: `src/pages/dashboard/Wallet.tsx` and `src/components/dashboard/main/TopUpModal.tsx`.

Low Balance Settings, Dedicated Account, and adding a card for auto recharge have no working action handlers. The wallet owner's name is hardcoded. Payment initialization and the redirect to Paystack are connected; settlement must be verified in the backend.

### Developer access

Source: `src/pages/settings/ApiKey.tsx`.

Email key generation is connected. General SMS key management, live request execution, and request logs are absent. The request builder validates JSON syntax only.

### Account settings

Source: `src/pages/settings/Settings.tsx`.

Profile changes save browser drafts. Interface preferences are browser-local. Team invitations, roles, MFA, remote session revocation, account deletion, and account-wide notification preferences are unavailable.

### Contacts filtering

Source: `src/pages/contacts/ContactList.tsx`.

The Filter button has no implemented action.

## Existing issues to fix first

1. **Token refresh is attached to the wrong Axios client.** In `src/api/axios.ts`, the response interceptor attaches to global `axios`, while feature requests use `axiosInstance`. The public-route check also calls `.includes()` on the request configuration object and returns no boolean. Refresh handling needs correction.
2. **Use audience only includes the first 20 contacts.** The SMS composer fetches page zero with size 20, then copies those numbers into the recipients field. Larger audiences would be incomplete.
3. **Subscriber deletion can use the previous subscriber ID.** The contact delete handler sets React state and immediately invokes a mutation that closes over the existing state. Pass the selected ID directly into the mutation.
4. **SMS segment calculation is incomplete.** The composer assumes 160/153-character limits for every message. Unicode typically requires 70/67 limits; GSM extension characters also affect length. Accurate counting is needed for pricing. [SMS encoding reference](https://www.twilio.com/docs/glossary/what-sms-character-limit).
5. **API addresses are inconsistent.** Runtime calls use `VITE_API_URL`, the dashboard displays a hardcoded Pingstack host, and developer examples use an example host.

## Recommended completion roadmap

These are recommended priorities. Backend capabilities may already exist outside this workspace and should be checked before implementation.

| Priority | Work needed | Outcome |
| --- | --- | --- |
| P0: launch essential | Real single and bulk SMS submission, provider integration, durable queue, throttling, safe retries, duplicate-send prevention | Reliable sending |
| P0 | Message history, recipient-level status, provider error reasons, delivery receipt processing | Users can establish whether messages arrived |
| P0 | International number normalization, invalid-number reporting, deduplication, full-audience selection | Prevents incomplete or wasteful sends |
| P0 | Encoding-aware segment count, price quote, balance check, atomic wallet debit/reservation and reconciliation | Predictable and correct billing |
| P0 | Consent records, suppression lists, opt-out processing, sending restrictions appropriate to each destination | Controls who can receive campaigns |
| P0 | KYC submission/status and backend enforcement of sender approval and tenant permissions | Complete business onboarding |
| P0 | Payment confirmation, pending/failed payment states, ledger reconciliation, receipts | Complete funding workflow |
| P1: complete SME workflow | SMS campaigns, saved drafts, scheduling/timezones, cancellation, duplication, SMS templates and personalization | Repeatable marketing and customer updates |
| P1 | Delivery/cost reports, date filters, CSV exports, low-balance alerts | Practical day-to-day management |
| P1 | SMS API keys with scopes/revocation, accurate API docs, request logs, signed webhooks with retries and delivery history | Usable developer integration |
| P1 | Contact tags, custom fields, segmentation, import previews and import error reports | Better audience management |
| P1 | Team members, roles, audit logs, server-backed profiles, MFA | Shared business accounts |
| P2: expansion | Real OTP service with expiry/attempt limits, reminders and automation, CRM integrations, two-way SMS where supported | Broader SME use cases |

Provider status callbacks are a standard way to track delivery transitions. [Delivery status reference](https://www.twilio.com/docs/messaging/guides/outbound-message-status-in-status-callbacks).

## Suggested implementation sequence

Finish one complete journey first:

**Register → verify business → approve sender → fund wallet → import contacts → quote cost → send SMS → track delivery → reconcile charges.**

The existing frontend covers much of the surrounding interface, but this end-to-end SMS journey remains the main launch blocker.
