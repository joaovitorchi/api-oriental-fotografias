class ServiceSchedule {
  constructor(dto) {
    this.id = dto.id;
    this.serviceId = dto.service_id || dto.serviceId;
    this.schedulerUserId = dto.scheduler_user_id || dto.schedulerUserId;
    this.appointmentDate = dto.appointment_date || dto.appointmentDate;
    this.obs = dto.obs;
    this.approved = dto.approved;
    this.userProvider = dto.user_provider || dto.userProvider;
    this.userScheduler = dto.user_scheduler || dto.userScheduler;
    this.average = dto.average;
  }
}

module.exports = ServiceSchedule;