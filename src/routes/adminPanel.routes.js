const { Router } = require('express');
const controller = require('../controllers/adminPanel.controller');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = Router();

router.get('/login', controller.getLogin);
router.post('/login', authLimiter, controller.postLogin);
router.post('/logout', controller.postLogout);

router.use(authenticate);

router.get('/', controller.dashboard);

router.get('/prayer-requests', controller.getPrayerRequests);
router.get('/prayer-requests/:id/view', controller.viewPrayerRequest);
router.get('/prayer-requests/:id/approve', controller.approvePrayerRequest);
router.get('/prayer-requests/:id/delete', controller.deletePrayerRequest);

router.get('/messages', controller.getMessages);
router.get('/messages/:id/view', controller.viewMessage);
router.get('/messages/:id/read', controller.markMessageRead);
router.get('/messages/:id/delete', controller.deleteMessage);

router.get('/giving', controller.getGiving);
router.get('/giving/:id/delete', controller.deleteGiving);

router.get('/service-times', controller.getServiceTimes);
router.get('/service-times/new', controller.newServiceTime);
router.post('/service-times/new', controller.createServiceTime);
router.get('/service-times/:id/edit', controller.editServiceTime);
router.post('/service-times/:id/edit', controller.updateServiceTime);
router.get('/service-times/:id/delete', controller.deleteServiceTime);

router.get('/events', controller.getEvents);
router.get('/events/new', controller.newEvent);
router.post('/events/new', controller.createEvent);
router.get('/events/:id/edit', controller.editEvent);
router.post('/events/:id/edit', controller.updateEvent);
router.get('/events/:id/delete', controller.deleteEvent);

router.get('/gallery', controller.getGallery);
router.get('/gallery/new', controller.newGallery);
router.post('/gallery/new', controller.createGallery);
router.get('/gallery/:id/edit', controller.editGallery);
router.post('/gallery/:id/edit', controller.updateGallery);
router.get('/gallery/:id/delete', controller.deleteGallery);

router.get('/ministries', controller.getMinistries);
router.get('/ministries/new', controller.newMinistry);
router.post('/ministries/new', controller.createMinistry);
router.get('/ministries/:id/edit', controller.editMinistry);
router.post('/ministries/:id/edit', controller.updateMinistry);
router.get('/ministries/:id/delete', controller.deleteMinistry);

router.get('/event-rsvps', controller.getEventRsvps);
router.get('/ministry-interests', controller.getMinistryInterests);

module.exports = router;
