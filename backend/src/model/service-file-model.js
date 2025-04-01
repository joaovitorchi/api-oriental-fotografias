class ServiceFile {
  constructor(dto) {
    this.serviceFileId = dto.service_file_id || dto.serviceFileId;
    this.serviceId = dto.service_id || dto.serviceId;
    this.userId = dto.user_id || dto.userId;
    this.externalId = dto.external_id || dto.externalId;
    this.name = dto.name;
  }
}

module.exports = ServiceFile;
