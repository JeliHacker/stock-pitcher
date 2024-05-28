import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';

type WebViewModalProps = {
  visible: boolean;
  onClose: () => void;
  url: string;
  title: string;
};

const WebViewModal: React.FC<WebViewModalProps> = ({ visible, onClose, url, title }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
    <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
      <View style={styles.modalContentContainer}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            <WebView 
              originWhitelist={['*']} // https://github.com/react-native-webview/react-native-webview/issues/2567
              source={{ uri: url }}
              style={styles.webView} 
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </TouchableOpacity>
        </View>
    </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    height: '80%',
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'blue',
  },
  webView: {
    flex: 1,
    width: '100%'
  },
});

export default WebViewModal;
