import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({
  // Theme methods
  isDarkTheme: false,
  setDarkTheme: () => {},
  setLightTheme: () => {},
  
  // Auth methods
  signIn: async (token) => {},
  signOut: async () => {},
  userToken: null,
  
  // Add any other shared state/methods here
});

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async (token) => {
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
    },
    signOut: async () => {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    },
    userToken,
    isDarkTheme,
    setDarkTheme: () => setIsDarkTheme(true),
    setLightTheme: () => setIsDarkTheme(false),
  };

  return (
    <ThemeContext.Provider value={authContext}>
      {!isLoading && children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;