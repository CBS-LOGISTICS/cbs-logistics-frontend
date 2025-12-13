import { createApi } from '@reduxjs/toolkit/query/react';
import { tagTypes } from './tagTypes';

// Define types for the base query
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  Method
} from 'axios';
import { getPreloadedState } from './getPreloadedState';

axios.interceptors.request.use(
  async (config) => {
    const token = getPreloadedState().auth.access_token;
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const axiosBaseQuery =
  ({
    baseUrl = '',
    baseHeaders = {},
  }: {
    baseUrl: string;
    baseHeaders?: AxiosRequestConfig['headers'];
  }): BaseQueryFn<
    {
      url: string;
      method: Method;
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    any,
    unknown
  > =>
    async ({ url, method, data, params, headers = {} }) => {
      try {
        const result = await axios({
          url: baseUrl + url,
          method,
          params,
          data,
          headers: { ...baseHeaders, ...headers },
        });
        return { data: result.data };
      } catch (axiosError) {
        const err = axiosError as AxiosError;
        return {
          error: {
            status: err.response?.status,
            error: err.message,
            ...(typeof err.response?.data === 'object' ? err.response.data : {}),
          },
        };
      }
    };


// Create the API slice
export const baseApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: '/api/',
    baseHeaders: {
      'Content-Type': 'application/json',
    },
  }),
  tagTypes: Object.values(tagTypes),
  endpoints: () => ({}),
});
