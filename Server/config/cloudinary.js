import {v2 as cloudinary} from "cloudinary";
import { response } from "express";
import fs from "fs";

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const UploadonCloudinary = async (file) => {    
    try {
        if (!file) return null
        const response = await cloudinary.uploader.upload(file, {
            resource_type : "auto"
        })
        console.log("file uploaded to cloudinary", response.url);
        fs.unlinkSync(file)
        return response
    } catch (error) {
        fs.unlinkSync(file)
        return null
    }
   
}   

export default UploadonCloudinary 