// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

// Contact form submission
export const submitContactForm = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  return handleResponse(response);
};

// Newsletter subscription
export const subscribeToNewsletter = async (subscriptionData) => {
  const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscriptionData),
  });
  return handleResponse(response);
};

// Get all newsletter subscribers (admin only)
export const getNewsletterSubscribers = async () => {
  const response = await fetch(`${API_BASE_URL}/newsletter/subscribers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

// Generic HTTP methods for admin functionality
const get = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return { data: await handleResponse(response) };
};

const post = async (endpoint, data) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return { data: await handleResponse(response) };
};

const put = async (endpoint, data) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return { data: await handleResponse(response) };
};

// Export all API methods
const api = {
  submitContactForm,
  subscribeToNewsletter,
  getNewsletterSubscribers,
  get,
  post,
  put,
};

export default api;