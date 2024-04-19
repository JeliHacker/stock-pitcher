import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useSavedStocks } from '../contexts/SavedStocksContext';
import { Stock } from '../types/types'; 


interface CardProps {
  card: Stock;
}

const Card: React.FC<CardProps> = ({ card }) => (
  <View style={styles.card}>
    <Text style={styles.text}>{card.symbol} - {card.name}</Text>
  </View>
);

const StockSwiper = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const { saveStock } = useSavedStocks();

  useEffect(() => {
    fetch('http://api.codefit.lol/stocks')
      .then(response => response.json())
      .then(data => {
        setCards(data.map((stock:any) => ({
          symbol: stock.symbol,
          name: stock.name
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

  return (
    <Swiper
      cards={cards}
      renderCard={(card) => <Card card={card} />}
      onSwipedLeft={() => console.log('Swiped left!')}
      onSwipedRight={(card) => {
        console.log("saving card", cards[card]);
        saveStock(cards[card]);
      }}
      onSwipedBottom={() => console.log('Swiped bottom!')}
      onSwipedTop={() => console.log('Swiped top!')}
      cardIndex={0}
      verticalSwipe={false}
      cardVerticalMargin={0}
      backgroundColor={'#f0f0f0'}
      stackSize={3} // Number of cards visible in background
    />
  );
};

// Get the full height of the device screen
const screenHeight = Dimensions.get('window').height;

// Define a percentage of the screen height you want the card to be
const cardHeight = screenHeight * 0.75; // for 75% of the screen height

const styles = StyleSheet.create({
  card: {
    height: cardHeight,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
  },
});

export default StockSwiper;
