const router = require('express').Router();

const product = require('./routes/product');
const user = require('./routes/user');
const checkout = require('./routes/checkout');

router.use('/products', product);
router.use('/user', user);
router.use('/checkout', checkout);

module.exports = router;
