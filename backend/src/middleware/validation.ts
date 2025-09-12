import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Common validation patterns
const emailPattern = Joi.string()
  .email()
  .max(255)
  .required();

const namePattern = Joi.string()
  .min(1)
  .max(100)
  .pattern(/^[a-zA-Z\s'-]+$/)
  .required();

const phonePattern = Joi.string()
  .pattern(/^[\+]?[1-9][\d]{0,15}$/)
  .optional();

const textPattern = Joi.string()
  .min(1)
  .max(5000)
  .required();

const urlPattern = Joi.string()
  .uri()
  .max(500)
  .optional();

// Validation schemas
export const schemas = {
  // Contact form validation
  contactSubmission: Joi.object({
    name: namePattern,
    email: emailPattern,
    phone: phonePattern.allow(''),
    subject: Joi.string().min(1).max(200).required(),
    message: textPattern,
    leadType: Joi.string()
      .valid('buyer', 'seller', 'renter', 'investor', 'general')
      .default('buyer')
  }),

  // Newsletter subscription validation
  newsletterSubscription: Joi.object({
    name: namePattern,
    email: emailPattern,
    community: Joi.string()
      .valid('anza', 'aguanga', 'idyllwild', 'mountain-center')
      .required()
  }),

  // Property filtering validation
  propertyFilter: Joi.object({
    type: Joi.string()
      .valid('ranch', 'farm', 'country-home', 'land', 'luxury', 'mountain')
      .optional(),
    minPrice: Joi.number().min(0).max(100000000).optional(),
    maxPrice: Joi.number().min(0).max(100000000).optional(),
    bedrooms: Joi.number().min(0).max(20).optional(),
    bathrooms: Joi.number().min(0).max(20).optional(),
    minAcreage: Joi.number().min(0).max(10000).optional(),
    maxAcreage: Joi.number().min(0).max(10000).optional(),
    location: Joi.string()
      .max(100)
      .pattern(/^[a-zA-Z0-9\s,.-]+$/)
      .optional(),
    featured: Joi.boolean().optional(),
    status: Joi.string()
      .valid('available', 'pending', 'sold')
      .optional(),
    page: Joi.number().min(1).max(1000).default(1),
    limit: Joi.number().min(1).max(100).default(20)
  }),

  // Property creation/update validation
  property: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: textPattern,
    type: Joi.string()
      .valid('ranch', 'farm', 'country-home', 'land', 'luxury', 'mountain')
      .required(),
    price: Joi.number().min(0).max(100000000).required(),
    bedrooms: Joi.number().min(0).max(50).optional(),
    bathrooms: Joi.number().min(0).max(50).optional(),
    square_feet: Joi.number().min(0).max(1000000).optional(),
    acreage: Joi.number().min(0).max(10000).optional(),
    location: Joi.string().min(1).max(200).required(),
    address: Joi.string().max(300).optional(),
    city: Joi.string().min(1).max(100).required(),
    state: Joi.string().length(2).pattern(/^[A-Z]{2}$/).required(),
    zip_code: Joi.string().pattern(/^\d{5}(-\d{4})?$/).optional(),
    featured: Joi.boolean().default(false),
    status: Joi.string()
      .valid('available', 'pending', 'sold')
      .default('available'),
    main_image_url: urlPattern
  }),

  // Blog post validation
  blogPost: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    content: textPattern,
    excerpt: Joi.string().max(500).optional(),
    author: namePattern,
    category: Joi.string().min(1).max(100).required(),
    image_url: urlPattern,
    published: Joi.boolean().default(true),
    featured: Joi.boolean().default(false)
  }),

  // Blowout sale update validation
  blowoutSaleUpdate: Joi.object({
    total_spots: Joi.number().min(1).max(1000).optional(),
    spots_remaining: Joi.number().min(0).max(1000).optional(),
    is_active: Joi.boolean().optional()
  }).custom((value, helpers) => {
    // Ensure spots_remaining <= total_spots
    if (value.spots_remaining !== undefined && value.total_spots !== undefined) {
      if (value.spots_remaining > value.total_spots) {
        return helpers.error('any.custom', {
          message: 'spots_remaining cannot be greater than total_spots'
        });
      }
    }
    return value;
  }),

  // Authentication validation
  login: Joi.object({
    email: emailPattern,
    password: Joi.string().min(8).max(128).required()
  }),

  // User registration validation
  register: Joi.object({
    name: namePattern,
    email: emailPattern,
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      }),
    role: Joi.string().valid('admin', 'user').default('user')
  }),

  // Pagination validation
  pagination: Joi.object({
    page: Joi.number().min(1).max(1000).default(1),
    limit: Joi.number().min(1).max(100).default(20),
    sort: Joi.string()
      .valid('created_at', 'updated_at', 'title', 'price', 'name')
      .default('created_at'),
    order: Joi.string().valid('asc', 'desc').default('desc')
  })
};

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      res.status(400).json({
        error: 'Validation failed',
        message: 'Request data is invalid',
        details: errors
      });
      return;
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Query parameter validation middleware
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      res.status(400).json({
        error: 'Query validation failed',
        message: 'Query parameters are invalid',
        details: errors
      });
      return;
    }

    // Replace req.query with validated data
    req.query = value;
    next();
  };
};

// Sanitization helpers
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeForDb = (obj: any): any => {
  if (typeof obj === 'string') {
    return obj.trim();
  } else if (Array.isArray(obj)) {
    return obj.map(sanitizeForDb);
  } else if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeForDb(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
};