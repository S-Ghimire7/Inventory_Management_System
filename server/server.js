// main entry point for the backend server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded product images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);

// quick health check route, handy for checking the deployment worked
app.get('/api/health', (req, res) => {
  res.json({ status: 'server is alive' });
});

// catch multer errors (like file too big or wrong file type) and send back a clean message
app.use((err, req, res, next) => {
  if (err) {
    console.log('unhandled error:', err.message);
    return res.status(400).json({ message: err.message || 'Something went wrong' });
  }
  next();
});

// anything else that doesn't match a route above
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// connect to the db, sync the models, then start listening
sequelize.sync().then(() => {
  console.log('database synced');
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
}).catch((err) => {
  console.log('failed to connect to database:', err);
});
