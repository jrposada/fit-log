import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import BoulderEditorScreen from './src/screens/boulder-editor-screen';
import HomeScreen from './src/screens/home-screen';
import ImagePickerScreen from './src/screens/image-picker-screen';
import { RootStackParamList } from './src/types/boulder';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Bouldering App' }}
        />
        <Stack.Screen 
          name="ImagePicker" 
          component={ImagePickerScreen}
          options={{ title: 'Select Image' }}
        />
        <Stack.Screen 
          name="BoulderEditor" 
          component={BoulderEditorScreen}
          options={{ title: 'Create Boulder' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
