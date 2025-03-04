// filepath: /C:/Users/fredy/Documents/slashDev/Test/next/front/src/components/Weather.tsx
import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from '../utils/api';

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeather = async () => {
      try {
        const data = await fetchWeatherData('London');
        setWeather(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!weather) {
    return <div>Error loading weather data</div>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl mb-2">Weather in {weather.name}</h2>
      <p>Temperature: {weather.main.temp}°C</p>
      <p>Condition: {weather.weather[0].description}</p>
    </div>
  );
};

export default Weather;