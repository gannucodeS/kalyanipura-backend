const BaseService = require('./base.service');
const PrayerRequest = require('../models/PrayerRequest');
const ApiError = require('../utils/ApiError');

class PrayerRequestService extends BaseService {
  constructor() {
    super(PrayerRequest, 'prayerRequests');
  }

  async getPublic(query = {}) {
    return this.getAll({ ...query, isApproved: true });
  }

  async submit(data) {
    if (data.isAnonymous || !data.name) {
      data.name = 'Anonymous';
    }
    const request = await this.create(data);
    return request;
  }

  async pray(id) {
    const request = await this.model.findByIdAndUpdate(
      id,
      { $inc: { prayedCount: 1 } },
      { new: true },
    );
    if (!request) {
      throw ApiError.notFound('Prayer request not found');
    }
    return request;
  }

  async approve(id) {
    const request = await this.model.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true },
    );
    if (!request) {
      throw ApiError.notFound('Prayer request not found');
    }
    return request;
  }

  async getAll(query = {}) {
    return super.getAll({
      ...query,
      searchFields: ['name', 'request'],
    });
  }
}

module.exports = new PrayerRequestService();
