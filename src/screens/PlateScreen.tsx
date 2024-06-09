// PlateScreen.js
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import StockSwiper from '../components/StockSwiper'; 
import { Ionicons } from '@expo/vector-icons'; 
import { PlateScreenProps } from '../types/types'; 
import SettingsModal from '../components/SettingsModal';
import { ModalProvider, useModal } from '../contexts/ModalContext';

const PlateScreen: React.FC<PlateScreenProps> = ({ navigation }) => {
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={{ fontSize: 16 }}>⚾️ Stock Pitcher</Text>,
      title: 'Stock Pitcher',
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => console.log('Filter tapped')}>
            <Ionicons name="filter" size={24} style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSettingsModalVisible(true)}>
            <Ionicons name="settings" size={24} style={{ marginRight: 15 }} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
      />

      <ModalProvider>
        <StockSwiper />
      </ModalProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PlateScreen;
