import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import resourcesData from '../data/resources';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../build/auth';

export const ResourceContext = createContext();

export function ResourceProvider({ children }) {
  const [resources] = useState(resourcesData);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [savedItems, setSavedItems] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadUserData = async (uid) => {
    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', uid);
      console.log('Fetching user data from Firebase:', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User document found, data:', userData);
        setSavedItems(userData.savedItems || []);
        setUserEvents(userData.userEvents || []);
      } else {
        console.log('User document does not exist, creating new one');
        // Create user doc if it doesn't exist - use merge to not overwrite
        await setDoc(userDocRef, {
          email: user?.email || '',
          savedItems: [],
          userEvents: [],
          createdAt: new Date(),
        }, { merge: true });
        setSavedItems([]);
        setUserEvents([]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load saved items and user events from Firestore
  useEffect(() => {
    if (user?.uid) {
      console.log('User logged in, loading data:', user.uid);
      loadUserData(user.uid);
    } else {
      console.log('User not logged in, clearing data');
      setSavedItems([]);
      setUserEvents([]);
    }
  }, [user?.uid]); // Use user?.uid instead of user to avoid dependency on entire user object

  const toggleSavedItem = async (resourceId) => {
    try {
      if (!user?.uid) {
        console.warn('Cannot save - user not authenticated');
        return;
      }

      // Convert ID to number for consistency
      const id = Number(resourceId);
      const isSaved = savedItems.includes(id);
      const newSavedItems = isSaved 
        ? savedItems.filter(itemId => itemId !== id)
        : [...savedItems, id];
      
      console.log('Toggling saved item:', { id, isSaved, newSavedItems, userId: user.uid });
      
      // Update state immediately for UI feedback
      setSavedItems(newSavedItems);
      
      // Use setDoc with merge to create doc if it doesn't exist or update if it does
      const userDocRef = doc(db, 'users', user.uid);
      console.log('Saving to Firebase with setDoc merge:', { savedItems: newSavedItems });
      await setDoc(userDocRef, { savedItems: newSavedItems }, { merge: true });
      console.log('Successfully persisted to Firebase');
      
    } catch (error) {
      console.error('Error toggling saved item:', error.message, error.code);
      // Reload from Firebase to ensure consistency
      console.log('Error occurred, reloading data from Firebase');
      if (user?.uid) {
        loadUserData(user.uid);
      }
    }
  };

  const toggleUserEvent = async (eventId) => {
    try {
      const isSignedUp = userEvents.includes(eventId);
      const newUserEvents = isSignedUp
        ? userEvents.filter(id => id !== eventId)
        : [...userEvents, eventId];
      
      setUserEvents(newUserEvents);
      
      if (user?.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        // Use setDoc with merge to create doc if it doesn't exist
        await setDoc(userDocRef, { userEvents: newUserEvents }, { merge: true });
      }
    } catch (error) {
      console.error('Error toggling user event:', error);
    }
  };

  const getSavedResources = () => {
    return resources.filter(resource => savedItems.includes(Number(resource.id)));
  };

  return (
    <ResourceContext.Provider value={{
      resources,
      allResources: resources,
      search,
      setSearch,
      sort,
      setSort,
      savedItems,
      toggleSavedItem,
      getSavedResources,
      userEvents,
      toggleUserEvent,
      loading,
    }}>
      {children}
    </ResourceContext.Provider>
  );
}

ResourceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useResources = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
};
