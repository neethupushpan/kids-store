const cloudinary = require('../config/cloudinary');
const Product = require('../models/productModel');

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const sellerId = req.user._id; // Make sure your auth middleware sets this
    const { name, description, price, category, size, stock } = req.body;

    // Basic validations
    if (!name || !description || !price || !category || !size || !stock  ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //if (!Array.isArray(size) || size.length === 0) {
     // return res.status(400).json({ message: "Please provide at least one size" });
    //}
//take file details from multer
  //console.log('📁 Uploaded file info:', req.file);

  //const imageUrl = req.file ? req.file.path : null;
   if (!req.file) {
  return res.status(400).json({ message: "No image uploaded" });
}
const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path)
console.log('☁️ Cloudinary upload response:', cloudinaryResponse);
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      size,
      stock,
   image:cloudinaryResponse.url,
      sellerId
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully",
      product: savedProduct
    });

  } catch (error) {
    console.error(error);
   
    res.status(500).json({
      message: "Failed to create product",
      error: error.message
    });
  }
};

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('sellerId', 'storeName email');
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'storeName');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const productId = req.params.id;

    // Find product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check seller authorization
    if (product.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this product" });
    }

    // Update fields
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check seller authorization
    if (product.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this product" });
    }

    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,updateProduct,deleteProduct
};
