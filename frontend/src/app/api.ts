import axios, { type AxiosInstance } from "axios";

const API_BASE_URL = "http://localhost:8080";

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
        const token = localStorage.getItem("accessToken");
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
