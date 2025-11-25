import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useVersion } from '@shared-react/api/version/use-version';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import ClimbingScreen from '../screens/climbing-screen';
import CreateLocationScreen from '../screens/create-location-screen';
import { ClimbingParamList } from '../types/routes';

const Stack = createNativeStackNavigator<ClimbingParamList>();

const ClimbingStack: FunctionComponent = () => {
  const { t } = useTranslation();
  const { data: version } = useVersion();

  return (
    <Stack.Navigator
      initialRouteName="ClimbingMain"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <Text style={styles.versionText}>{t('version', { version })}</Text>
        ),
      }}
    >
      <Stack.Screen
        name="ClimbingMain"
        component={ClimbingScreen}
        options={{
          title: t('climbing.title'),
        }}
      />
      <Stack.Screen
        name="CreateLocation"
        component={CreateLocationScreen}
        options={{
          title: 'Create Location',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  versionText: {
    fontSize: 11,
    color: '#fff',
    marginRight: 12,
    opacity: 0.8,
  },
});

export default ClimbingStack;
