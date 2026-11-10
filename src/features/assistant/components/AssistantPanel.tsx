import { useEffect, useRef, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Avatar, Box, Button, Card, CardActionArea, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, IconButton, InputBase, LinearProgress, List, ListItemButton, ListItemText, Menu, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { ArrowRight, Check, Clock, Copy, History, Mail, MessageSquare, Plus, SendHorizontal, Sparkles, Trash2, X, Zap } from "../../../ui/icons";
import { createChatSession, deleteChatSession, getAssistantStatus, getChatMessages, getChatSessions, sendChatMessage } from "../api/assistantService";
import type { ChatMessage, ChatSession } from "../types/assistant";
import { getApiErrorMessage } from "../../../utils/apiError";
import { readAutomationProposal } from "../utils/automationProposal";
import { useAssistantDraft } from "../store/useAssistantDraft";
import type { AutomationDraft } from "../../automations/utils/automationDraft";
import "./assistant.css";

const starters = [
  { icon: Zap, title: "Build a welcome journey", text: "Draft an email welcome automation for new signups, followed by an SMS after one hour." },
  { icon: Mail, title: "Write a better email", text: "Help me write a warm, concise welcome email. Ask me about my business first." },
  { icon: MessageSquare, title: "Explain a workflow issue", text: "Help me understand why my automation could not start. Use the available workspace information and explain what is still missing." },
];
type Props = { open: boolean; onClose: () => void };
export function AssistantPanel({ open, onClose }: Props) {
  return <Drawer anchor="right" ModalProps={{ keepMounted: true }} open={open} onClose={onClose} slotProps={{ paper: { sx: { width: { xs: "100%", sm: 480, xl: 520 }, maxWidth: "100%", borderLeft: "1px solid #e2e8f0", boxShadow: "-12px 0 48px #0f172a14" } }, backdrop: { sx: { bgcolor: "rgba(15,23,42,.12)" } } }}><AssistantConversation open={open} onClose={onClose}/></Drawer>;
}
function AssistantConversation({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cache = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [optimistic, setOptimistic] = useState<ChatMessage | null>(null);
  const [retry, setRetry] = useState<{ requestId: string; text: string } | null>(null);
  const [error, setError] = useState("");
  const [historyAnchor, setHistoryAnchor] = useState<HTMLElement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ChatSession | null>(null);
  const [reviewTarget, setReviewTarget] = useState<AutomationDraft | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { if (!open) return; const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, [open]);
  const [copied, setCopied] = useState<string | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  const status = useQuery({ queryKey: ["assistant-status"], queryFn: getAssistantStatus, enabled: open });
  const sessions = useQuery({ queryKey: ["assistant-sessions"], queryFn: getChatSessions, enabled: open, refetchInterval: open ? 15000 : false });
  const history = useQuery({ queryKey: ["assistant-messages", sessionId], queryFn: () => getChatMessages(sessionId!), enabled: Boolean(sessionId) && open, refetchInterval: open ? 15000 : false });
  const messages = [...(history.data ?? []), ...(optimistic && !history.data?.some(m => m.requestId === optimistic.requestId && m.role === "user") ? [optimistic] : [])];
  const send = useMutation({ mutationFn: async ({ requestId, text }: { requestId: string; text: string }) => {
    let id = sessionId;
    if (!id) { const created = await createChatSession(); id = created.id; if (active.current) setSessionId(id); void cache.invalidateQueries({ queryKey: ["assistant-sessions"] }); }
    const reply = await sendChatMessage(id, requestId, text);
    return { id, reply };
  }, onSuccess: async ({ id, reply }, variables) => {
    if (!active.current) return;
    await cache.cancelQueries({ queryKey: ["assistant-messages", id] });
    if (!active.current) return;
    cache.setQueryData<ChatMessage[]>(["assistant-messages", id], current => {
      const list = [...(current ?? [])];
      if (!list.some(m => m.requestId === variables.requestId && m.role === "user")) list.push({ id: variables.requestId, requestId: variables.requestId, role: "user", content: variables.text, createdAt: optimistic?.createdAt ?? reply.createdAt });
      if (!list.some(m => m.id === reply.id)) list.push(reply);
      return list;
    });
    void cache.invalidateQueries({ queryKey: ["assistant-sessions"] });
    if (active.current) { setOptimistic(null); setRetry(null); setError(""); composer.current?.focus(); }
  }, onError: failure => { if (active.current) { setError(getApiErrorMessage(failure, "Could not get a reply. Please try again.")); } } });
  const remove = useMutation({ mutationFn: deleteChatSession, onSuccess: (_, id) => { if (sessionId === id) newChat(); setDeleteTarget(null); cache.removeQueries({ queryKey: ["assistant-messages", id] }); void cache.invalidateQueries({ queryKey: ["assistant-sessions"] }); }, onError: failure => setError(getApiErrorMessage(failure)) });
  const serverBusy = Boolean(sessions.data?.find(s => s.id === sessionId)?.busyUntil && new Date(sessions.data.find(s => s.id === sessionId)!.busyUntil!).getTime() > now);
  const busy = send.isPending || serverBusy;
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages.length, busy]);
  function newChat() { setSessionId(null); setInput(""); setOptimistic(null); setRetry(null); setError(""); setHistoryAnchor(null); send.reset(); }
  function submit(e?: FormEvent, prompt?: string) {
    e?.preventDefault();
    const text = (prompt ?? input).trim();
    if (!text || text.length > 4000 || busy || !status.data?.configured || (sessionId && history.isError)) return;
    const requestId = crypto.randomUUID();
    setOptimistic({ id: requestId, requestId, role: "user", content: text, createdAt: new Date().toISOString() });
    setRetry({ requestId, text }); setInput(""); setError(""); send.mutate({ requestId, text });
  }
  const openDraft = (draft: AutomationDraft) => { setReviewTarget(null); useAssistantDraft.getState().setDraft(draft); navigate("/dashboard/automations"); onClose(); };
  const copy = async (message: ChatMessage) => { try { await navigator.clipboard.writeText(message.content); setCopied(message.id); } catch { setError("Your browser could not copy this reply."); } };
  const title = sessions.data?.find(s => s.id === sessionId)?.title ?? "New conversation";
  return <Box className="assistant-panel">
    <Box className="assistant-topbar"><Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}><Avatar variant="rounded" sx={{ bgcolor: "#111", width: 34, height: 34, borderRadius: "10px" }}><Sparkles size={18}/></Avatar><div><Typography sx={{ fontSize: 14, fontWeight: 700 }}>Pingstack Assistant</Typography><Typography sx={{ fontSize: 11, color: "#64748b" }}>Your workspace, a little simpler</Typography></div></Stack><Stack direction="row" spacing={.25}><Tooltip title="Conversation history"><span><IconButton size="small" disabled={busy} aria-label="Conversation history" onClick={e => setHistoryAnchor(e.currentTarget)}><History size={18}/></IconButton></span></Tooltip><Tooltip title="New chat"><span><IconButton size="small" disabled={busy} aria-label="New chat" onClick={newChat}><Plus size={19}/></IconButton></span></Tooltip><IconButton size="small" aria-label="Close assistant" onClick={onClose}><X size={19}/></IconButton></Stack></Box>
    <Box className="assistant-context"><Chip size="small" variant="outlined" icon={<Box sx={{ display: "flex", pl: .75 }}><Zap size={12}/></Box>} label="Automation workspace" sx={{ fontSize: 10, height: 25, borderColor: "#e2e8f0" }}/><Typography noWrap sx={{ fontSize: 11, color: "#64748b", maxWidth: 200 }}>{title}</Typography></Box>
    <Menu anchorEl={historyAnchor} open={Boolean(historyAnchor)} onClose={() => setHistoryAnchor(null)} slotProps={{ paper: { sx: { width: 340, maxHeight: 430, mt: 1, borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 12px 40px #0f172a14" } } }}><Box sx={{ px: 2, py: 1 }}><Typography sx={{ fontWeight: 650, fontSize: 13 }}>Your conversations</Typography></Box><Divider/>{sessions.isPending ? <Box sx={{ p: 2 }}><Skeleton/><Skeleton/></Box> : sessions.isError ? <Alert severity="error" action={<Button onClick={() => void sessions.refetch()}>Retry</Button>}>History unavailable</Alert> : !sessions.data?.length ? <Typography sx={{ p: 3, fontSize: 12, color: "text.secondary" }}>Your conversations will appear here.</Typography> : <List dense>{sessions.data.map(session => <Box key={session.id} sx={{ display: "flex", alignItems: "center", pr: 1 }}><ListItemButton selected={sessionId === session.id} onClick={() => { setSessionId(session.id); setHistoryAnchor(null); setOptimistic(null); setRetry(null); setError(""); send.reset(); }}><ListItemText primary={session.title} secondary={new Date(session.updatedAt).toLocaleDateString()} slotProps={{ primary: { noWrap: true, sx: { fontSize: 12 } }, secondary: { sx: { fontSize: 10 } } }}/></ListItemButton><IconButton size="small" aria-label={`Delete ${session.title}`} onClick={() => setDeleteTarget(session)}><Trash2 size={14}/></IconButton></Box>)}</List>}</Menu>
    <Box className="assistant-transcript" role="log" aria-live="polite" aria-label="Assistant conversation">
      {sessionId && history.isPending && <Stack spacing={2} sx={{ p: 2 }}><Skeleton width="70%"/><Skeleton/><Skeleton width="85%"/></Stack>}
      {history.isError && sessionId && <Alert severity="error" action={<Button onClick={() => void history.refetch()}>Retry</Button>}>This conversation could not be loaded.</Alert>}
      {!sessionId && !messages.length && <Box className="assistant-welcome"><Box className="assistant-welcome-icon"><Sparkles size={25}/></Box><Typography component="h2" sx={{ fontSize: 24, fontWeight: 650, letterSpacing: "-.8px", mt: 2.5, lineHeight: 1.35 }}>A clearer path from<br/>idea to automation.</Typography><Typography sx={{ color: "#64748b", fontSize: 12, lineHeight: 1.9, mt: 1.5, mb: 3 }}>Describe what you want to build. We can shape the workflow and messages together.</Typography><Stack spacing={1.25}>{starters.map(({ icon: Icon, title: label, text }) => <Card key={label} variant="outlined" sx={{ borderColor: "#e2e8f0", borderRadius: 2.5, boxShadow: "none" }}><CardActionArea disabled={busy || !status.data?.configured} onClick={() => submit(undefined, text)}><CardContent sx={{ display: "flex", alignItems: "center", gap: 1.5, py: "16px !important", px: 2 }}><Icon size={17}/><Typography sx={{ fontSize: 12, fontWeight: 550, flex: 1 }}>{label}</Typography><ArrowRight size={14}/></CardContent></CardActionArea></Card>)}</Stack></Box>}
      {messages.map(message => <Box key={message.id} className={`assistant-message assistant-message-${message.role}`}><Box className="assistant-message-label">{message.role === "assistant" ? <><Sparkles size={12}/> Pingstack</> : "You"}</Box><Typography component="div" sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: 12.5, lineHeight: 1.9 }}>{message.content}</Typography>{message.role === "assistant" && message.draft && (() => { const draft = readAutomationProposal(message.draft); return draft ? <Card variant="outlined" sx={{ mt: 2, borderColor: "#dce6f4", borderRadius: 2.5 }}><CardContent><Chip size="small" label="Workflow draft" variant="outlined" sx={{ fontSize: 10, height: 22, mb: 1.5 }}/><Typography sx={{ fontWeight: 650, fontSize: 13 }}>{draft.name}</Typography><Stack spacing={1} sx={{ my: 2 }}>{draft.steps.slice(0, 4).map((step, index) => <Stack direction="row" key={index} spacing={1} sx={{ alignItems: "center", color: "#64748b" }}><Box sx={{ width: 20, height: 20, bgcolor: "#f1f5f9", borderRadius: 1, textAlign: "center", fontSize: 10, lineHeight: "20px" }}>{index + 1}</Box>{step.channel === "EMAIL" ? <Mail size={13}/> : <MessageSquare size={13}/>}<Typography noWrap sx={{ fontSize: 11, maxWidth: 235 }}>{step.subject || "SMS message"}</Typography>{step.delaySeconds > 0 && <Clock size={11}/>}</Stack>)}{draft.steps.length > 4 && <Typography sx={{ fontSize: 11 }}>+{draft.steps.length - 4} more messages</Typography>}</Stack><Button fullWidth variant="contained" disableElevation size="small" sx={{ textTransform: "none", borderRadius: 2, fontSize: 11 }} endIcon={<ArrowRight size={14}/>} onClick={() => location.pathname.includes("/automations") ? setReviewTarget(draft) : openDraft(draft)}>Review in automation builder</Button><Typography sx={{ fontSize: 10, color: "#64748b", mt: 1.25 }}>Draft only. Nothing has been activated or sent.</Typography></CardContent></Card> : <Alert severity="warning" sx={{ mt: 1 }}>This proposal needs to be regenerated before it can open in the builder.</Alert>; })()}{message.role === "assistant" && <Tooltip title={copied === message.id ? "Copied" : "Copy reply"}><IconButton size="small" aria-label="Copy reply" onClick={() => void copy(message)} sx={{ mt: .75, ml: -.75 }}>{copied === message.id ? <Check size={13}/> : <Copy size={13}/>}</IconButton></Tooltip>}</Box>)}
      {busy && <Box className="assistant-thinking" role="status"><CircularProgress size={13} sx={{ color: "#111" }}/><Typography sx={{ fontSize: 11, color: "#64748b" }}>Preparing your reply...</Typography></Box>}
      <div ref={end}/>
    </Box>
    <Box className="assistant-composer-wrap">
      {status.isPending && <LinearProgress sx={{ mb: 1 }}/>} {status.isError && <Alert severity="error" sx={{ mb: 1 }} action={<Button onClick={() => void status.refetch()}>Retry</Button>}>Assistant availability could not be checked.</Alert>}
      {status.data && !status.data.configured && <Alert severity="info" sx={{ mb: 1.5, fontSize: 11 }}>Your workspace assistant is not connected yet. Your administrator needs to complete setup.</Alert>}
      {error && <Alert severity="error" sx={{ mb: 1.5, fontSize: 11 }} action={retry && !busy ? <Button size="small" onClick={() => { setError(""); send.mutate(retry); }}>Retry</Button> : undefined}>{error}</Alert>}
      <Box component="form" onSubmit={submit} className="assistant-composer"><InputBase inputRef={composer} fullWidth multiline minRows={2} maxRows={5} value={input} onChange={e => setInput(e.target.value)} placeholder="Describe your next workflow..." inputProps={{ maxLength: 4000, "aria-label": "Message Pingstack Assistant" }} disabled={busy || !status.data?.configured || Boolean(sessionId && history.isError)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); } }} sx={{ fontSize: 12, lineHeight: 1.8 }}/><Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mt: 1 }}><Typography sx={{ fontSize: 10, color: "#94a3b8" }}>{input.length ? `${input.length} / 4000` : "Shift + Enter for a new line"}</Typography><IconButton type="submit" aria-label="Send message to assistant" disabled={!input.trim() || busy || !status.data?.configured || Boolean(sessionId && history.isError)} size="small" sx={{ bgcolor: "#111", color: "white", width: 30, height: 30, borderRadius: 2, "&:hover": { bgcolor: "#333" }, "&.Mui-disabled": { bgcolor: "#f1f5f9", color: "#94a3b8" } }}><SendHorizontal size={15}/></IconButton></Stack></Box><Typography sx={{ textAlign: "center", fontSize: 9.5, color: "#94a3b8", mt: 1.25 }}>Uses your workspace context. Review suggestions before applying.</Typography>
    </Box>
    <Dialog open={Boolean(deleteTarget)} onClose={() => !remove.isPending && setDeleteTarget(null)}><DialogTitle>Delete this conversation?</DialogTitle><DialogContent>This removes the conversation and its messages.</DialogContent><DialogActions><Button disabled={remove.isPending} onClick={() => setDeleteTarget(null)}>Keep conversation</Button><Button disabled={remove.isPending} color="error" onClick={() => deleteTarget && remove.mutate(deleteTarget.id)}>Delete</Button></DialogActions></Dialog>
    <Dialog open={Boolean(reviewTarget)} onClose={() => setReviewTarget(null)}><DialogTitle>Open this workflow draft?</DialogTitle><DialogContent>This opens a new draft in the automation builder. Any unsaved workflow currently open will be replaced. You can review and edit before activation.</DialogContent><DialogActions><Button onClick={() => setReviewTarget(null)}>Cancel</Button><Button onClick={() => reviewTarget && openDraft(reviewTarget)}>Open draft</Button></DialogActions></Dialog>
  </Box>;
}
