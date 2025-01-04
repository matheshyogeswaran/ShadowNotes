import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { lightTheme } from './src/theme/lightTheme';
import { darkTheme } from './src/theme/darkTheme';
import HomeScreen from './src/screen/HomeScreen';
import DocumentScreen from './src/screen/DocumentScreen';
import Icon from 'react-native-vector-icons/Ionicons'; // Using Ionicons for a different icon

// Create Stack Navigator and Tab Navigator
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder components for tabs
const LikedNotesScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Liked Notes Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Settings Screen</Text>
  </View>
);

// New Profile Screen
const ProfileScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Profile Screen</Text>
  </View>
);

// Notes Stack Navigator
const NotesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Document" component={DocumentScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Assign icons based on route name
          if (route.name === 'Notes') {
            iconName = 'book-outline'; // New icon for Notes Tab (Ionicons)
          } else if (route.name === 'Liked') {
            iconName = 'heart-outline'; // Icon for Liked Notes Tab
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline'; // Icon for Settings Tab
          } 
          else if (route.name === 'Profile') {
            iconName = 'person-outline'; // Icon for Profile Tab
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
      {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
};

// App Component
const App = () => {
  return (
    <NavigationContainer theme={lightTheme}>
      <MainTabs />
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
