import { useAuth } from '@jrposada/fit-log-shared-react/contexts/auth/use-auth';
import {
  DarkTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import ClimbDetailScreen from '../features/climbing/screens/climb-detail-screen';
import LocationDetailScreen from '../features/climbing/screens/location-detail-screen';
import { ImagePickerScreen } from '../library/image-picker';
import LoadingState from '../library/loading-state';
import { MapPointPickerScreen } from '../library/map-point-picker';
import { accent, borders, ink, surfaces } from '../library/theme';
import { RootStackParamList } from '../types/routes';
import AuthStack from './auth-stack';
import Header from './common/header';
import ClimbLogScreen from './routes/climb-log/climb-log-screen';
import ClimbingSessionDetailScreen from './routes/climbing-session-detail/climbing-session-detail-screen';
import ProfileScreen from './routes/profile/profile-screen';
import Tabs from './tabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
  const { t } = useTranslation();
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" />
        <LoadingState isLoading style={{ backgroundColor: surfaces.page }} />
      </NavigationContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" />
        <AuthStack />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="LocationDetail"
          component={LocationDetailScreen}
          options={({ route }) => ({
            headerShown: true,
            header: () => (
              <Header
                title={
                  route.params?.locationId
                    ? t('climbing.update_location_title')
                    : t('climbing.create_location_title')
                }
                mode="modal"
                back
              />
            ),
            presentation: 'modal',
          })}
        />
        <Stack.Screen
          name="ClimbDetail"
          component={ClimbDetailScreen}
          options={{
            presentation: 'modal',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="ClimbLog"
          component={ClimbLogScreen}
          options={{
            headerShown: true,
            header: () => <Header title={t('climbing.title')} back />,
          }}
        />
        <Stack.Screen
          name="ClimbingSessionDetail"
          component={ClimbingSessionDetailScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="MapPointPicker"
          component={MapPointPickerScreen}
          options={{
            headerShown: true,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="ImagePicker"
          component={ImagePickerScreen}
          options={{
            headerShown: true,
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Root;
