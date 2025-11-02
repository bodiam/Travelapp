import { Share, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { TravelItinerary } from '../types';
import { shareItineraryAsPDF } from './pdfService';

// Format itinerary as readable text
export const formatItineraryAsText = (itinerary: TravelItinerary): string => {
  const lines: string[] = [];

  // Header
  lines.push(`✈️ ${itinerary.destination.toUpperCase()} TRAVEL ITINERARY ✈️`);
  lines.push('');
  lines.push(`📅 ${new Date(itinerary.startDate).toLocaleDateString()} - ${new Date(itinerary.endDate).toLocaleDateString()}`);
  lines.push('');
  lines.push(`📝 ${itinerary.summary}`);

  if (itinerary.estimatedBudget) {
    lines.push(`💰 Estimated Budget: ${itinerary.estimatedBudget}`);
  }

  lines.push('');
  lines.push('═══════════════════════════════════════');
  lines.push('');

  // Days
  itinerary.days.forEach((day, index) => {
    lines.push(`DAY ${day.day} - ${day.title}`);
    lines.push(`📆 ${new Date(day.date).toLocaleDateString()}`);
    lines.push('');

    // Accommodation
    if (day.accommodation) {
      lines.push(`🏨 ACCOMMODATION`);
      lines.push(`${day.accommodation.name}`);
      lines.push(`${day.accommodation.type.charAt(0).toUpperCase() + day.accommodation.type.slice(1)}`);
      lines.push(`📍 ${day.accommodation.address}`);
      lines.push(`💵 ${day.accommodation.priceRange}`);
      if (day.accommodation.amenities && day.accommodation.amenities.length > 0) {
        lines.push(`Amenities: ${day.accommodation.amenities.join(', ')}`);
      }
      lines.push('');
    }

    // Activities
    lines.push(`📍 ACTIVITIES`);
    lines.push('');

    day.activities.forEach((activity, actIdx) => {
      lines.push(`${activity.time} - ${activity.title}`);
      lines.push(`${activity.description}`);

      if (activity.location) {
        lines.push(`📍 ${activity.location.name}`);
        if (activity.location.address) {
          lines.push(`   ${activity.location.address}`);
        }
      }

      if (activity.duration) {
        lines.push(`⏱️  Duration: ${activity.duration}`);
      }

      if (activity.cost) {
        lines.push(`💰 Cost: ${activity.cost}`);
      }

      if (activity.transport) {
        const transportMode = activity.transport.mode.replace('_', ' ').toUpperCase();
        lines.push(`🚗 Transport: ${transportMode}`);
        if (activity.transport.duration) {
          lines.push(`   Travel time: ${activity.transport.duration}`);
        }
        if (activity.transport.cost) {
          lines.push(`   Cost: ${activity.transport.cost}`);
        }
        if (activity.transport.details) {
          lines.push(`   ${activity.transport.details}`);
        }
      }

      lines.push('');
    });

    // Meals
    if (day.meals && day.meals.length > 0) {
      lines.push(`🍽️  DINING SUGGESTIONS`);
      lines.push('');

      day.meals.forEach((meal) => {
        const mealType = meal.type.charAt(0).toUpperCase() + meal.type.slice(1);
        lines.push(`${mealType}: ${meal.suggestion}`);
        if (meal.location) {
          lines.push(`📍 ${meal.location}`);
        }
        if (meal.priceRange) {
          lines.push(`💵 ${meal.priceRange}`);
        }
        lines.push('');
      });
    }

    lines.push('─────────────────────────────────────');
    lines.push('');
  });

  lines.push('');
  lines.push('Created with AI Travel Planner ✈️🌍');
  lines.push('');

  return lines.join('\n');
};

// Share itinerary as text via native share dialog
export const shareItinerary = async (itinerary: TravelItinerary): Promise<void> => {
  try {
    const message = formatItineraryAsText(itinerary);

    const result = await Share.share({
      message,
      title: `${itinerary.destination} Travel Itinerary`,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('Shared with activity type:', result.activityType);
      } else {
        console.log('Shared successfully');
      }
    } else if (result.action === Share.dismissedAction) {
      console.log('Share dismissed');
    }
  } catch (error) {
    console.error('Error sharing itinerary:', error);
    Alert.alert('Error', 'Failed to share itinerary');
  }
};

// Export itinerary as JSON file
export const exportItineraryAsJSON = async (itinerary: TravelItinerary): Promise<void> => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Error', 'Sharing is not available on this device');
      return;
    }

    const fileName = `${itinerary.destination.replace(/[^a-zA-Z0-9]/g, '_')}_itinerary.json`;
    // @ts-ignore - documentDirectory exists at runtime
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    // Write JSON to file
    await FileSystem.writeAsStringAsync(
      fileUri,
      JSON.stringify(itinerary, null, 2)
    );

    // Share the file
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Export Itinerary',
      UTI: 'public.json',
    });

    console.log('Itinerary exported successfully');
  } catch (error) {
    console.error('Error exporting itinerary:', error);
    Alert.alert('Error', 'Failed to export itinerary as JSON');
  }
};

// Share a summary (shorter version for quick sharing)
export const shareItinerarySummary = async (itinerary: TravelItinerary): Promise<void> => {
  try {
    const numberOfDays = itinerary.days.length;
    const message = `✈️ Check out my ${itinerary.destination} trip!\n\n` +
      `📅 ${new Date(itinerary.startDate).toLocaleDateString()} - ${new Date(itinerary.endDate).toLocaleDateString()}\n` +
      `📆 ${numberOfDays} day${numberOfDays > 1 ? 's' : ''}\n\n` +
      `${itinerary.summary}\n\n` +
      (itinerary.estimatedBudget ? `💰 Budget: ${itinerary.estimatedBudget}\n\n` : '') +
      `Highlights:\n` +
      itinerary.days.slice(0, 3).map(day =>
        `• Day ${day.day}: ${day.title}${day.activities.length > 0 ? ` - ${day.activities[0].title}` : ''}`
      ).join('\n') +
      (itinerary.days.length > 3 ? `\n...and ${itinerary.days.length - 3} more day(s)!` : '') +
      `\n\n🌍 Created with AI Travel Planner`;

    await Share.share({
      message,
      title: `${itinerary.destination} Trip`,
    });
  } catch (error) {
    console.error('Error sharing summary:', error);
    Alert.alert('Error', 'Failed to share summary');
  }
};
