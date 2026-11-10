import { Alert, Box, Card, CardActionArea, CardContent, Stack, TextField, Typography } from "@mui/material";
import { CalendarDays, Zap, Play } from "../../../ui/icons";
import type { AutomationDraft } from "../utils/automationDraft";
type Props = {
    draft: AutomationDraft;
    onChange: (patch: Partial<AutomationDraft>) => void;
};
const options = [
    { value: "event", title: "When an event happens", description: "Welcome customers, follow up on purchases, and respond to activity.", icon: Zap },
    { value: "schedule", title: "On a schedule", description: "Choose a start time and optionally repeat the sequence.", icon: CalendarDays },
    { value: "now", title: "Run once now", description: "Queue a one-time sequence as soon as you activate it.", icon: Play },
] as const;
export function AutomationTrigger({ draft, onChange }: Props) {
    return <Stack spacing={3}>
    <div><Typography variant="h6">Set the starting point</Typography><Typography variant="body2" color="text.secondary">Give this workflow a name and choose what starts it.</Typography></div>
    <TextField label="Automation name" autoFocus required fullWidth value={draft.name} onChange={e => onChange({ name: e.target.value })} slotProps={{ htmlInput: { maxLength: 200 } }} placeholder="Customer welcome sequence"/>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
      {options.map(({ value, title, description, icon: Icon }) => <Card variant="outlined" key={value} sx={{ borderColor: draft.trigger === value ? "primary.main" : "divider", bgcolor: draft.trigger === value ? "#edf4ff" : "background.paper" }}>
        <CardActionArea onClick={() => onChange({ trigger: value })} aria-pressed={draft.trigger === value} sx={{ height: "100%" }}><CardContent><Box sx={{ color: "primary.main", mb: 2 }}><Icon size={22}/></Box><Typography sx={{ fontWeight: 650, fontSize: 13 }}>{title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{description}</Typography></CardContent></CardActionArea>
      </Card>)}
    </Box>
    {draft.trigger === "event" && <TextField required fullWidth label="Event name" value={draft.eventName} onChange={e => onChange({ eventName: e.target.value })} placeholder="user.created" helperText="Use the event name your application sends. Event data can populate variables such as {{name}} and {{email}}." slotProps={{ htmlInput: { maxLength: 100 } }}/>}
    {draft.trigger === "schedule" && <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}><TextField required type="datetime-local" label="Start time" value={draft.nextRunAt} onChange={e => onChange({ nextRunAt: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} helperText="Your local time"/><TextField type="number" label="Repeat every (minutes)" value={draft.repeatMinutes} onChange={e => onChange({ repeatMinutes: Number(e.target.value) })} slotProps={{ htmlInput: { min: 0, max: 525600, step: 1 } }} helperText="Use 0 to run only once."/></Box>}
    {draft.trigger === "now" && <Alert severity="info">Messages start queueing after you review and activate this automation.</Alert>}
  </Stack>;
}
