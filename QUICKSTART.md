# Quick Start Guide

Get the AI Travel Planner app running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Get Your API Keys

You need 3 API keys:

### Anthropic API Key (Required)
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy it

### Unsplash Access Key (Required)
1. Go to https://unsplash.com/developers
2. Sign up or log in
3. Click "New Application"
4. Accept the terms
5. Fill in the application details
6. Copy your Access Key

### Google Maps API Key (Required)
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable "Maps SDK for Android" and "Maps SDK for iOS"
4. Go to Credentials
5. Create an API Key
6. Copy it

## Step 3: Configure API Keys

Create your config file:

```bash
cp src/config/env.example.ts src/config/env.ts
```

Edit `src/config/env.ts` and paste your API keys:

```typescript
export const ENV = {
  ANTHROPIC_API_KEY: 'sk-ant-...',  // Your Anthropic key
  UNSPLASH_ACCESS_KEY: 'abc123...',  // Your Unsplash key
  GOOGLE_MAPS_API_KEY: 'AIza...',    // Your Google Maps key
};
```

Also update `app.json` with your Google Maps key:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
    }
  }
}
```

## Step 4: Run the App

Start the development server:

```bash
npm start
```

Then choose your platform:
- Press `i` for iOS simulator (Mac only)
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Step 5: Create Your First Itinerary

1. Enter a destination (e.g., "Paris, France")
2. Select your travel dates
3. Choose budget and pace preferences
4. Tap "Generate Itinerary"
5. Wait 10-30 seconds for AI to create your plan
6. Browse your personalized travel itinerary!

## Troubleshooting

### "API key missing" error
- Check that you copied the API keys correctly to `src/config/env.ts`
- Make sure there are no extra spaces or quotes
- Verify the file is saved

### App won't start
```bash
# Clear cache and restart
npx expo start -c
```

### Maps not showing
- Verify Google Maps API key is in both `src/config/env.ts` and `app.json`
- Check that Maps SDK is enabled in Google Cloud Console

### Photos not loading
- Check your Unsplash API key
- Verify you're using the Access Key, not the Secret Key

### Itinerary generation fails
- Ensure your Anthropic API key is valid
- Check that you have credits/quota available
- Look for error messages in the console

## What's Next?

- Explore different destinations
- Try different budget and pace settings
- Check out the day-by-day breakdown
- View locations on the map
- Browse destination photos

## Need Help?

- Check the full README.md for detailed documentation
- Review error messages in the console
- Verify all API keys are correctly configured

Happy travels! 🌍✈️
