import cloudinary from 'cloudinary';

cloudinary.v2.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export function uploadToCloudinaryStorage(filePath) {
  return cloudinary.v2.uploader.upload(filePath);
}
export const getImageByPublicId = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Error :', error);
    throw new Error('Could not find a photo on Cloudinary');
  }
};
export async function deleteImageFromCloudinary(publicId) {
  try {
    await cloudinary.api.delete_resources([publicId]);
  } catch (error) {
    console.error('Error deleting :', error);
    throw new Error('Could not delete photo from Cloudinary');
  }
}
