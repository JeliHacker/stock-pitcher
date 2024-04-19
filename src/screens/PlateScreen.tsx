// PlateScreen.js
import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import StockSwiper from '../components/StockSwiper'; 
import { Ionicons } from '@expo/vector-icons'; 
import { PlateScreenProps } from '../types/types'; 


const PlateScreen: React.FC<PlateScreenProps> = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Stock Pitcher',
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => console.log('Filter tapped')}>
            <Ionicons name="filter" size={24} style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Settings tapped')}>
            <Ionicons name="settings" size={24} style={{ marginRight: 15 }} />
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
    paddingTop: 50, // Adjust padding as needed
  },
});

export default PlateScreen;
