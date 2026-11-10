import { Alert, Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useState } from "react";
import type { AutomationDraft } from "../utils/automationDraft";
import { previewDocument } from "../utils/emailPreview";
type Props = {
    draft: AutomationDraft;
    onEditTrigger: () => void;
    onEditMessage: (index: number) => void;
};
const conditionLabels: Record<string, string> = { ALWAYS: "Always send", PREVIOUS_FAILED: "If previous message failed", PREVIOUS_DELIVERED: "If previous message was delivered", PREVIOUS_NOT_DELIVERED: "If previous message was not delivered" };
export function AutomationReview({ draft, onEditTrigger, onEditMessage }: Props) {
    const [previewIndex, setPreviewIndex] = useState(0);
    const preview = draft.steps[previewIndex];
    return <Stack spacing={3}>
    <div><Typography variant="h6">Review your automation</Typography><Typography variant="body2" color="text.secondary">Check the trigger and every message before activating.</Typography></div>
    <Card variant="outlined" sx={{ bgcolor: "#f8fafc" }}><CardContent><Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}><Typography sx={{ fontWeight: 650 }}>{draft.name}</Typography><Button size="small" onClick={onEditTrigger}>Edit trigger</Button></Stack><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{draft.trigger === "event" ? `When ${draft.eventName} occurs` : draft.trigger === "now" ? "Run once after activation" : `Starts ${new Date(draft.nextRunAt).toLocaleString()}${draft.repeatMinutes > 0 ? `; repeats every ${draft.repeatMinutes} minutes` : "; runs once"}`}</Typography></CardContent></Card>
    <Stack spacing={1.5}>{draft.steps.map((step, i) => <Card variant="outlined" key={i}><CardContent><Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 1 }}><Stack direction="row" spacing={1} sx={{ alignItems: "center" }}><Chip size="small" label={i + 1} color="primary" variant="outlined"/><Typography sx={{ fontSize: 14, fontWeight: 600 }}>{step.channel === "EMAIL" ? step.subject : "SMS message"}</Typography></Stack><Button size="small" onClick={() => onEditMessage(i)}>Edit</Button></Stack><Typography variant="body2" sx={{ mt: 1, overflowWrap: "anywhere" }}>To: {step.recipient}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>From: {step.sender || "Default sender"} / Wait {step.delaySeconds} seconds / {i === 0 ? "After trigger" : conditionLabels[step.condition]} / {step.transactional ? "Transactional" : "Marketing"}</Typography><Button size="small" sx={{ mt: 1 }} onClick={() => setPreviewIndex(i)} aria-pressed={previewIndex === i}>Preview message</Button></CardContent></Card>)}</Stack>
    <Box><Typography variant="subtitle2" sx={{ mb: 1 }}>Message {previewIndex + 1} preview</Typography>{preview.channel === "EMAIL" ? <iframe title={`Message ${previewIndex + 1} email preview`} sandbox="" referrerPolicy="no-referrer" srcDoc={previewDocument(preview.body)} style={{ width: "100%", height: 260, border: "1px solid #e2e8f0", borderRadius: 10, background: "white" }}/> : <Card variant="outlined" sx={{ bgcolor: "#edf4ff" }}><CardContent><Typography variant="body2" sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{preview.body}</Typography></CardContent></Card>}</Box>
    <Alert severity="info">{draft.trigger === "event" ? "This automation waits for a matching event. Supply all message variables in that event's data." : "Activation enables the schedule. Messages queue at the start time plus each step's delay."} Pausing stops future runs; messages already queued are managed in Message activity.</Alert>
  </Stack>;
}
