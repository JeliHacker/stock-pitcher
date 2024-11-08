// SettingsModal.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import { Modal, View, Animated, LayoutAnimation, StyleSheet, TouchableWithoutFeedback, Text, ScrollView, Pressable, TouchableOpacity, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionItemProps {
  title: string;
  children: ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsOpen(!isOpen);
  };

  return (
      <View>
          <Pressable onPress={toggleAccordion} style={styles.pressable}>
              <Text style={styles.title}>{title}</Text>
              <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#000" />
          </Pressable>
          {isOpen && <View style={styles.content}>{children}</View>}
      </View>
  );
};

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
                <View style={{ alignItems: 'center'}}>
                    <Text style={styles.settingsTitle}>Settings</Text>
                    <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={onClose}>
                        <Ionicons name="close-outline" size={48} color="#999" style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.scrollViewStyle} nestedScrollEnabled={true}>
                    <AccordionItem title="About">
                      <Text style={styles.settingOption}>
                          In Warren Buffett's first TV interview, he describes his style of investing with a baseball analogy. The market pitches you balls (stocks) at different prices, and you can swing when you see a stock selling at an attractive price. However, unlike in baseball, there are no strikes, so you're never forced to swing. Stock Pitcher throws stock ideas at you, which you can save to a watchlist or let them go by.
                      </Text>
                      <Text style={styles.settingOption}>
                          The purpose of Stock Pitcher is to give users a way to explore stocks in a fun way.
                      </Text>
                  </AccordionItem>
                </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
  </Modal>
  );
};

const styles = StyleSheet.create({
  closeButton: {
        position: 'absolute',
        right: -30, 
        top: -20
  },
  content: {
    padding: 10,
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
  },
  modalView: {
    width: '90%',
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
  settingsTitle: {
    fontSize: 36
  },
  pressable: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  settingOption: {
    fontSize: 18,
    padding: 10,
    // You might want to add borderBottomWidth and borderBottomColor for dividing lines
  },
});

export default SettingsModal;