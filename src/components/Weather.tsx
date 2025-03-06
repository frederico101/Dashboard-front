import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Wind, Droplet, Sun, CloudSun, Thermometer } from 'lucide-react';

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWeather = async () => {
      try {
        const data = await fetchWeatherData('London');
        console.log("data => ", data)
        setWeather(data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, []);

  // Helper function to format time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Determine weather icon based on condition
  const getWeatherIcon = (description: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'clear sky': <Sun className="w-12 h-12 text-yellow-500" />,
      'few clouds': <CloudSun className="w-12 h-12 text-blue-400" />,
      'scattered clouds': <CloudSun className="w-12 h-12 text-gray-400" />,
      'broken clouds': <CloudSun className="w-12 h-12 text-gray-500" />,
      'shower rain': <Droplet className="w-12 h-12 text-blue-600" />,
      'rain': <Droplet className="w-12 h-12 text-blue-700" />,
      'thunderstorm': <CloudSun className="w-12 h-12 text-gray-700" />,
      'snow': <Droplet className="w-12 h-12 text-white" />,
      'mist': <CloudSun className="w-12 h-12 text-gray-300" />
    };

    return iconMap[description.toLowerCase()] || <CloudSun className="w-12 h-12 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-600 animate-pulse">Loading weather data...</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error || 'Error loading weather data'}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          Weather in {weather.name}, {weather.sys.country}
        </CardTitle>
        {getWeatherIcon(weather.weather[0].description)}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Thermometer className="w-6 h-6 text-red-500" />
            <div>
              <p className="text-sm font-medium">Temperature</p>
              <p className="text-lg font-bold">{weather.main.temp.toFixed(1)}°C</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Droplet className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Humidity</p>
              <p className="text-lg font-bold">{weather.main.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm font-medium">Wind Speed</p>
              <p className="text-lg font-bold">{weather.wind.speed} m/s</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sun className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">Sunrise</p>
              <p className="text-lg font-bold">{formatTime(weather.sys.sunrise)}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 capitalize">
            {weather.weather[0].description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Weather;