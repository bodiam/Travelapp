# AI Travel Itinerary App

A mobile application that uses AI to create personalized travel itineraries. Built with React Native and powered by OpenAI's ChatGPT, this app generates comprehensive day-by-day travel plans including activities, accommodations, transportation, dining suggestions, photos, and interactive maps. All itineraries are automatically saved locally for offline access.

## Features

- **AI-Powered Itinerary Generation**: Uses OpenAI's ChatGPT (GPT-4) to create detailed, personalized travel plans with rich, descriptive content
- **Beautiful Photo Integration**: Automatically fetches stunning photos from Unsplash for:
  - Destination galleries
  - Individual activities
  - Accommodations
- **Local Storage**: All itineraries are automatically saved to your device for offline access
- **Saved Itineraries**: View, manage, and revisit your past travel plans
- **Interactive Maps**: View locations of activities and accommodations on integrated maps
- **Detailed Daily Plans**: Get hour-by-hour breakdowns with:
  - Activities and attractions with vivid descriptions
  - Transportation recommendations (walking, driving, public transit, etc.)
  - Hotel and accommodation suggestions with photos
  - Restaurant and dining recommendations
  - Estimated costs and durations
- **Customizable Preferences**: Select your budget (budget/moderate/luxury) and pace (relaxed/moderate/packed)
- **Cross-Platform**: Works on both iOS and Android devices

## Screenshots

The app includes:
- Clean, intuitive home screen for entering destination and dates
- Saved itineraries browser for quick access to past trips
- Photo gallery showcasing your destination
- Day-by-day itinerary view with tabs
- Detailed activity cards with times, rich descriptions, locations, and photos
- Accommodation recommendations with amenities and photos
- Transportation details between activities
- Dining suggestions for each meal

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **OpenAI ChatGPT** (GPT-4) for itinerary generation
- **Unsplash API** for destination, activity, and accommodation photos
- **Google Maps** / React Native Maps for location visualization
- **AsyncStorage** for local data persistence
- **openai** npm package for AI integration
- **Axios** for HTTP requests

## Prerequisites

Before you begin, ensure you have:

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- An Expo account (for running on physical devices)
- iOS Simulator (Mac only) or Android Emulator

## Required API Keys

You'll need to obtain the following API keys:

1. **OpenAI API Key** (Required)
   - Sign up at: https://platform.openai.com/
   - Navigate to API Keys section
   - Create a new API key
   - This is used for AI-powered itinerary generation with ChatGPT

2. **Unsplash Access Key** (Required)
   - Create a developer account at: https://unsplash.com/developers
   - Create a new application
   - Copy your Access Key
   - This is used to fetch destination photos

3. **Google Maps API Key** (Required for maps)
   - Go to: https://console.cloud.google.com/
   - Create a new project or select existing one
   - Enable "Maps SDK for Android" and "Maps SDK for iOS"
   - Create credentials (API Key)
   - This is used for displaying maps

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Travelapp
```

2. Install dependencies:
```bash
npm install
```

3. Configure your API keys:

Copy the example config file and add your API keys:

```bash
cp src/config/env.example.ts src/config/env.ts
```

Then open `src/config/env.ts` and replace the placeholder values with your actual API keys:

```typescript
export const ENV = {
  OPENAI_API_KEY: 'sk-...',  // Your OpenAI API key
  UNSPLASH_ACCESS_KEY: 'abc123...',  // Your Unsplash Access Key
  GOOGLE_MAPS_API_KEY: 'AIza...',  // Your Google Maps API key
};
```

**Important**: The `env.ts` file is in `.gitignore` to prevent accidentally committing your API keys. The `env.example.ts` file is provided as a template.

4. For Google Maps on Android, add your API key to `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```

## Running the App

### Development Mode

Start the Expo development server:

```bash
npm start
```

or

```bash
npx expo start
```

This will open the Expo Developer Tools in your browser.

### Running on Physical Device

1. Install the Expo Go app on your device:
   - iOS: Download from App Store
   - Android: Download from Google Play Store

2. Scan the QR code shown in the terminal or Expo Developer Tools

### Running on Simulator/Emulator

- **iOS Simulator** (Mac only):
  ```bash
  npm run ios
  ```

- **Android Emulator**:
  ```bash
  npm run android
  ```

## Usage

1. **Enter Destination**: Type in your desired travel destination (e.g., "Paris", "Tokyo", "New York")

2. **Select Dates**: Choose your start and end dates for the trip

3. **Set Preferences**:
   - Budget: Choose between Budget, Moderate, or Luxury
   - Pace: Select Relaxed, Moderate, or Packed itinerary

4. **Generate Itinerary**: Tap the "Generate Itinerary" button and wait while AI creates your personalized travel plan

5. **Explore Your Itinerary**:
   - View destination photos
   - Navigate through each day using the day selector
   - See detailed activities with times and descriptions
   - View accommodation recommendations
   - Check transportation options between activities
   - Get dining suggestions for each meal

6. **Start Over**: Tap the "Back" button to create a new itinerary

## Project Structure

```
Travelapp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ActivityCard.tsx
│   │   ├── AccommodationCard.tsx
│   │   ├── MapPreview.tsx
│   │   └── PhotoGallery.tsx
│   ├── screens/            # Main app screens
│   │   ├── HomeScreen.tsx
│   │   └── ItineraryScreen.tsx
│   ├── services/           # API integrations
│   │   ├── aiService.ts
│   │   └── photoService.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   └── config/             # Configuration files
│       └── env.ts
├── App.tsx                 # Main app component
├── package.json
├── tsconfig.json
└── README.md
```

## Key Components

### HomeScreen
The initial screen where users enter their travel details and preferences.

### ItineraryScreen
Displays the generated itinerary with day-by-day breakdown.

### ActivityCard
Shows individual activities with time, description, location, cost, and transport details.

### AccommodationCard
Displays hotel/accommodation recommendations with amenities and pricing.

### MapPreview
Embeds Google Maps to show activity and accommodation locations.

### PhotoGallery
Displays a horizontal scrollable gallery of destination photos.

## API Services

### aiService.ts
Integrates with Claude AI to generate comprehensive travel itineraries based on user input.

### photoService.ts
Fetches high-quality destination photos from Unsplash API.

## Type Definitions

The app uses TypeScript interfaces for:
- `TravelItinerary`: Complete itinerary structure
- `DayItinerary`: Single day breakdown
- `Activity`: Individual activities
- `Accommodation`: Hotel/lodging information
- `Transport`: Transportation details
- `Meal`: Dining suggestions
- `Location`: Geographic information

## Troubleshooting

### API Key Issues
- Make sure all API keys are correctly entered in `src/config/env.ts`
- Check that your API keys are active and have proper permissions
- Anthropic API requires a paid account for API access

### Network Errors
- Ensure your device/simulator has internet connection
- Check if API services are operational
- Verify firewall settings aren't blocking requests

### Map Display Issues
- Ensure Google Maps API key is properly configured
- Check that Maps SDK is enabled in Google Cloud Console
- For Android, verify the key is added to `app.json`

### Build Errors
- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Update Expo: `npm install expo@latest`

## Future Enhancements

Potential features to add:
- Save/export itineraries as PDF
- User authentication and saved itineraries
- Sharing itineraries with others
- Real-time weather integration
- Booking integration for hotels and flights
- Offline mode for viewing saved itineraries
- Multiple language support
- Budget tracking during the trip

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Claude AI by Anthropic for itinerary generation
- Unsplash for beautiful destination photography
- Google Maps for location services
- Expo and React Native communities

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

Happy travels! 🌍✈️
