// SavedScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSavedStocks } from '../contexts/SavedStocksContext'; // Adjust the path as necessary

const SavedScreen = () => {
  const { savedStocks } = useSavedStocks();

  return (
    <View style={styles.container}>
      <FlatList
        data={savedStocks}
        keyExtractor={(item, index) => item.symbol + index}
        renderItem={({ item }) => (
          <Text style={styles.stockItem}>{item.symbol} - {item.name}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  stockItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
});

export default SavedScreen;
