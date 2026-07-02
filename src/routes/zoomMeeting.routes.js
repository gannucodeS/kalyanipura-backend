const { Router } = require('express');
const controller = require('../controllers/zoomMeeting.controller');

const router = Router();

router.get('/', controller.getPublic);

module.exports = router;