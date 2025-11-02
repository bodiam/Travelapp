import Anthropic from '@anthropic-ai/sdk';
import { ENV } from '../config/env';
import { TravelRequest, TravelItinerary } from '../types';

const anthropic = new Anthropic({
  apiKey: ENV.ANTHROPIC_API_KEY,
});

export const generateItinerary = async (
  request: TravelRequest
): Promise<TravelItinerary> => {
  const { destination, startDate, endDate, preferences } = request;

  const numberOfDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const prompt = `You are a professional travel planner. Create a detailed ${numberOfDays}-day travel itinerary for ${destination}.

Travel Details:
- Destination: ${destination}
- Start Date: ${startDate.toLocaleDateString()}
- End Date: ${endDate.toLocaleDateString()}
- Duration: ${numberOfDays} days
${preferences?.budget ? `- Budget: ${preferences.budget}` : ''}
${preferences?.interests?.length ? `- Interests: ${preferences.interests.join(', ')}` : ''}
${preferences?.pace ? `- Pace: ${preferences.pace}` : ''}

Please create a comprehensive itinerary with the following structure in JSON format:

{
  "destination": "${destination}",
  "startDate": "${startDate.toISOString()}",
  "endDate": "${endDate.toISOString()}",
  "summary": "A brief 2-3 sentence overview of the trip",
  "estimatedBudget": "Total estimated budget range",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Day title (e.g., 'Arrival and City Exploration')",
      "activities": [
        {
          "time": "HH:MM AM/PM",
          "title": "Activity name",
          "description": "Detailed description",
          "location": {
            "name": "Location name",
            "address": "Full address if known"
          },
          "duration": "Estimated duration",
          "cost": "Estimated cost",
          "transport": {
            "mode": "walking|driving|public_transit|flight|train|taxi|bike",
            "duration": "Travel time",
            "cost": "Transport cost",
            "details": "Additional details"
          }
        }
      ],
      "accommodation": {
        "name": "Hotel/accommodation name",
        "type": "hotel|hostel|airbnb|resort",
        "address": "Full address",
        "priceRange": "Price per night",
        "amenities": ["amenity1", "amenity2"]
      },
      "meals": [
        {
          "type": "breakfast|lunch|dinner|snack",
          "suggestion": "Restaurant or meal recommendation",
          "location": "Location",
          "priceRange": "Price range"
        }
      ]
    }
  ]
}

Important guidelines:
1. Include realistic times and durations for all activities
2. Suggest appropriate transportation between locations
3. Include hotel/accommodation recommendations for each night
4. Suggest specific restaurants or dining options
5. Consider travel time between activities
6. Make the itinerary practical and achievable
7. Include a mix of popular attractions and local experiences
8. Consider opening hours and realistic scheduling

Return ONLY the JSON object, no additional text or markdown formatting.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Clean the response to extract JSON
    let jsonText = responseText.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }

    const itinerary: TravelItinerary = JSON.parse(jsonText);
    return itinerary;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error('Failed to generate itinerary. Please try again.');
  }
};
