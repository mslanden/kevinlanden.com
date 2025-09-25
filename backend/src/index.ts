import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';

// Load environment variables first
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// JWT_SECRET is now required in all environments
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is required. Please set it in your .env file.');
  process.exit(1);
}

// Import error handlers
import { 
  errorHandler, 
  notFoundHandler, 
  handleUncaughtException, 
  handleUnhandledRejection 
} from './middleware/errorHandler';

// Import rate limiters
import { 
  generalLimiter, 
  ddosProtection 
} from './middleware/rateLimiter';

// Import Supabase client
import { supabase } from './utils/supabaseClient';

// Set up error handlers for uncaught exceptions
handleUncaughtException();
handleUnhandledRejection();

// Initialize Express app
const app = express();
const port = parseInt(process.env.PORT || '3001', 10);
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// Trust proxy (important for rate limiting and IP detection)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://*.supabase.co"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  crossOriginEmbedderPolicy: false // Allow images from external sources
}));

// Cookie parser middleware
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? [
          'https://kevinlandenrealestate.com',
          'https://www.kevinlandenrealestate.com',
          'https://outriderrealty.com',
          'https://www.outriderrealty.com',
          'https://kevinlanden-com.vercel.app'
        ]
      : [
          'http://localhost:3000',
          'http://127.0.0.1:3000'
        ];

    // Allow all Vercel preview deployments
    const isVercelDeployment = origin.includes('.vercel.app');
    const isAllowedOrigin = allowedOrigins.includes(origin);
    
    if (isAllowedOrigin || isVercelDeployment) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Rate limiting
app.use(ddosProtection); // Apply DDoS protection to all routes
app.use('/api/', generalLimiter); // Apply general rate limiting to API routes

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  type: 'application/json'
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Health check endpoint (no rate limiting)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Kevin Landen Real Estate API',
    version: '1.0.0',
    status: 'running',
    documentation: '/api/docs'
  });
});

// Import and use routes
import authRoutes from './routes/auth';
import propertyRoutes from './routes/properties';
import blogRoutes from './routes/blog';
import contactRoutes from './routes/contact';
import newsletterRoutes from './routes/newsletter';
import blowoutSaleRoutes from './routes/blowoutSale';
import marketDataRoutes from './routes/marketData';
import marketDataExtractRoutes from './routes/marketDataExtract';
import analyticsRoutes from './routes/analytics';
import listingsRoutes from './routes/listings';

// Authentication routes (with specific rate limiting)
app.use('/api/auth', authRoutes);

// Public routes (with general rate limiting)
app.use('/api/properties', propertyRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/blowout-sale', blowoutSaleRoutes);
app.use('/api/market-data', marketDataRoutes);
app.use('/api/market-data', marketDataExtractRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/listings', listingsRoutes);

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  
  // Stop accepting new connections
  server.close(() => {
    console.log('HTTP server closed.');
    
    // Close database connections, cleanup tasks, etc.
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Force closing server after timeout');
    process.exit(1);
  }, 10000);
};

// Start the server
const server = app.listen(port, host, () => {
  console.log(`🚀 Server is running on ${host}:${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 Security features: enabled`);
  console.log(`⚡ API Base URL: http://${host}:${port}/api`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Export for testing
export { app, supabase };