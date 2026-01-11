import {
  ACCESS_TOKEN,
  AUTH_TYPE,
  EXPIRES_AT,
  REFRESH_TOKEN,
} from "./constants";
import type { AuthType } from "./types";

export const storeAuthCreds = ({
  accessToken,
  expiresAt,
  refreshToken,
  authType,
}: {
  accessToken: string;
  expiresAt: number;
  refreshToken?: string;
  authType: AuthType;
}) => {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  localStorage.setItem(EXPIRES_AT, expiresAt.toString());
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  }
  localStorage.setItem(AUTH_TYPE, authType);
};

export const clearAuthCreds = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(EXPIRES_AT);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(AUTH_TYPE);
};

export const isTokenExpired = () => {
  const exp = localStorage.getItem(EXPIRES_AT);
  if (!exp) return true;
  return Date.now() >= parseInt(exp);
};

export const getAuthCreds = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const expiresAt = localStorage.getItem(EXPIRES_AT);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  const authType = localStorage.getItem(AUTH_TYPE) as AuthType;
  return { accessToken, expiresAt, refreshToken, authType };
};
