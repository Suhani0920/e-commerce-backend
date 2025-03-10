import mongoose , {Schema} from "mongoose";





const categorySchema = new Schema({
    name: { type: String, required: true },
    
    discription:String,
    
  },{
    timestamps:true
 });
  
  const Category = mongoose.model('Category', categorySchema);
  export default Category;
  