// For MVP, we'll use a simplified authentication approach without Firebase Admin
// This can be enhanced later with proper Firebase Admin SDK integration

// Mock verification - in a real app, this would verify with Firebase Admin
export const verifyToken = async (token: string) => {
  if (!token) return null;
  
  try {
    // For now, we'll just return a simple object with the token
    // Later this would be replaced with actual token verification
    return {
      uid: 'user-' + Math.floor(Math.random() * 1000),
      email: 'user@example.com',
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

// Export a dummy app for compatibility
const dummyApp = { name: 'firebase-app-mock' };
export default dummyApp;

// No-op auth and firestore for compatibility
export const auth = {
  verifyIdToken: verifyToken,
};

export const firestore = {
  collection: () => ({
    doc: () => ({
      get: async () => ({ exists: false, data: () => ({}) }),
      set: async () => ({}),
    }),
  }),
};
