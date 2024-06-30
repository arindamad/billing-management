const Customer = require('../models/customer');

exports.createCustomer = async (req, res) => {
  const customer = new Customer(req.body);
  await customer.save();
  res.redirect('/customers');
};

exports.getCustomers = async (req, res) => {
  const customers = await Customer.find();
  res.render('customer', { customers });
};
