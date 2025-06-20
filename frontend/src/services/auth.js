// src/services/auth.js
export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  
  export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };