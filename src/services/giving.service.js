const BaseService = require('./base.service');
const Giving = require('../models/Giving');

class GivingService extends BaseService {
  constructor() {
    super(Giving, 'giving');
  }

  async getAll(query = {}) {
    return super.getAll({
      ...query,
      searchFields: ['name', 'email'],
    });
  }
}

module.exports = new GivingService();
