// SavedStocksContext.js
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Stock } from '../types/types'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SavedStocksContextType {
  savedStocks: Stock[];
  saveStock: (stock: Stock) => void;
  removeStock: (stockId: string) => void; // Added method to remove a stock
}

const SavedStocksContext = createContext<SavedStocksContextType | undefined>(undefined);

export const useSavedStocks = () => {
  const context = useContext(SavedStocksContext);
  if (!context) {
    throw new Error('useSavedStocks must be used within a SavedStocksProvider');
  }
  return context;
};

interface SavedStocksProviderProps {
  children: ReactNode;
}

export const SavedStocksProvider: React.FC<SavedStocksProviderProps> = ({ children }) => {
  const [savedStocks, setSavedStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const loadSavedStocks = async () => {
      const stocksData = await AsyncStorage.getItem('savedStocks');
      if (stocksData) {
        setSavedStocks(JSON.parse(stocksData));
      }
    };

    loadSavedStocks();
  }, []);

  const saveStock = async (stock: Stock) => {
    const newSavedStocks = [...savedStocks, stock];
    setSavedStocks(newSavedStocks);
    await AsyncStorage.setItem('savedStocks', JSON.stringify(newSavedStocks));
  };

  const removeStock = async (stockTicker: string) => {
    const newSavedStocks = savedStocks.filter(stock => stock.symbol !== stockTicker);
    setSavedStocks(newSavedStocks);
    await AsyncStorage.setItem('savedStocks', JSON.stringify(newSavedStocks));
  };

  return (
    <SavedStocksContext.Provider value={{ savedStocks, saveStock, removeStock }}>
      {children}
    </SavedStocksContext.Provider>
  );
};