import { apiClient } from "../../app/api";
import {
  UserRole,
  type ILoginResponse,
  type ISessionResponse,
  type IUser,
  AuthType,
} from "./types";
import { storeAuthCreds } from "./utils";

export const getMe = async () => {
  const response = await apiClient
    .get<IUser>("/auth/me")
    .then((response) => response.data);
  return response.id;
};

export const joinByCode = async ({
  accessCode,
  studentId,
}: {
  accessCode: string;
  studentId: string;
}) => {
  const response = await apiClient
    .post<ILoginResponse>("/auth/join-by-code", {
      accessCode,
      studentId,
    })
    .then((response) => response.data);
  const { accessToken, expiresAt } = response;

  storeAuthCreds({ accessToken, expiresAt, authType: AuthType.EXAM });
  return response;
};

export const retrieveSession = async () => {
  const response = await apiClient
    .get<ISessionResponse>("/auth/session")
    .then((response) => response.data);
  return response;
};

export const loginAdmin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await apiClient
    .post<ILoginResponse>("/auth/login", {
      email,
      password,
      role: UserRole.TENANT,
    })
    .then((response) => response.data);
  const { accessToken, expiresAt, refreshToken } = response;
  storeAuthCreds({
    accessToken,
    expiresAt,
    refreshToken,
    authType: AuthType.ADMIN,
  });

  return response;
};
