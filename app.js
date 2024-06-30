const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const testRoutes = require('./routes/test');


mongoose.connect('mongodb+srv://arindamsarkar196:H9XGUzP0cMSF9S7W@cluster0.r6xvxq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/billing-system', { useNewUrlParser: true, useUnifiedTopology: true });
 
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/test', testRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
