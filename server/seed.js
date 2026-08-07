require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./config/db');
const { User, Supplier, Product } = require('./models');

async function seedDatabase() {
  await sequelize.sync();

  const existingAdmin = await User.findOne({ where: { username: 'admin' } });

  if (existingAdmin) {
    console.log('admin user already exists, skipping user creation');
  } else {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', passwordHash: hashedPassword });
    console.log('created admin user -> username: admin / password: admin123');
  }

  const supplierCount = await Supplier.count();
  if (supplierCount === 0) {
    const s1 = await Supplier.create({ supName: 'TechSource Ltd', supEmail: 'contact@techsource.com', supPhone: '01234 567890' });
    const s2 = await Supplier.create({ supName: 'Office Basics Co', supEmail: 'sales@officebasics.com', supPhone: '01234 111222' });

    await Product.create({ prodName: 'Wireless Mouse', prodDesc: 'A basic wireless optical mouse', price: 12.99, stockQty: 25, supplierId: s1.id });
    await Product.create({ prodName: 'USB-C Cable 1m', prodDesc: 'Braided USB-C charging cable', price: 6.5, stockQty: 3, supplierId: s1.id });
    await Product.create({ prodName: 'A4 Notepad', prodDesc: 'Pack of 5 lined A4 notepads', price: 4.25, stockQty: 40, supplierId: s2.id });
    await Product.create({ prodName: 'Stapler', prodDesc: 'Standard office stapler', price: 3.99, stockQty: 2, supplierId: s2.id });

    console.log('created some example suppliers and products');
  } else {
    console.log('suppliers already exist, skipping example data');
  }

  console.log('seeding finished');
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.log('seeding failed:', err);
  process.exit(1);
});
