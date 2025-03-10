import dotenv from "dotenv"
import {app} from "./app.js"


import connectDb from "./database/connection.js"
dotenv.config({
    path: './env'
})

connectDb()
 .then(()=>{
    app.listen(process.env.PORT ,()=>{
        console.log("server is running at port:",process.env.PORT);
    })
 })
 .catch((err)=>{
    console.log("Mongodb connection failed !!!",err);
 })


 