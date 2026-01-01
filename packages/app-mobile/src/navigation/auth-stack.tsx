import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FunctionComponent } from 'react';

import LoginScreen from '../screens/auth/login-screen';

export type AuthStackParamList = {
  Login: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack: FunctionComponent = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
