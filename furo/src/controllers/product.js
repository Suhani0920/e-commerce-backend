import Product from "../models/product.js"; // Import the product model
import Category from "../models/category.js";
import { uploadFile } from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";


const sellProduct = async (productId) => {
  try {
    await Product.findByIdAndUpdate(productId, { $inc: { salesCount: 1 } });
  } catch (error) {
    console.error("Error updating sales count:", error);
  }
};
// Create a new product
const createProduct = async (req, res) => {
  try {

    console.log("req body:" , req.body);
    const {
      name,
      description,
      price,
      categoryId, // Category ID from the request
      dimensions,
      weight,
      stock,
      isNewArrival,
      material,
      color,
      assemblyRequired,
      
    } = req.body;

    
    // Fetch category from the database
    const category = await Category.findById(categoryId);
    console.log('Received categoryId:', categoryId);

    if (!category) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Upload images/models to Cloudinary
    const {imageFile , modelFile} = req.files; // Assuming files are sent as multipart/form-data
    if (!imageFile || !modelFile) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const uploadedFiles = [];

    for (const file of [...imageFile, ...modelFile]) {
      const filePath = path.join(process.cwd(), 'uploads', file.filename);
      const folderPath = `furniture/${category.name}`; // Create folder structure without subcategory
      const url = await uploadFile(file.path, folderPath); // Upload file to Cloudinary
      uploadedFiles.push(url); // Store the uploaded file URL
      fs.unlinkSync(file.path); // Delete local file after upload
    }

    // Create a new product
    const newProduct = new Product({
      name,
      description,
      price,
      categories: categoryId, // Reference the category ID
      arModel: uploadedFiles.find(file => file.endsWith('.glb') || file.endsWith('.dae')) || null,
      picture: uploadedFiles.find(file => file.endsWith('.jpg') || file.endsWith('.png')) || null,
      dimensions,
      weight,
      stock,
      isNewArrival,
      material,
      color,
      assemblyRequired,
      
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });

  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

// Delete a product by its ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};






// Get products by category ID
const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ categories: categoryId }).populate("categories");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve products", error: error.message });
  }
};



// Get a single product by its ID
const getProductDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate("categories").populate("reviews.userId");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve product details", error: error.message });
  }
};


//get bestseller products
const getBestsellers = async (req, res) => {
  try {
    const bestsellers = await Product.find()
      .sort({ salesCount: -1 }) // Sort by sales count in descending order
      .limit(6) // Limit to top 10 bestsellers
      .populate("categories");
    
    res.status(200).json(bestsellers);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve bestsellers", error: error.message });
  }
};



//get new arrivals 
const getNewArrivals = async (req, res) => {
  try {
    const newArrivals = await Product.find({ isNewArrival: true }).populate("categories");
    res.status(200).json(newArrivals);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve new arrivals", error: error.message });
  }
};




  
  
  
 

export {
    createProduct,
    deleteProduct,
    getProductsByCategory,
    getProductDetails,
    getBestsellers,
    getNewArrivals 


  }; 
  

