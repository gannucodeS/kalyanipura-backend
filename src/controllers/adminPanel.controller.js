const adminService = require('../services/admin.service');
const prayerRequestService = require('../services/prayerRequest.service');
const contactService = require('../services/contact.service');
const givingService = require('../services/giving.service');
const serviceTimeService = require('../services/serviceTime.service');
const eventService = require('../services/event.service');
const eventRsvpService = require('../services/eventRsvp.service');
const galleryService = require('../services/gallery.service');
const ministryService = require('../services/ministry.service');
const ministryInterestService = require('../services/ministryInterest.service');

const render = (res, view, data = {}) => {
  res.render(`admin/${view}`, { ...data, email: data.email || '' });
};

const getLogin = (req, res) => {
  res.render('admin/login', { error: null });
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await adminService.login(email, password);
    res.cookie('adminToken', result.token, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect('/admin');
  } catch (err) {
    res.render('admin/login', { error: err.message });
  }
};

const postLogout = (req, res) => {
  res.clearCookie('adminToken');
  res.redirect('/admin/login');
};

const dashboard = async (req, res) => {
  try {
    const [prayerRequests, messages, giving, events, eventRsvps, ministryInterests] = await Promise.all([
      prayerRequestService.count({ isDeleted: false }),
      contactService.count({ isDeleted: false }),
      givingService.count({ isDeleted: false }),
      eventService.count({ isDeleted: false }),
      eventRsvpService.count({}),
      ministryInterestService.count({}),
    ]);
    render(res, 'dashboard', {
      email: req.admin.email,
      stats: { prayerRequests, messages, giving, events, eventRsvps, ministryInterests },
    });
  } catch (err) {
    res.redirect('/admin/login');
  }
};

const getPrayerRequests = async (req, res) => {
  try {
    const result = await prayerRequestService.getAll({ page: req.query.page || 1, limit: 50, includeDeleted: false });
    render(res, 'prayer-requests', {
      email: req.admin.email,
      requests: result.data,
      pagination: result.pagination,
      active: 'prayer-requests',
    });
  } catch (err) {
    res.redirect('/admin');
  }
};

const viewPrayerRequest = async (req, res) => {
  try {
    const r = await prayerRequestService.getById(req.params.id);
    render(res, 'prayer-request-view', { email: req.admin.email, r, active: 'prayer-requests' });
  } catch (err) {
    res.redirect('/admin/prayer-requests');
  }
};

const approvePrayerRequest = async (req, res) => {
  try {
    await prayerRequestService.approve(req.params.id);
    res.redirect('/admin/prayer-requests?success=Approved');
  } catch (err) {
    res.redirect('/admin/prayer-requests');
  }
};

const deletePrayerRequest = async (req, res) => {
  try {
    await prayerRequestService.delete(req.params.id);
    res.redirect('/admin/prayer-requests');
  } catch (err) {
    res.redirect('/admin/prayer-requests');
  }
};

const getMessages = async (req, res) => {
  try {
    const result = await contactService.getAll({ page: req.query.page || 1, limit: 50, includeDeleted: false });
    render(res, 'messages', {
      email: req.admin.email,
      messages: result.data,
      pagination: result.pagination,
      active: 'messages',
    });
  } catch (err) {
    res.redirect('/admin');
  }
};

const viewMessage = async (req, res) => {
  try {
    const m = await contactService.getById(req.params.id);
    render(res, 'message-view', { email: req.admin.email, m, active: 'messages' });
  } catch (err) {
    res.redirect('/admin/messages');
  }
};

const markMessageRead = async (req, res) => {
  try {
    await contactService.markAsRead(req.params.id);
    res.redirect('/admin/messages');
  } catch (err) {
    res.redirect('/admin/messages');
  }
};

const deleteMessage = async (req, res) => {
  try {
    await contactService.delete(req.params.id);
    res.redirect('/admin/messages');
  } catch (err) {
    res.redirect('/admin/messages');
  }
};

const getGiving = async (req, res) => {
  try {
    const result = await givingService.getAll({ page: req.query.page || 1, limit: 50, includeDeleted: false });
    render(res, 'giving', {
      email: req.admin.email,
      records: result.data,
      pagination: result.pagination,
      active: 'giving',
    });
  } catch (err) {
    res.redirect('/admin');
  }
};

const deleteGiving = async (req, res) => {
  try {
    await givingService.delete(req.params.id);
    res.redirect('/admin/giving');
  } catch (err) {
    res.redirect('/admin/giving');
  }
};

const getServiceTimes = async (req, res) => {
  try {
    const items = await serviceTimeService.getAll({ page: 1, limit: 100, includeDeleted: false });
    render(res, 'service-times', { email: req.admin.email, items: items.data, active: 'service-times' });
  } catch (err) {
    res.redirect('/admin');
  }
};

const newServiceTime = async (req, res) => {
  render(res, 'service-time-form', { email: req.admin.email, item: {}, active: 'service-times' });
};

const createServiceTime = async (req, res) => {
  try {
    await serviceTimeService.create(req.body);
    res.redirect('/admin/service-times');
  } catch (err) {
    render(res, 'service-time-form', { email: req.admin.email, item: req.body, error: err.message, active: 'service-times' });
  }
};

const editServiceTime = async (req, res) => {
  try {
    const item = await serviceTimeService.getById(req.params.id);
    render(res, 'service-time-form', { email: req.admin.email, item, active: 'service-times' });
  } catch (err) {
    res.redirect('/admin/service-times');
  }
};

const updateServiceTime = async (req, res) => {
  try {
    await serviceTimeService.update(req.params.id, req.body);
    res.redirect('/admin/service-times');
  } catch (err) {
    const item = { ...req.body, _id: req.params.id };
    render(res, 'service-time-form', { email: req.admin.email, item, error: err.message, active: 'service-times' });
  }
};

const deleteServiceTime = async (req, res) => {
  try {
    await serviceTimeService.delete(req.params.id);
    res.redirect('/admin/service-times');
  } catch (err) {
    res.redirect('/admin/service-times');
  }
};

const getEvents = async (req, res) => {
  try {
    const items = await eventService.getAll({ page: 1, limit: 100, includeDeleted: false });
    render(res, 'events', { email: req.admin.email, items: items.data, active: 'events' });
  } catch (err) {
    res.redirect('/admin');
  }
};

const newEvent = async (req, res) => {
  render(res, 'event-form', { email: req.admin.email, item: {}, active: 'events' });
};

const createEvent = async (req, res) => {
  try {
    req.body.rsvpCount = parseInt(req.body.rsvpCount, 10) || 0;
    await eventService.create(req.body);
    res.redirect('/admin/events');
  } catch (err) {
    render(res, 'event-form', { email: req.admin.email, item: req.body, error: err.message, active: 'events' });
  }
};

const editEvent = async (req, res) => {
  try {
    const item = await eventService.getById(req.params.id);
    render(res, 'event-form', { email: req.admin.email, item, active: 'events' });
  } catch (err) {
    res.redirect('/admin/events');
  }
};

const updateEvent = async (req, res) => {
  try {
    if (req.body.rsvpCount) req.body.rsvpCount = parseInt(req.body.rsvpCount, 10);
    await eventService.update(req.params.id, req.body);
    res.redirect('/admin/events');
  } catch (err) {
    const item = { ...req.body, _id: req.params.id };
    render(res, 'event-form', { email: req.admin.email, item, error: err.message, active: 'events' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await eventService.delete(req.params.id);
    res.redirect('/admin/events');
  } catch (err) {
    res.redirect('/admin/events');
  }
};

const getGallery = async (req, res) => {
  try {
    const items = await galleryService.getAll({ page: 1, limit: 100, includeDeleted: false });
    render(res, 'gallery', { email: req.admin.email, items: items.data, active: 'gallery' });
  } catch (err) {
    res.redirect('/admin');
  }
};

const newGallery = async (req, res) => {
  render(res, 'gallery-form', { email: req.admin.email, item: {}, active: 'gallery' });
};

const createGallery = async (req, res) => {
  try {
    await galleryService.create(req.body);
    res.redirect('/admin/gallery');
  } catch (err) {
    render(res, 'gallery-form', { email: req.admin.email, item: req.body, error: err.message, active: 'gallery' });
  }
};

const editGallery = async (req, res) => {
  try {
    const item = await galleryService.getById(req.params.id);
    render(res, 'gallery-form', { email: req.admin.email, item, active: 'gallery' });
  } catch (err) {
    res.redirect('/admin/gallery');
  }
};

const updateGallery = async (req, res) => {
  try {
    await galleryService.update(req.params.id, req.body);
    res.redirect('/admin/gallery');
  } catch (err) {
    const item = { ...req.body, _id: req.params.id };
    render(res, 'gallery-form', { email: req.admin.email, item, error: err.message, active: 'gallery' });
  }
};

const deleteGallery = async (req, res) => {
  try {
    await galleryService.delete(req.params.id);
    res.redirect('/admin/gallery');
  } catch (err) {
    res.redirect('/admin/gallery');
  }
};

const getMinistries = async (req, res) => {
  try {
    const items = await ministryService.getAll({ page: 1, limit: 100, includeDeleted: false });
    render(res, 'ministries', { email: req.admin.email, items: items.data, active: 'ministries' });
  } catch (err) {
    res.redirect('/admin');
  }
};

const newMinistry = async (req, res) => {
  render(res, 'ministry-form', { email: req.admin.email, item: {}, active: 'ministries' });
};

const createMinistry = async (req, res) => {
  try {
    await ministryService.create(req.body);
    res.redirect('/admin/ministries');
  } catch (err) {
    render(res, 'ministry-form', { email: req.admin.email, item: req.body, error: err.message, active: 'ministries' });
  }
};

const editMinistry = async (req, res) => {
  try {
    const item = await ministryService.getById(req.params.id);
    render(res, 'ministry-form', { email: req.admin.email, item, active: 'ministries' });
  } catch (err) {
    res.redirect('/admin/ministries');
  }
};

const updateMinistry = async (req, res) => {
  try {
    await ministryService.update(req.params.id, req.body);
    res.redirect('/admin/ministries');
  } catch (err) {
    const item = { ...req.body, _id: req.params.id };
    render(res, 'ministry-form', { email: req.admin.email, item, error: err.message, active: 'ministries' });
  }
};

const deleteMinistry = async (req, res) => {
  try {
    await ministryService.delete(req.params.id);
    res.redirect('/admin/ministries');
  } catch (err) {
    res.redirect('/admin/ministries');
  }
};

const getEventRsvps = async (req, res) => {
  try {
    const result = await eventRsvpService.getAll({ page: req.query.page || 1, limit: 50 });
    render(res, 'event-rsvps', {
      email: req.admin.email,
      items: result.data,
      pagination: result.pagination,
      active: 'event-rsvps',
    });
  } catch (err) {
    res.redirect('/admin');
  }
};

const getMinistryInterests = async (req, res) => {
  try {
    const result = await ministryInterestService.getAll({ page: req.query.page || 1, limit: 50 });
    render(res, 'ministry-interests', {
      email: req.admin.email,
      items: result.data,
      pagination: result.pagination,
      active: 'ministry-interests',
    });
  } catch (err) {
    res.redirect('/admin');
  }
};

module.exports = {
  getLogin, postLogin, postLogout,
  dashboard,
  getPrayerRequests, viewPrayerRequest, approvePrayerRequest, deletePrayerRequest,
  getMessages, viewMessage, markMessageRead, deleteMessage,
  getGiving, deleteGiving,
  getServiceTimes, newServiceTime, createServiceTime, editServiceTime, updateServiceTime, deleteServiceTime,
  getEvents, newEvent, createEvent, editEvent, updateEvent, deleteEvent,
  getGallery, newGallery, createGallery, editGallery, updateGallery, deleteGallery,
  getMinistries, newMinistry, createMinistry, editMinistry, updateMinistry, deleteMinistry,
  getEventRsvps, getMinistryInterests,
};
