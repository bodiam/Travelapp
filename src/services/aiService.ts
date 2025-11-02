import OpenAI from 'openai';
import { ENV } from '../config/env';
import { TravelRequest, TravelItinerary } from '../types';

const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
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

Please create a comprehensive itinerary with the following structure in JSON format.

IMPORTANT: For photos, use Unsplash Source URLs in this format:
- Destination photos: https://source.unsplash.com/800x600/?${destination.toLowerCase().replace(/\s+/g, ',')}
- Activity photos: https://source.unsplash.com/800x600/?ACTIVITY_NAME (replace ACTIVITY_NAME with the activity, e.g., "eiffel,tower")
- Accommodation photos: https://source.unsplash.com/800x600/?hotel,CITY (replace CITY with destination)

{
  "destination": "${destination}",
  "startDate": "${startDate.toISOString()}",
  "endDate": "${endDate.toISOString()}",
  "summary": "A brief 2-3 sentence overview of the trip with engaging descriptions",
  "estimatedBudget": "Total estimated budget range",
  "photos": [
    "https://source.unsplash.com/800x600/?${destination.toLowerCase().replace(/\s+/g, ',')}",
    "https://source.unsplash.com/800x600/?${destination.toLowerCase().replace(/\s+/g, ',')},landmark",
    "https://source.unsplash.com/800x600/?${destination.toLowerCase().replace(/\s+/g, ',')},architecture",
    "https://source.unsplash.com/800x600/?${destination.toLowerCase().replace(/\s+/g, ',')},culture",
    "https://source.unsplash.com/800x600/?${destination.toLowerCase().replace(/\s+/g, ',')},food"
  ],
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Day title (e.g., 'Arrival and City Exploration')",
      "activities": [
        {
          "time": "HH:MM AM/PM",
          "title": "Activity name",
          "description": "Detailed, vivid description of the activity (at least 2-3 sentences describing what makes this special, what to expect, and why it's worth visiting)",
          "location": {
            "name": "Location name",
            "address": "Full address if known"
          },
          "duration": "Estimated duration",
          "cost": "Estimated cost",
          "photo": "https://source.unsplash.com/800x600/?ACTIVITY_KEYWORDS",
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
        "amenities": ["amenity1", "amenity2"],
        "photo": "https://source.unsplash.com/800x600/?hotel,DESTINATION"
      },
      "meals": [
        {
          "type": "breakfast|lunch|dinner|snack",
          "suggestion": "Restaurant or meal recommendation with description",
          "location": "Location",
          "priceRange": "Price range"
        }
      ]
    }
  ]
}

IMPORTANT GUIDELINES:
1. Include realistic times and durations for all activities
2. Provide DETAILED, DESCRIPTIVE text for each activity (2-3 sentences minimum)
3. Make descriptions vivid and engaging - describe the experience, atmosphere, and what makes each place special
4. Suggest appropriate transportation between locations
5. Include hotel/accommodation recommendations for each night
6. Suggest specific restaurants or dining options with descriptions
7. Consider travel time between activities
8. Make the itinerary practical and achievable
9. Include a mix of popular attractions and local experiences
10. Consider opening hours and realistic scheduling

Return ONLY the JSON object, no additional text or markdown formatting.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert travel planner who creates detailed, engaging itineraries with vivid descriptions. Always provide comprehensive details and make every description rich and informative.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const responseText = completion.choices[0].message.content || '';

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
    throw new Error('Failed to generate itinerary. Please check your API key and try again.');
  }
};
