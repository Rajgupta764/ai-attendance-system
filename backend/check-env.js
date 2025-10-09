import dotenv from 'dotenv';

dotenv.config();

console.log('\n🔍 Checking Environment Variables...\n');

const requiredVars = {
  'PORT': process.env.PORT,
  'MONGODB_URI': process.env.MONGODB_URI,
  'JWT_SECRET': process.env.JWT_SECRET,
  'CLOUDINARY_CLOUD_NAME': process.env.CLOUDINARY_CLOUD_NAME,
  'CLOUDINARY_API_KEY': process.env.CLOUDINARY_API_KEY,
  'CLOUDINARY_API_SECRET': process.env.CLOUDINARY_API_SECRET,
  'CORS_ORIGIN': process.env.CORS_ORIGIN,
};

let allGood = true;

for (const [key, value] of Object.entries(requiredVars)) {
  const status = value ? '✅' : '❌';
  const display = value 
    ? (key.includes('SECRET') || key.includes('PASSWORD') || key.includes('URI') 
        ? `${value.substring(0, 10)}...` 
        : value)
    : 'NOT SET';
  
  console.log(`${status} ${key}: ${display}`);
  
  if (!value) allGood = false;
}

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('✅ All required environment variables are set!');
} else {
  console.log('❌ Some environment variables are missing!');
  console.log('\nPlease check your .env file in the backend folder.');
}

console.log('='.repeat(50) + '\n');
