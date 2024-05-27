// SavedScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useSavedStocks } from '../contexts/SavedStocksContext'; 
import SettingsModal from '../components/SettingsModal';
import { SavedScreenProps, Stock } from '../types/types';

const SavedScreen: React.FC<SavedScreenProps> = ({ navigation }) => {
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={{ fontSize: 16 }}>📋 Watchlist</Text>,
      title: 'Watchlist',
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => setSettingsModalVisible(true)}>
            <Ionicons name="settings" size={24} style={{ marginRight: 15 }} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  interface StockPrices {
    [symbol: string]: string;
  }

  const { savedStocks } = useSavedStocks();
  const [stockPrices, setStockPrices] = useState<StockPrices>({});
  const [loading, setLoading] = useState(false);
   
  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      let newStockPrices: StockPrices = {};
      for (const stock of savedStocks) {
        const url = `http://api.codefit.lol/stocks/${stock.symbol}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
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

  const renderItem = ({ item }: { item: Stock }) => {
    return (
      <View style={styles.row}>
        <View style={styles.leftContainer}>
          <Text style={styles.ticker}>{item.symbol}</Text>
          <Text style={styles.companyName} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
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
      <SettingsModal
          visible={settingsModalVisible}
          onClose={() => setSettingsModalVisible(false)}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 3,
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
    flex: 1,
    alignItems: 'flex-end', // Aligns price to the right
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000', // White color for the price
  },
});

export default SavedScreen;
