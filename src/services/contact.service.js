const BaseService = require('./base.service');
const ContactMessage = require('../models/ContactMessage');

class ContactService extends BaseService {
  constructor() {
    super(ContactMessage, 'contacts');
  }

  async getAll(query = {}) {
    return super.getAll({
      ...query,
      searchFields: ['name', 'email', 'message', 'topic'],
    });
  }

  async markAsRead(id) {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );
    if (!doc) {
      throw require('../utils/ApiError').notFound('Message not found');
    }
    return doc;
  }
}

module.exports = new ContactService();
