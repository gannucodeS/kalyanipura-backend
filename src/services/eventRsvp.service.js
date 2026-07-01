const BaseService = require('./base.service');
const EventRsvp = require('../models/EventRsvp');
const Event = require('../models/Event');
const ApiError = require('../utils/ApiError');

class EventRsvpService extends BaseService {
  constructor() {
    super(EventRsvp, 'eventRsvps');
  }

  async create(data) {
    const event = await Event.findById(data.event);
    if (!event) {
      throw ApiError.notFound('Event not found');
    }
    const rsvp = await this.model.create(data);
    await Event.findByIdAndUpdate(data.event, { $inc: { rsvpCount: 1 } });
    return rsvp;
  }

  async getByEvent(eventId, query = {}) {
    const { page = 1, limit = 20, sort = '-createdAt' } = query;
    const skip = (page - 1) * limit;
    const filter = { event: eventId };

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

module.exports = new EventRsvpService();
