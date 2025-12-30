import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import ClimbDetailScreen from '../screens/climb-detail-screen';
import ClimbingScreen from '../screens/climbing-screen';
import CreateLocationScreen from '../screens/create-location-screen';
import { ClimbingParamList } from '../types/routes';
import ClimbDetailHeader from './climb-detail-header';
import Header from './header';

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
        name="CreateLocation"
        component={CreateLocationScreen}
        options={{
          header: () => (
            <Header
              title={t('climbing.create_location_title')}
              mode="modal"
              back
            />
          ),
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="ClimbDetail"
        component={ClimbDetailScreen}
        options={{
          header: () => <ClimbDetailHeader />,
          presentation: 'fullScreenModal',
        }}
      />
    </Stack.Navigator>
  );
};

export default ClimbingStack;
