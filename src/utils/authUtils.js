// src/utils/authUtils.js

import { jwtDecode } from 'jwt-decode';

export const getIsAdminFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return 0;

  try {
    const decoded = jwtDecode(token);
    return decoded.isAdmin;
  } catch (error) {
    console.error('Error decoding token:', error);
    return 0;
  }
};
