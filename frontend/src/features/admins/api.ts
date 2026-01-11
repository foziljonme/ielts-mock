import { apiClient } from "../../app/api";

export const getDashboardData = async () => {
  const response = await apiClient.get(`/exam-session/me`);
  return response.data;
};
