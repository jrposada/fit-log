import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { ImagePickerScreen } from '../../../library/image-picker';
import { MapPointPickerScreen } from '../../../library/map-point-picker';
import { Model3dPickerScreen } from '../../../library/model-3d-picker';
import { RootStackParamList } from '../../../types/routes';
import Header from '../../common/header';
import ClimbDetailScreen from './routes/climb-detail/climb-detail-screen';
import ClimbLogScreen from './routes/climb-log/climb-log-screen';
import LocationDetailScreen from './routes/location-detail/location-detail-screen';
import ProfileScreen from './routes/profile/profile-screen';
import TabsStack from './routes/tabs/tabs-stack';
import TrainingSessionsDetailScreen from './routes/training-sessions-detail/training-sessions-detail-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainStack: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabsStack} />
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
        name="TrainingSessionsDetail"
        component={TrainingSessionsDetailScreen}
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
      <Stack.Screen
        name="Model3dPicker"
        component={Model3dPickerScreen}
        options={{
          headerShown: true,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
