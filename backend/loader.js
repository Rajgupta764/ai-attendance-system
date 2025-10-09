// Load environment variables before anything else
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config({ path: path.join(__dirname, '.env') });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully');
console.log(`📍 Loaded from: ${path.join(__dirname, '.env')}`);
console.log('🔑 Cloudinary Config Check:');
console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY}`);
console.log(`   API Secret: ${process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'NOT SET'}`);

// Use dynamic import to ensure env vars are loaded first
await import('./src/server.js');
