'use client';

export const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('fable_token') : null;

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('fable_user') || 'null');
  } catch {
    return null;
  }
};

export const setAuth = (token, user) => {
  localStorage.setItem('fable_token', token);
  localStorage.setItem('fable_user', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('fable_token');
  localStorage.removeItem('fable_user');
};

export const isAuthenticated = () => !!getToken();
