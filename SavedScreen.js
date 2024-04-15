// SavedScreen.js
import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSavedStocks } from './SavedStocksContext'; // Adjust the path as necessary
import { Ionicons } from '@expo/vector-icons'; 

const SavedScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Watchlist',
      headerTitleStyle: {
        fontSize: 24, 
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
