import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const user = await AsyncStorage.getItem('userData');

        setUserToken(token);
        setUserData(user ? JSON.parse(user) : null);
      } catch (error) {
        console.error('Error loading auth state', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  const authContext = {
    signIn: async (token, userProfile) => {
      try {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(userProfile));
        setUserToken(token);
        setUserData(userProfile);
      } catch (error) {
        console.error('Error saving token or user data', error);
      }
    },

    signOut: async () => {
      console.log('Signing out...');

      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        setUserToken(null);
        setUserData(null);
        
      } catch (error) {
        console.error('Error removing auth state', error);
      }
    },

    userToken,
    userData,
    isLoading,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
