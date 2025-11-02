export interface TravelItinerary {
  destination: string;
  startDate: string;
  endDate: string;
  days: DayItinerary[];
  summary: string;
  estimatedBudget?: string;
  photos?: string[];
}

export interface DayItinerary {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
  accommodation?: Accommodation;
  meals?: Meal[];
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location?: Location;
  duration?: string;
  cost?: string;
  transport?: Transport;
  photo?: string;
}

export interface Accommodation {
  name: string;
  type: string;
  address: string;
  priceRange: string;
  amenities: string[];
  location?: Location;
  photo?: string;
}

export interface Transport {
  mode: 'walking' | 'driving' | 'public_transit' | 'flight' | 'train' | 'taxi' | 'bike';
  duration?: string;
  cost?: string;
  details?: string;
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  suggestion: string;
  location?: string;
  priceRange?: string;
}

export interface Location {
  name: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface TravelRequest {
  destination: string;
  startDate: Date;
  endDate: Date;
  preferences?: {
    budget?: 'budget' | 'moderate' | 'luxury';
    interests?: string[];
    pace?: 'relaxed' | 'moderate' | 'packed';
  };
}
