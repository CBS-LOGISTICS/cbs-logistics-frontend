import { createApi } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import { tagTypes } from './tagTypes';

// Define types for the base query
interface BaseQueryArgs {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

// Create axios instance
const axiosInstance = axios.create({
  baseURL: '/api', // Use relative path for same-origin API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies for authentication
});

// No Authorization header logic needed for cookie-based auth

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, etc.)
    // Optionally handle unauthorized access here
    return Promise.reject(error);
  }
);

// Custom axios base query
const axiosBaseQuery = () => async ({ url, method, data, params, headers }: BaseQueryArgs) => {
  try {
    const result = await axiosInstance({
      url,
      method,
      data,
      params,
      headers,
    });
    return { data: result.data };
  } catch (axiosError: unknown) {
    const error = axiosError as { response?: { status?: number; data?: unknown }; message?: string };
    return {
      error: {
        status: error.response?.status,
        data: error.response?.data || error.message,
      },
    };
  }
};

// Create the API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: Object.values(tagTypes),
  endpoints: () => ({}),
});

// Export the axios instance for direct use if needed
export { axiosInstance }; 