import cloudinary from 'cloudinary';

cloudinary.v2.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export function uploadToCloudinaryStorage(filePath) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(filePath, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    });
  });
}
export const getImageByPublicId = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Error retrieving the photo:', error);
    throw new Error('Could not find the photo on Cloudinary');
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
