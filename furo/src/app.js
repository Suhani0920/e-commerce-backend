import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


import router from "../src/routes/user.js";
import productrouter from "../src/routes/product.js";
import paymentRouter from "../src/routes/payment.js";
import shipmentRouter from "./routes/shipment.js";
import cartRouter from "./routes/cart.js";
import reviewRouter from "./routes/review.js";
import categoryRouter from "./routes/category.js";
import orderRouter from "./routes/order.js";

const app=express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

//app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use("/api/user",router);
app.use("/api/products",productrouter);
app.use("/api/order",orderRouter);
app.use("/api/category",categoryRouter);
app.use("/api/review",reviewRouter);
app.use("/api/shipment",shipmentRouter);
app.use("/api/cart",cartRouter);
app.use("/api/payment",paymentRouter);




export  {app} 


