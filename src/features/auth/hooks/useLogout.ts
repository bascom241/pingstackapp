import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logoutSession } from "../../../api/axios";
import { useLoginStore } from "../store/useLoginStore";

export function useLogout() {
  const [isPending, setPending] = useState(false);
  const cache = useQueryClient();
  const navigate = useNavigate();
  const logout = async () => {
    if (isPending) return;
    setPending(true);
    const remote = logoutSession().then(() => true, () => false); // Clears local tokens immediately and invalidates pending refreshes.
    useLoginStore.getState().logout();
    useLoginStore.getState().resetForm();
    await cache.cancelQueries();
    cache.clear();
    let confirmed = true;
    try { confirmed = await remote; } catch { confirmed = false; }
    finally {
      cache.clear();
      navigate(confirmed ? "/login" : "/login?logout=local-only", { replace: true });
      setPending(false);
    }
  };
  return { logout, isPending };
}

