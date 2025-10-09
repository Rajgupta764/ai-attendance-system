import { v2 as cloudinary } from 'cloudinary';

// Function to get and validate Cloudinary credentials
const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('⚠️  Cloudinary credentials not configured. Image uploads will be skipped.');
    console.warn('   Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env');
    return null;
  }

  return { cloudName, apiKey, apiSecret };
};

// Configure Cloudinary lazily
const configureCloudinary = () => {
  const config = getCloudinaryConfig();
  if (config) {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
    });
    return true;
  }
  return false;
};

export const uploadToCloudinary = async (file, folder = 'attendance-users') => {
  // Configure Cloudinary before upload
  if (!configureCloudinary()) {
    throw new Error('Cloudinary is not configured. Please set credentials in .env file.');
  }

  try {
    if (!file || !file.path) {
      throw new Error('No file provided for upload');
    }

    console.log(`📤 Uploading image to Cloudinary: ${file.originalname || file.path}`);
    
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
      ],
    });

    console.log(`✅ Image uploaded successfully: ${result.secure_url}`);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(`❌ Cloudinary upload failed: ${error.message}`);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  // Configure Cloudinary before delete
  configureCloudinary();
  
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Cloudinary delete failed: ${error.message}`);
  }
};

export default cloudinary;
