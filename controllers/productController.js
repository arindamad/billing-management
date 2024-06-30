const Product = require('../models/product');

exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.redirect('/products');
};

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.render('product', { products });
};
