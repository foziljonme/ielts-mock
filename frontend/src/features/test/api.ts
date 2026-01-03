import { apiClient } from "../../app/api";
import type { ListeningTest } from "../../shared/types";

export const getListeningSection = async (
  testId: string
): Promise<ListeningTest> => {
  const response = await apiClient.get<any>(
    `/tests/sections/questions/listening/${testId}`
  );

  return response.data;
};
