import { v2 as cloudinary } from 'cloudinary';

import fs from "fs";

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME , 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


//function to upload a file to Cloudinary

const uploadFile = async(filePath,folderPath)=>{
    try {
        const result=await cloudinary.uploader.upload(filePath,{
            folder:folderPath,
            resource_type: "auto",
        });

        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error; 
    }
};


export  { uploadFile };