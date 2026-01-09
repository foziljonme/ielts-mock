import { apiClient } from "../../app/api";
import type { ListeningTest } from "../../shared/types";
import type { IExamSeatSession } from "../auth/types";

export const getListeningSection = async (
  examId: string
): Promise<ListeningTest> => {
  const response = await apiClient.get<any>(`/exams/${examId}/questions`);

  return response.data.listening;
};

export const getExamSeatInfo = async (
  examId: string
): Promise<IExamSeatSession> => {
  const response = await apiClient.get<any>(`/exams/${examId}/seat-info`);

  return response.data;
};
