/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const faker = require('faker');
const db = require('./db');
const productModel = require('./models/product');
const userModel = require('./models/user');

faker.locale = 'pt_BR';

function randomFloat(max) {
  return parseFloat((Math.random() * max).toFixed(2));
}

function randomNDigits(n) {
  return Math.random().toString().slice(2, n + 2);
}

async function generateProducts() {
  const promises = [];
  for (let index = 0; index < 10; index += 1) {
    const product = {
      name: faker.commerce.product(),
      stock: faker.random.number(100),
      price: randomFloat(100),
      VIPDiscountPercentage: faker.random.number(25),
      barcodeNumber: randomNDigits(12),
    };
    promises.push(productModel.create(product));
  }
  return Promise.all(promises);
}

async function generateUsers() {
  const promises = [];
  for (let index = 0; index < 10; index += 1) {
    const product = {
      cpf: randomNDigits(11),
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: faker.internet.password(),
      userType: faker.random.arrayElement(['cashier', 'manager', 'customer']),
      isVIP: faker.random.boolean(),
      identity: randomNDigits(9),
      address: faker.address.streetAddress(),
      points: faker.random.number(),
      status: faker.random.arrayElement(['active', 'inactive']),
    };
    promises.push(userModel.create(product).catch(console.error));
  }
  return Promise.all(promises);
}

db
  .connect()
  .then(async () => {
    await generateProducts();
    await generateUsers();
  })
  .then(() => process.exit(1));
