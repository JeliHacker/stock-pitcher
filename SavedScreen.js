// SavedScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSavedStocks } from './SavedStocksContext'; // Adjust the path as necessary

const SavedScreen = () => {
  const { savedStocks } = useSavedStocks();

  return (
    <View style={styles.container}>
      <FlatList
        data={savedStocks}
        keyExtractor={(item, index) => item.text + index}
        renderItem={({ item }) => (
          <Text style={styles.stockItem}>{item.text}</Text>
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
