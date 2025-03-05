"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Updated import
import Weather from "@/components/Weather";
import FinancialData from "@/components/FinancialData";
import CovidData from "@/components/CovidData";
import NewsHeadlines from "@/components/NewsHeadlines";

const DashboardPage: React.FC = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter(); // Updated useRouter

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        router.push("/login");
        return;
      }
  
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/users/protected",
          {}, // Empty body (if no data is required)
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setData(response.data);
        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          console.error("Backend Error:", err.response.data); // Log the backend error response
        } else {
          if (err instanceof Error) {
            console.error("Error:", err.message); // Log the error message
          } else {
            console.error("Unexpected error", err);
          }
        }
        setError("Failed to fetch data");
        setLoading(false);
        router.push("/login");
      }
    };
  
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav>
          <ul>
            <li className="mb-2"><a href="/dashboard" className="block p-2">Dashboard</a></li>
            <li className="mb-2"><a href="/profile" className="block p-2">Profile</a></li>
            <li className="mb-2"><a href="/admin" className="block p-2">Admin</a></li>
            <li className="mb-2"><a href="/logout" className="block p-2">Logout</a></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <h1 className="text-2xl mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">Summary Card 1</div>
          <div className="bg-white p-4 rounded shadow">Summary Card 2</div>
          <div className="bg-white p-4 rounded shadow">Summary Card 3</div>
          <Weather />
          <FinancialData />
          <CovidData />
          {/* <NewsHeadlines /> */}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;