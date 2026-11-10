import type { EmailEditorRef } from "@react-email/editor";
export type EmailDocument = ReturnType<EmailEditorRef["getJSON"]>;
export type EmailDesignValue = { html: string; designJson?: string };
export const EMPTY_EMAIL_DOCUMENT: EmailDocument = { type: "doc", content: [{ type: "paragraph" }] };
export function readEmailDesign(value?: string): EmailDocument | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (parsed?.editor !== "react-email" || parsed.version !== 1 || parsed.document?.type !== "doc" || !Array.isArray(parsed.document.content)) return null;
    return parsed.document as EmailDocument;
  } catch { return null; }
}
export function serializeEmailDesign(document: EmailDocument): string {
  return JSON.stringify({ editor: "react-email", version: 1, document });
}
export function hasEmailContent(html: string): boolean {
  const content = html.replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, "").replace(/<(style|script)\b[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  return /<(img|hr)\b/i.test(content) || Boolean(content.replace(/<[^>]*>/g, "").replace(/&nbsp;|&#160;|\s/gi, ""));
}
export function emailPreviewHtml(html: string): string {
  return `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: https:; style-src 'unsafe-inline'; font-src data:; base-uri 'none'; form-action 'none'"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${html}</body></html>`;
}
