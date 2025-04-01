import httpService from "./http.service";

class DashboardService {
  private baseUrl = "dashboard";

  getTotalValues = async () => {
    return await httpService.get(`${this.baseUrl}/total-values`);
  };
}

export default new DashboardService();
