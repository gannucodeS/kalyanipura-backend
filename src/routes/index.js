const { Router } = require('express');
const { apiLimiter } = require('../middleware/rateLimiter');

const serviceTimeRoutes = require('./serviceTime.routes');
const galleryRoutes = require('./gallery.routes');
const ministryRoutes = require('./ministry.routes');
const eventRoutes = require('./event.routes');
const prayerRequestRoutes = require('./prayerRequest.routes');
const contactRoutes = require('./contact.routes');
const givingRoutes = require('./giving.routes');
const adminRoutes = require('./admin.routes');

const router = Router();

router.use('/admin', adminRoutes);

router.use(apiLimiter);

router.use('/service-times', serviceTimeRoutes);
router.use('/gallery', galleryRoutes);
router.use('/ministries', ministryRoutes);
router.use('/events', eventRoutes);
router.use('/prayer-requests', prayerRequestRoutes);
router.use('/contact', contactRoutes);
router.use('/giving', givingRoutes);

module.exports = router;
