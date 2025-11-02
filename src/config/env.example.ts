// Copy this file to env.ts and replace with your actual API keys

export const ENV = {
  ANTHROPIC_API_KEY: 'your_anthropic_api_key_here',
  UNSPLASH_ACCESS_KEY: 'your_unsplash_access_key_here',
  GOOGLE_MAPS_API_KEY: 'your_google_maps_api_key_here',
};

// Validation function to check if required API keys are set
export const validateEnv = () => {
  const missingKeys = [];

  if (!ENV.ANTHROPIC_API_KEY || ENV.ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
    missingKeys.push('ANTHROPIC_API_KEY');
  }
  if (!ENV.UNSPLASH_ACCESS_KEY || ENV.UNSPLASH_ACCESS_KEY === 'your_unsplash_access_key_here') {
    missingKeys.push('UNSPLASH_ACCESS_KEY');
  }
  if (!ENV.GOOGLE_MAPS_API_KEY || ENV.GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here') {
    missingKeys.push('GOOGLE_MAPS_API_KEY');
  }

  if (missingKeys.length > 0) {
    console.warn(
      `Missing API keys: ${missingKeys.join(', ')}. ` +
      'Please add them to src/config/env.ts for the app to work properly.'
    );
  }

  return missingKeys.length === 0;
};
