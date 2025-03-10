import mongoose , {Schema} from "mongoose";
const shippingSchema = new Schema({
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    },
    trackingNumber: String,
    status: { type: String, default: 'Pending' },
   
  },
  {
    timestamps:true
 }
);
  
  const Shipping = mongoose.model('Shipping', shippingSchema);
  export default Shipping;
  