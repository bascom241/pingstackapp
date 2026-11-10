import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useGetSingleTemplate, useUpdateTemplate } from "../../features/templates/hooks/useTemplate";
import { EmailContentEditor } from "../../features/email-editor/components/EmailContentEditor";
import { hasEmailContent } from "../../features/email-editor/utils/emailDesign";
import type { EmailTemplateResponse } from "../../types/templates/EmailTemplateResponse";
import { getApiErrorMessage } from "../../utils/apiError";

function TemplateWorkspace({ template, templateId }: { template: EmailTemplateResponse; templateId: string }) {
  const navigate = useNavigate();
  const save = useUpdateTemplate();
  const [subject, setSubject] = useState(template.subject);
  const [content, setContent] = useState({ html: template.htmlContent, designJson: template.designJson });
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [leaving, setLeaving] = useState(false);
  const submit = () => {
    setError("");
    if (!subject.trim() || subject.length > 998 || /[\r\n]/.test(subject)) { setError("Enter an email subject of 998 characters or fewer, on one line."); return; }
    if (!hasEmailContent(content.html)) { setError("Design your email before saving."); return; }
    save.mutate({ templateId, data: { subject: subject.trim(), htmlContent: content.html, designJson: content.designJson ?? "" } }, { onSuccess: () => setDirty(false) });
  };
  return <Stack spacing={3} sx={{ maxWidth: 1200, mx: "auto" }}><Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", gap: 2 }}><div><Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>{template.name || "Email template"}</Typography><Typography variant="body2" color="text.secondary">Design once and reuse in campaigns and automations.</Typography></div><Stack direction="row" spacing={1}><Button disabled={save.isPending} onClick={() => dirty ? setLeaving(true) : navigate("/dashboard/email-templates")}>Back to templates</Button><Button variant="contained" disableElevation disabled={save.isPending || !dirty} onClick={submit}>{save.isPending ? "Saving..." : "Save template"}</Button></Stack></Stack>
    {save.isSuccess && !dirty && <Alert severity="success">Template saved.</Alert>}{(error || save.isError) && <Alert severity="error">{error || getApiErrorMessage(save.error)}</Alert>}
    <Card variant="outlined"><CardContent><TextField required fullWidth label="Email subject" value={subject} disabled={save.isPending} onChange={e => { setSubject(e.target.value); setDirty(true); }} slotProps={{ htmlInput: { maxLength: 998 } }}/></CardContent></Card>
    <EmailContentEditor value={content} disabled={save.isPending} onChange={next => { setContent({ html: next.html, designJson: next.designJson ?? "" }); setDirty(true); }}/>
    <Dialog open={leaving} onClose={() => setLeaving(false)}><DialogTitle>Leave without saving?</DialogTitle><DialogContent>Your template changes have not been saved.</DialogContent><DialogActions><Button onClick={() => setLeaving(false)}>Keep editing</Button><Button color="error" onClick={() => navigate("/dashboard/email-templates")}>Discard changes</Button></DialogActions></Dialog>
  </Stack>;
}
export default function EmailTemplateEditor() {
  const { templateId = "" } = useParams<{ templateId: string }>();
  const query = useGetSingleTemplate(templateId);
  if (!templateId) return <Alert severity="error">Template ID is missing.</Alert>;
  if (query.isPending) return <Box sx={{ p: 5, textAlign: "center" }}><CircularProgress aria-label="Loading template"/></Box>;
  if (query.isError) return <Alert severity="error" action={<Button onClick={() => void query.refetch()}>Retry</Button>}>{getApiErrorMessage(query.error)}</Alert>;
  return <TemplateWorkspace key={templateId} template={query.data} templateId={templateId}/>;
}
