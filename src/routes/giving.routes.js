const { Router } = require('express');
const controller = require('../controllers/giving.controller');
const { validateBody } = require('../middleware/validate');
const validator = require('../validators/giving.validator');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.post('/', validateBody(validator.create), controller.record);
router.get('/', authenticate, controller.getAll);
router.get('/:id', authenticate, controller.getById);
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
