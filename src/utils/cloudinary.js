import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';


const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("entered upload function");

        if (!process.env.CLOUDINARY_API_KEY) {
            throw new Error("Cloudinary API key is missing from environment variables.");
        }

        // Move config here
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        if (!localFilePath) return null;

        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log("File uploaded successfully:", res.url);
        return res;
    } catch (err) {
        console.error("Cloudinary upload failed:", err);
        await fs.unlink(localFilePath);
        return null;
    }
};

export { uploadOnCloudinary };
