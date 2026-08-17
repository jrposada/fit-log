import { useAuth } from '@jrposada/fit-log-shared-react/contexts/auth/use-auth';
import {
  DarkTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FunctionComponent } from 'react';

import LoadingState from '../library/loading-state';
import { accent, borders, ink, surfaces } from '../library/theme';
import AuthStack from './stacks/auth/auth-stack';
import MainStack from './stacks/main/main-stack';

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: accent.primary,
    background: surfaces.page,
    card: surfaces.base,
    text: ink.primary,
    border: borders.default,
    notification: accent.primary,
  },
};

const Root: FunctionComponent = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" />
        <LoadingState isLoading style={{ backgroundColor: surfaces.page }} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style="light" />
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Root;
