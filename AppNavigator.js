import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import PlateScreen from './PlateScreen'; 

const SavedScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Saved</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarActiveTintColor: 'lawngreen',
            tabBarInactiveTintColor: 'gray',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
        
              if (route.name === 'Plate') {
                iconName = focused ? 'baseball-bat-ball' : 'baseball-bat-ball'; // Example: home icon for both states
                return <FontAwesome6 name={iconName} size={size} color={color} />;
              } else if (route.name === 'Saved') {
                iconName = focused ? 'bookmark' : 'bookmark-o'; // Example: solid star when focused, outline star otherwise
              }
        
              // You can return any component that you like here!
              return <FontAwesome name={iconName} size={size} color={color} />;
            },
          })}
      >
        <Tab.Screen 
          name="Plate" 
          component={PlateScreen} 
          options={{
            headerTitleAlign: 'left'
          }}/>
        <Tab.Screen name="Saved" component={SavedScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
