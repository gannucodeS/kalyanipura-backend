const BaseService = require('./base.service');
const Event = require('../models/Event');

class EventService extends BaseService {
  constructor() {
    super(Event, 'events');
  }

  async getAll(query = {}) {
    return super.getAll({
      ...query,
      searchFields: ['title', 'description', 'location'],
    });
  }
}

module.exports = new EventService();
