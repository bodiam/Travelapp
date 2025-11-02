import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { TravelItinerary } from '../types';

// Generate HTML for PDF
const generatePDFHTML = (itinerary: TravelItinerary): string => {
  const transportIcon = (mode: string) => {
    const icons: Record<string, string> = {
      walking: '🚶',
      driving: '🚗',
      public_transit: '🚇',
      flight: '✈️',
      train: '🚂',
      taxi: '🚕',
      bike: '🚲',
    };
    return icons[mode] || '🚶';
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 20px;
      background: #fff;
    }

    .header {
      text-align: center;
      padding: 30px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 10px;
      margin-bottom: 30px;
    }

    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
      font-weight: bold;
    }

    .header .dates {
      font-size: 18px;
      opacity: 0.9;
    }

    .summary {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border-left: 4px solid #667eea;
    }

    .summary p {
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 10px;
    }

    .budget {
      font-size: 16px;
      color: #28a745;
      font-weight: 600;
    }

    .day-section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }

    .day-header {
      background: #667eea;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .day-header h2 {
      font-size: 24px;
      margin-bottom: 5px;
    }

    .day-header .date {
      font-size: 14px;
      opacity: 0.9;
    }

    .accommodation {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .accommodation h3 {
      font-size: 20px;
      color: #333;
      margin-bottom: 10px;
    }

    .accommodation .type {
      color: #666;
      font-size: 14px;
      text-transform: capitalize;
    }

    .accommodation .details {
      margin-top: 10px;
      font-size: 14px;
      line-height: 1.8;
    }

    .accommodation .amenities {
      margin-top: 10px;
      font-size: 13px;
      color: #666;
    }

    .accommodation img {
      width: 100%;
      max-width: 500px;
      height: auto;
      border-radius: 8px;
      margin-top: 10px;
    }

    .activities {
      margin-bottom: 20px;
    }

    .activities h3 {
      font-size: 20px;
      margin-bottom: 15px;
      color: #333;
    }

    .activity {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      page-break-inside: avoid;
    }

    .activity .time {
      color: #667eea;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .activity .title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #333;
    }

    .activity .description {
      font-size: 14px;
      line-height: 1.8;
      color: #555;
      margin-bottom: 10px;
    }

    .activity .location {
      background: #f8f9fa;
      padding: 10px;
      border-radius: 6px;
      margin: 10px 0;
      font-size: 13px;
    }

    .activity .info {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-top: 10px;
      font-size: 13px;
    }

    .activity .info-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .activity img {
      width: 100%;
      max-width: 500px;
      height: auto;
      border-radius: 8px;
      margin-top: 10px;
    }

    .transport {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      padding: 10px;
      border-radius: 6px;
      margin-top: 10px;
      font-size: 13px;
    }

    .meals {
      margin-top: 20px;
    }

    .meals h3 {
      font-size: 18px;
      margin-bottom: 10px;
      color: #333;
    }

    .meal {
      background: #f8f9fa;
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .meal .meal-type {
      font-weight: 600;
      color: #667eea;
      text-transform: capitalize;
    }

    .footer {
      text-align: center;
      margin-top: 40px;
      padding: 20px;
      color: #666;
      font-size: 14px;
      border-top: 2px solid #e0e0e0;
    }

    .icon {
      margin-right: 5px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>✈️ ${itinerary.destination}</h1>
    <div class="dates">
      ${new Date(itinerary.startDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })} - ${new Date(itinerary.endDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}
    </div>
  </div>

  <div class="summary">
    <p>${itinerary.summary}</p>
    ${itinerary.estimatedBudget ? `<p class="budget">💰 Estimated Budget: ${itinerary.estimatedBudget}</p>` : ''}
  </div>

  ${itinerary.days
    .map(
      (day) => `
    <div class="day-section">
      <div class="day-header">
        <h2>Day ${day.day} - ${day.title}</h2>
        <div class="date">${new Date(day.date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}</div>
      </div>

      ${
        day.accommodation
          ? `
      <div class="accommodation">
        <h3>🏨 ${day.accommodation.name}</h3>
        <div class="type">${day.accommodation.type}</div>
        <div class="details">
          <div>📍 ${day.accommodation.address}</div>
          <div>💵 ${day.accommodation.priceRange}</div>
          ${
            day.accommodation.amenities && day.accommodation.amenities.length > 0
              ? `<div class="amenities">Amenities: ${day.accommodation.amenities.join(', ')}</div>`
              : ''
          }
        </div>
        ${day.accommodation.photo ? `<img src="${day.accommodation.photo}" alt="${day.accommodation.name}" />` : ''}
      </div>
      `
          : ''
      }

      <div class="activities">
        <h3>📍 Activities</h3>
        ${day.activities
          .map(
            (activity) => `
          <div class="activity">
            <div class="time">${activity.time}${activity.duration ? ` • ${activity.duration}` : ''}</div>
            <div class="title">${activity.title}</div>
            <div class="description">${activity.description}</div>

            ${
              activity.location
                ? `
              <div class="location">
                📍 ${activity.location.name}
                ${activity.location.address ? `<br/>${activity.location.address}` : ''}
              </div>
            `
                : ''
            }

            ${activity.photo ? `<img src="${activity.photo}" alt="${activity.title}" />` : ''}

            <div class="info">
              ${activity.cost ? `<div class="info-item">💰 ${activity.cost}</div>` : ''}
            </div>

            ${
              activity.transport
                ? `
              <div class="transport">
                <strong>${transportIcon(activity.transport.mode)} Getting There:</strong>
                ${activity.transport.mode.replace('_', ' ').toUpperCase()}
                ${activity.transport.duration ? ` • ${activity.transport.duration}` : ''}
                ${activity.transport.cost ? ` • ${activity.transport.cost}` : ''}
                ${activity.transport.details ? `<br/>${activity.transport.details}` : ''}
              </div>
            `
                : ''
            }
          </div>
        `
          )
          .join('')}
      </div>

      ${
        day.meals && day.meals.length > 0
          ? `
      <div class="meals">
        <h3>🍽️ Dining Suggestions</h3>
        ${day.meals
          .map(
            (meal) => `
          <div class="meal">
            <span class="meal-type">${meal.type}:</span> ${meal.suggestion}
            ${meal.location ? `<br/>📍 ${meal.location}` : ''}
            ${meal.priceRange ? `<br/>💵 ${meal.priceRange}` : ''}
          </div>
        `
          )
          .join('')}
      </div>
      `
          : ''
      }
    </div>
  `
    )
    .join('')}

  <div class="footer">
    <p>Created with AI Travel Planner 🌍✈️</p>
    <p>Have an amazing trip!</p>
  </div>
</body>
</html>
  `;
};

// Generate and share PDF
export const shareItineraryAsPDF = async (itinerary: TravelItinerary): Promise<void> => {
  try {
    const html = generatePDFHTML(itinerary);

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    console.log('PDF generated at:', uri);

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Error', 'Sharing is not available on this device');
      return;
    }

    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `${itinerary.destination} Travel Itinerary`,
      UTI: 'com.adobe.pdf',
    });

    console.log('PDF shared successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    Alert.alert('Error', 'Failed to generate PDF. Please try again.');
  }
};
