import { apiClient } from "../../app/api";

export const fetchCurrentTenantFullData = async () => {
  const response = await apiClient.get(`/exam-session/me`);
  return response.data;
};
