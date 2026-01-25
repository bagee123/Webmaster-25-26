import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import resourcesData from '../data/resources';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export const ResourceContext = createContext();

export function ResourceProvider({ children }) {
  const [resources, setResources] = useState(resourcesData);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [savedItems, setSavedItems] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const { user, authInitialized } = useAuth();

  const loadUserData = async (uid) => {
    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setSavedItems(userData.savedItems || []);
        setUserEvents(userData.userEvents || []);
      } else {
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
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  // Load resources from Firestore on mount, with local data fallback
  useEffect(() => {
    if (!authInitialized) return; // Wait for auth to initialize

    setResourcesLoading(true);
    try {
      const resourcesCollection = collection(db, 'resources');
      const q = query(resourcesCollection, orderBy('id', 'asc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (snapshot.docs.length > 0) {
          // Firestore has data
          const firebaseResources = snapshot.docs.map(doc => ({
            id: doc.data().id,
            ...doc.data(),
          }));
          setResources(firebaseResources);
        } else {
          // Fall back to local data if Firestore is empty
          setResources(resourcesData);
        }
        setResourcesLoading(false);
      }, (error) => {
        // If Firestore fails, use local data
        console.warn('Failed to load from Firestore, using local data:', error);
        setResources(resourcesData);
        setResourcesLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      // Fall back to local data on error
      console.warn('Error setting up Firestore listener:', error);
      setResources(resourcesData);
      setResourcesLoading(false);
    }
  }, [authInitialized]);

  // Load saved items and user events from Firestore
  useEffect(() => {
    if (user?.uid) {
      loadUserData(user.uid);
    } else {
      setSavedItems([]);
      setUserEvents([]);
    }
  }, [user?.uid]); // Use user?.uid instead of user to avoid dependency on entire user object

  const toggleSavedItem = async (resourceId) => {
    try {
      if (!user?.uid) {
        return;
      }

      // Convert ID to number for consistency
      const id = Number(resourceId);
      const isSaved = savedItems.includes(id);
      const newSavedItems = isSaved 
        ? savedItems.filter(itemId => itemId !== id)
        : [...savedItems, id];
      
      // Update state immediately for UI feedback
      setSavedItems(newSavedItems);
      
      // Use setDoc with merge to create doc if it doesn't exist or update if it does
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { savedItems: newSavedItems }, { merge: true });
      
    } catch {
      // Reload from Firebase to ensure consistency
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
    } catch {
      // Silent fail
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
      resourcesLoading,
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
