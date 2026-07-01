const { Router } = require('express');
const controller = require('../controllers/contact.controller');
const { validateBody, validateParams } = require('../middleware/validate');
const validator = require('../validators/contact.validator');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.post('/', validateBody(validator.create), controller.submit);
router.get('/', authenticate, controller.getAll);
router.get('/:id', authenticate, controller.getById);
router.patch('/:id/read', authenticate, controller.markAsRead);
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
