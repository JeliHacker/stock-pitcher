import React, { useState, useEffect, useContext, useRef, SetStateAction, Dispatch } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useSavedStocks } from '../contexts/SavedStocksContext';
import { Stock } from '../types/types'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Function to update the seen stocks
const updateSeenStocks = async (newStock: any) => {
  const seenStocks = await AsyncStorage.getItem('seenStocks');
  const updatedStocks = seenStocks ? JSON.parse(seenStocks).concat(newStock) : newStock;
  await AsyncStorage.setItem('seenStocks', JSON.stringify(updatedStocks));
};

const getCurrentPage = async () => {
  const pageNumber = await AsyncStorage.getItem('pageNumber');
  return pageNumber ? parseInt(pageNumber, 10) : 1; // Default to page 1 if not set
};

// Function to increment the page number
const incrementPageNumber = async () => {
  const currentPage = await getCurrentPage();
  const nextPage = currentPage + 1;
  await AsyncStorage.setItem('pageNumber', nextPage.toString());
  console.log("currentPage is now", currentPage);
};

  interface CardProps {
    card: Stock;
  }

// definition for a card
const Card: React.FC<CardProps> = ({ card }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const attributes = [
    `Business Predictability: ${card.business_predictability}`,
    `Symbol: ${card.symbol}`,
    `Name: ${card.name}`,
    `Fair Value: ${card.fair_value}`,
    `Price: ${card.price}`
  ];

  const handleLeftTap = () => {
    setCurrentIndex((prevIndex) => (prevIndex == 0 ? 0 : prevIndex - 1));
  };

  const handleRightTap = () => {
    if (currentIndex == 4) { // can't really understand why this works, but it does. Prevents a bug.
      return;
    } else {
      setCurrentIndex((prevIndex) => (prevIndex >= 5 ? 5 : prevIndex + 1));
    }
  };

  return ( 
    <View style={styles.card}>
      <View style={styles.tabsContainer}>
      {attributes.map((_, index) => (
          <View
            key={index}
            style={[
              styles.tab,
              currentIndex == index && styles.activeTab,
            ]}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.leftSide} onPress={handleLeftTap} />
      <View style={styles.center}>
        <Text style={styles.text}>{attributes[currentIndex]}</Text>
      </View>
      <TouchableOpacity style={styles.rightSide} onPress={handleRightTap} />
    </View>
  );
};

const fetchStocks = async (
  page: number,
  setCards: Dispatch<SetStateAction<Stock[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  const currentPage = await getCurrentPage();
  const seenStocks = JSON.parse(await AsyncStorage.getItem('seenStocks') || '[]');
  console.log("fetching stocks for page", currentPage);
  fetch(`http://api.codefit.lol/stocks?page=${currentPage}`)
    .then(response => response.json())
    .then(data => {
      const newStocks = data.filter((stock: any) => !seenStocks.includes(stock.symbol));
      console.log("newStocks length = ", newStocks.length);
      setCards(newStocks.map((stock: any) => ({
        symbol: stock.symbol,
        name: stock.name,
        fair_value: stock.fair_value,
        business_predictability: stock.business_predictability,
        price: stock.last_sale
      })));
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching stock data:', error);
      setLoading(false);
    });

    console.log("done fetching stocks");
}


const StockSwiper = () => {
  // Create a ref to store the Swiper instance
  const swiperRef = useRef<any>(null);

  const [cards, setCards] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);  // Initialize currentPage state

  const { saveStock } = useSavedStocks();

  useEffect(() => {
    setLoading(true); // Set loading before fetching
    getCurrentPage().then(page => {
      setCurrentPage(page);
      fetchStocks(page, setCards, setLoading);
    });
  }, []);
  
  const handleSwipedAll = () => {
    const nextPage = currentPage + 1;
    incrementPageNumber().then(() => {
      setCurrentPage(nextPage);  // Update currentPage state
      fetchStocks(nextPage, setCards, setLoading);
    });
  };

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
      <Text>current page: {currentPage}</Text>
      <Swiper
        ref={swiperRef}
        cards={cards}
        renderCard={(card) => <Card card={card} />}
        onSwipedRight={(card) => {
          saveStock(cards[card]);
        }}
        onSwiped={(cardIndex) => {
          updateSeenStocks([cards[cardIndex].symbol]);
        }}
        onSwipedAll={handleSwipedAll}
        cardIndex={0}
        verticalSwipe={false}
        cardVerticalMargin={0}
        backgroundColor={'#f0f0f0'}
        stackSize={3} // Number of cards visible in background
        key={currentPage}
      />
      <Text>current page: {currentPage}</Text>
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
          <Text style={styles.swingButtonText}>💸</Text>
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
  card: {
    height: cardHeight,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageStyles: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  },
  passButtonText: {
    color: 'black',
    fontSize: 32, // Adjust the size as needed
  },
  swingButtonText: {
    color: 'white',
    fontSize: 32, // Adjust the size as needed
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
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  tab: {
    width: 40,
    height: 2,
    backgroundColor: 'black',
    margin: 5,
    // borderRadius: 10,
    borderColor: 'black'
  },
  activeTab: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2
  },
  leftSide: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  rightSide: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  arrow: {
    fontSize: 36,
    color: '#ccc',
  },
});

export default StockSwiper;
