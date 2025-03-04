// filepath: /C:/Users/fredy/Documents/slashDev/Test/next/front/src/utils/api.ts
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

const DISEASE_SH_API_URL = process.env.NEXT_PUBLIC_DISEASE_SH_API_URL;

export const fetchWeatherData = async (city: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchFinancialData = async (symbol: string) => {
    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching financial data:', error);
      throw error;
    }
  };


export const fetchCovidData = async (country: string) => {
  try {
    const response = await axios.get(`${DISEASE_SH_API_URL}/countries/${country}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching COVID-19 data:', error);
    throw error;
  }
};

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export const fetchNewsHeadlines = async (country: string) => {
  try {
    const response = await axios.get(`${NEWS_API_BASE_URL}/top-headlines`, {
      params: {
        country: country,
        apiKey: NEWS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news headlines:', error);
    throw error;
  }
};