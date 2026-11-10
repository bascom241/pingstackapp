import { expect, test } from "@playwright/test";
const sessionId = "11111111-1111-1111-1111-111111111111";
const proposal = { name: "Customer welcome", trigger: "event", eventName: "user.created", nextRunAt: "", repeatMinutes: 0, steps: [{ channel: "EMAIL", recipient: "{{email}}", sender: "", subject: "Welcome {{name}}", body: "<p>Welcome {{name}}</p>", delaySeconds: 0, transactional: false, condition: "ALWAYS" }] };
test.beforeEach(async ({ page }) => {
  const claims = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, roles: ["ROLE_USER"] })).toString("base64url");
  await page.addInitScript(token => { localStorage.setItem("accessToken", token); localStorage.setItem("refreshToken", "browser-test"); }, `e30.${claims}.test`);
  let storedMessages: Record<string, unknown>[] = [];
  let created = false;
  const session = { id: sessionId, title: "Welcome journey", updatedAt: new Date().toISOString() };
  await page.route("**/api/v1/**", async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith("/assistant/status")) return route.fulfill({ json: { configured: true } });
    if (path.endsWith("/assistant/sessions")) { if (route.request().method() === "POST") { created = true; return route.fulfill({ json: session }); } return route.fulfill({ json: created ? [session] : [] }); }
    if (path.endsWith(`/assistant/sessions/${sessionId}`)) return route.fulfill({ json: storedMessages });
    if (path.endsWith("/messages") && route.request().method() === "POST") {
      const request = route.request().postDataJSON();
      const reply = { id: "reply-1", requestId: request.requestId, role: "assistant", content: "Here is a welcome journey to review. Nothing has been activated.", createdAt: new Date().toISOString(), draft: proposal };
      storedMessages = [{ id: request.requestId, requestId: request.requestId, role: "user", content: request.message, createdAt: new Date().toISOString() }, reply];
      return route.fulfill({ json: reply });
    }
    return route.fulfill({ json: path.endsWith("/automations") ? [] : { balance: 100 } });
  });
});
test("side chat opens, drafts a workflow and hands it to the builder without activation", async ({ page }) => {
  let activations = 0;
  page.on("request", request => { if (request.method() === "POST" && new URL(request.url()).pathname.endsWith("/automations")) activations++; });
  await page.goto("/dashboard/automations");
  await page.getByRole("button", { name: "Open Pingstack Assistant" }).click();
  await expect(page.getByRole("heading", { name: "A clearer path from idea to automation." })).toBeVisible();
  await page.screenshot({ animations: "disabled", path: "test-results/assistant-desktop.png" });
  await page.getByRole("textbox", { name: "Message Pingstack Assistant" }).fill("Create a welcome workflow for new customers");
  await page.getByRole("button", { name: "Send message to assistant" }).click();
  await expect(page.getByText("Here is a welcome journey to review.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Close assistant" }).click();
  await page.getByRole("button", { name: "Open Pingstack Assistant" }).click();
  await expect(page.getByText("Here is a welcome journey to review.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Review in automation builder" }).click();
  await page.getByRole("button", { name: "Open draft", exact: true }).click();
  await expect(page.getByRole("textbox", { name: /Automation name/ })).toHaveValue("Customer welcome");
  expect(activations).toBe(0);
});
test("mobile chat fits the screen and setup state cannot send a request", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/api/v1/assistant/status", route => route.fulfill({ json: { configured: false } }));
  await page.goto("/dashboard/automations");
  await page.getByRole("button", { name: "Open Pingstack Assistant" }).click();
  await expect(page.getByText("Your workspace assistant is not connected yet.", { exact: false })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Message Pingstack Assistant" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Send message to assistant" })).toBeDisabled();
  const panel = page.locator(".assistant-panel");
  await expect.poll(async () => Math.abs((await panel.boundingBox())!.x)).toBeLessThanOrEqual(1);
  const bounds = await panel.boundingBox();
  expect(bounds!.width).toBeLessThanOrEqual(390);
  await page.screenshot({ animations: "disabled", path: "test-results/assistant-mobile.png" });
});
