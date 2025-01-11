import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { lightTheme } from './src/theme/lightTheme';
import HomeScreen from './src/screen/HomeScreen';
import DocumentScreen from './src/screen/DocumentScreen';
import SettingsScreen from './src/screen/SettingsScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import LikedNotesScreen from './src/screen/LikedNotesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Notes Stack Navigator
const NotesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Document" component={DocumentScreen} />
  </Stack.Navigator>
);

// Main Tabs
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Notes') {
            iconName = 'book-outline';
          } else if (route.name === 'Liked') {
            iconName = 'heart-outline';
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Notes" component={NotesStack} />
      <Tab.Screen name="Liked" component={LikedNotesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />

    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer theme={lightTheme}>
      <MainTabs />
    </NavigationContainer>
  );
};

export default App;
