import { useAuth } from '@jrposada/fit-log-shared-react/contexts/auth/use-auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import AuthStack from '../features/auth/auth-stack';
import ClimbDetailScreen from '../features/climbing/screens/climb-detail-screen';
import ClimbLogScreen from '../features/climbing/screens/climb-log-screen';
import ClimbingSessionDetailScreen from '../features/climbing/screens/climbing-session-detail-screen';
import LocationDetailScreen from '../features/climbing/screens/location-detail-screen';
import ProfileScreen from '../features/profile/profile-screen';
import { ImagePickerScreen } from '../library/image-picker';
import LoadingState from '../library/loading-state';
import { MapPointPickerScreen } from '../library/map-point-picker';
import { surfaces } from '../library/theme';
import { RootStackParamList } from '../types/routes';
import Header from './common/header';
import Tabs from './tabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Root: FunctionComponent = () => {
  const { t } = useTranslation();
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <NavigationContainer>
        <StatusBar style="auto" />
        <LoadingState isLoading style={{ backgroundColor: surfaces.page }} />
      </NavigationContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <StatusBar style="auto" />
        <AuthStack />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
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
