import api from './api';
import { API_ENDPOINTS } from '../config/api';

let citiesCache = {
  // Default known cities
  55: { name: 'Jinja' } // From your data, city_id 52 is Kampala
};

// Function to get city details with retry logic
export const getCityDetails = async (cityId, userToken) => {
  // Return from cache if available
  if (citiesCache[cityId]) {
    return citiesCache[cityId];
  }

  try {
    // Add await here and properly structure the API call

    const response = await api.get(API_ENDPOINTS.CITIES.BY_ID.replace(':id', cityId));

    // Access response data directly (assuming your API returns data in this structure)
    if (response.data && response.data.success && response.data.result) {
      citiesCache[cityId] = response.data.result;
      return response.data.result;
    }
    return null;
  } catch (error) {
    console.warn(`Error fetching city ${cityId}:`, error.message);
    return null;
  }
};

// Rest of the code remains the same...
// Function to get just the city name
export const getCityName = async (cityId, userToken) => {
  try {
    const city = await getCityDetails(cityId, userToken);
    return city?.name || 'Unknown location';
  } catch (error) {
    console.warn(`Failed to get city name for ${cityId}:`, error);
    return 'Unknown location';
  }
};

// Modified preloadCities to only cache known cities
export const preloadCities = async (userToken) => {
  try {
    // Only preload the cities we know about (like Kampala)
    const knownCityIds = [52]; // Add more IDs if you know them

    await Promise.all(knownCityIds.map(id =>
      getCityDetails(id, userToken).catch(e => console.warn(`Failed to preload city ${id}:`, e))
    ));

    return true;
  } catch (error) {
    console.warn('Error in preloadCities:', error);
    return false;
  }
};

// Export all functions
export default {
  getCityDetails,
  getCityName,
  preloadCities
};