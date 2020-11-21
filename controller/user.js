const { ObjectId } = require('mongoose').Types;
const model = require('../models/user');
const checkoutModel = require('../models/checkout');
const productModel = require('../models/product');

async function getUserByCpf(req, res, next) {
  try {
    const { cpf } = req.params;
    const user = await model.findOne({ cpf });
    // if user not found throw exception
    if (!user) {
      const notFoundError = new Error('user not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    return res.send(user);
  } catch (error) {
    return next(error);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await model.find();
    return res.send(users);
  } catch (error) {
    return next(error);
  }
}

async function createUserCheckout(req, res, next) {
  try {
    const { cpf } = req.params;
    const user = await model.findOne({ cpf });
    // if user not found throw exception
    if (!user) {
      const notFoundError = new Error('user not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    const items = req.body;

    items.forEach((item) => {
      if (!ObjectId.isValid(item.product_id)) {
        const productNotExistsError = new Error(`item ${item.product_id} not exists`);
        productNotExistsError.status = 404;
        throw productNotExistsError;
      }
    });

    const products = await productModel
      .find({ _id: { $in: items.map(el => ObjectId(el.product_id)) } });

    const checkout = {
      user: user._id,
      totalValue: 0,
      totalPrice: 0,
      discount: 0,
      checkoutItems: [],
    };
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const product = products.find(el => el._id.toString() === item.product_id);

      // if product not found throw exception
      if (!product) {
        const productNotExistsError = new Error(`item ${item.product_id} not exists`);
        productNotExistsError.status = 404;
        throw productNotExistsError;
      }
      const checkoutItem = {
        name: product.name,
        price: product.price,
        product: item.product_id,
        quantity: item.quantity,
        totalPrice: parseFloat((item.quantity * product.price).toFixed(2)),
      };

      // block stock in product
      const newProductStock = product.stock - item.quantity;
      product.set('stock', newProductStock);
      // TODO: throw exception in missing stock case

      // vip user discount
      if (user.isVIP) {
        const vipDiscount = product.VIPDiscountPercentage;
        const discount = parseFloat((vipDiscount / 100 * product.price).toFixed(2));
        const itemDiscountTotal = parseFloat((discount * item.quantity).toFixed(2));
        checkoutItem.discount = itemDiscountTotal;
        checkoutItem.totalValue = checkoutItem.totalPrice - itemDiscountTotal;
      } else {
        checkoutItem.totalValue = checkoutItem.totalPrice;
        checkoutItem.discount = 0;
      }
      checkout.checkoutItems.push(checkoutItem);
      checkout.totalValue += checkoutItem.totalValue;
      checkout.totalPrice += checkoutItem.totalPrice;
      checkout.discount += checkoutItem.discount;
    }

    if (user.isVIP && user.points > 0) {
      const maxPoints = Math.ceil(checkout.totalValue);
      if (user.points < maxPoints) {
        const pointsToExpend = user.points;
        user.set('points', 0);
        checkout.expendedPoints = pointsToExpend;
        checkout.totalValue -= pointsToExpend;
      } else {
        checkout.expendedPoints = maxPoints;
        user.set('points', user.points - maxPoints);
        checkout.totalValue = 0;
      }
      await user.save();
    }

    // first checkout status is pending
    checkout.status = checkout.totalValue === 0
      ? 'paid' : 'pending';

    // pix url relative path
    checkout._id = new ObjectId();
    checkout.pixUrl = `/checkout/${checkout._id}/pix/confirm`;

    // save products new stock
    await Promise.all(products.map(product => product.save()));

    // send created checkout
    return res.send(await checkoutModel.create(checkout));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUserByCpf,
  getAllUsers,
  createUserCheckout,
};
