import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelItinerary } from '../types';

const ITINERARIES_KEY = '@travel_itineraries';

export interface SavedItinerary extends TravelItinerary {
  id: string;
  savedAt: string;
}

export const saveItinerary = async (itinerary: TravelItinerary): Promise<void> => {
  try {
    const savedItinerary: SavedItinerary = {
      ...itinerary,
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
    };

    const existingData = await AsyncStorage.getItem(ITINERARIES_KEY);
    const itineraries: SavedItinerary[] = existingData
      ? JSON.parse(existingData)
      : [];

    itineraries.unshift(savedItinerary); // Add to beginning
    await AsyncStorage.setItem(ITINERARIES_KEY, JSON.stringify(itineraries));
  } catch (error) {
    console.error('Error saving itinerary:', error);
    throw new Error('Failed to save itinerary');
  }
};

export const getSavedItineraries = async (): Promise<SavedItinerary[]> => {
  try {
    const data = await AsyncStorage.getItem(ITINERARIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading itineraries:', error);
    return [];
  }
};

export const deleteItinerary = async (id: string): Promise<void> => {
  try {
    const existingData = await AsyncStorage.getItem(ITINERARIES_KEY);
    if (!existingData) return;

    const itineraries: SavedItinerary[] = JSON.parse(existingData);
    const filtered = itineraries.filter((item) => item.id !== id);
    await AsyncStorage.setItem(ITINERARIES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    throw new Error('Failed to delete itinerary');
  }
};

export const clearAllItineraries = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ITINERARIES_KEY);
  } catch (error) {
    console.error('Error clearing itineraries:', error);
    throw new Error('Failed to clear itineraries');
  }
};
