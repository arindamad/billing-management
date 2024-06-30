exports.createCustomer = async (req, res) => {
  try {     
      res.render('index', { title: 'Home Page', message: 'Customer created successfully!' });
  } catch (err) {
      console.error('Error creating customer:', err);
      res.render('error', { message: 'Failed to create customer.' });
  }
};