const BaseService = require('./base.service');
const StreamSetting = require('../models/StreamSetting');

class StreamSettingService extends BaseService {
  constructor() {
    super(StreamSetting, 'streamSettings');
  }

  async getPublic() {
    const result = await this.getAll({ limit: 1 });
    return result.data && result.data.length > 0 ? result.data[0] : null;
  }
}

module.exports = new StreamSettingService();