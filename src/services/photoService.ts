import axios from 'axios';
import { ENV } from '../config/env';
import { TravelItinerary } from '../types';

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  description: string | null;
  alt_description: string | null;
  user: {
    name: string;
  };
}

export const getDestinationPhotos = async (
  destination: string,
  count: number = 5
): Promise<string[]> => {
  try {
    const response = await axios.get<{ results: UnsplashPhoto[] }>(
      'https://api.unsplash.com/search/photos',
      {
        params: {
          query: destination,
          per_page: count,
          orientation: 'landscape',
        },
        headers: {
          Authorization: `Client-ID ${ENV.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    return response.data.results.map((photo) => photo.urls.regular);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
};

export const getActivityPhoto = async (query: string): Promise<string | undefined> => {
  try {
    const response = await axios.get<{ results: UnsplashPhoto[] }>(
      'https://api.unsplash.com/search/photos',
      {
        params: {
          query,
          per_page: 1,
          orientation: 'landscape',
        },
        headers: {
          Authorization: `Client-ID ${ENV.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (response.data.results.length > 0) {
      return response.data.results[0].urls.regular;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching activity photo:', error);
    return undefined;
  }
};

// Enhanced function to add photos to all activities and accommodations
export const enrichItineraryWithPhotos = async (
  itinerary: TravelItinerary,
  destination: string
): Promise<TravelItinerary> => {
  try {
    // Get destination photos
    const destinationPhotos = await getDestinationPhotos(destination, 5);
    itinerary.photos = destinationPhotos;

    // Add photos to activities and accommodations
    for (const day of itinerary.days) {
      // Add photos to activities
      for (const activity of day.activities) {
        if (!activity.photo) {
          // Create a search query combining activity title and destination
          const query = `${activity.title} ${destination}`;
          const photo = await getActivityPhoto(query);
          if (photo) {
            activity.photo = photo;
          }
        }
      }

      // Add photo to accommodation
      if (day.accommodation && !day.accommodation.photo) {
        const query = `${day.accommodation.type} ${destination}`;
        const photo = await getActivityPhoto(query);
        if (photo) {
          day.accommodation.photo = photo;
        }
      }
    }

    return itinerary;
  } catch (error) {
    console.error('Error enriching itinerary with photos:', error);
    return itinerary; // Return original itinerary if photo fetching fails
  }
};
