import mongoose ,{Schema} from "mongoose";

const paymentSchema = new Schema({
    order: { 
        type: Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    amount:{
        type: String,
        required: true,
        min: 0  // Amount should be a positive number
    },
    method:{
        type:String,
        enum: ['COD'], // Only allows 'COD' as the payment method
        default: 'COD'
    },
    status:{
        type:String,
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'], // Possible statuses for the payment
        default: 'Pending'
    },
   
},{timestamps:true})

const Payment= mongoose.model("Payment",paymentSchema);
export  default Payment