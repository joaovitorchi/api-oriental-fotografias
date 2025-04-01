class Service {
  constructor(dto) {
    this.serviceId        = dto.service_id         || dto.serviceId;
    this.userId           = dto.user_id            || dto.userId;
    this.name             = dto.name               || dto.name;
    this.categoryId       = dto.category_id        || dto.categoryId;
    this.providerName     = dto.provider_name      || dto.providerName;
    this.description      = dto.description        || dto.description;
    this.price            = dto.price              || dto.price;
    this.unitId           = dto.unit_id            || dto.unitId;
    this.paymentMethodIds = dto.payment_method_ids || dto.paymentMethodIds;
    this.location         = dto.location           || dto.location;
    this.images           = dto.images;
    this.average          = dto.average;
    
    if (this.paymentMethodIds && !Array.isArray(this.paymentMethodIds)) {
      this.paymentMethodIds = this.paymentMethodIds.split(",");
    }
  }
}

module.exports = Service;