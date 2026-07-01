const ApiError = require('../utils/ApiError');
const cache = require('../utils/cache');
const { autoTranslate } = require('../utils/translate');

class BaseService {
  constructor(model, cachePrefix = '') {
    this.model = model;
    this.cachePrefix = cachePrefix || model.modelName.toLowerCase();
  }

  async getAll(query = {}) {
    const {
      page = 1,
      limit = 20,
      sort = '-createdAt',
      search,
      searchFields = ['title', 'description'],
      includeDeleted,
      ...filters
    } = query;

    const skip = (page - 1) * limit;
    const filter = { ...filters };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = searchFields.map((field) => ({ [field]: searchRegex }));
    }

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

  async getById(id) {
    const doc = await this.model.findById(id);
    if (!doc) {
      throw ApiError.notFound(`${this.model.modelName} not found`);
    }
    return doc;
  }

  async create(data) {
    const doc = await this.model.create(data);
    cache.delByPattern(`^${this.cachePrefix}`);
    await autoTranslate(doc, this.model.modelName);
    return doc;
  }

  async update(id, data) {
    const doc = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      throw ApiError.notFound(`${this.model.modelName} not found`);
    }
    cache.delByPattern(`^${this.cachePrefix}`);
    await autoTranslate(doc, this.model.modelName);
    return doc;
  }

  async delete(id) {
    const doc = await this.model.findById(id);
    if (!doc) {
      throw ApiError.notFound(`${this.model.modelName} not found`);
    }
    if (typeof doc.softDelete === 'function') {
      await doc.softDelete();
    } else {
      await this.model.findByIdAndDelete(id);
    }
    cache.delByPattern(`^${this.cachePrefix}`);
    return doc;
  }

  async restore(id) {
    const doc = await this.model.findOne({ _id: id, isDeleted: true });
    if (!doc) {
      throw ApiError.notFound(`${this.model.modelName} not found or not deleted`);
    }
    if (typeof doc.restore === 'function') {
      await doc.restore();
    }
    cache.delByPattern(`^${this.cachePrefix}`);
    return doc;
  }

  async count(filters = {}) {
    return this.model.countDocuments(filters);
  }
}

module.exports = BaseService;
