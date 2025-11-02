import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { TravelItinerary } from '../types';
import { ActivityCard } from '../components/ActivityCard';
import { AccommodationCard } from '../components/AccommodationCard';
import { PhotoGallery } from '../components/PhotoGallery';

interface ItineraryScreenProps {
  itinerary: TravelItinerary;
  onBack: () => void;
}

const { width } = Dimensions.get('window');

export const ItineraryScreen: React.FC<ItineraryScreenProps> = ({
  itinerary,
  onBack,
}) => {
  const [selectedDay, setSelectedDay] = useState(0);

  const currentDay = itinerary.days[selectedDay];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{itinerary.destination}</Text>
        <Text style={styles.headerSubtitle}>
          {new Date(itinerary.startDate).toLocaleDateString()} -{' '}
          {new Date(itinerary.endDate).toLocaleDateString()}
        </Text>
      </View>

      {itinerary.photos && itinerary.photos.length > 0 && (
        <PhotoGallery photos={itinerary.photos} />
      )}

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>{itinerary.summary}</Text>
        {itinerary.estimatedBudget && (
          <Text style={styles.budgetText}>
            Estimated Budget: {itinerary.estimatedBudget}
          </Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daySelector}
        contentContainerStyle={styles.daySelectorContent}
      >
        {itinerary.days.map((day, index) => (
          <TouchableOpacity
            key={day.day}
            style={[
              styles.dayTab,
              selectedDay === index && styles.dayTabActive,
            ]}
            onPress={() => setSelectedDay(index)}
          >
            <Text
              style={[
                styles.dayTabText,
                selectedDay === index && styles.dayTabTextActive,
              ]}
            >
              Day {day.day}
            </Text>
            <Text
              style={[
                styles.dayTabDate,
                selectedDay === index && styles.dayTabDateActive,
              ]}
            >
              {new Date(day.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        <Text style={styles.dayTitle}>{currentDay.title}</Text>

        {currentDay.accommodation && (
          <AccommodationCard accommodation={currentDay.accommodation} />
        )}

        <View style={styles.activitiesContainer}>
          <Text style={styles.sectionTitle}>Activities</Text>
          {currentDay.activities.map((activity, index) => (
            <ActivityCard key={index} activity={activity} />
          ))}
        </View>

        {currentDay.meals && currentDay.meals.length > 0 && (
          <View style={styles.mealsContainer}>
            <Text style={styles.sectionTitle}>Dining Suggestions</Text>
            {currentDay.meals.map((meal, index) => (
              <View key={index} style={styles.mealCard}>
                <Text style={styles.mealType}>
                  {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                </Text>
                <Text style={styles.mealSuggestion}>{meal.suggestion}</Text>
                {meal.location && (
                  <Text style={styles.mealLocation}>📍 {meal.location}</Text>
                )}
                {meal.priceRange && (
                  <Text style={styles.mealPrice}>{meal.priceRange}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  budgetText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 8,
  },
  daySelector: {
    maxHeight: 80,
    marginTop: 12,
  },
  daySelectorContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  dayTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dayTabActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dayTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dayTabTextActive: {
    color: '#fff',
  },
  dayTabDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  dayTabDateActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  activitiesContainer: {
    marginTop: 16,
  },
  mealsContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  mealCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  mealSuggestion: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  mealLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  mealPrice: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
    marginTop: 4,
  },
});
