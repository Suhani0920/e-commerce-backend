import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  categories: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true, 
  },
  
  arModel: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  dimensions: {
    type: String ,
    
  },
  weight: {
    type:  String,
    required: true,
  },
  stock: {
    type:  String,
    required: true,
  },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String }
    }
  ],
  isNewArrival: { 
    type: Boolean, 
    default: false 
  },
  salesCount: { 
    type: Number, 
    default: 0 
  },
  material: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  assemblyRequired: {
    type: Boolean,
    required: true,
  },
  /*careInstruction: {
    type: String, 
  }*/
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
