import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import PlateScreen from './src/screens/PlateScreen'; 
import SavedScreen from './src/screens/SavedScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarActiveTintColor: 'limegreen',
            tabBarInactiveTintColor: 'gray',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
        
              if (route.name === 'Plate') {
                iconName = focused ? 'baseball-bat-ball' : 'baseball-bat-ball'; // Example: home icon for both states
                return <FontAwesome6 name={iconName} size={size} color={color} />;
              } else if (route.name === 'Saved') {
                iconName = focused ? 'bookmark' : 'bookmark-o'; // Example: solid star when focused, outline star otherwise
              }
        
              return <FontAwesome name={iconName} size={size} color={color} />;
            },
          })}
      >
        <Tab.Screen 
          name="Plate" 
          component={PlateScreen} 
          options={{
            headerTitleAlign: 'left'
          }}
        />
        <Tab.Screen 
          name="Saved" 
          component={SavedScreen} 
          options={{
            headerTitleAlign: 'left'
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
