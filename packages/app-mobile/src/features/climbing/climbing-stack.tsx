import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../../navigation/header';
import ClimbDetailHeader from './climb-detail-header';
import ClimbDetailScreen from './screens/climb-detail-screen';
import ClimbingScreen from './screens/climbing-screen';
import LocationDetailScreen from './screens/location-detail-screen';
import { ClimbingParamList } from './types';

const Stack = createNativeStackNavigator<ClimbingParamList>();

const ClimbingStack: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator initialRouteName="ClimbingMain">
      <Stack.Screen
        name="ClimbingMain"
        component={ClimbingScreen}
        options={{
          header: () => <Header title={t('climbing.title')} />,
        }}
      />
      <Stack.Screen
        name="LocationDetail"
        component={LocationDetailScreen}
        options={({ route }) => ({
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
          header: () => <ClimbDetailHeader />,
          presentation: 'modal',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default ClimbingStack;
