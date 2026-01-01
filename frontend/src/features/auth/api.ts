import { apiClient } from "../../app/api";
import type { LoginResponse, User } from "./types";

export const authenticate = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await apiClient
    .post<LoginResponse>("/auth/login", {
      email,
      password,
    })
    .then((response) => response.data);
  localStorage.setItem("accessToken", response.accessToken);
  localStorage.setItem("refreshToken", response.refreshToken);
  localStorage.setItem("exp", response.exp);
};

export const getMe = async () => {
  const response = await apiClient
    .get<User>("/auth/me")
    .then((response) => response.data);
  return response;
};
