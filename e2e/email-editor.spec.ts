import { expect, test } from "@playwright/test";

const templateId = "11111111-1111-1111-1111-111111111111";
const savedTemplate = { templateId, templateVersionId: "version-1", version: 1, name: "Welcome email", subject: "Welcome", htmlContent: "<h1>Original welcome</h1>", designJson: JSON.stringify({ body: { rows: [] } }) };
test.beforeEach(async ({ page }) => {
  const claims = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, roles: ["ROLE_USER"] })).toString("base64url");
  await page.addInitScript(token => { localStorage.setItem("accessToken", token); localStorage.setItem("refreshToken", "browser-test-refresh"); }, `e30.${claims}.test`);
  await page.route("**/api/v1/**", async route => {
    const path = new URL(route.request().url()).pathname;
    const data = path.endsWith("/automations") || path.endsWith("/email-template") ? [] : path.includes("/email-template/") ? savedTemplate : { balance: 100, currency: "NGN" };
    await route.fulfill({ json: data });
  });
});

test("automation editor exports HTML and editable design before activation", async ({ page }) => {
  let created: Record<string, unknown> | undefined;
  await page.route("**/api/v1/automations", async route => {
    if (route.request().method() === "POST") { created = route.request().postDataJSON(); await route.fulfill({ json: { id: "automation-1", ...created } }); }
    else await route.fulfill({ json: [] });
  });
  await page.goto("/dashboard/automations");
  await page.getByRole("button", { name: "New automation", exact: true }).click();
  await page.getByLabel("Automation name").fill("Welcome journey");
  await page.getByLabel("Event name").fill("user.created");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Recipients", { exact: true }).fill("{{email}}");
  await page.getByLabel("Subject", { exact: true }).fill("Welcome {{name}}");
  await page.getByRole("button", { name: "Design email", exact: true }).click();
  await page.locator(".tiptap").fill("Hello {{name}}, welcome to Pingstack!");
  await page.getByRole("button", { name: "Preview", exact: true }).click();
  await expect(page.getByTitle("Email delivery preview")).toBeVisible();
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByRole("button", { name: "Apply email", exact: true }).click();
  await page.getByRole("button", { name: "Review automation", exact: true }).click();
  await page.getByRole("button", { name: "Activate automation", exact: true }).click();
  await expect(page.getByText("Automation activated.", { exact: false })).toBeVisible();
  const step = (created!.steps as { body: string; designJson: string }[])[0];
  expect(step.body).toContain("Hello {{name}}, welcome to Pingstack!");
  expect(JSON.parse(step.designJson).editor).toBe("react-email");
  expect(JSON.parse(step.designJson).document.type).toBe("doc");
});

test("legacy template stays unchanged on cancel and new designs reopen after saving", async ({ page }) => {
  let current = { ...savedTemplate };
  await page.route(`**/api/v1/email-template/${templateId}`, async route => {
    if (route.request().method() === "PUT") current = { ...current, ...route.request().postDataJSON() };
    await route.fulfill({ json: current });
  });
  await page.goto(`/dashboard/email-templates/${templateId}/edit`);
  await page.getByRole("button", { name: "Edit email", exact: true }).click();
  await expect(page.getByText("This email is being imported from HTML.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  expect(current.htmlContent).toBe(savedTemplate.htmlContent);
  await page.getByRole("button", { name: "Edit email", exact: true }).click();
  await page.locator(".tiptap").fill("A redesigned welcome email");
  await page.getByRole("button", { name: "Apply email", exact: true }).click();
  await page.getByRole("button", { name: "Save template", exact: true }).click();
  await expect(page.getByText("Template saved.", { exact: true })).toBeVisible();
  expect(current.htmlContent).toContain("A redesigned welcome email");
  expect(JSON.parse(current.designJson).editor).toBe("react-email");
  await page.reload();
  await page.getByRole("button", { name: "Edit email", exact: true }).click();
  await expect(page.locator(".tiptap")).toContainText("A redesigned welcome email");
  await expect(page.getByText("This email is being imported from HTML.", { exact: false })).toHaveCount(0);
});

test("campaign changes use the shared editor and retain their own design copy", async ({ page }) => {
  await page.addInitScript(id => localStorage.setItem("pingstack-create-campaign", JSON.stringify({ state: { selectedCampaignType: "email", currentStep: 2, formData: { name: "Spring campaign", templateId: id, subject: "Welcome", recipientRequests: [] } }, version: 0 })), templateId);
  await page.goto("/dashboard/campaigns/create");
  await page.getByRole("button", { name: "Edit email", exact: true }).click();
  await page.locator(".tiptap").fill("Only this campaign uses this message");
  await page.getByRole("button", { name: "Apply email", exact: true }).click();
  await page.getByRole("button", { name: "Continue to recipients", exact: true }).click();
  const draft = await page.evaluate(() => JSON.parse(localStorage.getItem("pingstack-create-campaign")!).state.formData);
  expect(draft.htmlContent).toContain("Only this campaign uses this message");
  expect(JSON.parse(draft.designJson).editor).toBe("react-email");
  expect(savedTemplate.htmlContent).toBe("<h1>Original welcome</h1>");
});
