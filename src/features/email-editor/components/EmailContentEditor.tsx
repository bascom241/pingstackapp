import { lazy, Suspense, useState } from "react";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from "@mui/material";
import type { EmailDesignValue } from "../utils/emailDesign";
import { emailPreviewHtml, hasEmailContent } from "../utils/emailDesign";

const VisualEmailEditor = lazy(() => import("./VisualEmailEditor"));
type Props = { value: EmailDesignValue; onChange: (value: EmailDesignValue) => void; disabled?: boolean; label?: string };
export function EmailContentEditor({ value, onChange, disabled, label = "Email content" }: Props) {
  const [open, setOpen] = useState(false);
  return <Card variant="outlined" sx={{ borderRadius: 2, borderColor: "#e2e8f0" }}><CardContent><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2 }}><div><Typography variant="subtitle2">{label}</Typography><Typography variant="body2" color="text.secondary">Design visually with text, images, buttons and columns.</Typography></div><Button type="button" variant="outlined" size="small" disabled={disabled} onClick={() => setOpen(true)}>{hasEmailContent(value.html) ? "Edit email" : "Design email"}</Button></Stack>
    {hasEmailContent(value.html) ? <iframe title={`${label} preview`} sandbox="" referrerPolicy="no-referrer" srcDoc={emailPreviewHtml(value.html)} style={{ width: "100%", height: 280, border: "1px solid #e2e8f0", borderRadius: 8, background: "white" }}/> : <Alert severity="info">Start with a blank email or choose a saved template.</Alert>}
    {open && <Suspense fallback={<Box sx={{ p: 3 }}><CircularProgress size={20} aria-label="Loading email editor"/><Button onClick={() => setOpen(false)}>Cancel</Button></Box>}><VisualEmailEditor value={value} onClose={() => setOpen(false)} onApply={next => { onChange(next); setOpen(false); }}/></Suspense>}
  </CardContent></Card>;
}
