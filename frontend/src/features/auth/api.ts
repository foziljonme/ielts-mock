import { apiClient } from "../../app/api";
import {
  type IAdminLoginResponse,
  type IAdminMeResponse,
  type ICandidateLoginResponse,
  type ICandidateMeResponse,
  type ISeat,
  type IUser,
  AuthType,
} from "./types";
import { storeAuthCreds } from "./utils";

export const loginAdmin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await apiClient
    .post<IAdminLoginResponse>("/auth/admin/login", {
      email,
      password,
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

export const getMeAdmin = async () => {
  const response = await apiClient
    .get<IAdminMeResponse>("/auth/admin/me")
    .then((response) => response.data);
  return response.user;
};

export const candidateLogin = async ({
  accessCode,
  candidateId,
}: {
  accessCode: string;
  candidateId: string;
}) => {
  const response = await apiClient
    .post<ICandidateLoginResponse>("/auth/candidate/login", {
      accessCode,
      candidateId,
    })
    .then((response) => response.data);
  const { accessToken, expiresAt } = response;

  storeAuthCreds({ accessToken, expiresAt, authType: AuthType.CANDIDATE });
  return response;
};

export const getCandidateMe = async () => {
  const response = await apiClient
    .get<ICandidateMeResponse>("/auth/candidate/me")
    .then((response) => response.data);
  return response.seat;
};
