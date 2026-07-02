const { Router } = require('express');
const controller = require('../controllers/streamSetting.controller');

const router = Router();

router.get('/', controller.getPublic);

module.exports = router;