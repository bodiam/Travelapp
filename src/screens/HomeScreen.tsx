import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TravelItinerary, TravelRequest } from '../types';
import { generateItinerary } from '../services/aiService';
import { getDestinationPhotos } from '../services/photoService';

interface HomeScreenProps {
  onItineraryGenerated: (itinerary: TravelItinerary) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onItineraryGenerated }) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'packed'>('moderate');

  const handleGenerateItinerary = async () => {
    if (!destination.trim()) {
      Alert.alert('Missing Information', 'Please enter a destination');
      return;
    }

    if (endDate <= startDate) {
      Alert.alert('Invalid Dates', 'End date must be after start date');
      return;
    }

    setLoading(true);

    try {
      const request: TravelRequest = {
        destination: destination.trim(),
        startDate,
        endDate,
        preferences: {
          budget,
          pace,
          interests: [],
        },
      };

      // Generate itinerary
      const itinerary = await generateItinerary(request);

      // Fetch photos for the destination
      const photos = await getDestinationPhotos(destination.trim(), 5);
      itinerary.photos = photos;

      onItineraryGenerated(itinerary);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      Alert.alert(
        'Error',
        'Failed to generate itinerary. Please check your API keys and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Travel Planner</Text>
        <Text style={styles.subtitle}>
          Let AI create your perfect travel itinerary
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Destination</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Paris, Tokyo, New York"
          value={destination}
          onChangeText={setDestination}
          autoCapitalize="words"
          editable={!loading}
        />

        <View style={styles.dateSection}>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartDatePicker(true)}
              disabled={loading}
            >
              <Text style={styles.dateButtonText}>
                {startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndDatePicker(true)}
              disabled={loading}
            >
              <Text style={styles.dateButtonText}>
                {endDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onStartDateChange}
            minimumDate={new Date()}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onEndDateChange}
            minimumDate={startDate}
          />
        )}

        <Text style={styles.label}>Budget</Text>
        <View style={styles.optionGroup}>
          {(['budget', 'moderate', 'luxury'] as const).map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                budget === option && styles.optionButtonActive,
              ]}
              onPress={() => setBudget(option)}
              disabled={loading}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  budget === option && styles.optionButtonTextActive,
                ]}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Pace</Text>
        <View style={styles.optionGroup}>
          {(['relaxed', 'moderate', 'packed'] as const).map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                pace === option && styles.optionButtonActive,
              ]}
              onPress={() => setPace(option)}
              disabled={loading}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  pace === option && styles.optionButtonTextActive,
                ]}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.generateButton, loading && styles.generateButtonDisabled]}
          onPress={handleGenerateItinerary}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.generateButtonText}>Generate Itinerary</Text>
          )}
        </TouchableOpacity>

        {loading && (
          <Text style={styles.loadingText}>
            Creating your personalized itinerary...
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateContainer: {
    flex: 1,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  optionGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#666',
  },
  optionButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 12,
    fontSize: 14,
  },
});
