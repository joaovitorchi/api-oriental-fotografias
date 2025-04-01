class Permission {
  constructor(dto) {
    this.permissionId = dto.permission_id || dto.permissionId;
    this.name = dto.name;
    this.description = dto.description;
  }
}

module.exports = Permission;