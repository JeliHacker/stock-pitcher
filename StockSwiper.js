import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useSavedStocks } from './SavedStocksContext';

const Card = ({ card, isSwipingRight, isSwipingLeft, isTopCard, xOffset }) => {
  useEffect(() => {
    console.log(`Swiping updated - Right: ${isSwipingRight}, Left: ${isSwipingLeft}`);
  }, [isSwipingRight, isSwipingLeft]);

  if (!card) {
    console.log("card is undefined");
    return (
      <View style={styles.card}>
        <Text style={styles.text}>Get swiping!</Text>
      </View>
    )
  }

  // Calculate the size of the buttons based on xOffset
  const baseSize = 50; // Base size for the button
  const scaleFactor = 0.1; // Adjust this to make the effect more/less pronounced

  // Make sure the sizes don't go below the base size
  const redButtonSize = Math.max(baseSize, baseSize + xOffset * scaleFactor);
  const greenButtonSize = Math.max(baseSize, baseSize - xOffset * scaleFactor);

  return (
    <View style={styles.card}>
      {isSwipingRight && isTopCard && (
      <Image
        source={require('./assets/jonah_hill_no.gif')}
        style={{ width: 100, height: 100 }}
      />
      )}
      {isSwipingLeft && isTopCard && <Text style={{ position: 'absolute', top: 10, right: 10, color: 'red', fontSize: 24 }}>Dislike!</Text>}
      <Text style={styles.text}>{card.text}</Text>

      {/* Red button on the left side */}
      <View style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        width: redButtonSize,
        height: redButtonSize,
        borderRadius: redButtonSize / 2,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: xOffset < 0 ? 1 : 0, // Only show when swiping left
      }}/>

      <Text>Test</Text>

      {/* Green button on the right side */}
      <View style={{
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: greenButtonSize,
        height: greenButtonSize,
        borderRadius: greenButtonSize / 2,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: xOffset > 0 ? 1 : 0, // Only show when swiping right
      }}/>
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

  const [, forceRerender] = useState({});

  const forceUpdate = () => {
    // Set state to a new object to force a re-render
    forceRerender({});
  };

  useEffect(() => {
    fetch('http://api.codefit.lol/api/stocks')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formattedCards = data.map(stock => ({
            text: `${stock.ticker} - $${stock.price}`,
          }));
          console.log(formattedCards);
          setCards(formattedCards);
        } else {
          console.log('Data is not an array or is empty');
        }
      })
      .catch(error => console.error('Error fetching stock data:', error));
  }, []); // The empty array ensures this effect runs only once when the component mounts

  const [swipeDirection, setSwipeDirection] = useState('');
  const [isSwipingRight, setIsSwipingRight] = useState(false);
  const [isSwipingLeft, setIsSwipingLeft] = useState(false);  
  const [newXOffset, setXOffset] = useState(0);

  const onSwiping = (xOffset, yOffset) => {
    setXOffset(xOffset)
    if (Math.abs(xOffset) < 40) {
      setIsSwipingLeft(false);
      setIsSwipingRight(false);
    } else {
      setIsSwipingRight(xOffset > 40);
      setIsSwipingLeft(xOffset < -40);
    }
  };

  useEffect(() => {
    console.log(`isSwipingRight: ${isSwipingRight}, isSwipingLeft: ${isSwipingLeft}`);
  }, [isSwipingRight, isSwipingLeft]);

  const [currentIndex, setCurrentIndex] = useState(0); // Add this line

  return (
    <Swiper
      cards={cards}
      renderCard={(card) => (  
          <Card 
            key={`${card.text}_${Date.now()}`}
            card={card} 
            isSwipingRight={isSwipingRight}
            isSwipingLeft={isSwipingLeft}
            isTopCard={currentIndex === cards.indexOf(card)} 
            xOffset={newXOffset}
          />
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
      onSwiping={(xOffset, yOffset) => onSwiping(xOffset, yOffset)}
      onSwiped={() => {
        setCurrentIndex(currentIndex + 1);
        setSwipeDirection("null");
        console.log("currentIndex = ", currentIndex);
      }}
      onSwipedAborted={() => {
        setSwipeDirection('');
        setIsSwipingRight(false);
        setIsSwipingLeft(false);
        console.log(`swipe aborted, swipe direction is ${swipeDirection}, isSwipingLeft: ${isSwipingLeft}`);
        forceUpdate();
      }}
    />
  );
};

const styles = {
  card: {
    height: '75%',
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
