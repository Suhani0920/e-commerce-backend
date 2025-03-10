import mongoose , {Schema} from "mongoose";





const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type:  String, required: true }
      }
    ],
    totalAmount: { type:  String, required: true },
    paymentStatus: { type: String, default: 'Pending' },
    shipmentDetails: { type: Schema.Types.ObjectId, ref: 'Shipping' },
    status: { type: String, default: 'Pending' },
   
  },{
    timestamps:true
 });
  
  const Order = mongoose.model('Order', orderSchema);
  export default Order;
  