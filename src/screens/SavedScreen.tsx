// SavedScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useSavedStocks } from '../contexts/SavedStocksContext'; 
import SettingsModal from '../components/SettingsModal';
import { SavedScreenProps, Stock } from '../types/types';
import { Swipeable } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const SavedScreen: React.FC<SavedScreenProps> = ({ navigation }) => {
  const { removeStock } = useSavedStocks();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    stock: Stock
  ): React.ReactNode => {
    const translateX = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });
  
    const onPress = () => {
      removeStock(stock.symbol)
    };
    return (
      <Animated.View style={[styles.deleteButton, { transform: [{ translateX }] }]}>
        <TouchableOpacity onPress={onPress} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

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
        const url = `https://api.codefit.lol/stocks/${stock.symbol}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data && data.last_sale) {
            newStockPrices[stock.symbol] = parseFloat(data.last_sale).toFixed(2);
          }
        } catch (error) {
          console.error('Error fetching stock data for', stock.symbol, ':', error, typeof(error),);
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
      <Swipeable
        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
      >
        <View style={styles.row}>
          <View style={styles.leftContainer}>
            <Text style={styles.ticker}>{item.symbol}</Text>
            <Text style={styles.companyName} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.price}>${stockPrices[item.symbol] || '...'}</Text>
          </View>
        </View>
      </Swipeable>
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
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default SavedScreen;
