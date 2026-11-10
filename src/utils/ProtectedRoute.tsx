import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken, getRefreshToken, isAccessTokenExpired } from "../../utils/authToken";
import { refreshSession } from "../api/axios";

export const ProtectedRoute = () => {
  const [state, setState] = useState<"checking" | "ready" | "login" | "retry">("checking");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    const restore = async () => {
      const token = getAccessToken();
      if (token && !isAccessTokenExpired(token)) return "ready" as const;
      if (!getRefreshToken()) return "login" as const;
      try { await refreshSession(); return "ready" as const; }
      catch { return getRefreshToken() ? "retry" as const : "login" as const; }
    };
    void restore().then(result => { if (active) setState(result); });
    return () => { active = false; };
  }, [attempt]);
  if (state === "checking") return <p role="status" className="p-8">Restoring your session...</p>;
  if (state === "retry") return <div className="p-8 space-y-4"><p role="alert">We could not reconnect. Your session is saved.</p><button onClick={() => { setState("checking"); setAttempt(value => value + 1); }}>Try again</button></div>;
  if (state === "login") {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return <Outlet />;
};
