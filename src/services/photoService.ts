import axios from 'axios';
import { ENV } from '../config/env';

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
