import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, MenuItem, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { AutomationStep } from "../types/automation";
import { EmailTemplatePicker } from "../../templates/components/EmailTemplatePicker";
import { EmailContentEditor } from "../../email-editor/components/EmailContentEditor";
import { Mail, MessageSquare, Layers } from "../../../ui/icons";
type Props = {
    step: AutomationStep;
    index: number;
    eventDriven: boolean;
    onChange: (patch: Partial<AutomationStep>) => void;
};
export function AutomationMessageEditor({ step, index, eventDriven, onChange }: Props) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const [nextChannel, setNextChannel] = useState<AutomationStep["channel"] | null>(null);
    const changeChannel = (channel: AutomationStep["channel"]) => {
        onChange({ channel, recipient: "", body: "", subject: "", sender: "", designJson: undefined });
        setTemplateName("");
        setNextChannel(null);
    };
    return <Stack spacing={3}>
    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}><div><Typography variant="h6">Compose message {index + 1}</Typography><Typography variant="body2" color="text.secondary">Set the channel, audience and content for this step.</Typography></div><Chip size="small" label={step.channel === "EMAIL" ? "Email" : "SMS"}/></Stack>
    <ToggleButtonGroup exclusive size="small" value={step.channel} aria-label="Message channel" onChange={(_, channel: AutomationStep["channel"] | null) => {
        if (!channel || channel === step.channel) return;
        if (step.recipient || step.body || step.subject || step.sender) setNextChannel(channel);
        else changeChannel(channel);
    }}><ToggleButton value="EMAIL"><Mail size={16}/>&nbsp; Email</ToggleButton><ToggleButton value="SMS"><MessageSquare size={16}/>&nbsp; SMS</ToggleButton></ToggleButtonGroup>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
      <TextField fullWidth required multiline minRows={2} label="Recipients" value={step.recipient} onChange={e => onChange({ recipient: e.target.value })} placeholder={eventDriven ? (step.channel === "EMAIL" ? "{{email}}" : "{{phone}}") : step.channel === "EMAIL" ? "customer@example.com" : "+2348012345678"} helperText="Separate recipients with commas or new lines. Use country codes for SMS."/>
      <TextField fullWidth required={step.channel === "SMS"} label={step.channel === "SMS" ? "Approved sender ID" : "Sender email (optional)"} value={step.sender} onChange={e => onChange({ sender: e.target.value })} helperText={step.channel === "SMS" ? "Use an approved sender from Sender IDs." : "Leave blank to use your default sender."}/>
    </Box>
    {step.channel === "EMAIL" && <Card variant="outlined" sx={{ bgcolor: "#f8fafc" }}><CardContent><Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", gap: 2 }}><Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}><Box sx={{ color: "primary.main" }}><Layers size={22}/></Box><div><Typography sx={{ fontSize: 13, fontWeight: 600 }}>{templateName || (step.body ? "Reuse a saved template" : "Start with a saved template")}</Typography><Typography variant="body2" color="text.secondary">{templateName ? "Template copied. You can customize this message below." : "Reuse your email designs and subjects."}</Typography></div></Stack><Button variant="outlined" size="small" onClick={() => setPickerOpen(true)}>{templateName ? "Change template" : "Browse templates"}</Button></Stack></CardContent></Card>}
    {step.channel === "EMAIL" && <TextField required fullWidth label="Subject" value={step.subject} onChange={e => onChange({ subject: e.target.value })} slotProps={{ htmlInput: { maxLength: 998 } }}/>}
    {step.channel === "EMAIL" ? <EmailContentEditor value={{ html: step.body, designJson: step.designJson }} onChange={value => onChange({ body: value.html, designJson: value.designJson })}/> : <TextField required fullWidth multiline minRows={5} maxRows={10} label="SMS content" value={step.body} onChange={e => onChange({ body: e.target.value })}/>}
    <Typography variant="body2" color="text.secondary">{eventDriven ? "Variables such as {{name}} are filled from the event data." : "Use actual values here. Dynamic variables require an event trigger."}</Typography>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}><TextField required type="number" label={index === 0 ? "Wait after trigger (seconds)" : "Wait after previous message (seconds)"} value={step.delaySeconds} onChange={e => onChange({ delaySeconds: Number(e.target.value) })} slotProps={{ htmlInput: { min: 0, max: 31536000, step: 1 } }}/>
      {index > 0 && <TextField select fullWidth label="Send this message" value={step.condition} onChange={e => onChange({ condition: e.target.value })}><MenuItem value="ALWAYS">Always</MenuItem><MenuItem value="PREVIOUS_FAILED">If previous message failed</MenuItem><MenuItem value="PREVIOUS_DELIVERED">If previous message was delivered</MenuItem><MenuItem value="PREVIOUS_NOT_DELIVERED">If previous message was not delivered</MenuItem></TextField>}
    </Box>
    <FormControlLabel control={<Checkbox checked={step.transactional} onChange={e => onChange({ transactional: e.target.checked })}/>} label={<Typography variant="body2">Transactional message (account updates, receipts or verification)</Typography>}/>
    {index > 0 && step.condition !== "ALWAYS" && <Alert severity="info">Use the same number of recipients as the previous message, in matching order.</Alert>}
    <Dialog open={nextChannel !== null} onClose={() => setNextChannel(null)}><DialogTitle>Change message channel?</DialogTitle><DialogContent><Typography variant="body2">Switching channels clears this message's recipients, sender, subject and content. Its delay and condition will stay.</Typography></DialogContent><DialogActions><Button onClick={() => setNextChannel(null)}>Keep editing</Button><Button color="error" onClick={() => { if (nextChannel) changeChannel(nextChannel); }}>Change channel</Button></DialogActions></Dialog>
    <EmailTemplatePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onApply={(template, name) => { onChange({ subject: template.subject, body: template.htmlContent, designJson: template.designJson }); setTemplateName(name); }}/>
  </Stack>;
}
