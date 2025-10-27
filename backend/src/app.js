import express from 'express';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';

// Note: dotenv is loaded in server.js before any imports

const app = express();

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

console.log('🔄 CORS Configuration:');
console.log('   Allowed Origins:', allowedOrigins);
console.log('   Environment:', process.env.NODE_ENV || 'development');

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests, or server-to-server)
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin (server-to-server or tools)');
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS: Allowing request from ${origin}`);
      return callback(null, true);
    } else {
      console.log(`❌ CORS: Blocking request from ${origin}`);
      console.log('   Allowed origins:', allowedOrigins);
      return callback(new Error(`CORS policy violation: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, // Support legacy browsers
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Attendance Backend is running! Visit /api/health for more info.',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Attendance System API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
