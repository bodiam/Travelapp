import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Alert } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { ItineraryScreen } from './src/screens/ItineraryScreen';
import { TravelItinerary } from './src/types';
import { validateEnv } from './src/config/env';

export default function App() {
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
  };

  const handleBack = () => {
    setItinerary(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {itinerary ? (
        <ItineraryScreen itinerary={itinerary} onBack={handleBack} />
      ) : (
        <HomeScreen onItineraryGenerated={handleItineraryGenerated} />
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
