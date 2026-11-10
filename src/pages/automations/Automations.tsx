import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Divider, MenuItem, Stack, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
import { getAutomations, setAutomationEnabled } from "../../features/automations/api/automationService";
import { AutomationBuilder } from "../../features/automations/components/AutomationBuilder";
import type { Automation } from "../../features/automations/types/automation";
import { getApiErrorMessage } from "../../utils/apiError";
import { theme } from "../../ui/theme";
import { ArrowRight, Plus, Zap } from "../../ui/icons";
const automationTheme = createTheme(theme, {
    palette: { text: { primary: "#172b4d", secondary: "#64748b" }, divider: "#e2e8f0" },
    shape: { borderRadius: 12 },
    typography: { h6: { fontSize: "1.1rem", fontWeight: 650 }, body2: { fontSize: ".8rem", lineHeight: 1.75 }, button: { textTransform: "none", fontWeight: 600, fontSize: ".78rem" } },
    components: {
        MuiCard: { defaultProps: { variant: "outlined" }, styleOverrides: { root: { boxShadow: "none", backgroundImage: "none" } } },
        MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 8 } } },
        MuiTextField: { defaultProps: { size: "small" } },
        MuiToggleButton: { styleOverrides: { root: { textTransform: "none", fontSize: 12 } } },
    },
});
function automationStatus(item: Automation) {
    return item.lastError ? "Needs attention" : item.enabled ? "Active" : !item.nextRunAt && !item.eventName ? "Completed" : "Paused";
}
export default function Automations() {
    const cache = useQueryClient();
    const [building, setBuilding] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [feedback, setFeedback] = useState("");
    const list = useQuery({ queryKey: ["automations"], queryFn: getAutomations, refetchInterval: 15000 });
    const action = useMutation({ mutationFn: ({ id, enabled }: {
            id: string;
            enabled: boolean;
        }) => setAutomationEnabled(id, !enabled), onSuccess: () => { void cache.invalidateQueries({ queryKey: ["automations"] }); } });
    const items = list.data ?? [];
    const filtered = items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()) && (!status || automationStatus(item) === status));
    return <ThemeProvider theme={automationTheme}><Box sx={{ maxWidth: 1200, mx: "auto", color: "text.primary", pb: 3 }}>
    {building ? <AutomationBuilder onClose={() => setBuilding(false)} onCreated={() => { setBuilding(false); setFeedback("Automation activated. Follow its deliveries in Message activity."); }}/> : <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, gap: 2 }}><div><Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>Automations</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .75 }}>Build customer journeys with the right message at the right time.</Typography></div><Button variant="contained" startIcon={<Plus size={16}/>} onClick={() => { setFeedback(""); setBuilding(true); }}>New automation</Button></Stack>
      {feedback && <Alert severity="success" onClose={() => setFeedback("")}>{feedback}</Alert>}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2 }}>{[
                ["All automations", items.length], ["Active", items.filter(item => item.enabled).length], ["Paused", items.filter(item => automationStatus(item) === "Paused").length], ["Needs attention", items.filter(item => item.lastError).length],
            ].map(([label, value]) => <Card key={label}><CardContent><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h4" color="primary" sx={{ mt: 1, fontWeight: 650 }}>{list.isPending || list.isError ? "--" : value}</Typography></CardContent></Card>)}</Box>
      <Card><CardContent><Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", gap: 2 }}><div><Typography variant="h6">Your workflows</Typography><Typography variant="body2" color="text.secondary">Triggers, sequences and scheduled runs in one library.</Typography></div><Button component={Link} to="/dashboard/message-activity" endIcon={<ArrowRight size={15}/>}>Message activity</Button></Stack><Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}><TextField fullWidth label="Search automations" value={search} onChange={e => setSearch(e.target.value)}/><TextField select label="Status" value={status} onChange={e => setStatus(e.target.value)} sx={{ minWidth: 170 }}><MenuItem value="">All statuses</MenuItem>{["Active", "Paused", "Completed", "Needs attention"].map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}</TextField></Stack></CardContent><Divider />
        {list.isPending && <Box sx={{ p: 5, textAlign: "center" }}><CircularProgress size={24} aria-label="Loading automations"/></Box>}
        {list.isError && <Box sx={{ p: 3 }}><Alert severity="error" action={<Button onClick={() => void list.refetch()}>Retry</Button>}>{getApiErrorMessage(list.error)}</Alert></Box>}
        {action.isError && <Alert severity="error" sx={{ m: 2 }}>{getApiErrorMessage(action.error)}</Alert>}
        {!list.isPending && !list.isError && filtered.length === 0 && <Stack spacing={2} sx={{ py: 7, px: 3, textAlign: "center", alignItems: "center" }}><Box sx={{ p: 2, bgcolor: "#edf4ff", color: "primary.main", borderRadius: 3 }}><Zap size={26}/></Box><Typography sx={{ fontWeight: 650 }}>{items.length ? "No matching workflows" : "Create your first automation"}</Typography><Typography variant="body2" color="text.secondary">{items.length ? "Try another name or status." : "Choose a trigger, reuse a template, and connect your messages into a sequence."}</Typography>{items.length === 0 && <Button variant="outlined" onClick={() => setBuilding(true)}>Build an automation</Button>}</Stack>}
        {filtered.map(item => { const state = automationStatus(item); return <Box key={item.id} sx={{ px: 3, py: 2.5, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}><Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", gap: 2 }}><Stack spacing={1}><Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}><Typography sx={{ fontWeight: 600, fontSize: 14 }}>{item.name}</Typography><Chip size="small" label={state} color={state === "Needs attention" ? "warning" : state === "Active" ? "primary" : "default"} variant="outlined"/></Stack><Typography variant="body2" color="text.secondary">{item.steps.length} message{item.steps.length === 1 ? "" : "s"} / {item.eventName ? `Event: ${item.eventName}` : item.nextRunAt ? `Next run: ${new Date(item.nextRunAt).toLocaleString()}` : "Sequence queued"}{item.repeatSeconds ? ` / Repeats every ${item.repeatSeconds / 60} min` : ""}</Typography>{item.lastError && <Alert severity="warning">{item.lastError}</Alert>}</Stack><Button variant="outlined" size="small" sx={{ alignSelf: "center" }} disabled={action.isPending || state === "Completed"} onClick={() => action.mutate({ id: item.id, enabled: item.enabled })}>{item.enabled ? "Pause" : state === "Completed" ? "Completed" : "Resume"}</Button></Stack></Box>; })}
      </Card>
    </Stack>}
  </Box></ThemeProvider>;
}
