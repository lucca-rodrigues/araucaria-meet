import HttpClient from "@infra/httpRequest";

const service = new HttpClient();

export default class MeetingRoomServices {
  async get() {
    const response = await service.get(`/meeting-room`);

    return response?.data;
  }

  async getById(id: string) {
    const response = await service.get(`/meeting-room/${id}`);

    return response?.data;
  }

  async create(data: any) {
    const response = await service.post(
      `/meeting-room`,
      data
    );

    return response?.data;
  }
}
