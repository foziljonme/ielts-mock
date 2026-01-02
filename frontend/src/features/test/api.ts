import type { ListeningSection } from "@/shared/types";
import { apiClient } from "../../app/api";

export const getListeningSection = async (
  testId: string
): Promise<ListeningSection> => {
  const response = await apiClient.get<any>(
    `/tests/sections/listening/${testId}`
  );

  return response.data;
};
