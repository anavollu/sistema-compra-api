const model = require('../models/checkout');

async function getById(req, res, next) {
  try {
    const checkout = await model.findById(req.params.id);
    if (!checkout) {
      const notFoundError = new Error('checkout not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    return res.send(checkout);
  } catch (error) {
    return next(error);
  }
}

async function payWithPix(req, res) {
  try {
    const checkout = await model
      .findOne({ _id: req.params.id, status: 'pending' })
      .populate('user');
    if (!checkout) {
      const notFoundError = new Error('checkout not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    let accPoints = 0;
    if (checkout.user.isVIP) {
      accPoints = parseInt(checkout.totalValue / 10, 10);
      if (accPoints > 0) {
        checkout.user.set('points', checkout.user.points + accPoints);
        await checkout.user.save();
      }
    }

    // update status to paid
    checkout.set('status', 'paid');
    await checkout.save();
    let querystring = '';
    querystring += `pontosGastos=${checkout.expendedPoints}&`;
    querystring += `pontosTotais=${checkout.user.points}&`;
    querystring += `pontosAcumulados=${accPoints}&`;
    querystring += `nome=${checkout.user.name}`;
    return res.redirect(301, `${process.env.FRONT_URL}compra-finalizada?${querystring}`);
  } catch (error) {
    console.error(error);
    return res.redirect(301, `${process.env.FRONT_URL}compra-finalizada-erro`);
  }
}

module.exports = {
  getById,
  payWithPix,
};
