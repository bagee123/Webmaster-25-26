import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    // Listen to auth state changes - this persists across page refreshes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      setAuthInitialized(true);
    }, (error) => {
      // Handle auth errors
      console.error('Auth state error:', error);
      setLoading(false);
      setAuthInitialized(true);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (displayName, photoURL = null) => {
    if (!user) throw new Error('No user logged in');
    try {
      await updateProfile(user, {
        displayName,
        photoURL,
      });
      // Update local state
      setUser({
        ...user,
        displayName,
        photoURL,
      });
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    authInitialized,
    isAuthenticated: !!user,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
