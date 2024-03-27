import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useSavedStocks } from './SavedStocksContext';

const Card = ({ card, swipeDirection, isTopCard }) => {
  if (!card) {
    console.log("card is undefined");
    return (
      <View style={styles.card}>
        <Text style={styles.text}>Get swiping!</Text>
      </View>
    )
  }

  return (
    <View style={styles.card}>
      {isTopCard && swipeDirection === 'Right' && (
      // <Text style={{ position: 'absolute', top: 10, left: 10, color: 'green', fontSize: 24 }}>Like!</Text>
      <Image
  source={require('./assets/jonah_hill_no.gif')}
  style={{ width: 100, height: 100 }}
/>
      )
      }
      {isTopCard && swipeDirection === 'Left' && <Text style={{ position: 'absolute', top: 10, right: 10, color: 'red', fontSize: 24 }}>Dislike!</Text>}
      <Text style={styles.text}>{card.text}</Text>
    </View>
  );
}
  

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
  { text: 'MSFT' },]);

  const { saveStock } = useSavedStocks();

  // useEffect(() => {
  //   // Replace 'http://api.codefit.lol/api/stocks' with your actual API endpoint
  //   fetch('http://api.codefit.lol/api/stocks')
  //     .then(response => response.json())
  //     .then(data => {
  //       if (Array.isArray(data) && data.length > 0) {
  //         const formattedCards = data.map(stock => ({
  //           text: `${stock.ticker} - $${stock.price}`,
  //         }));
  //         console.log(formattedCards);
  //         setCards(formattedCards);
  //       } else {
  //         console.log('Data is not an array or is empty');
  //       }
  //     })
  //     .catch(error => console.error('Error fetching stock data:', error));
  // }, []); // The empty array ensures this effect runs only once when the component mounts

  const [swipeDirection, setSwipeDirection] = useState('');
  const onSwiping = (xOffset) => {
    if (xOffset > 0) {
      console.log("swiping right!", xOffset);
      setSwipeDirection('Right');
    } else if (xOffset < 0) {
      console.log("swiping left!", xOffset);
      setSwipeDirection('Left');
    } else {
      // console.log("swiping... idk!");
      setSwipeDirection('null');
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0); // Add this line

  return (
    <Swiper
      cards={cards}
      renderCard={(card) => (  
          <Card card={card} swipeDirection={swipeDirection} isTopCard={currentIndex === cards.indexOf(card)} />
      )}
      onSwipedLeft={() => console.log('Swiped left!')}
      onSwipedRight={(cardIndex) => saveStock(cards[cardIndex])}
      onSwipedBottom={() => console.log('Swiped bottom!')}
      onSwipedTop={() => console.log('Swiped top!')}
      cardIndex={0}
      verticalSwipe={false}
      cardVerticalMargin={0}
      backgroundColor={'#f0f0f0'}
      stackSize={3} // Number of cards visible in background
      onSwiping={(xOffset) => onSwiping(xOffset)}
      onSwiped={() => {
        setCurrentIndex(currentIndex + 1);
        setSwipeDirection("null");
        console.log("currentIndex = ", currentIndex);
      }}
      onSwipedAborted={() => {
        setSwipeDirection('');
        console.log("swipe aborted");
      }
      }
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
