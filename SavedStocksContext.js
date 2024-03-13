// SavedStocksContext.js
import React, { createContext, useContext, useState } from 'react';

const SavedStocksContext = createContext();

export const useSavedStocks = () => useContext(SavedStocksContext);

export const SavedStocksProvider = ({ children }) => {
  const [savedStocks, setSavedStocks] = useState([]);

  const saveStock = (stock) => {
    setSavedStocks((currentStocks) => [...currentStocks, stock]);
  };

  return (
    <SavedStocksContext.Provider value={{ savedStocks, saveStock }}>
      {children}
    </SavedStocksContext.Provider>
  );
};
