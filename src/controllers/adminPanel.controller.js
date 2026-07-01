const adminService = require('../services/admin.service');
const session = require('../utils/session');
const prayerRequestService = require('../services/prayerRequest.service');
const contactService = require('../services/contact.service');
const givingService = require('../services/giving.service');
const serviceTimeService = require('../services/serviceTime.service');
const eventService = require('../services/event.service');
const eventRsvpService = require('../services/eventRsvp.service');
const galleryService = require('../services/gallery.service');
const ministryService = require('../services/ministry.service');
const ministryInterestService = require('../services/ministryInterest.service');

const requireAuth = (req, res, next) => {
  req.admin = null;
  if (req.cookies && req.cookies.adminSession) {
    req.admin = session.get(req.cookies.adminSession);
  }
  if (req.path === '/login' || req.path === '/logout') return next();
  if (!req.admin) return res.redirect('/admin/login');
  res.locals.email = req.admin.email;
  next();
};

const getLogin = (req, res) => {
  if (req.admin) return res.redirect('/admin');
  res.render('admin/login', { error: null });
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await adminService.login(email, password);
    const sessionId = session.create({ email: result.email });
    res.cookie('adminSession', sessionId, {
      httpOnly: true,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect('/admin');
  } catch (err) {
    res.render('admin/login', { error: err.message });
  }
};

const postLogout = (req, res) => {
  if (req.cookies && req.cookies.adminSession) {
    session.destroy(req.cookies.adminSession);
  }
  res.clearCookie('adminSession');
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
    res.render('admin/dashboard', {
      stats: { prayerRequests, messages, giving, events, eventRsvps, ministryInterests },
    });
  } catch (err) {
    res.redirect('/admin/login');
  }
};

const getPrayerRequests = async (req, res) => {
  try {
    const result = await prayerRequestService.getAll({ page: req.query.page || 1, limit: 50, includeDeleted: false });
    res.render('admin/prayer-requests', {
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
    res.render('admin/prayer-request-view', { r, active: 'prayer-requests' });
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
    res.render('admin/messages', {
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
    res.render('admin/message-view', { m, active: 'messages' });
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
    res.render('admin/giving', {
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
    res.render('admin/service-times', { items: items.data, active: 'service-times' });
  } catch (err) {
    res.redirect('/admin');
  }
};

const newServiceTime = async (req, res) => {
  res.render('admin/service-time-form', { item: {}, active: 'service-times' });
};

const createServiceTime = async (req, res) => {
  try {
    await serviceTimeService.create(req.body);
    res.redirect('/admin/service-times');
  } catch (err) {
    res.render('admin/service-time-form', { item: req.body, error: err.message, active: 'service-times' });
  }
};

const editServiceTime = async (req, res) => {
  try {
    const item = await serviceTimeService.getById(req.params.id);
    res.render('admin/service-time-form', { item, active: 'service-times' });
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
    res.render('admin/service-time-form', { item, error: err.message, active: 'service-times' });
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
    res.render('admin/events', { items: items.data, active: 'events' });
  } catch (err) {
    res.redirect('/admin');
  }
};

const newEvent = async (req, res) => {
  res.render('admin/event-form', { item: {}, active: 'events' });
};

const createEvent = async (req, res) => {
  try {
    req.body.rsvpCount = parseInt(req.body.rsvpCount, 10) || 0;
    await eventService.create(req.body);
    res.redirect('/admin/events');
  } catch (err) {
    res.render('admin/event-form', { item: req.body, error: err.message, active: 'events' });
  }
};

const editEvent = async (req, res) => {
  try {
    const item = await eventService.getById(req.params.id);
    res.render('admin/event-form', { item, active: 'events' });
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
    res.render('admin/event-form', { item, error: err.message, active: 'events' });
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
    res.render('admin/gallery', { items: items.data, active: 'gallery' });
  } catch (err) {
    res.redirect('/admin');
  }
};

const newGallery = async (req, res) => {
  res.render('admin/gallery-form', { item: {}, active: 'gallery' });
};

const createGallery = async (req, res) => {
  try {
    await galleryService.create(req.body);
    res.redirect('/admin/gallery');
  } catch (err) {
    res.render('admin/gallery-form', { item: req.body, error: err.message, active: 'gallery' });
  }
};

const editGallery = async (req, res) => {
  try {
    const item = await galleryService.getById(req.params.id);
    res.render('admin/gallery-form', { item, active: 'gallery' });
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
    res.render('admin/gallery-form', { item, error: err.message, active: 'gallery' });
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
    res.render('admin/ministries', { items: items.data, active: 'ministries' });
  } catch (err) {
    res.redirect('/admin');
  }
};

const newMinistry = async (req, res) => {
  res.render('admin/ministry-form', { item: {}, active: 'ministries' });
};

const createMinistry = async (req, res) => {
  try {
    await ministryService.create(req.body);
    res.redirect('/admin/ministries');
  } catch (err) {
    res.render('admin/ministry-form', { item: req.body, error: err.message, active: 'ministries' });
  }
};

const editMinistry = async (req, res) => {
  try {
    const item = await ministryService.getById(req.params.id);
    res.render('admin/ministry-form', { item, active: 'ministries' });
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
    res.render('admin/ministry-form', { item, error: err.message, active: 'ministries' });
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
    res.render('admin/event-rsvps', {
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
    res.render('admin/ministry-interests', {
      items: result.data,
      pagination: result.pagination,
      active: 'ministry-interests',
    });
  } catch (err) {
    res.redirect('/admin');
  }
};

module.exports = {
  requireAuth,
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
