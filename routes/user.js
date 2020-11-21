const router = require('express').Router();
const controller = require('../controller/user');
const auth = require('../middlewares/auth');

router.get('/:cpf', auth('cashier', 'manager'), controller.getUserByCpf);

router.get('/', auth('cashier', 'manager'), controller.getAllUsers);

router.post('/:cpf/checkout', auth('cashier', 'manager'), controller.createUserCheckout);

module.exports = router;
