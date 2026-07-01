const { Router } = require('express');
const controller = require('../controllers/admin.controller');
const { validateBody } = require('../middleware/validate');
const validator = require('../validators/admin.validator');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = Router();

router.post('/login', authLimiter, validateBody(validator.login), controller.login);
router.post('/logout', controller.logout);
router.get('/me', authenticate, controller.me);

module.exports = router;
