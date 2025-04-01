import httpService from "./http.service";

class ServicesFileService {
  private baseUrl = "/service/file";

  async uploadImages(payload: FormData, serviceId: number) {
    return await httpService.post(`${this.baseUrl}/upload/${serviceId}`, payload);
  }
}

export default new ServicesFileService();
