import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const BitcoinPrice: React.FC = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        console.log("Bitcoin Price Data:", data);
        setPrice(data.bitcoin.usd);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch Bitcoin price data');
      } finally {
        setLoading(false);
      }
    };

    fetchBitcoinPrice();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-600 animate-pulse">Loading Bitcoin price...</p>
      </div>
    );
  }

  if (error || price === null) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error || 'Error loading Bitcoin price'}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">Bitcoin Price</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-3xl font-bold text-green-500">${price.toLocaleString()}</p>
        <p className="text-sm text-gray-500">Current price in USD</p>
      </CardContent>
    </Card>
  );
};

export default BitcoinPrice;
