import React, { useEffect, useState } from 'react';
import { fetchCovidData } from '../utils/api';

const CovidData: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchCovidData('USA');
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Error loading COVID-19 data</div>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl mb-2">COVID-19 Statistics for {data.country}</h2>
      <p>Cases: {data.cases}</p>
      <p>Deaths: {data.deaths}</p>
      <p>Recovered: {data.recovered}</p>
    </div>
  );
};

export default CovidData;