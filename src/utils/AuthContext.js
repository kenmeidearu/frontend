import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    // Setup axios interceptors
    const requestInterceptor = axios.interceptors.request.use(config => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.log('No token found');
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  const saveToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, saveToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
