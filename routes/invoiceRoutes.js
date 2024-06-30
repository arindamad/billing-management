const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');


router.get('/', invoiceController.getInvoices);
router.get('/create', invoiceController.showCreateInvoiceForm);
router.post('/create', invoiceController.createInvoice);
router.get('/:invoiceId/pdf', invoiceController.generateInvoicePDF);

module.exports = router;
