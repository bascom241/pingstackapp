import { jwtDecode } from "jwt-decode";

export type AuthRole = "ROLE_USER" | "ROLE_ADMIN";

type DecodedAccessToken = {
  exp?: number;
  role?: AuthRole;
  roles?: string[];
};
let sessionRevision = 0;
export const getSessionRevision = () => sessionRevision;

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  role?: AuthRole;
};

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const ROLE_KEY = "role";
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const getRoleFromToken = (token: string): AuthRole | null => {
  try {
    const claims = jwtDecode<DecodedAccessToken>(token);
    const role = claims.role || claims.roles?.find(value => value === "ROLE_ADMIN" || value.toLowerCase() === "admin") || claims.roles?.[0];
    return role ? (role.toUpperCase().startsWith("ROLE_") ? role.toUpperCase() : `ROLE_${role.toUpperCase()}`) as AuthRole : null;
  } catch {
    return null;
  }
};
export const saveAuthSession = (session: AuthSession, options: { refresh?: boolean } = {}) => {
  if (!options.refresh) sessionRevision++;
  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);

  if (session.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  }

  const role = session.role || getRoleFromToken(session.accessToken);
  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  } else localStorage.removeItem(ROLE_KEY);
};


export const clearAuthSession = () => {
  sessionRevision++;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
   localStorage.removeItem(ROLE_KEY);
};

export const isAccessTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<DecodedAccessToken>(token);
    if (!decoded.exp) return true;

    return decoded.exp <= Date.now() / 1000;
  } catch {
    return true;
  }
};
