import axios, { type AxiosInstance } from "axios";
import { ACCESS_TOKEN } from "../features/auth/constants";

export const SERVER_BASE_URL = "localhost:8080";
export const API_BASE_URL = `http://${SERVER_BASE_URL}`;
export const WS_BASE_URL = `ws://${SERVER_BASE_URL}/controls`;

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    const subdomain = window?.location?.hostname.split(".")[0];
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        "x-tenant": subdomain,
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        console.log("hit interceptor for request", { token });
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  public get<T>(url: string) {
    console.log("called get", { url });
    return this.instance.get<T>(url);
  }

  public post<T>(url: string, data: any) {
    return this.instance.post<T>(url, data);
  }

  public put<T>(url: string, data: any) {
    return this.instance.put<T>(url, data);
  }

  public delete<T>(url: string) {
    return this.instance.delete<T>(url);
  }
}

export const apiClient = new ApiClient();
