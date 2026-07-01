const BaseService = require('./base.service');
const GalleryItem = require('../models/GalleryItem');

class GalleryService extends BaseService {
  constructor() {
    super(GalleryItem, 'gallery');
  }

  async getAll(query = {}) {
    return super.getAll({
      ...query,
      searchFields: ['description', 'category'],
    });
  }
}

module.exports = new GalleryService();
