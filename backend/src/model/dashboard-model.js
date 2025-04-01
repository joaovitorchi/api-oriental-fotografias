class Dashboard {
  constructor(dto) {
    this.totalMyServices = dto.total_my_services || dto.totalMyServices;
  }
}

module.exports = Dashboard;
