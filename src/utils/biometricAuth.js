import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

// Check if biometric auth is available
export const isBiometricSupported = async () => {
  return await LocalAuthentication.hasHardwareAsync() && 
         await LocalAuthentication.isEnrolledAsync();
};

// Authenticate with biometrics
export const authenticateBiometrically = async () => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Login with Biometrics',
    disableDeviceFallback: false,
  });

  return result.success;
};

// Store credentials securely
export const storeCredentials = async (email, password) => {
  await SecureStore.setItemAsync('user_email', email);
  await SecureStore.setItemAsync('user_password', password);
};

// Retrieve stored credentials
export const getStoredCredentials = async () => {
  const email = await SecureStore.getItemAsync('user_email');
  const password = await SecureStore.getItemAsync('user_password');
  return { email, password };
};

// Remove stored credentials
export const clearStoredCredentials = async () => {
  await SecureStore.deleteItemAsync('user_email');
  await SecureStore.deleteItemAsync('user_password');
};