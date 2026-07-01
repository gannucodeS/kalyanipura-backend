const { Router } = require('express');
const controller = require('../controllers/serviceTime.controller');
const { validateBody, validateParams } = require('../middleware/validate');
const validator = require('../validators/serviceTime.validator');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', validateParams(validator.idParam), controller.getById);
router.post('/', authenticate, validateBody(validator.create), controller.create);
router.put('/:id', authenticate, validateParams(validator.idParam), validateBody(validator.update), controller.update);
router.delete('/:id', authenticate, validateParams(validator.idParam), controller.remove);

module.exports = router;
