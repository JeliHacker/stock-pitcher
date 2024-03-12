// PlateScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import StockSwiper from './StockSwiper'; // Adjust the path as necessary

const PlateScreen = () => {
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
