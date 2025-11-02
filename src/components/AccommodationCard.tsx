import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Accommodation } from '../types';
import { MapPreview } from './MapPreview';

interface AccommodationCardProps {
  accommodation: Accommodation;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({
  accommodation,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🏨 Accommodation</Text>
      <Text style={styles.name}>{accommodation.name}</Text>
      <Text style={styles.type}>
        {accommodation.type.charAt(0).toUpperCase() + accommodation.type.slice(1)}
      </Text>
      <Text style={styles.address}>📍 {accommodation.address}</Text>
      <Text style={styles.price}>{accommodation.priceRange}</Text>

      {accommodation.location?.coordinates && (
        <MapPreview
          latitude={accommodation.location.coordinates.latitude}
          longitude={accommodation.location.coordinates.longitude}
          title={accommodation.name}
        />
      )}

      {accommodation.amenities && accommodation.amenities.length > 0 && (
        <View style={styles.amenitiesContainer}>
          <Text style={styles.amenitiesTitle}>Amenities:</Text>
          <View style={styles.amenitiesList}>
            {accommodation.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {accommodation.photo && (
        <Image source={{ uri: accommodation.photo }} style={styles.photo} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28a745',
    marginBottom: 12,
  },
  amenitiesContainer: {
    marginTop: 12,
  },
  amenitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  amenityText: {
    fontSize: 12,
    color: '#666',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
  },
});
