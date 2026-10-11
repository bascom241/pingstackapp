# Pingstack — Email Campaign Creation UI

## Objective

Build a **highly engaging, production-quality email campaign creation experience** for Pingstack, following the existing user flow and the application's established design system.

The goal is not to copy an existing design or introduce an entirely new visual language. Instead, study the existing Pingstack UI, understand its design patterns, and use them to create a distinctive, intuitive, and visually polished campaign-creation experience that feels native to the product.

**Think like a senior product designer and frontend engineer, not an AI UI generator.**

## 1. Understand the Existing Product Before Building

Before writing code:

- Explore the existing Pingstack codebase and identify the current design system, including colors, typography, spacing, borders, shadows, radii, icons, buttons, inputs, cards, modals, and other reusable UI patterns.
- Examine the existing marketing folder and understand how its pages and components are structured.
- Follow the current campaign-creation flow and preserve the application's existing navigation patterns.
- Reuse established components, utilities, hooks, and conventions wherever appropriate.
- Respect the existing architecture and avoid unnecessary dependencies or unrelated refactoring.

Do not blindly copy another screen's layout. **Reuse the design language, not necessarily the composition.**

## 2. Design Direction: No AI Slop

Create an interface that feels intentionally designed for a serious messaging and marketing platform.

Avoid:
- Generic AI dashboard layouts that look interchangeable with every SaaS product.
- Excessive gradients, glowing effects, decorative blobs, and unnecessary glassmorphism.
- Randomly rounded cards, excessive whitespace, and oversized headings that waste valuable screen space.
- Too many cards nested inside other cards.
- Unnecessary icons, badges, illustrations, and decorative elements that add no functional value.
- Repeating the same layout for every section when a better composition would improve usability.
- Fake analytics, invented metrics, placeholder features, and interactions that do not work.

Instead, prioritize:
- Strong visual hierarchy and purposeful typography.
- Clean alignment, balanced spacing, and deliberate use of the existing brand colors.
- Clear section boundaries without boxing every element into a card.
- Subtle visual feedback, thoughtful hover and focus states, and meaningful transitions where appropriate.
- Compact but comfortable layouts that make complex tasks feel simple.
- Useful empty states, validation feedback, loading states, and error handling.
- A distinctive, polished interface that feels like a carefully crafted part of Pingstack.

Every visual element must have a purpose.

## 3. Build the Email Campaign Creation Experience

Implement the campaign-creation page inside the existing **marketing folder**, following the current project structure and conventions.

Design the experience around a clear, guided workflow. Organize the interface into logical, reusable sections so users always understand what they are configuring, what remains incomplete, and what to do next.

The experience should cover the following areas:

### A. Campaign Details

Allow users to define the basic identity of their campaign.

- Campaign name.
- Email subject line.
- Clear field labels and helpful contextual guidance.
- Inline validation and appropriate character or completion indicators where useful.

Make this section straightforward without making it visually boring.

### B. Email Template Selection

Allow users to select an existing email template using the template data and selection flow already supported by the application.

- Present templates in an intuitive, visually appealing selection interface.
- Make the selected template immediately recognizable.
- Provide a clear way to change the selection.
- Include loading, empty, and error states where applicable.
- Reuse existing template-fetching hooks and API integrations rather than introducing duplicate data-fetching logic.

Do not invent template properties or backend capabilities that do not exist.

### C. Recipient Management

Create a practical recipient-selection experience that supports the recipient structure currently accepted by the backend.

Each recipient contains:
- Email address.
- Recipient name.

Make it easy to add, review, edit, and remove recipients. Clearly communicate validation errors, duplicate addresses, invalid email formats, and missing required information.

If the existing application already supports audience lists, contacts, or CSV imports, integrate with those capabilities where appropriate. Otherwise, keep the experience compatible with the current API contract and do not fabricate backend functionality.

Make the recipient section efficient for both small recipient lists and larger lists.

### D. Campaign Review

Provide a clear review step before submission.

Summarize the campaign name, subject, selected template, and recipient count. Where appropriate, allow users to return to the relevant section and make changes without losing previously entered information.

Use a clear primary action and a sensible back or edit flow. Do not imply that emails have been sent if the backend only creates a campaign.

### E. Submission and Feedback

Connect the UI to the existing campaign-creation API and follow the project's established request-handling patterns.

- Prevent duplicate submissions while a request is pending.
- Validate required fields before sending the request.
- Display useful success and error feedback.
- Preserve entered information when a recoverable request fails.
- Navigate to the appropriate existing destination after successful creation, following the application's current flow.

Do not hardcode successful responses or use fake data to simulate a working integration.

## 4. Backend Contract — Follow This Exactly

The current backend request structure is:

```java
public class CreateEmailCampaignRequest {
    private String name;
    private String templateId;
    private String subject;
    private List<EmailRecipientRequest> recipientRequests;
}
```

Each recipient has the following structure:

```java
public class EmailRecipientRequest {
    private String email;
    private String name;
}
```

The frontend must submit a payload compatible with this contract:

```json
{
  "name": "October Product Update",
  "templateId": "existing-template-id",
  "subject": "What's new at Pingstack?",
  "recipientRequests": [
    {
      "email": "customer@example.com",
      "name": "Jane Doe"
    }
  ]
}
```

The example values are illustrative only. Use actual values collected from the interface.

Important implementation requirements:

- Map form state to the exact backend field names.
- Use `templateId` for the selected template's actual identifier.
- Submit recipients through `recipientRequests`.
- Represent each recipient with `email` and `name`.
- Inspect the existing API service, request types, mutation hooks, and error-handling utilities before integrating.
- Do not rename backend fields or invent additional request properties.
- Do not assume the backend supports scheduling, attachments, sender configuration, A/B testing, or delivery analytics unless these features already exist.

## 5. Component Architecture

Build the page using **small, focused, reusable, and well-named components** rather than one enormous component.

Use the existing project conventions, but consider a structure along these lines:

```text
marketing/
└── campaigns/
    └── create/
        ├── index.tsx
        ├── components/
        │   ├── CampaignHeader.tsx
        │   ├── CampaignProgress.tsx
        │   ├── CampaignDetailsSection.tsx
        │   ├── TemplateSelectionSection.tsx
        │   ├── RecipientManagementSection.tsx
        │   ├── CampaignReviewSection.tsx
        │   └── CampaignFormActions.tsx
        ├── hooks/
        ├── types/
        └── utils/
```

This is a suggested organization, not a requirement to create every file. Adapt it to the actual repository structure and naming conventions.

Keep responsibilities clear:
- The page orchestrates the overall experience.
- Individual sections handle their own presentation and focused interactions.
- Shared components come from the existing design system where possible.
- Hooks handle reusable state or API logic where appropriate.
- Utility functions handle validation and payload mapping where appropriate.

Avoid both extremes: one monolithic component and excessive fragmentation into components that provide no meaningful reuse.

## 6. Interaction and Responsive Behaviour

The page must be fully usable, not just visually attractive.

Implement:
- Responsive layouts for desktop, tablet, and mobile.
- Accessible labels, keyboard navigation, and visible focus states.
- Clear selected, disabled, loading, success, and error states.
- Predictable form-state management across sections.
- Sensible button hierarchy and clear next-step actions.
- Appropriate empty states and recovery paths.

Prefer the existing project's state-management and form-handling conventions. Do not introduce another library simply because it is popular.

## 7. Implementation Standards

- Use the existing frontend stack and installed dependencies.
- Follow established TypeScript conventions and avoid unnecessary `any` types.
- Keep API concerns separate from presentation where the existing architecture supports it.
- Reuse existing query and mutation hooks where applicable.
- Avoid duplicated business logic and hardcoded design values when shared design tokens already exist.
- Do not break existing campaign pages, routing, or shared components.
- Ensure the final implementation builds cleanly and does not introduce avoidable lint or TypeScript errors.

## 8. Final Quality Bar

Before considering the work complete:

1. Verify that the page fits naturally into Pingstack's existing design system.
2. Verify that every section contributes to the campaign-creation workflow.
3. Test recipient addition, editing, removal, and validation.
4. Verify template selection and form-state preservation.
5. Verify the outgoing payload against the backend contract.
6. Test loading, empty, error, and success states.
7. Check responsive behaviour and accessibility.
8. Verify that the final page feels cohesive, intentional, and production-ready.

**The final result should feel like Pingstack's design system has been thoughtfully extended to solve a real product problem — not like a generic AI-generated dashboard.**

Prioritize usability, visual craft, working functionality, and maintainable component architecture over decorative complexity. Make informed design decisions based on the existing codebase, and implement the complete campaign-creation flow rather than returning only a mockup or a collection of disconnected components.