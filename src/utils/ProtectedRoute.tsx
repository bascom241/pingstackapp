import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken, isAccessTokenExpired } from "../../utils/authToken";

export const ProtectedRoute = () => {
  const accessToken = getAccessToken();
  if (!accessToken || isAccessTokenExpired(accessToken)) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return <Outlet />;
}
