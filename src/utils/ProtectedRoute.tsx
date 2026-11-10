import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken, getRefreshToken, isAccessTokenExpired } from "../../utils/authToken";
import { refreshSession } from "../api/axios";

export const ProtectedRoute = () => {
  const [state, setState] = useState<"checking" | "ready" | "login" | "retry">("checking");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    const token = getAccessToken();
    if (token && !isAccessTokenExpired(token)) { setState("ready"); return; }
    if (!getRefreshToken()) { setState("login"); return; }
    setState("checking");
    refreshSession().then(() => { if (active) setState("ready"); }).catch(() => {
      if (active) setState(getRefreshToken() ? "retry" : "login");
    });
    return () => { active = false; };
  }, [attempt]);
  if (state === "checking") return <p role="status" className="p-8">Restoring your session...</p>;
  if (state === "retry") return <div className="p-8 space-y-4"><p role="alert">We could not reconnect. Your session is saved.</p><button onClick={() => setAttempt(value => value + 1)}>Try again</button></div>;
  if (state === "login") {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return <Outlet />;
};
