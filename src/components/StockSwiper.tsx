import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, ScrollView, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useSavedStocks } from '../contexts/SavedStocksContext';
import { Stock } from '../types/types'; 


interface CardProps {
  card: Stock;
}

const Card: React.FC<CardProps> = ({ card }) => (
  <View style={styles.card}>
    <ScrollView>
      <TouchableWithoutFeedback>
        <Text style={styles.text}>
          {card.symbol}
          {'\n'}
          {card.name}
          {'\n'}
          Fair value: {card.fair_value.replace(/\s+/g, '')}
          {'\n'}
          Business Predictability: {card.business_predictability}
        </Text>
      </TouchableWithoutFeedback>
    </ScrollView>
  </View>
);

const StockSwiper = () => {
  // Create a ref to store the Swiper instance
  const swiperRef = useRef<any>(null);

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const { saveStock } = useSavedStocks();

  useEffect(() => {
    fetch('http://api.codefit.lol/stocks')
      .then(response => response.json())
      .then(data => {
        setCards(data.map((stock:any) => ({
          symbol: stock.symbol,
          name: stock.name,
          fair_value: stock.fair_value,
          business_predictability: stock.business_predictability
        })));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Functions to trigger swipes programmatically, for use in the buttons
  const handleSwingPress = () => {
    if (swiperRef.current) {
      swiperRef.current.swipeRight();
    }
  };

  const handlePassPress = () => {
    if (swiperRef.current) {
      swiperRef.current.swipeLeft();
    }
  };

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        cards={cards}
        renderCard={(card) => <Card card={card} />}
        onSwipedRight={(card) => {
          saveStock(cards[card]);
        }}
        cardIndex={0}
        verticalSwipe={false}
        cardVerticalMargin={0}
        backgroundColor={'#f0f0f0'}
        stackSize={3} // Number of cards visible in background
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={handlePassPress}
        >
          <Text style={styles.passButtonText}>❌</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button]}
          onPress={handleSwingPress}
        >
          <Text style={styles.swingButtonText}>✅</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Get the full height of the device screen
const screenHeight = Dimensions.get('window').height;

// Define a percentage of the screen height you want the card to be
const cardHeight = screenHeight * 0.75; // for 75% of the screen height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#235643'
  },
  button: {
    width: 60, // Diameter of the circle
    height: 60, // Diameter of the circle
    borderColor: '#000',
    borderWidth: 3,
    borderRadius: 30, // Half the width/height to make it a circle
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
    marginHorizontal: 10, // Add space between the buttons
  },
  buttonContainer: {
    position: 'absolute', // Position your button container absolutely
    bottom: 50, // Adjust this value to place it above the navigation bar
    alignSelf: 'center', // Center the button container horizontally
    flexDirection: 'row', // Layout buttons horizontally
    justifyContent: 'space-around', // Space out buttons as desired
    width: '100%', // Full width to allow space-around to work
  },
  passButtonText: {
    color: 'black',
    fontSize: 16, // Adjust the size as needed
  },
  swingButtonText: {
    color: 'white',
    fontSize: 16, // Adjust the size as needed
  },
  card: {
    height: cardHeight,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  passButton: {
    backgroundColor: 'red',
    color: '#000'
  },
  swingButton: {
    backgroundColor: 'green',
  },
  text: {
    textAlign: 'center',
    fontSize: 32,
    backgroundColor: 'transparent',
  },
});

export default StockSwiper;
