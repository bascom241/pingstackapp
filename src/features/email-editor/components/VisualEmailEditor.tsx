import { useRef, useState } from "react";
import { EmailEditor, type EmailEditorRef, type EmailEditorProps } from "@react-email/editor";
import { Inspector } from "@react-email/editor/ui";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { type EmailDesignValue, EMPTY_EMAIL_DOCUMENT, emailPreviewHtml, readEmailDesign, serializeEmailDesign } from "../utils/emailDesign";
import "@react-email/editor/themes/default.css";
import "./email-editor.css";

const editorTheme: EmailEditorProps["theme"] = { extends: "basic", styles: { link: { color: "#004aad" }, button: { backgroundColor: "#004aad", color: "#ffffff", borderRadius: "8px" }, body: { backgroundColor: "#f8fafc" }, container: { backgroundColor: "#ffffff" } } };
type Props = { value: EmailDesignValue; onClose: () => void; onApply: (value: EmailDesignValue) => void };
export default function VisualEmailEditor({ value, onClose, onApply }: Props) {
  const editor = useRef<EmailEditorRef>(null);
  const [initial] = useState(() => readEmailDesign(value.designJson) ?? (value.html || EMPTY_EMAIL_DOCUMENT));
  const [ready, setReady] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState("desktop");
  const [discard, setDiscard] = useState(false);
  const close = () => { if (!busy) { if (dirty) setDiscard(true); else onClose(); } };
  const exportEmail = async (apply: boolean) => {
    if (!editor.current?.editor || !ready || busy) return;
    if (editor.current.editor.isEmpty) { setError("Add some email content before continuing."); return; }
    setBusy(true); setError("");
    try {
      const document = editor.current.getJSON();
      const html = await editor.current.getEmailHTML();
      const designJson = serializeEmailDesign(document);
      if (html.length > 200000 || designJson.length > 1000000) throw new Error("This email is too large. Reduce the content or use hosted image URLs.");
      if (apply) onApply({ html, designJson }); else setPreview(html);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Could not prepare your email. Try again."); }
    finally { setBusy(false); }
  };
  return <Dialog open fullScreen onClose={close} disableEnforceFocus className="pingstack-email-editor" aria-labelledby="visual-email-title"><DialogTitle id="visual-email-title"><Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 2 }}><div><Typography component="span" variant="h6">Design your email</Typography><Typography variant="body2" color="text.secondary">Type / to add blocks. Select text to format it. Choose an element to edit its properties.</Typography></div><Stack direction="row" spacing={1}><Button disabled={busy} onClick={close}>Cancel</Button><Button variant="contained" disableElevation disabled={!ready || busy} onClick={() => void exportEmail(true)}>{busy ? "Preparing..." : "Apply email"}</Button></Stack></Stack></DialogTitle>
    <DialogContent dividers sx={{ p: { xs: 1.5, md: 3 }, bgcolor: "#f8fafc" }}>
      {!readEmailDesign(value.designJson) && value.html && <Alert severity="info" sx={{ mb: 2 }}>This email is being imported from HTML. Review its layout before applying changes. Cancel keeps the original design.</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2, gap: 1 }}><Stack direction="row" spacing={1}><Button size="small" variant={preview === null ? "contained" : "outlined"} disableElevation onClick={() => setPreview(null)}>Edit</Button><Button size="small" variant={preview !== null ? "contained" : "outlined"} disableElevation disabled={!ready || busy} onClick={() => void exportEmail(false)}>Preview</Button></Stack>{preview !== null && <ToggleButtonGroup value={width} size="small" exclusive onChange={(_, next: string | null) => { if (next) setWidth(next); }} aria-label="Preview screen size"><ToggleButton value="desktop">Desktop</ToggleButton><ToggleButton value="mobile">Mobile</ToggleButton></ToggleButtonGroup>}</Stack>
      {preview !== null && <Box sx={{ maxWidth: width === "mobile" ? 375 : 820, mx: "auto" }}><iframe title="Email delivery preview" sandbox="" referrerPolicy="no-referrer" srcDoc={emailPreviewHtml(preview)} style={{ width: "100%", height: "68vh", border: "1px solid #e2e8f0", background: "white", borderRadius: 12 }}/></Box>}
      <Box className="pingstack-email-workspace" sx={{ display: preview === null ? "flex" : "none" }}><EmailEditor ref={editor} content={initial} theme={editorTheme} className="pingstack-email-canvas" onReady={() => setReady(true)} onUpdate={() => setDirty(true)} placeholder="Start writing, or type / to add a block"><Inspector.Root className="pingstack-email-inspector"><Inspector.Breadcrumb/><Inspector.Document/><Inspector.Node/><Inspector.Text/></Inspector.Root></EmailEditor></Box>
    </DialogContent>
    <Dialog open={discard} onClose={() => setDiscard(false)}><DialogTitle>Discard email changes?</DialogTitle><DialogContent>Your edits have not been applied.</DialogContent><DialogActions><Button onClick={() => setDiscard(false)}>Keep editing</Button><Button color="error" onClick={onClose}>Discard</Button></DialogActions></Dialog>
  </Dialog>;
}
