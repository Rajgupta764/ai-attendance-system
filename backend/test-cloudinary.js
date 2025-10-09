import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables
dotenv.config();

console.log('\n🔍 Testing Cloudinary Configuration...\n');

// Check if credentials are set
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('Environment Variables:');
console.log('---------------------');
console.log(`CLOUDINARY_CLOUD_NAME: ${cloudName ? '✅ Set' : '❌ Missing'}`);
console.log(`CLOUDINARY_API_KEY: ${apiKey ? '✅ Set' : '❌ Missing'}`);
console.log(`CLOUDINARY_API_SECRET: ${apiSecret ? '✅ Set' : '❌ Missing'}`);
console.log('');

if (!cloudName || !apiKey || !apiSecret) {
  console.log('❌ ERROR: Cloudinary credentials are missing!');
  console.log('\nPlease add these to your .env file:');
  console.log('CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.log('CLOUDINARY_API_KEY=your_api_key');
  console.log('CLOUDINARY_API_SECRET=your_api_secret');
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

console.log('Cloudinary Configuration:');
console.log('------------------------');
console.log(`Cloud Name: ${cloudName}`);
console.log(`API Key: ${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`);
console.log(`API Secret: ${apiSecret.substring(0, 6)}...${apiSecret.substring(apiSecret.length - 4)}`);
console.log('');

// Test API connection
console.log('Testing API Connection...');
console.log('------------------------');

try {
  const result = await cloudinary.api.ping();
  console.log('✅ SUCCESS: Connected to Cloudinary!');
  console.log(`Status: ${result.status}`);
  console.log('');
  console.log('🎉 Your Cloudinary configuration is working correctly!');
  console.log('   Image uploads should work fine.');
} catch (error) {
  console.log('❌ ERROR: Failed to connect to Cloudinary');
  console.log(`Error: ${error.message}`);
  console.log('');
  console.log('Possible issues:');
  console.log('1. Invalid API credentials');
  console.log('2. Network connection problem');
  console.log('3. Cloudinary account is suspended');
  console.log('');
  console.log('Please verify your credentials at: https://cloudinary.com/console');
  process.exit(1);
}
