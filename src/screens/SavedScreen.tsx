// SavedScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useSavedStocks } from '../contexts/SavedStocksContext'; 

const SavedScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text>📋 Watchlist</Text>,
      title: 'Watchlist',
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => console.log('Settings tapped')}>
            <Ionicons name="settings" size={24} style={{ marginRight: 15 }} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const { savedStocks } = useSavedStocks();
  const [stockPrices, setStockPrices] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      let newStockPrices = {};
      for (const stock of savedStocks) {
        const url = `http://api.codefit.lol/stocks/${stock.symbol}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          const timeSeries = data['Time Series (5min)'];
          if (data && data.last_sale) {
            newStockPrices[stock.symbol] = parseFloat(data.last_sale).toFixed(2);
          }
        } catch (error) {
          console.error('Error fetching stock data for', stock.symbol, ':', error);
        }
      }
      setStockPrices(newStockPrices);
      setLoading(false);
    };

    if (savedStocks.length > 0) {
      fetchPrices();
    }
  }, [savedStocks]); // Rerun effect when savedStocks changes

  const renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        <View style={styles.leftContainer}>
          <Text style={styles.ticker}>{item.symbol}</Text>
          <Text style={styles.companyName}>{item.name}</Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.price}>${stockPrices[item.symbol] || '...'}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedStocks}
        keyExtractor={(item, index) => item.symbol + index}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#303030', // Slightly lighter color for the line
  },
  leftContainer: {
    // If you need to add styles for the left container
  },
  ticker: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  companyName: {
    fontSize: 14,
    color: '#a9a9a9', // Grey color for the text
  },
  rightContainer: {
    // If you need to add styles for the right container
    alignItems: 'flex-end', // Aligns price to the right
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000', // White color for the price
  },
});

export default SavedScreen;
