import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Alert } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { ItineraryScreen } from './src/screens/ItineraryScreen';
import { SavedItinerariesScreen } from './src/screens/SavedItinerariesScreen';
import { TravelItinerary } from './src/types';
import { validateEnv } from './src/config/env';

type Screen = 'home' | 'itinerary' | 'saved';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);

  useEffect(() => {
    // Validate environment on app start
    const isValid = validateEnv();
    if (!isValid) {
      Alert.alert(
        'Configuration Required',
        'Please configure your API keys in src/config/env.ts before using the app. ' +
        'See .env.example for required keys.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  const handleItineraryGenerated = (newItinerary: TravelItinerary) => {
    setItinerary(newItinerary);
    setCurrentScreen('itinerary');
  };

  const handleViewSaved = () => {
    setCurrentScreen('saved');
  };

  const handleSelectItinerary = (selectedItinerary: TravelItinerary) => {
    setItinerary(selectedItinerary);
    setCurrentScreen('itinerary');
  };

  const handleBackToHome = () => {
    setItinerary(null);
    setCurrentScreen('home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {currentScreen === 'home' && (
        <HomeScreen
          onItineraryGenerated={handleItineraryGenerated}
          onViewSaved={handleViewSaved}
        />
      )}
      {currentScreen === 'itinerary' && itinerary && (
        <ItineraryScreen itinerary={itinerary} onBack={handleBackToHome} />
      )}
      {currentScreen === 'saved' && (
        <SavedItinerariesScreen
          onSelectItinerary={handleSelectItinerary}
          onBack={handleBackToHome}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
