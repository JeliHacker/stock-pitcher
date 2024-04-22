// SettingsModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Animated, StyleSheet, TouchableWithoutFeedback, Text, ScrollView, Pressable } from 'react-native';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
    // Create an animated value for the background opacity
  const [backgroundOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Fade in the background
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out the background
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, backgroundOpacity]);

  return (
    <Modal
    animationType="none"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.modalOverlay, { opacity: backgroundOpacity }]}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
                <ScrollView style={styles.scrollViewStyle}>
                    <Pressable>
                        <Text style={styles.settingsTitle}>Settings</Text>
                        <Text style={styles.settingOption}>About</Text>    
                        <Text style={styles.settingOption}>In Warren Buffett's first TV interview, 
                        he describes his style of investing with a baseball analogy. The market pitches you balls (stocks) at different prices, and you can swing when you see a stock selling at an attractive price. However, unlike in baseball, there are no strikes, so you're never forced to swing. Stock Pitcher throws stock ideas at you, which you can save to a watchlist or let them go by.</Text>    
                        <Text>The purpose of Stock Pitcher is to give users a way to explore stocks in a fun way.</Text>
                    </Pressable>
                </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
  </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    height: '75%',
    maxHeight: '80%'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  scrollViewStyle: {
    width: '100%',
    height: 300,
  },
  settingOption: {
    // Style for each setting option
    fontSize: 18,
    padding: 10,
    // You might want to add borderBottomWidth and borderBottomColor for dividing lines
  },
  settingsTitle: {
    fontSize: 36
  }
});

export default SettingsModal;