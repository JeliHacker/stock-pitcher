import React, { useState, useEffect, useContext, useRef, SetStateAction, Dispatch } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, Pressable, TouchableOpacity, Image, Platform } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useSavedStocks } from '../contexts/SavedStocksContext';
import { Stock } from '../types/types'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebViewModal from './WebViewModal';
import YahooFinanceLogo from '../../assets/YahooFinance_logo.svg';
import WebViewEmbedded from './WebViewEmbedded';
import { ModalProvider, useModal } from '../contexts/ModalContext'; // Adjust the path as necessary


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
const CardComponent: React.FC<CardProps> = ({ card }) => {
  const urls = {
    guruFocusInsider: `https://www.gurufocus.com/stock/${card.symbol}/insider`,
    guruFocusDCF: `https://www.gurufocus.com/stock/${card.symbol}/dcf`,
    seekingAlpha: `https://seekingalpha.com/symbol/${card.symbol}`,
    seekingAlphaFilings: `https://seekingalpha.com/symbol/${card.symbol}/sec-filings`,
    edgar: `https://www.sec.gov/edgar/browse/?CIK=1514991&owner=exclude`,
    yahooFinance: `https://finance.yahoo.com/quote/${card.symbol}`,
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const { modalVisible, setModalVisible } = useModal();
  const [embeddedWebViewVisible, setEmbeddedWebViewVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('http://api.codefit.lol/404');
  const [currentTitle, setCurrentTitle] = useState('');
  
  const handlePress = (url: string, title: string) => {
    setCurrentUrl(url);
    setCurrentTitle(title);
    setModalVisible(true);
    console.log("handlepress", url, currentIndex, getModalUrl());
  };

  const pressEmbeddedLink = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleCloseEmbedded = () => {
    setEmbeddedWebViewVisible(false);
  };

  const formatMarketCap = (marketCapString: string): string => {
    const marketCap = parseFloat(marketCapString);
    if (isNaN(marketCap)) {
      return "Market Cap: N/A"; // Handle the case where market cap is not a valid number
    }

    if (marketCap >= 1000000000) {
      const marketCapInBillions = marketCap / 1000000000;
      return `$${marketCapInBillions.toFixed(1)}B`; // display market cap in billions
    } else if (marketCap >= 1000000) {
      const marketCapInMillions = marketCap / 1000000;
      return `$${marketCapInMillions.toFixed(1)}M`; // display market cap in millions
    } else {
      return `$${marketCap}`; // Handle smaller market caps directly
    }
  };

  const formattedMarketCap = formatMarketCap(card.market_cap);

  const attributes = [
    (
      <View style={styles.attributeContainer}>
        <Text style={styles.headerText}>{card.symbol} ${card.price}</Text>
          <Text style={styles.miniHeader}>Name</Text>
          <Text style={styles.text}>{card.name}</Text>

          <Text style={styles.miniHeader}>Market Cap</Text>
          <Text style={[styles.text]}>{formattedMarketCap}</Text>

          <Text style={styles.miniHeader}>Country</Text>
          <Text style={styles.text}>{card.country}</Text>

          <Text style={styles.miniHeader}>Industry</Text>
          <Text style={styles.text}>{card.industry}</Text>
      </View>
    ),
    (
      <View style={styles.attributeContainer}>
        <Text style={styles.headerText}>{card.symbol} ${card.price}</Text>
        
        <Text style={styles.miniHeader}>Business Predictability</Text>
        <Text style={styles.text}>{card.business_predictability}</Text>

        <Text style={styles.miniHeader}>Fair Value</Text>
        <Text style={styles.text}>${card.fair_value}</Text>
      </View>
    ),
    (
      <View style={styles.attributeContainer}>
        <Text style={styles.headerText}>{card.symbol} ${card.price}</Text>
        <Text style={styles.text}>Symbol: {card.symbol}</Text>
        <Text style={styles.text}>Price: {card.price}</Text>
        
      </View>
    ),
    (
      <View style={styles.attributeContainer}>
        <Text style={styles.headerText}>{card.symbol} ${card.price}</Text>
        <Text style={styles.text}>Financial Reports</Text>
      </View>
    ),
    (
      <View style={styles.attributeContainer}>
        <Text style={styles.headerText}>{card.symbol} ${card.price}</Text>
        <Text style={styles.text}>Insider Buying</Text>
      </View>
    ),
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

  const getModalUrl = () => {
    switch (currentIndex) {
      case 0:
        return urls.yahooFinance;
      case 1:
        return urls.guruFocusDCF;
      case 2:
        return urls.seekingAlpha;
      case 3:
        return urls.seekingAlphaFilings;
      case 4:
        return urls.guruFocusInsider;
      default:
        return '';
    }
  };

  return ( 
    <View style={styles.card}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
      {attributes.map((_, index) => (
          <Pressable
            key={index}
            style={[
              styles.tab,
              currentIndex == index && styles.activeTab,
            ]}
            onPress={() => {
              setCurrentIndex(index);
            }}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.leftSide} onPress={handleLeftTap} />
      <TouchableOpacity style={styles.rightSide} onPress={handleRightTap} />
      
      <View style={styles.center}>
        <Text style={styles.text}>{attributes[currentIndex]}</Text>
      </View>
      
      {/* All of this is because the links aren't pressable because they are hidden under the left and right touchable opacities */}
      { currentIndex == 0 &&
        <Pressable 
          style={({ pressed }) => [
            styles.linkContainer,       
            { opacity: pressed ? 0.5 : 1.0 }  // UI feedback to being pressed
          ]} 
          onPress={pressEmbeddedLink}>
          <Text style={styles.linkText}>View in </Text>
          <YahooFinanceLogo width="120" height="40" />
        </Pressable>
      }

      { currentIndex == 1 &&
        <TouchableOpacity style={styles.linkContainer} onPress={() => handlePress(urls.guruFocusDCF, 'GuruFocus')}>
          <Text style={styles.linkText}>View in </Text>
          <Image source={require('../../assets/GuruFocus_logo.png')} style={styles.gurufocus_logo_image} resizeMode='contain' />
        </TouchableOpacity>
      }

      { currentIndex == 2 &&
        <TouchableOpacity style={styles.linkContainer} onPress={() => handlePress(urls.seekingAlpha, 'Seeking Alpha')}>
          <Text style={styles.linkText}>View in </Text>
          <Image source={require('../../assets/SeekingAlpha_logo.png')} style={styles.gurufocus_logo_image} resizeMode='center' />
        </TouchableOpacity>
      }

      { currentIndex == 3 &&
        <TouchableOpacity style={styles.linkContainer} onPress={() => handlePress(urls.seekingAlphaFilings, 'Seeking Alpha')}>
          <Text style={styles.linkText}>View in </Text>
          <Image source={require('../../assets/SeekingAlpha_logo.png')} style={styles.gurufocus_logo_image} resizeMode='center' />
        </TouchableOpacity>
      }

      { currentIndex == 4 &&
          <TouchableOpacity style={styles.linkContainer} onPress={() => handlePress(urls.guruFocusInsider, 'GuruFocus')}>
            <Text style={styles.linkText}>View in </Text>
            <Image source={require('../../assets/GuruFocus_logo.png')} style={styles.gurufocus_logo_image} resizeMode='contain' />
          </TouchableOpacity>
      }

      <View style={[{ position: 'absolute', top: 34, width: '100%', height: '100%', zIndex: 101 }, modalVisible ? {} : {display: 'none'}]}>
        <WebViewEmbedded
          height={cardHeight}
          onClose={handleCloseModal}
          url={urls.yahooFinance}
          title="Yahoo Finance"
          style={currentIndex === 0 ? {} : { display: 'none' }}
        />
      </View>

      { currentIndex == 1 && modalVisible &&
          <WebViewModal visible={modalVisible} onClose={handleCloseModal} url={urls.guruFocusDCF} title={currentTitle} />
      }
      { currentIndex == 2 && modalVisible &&
          <WebViewModal visible={modalVisible} onClose={handleCloseModal} url={urls.seekingAlpha} title={currentTitle} />
      }
      { currentIndex == 3 && modalVisible &&
          <WebViewModal visible={modalVisible} onClose={handleCloseModal} url={urls.seekingAlphaFilings} title={currentTitle} />
      }
      { currentIndex == 4 && modalVisible &&
          <WebViewModal visible={modalVisible} onClose={handleCloseModal} url={urls.guruFocusInsider} title={currentTitle} />
      }      
      
    </View>
  );
};

const Card = React.memo(CardComponent);

const fetchStocks = async (
  page: number,
  setCards: Dispatch<SetStateAction<Stock[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  const currentPage = await getCurrentPage();
  const seenStocks = JSON.parse(await AsyncStorage.getItem('seenStocks') || '[]');

  fetch(`http://api.codefit.lol/stocks?page=${currentPage}`)
    .then(response => response.json())
    .then(data => {
      const newStocks = data.filter((stock: any) => !seenStocks.includes(stock.symbol));
      setCards(newStocks.map((stock: any) => ({
        business_predictability: stock.business_predictability,
        country: stock.country,
        fair_value: stock.fair_value,
        industry: stock.industry,
        market_cap: stock.market_cap,
        name: stock.name,
        price: stock.last_sale,
        symbol: stock.symbol,
      })));
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching stock data:', error);
      setLoading(false);
    });
}


const StockSwiper = () => {
  // Create a ref to store the Swiper instance
  const swiperRef = useRef<any>(null);

  const { modalVisible, setModalVisible } = useModal();

  const anyModalVisible = modalVisible; // TODO: add embedded visibility OR statement

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
      <Swiper
        ref={swiperRef}
        cards={cards}
        renderCard={(card) => <CardComponent card={card} /> }
            onSwipedRight={(card) => {
          saveStock(cards[card]);
        }}
        onSwiped={(cardIndex) => {
          updateSeenStocks([cards[cardIndex].symbol]);
        }}
        onSwipedAll={handleSwipedAll}
        cardIndex={0}
        verticalSwipe={false}
        horizontalSwipe={!anyModalVisible}
        cardHorizontalMargin={0}
        cardVerticalMargin={0}
        backgroundColor={'#f0f0f0'}
        stackSize={2} // Number of cards visible in background
        key={currentPage}
      />

      {/* this is for logging purposes, because I'm a hack */}
      {/* <Text>current page: {currentPage}</Text> */} 
      
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
const { width } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;

// Define a percentage of the screen height you want the card to be
const cardHeight = screenHeight * 0.75; // for 75% of the screen height

const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: 'limegreen',
    borderColor: 'limegreen',
    borderWidth: 2,
    opacity: 1
  },
  arrow: {
    fontSize: 36,
    color: '#ccc',
  },
  attributeContainer: {
    width: width - 20,
    flexGrow: 1,
    flex: 1,
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
    backgroundColor: 'white'
  },
  buttonContainer: {
    position: 'absolute', 
    bottom: 0, 
    alignSelf: 'center', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%', 
    padding: 10, 
    backgroundColor: 'rgba(220, 220, 220, 0.5)', // 'gainsboro' with 50% opacity
    borderRadius: 20, 
    borderColor: 'gray', 
    overflow: 'hidden',
  },
  card: {
    width: width,
    height: cardHeight,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    zIndex: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',  
    alignItems: 'center',
    backgroundColor: '#235643'
  },
  gurufocus_logo: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    zIndex: 100,
    bottom: '15%'
  },
  gurufocus_logo_image: {
    width: 100,
    height: 100,
  },
  headerText: {
    fontSize: 36,
    marginBottom: 10
  },
  imageStyles: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  },
  linkContainer: {
    bottom: 75,
    zIndex: 100,
    flexDirection: 'row',  // Align items in a row
    justifyContent: 'center',  // Center items horizontally
    alignItems: 'center',  // Center items vertically
    padding: 10,  // Add padding inside the button
    backgroundColor: 'rgba(50, 205, 50, 1)',  // Light grey background
    borderRadius: 5,  // Rounded corners
    borderWidth: 1,  // Border width
    borderColor: '#D0D0D0',  // Border color
    alignSelf: 'center',  // Center the button within its parent
  },
  leftSide: {
    position: 'absolute',
    left: 0,
    top: 34,
    bottom: 0,
    width: width / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  linkText: {
    color: 'white', 
    fontSize: 20
  },
  miniHeader: {
    color: 'grey',
    fontSize: 18
  },
  passButton: {
    backgroundColor: 'red',
    color: '#000'
  },
  passButtonText: {
    fontSize: 32, 
  },
  rightSide: {
    position: 'absolute',
    right: 0,
    top: 34,
    bottom: 0,
    width: width / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  swingButtonText: {
    fontSize: 32, 
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  tab: {
    flex: 1,
    backgroundColor: 'black',
    marginHorizontal: 5,
    borderRadius: 10,
    borderColor: 'black',
    opacity: 0.6,
    borderWidth: 2,
    padding: 5,
    zIndex: 101
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: 'transparent',
    ...Platform.select({
      android: {
        flexWrap: 'wrap',
        flexShrink: 1,
      }, // Limit text to a single line
    }),
  },
  yahoofinance_logo: {
    position: 'absolute',
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    width: 230,
    height: 100,
    zIndex: 1000,
    bottom: '15%',
    borderColor: 'black',
  }
});

export default StockSwiper;
