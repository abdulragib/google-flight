import axios, { AxiosError } from 'axios';

const API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const API_HOST = import.meta.env.VITE_RAPID_API_HOST;

if (!API_KEY || !API_HOST) {
  throw new Error('Missing API configuration. Please check your environment variables.');
}

const api = axios.create({
  baseURL: 'https://sky-scrapper.p.rapidapi.com/api',
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST,
  },
});

export const searchAirports = async (query: string) => {
  try {
    if (!query || query.trim().length < 2) {
      return { airports: [] };
    }

    const response = await api.get('/v1/flights/searchAirport', {
      params: {
        query: query.trim(),
        locale: 'en-US',
      },
    });

    // console.log("airports response data", response.data);
    
    // Ensure response.data exists and contains valid airport data
    if (!response.data || !Array.isArray(response.data.data)) {
      return { airports: [] };
    }

    return {
      airports: response.data.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }
      if (axiosError.response?.status === 401) {
        throw new Error('API key is invalid or expired.');
      }
    }
    console.error('Error searching airports:', error);
    throw new Error('Failed to search airports. Please try again.');
  }
};


export const searchFlights = async (params: {
  originSkyId: string;
  destinationSkyId: string;
  date: string;
  adults: number;
  cabinClass: string;
  originEntityId: string;
  destinationEntityId: string,
}) => {
  try {
    const response = await api.get('/v2/flights/searchFlights', {
      params: {
        ...params,
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US',
        sortBy: 'best',
      },
    });

    // console.log("flight response data", response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }
      if (axiosError.response?.status === 401) {
        throw new Error('API key is invalid or expired.');
      }
    }
    console.error('Error searching flights:', error);
    throw new Error('Failed to search flights. Please try again.');
  }
};