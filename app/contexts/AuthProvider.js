import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../src/services/api';

// Create a global auth context
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);   // Token from API
  const [userData, setUserData] = useState(null);     // User profile info
  const [isLoading, setIsLoading] = useState(true);   // Show splash/loading screen

  // Load token and user info from storage on app launch
  useEffect(() => {
  const loadAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userData');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (token) {
        // ✅ Optionally set token headers globally if you're using Axios
        api.defaults.headers.common['Authorization'] = token;


        // 🔄 Sync user profile with server
        const res = await api.get(`/users/${parsedUser.id}`); // or '/me'

        console.log(res);
        const freshUser = res.data?.result;

        // Save updated data
        setUserToken(token);
        setUserData(freshUser);
        await AsyncStorage.setItem('userData', JSON.stringify(freshUser));
      } else {
        setUserToken(null);
        setUserData(null);
      }
    } catch (error) {
      console.error('Error loading/syncing auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  loadAuthState();
}, []);


  // Sign in: Save token & user to state and AsyncStorage
  const signIn = async (token, userProfile) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userProfile));
      setUserToken(token);
      setUserData(userProfile);
    } catch (err) {
      console.error('⚠️ Error saving auth state:', err);
    }
  };

  // Sign out: Remove token & user from state and storage
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setUserToken(null);
      setUserData(null);
    } catch (err) {
      console.error('⚠️ Error clearing auth state:', err);
    }
  };

  // Update only user data (e.g., after profile update)
  const updateUserData = async (newUserData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
      setUserData(newUserData);
    } catch (err) {
      console.error('⚠️ Error updating user data:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userData,
        isLoading,
        signIn,
        signOut,
        updateUserData,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
