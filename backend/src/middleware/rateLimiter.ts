import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Custom rate limit exceeded handler
const rateLimitHandler = (req: Request, res: Response): void => {
  const retryAfter = Math.round(Date.now() / 1000) + 900; // 15 minutes from now
  
  res.status(429).json({
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again later.',
    retryAfter: retryAfter
  });
};

// Skip rate limiting for certain conditions
const skipRateLimit = (req: Request): boolean => {
  // Skip rate limiting in test environment
  if (process.env.NODE_ENV === 'test') {
    return true;
  }

  // Skip for localhost in development
  if (process.env.NODE_ENV === 'development' && 
      (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip?.includes('localhost'))) {
    return true;
  }

  return false;
};

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: rateLimitHandler,
  skip: skipRateLimit
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: skipRateLimit,
  // Slower recovery for auth endpoints
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Contact form rate limiter
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 contact submissions per hour
  message: 'Too many contact form submissions. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: skipRateLimit
});

// Newsletter signup rate limiter
export const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 newsletter signups per hour
  message: 'Too many newsletter signup attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: skipRateLimit
});

// Admin operations rate limiter (more permissive for authenticated admins)
export const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 admin requests per minute
  message: 'Too many admin operations. Please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: skipRateLimit
});

// Search/filtering rate limiter (more permissive)
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 search requests per minute
  message: 'Too many search requests. Please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: skipRateLimit
});

// File upload rate limiter (if needed in future)
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: 'Too many file uploads. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: skipRateLimit
});

// Progressive rate limiter - increases restrictions for repeated violations
class ProgressiveRateLimiter {
  private violations: Map<string, { count: number; lastViolation: Date }> = new Map();
  private readonly maxViolations = 3;
  private readonly violationWindow = 60 * 60 * 1000; // 1 hour

  getMultiplier(ip: string): number {
    const violation = this.violations.get(ip);
    
    if (!violation) return 1;
    
    // Clean up old violations
    if (Date.now() - violation.lastViolation.getTime() > this.violationWindow) {
      this.violations.delete(ip);
      return 1;
    }
    
    // Return multiplier based on violation count
    return Math.min(violation.count + 1, 5);
  }

  recordViolation(ip: string): void {
    const existing = this.violations.get(ip);
    
    if (existing) {
      existing.count++;
      existing.lastViolation = new Date();
    } else {
      this.violations.set(ip, {
        count: 1,
        lastViolation: new Date()
      });
    }
  }

  createLimiter(baseMax: number, windowMs: number) {
    return rateLimit({
      windowMs,
      max: (req: Request) => {
        const multiplier = this.getMultiplier(req.ip || '');
        return Math.max(1, Math.floor(baseMax / multiplier));
      },
      handler: (req: Request, res: Response) => {
        this.recordViolation(req.ip || '');
        rateLimitHandler(req, res);
      },
      skip: skipRateLimit
    });
  }
}

// Create progressive limiter for critical endpoints
const progressiveLimiter = new ProgressiveRateLimiter();

export const criticalLimiter = progressiveLimiter.createLimiter(10, 15 * 60 * 1000);

// DDoS protection - very strict limiter for suspicious activity
export const ddosProtection = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Suspicious activity detected. Access temporarily restricted.',
  standardHeaders: false,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`Potential DDoS attack from IP: ${req.ip}, URL: ${req.url}, User-Agent: ${req.get('User-Agent')}`);
    
    res.status(429).json({
      error: 'Access Restricted',
      message: 'Suspicious activity detected. Please contact support if you believe this is an error.'
    });
  },
  skip: skipRateLimit
});