const { Router } = require('express');
const controller = require('../controllers/prayerRequest.controller');
const { validateBody, validateParams } = require('../middleware/validate');
const validator = require('../validators/prayerRequest.validator');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', validateParams(validator.idParam), controller.getById);
router.post('/', validateBody(validator.create), controller.submit);
router.post('/:id/pray', validateParams(validator.idParam), controller.pray);
router.patch('/:id/approve', authenticate, validateParams(validator.idParam), controller.approve);
router.delete('/:id', authenticate, validateParams(validator.idParam), controller.remove);

module.exports = router;
