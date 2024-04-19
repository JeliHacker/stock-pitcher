// SavedStocksContext.js
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Stock } from '../types/types'; 

interface SavedStocksContextType {
  savedStocks: Stock[];
  saveStock: (stock: Stock) => void;
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

  const saveStock = (stock: Stock) => {
    setSavedStocks((currentStocks) => [...currentStocks, stock]);
  };

  return (
    <SavedStocksContext.Provider value={{ savedStocks, saveStock }}>
      {children}
    </SavedStocksContext.Provider>
  );
};