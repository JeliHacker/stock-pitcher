import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useSavedStocks } from './SavedStocksContext';

const Card = ({ card }) => (
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
        setCards(data.map(stock => ({
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
      onSwipedRight={(cardIndex) => saveStock(cards[cardIndex])}
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

const styles = {
  card: {
    flex: 1,
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
};

export default StockSwiper;
