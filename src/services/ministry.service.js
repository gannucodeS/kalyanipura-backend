const BaseService = require('./base.service');
const Ministry = require('../models/Ministry');

class MinistryService extends BaseService {
  constructor() {
    super(Ministry, 'ministries');
  }

  async getAll(query = {}) {
    return super.getAll({
      ...query,
      searchFields: ['title', 'description', 'tagline'],
    });
  }
}

module.exports = new MinistryService();
