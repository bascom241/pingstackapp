import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Alert, Box, Button, Card, CardActionArea, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { getTemplates, getSingleTemplate } from "../api/templateService";
import type { EmailTemplateResponse } from "../../../types/templates/EmailTemplateResponse";
import { emailPreviewHtml } from "../../email-editor/utils/emailDesign";
import { getApiErrorMessage } from "../../../utils/apiError";
type Props = {
    open: boolean;
    onClose: () => void;
    onApply: (template: EmailTemplateResponse, name: string) => void;
};
export function EmailTemplatePicker({ open, onClose, onApply }: Props) {
    const [search, setSearch] = useState("");
    const [selection, setSelection] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const templates = useQuery({ queryKey: ["email-templates"], queryFn: getTemplates, enabled: open });
    const detail = useMutation({ mutationFn: getSingleTemplate });
    const choose = (id: string, name: string) => { setSelection({ id, name }); detail.mutate(id); };
    const close = () => { detail.reset(); setSelection(null); setSearch(""); onClose(); };
    return <Dialog open={open} onClose={detail.isPending ? undefined : close} fullWidth maxWidth="md" aria-labelledby="automation-template-title">
    <DialogTitle id="automation-template-title">Choose an email template<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>A copy of the subject and design will be added to this message. Applying it replaces the current content.</Typography></DialogTitle>
    <DialogContent dividers><Stack spacing={2}>
      <TextField size="small" fullWidth label="Search templates" value={search} onChange={e => setSearch(e.target.value)}/>
      {templates.isPending && <LinearProgress aria-label="Loading templates"/>}
      {templates.isError && <Alert severity="error" action={<Button onClick={() => void templates.refetch()}>Retry</Button>}>{getApiErrorMessage(templates.error, "Could not load templates.")}</Alert>}
      {templates.data && <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, maxHeight: 240, overflowY: "auto", p: .5 }}>{templates.data.filter(t => t.status !== "ARCHIVED" && `${t.name} ${t.description}`.toLowerCase().includes(search.toLowerCase())).map(t => <Card key={t.templateId} variant="outlined" sx={{ borderColor: selection?.id === t.templateId ? "primary.main" : "divider" }}><CardActionArea disabled={detail.isPending} onClick={() => choose(t.templateId, t.name)} aria-pressed={selection?.id === t.templateId}><CardContent><Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}><Typography sx={{ fontWeight: 600, fontSize: 14 }}>{t.name}</Typography><Chip size="small" label={t.status.toLowerCase()}/></Stack><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{t.description || "Email template"}</Typography></CardContent></CardActionArea></Card>)}</Box>}
      {templates.data && !templates.data.some(t => t.status !== "ARCHIVED" && `${t.name} ${t.description}`.toLowerCase().includes(search.toLowerCase())) && <Alert severity="info">No matching templates. Create one in Templates, or compose your message from scratch.</Alert>}
      {detail.isPending && <LinearProgress aria-label="Loading template content"/>}
      {detail.isError && <Alert severity="error">{getApiErrorMessage(detail.error, "Could not load this template. Select it to try again.")}</Alert>}
      {detail.data && detail.isSuccess && <><Typography variant="subtitle2">{detail.data.subject || "No subject"}</Typography><iframe title="Selected email template preview" sandbox="" referrerPolicy="no-referrer" srcDoc={emailPreviewHtml(detail.data.htmlContent)} style={{ width: "100%", height: 240, border: "1px solid #e2e8f0", borderRadius: 8, background: "white" }}/></>}
    </Stack></DialogContent>
    <DialogActions><Button onClick={close} disabled={detail.isPending}>Cancel</Button><Button variant="contained" disabled={!detail.isSuccess || !detail.data?.htmlContent || !detail.data.subject || !selection} onClick={() => { if (detail.data && selection) {
        onApply(detail.data, selection.name);
        close();
    } }}>Use template</Button></DialogActions>
  </Dialog>;
}
