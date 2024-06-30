const Invoice = require('../models/invoice');
const Customer = require('../models/customer');
const Product = require('../models/product');
const puppeteer = require('puppeteer'); 
const fs = require('fs');
const path = require('path');
const ejs = require('ejs'); 


exports.getInvoices = async (req, res) => {
  const invoices = await Invoice.find().populate('customer products');
  res.render('invoice', { invoices });
};

exports.showCreateInvoiceForm = async (req, res) => {
  const customers = await Customer.find();
  const products = await Product.find();
  res.render('createInvoice', { customers, products });
};

exports.createInvoice = async (req, res) => {
  const { customer, products, gstRate, discountRate } = req.body;

  try {
    const selectedProducts = await Product.find({ '_id': { $in: products } });

    let totalAmount = 0;
    selectedProducts.forEach(product => {
      totalAmount += product.price;
    });

    const gstAmount = (gstRate / 100) * totalAmount;
    const discountAmount = (discountRate / 100) * totalAmount;
    totalAmount = totalAmount + gstAmount - discountAmount;

    const invoice = new Invoice({
      customer,
      products,
      gstRate,
      discountRate,
      totalAmount
    });

    await invoice.save();
    res.redirect('/invoices');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating invoice');
  }
};

exports.generateInvoicePDF = async (req, res) => {
  const { invoiceId } = req.params;

  try {
    const invoice = await Invoice.findById(invoiceId).populate('customer products');

    if (!invoice) {
      return res.status(404).send('Invoice not found');
    }

    const invoicesDir = path.join(__dirname, '../invoices');
    
    // Ensure the directory exists
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    // Calculate amounts
    const gstAmount = (invoice.gstRate / 100) * invoice.totalAmount;
    const discountAmount = (invoice.discountRate / 100) * invoice.totalAmount;
    const finalAmount = invoice.totalAmount + gstAmount - discountAmount;

    // Render HTML content
    const htmlContent = await ejs.renderFile(path.join(__dirname, '../views/invoiceTemplate.html'), { invoice, gstAmount, discountAmount, finalAmount });

    const browser = await puppeteer.launch({
      headless: true,
      timeout: 60000,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],      
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 60000 });

    const filePath = path.join(invoicesDir, `invoice-${invoiceId}.pdf`);
    await page.pdf({ path: filePath, format: 'A4' });

    await browser.close();

    res.download(filePath, `invoice-${invoiceId}.pdf`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating PDF');
  }
};