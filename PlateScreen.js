// PlateScreen.js
import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import StockSwiper from './StockSwiper'; 
import { Ionicons } from '@expo/vector-icons'; 

const PlateScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Stock Pitcher',
      headerTitleStyle: {
        fontSize: 24, // Adjust the font size as needed
        // You can also add other styling properties here
      },
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity 
            onPress={() => console.log('Filter tapped')}
          >
            <Ionicons name="filter" size={44} style={{ marginHorizontal: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Settings tapped')}>
            <Ionicons name="settings" size={44} style={{ marginHorizontal: 15 }} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <StockSwiper />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0, // Adjust padding as needed
    backgroundColor: 'pink'
  },
});

export default PlateScreen;
