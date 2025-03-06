import React, { useEffect, useState } from 'react';
import { fetchCovidData } from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertCircle,
  ActivityIcon, 
  HeartPulse, 
  Skull 
} from 'lucide-react';

// Typescript interface for COVID data
interface CovidData {
  country: string;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
  critical: number;
}

const CovidData: React.FC = () => {
  const [data, setData] = useState<CovidData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedData = await fetchCovidData('USA');
        setData(fetchedData);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch COVID-19 data');
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  // Determine color based on severity
  const getSeverityColor = (value: number, type: 'cases' | 'deaths') => {
    if (type === 'cases') {
      return value > 1000000 ? 'text-red-600' : 
             value > 100000 ? 'text-orange-600' : 
             'text-yellow-600';
    }
    return value > 50000 ? 'text-black font-bold' : 
           value > 10000 ? 'text-gray-700' : 
           'text-gray-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-600 animate-pulse flex items-center">
          <AlertCircle className="mr-2 animate-spin" /> 
          Loading COVID-19 data...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error || 'Error loading COVID-19 data'}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          COVID-19 Statistics: {data.country}
        </CardTitle>
        <AlertCircle className="w-8 h-8 text-red-500" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <ActivityIcon className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Total Cases</p>
              <p className={`text-lg font-bold ${getSeverityColor(data.cases, 'cases')}`}>
                {formatNumber(data.cases)}
              </p>
              <p className="text-xs text-green-600">
                +{formatNumber(data.todayCases)} today
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Skull className="w-6 h-6 text-red-500" />
            <div>
              <p className="text-sm font-medium">Deaths</p>
              <p className={`text-lg font-bold ${getSeverityColor(data.deaths, 'deaths')}`}>
                {formatNumber(data.deaths)}
              </p>
              <p className="text-xs text-red-600">
                +{formatNumber(data.todayDeaths)} today
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <HeartPulse className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm font-medium">Recovered</p>
              <p className="text-lg font-bold text-green-600">
                {formatNumber(data.recovered)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">Active Cases</p>
              <p className="text-lg font-bold text-yellow-600">
                {formatNumber(data.active)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CovidData;

// import React, { useEffect, useState } from "react";
// import { fetchCovidData } from "../utils/api";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import { Card, CardContent } from "@/components/ui/card";
// import DatePickerComponent from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

// const CovidGraph: React.FC = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
//   const [metric, setMetric] = useState("cases");

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const result = await fetchCovidData("USA");
//         setData(result.timeline); // Supondo que os dados venham como timeline
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getData();
//   }, []);

//   const filteredData = data.filter((entry) => {
//     const entryDate = new Date(entry.date);
//     return (
//       (!dateRange.start || entryDate >= dateRange.start) &&
//       (!dateRange.end || entryDate <= dateRange.end)
//     );
//   });

//   return (
//     <Card>
//       <CardContent>
//         <h2 className="text-xl mb-4">COVID-19 Statistics for USA</h2>
//         <div className="flex gap-4 mb-4">
//           <DatePickerComponent
//             selected={dateRange.start}
//             onChange={(date) => setDateRange({ ...dateRange, start: date })}
//             placeholderText="Start Date"
//           />
//           <DatePickerComponent
//             selected={dateRange.end}
//             onChange={(date) => setDateRange({ ...dateRange, end: date })}
//             placeholderText="End Date"
//           />
//           <Select value={metric} onValueChange={setMetric}>
//             <SelectTrigger>
//               <button className="p-2 border rounded">Select Metric</button>
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="cases">Cases</SelectItem>
//               <SelectItem value="deaths">Deaths</SelectItem>
//               <SelectItem value="recovered">Recovered</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart data={filteredData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey={metric} stroke="#8884d8" />
//             </LineChart>
//           </ResponsiveContainer>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default CovidGraph;