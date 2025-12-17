// src/utils/sessionManager.js

const COOKIE_OPTIONS = "path=/; secure; samesite=strict";

/**
 * Set a cookie with expiration
 */
export const setCookie = (name, value, expirationDate) => {
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expirationDate.toUTCString()}; ${COOKIE_OPTIONS}`;
};

/**
 * Get cookie value
 */
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return null;
};

/**
 * Delete cookie
 */
export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * Store authentication data (1 hour session)
 */
export const storeAuth = (token) => {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 60 * 60 * 1000); // 1 hour

  // Store token & expiration in cookies
  setCookie("authToken", token, expirationDate);
  setCookie("tokenExpiration", expirationDate.getTime(), expirationDate);

  // Backup in sessionStorage (optional but useful)
  sessionStorage.setItem("authToken", token);
  sessionStorage.setItem(
    "tokenExpiration",
    expirationDate.getTime().toString()
  );
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  deleteCookie("authToken");
  deleteCookie("tokenExpiration");

  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("tokenExpiration");

  console.log("Session cleared");
};

/**
 * Check if session is still valid
 */
export const isSessionValid = () => {
  const token = getCookie("authToken");
  const expiration =
    getCookie("tokenExpiration") ||
    sessionStorage.getItem("tokenExpiration");

  if (!token || !expiration) {
    return false;
  }

  if (Date.now() > parseInt(expiration, 10)) {
    return false;
  }

  return true;
};

/**
 * Get current token
 */
export const getToken = () => {
  return (
    getCookie("authToken") ||
    sessionStorage.getItem("authToken") ||
    null
  );
};

/**
 * Setup session timeout based on actual expiration time
 */
export const setupSessionTimeout = (onTimeout) => {
  const expiration =
    getCookie("tokenExpiration") ||
    sessionStorage.getItem("tokenExpiration");

  if (!expiration) {
    clearAuth();
    onTimeout();
    return;
  }

  const remainingTime = parseInt(expiration, 10) - Date.now();

  if (remainingTime <= 0) {
    clearAuth();
    onTimeout();
    return;
  }

  return setTimeout(() => {
    clearAuth();
    onTimeout();
  }, remainingTime);
};
