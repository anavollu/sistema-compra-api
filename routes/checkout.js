const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controller/checkout');

router.get('/:id', auth('cashier', 'manager'), controller.getById);

router.get('/:id/pix/confirm', controller.payWithPix);

module.exports = router;
