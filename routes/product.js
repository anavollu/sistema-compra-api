const router = require('express').Router();
const controller = require('../controller/product');
const auth = require('../middlewares/auth');

router.get('/', auth('cashier', 'manager'), controller.getProductsByName);

module.exports = router;
