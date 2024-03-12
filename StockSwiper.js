import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Swiper from 'react-native-deck-swiper';

const Card = ({ card }) => (
  <View style={styles.card}>
    <Text style={styles.text}>{card.text}</Text>
  </View>
);

const StockSwiper = () => {
  const [cards, setCards] = useState([
    { text: 'AAPL' },
    { text: 'GOOGL' },
    { text: 'MSFT' },
    { text: 'AAPL' },
    { text: 'GOOGL' },
    { text: 'MSFT' },
    { text: 'AAPL' },
    { text: 'GOOGL' },
    { text: 'MSFT' },

    // Add more stock cards as needed
  ]);

  return (
    <Swiper
      cards={cards}
      renderCard={(card) => <Card card={card} />}
      onSwipedLeft={() => console.log('Swiped left!')}
      onSwipedRight={() => console.log('Swiped right!')}
      onSwipedBottom={() => console.log('Swiped bottom!')}
      onSwipedTop={() => console.log('Swiped top!')}
      cardIndex={0}
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
