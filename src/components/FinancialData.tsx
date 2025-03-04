import React, { useEffect, useState } from 'react';
import { fetchFinancialData } from '../utils/api';

const FinancialData: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchFinancialData('AAPL');
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
    return <div>Error loading financial data</div>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl mb-2">Financial Data for AAPL</h2>
      {/* Render financial data here */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default FinancialData;