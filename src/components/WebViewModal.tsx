import React, { useRef, useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';

type WebViewModalProps = {
  visible: boolean;
  onClose: () => void;
  url: string;
  title: string;
};

const WebViewModal: React.FC<WebViewModalProps> = ({ visible, onClose, url, title }) => {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
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
              ref={webViewRef}
              originWhitelist={['*']} // https://github.com/react-native-webview/react-native-webview/issues/2567
              source={{ uri: url }}
              style={styles.webView} 
              javaScriptEnabled={true}
              domStorageEnabled={true}
              onNavigationStateChange={handleNavigationStateChange}
            />
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                onPress={() => webViewRef.current?.goBack()}
                disabled={!canGoBack}
                style={[styles.navButton, !canGoBack && styles.disabledButton]}
              >
                <Text style={styles.navButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => webViewRef.current?.goForward()}
                disabled={!canGoForward}
                style={[styles.navButton, !canGoForward && styles.disabledButton]}
              >
                <Text style={styles.navButtonText}>Forward</Text>
              </TouchableOpacity>
            </View>
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
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  navButton: {
    padding: 10,
    backgroundColor: '#007aff',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default WebViewModal;
