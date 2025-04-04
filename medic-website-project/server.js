const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user.js")
const Product = require('./models/products');;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require("dotenv").config();


const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'balls';
const SALT_ROUNDS = 10;

// Enable strict query mode for Mongoose
mongoose.set('strictQuery', true);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB Connected to:", process.env.MONGO_URI);
  console.log("User schema definition:", User.schema.obj); // Log schema to verify
  console.log("Product schema definition:", Product.schema.obj);
})
.catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Input validation middleware
const validateRegisterInput = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  next();
};

// User Registration (Signup)
app.post("/register", validateRegisterInput, async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body; // Default role to 'user'

    console.log("Registration attempt:", { username, email, requestedRole: role }); // Debug log

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.username === username 
          ? "Username already exists" 
          : "Email already in use" 
      });
    }

    // Hash password with verification
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    console.log("Password hashing:", { original: password, hashed: hashedPassword }); // Debug log

    const newUser = new User({ 
      username, 
      email,
      password: hashedPassword,
      role // Simplified role assignment
    });

    console.log("User to be created:", newUser); // Debug log

    await newUser.save();

    res.status(201).json({ 
      message: "User registered successfully!",
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// User Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find user and verify password
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      message: "Login successful", 
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Debug endpoint to check users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: "Protected data", 
    user: req.user 
  });
});

// Admin-only route example
app.get('/admin', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.sendStatus(403);
  }
  res.json({ message: "Admin dashboard" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ===== PRODUCT ROUTES ===== //
// Get all products (public)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Get single product (public)
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// Create product (admin only)
app.post('/api/products', authenticateToken, adminOnly, async (req, res) => {
  try {
    // Check if ID already exists
    const existingProduct = await Product.findOne({ id: req.body.id });
    if (existingProduct) {
      return res.status(400).json({ message: "Product ID already exists" });
    }

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ 
      message: "Error creating product",
      error: error.message 
    });
  }
});

// Update product (admin only)
app.put('/api/products/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Error updating product" });
  }
});

// Delete product (admin only)
app.delete('/api/products/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));