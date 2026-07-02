const BaseService = require('./base.service');
const ZoomMeeting = require('../models/ZoomMeeting');

class ZoomMeetingService extends BaseService {
  constructor() {
    super(ZoomMeeting, 'zoomMeetings');
  }

  async getPublic() {
    const result = await this.getAll({ isActive: true, limit: 1 });
    return result.data && result.data.length > 0 ? result.data[0] : null;
  }
}

module.exports = new ZoomMeetingService();