import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Card, CardContent, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useCreateCampaignStore } from "../../../../features/campaigns/store/createCampaignStore";
import { getSingleTemplate } from "../../../../features/templates/api/templateService";
import { EmailTemplatePicker } from "../../../../features/templates/components/EmailTemplatePicker";
import { EmailContentEditor } from "../../../../features/email-editor/components/EmailContentEditor";
import { hasEmailContent } from "../../../../features/email-editor/utils/emailDesign";
import { getApiErrorMessage } from "../../../../utils/apiError";

export default function CampaignTemplate() {
  const { formData, setFormData, setCurrentStep, currentStep, goToPreviousStep } = useCreateCampaignStore();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState("");
  const template = useQuery({ queryKey: ["email-templates", "single", formData.templateId], queryFn: () => getSingleTemplate(formData.templateId!), enabled: Boolean(formData.templateId) && formData.htmlContent === undefined });
  const content = { html: formData.htmlContent ?? template.data?.htmlContent ?? "", designJson: formData.designJson ?? template.data?.designJson };
  const subject = formData.subject || template.data?.subject || "";
  const continueFlow = () => {
    if (!formData.templateId || !hasEmailContent(content.html) || !subject.trim()) { setError("Choose a template and add an email subject and content before continuing."); return; }
    setFormData({ htmlContent: content.html, designJson: content.designJson, subject });
    setCurrentStep(currentStep + 1);
  };
  return <Stack spacing={3} sx={{ py: 3 }}><Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", gap: 2 }}><div><Typography variant="h6">Design your campaign email</Typography><Typography variant="body2" color="text.secondary">Choose a template and customize a copy for this campaign.</Typography></div><Button variant="outlined" onClick={() => setPickerOpen(true)}>{formData.templateId ? "Change template" : "Choose template"}</Button></Stack>
    {error && <Alert severity="error">{error}</Alert>}
    {formData.templateId && template.isFetching && <CircularProgress size={22} aria-label="Loading campaign template"/>}
    {template.isError && formData.htmlContent === undefined && <Alert severity="error" action={<Button onClick={() => void template.refetch()}>Retry</Button>}>{getApiErrorMessage(template.error)}</Alert>}
    {formData.templateId ? <><Card variant="outlined"><CardContent><TextField required fullWidth label="Subject" value={subject} onChange={e => setFormData({ subject: e.target.value })} slotProps={{ htmlInput: { maxLength: 998 } }}/></CardContent></Card><EmailContentEditor key={formData.templateId} value={content} disabled={formData.htmlContent === undefined && !template.data} onChange={next => setFormData({ htmlContent: next.html, designJson: next.designJson })}/></> : <Alert severity="info">Choose a saved template to start. Editing here keeps your original template unchanged.</Alert>}
    <Stack direction="row" sx={{ justifyContent: "space-between" }}><Button onClick={goToPreviousStep}>Back</Button><Button variant="contained" disableElevation disabled={!formData.templateId || (formData.htmlContent === undefined && !template.data)} onClick={continueFlow}>Continue to recipients</Button></Stack>
    <EmailTemplatePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onApply={selected => { setFormData({ templateId: selected.templateId, subject: formData.subject || selected.subject, htmlContent: selected.htmlContent, designJson: selected.designJson }); setError(""); }}/>
  </Stack>;
}
