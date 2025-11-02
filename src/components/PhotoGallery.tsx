import React from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface PhotoGalleryProps {
  photos: string[];
}

const { width } = Dimensions.get('window');
const PHOTO_WIDTH = width - 24;

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {photos.map((photo, index) => (
        <Image
          key={index}
          source={{ uri: photo }}
          style={styles.photo}
          resizeMode="cover"
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 250,
  },
  photo: {
    width: PHOTO_WIDTH,
    height: 250,
    marginHorizontal: 12,
    borderRadius: 12,
  },
});
