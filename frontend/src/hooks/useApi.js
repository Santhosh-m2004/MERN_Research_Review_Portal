import { useState } from 'react';
import axios from 'axios';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiRequest = async (method, url, data = null, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      const config = {
        method,
        url: `${process.env.REACT_APP_API_URL}${url}`,
        data,
        headers: {
          'Authorization': `Bearer ${token}`,
          ...options.headers
        },
        ...options
      };

      const response = await axios(config);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const get = (url, options = {}) => {
    return apiRequest('get', url, null, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
  };
  
  const post = (url, data, options = {}) => {
    return apiRequest('post', url, data, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
  };
  
  const postFormData = (url, data, options = {}) => {
    return apiRequest('post', url, data, options);
  };
  
  const put = (url, data, options = {}) => {
    return apiRequest('put', url, data, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
  };
  
  const del = (url, options = {}) => {
    return apiRequest('delete', url, null, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
  };

  return {
    loading,
    error,
    get,
    post,
    postFormData,
    put,
    delete: del,
    clearError: () => setError(null)
  };
};