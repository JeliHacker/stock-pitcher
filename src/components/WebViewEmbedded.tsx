import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';

type WebViewModalProps = {
  onClose: () => void;
  url: string;
  title: string;
  height: number;
  style: object;
};

const WebViewEmbedded: React.FC<WebViewModalProps> = ({ onClose, url, title, height, style }) => {
  const webViewRef = useRef<WebView>(null);

  const handleRefresh = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };
  
  return (
      <View style={[styles.modalContainer, style, { height: height }]}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
              <Text style={styles.buttonText}>Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
          </View>
          <WebView ref={webViewRef} originWhitelist={['*']} source={{ uri: url }} style={styles.webView} />
        </View>
      </View>
    
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    marginRight: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },

  modalContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  refreshButton: {
    padding: 10,
    backgroundColor: 'limegreen',
    borderRadius: 5,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  webView: {
    flex: 1,
  },
});

export default WebViewEmbedded;
