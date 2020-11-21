const model = require('../models/product');

async function getProductsByName(req, res, next) {
  try {
    const { name } = req.query;
    const query = {};
    if (name) {
      // find product by name regex case insensitive
      const regex = new RegExp(name, 'ig');
      query.name = regex;
    }
    const products = await model.find(query);
    return res.send(products);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProductsByName,
};
