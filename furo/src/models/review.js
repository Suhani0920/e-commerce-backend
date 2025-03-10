import mongoose , {Schema} from "mongoose";



const reviewSchema = new Schema({
    product: {
         type: Schema.Types.ObjectId, 
         ref: 'Product', 
         required: true 
        },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 1,
         max: 5 
        },
    comment: String,
    
    
  },{
    timestamps:true
 });
  
  const Review = mongoose.model('Review', reviewSchema);
  export default  Review;
  