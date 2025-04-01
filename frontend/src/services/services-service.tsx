import { Service } from "models/Service.model";
import httpService from "./http.service";
import { ContractServiceModel } from "models/ContractService.model";

class ServicesService {
  private baseUrl = "/service";
  private baseUrlSchedule = "/service/schedule";

  list = async (
    name: string = null,
    categoryId: string = null,
    sort: string = null,
    page: number = 1,
    myServices: boolean = false
  ) => {
    let query = "?";
    query += name ? `name=${name}&` : "";
    query += categoryId ? `categoryId=${categoryId}&` : "";
    query += sort ? `sort=${sort}&` : "";
    query += page > 0 ? `page=${page}&` : "";
    query += myServices !== null ? `myServices=${myServices}&` : "";
    query = query.substring(query.length - 1) == "&" ? query.substring(0, query.length - 1) : "";

    return await httpService.get(`${this.baseUrl}/list${query}`);
  };

  getById = async (serviceId: number) => {
    return await httpService.get(`${this.baseUrl}/id/${serviceId}`);
  };

  create = async (payload: Service) => {
    return await httpService.post(`${this.baseUrl}/create`, payload);
  };

  update = async (payload: Service) => {
    return await httpService.put(`${this.baseUrl}/update`, payload);
  };

  listMySchedules = async () => {
    return await httpService.get(`${this.baseUrlSchedule}/list-my-schedules`);
  };

  contractService = async (payload: ContractServiceModel) => {
    return await httpService.post(`${this.baseUrlSchedule}/create`, payload);
  };

  approveDisapproveSchedule = async (scheduleId: number, approved: boolean) => {
    return await httpService.put(
      `${this.baseUrlSchedule}/approve-disapprove/${scheduleId}/${approved}`,
      {}
    );
  };

  giveScoreToService = async (serviceId: number, score: number) => {
    return await httpService.post(`${this.baseUrl}/score`, { serviceId, score });
  };
}

export default new ServicesService();
