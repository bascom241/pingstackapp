import { jwtDecode } from "jwt-decode";

export type AuthRole = "ROLE_USER" | "ROLE_ADMIN";

type DecodedAccessToken = {
  exp?: number;
  role?: AuthRole;
};

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
    return jwtDecode<DecodedAccessToken>(token).role || null;
  } catch {
    return null;
  }
};
export const saveAuthSession = (session: AuthSession) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);

  if (session.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  }

  const role = session.role || getRoleFromToken(session.accessToken);
  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  }
};


export const clearAuthSession = () => {
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