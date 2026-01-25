/**
 * Utility functions for generating unique IDs
 * Uses crypto.getRandomValues for client-side and Firestore auto-ID pattern for compatibility
 */

/**
 * Generate a UUID v4
 * @returns {string} UUID v4 string
 */
export const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Generate a Firestore-style document ID
 * Mimics Firestore's auto-generated IDs: 20 random characters from [a-z0-9]
 * @returns {string} Firestore-style ID
 */
export const generateFirestoreID = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

/**
 * Generate a unique event/resource ID
 * Uses Firestore-style IDs for consistency with real data
 * @returns {string} Unique ID
 */
export const generateResourceID = () => {
  return generateFirestoreID();
};
