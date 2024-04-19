import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './AppNavigator';
import { SavedStocksProvider } from './src/contexts/SavedStocksContext';

export default function App() {
  return (
    <SavedStocksProvider>
      <AppNavigator />
    </SavedStocksProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
