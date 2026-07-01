const BaseService = require('./base.service');
const ServiceTime = require('../models/ServiceTime');

class ServiceTimeService extends BaseService {
  constructor() {
    super(ServiceTime, 'serviceTimes');
  }
}

module.exports = new ServiceTimeService();
