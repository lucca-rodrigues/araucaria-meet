import HttpClient from "@infra/httpRequest";
import { AuthResponse } from "../models";

const service = new HttpClient();

export class AuthServices {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await service.post(`/auth/admin`, { email, password });
    return response?.data;
  }
}
