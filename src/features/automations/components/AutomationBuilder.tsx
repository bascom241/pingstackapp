import { useRef, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItemButton, ListItemText, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { createAutomation } from "../api/automationService";
import { newAutomationDraft, newMessageStep, toAutomationRequest, validateMessage, validateTrigger } from "../utils/automationDraft";
import { AutomationTrigger } from "./AutomationTrigger";
import { AutomationMessageEditor } from "./AutomationMessageEditor";
import { AutomationReview } from "./AutomationReview";
import { getApiErrorMessage } from "../../../utils/apiError";
import { ArrowLeft, ArrowRight, Plus } from "../../../ui/icons";
type Props = {
    onClose: () => void;
    onCreated: () => void;
};
export function AutomationBuilder({ onClose, onCreated }: Props) {
    const [draft, setDraft] = useState(newAutomationDraft);
    const [stage, setStage] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);
    const [error, setError] = useState("");
    const [confirmClose, setConfirmClose] = useState(false);
    const [confirmRemove, setConfirmRemove] = useState(false);
    const title = useRef<HTMLHeadingElement>(null);
    const cache = useQueryClient();
    const create = useMutation({ mutationFn: () => createAutomation(toAutomationRequest(draft)), onSuccess: () => { void cache.invalidateQueries({ queryKey: ["automations"] }); onCreated(); }, onError: failure => setError(getApiErrorMessage(failure)) });
    const go = (next: number) => { setError(""); setStage(next); title.current?.focus(); };
    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (create.isPending) return;
        const triggerIssue = validateTrigger(draft);
        if ((stage === 0 || stage === 2) && triggerIssue) {
            setStage(0);
            setError(triggerIssue);
            return;
        }
        if (stage > 0) {
            const invalidIndex = draft.steps.findIndex((step, index) => validateMessage(step, index, draft));
            if (invalidIndex >= 0) {
                setStage(1);
                setMessageIndex(invalidIndex);
                setError(validateMessage(draft.steps[invalidIndex], invalidIndex, draft));
                return;
            }
        }
        if (stage < 2) go(stage + 1);
        else create.mutate();
    };
    const selectMessage = (index: number) => { setError(""); setMessageIndex(index); };
    return <Stack spacing={3}>
    <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 2 }}><div><Typography component="h1" variant="h5" tabIndex={-1} ref={title} sx={{ fontWeight: 700 }}>Create automation</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .75 }}>Build a sequence, one decision at a time.</Typography></div><Button startIcon={<ArrowLeft size={16}/>} onClick={() => setConfirmClose(true)} disabled={create.isPending}>All automations</Button></Stack>
    <Card variant="outlined"><CardContent><Stepper activeStep={stage} alternativeLabel>{["Trigger", "Messages", "Review"].map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}</Stepper></CardContent></Card>
    <Box component="form" onSubmit={submit}>
      <Box sx={{ display: "grid", gridTemplateColumns: stage === 1 ? { xs: "1fr", lg: "250px minmax(0, 1fr)" } : "1fr", gap: 3, alignItems: "start" }}>
        {stage === 1 && <Card variant="outlined"><CardContent><Typography variant="subtitle2">Your sequence</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5, mb: 2 }}>{draft.steps.length} of 20 messages</Typography><List disablePadding sx={{ maxHeight: { xs: 160, lg: 420 }, overflowY: "auto" }}>{draft.steps.map((step, i) => <ListItemButton key={i} selected={messageIndex === i} onClick={() => selectMessage(i)} sx={{ borderRadius: 2, mb: .5 }}><ListItemText primary={`${i + 1}. ${step.channel === "EMAIL" ? "Email" : "SMS"}`} secondary={step.subject || (step.body ? "Message composed" : "Not configured")} slotProps={{ primary: { sx: { fontSize: 13, fontWeight: 600 } }, secondary: { sx: { fontSize: 11 }, noWrap: true } }}/></ListItemButton>)}</List><Button fullWidth size="small" startIcon={<Plus size={16}/>} disabled={draft.steps.length >= 20} sx={{ mt: 2 }} onClick={() => { const issue = validateMessage(draft.steps[messageIndex], messageIndex, draft); if (issue) {
        setError(issue);
        return;
    } setDraft(current => ({ ...current, steps: [...current.steps, newMessageStep()] })); selectMessage(draft.steps.length); }}>Add message</Button></CardContent></Card>}
        <Card variant="outlined"><CardContent sx={{ p: { xs: 2.5, sm: 4 }, "&:last-child": { pb: { xs: 2.5, sm: 4 } } }}>
          {stage === 0 && <AutomationTrigger draft={draft} onChange={patch => setDraft(current => ({ ...current, ...patch }))}/>}
          {stage === 1 && <><AutomationMessageEditor key={messageIndex} step={draft.steps[messageIndex]} index={messageIndex} eventDriven={draft.trigger === "event"} onChange={patch => setDraft(current => ({ ...current, steps: current.steps.map((step, i) => i === messageIndex ? { ...step, ...patch } : step) }))}/><Stack direction="row" sx={{ mt: 3, alignItems: "center", justifyContent: "space-between" }}><Chip size="small" variant="outlined" label={`Message ${messageIndex + 1} of ${draft.steps.length}`}/>{draft.steps.length > 1 && <Button size="small" color="error" onClick={() => setConfirmRemove(true)}>Remove message</Button>}</Stack></>}
          {stage === 2 && <AutomationReview draft={draft} onEditTrigger={() => go(0)} onEditMessage={index => { selectMessage(index); go(1); }}/>}
          {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
          <Divider sx={{ my: 3 }}/>
          <Stack direction={{ xs: "column-reverse", sm: "row" }} sx={{ justifyContent: "space-between", gap: 2 }}><Button disabled={create.isPending} onClick={() => stage === 0 ? setConfirmClose(true) : go(stage - 1)}>{stage === 0 ? "Cancel" : "Back"}</Button><Stack direction="row" sx={{ gap: 1 }}>{stage === 1 && messageIndex < draft.steps.length - 1 && <Button onClick={() => { const issue = validateMessage(draft.steps[messageIndex], messageIndex, draft); if (issue)
        setError(issue);
    else
        selectMessage(messageIndex + 1); }}>Next message</Button>}<Button variant="contained" type="submit" disabled={create.isPending} endIcon={stage < 2 ? <ArrowRight size={16}/> : undefined}>{create.isPending ? "Activating..." : stage === 2 ? "Activate automation" : stage === 1 ? "Review automation" : "Continue"}</Button></Stack></Stack>
        </CardContent></Card>
      </Box>
    </Box>
    <Dialog open={confirmClose} onClose={() => setConfirmClose(false)}><DialogTitle>Discard this automation?</DialogTitle><DialogContent><Typography variant="body2">This automation has not been saved. Leaving will discard your changes.</Typography></DialogContent><DialogActions><Button onClick={() => setConfirmClose(false)}>Keep editing</Button><Button color="error" onClick={onClose}>Discard</Button></DialogActions></Dialog>
    <Dialog open={confirmRemove} onClose={() => setConfirmRemove(false)}><DialogTitle>Remove message {messageIndex + 1}?</DialogTitle><DialogContent><Typography variant="body2">The remaining messages will stay in their current order.</Typography></DialogContent><DialogActions><Button onClick={() => setConfirmRemove(false)}>Keep message</Button><Button color="error" onClick={() => { setDraft(current => ({ ...current, steps: current.steps.filter((_, i) => i !== messageIndex) })); setMessageIndex(Math.max(0, messageIndex - 1)); setConfirmRemove(false); setError(""); }}>Remove</Button></DialogActions></Dialog>
  </Stack>;
}
