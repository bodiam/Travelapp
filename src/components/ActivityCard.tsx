import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Activity } from '../types';
import { MapPreview } from './MapPreview';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const getTransportIcon = (mode: string) => {
    const icons: Record<string, string> = {
      walking: '🚶',
      driving: '🚗',
      public_transit: '🚇',
      flight: '✈️',
      train: '🚂',
      taxi: '🚕',
      bike: '🚲',
    };
    return icons[mode] || '🚶';
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{activity.time}</Text>
        {activity.duration && (
          <Text style={styles.duration}>({activity.duration})</Text>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.description}>{activity.description}</Text>

        {activity.location && (
          <View style={styles.locationContainer}>
            <Text style={styles.location}>
              📍 {activity.location.name}
            </Text>
            {activity.location.address && (
              <Text style={styles.address}>{activity.location.address}</Text>
            )}
          </View>
        )}

        {activity.location?.coordinates && (
          <MapPreview
            latitude={activity.location.coordinates.latitude}
            longitude={activity.location.coordinates.longitude}
            title={activity.location.name}
          />
        )}

        {activity.transport && (
          <View style={styles.transportContainer}>
            <Text style={styles.transportTitle}>
              {getTransportIcon(activity.transport.mode)} Getting there
            </Text>
            <Text style={styles.transportDetails}>
              {activity.transport.mode.replace('_', ' ').toUpperCase()}
              {activity.transport.duration && ` • ${activity.transport.duration}`}
              {activity.transport.cost && ` • ${activity.transport.cost}`}
            </Text>
            {activity.transport.details && (
              <Text style={styles.transportExtra}>{activity.transport.details}</Text>
            )}
          </View>
        )}

        {activity.cost && (
          <Text style={styles.cost}>💰 {activity.cost}</Text>
        )}

        {activity.photo && (
          <Image source={{ uri: activity.photo }} style={styles.photo} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeContainer: {
    width: 80,
    paddingRight: 12,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  duration: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  address: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  transportContainer: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ffc107',
  },
  transportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  transportDetails: {
    fontSize: 13,
    color: '#666',
  },
  transportExtra: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  cost: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
    marginTop: 8,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
  },
});
