require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/products.js');
const { allProducts } = require('../client/src/components/assets/all_products.js'); // Adjust path as needed

async function importProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing products (optional)
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert all products
    const result = await Product.insertMany(allProducts);
    console.log(`Successfully imported ${result.length} products`);

    // Close connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error during import:', error);
    process.exit(1);
  }
}

importProducts();