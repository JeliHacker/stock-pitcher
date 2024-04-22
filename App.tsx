import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './AppNavigator';
import { SavedStocksProvider } from './src/contexts/SavedStocksContext';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SavedStocksProvider>
      <AppNavigator />
      <StatusBar />
    </SavedStocksProvider>
  );
}
