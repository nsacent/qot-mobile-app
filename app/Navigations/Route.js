import React, { useState, useContext, useMemo } from "react";
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import themeContext from "../constants/themeContext";
import { COLORS } from "../constants/theme";
import { AuthContext } from "../contexts/AuthProvider";
import { navigationRef } from "../../src/navigation/navigationRef";

// NEW: Import conditional navigators
import AppStack from "../Screens/AppStack";
import AuthStack from "../Screens/AuthStack";

const Routes = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { userToken, isLoading } = useContext(AuthContext);

  const themeContextValue = useMemo(() => ({
    setDarkTheme: () => setIsDarkTheme(true),
    setLightTheme: () => setIsDarkTheme(false),
    isDarkTheme,
    userToken
  }), [isDarkTheme, userToken]);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      background: COLORS.background,
      title: COLORS.title,
      card: COLORS.card,
      text: COLORS.text,
      textLight: COLORS.textLight,
      input: COLORS.input,
      borderColor: COLORS.borderColor,
      border: "rgba(18,9,46,.1)",
    }
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      background: COLORS.darkBackground,
      title: COLORS.darkTitle,
      card: COLORS.darkCard,
      text: COLORS.darkText,
      textLight: COLORS.darkTextLight,
      input: COLORS.darkInput,
      borderColor: COLORS.darkBorder,
      border: "rgba(255,255,255,.1)",
    }
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  if (isLoading) return null; // or a splash screen while checking token

  return (
    <SafeAreaProvider>
      <themeContext.Provider value={themeContextValue}>
        <NavigationContainer ref={navigationRef} theme={theme}>
          {userToken ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
      </themeContext.Provider>
    </SafeAreaProvider>
  );
};

export default Routes;
