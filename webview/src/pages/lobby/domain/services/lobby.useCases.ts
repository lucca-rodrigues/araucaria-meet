import HttpClient from "@infra/httpRequest";

const service = new HttpClient();

export default class LobbyServices {
  async get() {
    const response = await service.get(`/lobby`);

    return response?.data;
  }

  async getById(id: string) {
    const response = await service.get(`/lobby/${id}`);

    return response?.data;
  }

  async create(data: any) {
    const response = await service.post(
      `/lobby`,
      data
    );

    return response?.data;
  }
}
