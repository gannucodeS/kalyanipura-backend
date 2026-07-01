const BaseService = require('./base.service');
const MinistryInterest = require('../models/MinistryInterest');
const Ministry = require('../models/Ministry');
const ApiError = require('../utils/ApiError');

class MinistryInterestService extends BaseService {
  constructor() {
    super(MinistryInterest, 'ministryInterests');
  }

  async create(data) {
    const ministry = await Ministry.findById(data.ministry);
    if (!ministry) {
      throw ApiError.notFound('Ministry not found');
    }
    return this.model.create(data);
  }

  async getByMinistry(ministryId, query = {}) {
    const { page = 1, limit = 20, sort = '-createdAt' } = query;
    const skip = (page - 1) * limit;
    const filter = { ministry: ministryId };

    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      this.model.countDocuments(filter),
    ]);

    return {
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: skip + Number(limit) < total,
        hasPrev: page > 1,
      },
    };
  }
}

module.exports = new MinistryInterestService();
