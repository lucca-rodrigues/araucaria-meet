/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export default class HttpClient {
  constructor(readonly baseUrl?: string) {}

  private isRequestPending: boolean = false;

  api() {
    const TOKEN = Cookies.get("auth-token") || null;
    const DEFAULT_BASE_URL = import.meta.env.VITE_API_CORE_URL;
    const CUSTOMER_CLIENT = import.meta.env.CUSTOMER_CLIENT;

    const instance = axios.create({
      baseURL: this.baseUrl ?? DEFAULT_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN && `Bearer ${TOKEN}`,
        "x-secret": CUSTOMER_CLIENT ?? "App Admin",
      },
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          Cookies.remove("token");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }

  async get(path: string) {
    try {
      if (!this.isRequestPending) {
        this.isRequestPending = true;
      }

      const response = await this.api().get(`${path}`);

      setTimeout(() => {
        this.isRequestPending = false;
      }, 3000);

      return response;
    } catch (error) {
      console.error("error", error);
      this.isRequestPending = false;
    }
  }

  async post(path: string, data?: any, config?: any) {
    try {
      const response = await this.api().post(`${path}`, data, config);
      return response;
    } catch (error) {
      console.log("error", error);

      return error;
    }
  }

  async put(path: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.api().put(`${path}`, data, config);
      return response;
    } catch (error) {
      console.log("error", error);
    }
  }

  async patch(path: string, data: any) {
    try {
      const response = await this.api().patch(`${path}`, data);
      return response;
    } catch (error) {
      console.log("error", error);
    }
  }

  async delete(path: string, data?: any) {
    try {
      const response = await this.api().delete(`${path}`, data);
      return response;
    } catch (error) {
      console.log("error", error);
    }
  }
}
