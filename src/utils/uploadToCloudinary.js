import dotenv from 'dotenv';
dotenv.config();
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(filePath) {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath);
    console.log('File uploaded to Cloudinary:', result.secure_url);
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}
