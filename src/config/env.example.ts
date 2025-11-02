// Copy this file to env.ts and replace with your actual API keys

export const ENV = {
  OPENAI_API_KEY: 'your_openai_api_key_here',
  GOOGLE_MAPS_API_KEY: 'your_google_maps_api_key_here',
};

// Validation function to check if required API keys are set
export const validateEnv = () => {
  const missingKeys = [];

  if (!ENV.OPENAI_API_KEY || ENV.OPENAI_API_KEY === 'your_openai_api_key_here') {
    missingKeys.push('OPENAI_API_KEY');
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
