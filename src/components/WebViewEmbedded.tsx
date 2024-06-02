import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';

type WebViewModalProps = {
  onClose: () => void;
  url: string;
  title: string;
  height: number;
};

const WebViewEmbedded: React.FC<WebViewModalProps> = ({ onClose, url, title, height }) => {
  return (
      <View style={[styles.modalContainer, { height: height }]}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <WebView originWhitelist={['*']} source={{ uri: url }} style={styles.webView} />
        </View>
      </View>
    
  );
};

const styles = StyleSheet.create({
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
  },
});

export default WebViewEmbedded;
