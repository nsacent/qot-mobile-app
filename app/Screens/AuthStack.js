import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthStack;
